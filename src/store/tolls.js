import constants from './constants';

const initialState = {
  tolls: [],
  toll: {},
  locations: [],
  location: {}
};

const tollsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_TOLLS: {
      return {
        ...state,
        tolls: action.payload
      };
    }

    case constants.REMOVE_TOLLS: {
      return {
        ...state,
        tolls: []
      };
    }

    case constants.SET_TOLL: {
      return {
        ...state,
        toll: action.payload
      };
    }

    case constants.REMOVE_TOLL: {
      return {
        ...state,
        toll: {}
      };
    }

    case constants.SET_LOCATIONS: {
      return {
        ...state,
        locations: action.payload
      };
    }

    case constants.REMOVE_LOCATIONS: {
      return {
        ...state,
        locations: []
      };
    }

    case constants.SET_LOCATION: {
      return {
        ...state,
        location: action.payload
      };
    }

    case constants.REMOVE_LOCATION: {
      return {
        ...state,
        location: {}
      };
    }

    default: {
      return state;
    }
  }
};

export default tollsReducer;
