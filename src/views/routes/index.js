import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Views
import Dashboard from '../Dashboard';
import Vehicles from '../Vehicles';
import VehicleForm from '../Vehicles/VehicleForm';
import VehicleDetails from '../Vehicles/VehicleDetail';
import VehicleUpdate from '../Vehicles/VehicleUpdate';
import UsersList from '../Users';
import UserDetail from '../Users/UserDetail';
import UserForm from '../Users/UserForm';
import UserUpdate from '../Users/UserUpdate';
// import UserList from './views/UserList';
import Icons from '../Icons';
import Account from '../Account';
import Settings from '../Settings';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import UnderDevelopment from '../UnderDevelopment';
import NotFound from '../NotFound';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect
          exact
          from="/"
          to="/dashboard"
        />
        <Route
          component={Dashboard}
          exact
          path="/dashboard"
        />
        <Route
          component={Vehicles}
          exact
          path="/vehicles"
        />
        <Route
          component={VehicleForm}
          exact
          path="/vehicles/add-new"
        />
        <Route
          component={VehicleDetails}
          exact
          path="/vehicles/:vehicle_id-:id"
        />
        <Route
          component={VehicleUpdate}
          exact
          path="/vehicles/:vehicle_id-:id/update"
        />

        <Route
          component={UsersList}
          exact
          path="/users"
        />
        <Route
          component={UserForm}
          exact
          path="/users/add-new"
        />
        <Route
          component={UserDetail}
          exact
          path="/users/:username-:id"
        />
        <Route
          component={UserUpdate}
          exact
          path="/users/:username-:id/update"
        />
        <Route
          component={Icons}
          exact
          path="/icons"
        />
        <Route
          component={Account}
          exact
          path="/account"
        />
        <Route
          component={Settings}
          exact
          path="/settings"
        />
        <Route
          component={SignUp}
          exact
          path="/signup"
        />
        <Route
          component={SignIn}
          exact
          path="/login"
        />
        <Route
          component={UnderDevelopment}
          exact
          path="/under-development"
        />
        <Route
          component={NotFound}
          exact
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default Routes;
