import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ClearIcon from '@material-ui/icons/delete';
import {priceFormat} from '../lib/util';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useQuery, useMutation } from 'urql'
import SelectAttributes from './select-attributes'
import {setShipping, setCheckoutStep, saveUser, setCheckoutError } from '../store'

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

const getShippings = `
  query Shippings ($shipping_region_id: Int!){
    shippings (shipping_region_id: $shipping_region_id){
      shipping_id,
      shipping_type,
      shipping_cost
    }
  }
`

const removeFromCartMutation = `
  mutation RemoveFromCart ($item_id: Int!){
    remove_from_cart(item_id: $item_id)
  }
`

const updateCartQuantity = `
  mutation UpdateQuantity ($item_id: Int!,$quantity: Int!){
    update_cart_quantity(item_id: $item_id,quantity: $quantity)
  }
`

const updateCartAttributes = `
  mutation UpdateAttributes ($item_id: Int!, $attributes: String!){
    update_cart_attributes(item_id: $item_id, attributes: $attributes)
  }
`


const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },  
  listSmall: {
    padding: 0,
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  quantity:{
    marginRight: theme.spacing(7)
  },
  qtInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 70,
  },
  button:{
    'margin-left': 5,
    'margin-right': 5,
    'margin-top': 5,
     padding: 10,
    'min-width': 10,
    'border-radius': 20
  },
  btnAttributes: {
    flex: '1 1 auto',
    display: 'block',
    textAlign: 'left'
  },
  group: {
    margin: theme.spacing(1, 0),
  }
}));

function Review({cart_id,customer,shipping_id,step_action,setShipping,setCheckoutStep,saveUser,setCheckoutError}) {
  const classes = useStyles();

  const [resCart, executeQueryCart] = useQuery({
    query: getCartItems,
    variables: {cart_id},
    requestPolicy: 'network-only'
  });

  const [resShipping, executeQueryShipping] = useQuery({
    query: getShippings,
    variables: {shipping_region_id: (customer.address ? customer.address.shipping_region_id : 0)}
  });

  const [processing, setProcessing] = useState(false)
  const [qtInputs,setQtInputs] = useState([])
  const [attrInputs,setAttrInputs] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [cartTotal, setCartTotal] = useState({})
  const [shippingVal, setShippingVal] = useState(shipping_id)
  // selected attributes
  const [selectedAttr, setSelectedAttr] = useState({});

  // mutations 
  const [removeCartRes, executeRemoveCart] = useMutation(removeFromCartMutation);
  const [udpateQtRes, executeUpdateQt] = useMutation(updateCartQuantity);
  const [udpateAttrRes, executeUpdateAttr] = useMutation(updateCartAttributes);


  useEffect(() => {
    if(!resCart.fetching){
      setCheckoutError('Your shopping cart is empty, please go to the store and add some tishirts then come back ;)')
    }
    if(resCart.data && resCart.data.shopping_cart){
      const shoppingCart = resCart.data.shopping_cart
      setQtInputs([...Array(shoppingCart.length)].map(e => false))
      setAttrInputs([...Array(shoppingCart.length)].map(e => false))
      if(shoppingCart.length > 0){
        setCheckoutError(null)
        let total = shoppingCart.map((item) => (item.product.discounted_price||item.product.price)*item.quantity).reduce((sum,n) => sum+n)
        const num_items = shoppingCart.length
        const sum_items = shoppingCart.map((item) => item.quantity).reduce((sum,n) => sum+n)

        let selectedShipping = null
        // check if shipping exist 
        if(resShipping.data && resShipping.data.shippings){
          const shippings = resShipping.data.shippings
          const shippingObj = shippings.filter(sh => sh.shipping_id == parseInt(shippingVal))
          if(shippingObj.length>0){
            total += parseFloat(shippingObj[0].shipping_cost)
            selectedShipping = String(shippingObj[0].shipping_id) 
          }
          if(!selectedShipping){
            selectedShipping = String(resShipping.data.shippings[0].shipping_id)
          }
          setShipping(selectedShipping)
        }

        if(total!=cartTotal.total)
          setCartTotal({total,num_items,sum_items}) 
        
      }
    }
    
  },[resCart,shippingVal])


  // use this to detect next_step
  useEffect(() =>{
    // TODO check the form validation
    // step_action is reponsible for triggering the action
    // 0: trigger address submission, 1: trigger review , 2: trigger payment
    // send update address
    if(step_action === 1 && cartTotal.total){
      setProcessing(true)
      fetch('/order',{
          method: 'POST',
          headers: new Headers({'user-key': customer.token}),
          body: JSON.stringify({customer_id: customer.customer_id, shipping_id: parseInt(shippingVal), cart_id})
        }).then(res => {
          res.json().then(data => {
            setProcessing(false)
            if(data.success){
              // trigger the event address updated!
              setCheckoutStep(2)
              let newCustomer = {...customer}
              newCustomer['current_order'] = data.order_id
              saveUser(newCustomer)
            }else{
              if(data.error)
                setCheckoutError(data.error)
              console.error(data)
            }
          })
        })
    }
  }, [step_action])


  function showQtInput(evt,index,quantity){
    setAnchorEl(evt.currentTarget);
    qtInputs[index] = true
    setQtInputs(qtInputs)
    setQuantity(parseInt(quantity))

  }

  function showAttrInput(evt,index,attributes,product_id){

    setAnchorEl(evt.currentTarget);
    attrInputs[index] = true
    setAttrInputs(attrInputs)

    // transform string attributes to json
    // string has format like this : "Size: XL, Color: White"
    const attrArr = attributes.replace(/\s/g,'').split(',').map((attr) => {return attr.split(':')})
    const attrArrObj = attrArr.map(attr => {return {[attr[0]]: attr[1]}})
    let attrObj = {}
    for (let i = 0; i < attrArrObj.length; i++) {
      Object.assign(attrObj,attrArrObj[i])
    }
    // should get => {Size: 'XL',Color: 'White'}

    setSelectedAttr(attrObj)

  }

  function updateQuantity(item_id,index){
    let inputs = [...qtInputs]
    inputs[index] = false
    setQtInputs(inputs)
    // call mutation update
    if(quantity)
      executeUpdateQt({item_id,quantity}).then(res => {
        executeQueryCart({requestPolicy: 'network-only'})
      })

    setQuantity(null)
  }


  function updateAttribute(item_id,index){
    let inputs = [...attrInputs]
    inputs[index] = false
    setAttrInputs(inputs)
    // call mutation update
    // transform selectedAttr to string and update attributes
    // remove undefined values 
    const attrs = JSON.parse(JSON.stringify(selectedAttr))
    const attributes = Object.keys(attrs).map((k,i) => k+": "+Object.values(selectedAttr)[i]).join(', ')
    executeUpdateAttr({item_id,attributes}).then(res => {
      // TODO - just update the string of options since they don't affect the price
      executeQueryCart({requestPolicy: 'network-only'})

    })

    setQuantity(null)
  }

  function removeFromCart(item_id){
    if(confirm('Are you sure ?'))
    executeRemoveCart({item_id}).then(rmRes => {
      if(rmRes.data.remove_from_cart){
        executeQueryCart({requestPolicy: 'network-only'})
       
      }
    })
  }


  if(!resCart.data)
    return null

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {processing ? ( 
          <Typography variant="h6" component="h3" >
                        Processing ...
          </Typography>
      ) : (
      <List disablePadding>
        {resCart.data.shopping_cart && resCart.data.shopping_cart.map((cart,index) => (
            <ListItem className={classes.listItem} key={cart.item_id}>
              <Button className={classes.button} size="small" color="secondary" onClick={() => {removeFromCart(cart.item_id)}}>
                    <ClearIcon />
              </Button>
              <ButtonBase className={classes.btnAttributes} aria-controls="fade-attr" aria-haspopup="true" onClick={(evt) => {showAttrInput(evt,index,cart.attributes,cart.product_id)}}>
                <ListItemText primary={cart.product.name} secondary={cart.attributes} />
              </ButtonBase>
              <Menu
                id="fade-attr"
                anchorEl={anchorEl}
                keepMounted
                open={attrInputs[index]||false}
                TransitionComponent={Fade}
              >
                {attrInputs[index] && 
                  <SelectAttributes 
                    product_id={cart.product_id} 
                    ref={selectedAttr} 
                    onChange={(attrSelected) => {setSelectedAttr(Object.assign(selectedAttr,attrSelected))}}
                    selected_attr={{...selectedAttr}}
                  />
                }
                <Button size="small" className={classes.button} color="secondary" variant="contained" onClick={() => {updateAttribute(cart.item_id,index)}}>ok</Button>
              </Menu>

              <ButtonBase aria-controls="fade-qt" aria-haspopup="true" onClick={(evt) => {showQtInput(evt,index,cart.quantity)}}>
                <Typography variant="subtitle1" className={classes.quantity}>x {cart.quantity}</Typography>
              </ButtonBase>
              <Menu
                id="fade-qt"
                anchorEl={anchorEl}
                keepMounted
                open={qtInputs[index]||false}
                TransitionComponent={Fade}
              >
                 <TextField
                    id="standard-number"
                    label="Quantity"
                    value={qtInputs[index] ? quantity : (cart.quantity||1)}
                    type="number"
                    onChange={(evt) => {setQuantity(parseInt(evt.target.value))}}
                    className={classes.qtInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{min: 1}}
                  />
                  <Button size="small" className={classes.button} color="secondary" variant="contained" onClick={() => {updateQuantity(cart.item_id,index)}}>ok</Button>
              </Menu>

              <Typography variant="subtitle1">
                {priceFormat((cart.product.discounted_price||cart.product.price)*cart.quantity)}
              </Typography>
            </ListItem>

          ))}

         <ListItem className={classes.listItem}>
          <ListItemText>
            <Typography variant="h6" gutterBottom className={classes.title}>
              Shipping
            </Typography>
          </ListItemText>
        </ListItem>

        {resShipping.data &&
          <RadioGroup
            aria-label="Shipping"
            name="shipping"
            className={classes.group}
            value={shippingVal}
            onChange={(evt) => {setShippingVal(evt.target.value)}}
          >
            {resShipping.data.shippings.map((shipping,i) => (
                  <ListItem key={i} className={classes.listSmall}>
                    <ListItemText>
                      <FormControlLabel value={String(shipping.shipping_id)} control={<Radio />} label={shipping.shipping_type} />
                    </ListItemText>
                    <Typography variant="subtitle1" >
                      {priceFormat(shipping.shipping_cost)}
                    </Typography>
                  </ListItem>
              ))}
          </RadioGroup>
        }


        <ListItem className={classes.listItem}>
          <ListItemText>
            <Typography variant="h6" gutterBottom className={classes.title}>
              Total
            </Typography>
          </ListItemText>
          <Typography variant="subtitle1" className={classes.total}>
            {priceFormat(cartTotal.total)}
          </Typography>
        </ListItem>
      </List>
      )}
    </React.Fragment>
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ setShipping, setCheckoutStep, saveUser, setCheckoutError }, dispatch)


const mapStateToProps = state => {
  const { customer, cart_id, shipping_id, step_action } = state
  return { customer, cart_id, shipping_id, step_action }
}


export default connect(mapStateToProps,mapDispatchToProps)(Review)