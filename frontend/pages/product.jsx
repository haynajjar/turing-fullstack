import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Departments from '../components/departments'
import Categories from '../components/categories'
import Products from '../components/products'
import ShopAppBar from '../components/shop-app-bar'
import ProductDetails from '../components/product-details'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

class Product extends React.Component {


  render(){
    if(!this.props.router.query.id){
      return 'No product id provided'
    }
    return (
      <React.Fragment>
        <ShopAppBar />
        <Grid container>
          <Grid item md={1}>
          </Grid>
          <Grid item md={10} >
            <Box m={5}>
              <ProductDetails  product_id={parseInt(this.props.router.query.id)} />
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

}


const mapDispatchToProps = {  }
const mapStateToProps = (state) => {
  const { department_id } = state
  return { department_id }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Product))


