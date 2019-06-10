import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Router from 'next/router'
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Container from '@material-ui/core/Container';
import ShopAppBar from '../components/shop-app-bar'
import {saveUser} from '../store'
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn({customer,saveUser}) {

  if(customer){
      Router.push('/checkout')

  }

  const classes = useStyles();
  const [errorMessages,setErrorMessages] = useState({})
  const [responseError,setResponseError] = useState(null)


  function callSignIn(jdata){
    fetch('/auth', {
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
          // TODO -- handle error
          console.log(data)
          if(data.error){
            setResponseError(data.error)
          }
        }
        
      })
    });
  }

  function signInCustomer(event){
    event.preventDefault();
    const jdata = {}
    const data = new FormData(event.target);
    let errors = {}
    data.forEach(function(v,k){
      jdata[k]=v;
            // validate each key
      let valid = validate.call(k,v)
      Object.assign(errors,{[`${k}_error`]: !valid.success,[`${k}_helper`]: valid.helper})
    })
    setErrorMessages(errors)
    if(validate.error(errors)){
      return;
    }
    callSignIn(jdata)
  }


  return (
    <React.Fragment>
      <ShopAppBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <ErrorMessage message={responseError} />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={signInCustomer}  noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={errorMessages.email_helper||''}
              error={!!errorMessages.email_error}
            />
            <TextField
              variant="outlined"
              margin="normal"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                
              </Grid>
              <Grid item>
                
                <Link prefetch href="/sign_up" >
                  <a>{"Don't have an account? Sign Up"}</a>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveUser }, dispatch)

const mapStateToProps = state => {
  const { customer } = state
  return { customer }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignIn)