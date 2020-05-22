import React, { Component } from 'react';
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
import styles from '../styles';

import axios from 'axios';
import { getHeaders, vehiclesUrl, protectRoute } from 'config';
import { connect } from 'react-redux';

class VehicleForm extends Component {
  componentWillMount() {
    protectRoute(this.props);
  }

  componentDidMount() {
    // hide playback button
    this.props.showPlaybackButton({
      type: 'SHOW_PLAYBACK_BUTTON',
      payload: false
    });
    // end hide playback button
  }

  state = {
    vehicle_name: '',
    vehicle_id: '',
    vehicle_key: '',
    vehicle_unique_key: '',
    vehicle_sim_number: '',
    isLoading: false
  };

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
      vehicle_unique_key,
      vehicle_sim_number
    } = this.state;
    this.setState({ isLoading: true });

    let payload = {
      name: vehicle_name,
      vehicle_id: vehicle_id,
      vehicle_key: vehicle_key,
      vehicle_unique_key: vehicle_unique_key,
      vehicle_sim_number: vehicle_sim_number
    };

    axios
      .post(vehiclesUrl, payload, { headers: getHeaders() })
      .then(res => {
        this.context.history.push('/');
        // this.setState({ isLoading: false });
        // this.props.updateVehicles({
        //   type: 'UPDATE_VEHICLES',
        //   payload: res.data
        // });
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  };
  // end create new vehicle

  render() {
    const { classes, className, ...rest } = this.props;
    const {
      vehicle_id,
      vehicle_key,
      vehicle_name,
      vehicle_sim_number,
      vehicle_unique_key,
      isLoading
    } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <PortletContent>
          <PortletLabel subtitle="" title="Add Vehicle" />
          <form autoComplete="off" noValidate>
            <div className={classes.field}>
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
              <TextField
                className={classes.textField}
                label="Vehicle Unique Key"
                margin="dense"
                required
                variant="outlined"
                name="vehicle_unique_key"
                onChange={this.handleChange}
                value={vehicle_unique_key}
              />
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
            </div>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Link to="/">
                  <IconButton aria-label="Delete" size="small">
                    <ArrowBackIcon fontSize="inherit" />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item xs={6}>
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
    updateVehicles: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const VehicleFormConnect = connect(
  null,
  mapDispatchToProps
)(VehicleForm);

export default withStyles(styles)(VehicleFormConnect);
