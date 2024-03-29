    
import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Router from 'next/router'
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {saveUser} from '../store'
import ShopAppBar from '../components/shop-app-bar'
import {validate} from '../lib/validator'
import ErrorMessage from '../components/error-message'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function SignUp({customer,saveUser}) {

  if(customer)
      Router.push('/shop')

  const [errorMessages,setErrorMessages] = useState({})
  const [responseError,setResponseError] = useState(null)

  const classes = useStyles();

  function callSignUp(jdata){
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(jdata),
    }).then(res => {
      // authenticate user
      // save it's credentials in a persistent store
      res.json().then((data) => {
        if(data.success){
          saveUser(data.customer)
          // redirect to checkout page by default 
          Router.push('/checkout')
        }else{
          console.log(data)
          if(data.error){
            setResponseError(data.error)
          }
        }
        
      })
    });
  }


  function signUpCustomer(event){
    event.preventDefault();
    const jdata = {}
    const data = new FormData(event.target);
    let errors = {}
    data.forEach(function(v,k){
      // validate each key
      let valid = validate.call(k,v)
      Object.assign(errors,{[`${k}_error`]: !valid.success,[`${k}_helper`]: valid.helper})

      jdata[k]=v;
    })
    
    setErrorMessages(errors)

    // console.log(errorMessages)
    // console.log(validate.error(errorMessages))

    if(validate.error(errors)){
      return;
    }

    callSignUp(jdata)
  }

  return (
      <React.Fragment>
        <ShopAppBar />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <ErrorMessage message={responseError} />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={signUpCustomer}>
              <Grid container spacing={2}>
                
                <Grid item xs={12} >
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    helperText={errorMessages.name_helper||''}
                    error={!!errorMessages.name_error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    helperText={errorMessages.email_helper||''}
                    error={!!errorMessages.email_error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    helperText={errorMessages.password_helper||''}
                    error={!!errorMessages.password_error}
                  />
                </Grid>
                
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link prefetch  href="/login" >
                    <a>Already have an account? Sign in</a>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          
        </Container>
      </React.Fragment>
    )
}



const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveUser }, dispatch)

const mapStateToProps = state => {
  const { customer } = state
  return { customer }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUp)