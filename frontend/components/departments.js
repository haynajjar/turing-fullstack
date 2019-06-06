import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectDepartment, selectCategory } from '../store'
import { useQuery } from 'urql';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});


const getDepartments = `
  query GetDepartments {
    departments {
      department_id
      name
    }
  }
`;

function Departments({department_id, selectDepartment, selectCategory}) {

  
  const [selectedIndex,setSelectedIndex] = React.useState(-1)
  const classes = useStyles();
  const [res, executeQuery] = useQuery({
    query: getDepartments
  });
  
  if (!res.data) {
    return null;
  }

  return (
    <Paper className={classes.root}>

      <MenuList>
        {
          res.data.departments.map(({ department_id, name },i) => (          
                <MenuItem key={i} onClick={() => {selectDepartment(department_id);selectCategory(null);setSelectedIndex(i)}} selected={i === selectedIndex}>
                  <Typography variant="inherit" >{name}</Typography>
                </MenuItem>
              )
          )
        }
      </MenuList>
    </Paper>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectDepartment, selectCategory }, dispatch)


export default connect(null,mapDispatchToProps)(Departments)