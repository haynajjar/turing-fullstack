import React, { useEffect , useState } from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Fab from '@material-ui/core/Fab';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setUpShoppingCart } from '../store'
import { useQuery, useMutation } from 'urql';
import {priceFormat} from '../lib/util'
import Link from 'next/link';

// query to get shopping cart items
const getCartItems = `
  query CartItems($cart_id: String!){
    shopping_cart(cart_id: $cart_id){
      item_id,
      cart_id,
      attributes,
      quantity,
      product_id,
      product {
        product_id,
        name,
        price,
        discounted_price,
        thumbnail
      }
    }
  }
`

const removeFromCartMutation = `
  mutation RemoveFromCart ($item_id: Int!){
    remove_from_cart(item_id: $item_id)
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'inline'
  },
  img: {
    height: 40,
    color: 'black'
  },
  popper:{
    'margin-top': '10px',
    'box-shadow': '-2px 2px 23px -10px rgba(0,0,0,0.75)',
  },
  list: {
    width: 365
  },
  button: {
    'margin-left': 5,
    'margin-right': 0,
     padding: 5,
    'min-width': 10,
    'border-radius': 50
  }
  
}))


function ShoppingCart({customer, cart_update, cart_id, setUpShoppingCart}) {

  const classes = useStyles()

  //console.log('cart update .. ', cart_update);
  const [res, executeQuery] = useQuery({
    query: getCartItems,
    variables: {cart_id}
    
  });
  

  const [removeCartRes, executeRemoveCart] = useMutation(removeFromCartMutation);

  const [cartUpdateTime, setCartUpdateTime] = useState(cart_update)
  const [cartTotal, setCartTotal] = useState({})
  const [openCart, setOpenCart] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  
  //const [lunchQuery, setLunchQuery] = useState(false)

  useEffect(() => {
    // this is called when the user click on add_to_cart when the cart is empty 
    // using the global store "cart_update" (see add-to-cart-btn.js).
    // After that the query will be automatically called since the state will be mapped by urql

    if(!res.fetching && cartUpdateTime != cart_update && cart_update ){
      // initilize cart and persist update time
    
      executeQuery({requestPolicy: 'network-only'})
      setCartUpdateTime(cart_update)
      
    } 

  }, [cart_update])


  useEffect( () => {
    // calculate the total price and the num items
    if(res.data && res.data.shopping_cart){

      if(res.data.shopping_cart.length > 0){
        const total = res.data.shopping_cart.map((item) => (item.product.discounted_price||item.product.price)*item.quantity).reduce((sum,n) => sum+n).toFixed(2)
        const num_items = res.data.shopping_cart.length
        const sum_items = res.data.shopping_cart.map((item) => item.quantity).reduce((sum,n) => sum+n)

        if(total!=cartTotal.total)
          setCartTotal({total,num_items,sum_items}) 
        
      }else{
         // if shopping cart is empty initialize cart
          if(cartTotal.total > 0)
            setCartTotal({total: 0,num_items: 0,sum_items: 0})

           if (cart_update ){
              setUpShoppingCart(null)
          }
          
      }
      
    }
  },[cartTotal,cartUpdateTime,openCart,removeCartRes,res])


  if(!res.data)
    return null

  function showCart(evt){
    setAnchorEl(evt.currentTarget)
    setOpenCart(!openCart)
  }

  function removeFromCart(item_id){
    executeRemoveCart({item_id}).then(rmRes => {
      if(rmRes.data.remove_from_cart){
        executeQuery({requestPolicy: 'network-only'})
       
      }
    })
  }


  return (
    <div className={classes.root}>
      <Badge data-testid="cart-badge" badgeContent={cartTotal.sum_items || (customer && customer.current_order && 1)} color="secondary">
        <ButtonBase onClick={showCart}>
          
          <ShoppingCartIcon className={classes.img} />
        </ButtonBase>
      </Badge>

      <Popper placement="top-start"  anchorEl={anchorEl}  className={classes.popper}  open={openCart}  transition>
          {!res.fetching && 
            <Paper >

              <List className={classes.list} data-testid='shopping-cart' >
                {res.data.shopping_cart.map((cart,index) => (
                  
                  <React.Fragment key={cart.item_id}>
                    <ListItem>
                      <ListItemAvatar>
                          <img className={classes.img} src={"/static/product_images/"+cart.product.thumbnail}  />
                      </ListItemAvatar>
                      <ListItemText primary={cart.product.name} secondary={'Qt: '+cart.quantity+', '+cart.attributes} />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" >
                          { priceFormat((cart.product.discounted_price||cart.product.price)*cart.quantity)}
                        </Typography>
                        <Button data-testid={`remove-${index}`} className={classes.button} size="small" color="secondary" onClick={() => {removeFromCart(cart.item_id)}}>
                          <ClearIcon />
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>

                ))}

                {!!cartTotal.total && 
                  <ListItem data-testid="cart-total">
                    <ListItemText primary="Total"  />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" >
                        {priceFormat(cartTotal.total)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                }
                {customer && customer.current_order && !cartTotal.total &&
                  <ListItem>
                    <Link href="/checkout" >
                      <Button fullWidth variant="contained" color="secondary">
                        <ShoppingCartIcon />
                        Complete Order #{customer.current_order}
                      </Button>
                    </Link>
                  </ListItem>
                }
                {!!cartTotal.total &&
                  <ListItem>
                    <Link href="/checkout" >
                      <Button fullWidth variant="contained" color="secondary">
                        <ShoppingCartIcon />
                        Checkout
                      </Button>
                    </Link>
                  </ListItem>
                }

              </List>
            
          </Paper>
        }
          
      </Popper>
    </div>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setUpShoppingCart }, dispatch)


const mapStateToProps = state => {
  const { cart_update,cart_id, customer } = state
  return { cart_update,cart_id, customer }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart)