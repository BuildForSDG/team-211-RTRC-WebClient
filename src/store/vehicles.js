/* eslint-disable */
import constants from './constants';

const initialState = {
  vehicles: [],
  vehicle: {},
  categories: [],
  category: {}
};

const vehiclesReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_VEHICLES: {
      return {
        ...state,
        vehicles: action.payload
      };
    }

    case constants.REMOVE_VEHICLES: {
      return {
        ...state,
        vehicles: []
      };
    }

    case constants.SET_VEHICLE: {
      return {
        ...state,
        vehicle: action.payload
      };
    }

    case constants.REMOVE_VEHICLE: {
      return {
        ...state,
        vehicle: {}
      };
    }

    case constants.SET_CATEGORIES: {
      return {
        ...state,
        categories: action.payload
      };
    }

    case constants.REMOVE_CATEGORIES: {
      return {
        ...state,
        categories: []
      };
    }

    case constants.SET_CATEGORY: {
      return {
        ...state,
        category: action.payload
      };
    }

    case constants.REMOVE_CATEGORY: {
      return {
        ...state,
        category: {}
      };
    }

    default: {
      return state;
    }
  }
};

export default vehiclesReducer;
