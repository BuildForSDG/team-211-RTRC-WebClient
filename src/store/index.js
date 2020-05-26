/* eslint-disable */
import { createStore, combineReducers } from 'redux';

import usersReducer from './users';
import servicesReducer from './services';
import mapsReducer from './maps';
import settingsReducer from './settings';
import vehiclesReducer from './vehicles';

const store = createStore(
  combineReducers({
    usersReducer,
    servicesReducer,
    mapsReducer,
    settingsReducer,
    vehiclesReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {});

export default store;
