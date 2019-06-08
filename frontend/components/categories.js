import React, {useState,useEffect} from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectCategory, setPage } from '../store'
import { useQuery } from 'urql';

const useStyles = makeStyles({
  root: {
    width: 230,
  },
});


const getDepartment = `
  query Department($department_id: Int!){
    department(department_id: $department_id) {
      department_id
      name
      categories {
        category_id
        name
      }
    }
  }
`;

function Categories({department_id,category_id,selectCategory, setPage}) {

  const [selectedCategory,setSelectedCategory] = useState(category_id)
  const classes = useStyles();
  
  const [res, executeQuery] = useQuery({
    query: getDepartment,
    variables: {department_id}
  });

  function setupCategory(category_id){
    setPage(1)
    selectCategory(category_id)
  }

  useEffect(() => {
    setSelectedCategory(category_id)
  },[category_id])
  
  if (!res.data) {
    return null;
  }

  return (
    <Box component="span" m={1}>
      <Paper className={classes.root}>
 
        <MenuList>
          {
            res.data.department.categories.map(({ category_id, name }) => (          
                  <MenuItem key={category_id} onClick={() => {setupCategory(category_id)}} selected={selectedCategory === category_id}>
                    <Typography variant="inherit" >{name}</Typography>
                  </MenuItem>
                )
            )
          }
        </MenuList>
      </Paper>
    </Box>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectCategory , setPage }, dispatch)


const mapStateToProps = state => {
  const { department_id,category_id } = state
  return { department_id,category_id }
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories)