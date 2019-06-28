import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateCartAttributes } from '../store'
import { useQuery } from 'urql';
import AddToCartBtn from './add-to-cart-btn'
import {priceFormat} from '../lib/util'
import Router from 'next/router'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    //padding: theme.spacing(1, 2),
    display: 'block',
    marginBottom: theme.spacing(5)
  },
  image: {
    width: 64,
    height: 128,
  },
  margin: {
    margin: theme.spacing(1),
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  barred: {
    'text-decoration': 'line-through'
  },
  span: {
    'font-weight': 'bold'
  }
}));


const getProduct = `
 query ProductDetails ($product_id: Int!) {
   product(product_id: $product_id) { 
          product_id, 
          name, 
          description,
          image,
          image_2,
          price,
          discounted_price,
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

function ProductDetails({product_id, cart_id,cart_update, cart_attributes, updateCartAttributes}) {

  const classes = useStyles()  ;

  const [imgName, setImageName] = React.useState(null)
  const [selectedAttributeValues, setSelectedAttributeValues] = React.useState({})

  const [res, executeQuery] = useQuery({
    query: getProduct,
    variables: {product_id}
  });

  function setAttributeValue(name,value){
    let obj = {...selectedAttributeValues}
    obj[name] = value
    setSelectedAttributeValues(obj)
    updateCartAttributes(obj)
  }
  
  function selectedAttributeValuesColor(attribute,attribute_value){
    return selectedAttributeValues[attribute] === attribute_value ? 'secondary' : 'primary'
  }

  // function goToProducts(){
  //   Router.push('/')
  // }


  if (!res.data) {
    return null;
  }

  const product = res.data.product 

  return (
    <div className={classes.root}>
      <Grid container className={classes.root}>
            

            {res.fetching && <Typography gutterBottom variant="h5" component="h4" noWrap>
                          Loading ...
                        </Typography>
              }
            

            
            <Grid container data-testid="product-details">
              <Grid item md={3} sm={6} xs={12}>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Paper elevation={0} className={classes.paper}>
                    <Breadcrumbs aria-label="Breadcrumb">
                      <Link color="inherit" href="/" >
                        Products
                      </Link>
                      <Link color="inherit" aria-current="page">
                        {product && 
                            <span>{product.name}</span>
                        }
                      </Link>
                      
                    </Breadcrumbs>
                  </Paper>
              </Grid>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
                <div >
                  <img  alt={product.name} src={`/static/product_images/${imgName || product.image}`} />
                </div>
                <ButtonBase className={classes.image} onClick={() => {setImageName(product.image)}}>
                  <img className={classes.img} alt={product.name} src={`/static/product_images/${product.image}`} />
                </ButtonBase>
                <ButtonBase className={classes.image} onClick={() => {setImageName(product.image_2)}}>
                  <img className={classes.img} alt={product.name} src={`/static/product_images/${product.image_2}`} />
                </ButtonBase>

            </Grid>
            <Grid item xs={12} sm container>

              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  
                  <Typography gutterBottom variant="h6">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {product.description}
                  </Typography>
                  {product.attributes.map( ({attribute_id,name,attribute_values},i) => (
                      <div key={i}>
                        <Typography gutterBottom variant="subtitle1" >
                          {name}
                        </Typography>
                        {attribute_values.map( ({attribute_value_id, value}) => (
                            <Button onClick={() => {setAttributeValue(name,value)}} className={classes.margin} key={attribute_value_id}  size="small" color={selectedAttributeValuesColor(name,value)} variant="outlined" >
                              {value}
                            </Button>
                          )
                        )}
                      </div>
                    ) 
                  )}
                </Grid>
                <Grid item>
                 
                  <AddToCartBtn product_id={product_id} />
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="h6"  noWrap>
                  <span className={product.discounted_price ? classes.barred : classes.span}> {priceFormat(product.price)}</span> <span className={classes.span}>{priceFormat(product.discounted_price)}</span>
                </Typography>
              </Grid>
            </Grid>
          
      </Grid>
    </div>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateCartAttributes }, dispatch)

const mapStateToProps = state => {
  const { cart_id, cart_attributes, cart_update } = state
  return { cart_id, cart_attributes, cart_update }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductDetails)