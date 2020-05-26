/* eslint-disable */
import constants from './constants';

const initialState = {
  vehicles: []
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

    default: {
      return state;
    }
  }
};

export default vehiclesReducer;
