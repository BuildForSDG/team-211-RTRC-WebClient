/* eslint-disable */
import React, { Component } from 'react';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField, Grid, CircularProgress } from '@material-ui/core';
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
  getHeaders,
  vehiclesUrl,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

class VehicleForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vehicle_name: '',
      vehicle_id: '',
      vehicle_key: '',
      vehicle_unique_key: '',
      vehicle_sim_number: '',
      isLoading: false,
      submitError: true,
      vehicle_name_error: false,
      vehicle_id_error: false,
      vehicle_key_error: false,
      vehicle_unique_key_error: false,
      vehicle_sim_number_error: false
    };

    this.handleChange = this.handleChange.bind(this);
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
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // create new vehicle
  createVehicle = () => {
    const {
      vehicle_name,
      vehicle_id,
      vehicle_key,
      vehicle_sim_number,
      vehicle_unique_key
    } = this.state;

    if (vehicle_name === '') {
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
        name: vehicle_name,
        vehicle_id: vehicle_id,
        vehicle_key: vehicle_key,
        vehicle_sim_number: vehicle_sim_number,
        vehicle_unique_key: vehicle_unique_key
      };

      axios
        .post(vehiclesUrl, payload, { headers: getHeaders() })
        .then(res => {
          this.setState({ isLoading: false });
          this.props.updateVehicles({
            type: 'UPDATE_VEHICLES',
            payload: res.data
          });
          successToast(toast, 'Vehicle Created!');
          this.props.history.push('/');
        })
        .catch(err => {
          this.setState({ isLoading: false });
          errorToast(toast, 'error creating vehicle, retry.', err, this.props);
        });
      // end create request
    }
  };
  // end create new vehicle

  render() {
    const classes = this.props;
    const { className, ...rest } = this.props;
    const {
      vehicle_id,
      vehicle_key,
      vehicle_name,
      vehicle_sim_number,
      vehicle_unique_key,
      vehicle_name_error,
      vehicle_id_error,
      vehicle_key_error,
      vehicle_unique_key_error,
      vehicle_sim_number_error,
      isLoading
    } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <DashboardLayout title="Vehicle Form">
        <div className={classes.root}>
          <Grid container spacing={4} className="mt-5">
            <Grid item lg={2} md={2} xl={2}>
              <div />
            </Grid>
            <Grid item lg={8} md={8} xl={8} xs={12}>
              <Portlet {...rest} className={rootClassName}>
                <PortletContent>
                  <PortletLabel subtitle="" title="Add Vehicle" />
                  <form autoComplete="off" noValidate>
                    <Grid container spacing={4}>
                      <Grid item md={4} />
                      <Grid item md={4}>
                        <TextField
                          className={classes.textField}
                          label="Vehicle Name"
                          margin="dense"
                          required
                          variant="outlined"
                          name="vehicle_name"
                          onChange={this.handleChange}
                          value={vehicle_name}
                        />
                        {vehicle_name_error && (
                          <div className="text-danger">
                            vehicle name is required
                          </div>
                        )}

                        <TextField
                          className={classes.textField}
                          label="Vehicle Id"
                          margin="dense"
                          required
                          variant="outlined"
                          name="vehicle_id"
                          onChange={this.handleChange}
                          value={vehicle_id}
                        />
                        {vehicle_id_error && (
                          <div className="text-danger">
                            vehicle ID is required
                          </div>
                        )}

                        <TextField
                          className={classes.textField}
                          label="Vehicle Key"
                          margin="dense"
                          required
                          variant="outlined"
                          name="vehicle_key"
                          onChange={this.handleChange}
                          value={vehicle_key}
                        />
                        {vehicle_key_error && (
                          <div className="text-danger">
                            vehicle key is required
                          </div>
                        )}

                        <TextField
                          className={classes.textField}
                          label="Tracker ID"
                          margin="dense"
                          required
                          variant="outlined"
                          name="vehicle_unique_key"
                          onChange={this.handleChange}
                          value={vehicle_unique_key}
                        />
                        {vehicle_unique_key_error && (
                          <div className="text-danger">
                            vehicle unique key is required
                          </div>
                        )}

                        <TextField
                          className={classes.textField}
                          label="Vehicle SIM Number"
                          margin="dense"
                          required
                          variant="outlined"
                          name="vehicle_sim_number"
                          onChange={this.handleChange}
                          value={vehicle_sim_number}
                        />
                        {vehicle_sim_number_error && (
                          <div className="text-danger">
                            vehicle sim number is required
                          </div>
                        )}
                      </Grid>
                    </Grid>

                    <Grid container spacing={4}>
                      <Grid xs={4} />
                      <Grid item xs={2}>
                        <Link to="/" title="vehicles home">
                          <IconButton aria-label="Delete" size="small">
                            <ArrowBackIcon fontSize="inherit" />
                          </IconButton>
                        </Link>
                      </Grid>
                      <Grid item xs={2}>
                        {isLoading ? (
                          <CircularProgress className={classes.progress} />
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={this.createVehicle}>
                            <SaveIcon /> Save
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
  }
}

VehicleForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    showPlaybackButton: action =>
      dispatch({ type: action.type, payload: action.payload }),
    showOtherButtons: action =>
      dispatch({ type: action.type, payload: action.payload }),
    updateVehicles: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const VehicleFormConnect = connect(
  null,
  mapDispatchToProps
)(VehicleForm);

export default withStyles(styles)(VehicleFormConnect);
