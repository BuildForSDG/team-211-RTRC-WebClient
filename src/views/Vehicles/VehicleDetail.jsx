/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  vehiclesUrl,
  getOwnerVehicleUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { Grid } from '@material-ui/core';
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

class VehicleDetails extends Component {
  constructor(props) {
    super(props);

    this.signal = false;

    this.state = {
      isLoading: false,
      limit: 10,
      vehicle: {},
      open: false,
      startOpen: false,
      stopOpen: false,
      confirmStart: false,
      confirmStop: false,
      confirmDelete: false,
      showbuttons: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleStartClose = this.handleStartClose.bind(this);
    this.handleStartOpen = this.handleStartOpen.bind(this);
    this.sendStartCommand = this.sendStartCommand.bind(this);

    this.handleStopClose = this.handleStopClose.bind(this);
    this.handleStopOpen = this.handleStopOpen.bind(this);
    this.sendStopCommand = this.sendStopCommand.bind(this);
  }

  componentWillMount() {
    protectRoute(this.props);
    protectOwnerRoute(this.props);
  }

  componentDidMount() {
    // hide playback button
    this.props.showPlaybackButton({
      type: 'SHOW_PLAYBACK_BUTTON',
      payload: false
    });
    this.props.showOtherButtons({
      type: 'SHOW_OTHER_BUTTONS',
      payload: false
    });
    // end hide playback button

    this.signal = true;

    // this.setState({ isLoading: true });
    const vehicle_id = this.props.match.params.id;
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    if (authUser.is_account_manager) {
      axios
        .post(getOwnerVehicleUrl, { vehicle_id }, { headers: getHeaders() })
        .then(res => {
          this.setState({
            isLoading: false,
            vehicle: res.data,
            showbuttons: true
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          errorToast(
            toast,
            'error retrieving vehicle, retry.',
            err,
            this.props
          );
        });
    } else if (authUser.is_account_owner) {
      axios
        .get(vehiclesUrl + vehicle_id + '/', { headers: getHeaders() })
        .then(res => {
          this.setState({
            isLoading: false,
            vehicle: res.data,
            showbuttons: true
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          errorToast(
            toast,
            'error retrieving vehicle, retry.',
            err,
            this.props
          );
        });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // delete
  handleDelete() {
    const { id } = this.state.vehicle;
    this.setState({ isLoading: true });

    axios
      .delete(vehiclesUrl + id + '/', { headers: getHeaders() })
      .then(res => {
        this.setState({ isLoading: false });
        successToast(toast, 'Vehicle Deleted Successfully!');
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error deleting vehicle, retry.', err, this.props);
      });
  }
  // end delete

  // start command handlers
  handleStartOpen = () => {
    this.setState({ startOpen: true });
  };

  handleStartClose = () => {
    this.setState({ startOpen: false });
  };

  sendStartCommand() {
    this.setState({ isLoading: true });
    let { id } = this.state.vehicle;
    const payload = {
      vehicle_id: id
    };
    console.log('id: ' + id);

    axios
      .post(vehiclesUrl + 'send_start_command/', payload, {
        headers: getHeaders()
      })
      .then(res => {
        this.setState({ isLoading: false, startOpen: false });
        successToast(toast, 'Start Command Sent Successfully!');
      })
      .catch(err => {
        this.setState({ isLoading: false, startOpen: false });
        errorToast(toast, 'SMS Error, retry.', err, this.props);
      });
  }

  // end start command handlers.

  // stop command handlers.
  handleStopOpen = () => {
    this.setState({ stopOpen: true });
  };

  handleStopClose = () => {
    this.setState({ stopOpen: false });
  };

  sendStopCommand() {
    this.setState({ isLoading: true });
    let { id } = this.state.vehicle;
    const payload = {
      vehicle_id: id
    };

    axios
      .post(vehiclesUrl + 'send_stop_command/', payload, {
        headers: getHeaders()
      })
      .then(res => {
        this.setState({ isLoading: false, stopOpen: false });
        successToast(toast, 'Stop Command Sent Successfully!');
      })
      .catch(err => {
        this.setState({ isLoading: false, stopOpen: false });
        errorToast(toast, 'SMS Error, retry.', err, this.props);
      });
  }
  // end stop command handlers.

  render() {
    const {
      vehicle,
      open,
      stopOpen,
      startOpen,
      isLoading,
      showbuttons
    } = this.state;

    return (
      <DashboardLayout title="Vehicle Detail">
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>{vehicle.name}</b>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <b>Vehicle ID: </b>
                    {vehicle.vehicle_id}
                  </div>
                  <div className="card-subtitle">
                    <b>Vehicle Key: </b>
                    {vehicle.vehicle_key}
                  </div>
                  <div className="card-subtitle">
                    <b>Tracker ID: </b>
                    {vehicle.vehicle_unique_key}
                  </div>
                  <div className="card-subtitle">
                    <b>Vehicle SIM Number: </b>
                    {vehicle.vehicle_sim_number}
                  </div>

                  {showbuttons && (
                    <div className="row mt-3">
                      <div className="col-md-2">
                        <Link to="/" className="btn btn-outline-primary">
                          <ArrowBackIcon /> Back
                        </Link>
                      </div>
                      <div className="col-md-2">
                        <Link
                          to={
                            '/vehicles/' +
                            vehicle.vehicle_id +
                            '-' +
                            vehicle.id +
                            '/update'
                          }
                          className="btn btn-primary">
                          {'Edit '} <Edit />
                        </Link>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-5">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={this.handleStartOpen}>
                              START CAR
                            </button>
                          </div>

                          <div className="col-md-1" />

                          <div className="col-md-5">
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={this.handleStopOpen}>
                              STOP CAR
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={this.handleOpen}>
                          {'Delete '} <Delete />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Confirm Delete
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            Delete {vehicle.name} ?
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button onClick={this.handleClose} color="primary">
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="red"
                          variant="contained"
                          onClick={this.handleDelete}>
                          DELETE
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>

          {/* start dialog */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={startOpen}
                onClose={this.handleStartClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Confirm START VEHICLE
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            START {vehicle.name} ?<br />
                            It could be dangerous for the car and driver!!
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button onClick={this.handleStartClose} color="primary">
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="red"
                          variant="contained"
                          onClick={this.sendStartCommand}>
                          START!
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
          {/* end start dialog */}

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={stopOpen}
                onClose={this.handleStopClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Confirm STOP VEHICLE
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            STOP {vehicle.name} ? <br />
                            It could be dangerous for the car and driver!!
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button onClick={this.handleStopClose} color="primary">
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="red"
                          variant="contained"
                          onClick={this.sendStopCommand}>
                          STOP!!
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicles: state.vehiclesReducer.vehicles,
    // playback state
    open_playback_dialog: state.mapsReducer.open_playback_dialog,
    is_account_owner: state.usersReducer.is_account_owner,
    is_account_manager: state.usersReducer.is_account_manager
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showPlaybackButton: action =>
      dispatch({ type: action.type, payload: action.payload }),
    showOtherButtons: action =>
      dispatch({ type: action.type, payload: action.payload }),
    openPlaybackDialog: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VehicleDetails);
