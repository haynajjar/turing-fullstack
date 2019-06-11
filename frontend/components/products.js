import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link'
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectCategory, setPageCount } from '../store'
import { useQuery } from 'urql';
import {priceFormat} from '../lib/util'
import AddToCartBtn from '../components/add-to-cart-btn'


const useStyles = makeStyles( theme => {return {
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 250,
  },
  media: {
    height: 140,
  },
  control: {
    padding: theme.spacing(2),
  },
  barred: {
    'text-decoration': 'line-through'
  },
  span: {
    'font-weight': 'bold'
  }
}});


const productQuery = `
 products(page: $page,pageSize: $pageSize) {
        product_id
        name
        description
        thumbnail
        price
        discounted_price
      }
`

// get products by department
const getDepartmentProducts = `
  query DepartmentProcuts($department_id: Int!, $page: Int!, $pageSize: Int!){
    department(department_id: $department_id) {
      name
      ${productQuery}
    }
  }
`;


const getCategoryProducts = `
  query CategoryProcuts($category_id: Int!, $page: Int!, $pageSize: Int!){
    category(category_id: $category_id) {
      name
      ${productQuery}
    }
  }
`;

const getAllProducts = `
  query Procuts($page: Int!, $pageSize: Int!){
      ${productQuery}
  }
`;

function Products({department_id,category_id, page_size, page ,setPageCount}) {

  const classes = useStyles();
  
  const variables={page,pageSize: page_size}
  const query = category_id ? getCategoryProducts : (department_id ? getDepartmentProducts : getAllProducts)
    
  const [res, executeQuery] = useQuery({
    query,
    variables: Object.assign(variables,{department_id,category_id})
  });
  
  useEffect( () => {
    if(res.data && res.data.pagination) 
      setPageCount(res.data.pagination.pageCount)
  })

  if (!res.data) {
    return null;
  }


  const data = category_id ? res.data.category : (department_id ? res.data.department : res.data)

  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
            {res.fetching && <Typography gutterBottom variant="h5" component="h4" noWrap>
                          Loading ...
                        </Typography>
              }
            {!res.fetching && data && data.products.map(({product_id,name,description,thumbnail,price,discounted_price}) => (
              <Grid key={product_id} item md={3} sm={6} xs={12}>
                  <Card  className={classes.card}>
                    <Link href={"/product/"+product_id} >
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={"/static/product_images/"+thumbnail}
                          title={name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h3" noWrap>
                            {name}
                          </Typography>
                          <Typography variant="body2" color="primary" component="h6" noWrap>
                            <span className={discounted_price ? classes.barred : classes.span}> {priceFormat(price)}</span> <span className={classes.span}>{priceFormat(discounted_price)}</span>
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p" noWrap>
                            {description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                    <CardActions>
                      <AddToCartBtn fullWidth product_id={product_id} />
                    </CardActions>
                  </Card>
                </Grid>
              )
            )
          }
    </Grid>
    </div>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectCategory, setPageCount }, dispatch)

const mapStateToProps = state => {
  const { department_id, category_id, page, page_size } = state
  return { department_id, category_id, page, page_size }
}

export default connect(mapStateToProps,mapDispatchToProps)(Products)