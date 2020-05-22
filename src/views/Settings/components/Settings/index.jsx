import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  // Checkbox,
  Typography,
  // InputLabel,
  CircularProgress
} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

import axios from 'axios';
import { toast } from 'react-toastify';
import {
  VehiclesSettingsUrl,
  VehiclesSettingsCreateOrUpdateUrl,
  getHeaders,
  errorToast,
  successToast
} from 'config';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh_rate: this.props.refresh_rate,
      speed_limit: this.props.speed_limit,
      isLoading: false
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.saveVehicleSettings = this.saveVehicleSettings.bind(this);
  }

  componentDidMount() {
    // request for global settings
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
        errorToast(toast, 'error retrieving settings, retry.', err, this.props);
      });
    // request for settings
  }

  handleFieldChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  saveVehicleSettings(e) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const { refresh_rate, speed_limit } = this.state;

    const payload = {
      refresh_rate: refresh_rate,
      speed_limit: speed_limit
    };

    axios
      .post(VehiclesSettingsCreateOrUpdateUrl, payload, {
        headers: getHeaders()
      })
      .then(res => {
        this.setState({ isLoading: false });
        let settings = {};
        settings.refresh_rate = res.data.refresh_rate;
        settings.speed_limit = res.data.speed_limit;

        localStorage.setItem('settings', JSON.stringify(settings));

        this.props.setSettings({
          type: 'SET_SETTINGS',
          payload: settings
        });
        successToast(toast, 'Settings Updated!');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error saving settings, retry.', err, this.props);
      });
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    const { speed_limit, refresh_rate, isLoading } = this.state;

    return (
      <Portlet {...rest} className={rootClassName}>
        <PortletHeader>
          <PortletLabel subtitle="Manage Settings" title="Settings" />
        </PortletHeader>
        <PortletFooter className={classes.portletFooter}>
          <Typography className={classes.groupLabel} variant="h6">
            Vehicle settings
          </Typography>
          <form>
            <div className="form-group">
              <label htmlFor="refresh_rate">Refresh Rate (minutes)</label>
              <select
                className="form-control"
                name="refresh_rate"
                id="refresh_rate"
                onChange={this.handleFieldChange}>
                <option value={refresh_rate}>{refresh_rate}</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="speed_limit">Speed Limit (km/h)</label>
              <select
                className="form-control"
                name="speed_limit"
                id="speed_limit"
                onChange={this.handleFieldChange}>
                <option value={speed_limit}>{speed_limit}</option>
                <option value={50}>50</option>
                <option value={70}>70</option>
                <option value={80}>80</option>
                <option value={90}>90</option>
                <option value={100}>100</option>
                <option value={120}>120</option>
                <option value={140}>140</option>
                <option value={160}>160</option>
                <option value={180}>180</option>
                <option value={200}>200</option>
              </select>
            </div>
            {isLoading ? (
              <CircularProgress className={classes.progress} />
            ) : (
              <input
                type="button"
                value="Save"
                className="btn btn-outline-primary"
                onClick={this.saveVehicleSettings}
              />
            )}
          </form>
        </PortletFooter>
      </Portlet>
    );
  }
}

UserSettings.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    refresh_rate: state.settingsReducer.refresh_rate,
    speed_limit: state.settingsReducer.speed_limit
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSettings: action =>
      dispatch({ type: action.type, payload: action.payload }),
    setUser: action => dispatch({ type: action.type, payload: action.payload }),
    setVehicles: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const wrappedUserSettings = withRouter(UserSettings);

const connectSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedUserSettings);

export default withStyles(styles)(connectSettings);
