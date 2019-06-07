import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectDepartment, selectCategory, setPage } from '../store'
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

function Departments({department_id, selectDepartment, selectCategory, setPage}) {


  const [selectedIndex,setSelectedIndex] = React.useState(-1)
  const classes = useStyles();
  const [res, executeQuery] = useQuery({
    query: getDepartments
  });

  function setupDepartment(department_id,i){
    selectCategory(null);
    setPage(1)
    selectDepartment(department_id);
    setSelectedIndex(i)
  }
  
  if (!res.data) {
    return null;
  }

  return (
    <div>
      <Box  m={1}>
          <Typography gutterBottom variant="h5" component="h4" >
                Filter
          </Typography>
      </Box>
      <Paper className={classes.root}>
        <MenuList>
          {
            res.data.departments.map(({ department_id, name },i) => (          
                  <MenuItem key={i} onClick={() => {setupDepartment(department_id,i)}} selected={i === selectedIndex}>
                    <Typography variant="inherit" >{name}</Typography>
                  </MenuItem>
                )
            )
          }
        </MenuList>
      </Paper>
    </div>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectDepartment, selectCategory ,setPage }, dispatch)


export default connect(null,mapDispatchToProps)(Departments)