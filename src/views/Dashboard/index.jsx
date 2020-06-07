import React, { useEffect, useState } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { SalesChart } from './components';
import { Count, Money } from './components';

import {
  protectRoute,
  usersUrl,
  getHeaders,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import constants from 'store/constants';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
    // height: '100vh'
  },
  item: {
    height: '100%'
  }
});

const Dashboard = props => {
  const statistics = useSelector(state => state.usersReducer.statistics);
  const dispatch = useDispatch();

  const getStatistics = () => {
    protectRoute(props);
    axios
      .get(`${usersUrl}stats/`, { headers: getHeaders() })
      .then(res => {
        dispatch({
          type: constants.SET_STATISTICS,
          payload: res.data.results
        });
      })
      .catch(err => {
        errorToast(
          toast,
          'Error retrieving statistics, Reload Page',
          err,
          props
        );
      });
  };

  useEffect(() => {
    protectRoute(props);
    getStatistics();
  }, []);

  const { classes } = props;

  return (
    <DashboardLayout title="Dashboard">
      <Grid className={classes.root} container spacing={4}>
        {/* <Grid item lg={6} md={6} xl={6}>
            <SalesChart />
          </Grid> */}
        <Grid item lg={3} md={3} xl={3}>
          <Money title="Total Wallet" data={statistics.total_wallet} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Money title="Total Deposits" data={statistics.total_deposits} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Money title="Total Payments" data={statistics.total_transactions} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Count title="Total Locations" data={statistics.total_locations} />
        </Grid>

        <Grid item lg={3} md={3} xl={3}>
          <Count title="Total Vehicles" data={statistics.total_vehicles} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Count title="Total Categories" data={statistics.total_categories} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Count title="Total Drivers" data={statistics.total_drivers} />
        </Grid>
        <Grid item lg={3} md={3} xl={3}>
          <Count title="Total Collectors" data={statistics.total_collectors} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
