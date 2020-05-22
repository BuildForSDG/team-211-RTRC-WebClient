/* eslint-disable */
import constants from './constants';

const initialState = {
  services: [],
  current_service: {}
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_SERVICES: {
      return {
        ...state,
        services: action.payload
      };
    }

    case constants.REMOVE_SERVICES: {
      return {
        ...state,
        services: []
      };
    }

    case constants.SET_CURRENT_SERVICE: {
      return {
        ...state,
        current_service: action.payload
      };
    }

    case constants.REMOVE_CURRENT_SERVICE: {
      return {
        ...state,
        current_service: {}
      };
    }

    default: {
      return state;
    }
  }
};

export default servicesReducer;
