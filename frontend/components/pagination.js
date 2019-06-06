import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPage,setPageSize } from '../store'


function Pagination({page_count,page,page_size,setPageSize,setPage}) {


  return (

    <Paper >
      <Grid container>
        <Grid item xs={11}>
        {[...Array(page_count)].map((e,i) => (
            <Button key={i} color={page == i+1 ? 'secondary' : 'primary'} size="large" onClick={() => {setPage(i+1)}}>
              {i+1}
            </Button>
          )
         )
        }
        </Grid>
        <Grid item xs={1}>

          <InputLabel htmlFor="page-size" shrink>Per page</InputLabel>
          <Select
              
              value={page_size}
              onChange={(evt) => {setPageSize(evt.target.value)}}
              inputProps={{
                name: 'page_size',
                id: 'page-size',
              }}
            >
              
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Paper>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPageSize, setPage }, dispatch)


const mapStateToProps = state => {
  const { page_count,page,page_size } = state
  return { page_count,page,page_size }
}

export default connect(mapStateToProps,mapDispatchToProps)(Pagination)