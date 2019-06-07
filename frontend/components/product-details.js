import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateShoppingCart, updateCartAttributes } from '../store'
import { useQuery, useMutation } from 'urql';

import ShoppingCart from './shopping-cart'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    width: 64,
    height: 128,
  },
  margin: {
    margin: theme.spacing(1),
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));


const getProduct = `
 query ProductDetails ($product_id: Int!) {
   product(product_id: $product_id) { 
          product_id, 
          name, 
          description,
          image,
          image_2,
          price,
          discounted_price,
          attributes {
            attribute_id
            name
            attribute_values{
              attribute_value_id
              value
            }
          }
    }
 }
`

const addToCartMutation = `
  mutation AddToCart ($product_id: Int!,$cart_id: String!,$attributes: String!){
    add_to_cart(product_id: $product_id,cart_id: $cart_id,attributes: $attributes,quantity: 1){
      item_id,
      quantity,
      cart_id,
      added_on
      product_id
    }
  }
`

function ProductDetails({department_id, product_id, cart_id, cart_attributes, updateShoppingCart, updateCartAttributes}) {

  const classes = useStyles()  ;

  const [imgName, setImageName] = React.useState(null)
  const [selectedAttributeValues, setSelectedAttributeValues] = React.useState({})

  const [res, executeQuery] = useQuery({
    query: getProduct,
    variables: {product_id}
  });

  function setAttributeValue(name,value){
    let obj = {...selectedAttributeValues}
    obj[name] = value
    setSelectedAttributeValues(obj)
    updateCartAttributes(obj)
  }
  
  function selectedAttributeValuesColor(attribute,attribute_value){
    return selectedAttributeValues[attribute] === attribute_value ? 'secondary' : 'primary'
  }

  // ---- --------
  // MUTATION ----
  // use mutation for add to cart
  const [addCartRes, executeMutation] = useMutation(addToCartMutation);
  function addToCart(){
    // to prevent multi requests trigger we need to set a state 
    // console.log('add to cart res ... ', addCartRes)
    if(!addCartRes.fetching){
      executeMutation({product_id: product_id,cart_id: cart_id,attributes: cart_attributes}).then(res => {
        // update global cart state with new time (cart_update)
        const updateTime = (+new Date()).toString()
        updateShoppingCart(updateTime)
      })
    }
  }
  // ---- ----

  if (!res.data) {
    return null;
  }

  const product = res.data.product 

  return (
    <div className={classes.root}>
      <Grid container className={classes.root} spacing={2}>

            <ShoppingCart />

            {res.fetching && <Typography gutterBottom variant="h5" component="h4" noWrap>
                          Loading ...
                        </Typography>
              }
            
          
            <Grid item md={3} sm={6} xs={12}>
                <div >
                  <img  alt={product.name} src={`/static/product_images/${imgName || product.image}`} />
                </div>
                <ButtonBase className={classes.image} onClick={() => {setImageName(product.image)}}>
                  <img className={classes.img} alt={product.name} src={`/static/product_images/${product.image}`} />
                </ButtonBase>
                <ButtonBase className={classes.image} onClick={() => {setImageName(product.image_2)}}>
                  <img className={classes.img} alt={product.name} src={`/static/product_images/${product.image_2}`} />
                </ButtonBase>

            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {cart_id}
                  </Typography>
                  {product.attributes.map( ({attribute_id,name,attribute_values},i) => (
                      <div key={i}>
                        <Typography gutterBottom variant="subtitle1">
                          {name}
                        </Typography>
                        {attribute_values.map( ({attribute_value_id, value}) => (
                            <Button onClick={() => {setAttributeValue(name,value)}} className={classes.margin} key={attribute_value_id}  size="small" color={selectedAttributeValuesColor(name,value)} variant="outlined" >
                              {value}
                            </Button>
                          )
                        )}
                      </div>
                    ) 
                  )}
                </Grid>
                <Grid item>
                  <Button color="secondary" variant="contained" onClick={addToCart}>
                    Add to card 
                  </Button>
                  
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{product.price}</Typography>
              </Grid>
            </Grid>
          
      </Grid>
    </div>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateShoppingCart, updateCartAttributes }, dispatch)

const mapStateToProps = state => {
  const { department_id, cart_id, cart_attributes } = state
  return { department_id, cart_id, cart_attributes }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductDetails)