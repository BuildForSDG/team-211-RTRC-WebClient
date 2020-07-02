/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  locationsUrl,
  collectorsUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import constants from 'store/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import {
  Grid,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';
import PerfectScrollbar from 'react-perfect-scrollbar';
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

const LocationDetail = props => {
  const dispatch = useDispatch();
  const location = useSelector(state => state.tollsReducer.location);
  const collectors = useSelector(state => state.usersReducer.collectors);
  const [isLoading, setIsLoading] = useState(false);
  const [locationCollectors, setLocationCollectors] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [assignee, setAssignee] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  const getLocation = async () => {
    setIsLoading(true);
    const location_id = props.match.params.location_id;

    await axios
      .get(`${locationsUrl}${location_id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_LOCATION, payload: res.data });
        setName(res.data.name);
        setAddress(res.data.address);
        setLocationCollectors(res.data.collectors);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving location, retry.', err, props);
      });
  };

  const getCollectors = async () => {
    setIsLoading(true);

    await axios
      .get(collectorsUrl, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_COLLECTORS, payload: res.data.results });
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving collectors, retry.', err, props);
      });
  };

  // update
  const handleUpdate = e => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { name, address };

    axios
      .put(`${locationsUrl}${location.id}/`, payload, {
        headers: getHeaders()
      })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_LOCATION, payload: res.data });
        setOpenUpdateDialog(false);
        successToast(toast, 'location updated Successfully!');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error updating location, retry.', err, props);
        setServerErrors(err.response.data);
      });
  };
  // end update

  // delete
  const handleDelete = e => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .delete(`${locationsUrl}${location.id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Location Deleted Successfully!');
        props.history.push('/locations');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error deleting location, retry.', err, props);
      });
  };
  // end delete

  const handleAssign = async collector => {
    setIsLoading(true);
    const payload = { collector };
    await axios
      .put(`${locationsUrl}${location.id}/assign/`, payload, {
        headers: getHeaders()
      })
      .then(res => {
        setIsLoading(false);
        setOpenAssignDialog(false);
        successToast(toast, 'Collector Assigned Successfully!');
        dispatch({ type: constants.SET_LOCATION, payload: res.data });
        setLocationCollectors(res.data.collectors);
      })
      .catch(err => {
        setIsLoading(false);
        setOpenAssignDialog(false);
        errorToast(toast, 'error assigning collector, retry.', err, props);
      });
  };

  const handleRemove = async () => {
    setIsLoading(true);
    const payload = { collector: assignee.id };
    await axios
      .put(`${locationsUrl}${location.id}/remove/`, payload, {
        headers: getHeaders()
      })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Collector Removed Successfully!');
        setOpenRemoveDialog(false);
        dispatch({ type: constants.SET_LOCATION, payload: res.data });
        setLocationCollectors(res.data.collectors);
      })
      .catch(err => {
        setIsLoading(false);
        setOpenRemoveDialog(false);
        errorToast(toast, 'error removing collector, retry.', err, props);
      });
  };

  const handleName = e => {
    setName(e.target.value);
  };

  const handleAddress = e => {
    setAddress(e.target.value);
  };

  const handleAssignee = id => {
    const _collector = collectors.find(obj => obj.id === id);
    setAssignee(_collector);
    setOpenRemoveDialog(true);
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getLocation();
    getCollectors();
  }, []);

  const showLocation = location === {} ? false : true;

  return (
    <DashboardLayout title="Location">
      {showLocation && (
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>Name: </b>
                  {location.name}
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <b>Address: </b>
                    {location.address}
                  </div>

                  <div className="card-subtitle">
                    <b>Created: </b>
                    {new Date(location.created_at).toDateString()}
                  </div>
                  <div className="card-subtitle">
                    <b>Updated: </b>
                    {new Date(location.updated_at).toDateString()}
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <Link to="/locations" className="btn btn-outline-primary">
                        <ArrowBackIcon /> Back
                      </Link>
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setOpenUpdateDialog(true)}>
                        Update
                      </button>
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setOpenDeleteDialog(true)}>
                        Delete
                      </button>
                    </div>

                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => setOpenAssignDialog(true)}>
                        Assign Collector
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Portlet>
                  <PortletHeader noDivider>
                    <PortletLabel
                      subtitle={`${locationCollectors.length} in total`}
                      title="Collectors"
                    />
                  </PortletHeader>
                  <PerfectScrollbar>
                    <PortletContent noPadding>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Username</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Phone</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {locationCollectors.map((collect, index) => (
                            <TableRow hover key={collect.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Link to={`/collectors/${collect.id}`}>
                                  {collect.username}
                                </Link>
                              </TableCell>
                              <TableCell>{collect.email}</TableCell>
                              <TableCell>{collect.phone}</TableCell>
                              <TableCell>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={handleAssignee.bind(
                                    this,
                                    collect.id
                                  )}>
                                  Remove
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </PortletContent>
                  </PerfectScrollbar>
                </Portlet>
              </div>
            </div>
          </div>

          {/* Delete Dialog */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  <span className="text-danger">Confirm Delete</span>
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            Delete {location.name} ?
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleDelete}>
                          Delete
                        </button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
          {/* End Delete Dialog */}

          {/* Update Dialog */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Update Location
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={2} md={2} />
                    <Grid item lg={8} md={8}>
                      <TextField
                        className={''}
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
                        className={''}
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
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setOpenUpdateDialog(false)}>
                        Cancel
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleUpdate}>
                          Update
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
          {/* End Update Dialog */}

          {/* Assign Dialog */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openAssignDialog}
                onClose={() => setOpenAssignDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Assign Collector
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={1} md={1} />
                    <Grid item lg={10} md={10}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Username</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {collectors.map((collect, index) => (
                            <TableRow hover key={collect.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Link to={`/collectors/${collect.id}`}>
                                  {collect.username}
                                </Link>
                              </TableCell>
                              <TableCell>{collect.email}</TableCell>
                              <TableCell>
                                {isLoading ? (
                                  <CircularProgress />
                                ) : (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleAssign.bind(
                                      this,
                                      collect.id
                                    )}>
                                    Assign
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setOpenAssignDialog(false)}>
                        Cancel
                      </button>
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
          {/* End Assign Dialog */}

          {/* Remove Dialog */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openRemoveDialog}
                onClose={() => setOpenRemoveDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  <span className="text-danger">Confirm Remove</span>
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            Remove {assignee.name} ?
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setOpenRemoveDialog(false)}>
                        Cancel
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleRemove}>
                          Remove
                        </button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
          {/* End Remove Dialog */}
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default LocationDetail;
