/* eslint-disable */
import constants from './constants';

const initialState = {
  key: 'AIzaSyB-0TudBN841q0BgO9EaRQlJ8LGI06zr-4',
  current_location: {},
  destination: {},

  current_center: {},
  show_playback_button: false,
  show_other_buttons: false,
  open_playback_dialog: false
};

const mapsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_LOCATION: {
      return {
        ...state,
        current_location: action.payload
      };
    }

    case constants.REMOVE_CURRENT_LOCATION: {
      return {
        ...state,
        current_location: {}
      };
    }

    case constants.SET_CURRENT_CENTER: {
      return {
        ...state,
        current_center: action.payload
      };
    }

    case constants.REMOVE_CURRENT_CENTER: {
      return {
        ...state,
        current_center: {}
      };
    }

    case constants.SET_DESTINATION: {
      return {
        ...state,
        destination: action.payload
      };
    }

    case constants.REMOVE_DESTINATION: {
      return {
        ...state,
        destination: {}
      };
    }

    case constants.SET_PLAYBACK_LOCATIONS: {
      return {
        ...state,
        playback_locations: action.payload
      };
    }

    case constants.REMOVE_PLAYBACK_LOCATIONS: {
      return {
        ...state,
        playback_locations: []
      };
    }

    case constants.SHOW_PLAYBACK_BUTTON: {
      return {
        ...state,
        show_playback_button: action.payload
      };
    }

    case constants.SHOW_OTHER_BUTTONS: {
      return {
        ...state,
        show_other_buttons: action.payload
      };
    }

    case constants.OPEN_PLAYBACK_DIALOG: {
      return {
        ...state,
        open_playback_dialog: action.payload
      };
    }

    case constants.CLOSE_PLAYBACK_DIALOG: {
      return {
        ...state,
        open_playback_dialog: false
      };
    }

    default: {
      return state;
    }
  }
};

export default mapsReducer;
