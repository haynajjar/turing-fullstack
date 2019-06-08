import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Router from 'next/router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveUser } from '../store'


function MenuCustomer({customer,saveUser}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function logout(){
    saveUser(null)
    Router.push('/')
  }

  return (
    <React.Fragment>

      {!customer && 
            <Link href='/login' prefetch >
              <Button >Login</Button>
            </Link>
      }
      {customer && 
        <React.Fragment>
          <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>        
            {customer.name}
          </Button>
          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => {Router.push('/profile')}}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      }
    </React.Fragment>
 
    

   
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveUser }, dispatch)

const mapStateToProps = state => {
  const { customer } = state
  return { customer }
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuCustomer)