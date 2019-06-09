import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { useQuery } from 'urql';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {setCheckoutStep, saveUser} from '../store'


const getRegions = `
  query Regions {
    shipping_regions{
      shipping_region_id
      shipping_region
    }
  }
`;

function AddressForm({customer, step_action, setCheckoutStep, saveUser}) {

  // the action in the stepper will send update_address so the update will be triggered
  const customerAddress = customer ? customer.address : {}
  const user = {address_1: '',address_2:'',shipping_region_id: 1, city: '', country: '', postal_code: '',...customerAddress}
  const [address, setAddress] = useState(user)

  // fetch regions
  const [regions, executeQueryRegions] = useQuery({
    query: getRegions
  });

  useEffect(() =>{
    // TODO check the form validation
    // step_action is reponsible for triggering the action
    // 0: trigger address submission, 1: trigger review , 2: trigger payment
    // send update address
    if(step_action === 0){
      fetch('/user/address',{
          method: 'POST',
          body: JSON.stringify({customer_id: customer.customer_id, ...address})
        }).then(res => {
          res.json().then(data => {
            if(data.success){
              // trigger the event address updated!
              setCheckoutStep(1)
              saveUser(Object.assign(customer,{address}))
            }else{
              //TODO show error
              console.error(data)
            }
          })
        })
    }
  }, [step_action])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        
        <Grid item xs={12}>
          <TextField
            required
            id="address_1"
            name="address_1"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
            onChange={(evt) => {setAddress({...address,['address_1']: evt.target.value})}}
            value={address.address_1}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address_2"
            name="address_2"
            label="Address line 2"
            fullWidth
            autoComplete="billing address-line2"
            onChange={(evt) => {setAddress({...address,['address_2']: evt.target.value})}}
            value={address.address_2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
            onChange={(evt) => {setAddress({...address,['city']: evt.target.value})}}
            value={address.city}
          />
        </Grid>
        {regions.data && regions.data.shipping_regions && 
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="region" >Region</InputLabel>
            <Select
                value={address.shipping_region_id}
                onChange={(evt) => {setAddress({...address,['shipping_region_id']: evt.target.value})}}
                inputProps={{
                  name: 'shipping_region_id',
                  id: 'shipping_region_id',
                }}
                fullWidth
              >
                
                {regions.data.shipping_regions.map( region => (
                    <MenuItem key={region.shipping_region_id} value={region.shipping_region_id}>{region.shipping_region}</MenuItem>
                  ))}
            </Select>
          </Grid>
        }
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="postal_code"
            name="postal_code"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
            onChange={(evt) => {setAddress({...address,['postal_code']: evt.target.value})}}
            value={address.postal_code}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
            onChange={(evt) => {setAddress({...address,['country']: evt.target.value})}}
            value={address.country}
          />
        </Grid>
        
      </Grid>
    </React.Fragment>
  );
}


const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCheckoutStep , saveUser }, dispatch)


const mapStateToProps = state => {
  const { customer,step_action } = state
  return { customer, step_action }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddressForm)