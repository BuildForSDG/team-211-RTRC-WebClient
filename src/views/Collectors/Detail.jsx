/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  customUsersUrl,
  getManagerUrl,
  deleteManagerUrl,
  protectRoute,
  protectOwnerRoute,
  getHeaders,
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
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
      manager: {},
      open: false,
      confirmDelete: false,
      showbuttons: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

    this.setState({ isLoading: true });
    const manager_id = this.props.match.params.id;
    axios
      .post(
        getManagerUrl,
        { manager_id: manager_id },
        { headers: getHeaders() }
      )
      .then(res => {
        this.setState({
          isLoading: false,
          manager: res.data,
          showbuttons: true
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error retrieving manager, retry.', err, this.props);
      });
  }

  componentWillMount() {
    protectRoute(this.props);
    protectOwnerRoute(this.props);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // delete
  handleDelete() {
    const { id } = this.state.manager;
    this.setState({ isLoading: true });

    axios
      .post(deleteManagerUrl, { manager_id: id }, { headers: getHeaders() })
      .then(res => {
        this.setState({ isLoading: false });
        successToast(toast, 'Manager Deleted Successfully!');
        this.props.history.push('/users');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error deleting manager, retry.', err, this.props);
      });
  }
  // end delete

  render() {
    const { manager, open, isLoading, showbuttons } = this.state;

    return (
      <DashboardLayout title="Manager Detail">
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>{manager.username}</b>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <b>Manager Email: </b>
                    {manager.email}
                  </div>
                  <div className="card-subtitle">
                    <b>Phone: </b>
                    {manager.phone}
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <Link to="/users">
                        <IconButton aria-label="Delete" size="small">
                          <ArrowBackIcon fontSize="inherit" />
                        </IconButton>
                      </Link>
                    </div>
                    <div className="col-md-4" />
                    {/* <div className="col-md-3">
                      <Link
                        to={
                          '/users/' +
                          manager.username +
                          '-' +
                          manager.id +
                          '/update'
                        }
                        className="btn btn-primary">
                        {'Update Manager'}
                      </Link>
                    </div> */}
                    {showbuttons && (
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={this.handleOpen}>
                          {'Delete Manager'}
                        </button>
                      </div>
                    )}
                  </div>
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
                    <Grid item lg={12} md={12} xl={12} xs={12}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-header text-danger">
                              Delete {manager.username} ?
                            </div>
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
        </Grid>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicles: state.vehiclesReducer.vehicles,
    // playback state
    open_playback_dialog: state.mapsReducer.open_playback_dialog
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
