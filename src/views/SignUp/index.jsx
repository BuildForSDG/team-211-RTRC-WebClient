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
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';

// Shared utilities
import validators from 'common/validators';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';

import axios from 'axios';
import {
  registerUrl,
  protectAuthRoute,
  errorToast,
  successToast
} from 'config';
import { toast } from 'react-toastify';

validate.validators.checked = validators.checked;

class SignUp extends Component {
  componentWillMount() {
    protectAuthRoute(this.props);
  }

  state = {
    values: {
      username: '',
      email: '',
      name: '',
      phone: '',
      password: '',
      confirm: '',
      policy: false
    },
    touched: {
      email: false,
      username: false,
      name: false,
      phone: false,
      password: false,
      confirm: false,
      policy: null
    },
    errors: {
      username: null,
      email: null,
      name: false,
      phone: false,
      password: null,
      confirm: null,
      policy: null
    },
    isValid: false,
    isLoading: false,
    submitError: null,
    passwordMismatch: false,
    serverErrors: {
      email: [],
      username: [],
      phone: [],
      name: [],
      password1: []
    }
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

  // signup
  signUp = () => {
    const { values } = this.state;

    if (values.password !== values.confirm) {
      this.setState({ passwordMismatch: true });
    } else {
      this.setState({ passwordMismatch: false });
      const { history } = this.props;

      this.setState({ isLoading: true });

      const newServerErrors = this.state.serverErrors;
      newServerErrors.email = [];
      newServerErrors.phone = [];
      newServerErrors.name = [];
      newServerErrors.password1 = [];
      newServerErrors.username = [];
      this.setState({ serverErrors: newServerErrors });

      const payload = {
        username: values.username,
        email: values.email,
        name: values.name,
        phone: values.phone,
        password1: values.password,
        password2: values.password
      };

      axios
        .post(registerUrl, payload)
        .then(res => {
          this.setState({ isLoading: false });
          successToast(toast, 'Registration Successful!');
          history.push('/login');
        })
        .catch(err => {
          if (err.response) {
            this.setState({
              isLoading: false,
              serverErrors: err.response.data
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
          errorToast(
            toast,
            'error connecting to server, try again.',
            err,
            this.props
          );
        });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading,
      passwordMismatch,
      serverErrors
    } = this.state;

    const showUsernameError =
      touched.username && errors.username ? errors.username[0] : false;
    const showPhoneError =
      touched.phone && errors.phone ? errors.phone[0] : false;
    const showNameError = touched.name && errors.name ? errors.name[0] : false;
    const showEmailError =
      touched.email && errors.email ? errors.email[0] : false;
    const showPasswordError =
      touched.password && errors.password ? errors.password[0] : false;
    const showConfirmError =
      touched.confirm && errors.confirm ? errors.confirm[0] : false;
    const showPolicyError =
      touched.policy && errors.policy ? errors.policy[0] : false;

    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.quoteWrapper}
            item
            lg={5}
          >
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography
                  className={classes.quoteText}
                  variant="h1"
                >
                  <b>E-REVENUE</b>
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    toll collection innovatively...
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Create new account
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    Use your work email to create new account... it's free.
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Username"
                      onChange={event =>
                        this.handleFieldChange('username', event.target.value)
                      }
                      value={values.username}
                      variant="outlined"
                    />
                    {showUsernameError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.username[0]}
                      </Typography>
                    )}

                    {serverErrors.username &&
                      serverErrors.username.map(err => {
                        return (
                          <Typography
                            className={classes.fieldError}
                            variant="body2"
                          >
                            {err}
                          </Typography>
                        );
                      })}

                    <TextField
                      className={classes.textField}
                      label="Name"
                      onChange={event =>
                        this.handleFieldChange('name', event.target.value)
                      }
                      value={values.name}
                      variant="outlined"
                    />
                    {showNameError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.name[0]}
                      </Typography>
                    )}

                    {serverErrors.name &&
                      serverErrors.name.map(err => {
                        return (
                          <Typography
                            className={classes.fieldError}
                            variant="body2"
                          >
                            {err}
                          </Typography>
                        );
                      })}

                    <TextField
                      className={classes.textField}
                      label="Phone"
                      onChange={event =>
                        this.handleFieldChange('phone', event.target.value)
                      }
                      value={values.phone}
                      variant="outlined"
                    />
                    {showPhoneError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.phone[0]}
                      </Typography>
                    )}

                    {serverErrors.phone &&
                      serverErrors.phone.map(err => {
                        return (
                          <Typography
                            className={classes.fieldError}
                            variant="body2"
                          >
                            {err}
                          </Typography>
                        );
                      })}

                    <TextField
                      className={classes.textField}
                      label="Email address"
                      name="email"
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      value={values.email}
                      variant="outlined"
                    />
                    {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.email[0]}
                      </Typography>
                    )}
                    {serverErrors.email &&
                      serverErrors.email.map(err => {
                        return (
                          <Typography
                            className={classes.fieldError}
                            variant="body2"
                          >
                            {err}
                          </Typography>
                        );
                      })}

                    <TextField
                      className={classes.textField}
                      label="Password"
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
                        variant="body2"
                      >
                        {errors.password[0]}
                      </Typography>
                    )}
                    {serverErrors.password1 &&
                      serverErrors.password1.map(err => {
                        return (
                          <Typography
                            className={classes.fieldError}
                            variant="body2"
                          >
                            {err}
                          </Typography>
                        );
                      })}

                    <TextField
                      className={classes.textField}
                      label="Confirm Password"
                      onChange={event =>
                        this.handleFieldChange('confirm', event.target.value)
                      }
                      type="password"
                      value={values.confirm}
                      variant="outlined"
                    />
                    {showConfirmError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.confirm[0]}
                      </Typography>
                    )}

                    {passwordMismatch && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        Passwords don't match
                      </Typography>
                    )}

                    <div className={classes.policy}>
                      <Checkbox
                        checked={values.policy}
                        className={classes.policyCheckbox}
                        color="primary"
                        name="policy"
                        onChange={() =>
                          this.handleFieldChange('policy', !values.policy)
                        }
                      />
                      <Typography
                        className={classes.policyText}
                        variant="body1"
                      >
                        I have read the &nbsp;
                        <Link
                          className={classes.policyUrl}
                          to="#"
                        >
                          Terms and Conditions
                        </Link>
                        .
                      </Typography>
                    </div>
                    {showPolicyError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.policy[0]}
                      </Typography>
                    )}
                  </div>
                  {submitError && (
                    <Typography
                      className={classes.submitError}
                      variant="body2"
                    >
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Button
                      className={classes.signUpButton}
                      color="primary"
                      disabled={!isValid}
                      onClick={this.signUp}
                      size="large"
                      variant="contained"
                    >
                      Sign up now
                    </Button>
                  )}
                  <Typography
                    className={classes.signIn}
                    variant="body1"
                  >
                    Have an account?{' '}
                    <Link
                      className={classes.signInUrl}
                      to="/login"
                    >
                      Sign In
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignUp.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignUp);
