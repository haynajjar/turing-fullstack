import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Departments from '../components/departments'
import DepartmentDisplay from '../components/department-display'

import { connect } from 'react-redux'
import {selectedDep, selectDepartment} from '../store'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

class Shop extends React.Component {

  static getInitialProps ({ reduxStore, req }) {
    //const isServer = !!req
    // DISPATCH ACTIONS HERE ONLY WITH `reduxStore.dispatch`
    reduxStore.dispatch(selectedDep())

    return {}
  }

  componentDidMount () {
    // DISPATCH ACTIONS HERE FROM `mapDispatchToProps`
    // TO TICK THE CLOCK
    //this.timer = setInterval(() => this.props.startClock(), 1000)
    //this.props.selectedDep()
  }

  // componentWillUnmount () {
  //   clearInterval(this.timer)
  // }

  render(){
    return (
      <div >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper >xs=12</Paper>
          </Grid>
          <Grid item xs={3}>
            <Departments />
          </Grid>
          <Grid item xs={9}>
            <DepartmentDisplay />

          </Grid>
          
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = { selectedDep, selectDepartment }
export default connect(
  null,
  mapDispatchToProps
)(Shop)

