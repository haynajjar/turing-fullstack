import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Departments from '../components/departments'
import Categories from '../components/categories'
import Products from '../components/products'
import Pagination from '../components/pagination'
import ShopAppBar from '../components/shop-app-bar'

import { connect } from 'react-redux'

class Shop extends React.Component {

  static getInitialProps ({ reduxStore, req }) {
    // const isServer = !!req
    // DISPATCH ACTIONS HERE ONLY WITH `reduxStore.dispatch`
    // reduxStore.dispatch(prop_method)

    return {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render(){
    return (
      <React.Fragment >
        <ShopAppBar />
        <Grid container>
          <Grid item xs={12}>
          </Grid>
          <Grid item md={3}>
            <Departments />
            <Categories />
            
          </Grid>
            
            
          <Grid item md={9} >
            <Pagination />
            <Box m={2} >
              <Products />
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
)(Shop)


