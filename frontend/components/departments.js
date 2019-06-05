import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectDepartment } from '../store'

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});

const deps = ['Dep 1-1','Dep 2-1','Dep 3-1']

function Departments({selectDepartment}) {

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <MenuList>
        {
          deps.map((dep,i) => {
            return (
                <MenuItem key={i} onClick={() => {selectDepartment(dep)}}>
                  <Typography variant="inherit" >{dep}</Typography>
                </MenuItem>
              )
          })
        }
      </MenuList>
    </Paper>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectDepartment }, dispatch)


export default connect(null,mapDispatchToProps)(Departments)