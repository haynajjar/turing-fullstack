import React , {useState, useEffect} from 'react';
import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {setCheckoutStep, saveUser, setCheckoutError} from '../store'
import {validate} from '../lib/validator'


function GeneralMask(props,mask){
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={mask}
      placeholderChar={'\u2000'}
      showMask
    />
  );
  
}

function DateMask(props) {
  return GeneralMask(props, [/\d/, /\d/, '/', /\d/, /\d/])
}

function CreditCardMask(props) {
  return GeneralMask(props, [...Array(16)].map(e => /\d/))
}



function PaymentForm({customer, step_action, saveUser, setCheckoutStep, setCheckoutError}) {

  const [card, setCard] = useState({expiry_date: '  /  ',card_number: '',card_name: '',cvc: ''})
  const [processing, setProcessing] = useState(false)
  const [errorMessages,setErrorMessages] = useState({})

  const handleChange = name => event => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

   useEffect(() =>{
    // step_action is reponsible for triggering the action
    // 0: trigger card submission, 1: trigger review , 2: trigger payment
    // send update address
    if(step_action === 2){
      let errors = {}
      for(let k in card){
        // set list of not required attributes or override the validation method by the field name in validator file
        let valid = validate.call(k,card[k])
        Object.assign(errors,{[`${k}_error`]: !valid.success,[`${k}_helper`]: valid.helper})
      
      }
      console.log('errors ... ',errors)
      setErrorMessages(errors)
      if(validate.error(errors)){
        setCheckoutStep(2)
        return;
      }
      setProcessing(true)
      fetch('/order/charge',{
          method: 'POST',
          headers: new Headers({'user-key': customer.token}),
          body: JSON.stringify({order_id: customer.current_order, ...card})
        }).then(res => {
          res.json().then(data => {
            setProcessing(false)
            if(data.success){
              // steps completed
              let newCustomer = {...customer}
              delete newCustomer.current_order
              saveUser(newCustomer)
              setCheckoutStep(3)

            }else{
              if(data.error)
                setCheckoutError(data.error)
              console.error(data)
            }
          })
        })
    }
  }, [step_action])


  return (
    <React.Fragment>

        <Typography variant="h6" gutterBottom>
          Payment method
        </Typography>
        {processing ? (
            <Typography variant="h6" component="h3" >
                        Processing ...
            </Typography>
          ): (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField required id="card_name" value={card.card_name||''} name="card_name" label="Name on card" fullWidth 
                onChange={(evt) => {setCard({...card,['card_name']: evt.target.value})}}
                helperText={errorMessages.card_name_helper||''}
                error={!!errorMessages.card_name_error}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel error={!!errorMessages.card_number_error} htmlFor="formatted-card-input">Card number</InputLabel>
                <Input
                  value={card.card_number||''}
                  onChange={(evt) => {setCard({...card,['card_number']: evt.target.value})}}
                  id="formatted-card-input"
                  inputComponent={CreditCardMask}
                  error={!!errorMessages.card_number_error}
                />
                <FormHelperText id="card-helper-text" error={!!errorMessages.card_number_error}>{errorMessages.card_number_helper}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>

              <FormControl fullWidth>
                <InputLabel error={!!errorMessages.expiry_date_error} htmlFor="formatted-expiry-input">Expiry date</InputLabel>
                <Input
                  value={card.expiry_date}
                  onChange={(evt) => {setCard({...card,['expiry_date']: evt.target.value})}}
                  id="formatted-expiry-input"
                  inputComponent={DateMask}
                  error={!!errorMessages.expiry_date_error}
                />
                <FormHelperText id="expiry-helper-text" error={!!errorMessages.expiry_date_error}>{errorMessages.expiry_date_helper}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="cvc"
                name="cvc"
                value={card.cvc||''}
                label="CVC"
                helperText="Last three digits on signature strip"
                fullWidth
                onChange={(evt) => {setCard({...card,['cvc']: evt.target.value})}}
                helperText={errorMessages.cvc_helper||''}
                error={!!errorMessages.cvc_error}
              />
            </Grid>
          </Grid>
        )}

    </React.Fragment>
  );
}



const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveUser, setCheckoutStep, setCheckoutError }, dispatch)


const mapStateToProps = state => {
  const { customer,step_action } = state
  return { customer, step_action }
}

export default connect(mapStateToProps,mapDispatchToProps)(PaymentForm)
