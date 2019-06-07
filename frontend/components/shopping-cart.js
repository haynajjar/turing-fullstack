import React, { useEffect , useState } from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPage,setPageSize } from '../store'

import { useQuery } from 'urql';



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
        price
      }
    }
  }
`


function ShoppingCart({cart_update,cart_id}) {


  const [res, executeQuery] = useQuery({
    query: getCartItems,
    variables: {cart_id},
    // policy network-only because cart_id won't be changing, and we need to get update
    
  });

  const [cartUpdateTime, setCartUpdateTime] = useState(null)
  useEffect(() => {
    if(!res.fetching && cartUpdateTime != cart_update){
      
      executeQuery({requestPolicy: 'network-only'})
      setCartUpdateTime(cart_update)
    }

  })

  if(!res.data)
    return null

  return (

    <Paper >
      <Grid container>
        <Grid item xs={12} >
          <pre>
            <code>
             
              {!res.fetching && JSON.stringify(res.data, null, 2)}
            </code>
          </pre>
        </Grid>
       
      </Grid>
    </Paper>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPageSize, setPage }, dispatch)


const mapStateToProps = state => {
  const { cart_update,cart_id } = state
  return { cart_update,cart_id }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart)