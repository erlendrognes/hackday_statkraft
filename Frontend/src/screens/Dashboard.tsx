import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, List } from '@material-ui/core'
import LatestWoops from 'components/LatestWoops';
import api from 'utils/api-client';
import { IWhoop } from 'models/whoop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',

      height: "100%",
    },
  }),
);

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const [whoops, setWhoops] = useState<IWhoop[]>([]);

  useEffect(() => {
    api.Whoops.list()
    .then(response => {
      setWhoops(response);
    })
  }, []);

   return (
    <div className={classes.root}>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <List>
              {whoops.map(whoop => (
                <LatestWoops key={whoop.id} whoop={whoop} />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>Data here...</Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>Data here...</Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>Data here...</Paper>
        </Grid>
      </Grid>

    </div>
  )
}

export default Dashboard;
