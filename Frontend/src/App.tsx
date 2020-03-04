import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import NavBar from 'components/NavBar';
import Dashboard from 'screens/Dashboard';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <NavBar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
