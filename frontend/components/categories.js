import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { selectCategory } from '../store'
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

function Categories({department_id,category_id,selectCategory}) {

  const selectedCategory = category_id
  const classes = useStyles();
  
  const [res, executeQuery] = useQuery({
    query: getDepartment,
    variables: {department_id}
  });
  
  if (!res.data) {
    return null;
  }

  return (
    <Paper className={classes.root}>

      <MenuList>
        {
          res.data.department.categories.map(({ category_id, name },i) => (          
                <MenuItem key={category_id} onClick={() => {selectCategory(category_id)}} selected={selectedCategory === category_id}>
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
  bindActionCreators({ selectCategory }, dispatch)


const mapStateToProps = state => {
  const { department_id,category_id } = state
  return { department_id,category_id }
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories)