/* eslint-disable */
import constants from './constants';

const initialState = {
  token: null,
  reference: '',
  email: null,
  amount: 0,
  openPaymentDialog: false
};

const paymentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_PAYMENT: {
      return {
        ...state,
        token: action.payload.token,
        email: action.payload.email
      };
    }

    case constants.REMOVE_PAYMENT: {
      return {
        ...state,
        token: null,
        email: null
      };
    }

    case constants.SET_REFERENCE: {
      return {
        ...state,
        reference: action.payload
      };
    }

    case constants.REMOVE_REFERENCE: {
      return {
        ...state,
        reference: ''
      };
    }

    case constants.OPEN_PAYMENT_DIALOG: {
      return {
        ...state,
        openPaymentDialog: action.payload
      };
    }

    case constants.SET_PAYMENT_AMOUNT: {
      return {
        ...state,
        amount: action.payload
      };
    }

    case constants.REMOVE_PAYMENT_AMOUNT: {
      return {
        ...state,
        amount: 0
      };
    }

    default: {
      return state;
    }
  }
};

export default paymentsReducer;
