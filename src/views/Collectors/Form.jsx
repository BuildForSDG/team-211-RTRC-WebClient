/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';

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
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Portlet, PortletLabel, PortletContent } from 'components';

// Component styles
import styles from './styles';
import axios from 'axios';
import {
  getHeaders,
  idTypesUrl,
  collectorsUrl,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import constants from 'store/constants';
import { setDisplayName } from 'recompose';

const CollectorForm = props => {
  const idTypes = useSelector(state => state.usersReducer.idTypes);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [nationalIdType, setNationalIdType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleEmail = e => {
    setEmail(e.target.value);

    if (e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      setEmailInvalid(true);
    } else {
      setEmailInvalid(false);
    }
  };

  const handleName = e => {
    setName(e.target.value);
  };

  const handleUsername = e => {
    setUsername(e.target.value);
  };

  const handlePhone = e => {
    setPhone(e.target.value);
  };

  const handleId = e => {
    setNationalId(e.target.value);
  };

  const handleIdType = e => {
    setNationalIdType(e.target.value);
  };

  // create new collector
  const createCollector = () => {
    setIsLoading(true);

    const payload = {
      username,
      email,
      phone,
      name,
      national_id: nationalId,
      national_id_type: nationalIdType
    };

    axios
      .post(collectorsUrl, payload, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Collector Created!');
        props.history.push('/collectors');
      })
      .catch(err => {
        setIsLoading(false);
        if (err.response) {
          setServerErrors(err.response.data);
        }
        errorToast(toast, 'error adding collectors, retry.', err, props);
      });
  };
  // end create new collector

  const getIdTypes = () => {
    setIsLoading(true);
    axios
      .get(idTypesUrl, { headers: getHeaders() })
      .then(res => {
        dispatch({ type: constants.SET_ID_TYPES, payload: res.data.results });
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error fetching ID Types', err, props);
      });
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getIdTypes();
  }, []);

  const classes = props;
  const { className } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <DashboardLayout title={`Collector Form`}>
      <div className={classes.root}>
        <Grid container spacing={4} className="mt-10">
          <Grid item lg={2} md={2} xl={2}>
            <div />
          </Grid>
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletContent>
                <Grid item lg={2} md={2} />
                <Grid item lg={8} md={8}>
                  <form autoComplete="off" noValidate>
                    <h4 className="text-center text-primary">
                      Add Collector <br />
                      Default password is <i>pass1234</i>
                    </h4>
                    <TextField
                      className={''}
                      label="Full Name"
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
                    <br />

                    <TextField
                      className={''}
                      label="Username"
                      margin="dense"
                      required
                      variant="outlined"
                      name="username"
                      onChange={handleUsername}
                      value={username}
                    />
                    {serverErrors.username &&
                      serverErrors.username.map(error => (
                        <div className="text-danger">{error}</div>
                      ))}
                    <br />

                    <TextField
                      className={''}
                      label="Email"
                      margin="dense"
                      required
                      variant="outlined"
                      name="email"
                      onChange={handleEmail}
                      value={email}
                    />
                    {serverErrors.email &&
                      serverErrors.email.map(error => (
                        <div className="text-danger">{error}</div>
                      ))}

                    <br />

                    <TextField
                      className={''}
                      label="Phone"
                      margin="dense"
                      required
                      variant="outlined"
                      name="phone"
                      onChange={handlePhone}
                      value={phone}
                    />
                    {serverErrors.phone &&
                      serverErrors.phone.map(error => (
                        <div className="text-danger">{error}</div>
                      ))}
                    <br />

                    <TextField
                      className={''}
                      label="National ID Number"
                      margin="dense"
                      required
                      variant="outlined"
                      name="nationalId"
                      onChange={handleId}
                      value={nationalId}
                    />
                    {serverErrors.national_id &&
                      serverErrors.national_id.map(error => (
                        <div className="text-danger">{error}</div>
                      ))}
                    <br />

                    <InputLabel id="national-id-type">ID Type</InputLabel>
                    <Select
                      labelId="national-id-type"
                      value={nationalIdType}
                      onChange={handleIdType}>
                      {idTypes.map(idtype => (
                        <MenuItem value={idtype.id} key={idtype.id}>
                          {idtype.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {serverErrors.national_id_type &&
                      serverErrors.national_id_type.map(error => (
                        <div className="text-danger">{error}</div>
                      ))}

                    <Grid container spacing={4}>
                      <Grid item lg={2} md={2} xs={2} />
                      <Grid item lg={3} md={3} xs={3}>
                        <Link to="/collectors">
                          <IconButton aria-label="Delete" size="small">
                            <ArrowBackIcon fontSize="inherit" />
                          </IconButton>
                        </Link>
                      </Grid>
                      <Grid item lg={2} md={2} xs={2} />
                      <Grid item lg={3} md={3} xs={3}>
                        {isLoading ? (
                          <CircularProgress className={classes.progress} />
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={createCollector}>
                            <SaveIcon /> Save
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </PortletContent>
            </Portlet>
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

CollectorForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CollectorForm);
