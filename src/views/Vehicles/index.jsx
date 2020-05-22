import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
// Externals
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';

// Material components
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';
import { Dashboard as DashboardLayout } from 'layouts';

// Component styles
import styles from './styles';
import { connect } from 'react-redux';
import {
  errorToast,
  vehiclesUrl,
  getOwnerVehiclesUrl,
  VehiclesSettingsUrl,
  getOwnerVehicleSettings,
  getHeaders,
  protectRoute
} from 'config';
import axios from 'axios';
import { toast } from 'react-toastify';

class Vehicles extends Component {
  signal = false;

  state = {
    isLoading: false,
    limit: 10
  };

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

    // get vehicles
    // this.setState({ isLoading: true });
    if (this.props.is_account_manager) {
      axios
        .get(getOwnerVehiclesUrl, { headers: getHeaders() })
        .then(res => {
          // this.setState({ isLoading: false });
          this.props.setVehicles({ type: 'SET_VEHICLES', payload: res.data });
        })
        .catch(err => {
          // this.setState({ isLoading: false });
          errorToast(
            toast,
            'Error retrieving vehicles, retry.',
            err,
            this.props
          );
        });
    } else if (this.props.is_account_owner) {
      axios
        .get(vehiclesUrl, { headers: getHeaders() })
        .then(res => {
          // this.setState({ isLoading: false });
          this.props.setVehicles({ type: 'SET_VEHICLES', payload: res.data });
        })
        .catch(err => {
          // this.setState({ isLoading: false });
          errorToast(
            toast,
            'Error retrieving vehicles, retry.',
            err,
            this.props
          );
        });
    }
    // end get vehicles

    // request for global settings
    if (this.props.is_account_manager) {
      axios
        .get(getOwnerVehicleSettings, {
          headers: getHeaders()
        })
        .then(res => {
          if (res.data.length !== 0) {
            let settings = {};
            settings.refresh_rate = res.data[0].refresh_rate;
            settings.speed_limit = res.data[0].speed_limit;
            localStorage.setItem('settings', JSON.stringify(settings));

            this.props.setSettings({
              type: 'SET_SETTINGS',
              payload: settings
            });
          }
        })
        .catch(err => {
          errorToast(toast, 'server error, retry.', err, this.props);
        });
    } else if (this.props.is_account_owner) {
      axios
        .get(VehiclesSettingsUrl, {
          headers: getHeaders()
        })
        .then(res => {
          if (res.data.length !== 0) {
            let settings = {};
            settings.refresh_rate = res.data[0].refresh_rate;
            settings.speed_limit = res.data[0].speed_limit;
            localStorage.setItem('settings', JSON.stringify(settings));

            this.props.setSettings({
              type: 'SET_SETTINGS',
              payload: settings
            });
          }
        })
        .catch(err => {
          errorToast(toast, 'server error, retry.', err, this.props);
        });
    }
    // request for global settings
  }

  componentWillUnmount() {
    this.signal = false;
    protectRoute();
  }

  render() {
    const {
      classes,
      className,
      vehicles,
      is_account_owner,
      is_account_manager
    } = this.props;
    const { isLoading } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showVehicles = !isLoading && vehicles.length > 0;

    return (
      <DashboardLayout title="Vehicles">
        <Portlet className={rootClassName}>
          <PortletHeader noDivider>
            <PortletLabel
              subtitle={`${vehicles.length} in total`}
              title="Vehicles"
            />
            <PortletToolbar>
              {is_account_owner && (
                <Link to="/vehicles/add-new">
                  <Button
                    className={classes.newEntryButton}
                    color="primary"
                    size="small"
                    variant="outlined"
                  >
                    Add New
                  </Button>
                </Link>
              )}
            </PortletToolbar>
          </PortletHeader>
          <PerfectScrollbar>
            <PortletContent
              className={classes.portletContent}
              noPadding
            >
              {isLoading && (
                <div className={classes.progressWrapper}>
                  <CircularProgress />
                </div>
              )}
              {showVehicles && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Vehicle ID</TableCell>
                      <TableCell align="left">Vehicle Key</TableCell>
                      <TableCell align="left">Track</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle, index) => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={vehicle.id}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {is_account_owner && (
                            <Link
                              to={
                                '/vehicles/' +
                                vehicle.vehicle_id +
                                '-' +
                                vehicle.id
                              }
                            >
                              {vehicle.name}
                            </Link>
                          )}

                          {is_account_manager && vehicle.name}
                        </TableCell>
                        <TableCell className={classes.customerCell}>
                          {vehicle.vehicle_id}
                        </TableCell>
                        <TableCell>{vehicle.vehicle_key}</TableCell>
                        <TableCell>
                          <Link
                            title={'track ' + vehicle.name}
                            to={
                              '/map/' + vehicle.vehicle_id + '-' + vehicle.id
                            }
                          >
                            <NavigationIcon />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </PortletContent>
          </PerfectScrollbar>
        </Portlet>
      </DashboardLayout>
    );
  }
}

Vehicles.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    vehicles: state.vehiclesReducer.vehicles,
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
    setVehicles: action =>
      dispatch({ type: action.type, payload: action.payload }),
    setSettings: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};
const wrappedVehicle = withRouter(Vehicles);
const connectVehicles = connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedVehicle);

export default withStyles(styles)(connectVehicles);
