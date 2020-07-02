import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField, CircularProgress } from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

import axios from 'axios';
import {
  passwordChangeUrl,
  getHeaders,
  errorToast,
  successToast
} from 'config';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm: '',
      confirmError: false,
      isLoading: false
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSavePassword = this.handleSavePassword.bind(this);
  }

  handleFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSavePassword = e => {
    e.preventDefault();

    const { password, confirm } = this.state;

    if (password !== confirm) {
      this.setState({ confirmError: true });
    } else if (password === confirm) {
      this.setState({ confirmError: false });
      this.setState({ isLoading: true });

      const payload = {
        new_password1: password,
        new_password2: confirm
      };

      axios
        .post(passwordChangeUrl, payload, { headers: getHeaders() })
        .then(res => {
          this.setState({ isLoading: false });
          successToast(toast, 'Password Updated!');
          this.setState({ password: '', confirm: '' });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          errorToast(toast, 'error updating password, retry', err, this.props);
        });
    }
  };

  render() {
    const { classes, className, ...rest } = this.props;
    const { password, confirm, isLoading, confirmError } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName}>
        <PortletHeader>
          <PortletLabel subtitle="Update password" title="Change Password" />
        </PortletHeader>
        <PortletContent>
          <form className={classes.form}>
            <TextField
              className={classes.textField}
              label="Password"
              name="password"
              onChange={this.handleFieldChange}
              type="password"
              value={password}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              label="Confirm password"
              name="confirm"
              onChange={this.handleFieldChange}
              type="password"
              value={confirm}
              variant="outlined"
            />
            {confirmError && (
              <div className="text-danger">{"passwords don't match"}</div>
            )}
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          {isLoading ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <button
              className="btn btn-outline-primary"
              onClick={this.handleSavePassword}>
              Update
            </button>
          )}
        </PortletFooter>
      </Portlet>
    );
  }
}

Password.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const wrappedPassword = withRouter(Password);

export default withStyles(styles)(wrappedPassword);
