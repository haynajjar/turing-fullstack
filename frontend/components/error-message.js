import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

export default function ErrorMessage({message}) {
  const classes = useStyles();

  if(!message)
    return null
  
  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" color="secondary">
          Problem Occured
        </Typography>
        <Typography component="p" color="secondary">
          {message}
        </Typography>
      </Paper>
    </div>
  );
}