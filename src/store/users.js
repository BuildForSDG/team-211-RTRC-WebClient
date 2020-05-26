/* eslint-disable */
const initialState = {
  token: null,
  id: null,
  username: null,
  email: null,
  name: null,
  phone: null,
  is_staff: null
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER': {
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

    case 'REMOVE_USER': {
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

    default: {
      return state;
    }
  }
};

export default usersReducer;
