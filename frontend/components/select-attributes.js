import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { useQuery } from 'urql'



const getProduct = `
 query ProductDetails ($product_id: Int!) {
   product(product_id: $product_id) { 
          attributes {
            attribute_id
            name
            attribute_values{
              attribute_value_id
              value
            }
          }
    }
 }
`


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
  
}));

const SelectAttributes = ({product_id,onChange,selected_attr},selectedAttr) => {

  const classes = useStyles();

  const [resProduct, executeQueryProduct] = useQuery({
        query: getProduct,
        variables: {product_id},
        //requestPolicy: 'network-only'
    });

  const [selectedAttrVal, setSelectedAttrVal] = useState(selected_attr);
   

  function updateAttrValue(name,value){
    const val = {[name]: value}
    setSelectedAttrVal({...Object.assign(selectedAttrVal,val)})
    onChange(val)
  }

  
  if(!resProduct.data)
    return null

  return (
    <React.Fragment>
      {resProduct.data.product && resProduct.data.product.attributes.map((attr,i) => (

          <FormControl key={attr.attribute_id} className={classes.formControl}>
            <InputLabel shrink htmlFor={"attribute-placeholder"+attr.attribute_id}>
              {attr.name}
            </InputLabel>
            <NativeSelect
              value={selectedAttrVal[attr.name]||''}
              onChange={(evt) => {updateAttrValue(attr.name,evt.target.value)}}
              input={<Input name={attr.name} id={"attribute-placeholder"+attr.attribute_id} />}
            >
              {attr.attribute_values && attr.attribute_values.map((attrVal,i) => (
                  <option key={i} value={attrVal.value}>{attrVal.value}</option>
                ))
              }
              
            </NativeSelect>
          </FormControl>
        ))

      }
    </React.Fragment>
  );
}




export default React.forwardRef(SelectAttributes)