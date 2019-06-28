import React from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {setKeyword, setPage, selectCategory, selectDepartment, setPageSize} from '../store'

function SearchInput({keyword,setKeyword,setPage,selectDepartment,selectCategory,setPageSize}) {

  function updateKeyword(e){
    setKeyword(e.target.value)
  }

  function resetFilter(){
    setPage(1)
    selectDepartment(null)
    selectCategory(null)
    setPageSize(10)
    
  }

  return (
       <TextField
        id="outlined-search"
        label="Search field"
        type="search"
        onChange={updateKeyword}
        onFocus={resetFilter}
        margin="normal"
        value={keyword}
        variant="outlined"
      />              
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setKeyword, setPage, selectCategory, selectDepartment, setPageSize }, dispatch)

const mapStateToProps = state => {
  const {  keyword } = state
  return {  keyword }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchInput)