import React, { useEffect } from 'react';

import { Grid, withStyles } from '@material-ui/core';

import PaymentCard from './PaymentCard';
import { useDispatch } from 'react-redux';
import constants from 'store/constants';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
    // height: '100vh'
  },
  item: {
    height: '100%'
  }
});

const Payments = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const payload = {
      token: props.match.params.token,
      email: props.match.params.email
    };

    dispatch({ type: constants.SET_PAYMENT, payload });
  }, []);

  return (
    <Grid container spacing={4}>
      {/* <Grid item lg={6} md={6} xl={6}>
            <SalesChart />
          </Grid> */}
      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={10} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={20} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={50} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={100} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={200} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={300} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={400} />
      </Grid>

      <Grid item lg={3} md={3} xl={3}>
        <PaymentCard amount={500} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Payments);
