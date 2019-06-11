import React, {useState, useEffect} from 'react';
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


  const [selectedDepartment,setSelectedDepartment] = useState(-1)
  const classes = useStyles();
  const [res, executeQuery] = useQuery({
    query: getDepartments
  });

  function setupDepartment(department_id){
    selectCategory(null);
    setPage(1)
    selectDepartment(department_id);
  }

  useEffect( () => {
    if(selectedDepartment != department_id)
      setSelectedDepartment(department_id)
  },[department_id])
  
  if (!res.data) {
    return null;
  }

  return (
    <div>
      <Box  m={1}>
          <Typography gutterBottom variant="h6" component="h4" >
                Departments
          </Typography>
      </Box>
      <Paper className={classes.root}>
        <MenuList>
          {
            res.data.departments.map(({ department_id, name }) => (          
                  <MenuItem key={department_id} onClick={() => {setupDepartment(department_id)}} selected={department_id === selectedDepartment}>
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

const mapStateToProps = state => {
  const { department_id } = state
  return { department_id }
}

export default connect(mapStateToProps,mapDispatchToProps)(Departments)