
import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, List } from '@material-ui/core'
import LatestWoops from 'components/LatestWoops';
import WhopChart from "components/WhopChart";
import api from 'utils/api-client';
import { IWhoop } from 'models/whoop';
import _ from "lodash";
import SummaryChart from 'components/SummaryChart';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",

      height: "500px",
      overflowY: "auto"
    }
  })
);

const Dashboard: React.FC = () => {

  const classes = useStyles();

  const [whoops, setWhoops] = useState<IWhoop[]>([]);
  const [lastFiveWhoops, setLastFiveWhoops] = useState<IWhoop[]>([]);

  useEffect(() => {
    api.Whoops.list()
      .then(response => {
        let sorted = _.orderBy(response, w => w.utcTick, "desc")
        setWhoops(response);
        setLastFiveWhoops(_.take(sorted, 5));
      })
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        {/* <Grid item xs={12} md={3}>
          <Paper className={classes.paper}>
            <Typography variant="h3" align="center">
              Total: {whoops.length}
            </Typography>
            <Divider />
          </Paper>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <List>
              {_.map(lastFiveWhoops, (whoop: IWhoop) => (
                <div key={whoop.userId}>
                  <LatestWoops whoop={whoop} />
                </div>
              ))} 
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <SummaryChart whoops={whoops} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <WhopChart whoops={_.groupBy(whoops, w => w.uNumber)} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
