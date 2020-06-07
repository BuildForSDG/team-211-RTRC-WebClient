/* eslint-disable */
import constants from './constants';

const initialState = {
  token: null,
  id: null,
  username: null,
  email: null,
  name: null,
  phone: null,
  is_staff: null,
  collectors: [],
  collector: {},
  idTypes: [],
  statistics: {}
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_USER: {
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
        email: action.payload.email,
        phone: action.payload.phone,
        name: action.payload.name,
        is_staff: action.payload.is_staff
      };
    }

    case constants.REMOVE_USER: {
      return {
        ...state,
        token: null,
        username: null,
        email: null,
        phone: null,
        name: null,
        is_staff: null
      };
    }

    case constants.SET_COLLECTORS: {
      return {
        ...state,
        collectors: action.payload
      };
    }

    case constants.REMOVE_COLLECTORS: {
      return {
        ...state,
        collectors: []
      };
    }

    case constants.SET_COLLECTOR: {
      return {
        ...state,
        collector: action.payload
      };
    }

    case constants.REMOVE_COLLECTOR: {
      return {
        ...state,
        collector: {}
      };
    }

    case constants.SET_ID_TYPES: {
      return {
        ...state,
        idTypes: action.payload
      };
    }

    case constants.REMOVE_ID_TYPES: {
      return {
        ...state,
        idTypes: []
      };
    }

    case constants.SET_STATISTICS: {
      return {
        ...state,
        statistics: action.payload
      };
    }

    case constants.REMOVE_STATISTICS: {
      return {
        ...state,
        statistics: {}
      };
    }

    default: {
      return state;
    }
  }
};

export default usersReducer;
