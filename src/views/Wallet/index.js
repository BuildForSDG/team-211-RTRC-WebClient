/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  walletUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import axios from 'axios';
import { toast } from 'react-toastify';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon, Edit, Delete } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const Wallet = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState({});

  const getStats = async () => {
    setIsLoading(true);

    await axios
      .get(`${walletUrl}stats/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        setWallet(res.data.results);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving statistics, retry.', err, props);
      });
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getStats();
  }, []);

  const showWallet = wallet === {} ? false : true;

  return (
    <DashboardLayout title="Wallet">
      {showWallet && (
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header text-center">
                  <b>Total Wallet Balance: Ghc. {wallet.total_balance}</b>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card-title">
                        <b>Average Balance: </b>
                        Ghc. {wallet.average_balance}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card-title">
                        <b>Total Users: </b>
                        {wallet.users}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card-title">
                        <b>Minimum Balance: </b>
                        Ghc. {wallet.min_balance}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card-title">
                        <b>Maximum Balance: </b>
                        Ghc. {wallet.max_balance}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <Link to="/" className="btn btn-outline-primary">
                        <ArrowBackIcon /> Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Wallet;
