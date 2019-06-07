import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Departments from '../components/departments'
import Categories from '../components/categories'
import Products from '../components/products'
import Pagination from '../components/pagination'


import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

class Shop extends React.Component {

  static getInitialProps ({ reduxStore, req }) {
    // const isServer = !!req
    // DISPATCH ACTIONS HERE ONLY WITH `reduxStore.dispatch`
    // reduxStore.dispatch(prop_method)

    return {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render(){
    return (
      <div >
        <Grid container spacing={3}>
          <Grid item xs={12}>
          </Grid>
          <Grid item md={3}>
            <Departments />
            {this.props.department_id &&
              <Categories />
            }
          </Grid>
            
            
          <Grid item xs={9} >
            <Pagination />
            <Box m={2} >
              <Products />
            </Box>

          </Grid>

        </Grid>
      </div>
    );
  }
}


const mapDispatchToProps = {  }
const mapStateToProps = (state) => {
  const { department_id } = state
  return { department_id }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shop)


