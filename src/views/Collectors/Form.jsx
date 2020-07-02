/* eslint-disable */
import React, { useState, useEffect } from 'react';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import styles from './styles';
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
import {
  Portlet,
  PortletLabel,
  PortletContent,
  PortletToolbar
} from 'components';

// Component styles
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

  const { className, classes } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <DashboardLayout title={`Collector Form`}>
      <Grid>
        <div className="row">
          <div className="col-md-8 offset-md-2 mt-5">
            <Portlet className={rootClassName}>
              <PortletContent className="mt-5">
                <div className="row">
                  <div className="col-md-2 offset-md-2">
                    <PortletLabel subtitle="" title="Add Collector" />
                  </div>
                  <div className="col-md-4">
                    <PortletToolbar>
                      <span className="badge badge-primary">
                        Default password is <i>pass1234</i>
                      </span>
                    </PortletToolbar>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8 offset-2">
                    <form autoComplete="off" noValidate>
                      <TextField
                        className={classes.textField}
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
                        className={classes.textField}
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
                        className={classes.textField}
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
                        className={classes.textField}
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
                        className={classes.textField}
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
                      <div className="row">
                        <div className="col-md-12">
                          <InputLabel id="national-id-type">ID Type</InputLabel>
                          <Select
                            value={nationalIdType}
                            onChange={handleIdType}
                            name="national-id-type"
                            id="national-id-type">
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
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-4">
                          <Link
                            to="/collectors"
                            className="btn btn-outline-primary">
                            <ArrowBackIcon />
                          </Link>
                        </div>
                        <div className="col-md-3" />

                        <div className="col-md-4">
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
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </PortletContent>
            </Portlet>
          </div>
        </div>
      </Grid>
    </DashboardLayout>
  );
};

CollectorForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CollectorForm);
