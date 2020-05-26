/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  managersUrl,
  customUsersUrl,
  getManagerUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute
} from 'config';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

class UserUpdate extends Component {
  constructor(props) {
    super(props);
    this.signal = false;

    this.state = {
      isLoading: false,
      limit: 10,
      username: '',
      phone: '',
      email: '',
      username_error: false,
      email_error: false,
      phone_error: false,
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

    this.signal = true;

    this.setState({ isLoading: true });
    const manager_id = this.props.match.params.id;
    axios
      .post(getManagerUrl, { manager_id }, { headers: getHeaders() })
      .then(res => {
        this.setState({
          isLoading: false,
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        toast.error('Something went wrong, Try Again', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
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
    const { id, username, email, phone } = this.state;

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
      this.setState({ email_error: false });
      this.setState({ username_error: false });
      this.setState({ phone_error: false });
      this.setState({ isLoading: true });

      let payload = {
        username: username,
        email: email,
        phone: phone
      };
      0;

      axios
        .patch(customUsersUrl + id + '/', payload, { headers: getHeaders() })
        .then(res => {
          this.setState({ isLoading: false });
          toast.success('Manager Updated!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
          this.props.history.push(`/users/${username}-${id}`);
        })
        .catch(err => {
          this.setState({ isLoading: false, serverError: err.response.data });
          toast.error('Something went wrong, Try Again', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        });
      // end update request
    }
  };
  // end update vehicle

  render() {
    const {
      id,
      username,
      email,
      phone,
      username_error,
      email_error,
      phone_error,
      serverError
    } = this.state;

    return (
      <DashboardLayout title="Vehicle Detail">
        <Grid>
          <div className="row">
            <div className="col-md-6 offset-md-3 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>{username}</b>
                </div>
                <div className="card-body">
                  <form>
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
                      <div className="text-danger">Username is required</div>
                    )}

                    {serverError.username && (
                      <div className="text-danger">Used by another user</div>
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
                    </div>
                    {email_error && (
                      <div className="text-danger">Email is required</div>
                    )}

                    {serverError.email && (
                      <div className="text-danger">Used by another user</div>
                    )}

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
                    </div>
                    {phone_error && (
                      <div className="text-danger">Phone is required</div>
                    )}

                    {serverError.phone && (
                      <div className="text-danger">{''}</div>
                    )}

                    <div className="row mt-3">
                      <div className="col-md-2">
                        <Link to={'/users/' + username + '-' + id}>
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
)(UserUpdate);
