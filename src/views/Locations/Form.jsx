/* eslint-disable */
import React, { useEffect, useState } from 'react';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  TextField,
  Grid,
  CircularProgress,
  FilledInput
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Portlet, PortletLabel, PortletContent } from 'components';

// Component styles
import styles from './styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  locationsUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import constants from 'store/constants';

const LocationForm = props => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
  });

  const handleName = e => {
    setName(e.target.value);
  };

  const handleAddress = e => {
    setAddress(e.target.value);
  };

  // create new location
  const createLocation = e => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { name, address };

    axios
      .post(locationsUrl, payload, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Location Created!');
        props.history.push('/locations');
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response) {
          setServerErrors(err.response.data);
        }
        errorToast(toast, 'error creating location, retry.', err, props);
      });
    // end create request
  };
  // end create location

  const { className, classes } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <DashboardLayout title="Location Form">
      <div className={classes.root}>
        <Grid container spacing={4} className="mt-5">
          <Grid item lg={2} md={2} xl={2}>
            <div />
          </Grid>
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletContent className="mt-5">
                <div className="row">
                  <div className="col-md-4 offset-md-3">
                    <PortletLabel subtitle="" title="Add Location" />
                  </div>
                </div>
                <form autoComplete="off" noValidate>
                  <Grid container>
                    <Grid item md={3} />
                    <Grid item md={6}>
                      <TextField
                        className={classes.textField}
                        label="Name"
                        margin="dense"
                        required
                        variant="outlined"
                        name="name"
                        onChange={handleName}
                        value={name}
                      />
                      {serverErrors.name &&
                        serverErrors.name.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}

                      <TextField
                        className={classes.textField}
                        label="Address"
                        margin="dense"
                        required
                        variant="outlined"
                        name="address"
                        onChange={handleAddress}
                        value={address}
                      />
                      {serverErrors.address &&
                        serverErrors.address.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid xs={3} />
                    <Grid item xs={3}>
                      <Link to="/locations" className="btn btn-outline-primary">
                        <ArrowBackIcon />
                      </Link>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={3}>
                      {isLoading ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={createLocation}>
                          <SaveIcon /> Submit
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </PortletContent>
            </Portlet>
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

LocationForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LocationForm);
