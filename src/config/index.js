/* eslint-disable */
import store from '../store';
import constants from '../store/constants';
// set request headers
import axios from 'axios';

export const baseUrl = process.env.REACT_APP_API_ENDPOINT;

// auth endpoints
export const baseAuth = baseUrl + 'auth/';
export const loginUrl = baseAuth + 'login/';
export const logoutUrl = baseAuth + 'logout/';
export const registerUrl = baseAuth + 'register/';
export const authTokenUrl = baseAuth + 'registration/auth/v1/token-auth/';
export const verifyAccountUrl = baseAuth + 'registration/verify-email/';
export const passwordResetUrl = baseAuth + 'password/reset/';
export const passwordResetConfirmUrl = baseAuth + 'password/reset/confirm/';
export const passwordChangeUrl = baseAuth + 'password/change/';
export const refreshTokenUrl = baseAuth + 'refresh-token/';
export const userUrl = baseAuth + 'users/';

export const walletUrl = baseUrl + 'wallet/';
export const depositsUrl = baseUrl + 'deposits/';
export const transactionsUrl = baseUrl + 'transactions/';

// project resources endpoints
export const customUsersUrl = baseUrl + 'users/';
export const managersUrl = customUsersUrl + 'managers/';
export const getManagerUrl = customUsersUrl + 'get_manager/';
export const deleteManagerUrl = customUsersUrl + 'delete_manager/';
export const ownerSettingsUrl = customUsersUrl + 'get_owner_settings/';
export const updateOwnerSettingsUrl = customUsersUrl + 'update_owner_settings/';
export const vehiclesUrl = baseUrl + 'vehicles/';
export const getVehicleUrl = vehiclesUrl + 'get_vehicle/';
export const getOwnerVehiclesUrl = vehiclesUrl + 'get_owner_vehicles/';
export const getOwnerVehicleUrl = vehiclesUrl + 'get_owner_vehicle/';
export const updateIndividualVehicleSettingsUrl =
  vehiclesUrl + 'update_vehicle_settings/';
export const VehiclesSettingsUrl = baseUrl + 'vehicles_settings/';
export const VehiclesSettingsCreateOrUpdateUrl =
  VehiclesSettingsUrl + 'create_or_update/';
export const getOwnerVehicleSettings =
  VehiclesSettingsUrl + 'get_owner_vehicle_settngs/';
export const servicesUrl = baseUrl + 'services/';

export const getHeaders = () => {
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';

  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + authUser.token
  };
  return headers;
};

export const protectRoute = props => {
  let authUser = JSON.parse(localStorage.getItem('authUser'));

  if (authUser) {
    store.dispatch({
      type: constants.SET_USER,
      payload: authUser
    });
  } else if (!authUser) {
    props.history.push('/login');
  }
};

export const protectAuthRoute = props => {
  let authUser = JSON.parse(localStorage.getItem('authUser'));
  if (authUser) {
    props.history.push('/');
  }
};

export const protectOwnerRoute = props => {
  let authUser = JSON.parse(localStorage.getItem('authUser'));
  if (!authUser.is_collector || !authUser.is_staff) {
    props.history.push('/');
  }
};

export const errorToast = (toast, message, error, props) => {
  if (error.response) {
    if (error.response.status === 401) {
      toast.error('Session Expired, Login Again', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true
      });
      // remove expired creds
      store.dispatch({
        type: constants.REMOVE_USER
      });
      localStorage.removeItem('authUser');
      store.dispatch({
        type: constants.REMOVE_SETTINGS
      });
      localStorage.removeItem('settings');
      // go to login page
      props.history.push('/login');
    } else {
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true
      });
    }
  } else {
    toast.error("can't connect to server, check internet connection.", {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
};

export const successToast = (toast, message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
  });
};
