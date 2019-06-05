import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'


const useStyles = makeStyles({
  root: {
    width: 230,
  },
});


function DepartmentDisplay({selectedDep}) {
  const classes = useStyles();

  return (

      <Typography variant="inherit">{selectedDep}</Typography>
        
  );
}


function mapStateToProps (state) {
  const { selectedDep } = state
  return { selectedDep }
}

export default connect(mapStateToProps)(DepartmentDisplay)
