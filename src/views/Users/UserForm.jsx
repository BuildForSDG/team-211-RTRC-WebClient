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
import axios from 'axios';
import {
  getHeaders,
  customUsersUrl,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      phone: '',
      isLoading: false,
      submitError: true,
      username_error: false,
      email_error: false,
      email_invalid: 'false',
      phone_error: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    protectRoute(this.props);
    protectOwnerRoute(this.props);
  }

  componentDidMount() {
    // hide buttons
    this.props.showPlaybackButton({
      type: 'SHOW_PLAYBACK_BUTTON',
      payload: false
    });

    this.props.showOtherButtons({ type: 'SHOW_OTHER_BUTTONS', payload: false });
    // end hide buttons
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if ([e.target.name] == 'email') {
      if (e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        this.setState({ email_invalid: true });
      } else {
        this.setState({ email_invalid: false });
      }
    }
  };

  // create new manager
  createManager = () => {
    const { username, email, phone } = this.state;

    if (username === '') {
      this.setState({ username_error: true });
      this.setState({ email_error: false });
      this.setState({ phone_error: false });
    } else if (email === '') {
      this.setState({ email_error: true });
      this.setState({ username_error: false });
      this.setState({ phone_error: false });
    } else if (phone === '') {
      this.setState({ phone_error: true });
      this.setState({ username_error: false });
      this.setState({ email_error: false });
    } else {
      this.setState({ phone_error: false });
      this.setState({ username_error: false });
      this.setState({ email_error: false });
      this.setState({ isLoading: true });

      let payload = {
        username: username,
        email: email,
        phone: phone
      };

      axios
        .post(customUsersUrl, payload, { headers: getHeaders() })
        .then(res => {
          this.setState({ isLoading: false });
          successToast(toast, 'Manager Created!');
          this.props.history.push('/users');
        })
        .catch(err => {
          this.setState({ isLoading: false });
          errorToast(toast, 'error adding manager, retry.', err, this.props);
        });
      // end create request
    }
  };
  // end create new manager

  render() {
    const classes = this.props;
    const { className, ...rest } = this.props;
    const {
      username,
      email,
      phone,
      username_error,
      email_error,
      email_invalid,
      phone_error,
      isLoading
    } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <DashboardLayout title={`Manager Form`}>
        <div className={classes.root}>
          <Grid container spacing={4} className="mt-10">
            <Grid item lg={2} md={2} xl={2}>
              <div />
            </Grid>
            <Grid item lg={8} md={8} xl={8} xs={12}>
              <Portlet {...rest} className={rootClassName}>
                <PortletContent>
                  <div className="row">
                    <div className="col-md-8 offset-md-2">
                      <form autoComplete="off" noValidate>
                        <h4 className="text-center text-primary">
                          Add Manager (default password is <i>changeme</i>)
                        </h4>
                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            onChange={this.handleChange}
                            value={username}
                            required
                          />
                        </div>

                        {username_error && (
                          <div className="text-danger">
                            Username is required
                          </div>
                        )}

                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            onChange={this.handleChange}
                            value={email}
                            required
                          />
                          {email_error && (
                            <div className="text-danger">Email is required</div>
                          )}

                          {!email_invalid && (
                            <div className="text-danger">Email is invalid</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            onChange={this.handleChange}
                            value={phone}
                            required
                          />
                          {phone_error && (
                            <div className="text-danger">Phone is required</div>
                          )}
                        </div>

                        <Grid container spacing={4}>
                          <Grid item xs={3}>
                            <Link to="/users">
                              <IconButton aria-label="Delete" size="small">
                                <ArrowBackIcon fontSize="inherit" />
                              </IconButton>
                            </Link>
                          </Grid>
                          <Grid item xs={6} />
                          <Grid item xs={3}>
                            {isLoading ? (
                              <CircularProgress className={classes.progress} />
                            ) : (
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={this.createManager}>
                                <SaveIcon /> Save
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </form>
                    </div>
                  </div>
                </PortletContent>
              </Portlet>
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

UserForm.propTypes = {
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

const UserFormConnect = connect(
  null,
  mapDispatchToProps
)(UserForm);

export default withStyles(styles)(UserFormConnect);
