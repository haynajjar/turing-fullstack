import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AddressForm from '../components/address-form';
import PaymentForm from '../components/payment-form';
import ReviewOrder from '../components/review-order';
import ShopAppBar from '../components/shop-app-bar';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setStepAction,setCheckoutStep,saveUser,setCheckoutError } from '../store'
import Link from 'next/link';
import Router from 'next/router';
import ErrorMessage from '../components/error-message'


const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  bigAvatar: {
    margin: 10,
    width: 160,
    height: 160,
  }
}));

const steps = ['Shipping address', 'Review your order', 'Payment details'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <ReviewOrder />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error('Unknown step');
  }
}

function Checkout({checkout_error,customer,checkout_step,setStepAction,setCheckoutStep,saveUser,setCheckoutError}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(checkout_step||0);

  const [currentOrderMessage, setCurrentOrderMessage] = useState(false)

  useEffect(() => {
    if(checkout_step){
      setActiveStep(checkout_step)
      setCurrentOrderMessage(false)
    }
    setStepAction(null)
    setCheckoutStep(null)
  }, [checkout_step])

  useEffect(() => {
    // need to change checkout step on error so it can be updated again when request succeed
    setStepAction(null)
  },[checkout_error])

  // check if user has current order 
  // if so redirect him to step 3
  useEffect(() => {
    if(!customer)    
      Router.push('/login')

    if(customer && customer.current_order && activeStep<2){
      if(!checkout_error)
        setCurrentOrderMessage(true)
      setActiveStep(2)
    }
  })

  if(!customer){
      return null
  }

  function cancelOrder(){
    // call api to cancel order
    if(confirm('Are you sure you want to cancel this order ?'))
    fetch('/order/cancel',{
      method: 'POST',
      headers: new Headers({'user-key': customer.token}),
      body: JSON.stringify({order_id: customer.current_order}),
    }).then(res => {
       res.json().then((data) => {
        if(data.success){
          setCheckoutError(null)
          let newCustomer = {...customer}
          delete newCustomer.current_order
          saveUser(newCustomer)
          setActiveStep(0)
          setCurrentOrderMessage(false)

        }else{
          // TODO -- handle error
          if(data.error)
            setCheckoutError(data.error)
          console.log(data)
        }
        
      })
    });
  }
  

  const handleNext = () => {
    // handle current step action
    // the listener is managed on the prop step_action, see SET_STEP_ACTION on store.js for info
     if(checkout_error)
      setCheckoutError(null)     
     setStepAction(activeStep)
  };

  const handleBack = () => {
    if(checkout_error)
      setCheckoutError(null)
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ShopAppBar hideCart />
      <main className={classes.layout}>
        <ErrorMessage message={checkout_error} />
        {currentOrderMessage &&
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h3" color="secondary">
              You have already an order in progress 
            </Typography>
            <Typography component="p">
              Your order #{customer.current_order} is currently active, complete this step or click below to cancel it.
            </Typography>
            <Button color="secondary" variant="contained" className={classes.button} onClick={cancelOrder}>Cancel Order</Button>
          </Paper>
        }
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label} >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <Paper className={classes.paper}>
                <Grid container justify="center" alignItems="center">
                  <Avatar alt="Order confirmed" src="/static/images/order_confirmed.jpg" className={classes.bigAvatar} />
                </Grid>
                <Typography variant="h5" component="h3" color="primary">
                  Congrats ! your order is confirmed
                </Typography>
                <Typography component="p">
                  Would you like to check out our awesome tshirts collection in the store !
                </Typography>
                <Link href="/" prefetch>
                  <Button color="primary" variant="contained" className={classes.button} >Continue Shopping</Button>
                </Link>
              </Paper>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ setStepAction,setCheckoutStep,saveUser, setCheckoutError }, dispatch)


const mapStateToProps = state => {
  const { checkout_step, customer, checkout_error } = state
  return { checkout_step, customer, checkout_error }
}

export default connect(mapStateToProps,mapDispatchToProps)(Checkout)