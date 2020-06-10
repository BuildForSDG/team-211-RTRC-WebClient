import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

import axios from 'axios';
import { loginUrl, protectAuthRoute, errorToast, successToast } from 'config';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

class SignIn extends Component {
  componentWillMount() {
    protectAuthRoute(this.props);
  }

  state = {
    values: {
      email: '',
      password: ''
    },
    touched: {
      email: false,
      password: false
    },
    errors: {
      email: null,
      password: null
    },
    isValid: false,
    isLoading: false,
    submitError: null,
    serverErrors: null
  };

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  // login
  login = () => {
    const { history } = this.props;
    const { values } = this.state;
    this.setState({ isLoading: true });
    let authUser = {};

    axios
      .post(loginUrl, { email: values.email, password: values.password })
      .then(res => {
        // set user data.
        authUser.token = res.data.token;
        authUser.id = res.data.user.pk;
        authUser.username = res.data.user.username;
        authUser.is_staff = res.data.user.is_staff;
        authUser.is_collector = res.data.user.is_collector;
        authUser.is_user = res.data.user.is_user;
        authUser.email = res.data.user.email;
        authUser.phone = res.data.user.phone;
        authUser.name = res.data.user.name;
        localStorage.setItem('authUser', JSON.stringify(authUser));
        this.setState({ isLoading: false });
        this.props.setUser({ type: 'SET_USER', payload: authUser });

        successToast(toast, 'Login Successful!');
        history.push('/dashboard');
      })
      .catch(err => {
        if (err.response) {
          this.setState({
            isLoading: false,
            serviceError: err,
            serverErrors: err.response.data
          });
        } else {
          this.setState({
            isLoading: false,
            serviceError: err
          });
        }

        errorToast(toast, 'error connecting to server', err, this.props);
      });
  };
  // end login

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      serverErrors,
      isLoading
    } = this.state;

    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.quoteWrapper} item lg={5}>
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography className={classes.quoteText} variant="h1">
                  <b>E-REVENUE</b>
                </Typography>
                <div className={classes.person}>
                  <Typography className={classes.name} variant="body1">
                    toll collection innovatively...
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Sign in
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Email"
                      name="email"
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      type="text"
                      value={values.email}
                      variant="outlined"
                    />
                    {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2">
                        {errors.email[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label="Password"
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2">
                        {errors.password[0]}
                      </Typography>
                    )}
                  </div>
                  {serverErrors &&
                    serverErrors.non_field_errors.map(err => {
                      return (
                        <Typography
                          className={classes.fieldError}
                          variant="body2">
                          {err}
                        </Typography>
                      );
                    })}

                  {submitError && (
                    <Typography className={classes.submitError} variant="body2">
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={!isValid}
                      onClick={this.login}
                      size="large"
                      variant="contained">
                      Sign in now
                    </Button>
                  )}
                  {/* <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    Don't have an account?
                    <Link
                      className={classes.signUpUrl}
                      to="/signup"
                    >
                      Sign up
                    </Link>
                  </Typography> */}
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    setUserSettings: action =>
      dispatch({ type: action.type, payload: action.payload }),
    setUser: action => dispatch({ type: action.type, payload: action.payload })
  };
};

const connectSignIn = connect(null, mapDispatchToProps)(SignIn);

export default compose(withRouter, withStyles(styles))(connectSignIn);
