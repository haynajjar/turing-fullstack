import React from 'react';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setUpShoppingCart } from '../store'
import { useMutation } from 'urql';

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

function AddToCartBtn({product_id, cart_id,cart_update, cart_attributes, setUpShoppingCart, fullWidth}) {

  // use mutation for add to cart
  const [addCartRes, executeMutation] = useMutation(addToCartMutation);

  function addToCart(){
    // to prevent multi requests trigger we need to set a state 
    if(!addCartRes.fetching){
      executeMutation({product_id: product_id,cart_id: cart_id,attributes: cart_attributes}).then(res => {
        // update global cart state with new time (cart_update) 
        // cart_update will contain null at the first time, so this is actually initializing the cart
        if(!cart_update){
          const updateTime = (+new Date()).toString()
          setUpShoppingCart(updateTime)
        }
      })
    }
  }


  return (
      <Button fullWidth={fullWidth} color="secondary" variant="contained" onClick={addToCart}>
        <ShoppingCartIcon />
        Add to card 
      </Button>              
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setUpShoppingCart }, dispatch)

const mapStateToProps = state => {
  const {  cart_id, cart_attributes, cart_update } = state
  return {  cart_id, cart_attributes, cart_update }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddToCartBtn)