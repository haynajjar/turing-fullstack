import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/lab/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {setPriceRange, setPage, selectCategory, selectDepartment, setPageSize} from '../store'


const useStyles = makeStyles({
  root: {
    width: 210,
    marginTop: 50,
    marginLeft: 10,
  },
});

const marks = [
  {
    value: 1,
    label: '$1',
  },
  {
    value: 100,
    label: '$100',
  }
]

function PriceRange({price_range,setPriceRange,setPage,selectDepartment,selectCategory,setPageSize}) {

  function updatePriceRange(e, value){
    setPriceRange(value)
  }
  const classes = useStyles();

  return (

    <div>
      <Box  m={1}>
          <Typography gutterBottom variant="h6" component="h4" >
                Filter by price
          </Typography>
      </Box>

      <Slider
        className={classes.root}
        value={price_range}
        onChange={updatePriceRange}
        aria-labelledby="range-slider"
        valueLabelDisplay="on"
        marks={marks}
      />   
    </div>

  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPriceRange, setPage, selectCategory, selectDepartment, setPageSize }, dispatch)

const mapStateToProps = state => {
  const {  price_range } = state
  return {  price_range }
}

export default connect(mapStateToProps,mapDispatchToProps)(PriceRange)