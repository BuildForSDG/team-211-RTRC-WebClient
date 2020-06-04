/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  vehiclesUrl,
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
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

class VehicleUpdate extends Component {
  constructor(props) {
    super(props);
    this.signal = false;

    this.state = {
      isLoading: false,
      limit: 10,
      name: '',
      vehicle_id: '',
      vehicle_key: '',
      vehicle_sim_number: '',
      vehicle_unique_key: '',
      vehicle_name_error: false,
      vehicle_id_error: false,
      vehicle_key_error: false,
      vehicle_sim_number_error: false,
      vehicle_unique_key_error: false,
      serverError: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    // end hide playback button

    this.signal = true;

    this.setState({ isLoading: true });
    const vehicle_id = this.props.match.params.id;
    axios
      .get(vehiclesUrl + vehicle_id + '/', { headers: getHeaders() })
      .then(res => {
        this.setState({
          isLoading: false,
          id: res.data.id,
          name: res.data.name,
          vehicle_id: res.data.vehicle_id,
          vehicle_key: res.data.vehicle_key,
          vehicle_sim_number: res.data.vehicle_sim_number,
          vehicle_unique_key: res.data.vehicle_unique_key
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error retrieving vehicle, retry.', err, this.props);
      });
  }

  componentWillMount() {
    protectRoute(this.props);
    protectOwnerRoute(this.props);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // update new vehicle
  handleSubmit = () => {
    const {
      id,
      name,
      vehicle_id,
      vehicle_key,
      vehicle_sim_number,
      vehicle_unique_key
    } = this.state;

    if (name === '') {
      this.setState({ vehicle_name_error: true });
      this.setState({ vehicle_id_error: false });
      this.setState({ vehicle_key_error: false });
      this.setState({ vehicle_unique_key_error: false });
      this.setState({ vehicle_sim_number_error: false });
    } else if (vehicle_id === '') {
      this.setState({ vehicle_id_error: true });
      this.setState({ vehicle_name_error: false });
      this.setState({ vehicle_key_error: false });
      this.setState({ vehicle_unique_key_error: false });
      this.setState({ vehicle_sim_number_error: false });
    } else if (vehicle_key === '') {
      this.setState({ vehicle_key_error: true });
      this.setState({ vehicle_name_error: false });
      this.setState({ vehicle_id_error: false });
      this.setState({ vehicle_unique_key_error: false });
      this.setState({ vehicle_sim_number_error: false });
    } else if (vehicle_unique_key === '') {
      this.setState({ vehicle_unique_key_error: true });
      this.setState({ vehicle_name_error: false });
      this.setState({ vehicle_id_error: false });
      this.setState({ vehicle_key_error: false });
      this.setState({ vehicle_sim_number_error: false });
    } else if (vehicle_sim_number === '') {
      this.setState({ vehicle_sim_number_error: true });
      this.setState({ vehicle_name_error: false });
      this.setState({ vehicle_id_error: false });
      this.setState({ vehicle_key_error: false });
      this.setState({ vehicle_unique_key_error: false });
    } else {
      this.setState({ vehicle_name_error: false });
      this.setState({ vehicle_id_error: false });
      this.setState({ vehicle_key_error: false });
      this.setState({ vehicle_unique_key_error: false });
      this.setState({ vehicle_sim_number_error: false });
      this.setState({ isLoading: true });

      let payload = {
        name: name,
        vehicle_id: vehicle_id,
        vehicle_key: vehicle_key,
        vehicle_sim_number: vehicle_sim_number,
        vehicle_unique_key: vehicle_unique_key
      };

      axios
        .put(vehiclesUrl + id + '/', payload, { headers: getHeaders() })
        .then(res => {
          this.setState({ isLoading: false });
          successToast(toast, 'Vehicle Updated!');
          this.props.history.push(`/vehicles/${vehicle_id}-${id}`);
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: err.response.data });
          errorToast(toast, 'error updating vehicle, retry.', err, this.props);
        });
      // end update request
    }
  };
  // end update vehicle

  render() {
    const {
      name,
      id,
      vehicle_id,
      vehicle_key,
      vehicle_sim_number,
      vehicle_unique_key,
      vehicle_name_error,
      vehicle_id_error,
      vehicle_key_error,
      vehicle_sim_number_error,
      vehicle_unique_key_error,
      serverError
    } = this.state;

    return (
      <DashboardLayout title="Vehicle Detail">
        <Grid>
          <div className="row">
            <div className="col-md-6 offset-md-3 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>{name}</b>
                </div>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="name">Vehicle Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        onChange={this.handleChange}
                        value={name}
                        required
                      />
                    </div>
                    {vehicle_name_error && (
                      <div className="text-danger">name is required</div>
                    )}

                    {serverError.vehicle_name && (
                      <div className="text-danger" />
                    )}

                    <div className="form-group">
                      <label htmlFor="vehicle_id">Vehicle ID</label>
                      <input
                        type="text"
                        name="vehicle_id"
                        className="form-control"
                        onChange={this.handleChange}
                        value={vehicle_id}
                        required
                      />
                    </div>
                    {vehicle_id_error && (
                      <div className="text-danger">vehicle ID is required</div>
                    )}

                    {serverError.vehicle_id && (
                      <div className="text-danger">{''}</div>
                    )}

                    <div className="form-group">
                      <label htmlFor="vehice_key">Vehicle Key</label>
                      <input
                        type="text"
                        name="vehicle_key"
                        className="form-control"
                        onChange={this.handleChange}
                        value={vehicle_key}
                        required
                      />
                    </div>
                    {vehicle_key_error && (
                      <div className="text-danger">vehicle key is required</div>
                    )}

                    {serverError.vehicle_key && (
                      <div className="text-danger">{''}</div>
                    )}

                    <div className="form-group">
                      <label htmlFor="vehicle_unique_key">Tracker ID</label>
                      <input
                        type="text"
                        name="vehicle_unique_key"
                        className="form-control"
                        onChange={this.handleChange}
                        value={vehicle_unique_key}
                        required
                      />
                    </div>
                    {vehicle_unique_key_error && (
                      <div className="text-danger">
                        vehicle unique key is required
                      </div>
                    )}

                    {serverError.vehicle_unique_key && (
                      <div className="text-danger">
                        already exists for another user
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="vehicle_sim_number">
                        Vehicle SIM Number
                      </label>
                      <input
                        type="text"
                        name="vehicle_sim_number"
                        className="form-control"
                        onChange={this.handleChange}
                        value={vehicle_sim_number}
                        required
                      />
                    </div>
                    {vehicle_sim_number_error && (
                      <div className="text-danger">
                        vehicle sim number is required
                      </div>
                    )}

                    {serverError.vehicle_sim_number && (
                      <div className="text-danger">
                        already exists for another user
                      </div>
                    )}
                    {/* <input
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleSubmit}
                      value="Update"
                    /> */}
                    <div className="row mt-3">
                      <div className="col-md-2">
                        <Link to={'/vehicles/' + vehicle_id + '-' + id}>
                          <IconButton aria-label="Delete" size="small">
                            <ArrowBackIcon fontSize="inherit" />
                          </IconButton>
                        </Link>
                      </div>
                      <div className="col-md-4" />
                      <div className="col-md-3" />
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.handleSubmit}>
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* <Grid container spacing={4}>
            <Grid item xs={2} />
            <Grid item xs={6}>
              <Link to="/">
                <IconButton aria-label="Delete" size="small">
                  <ArrowBackIcon fontSize="inherit" />
                </IconButton>
              </Link>
            </Grid>
          </Grid> */}
        </Grid>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicles: state.vehiclesReducer.vehicles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showPlaybackButton: action =>
      dispatch({ type: action.type, payload: action.payload }),
    showOtherButtons: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VehicleUpdate);
