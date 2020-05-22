/* eslint-disable */
import constants from './constants';

const initialState = {
  refresh_rate: 0,
  speed_limit: 0,
  vehicle_settings: []
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_SETTINGS: {
      return {
        ...state,
        refresh_rate: action.payload.refresh_rate,
        speed_limit: action.payload.speed_limit
      };
    }

    case constants.REMOVE_SETTINGS: {
      return {
        ...state,
        refresh_rate: null,
        speed_limit: null
      };
    }
    default: {
      return state;
    }
  }
};

export default settingsReducer;
