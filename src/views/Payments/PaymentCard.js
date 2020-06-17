import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  CardActions,
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import constants from 'store/constants';
import { paymentsUrl } from 'config';
import Payment from './Payment';
import { errorToast } from './utils';

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const PaymentCard = props => {
  const dispatch = useDispatch();
  const { token, email, reference, openPaymentDialog, amount } = useSelector(
    state => state.paymentsReducer
  );

  const [loading, setLoading] = useState(false);
  const [localAmount, setLocalAmount] = useState(null);

  useEffect(() => {
    setLocalAmount(props.amount);
  }, []);

  const getReference = e => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    setLoading(true);

    dispatch({
      type: constants.SET_PAYMENT_AMOUNT,
      payload: props.amount
    });

    axios
      .post(paymentsUrl, { amount: props.amount }, { headers })
      .then(res => {
        setLoading(false);
        dispatch({
          type: constants.SET_PAYMENT_AMOUNT,
          payload: res.data.amount
        });
        dispatch({ type: constants.SET_REFERENCE, payload: res.data.ref_code });
        dispatch({ type: constants.OPEN_PAYMENT_DIALOG, payload: true });
      })
      .catch(err => {
        setLoading(false);
        if (err.response) {
          errorToast(toast, 'Error Retrieving Reference', err);
        } else {
          errorToast(toast, 'check connection', err);
        }
      });
  };

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom>
            Amount To Pay
          </Typography>
          <Typography variant="h5" component="h2">
            {bull}GHS{bull} {localAmount}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={getReference}>
            Start Payment
          </Button>
        </CardActions>
      </Card>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <Dialog
            open={openPaymentDialog}
            onClose={() => {
              dispatch({ type: constants.OPEN_PAYMENT_DIALOG, payload: false });
            }}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" className="text-danger">
              <span className="text-primary">Confirm Payment Process</span>
            </DialogTitle>
            <DialogContent>
              <Grid>
                <Grid item lg={8} md={8} xl={8} xs={10}>
                  <div className="row">
                    <div className="col-md-8 offset-md-2">
                      <div className="text-primary">Pay Ghc. {amount} ?</div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Button
                    onClick={() => {
                      dispatch({
                        type: constants.OPEN_PAYMENT_DIALOG,
                        payload: false
                      });
                    }}
                    color="primary">
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  {loading ? <CircularProgress /> : <Payment />}
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default PaymentCard;
