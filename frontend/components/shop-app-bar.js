import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/styles';
import ShoppingCart from './shopping-cart'
import Link from 'next/link'
import Router from 'next/router'
import MenuCustomer from './menu-customer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPage, selectCategory, selectDepartment, setPageSize } from '../store'

const useStyles = makeStyles(theme => ({
  root: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    'box-shadow': 'none'
  },
  img: {
    height: 35
  },
  right: {
    position: 'relative',
    width: '100%',
    'text-align': 'right'
  }
}))


function ShopAppBar({hideCart,setPage,selectDepartment,selectCategory,setPageSize}) {
  const classes = useStyles()

  function goToHome(){
    setPage(1)
    selectDepartment(null)
    selectCategory(null)
    setPageSize(10)
    Router.push('/')
  }

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.root} >
        <Toolbar >
            <ButtonBase onClick={goToHome}>
              <img className={classes.img} src="/static/images/tshirtshop.png" alt="Tshirt Shop" />
            </ButtonBase>
            <div className={classes.right}>
              <MenuCustomer />
              {!hideCart && 
                <ShoppingCart />
              }
            </div> 
        </Toolbar>
      </AppBar>
      
      <Toolbar />
      
      
    </React.Fragment>
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPage, selectCategory, selectDepartment, setPageSize }, dispatch)

export default connect(null,mapDispatchToProps)(ShopAppBar)