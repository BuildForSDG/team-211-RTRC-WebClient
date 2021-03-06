import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Views
import Dashboard from '../Dashboard';
import Vehicles from '../Vehicles';
import VehicleForm from '../Vehicles/VehicleForm';
import VehicleDetails from '../Vehicles/VehicleDetail';

import Categories from '../Categories';
import CategoryDetail from '../Categories/Detail';
import CategoryForm from '../Categories/Form';

import Collectors from '../Collectors';
import CollectorDetail from '../Collectors/Detail';
import CollectorForm from '../Collectors/Form';

import Locations from '../Locations';
import LocationForm from '../Locations/Form';
import LocationDetail from '../Locations/Detail';

import Wallet from '../Wallet';
import Deposits from '../Deposits';
import Transactions from '../Transactions';
import Drivers from '../Drivers';

import Icons from '../Icons';
import Account from '../Account';
import Settings from '../Settings';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import UnderDevelopment from '../UnderDevelopment';
import NotFound from '../NotFound';

import Payments from '../Payments';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        <Route component={Dashboard} exact path="/dashboard" />
        <Route component={Wallet} exact path="/wallet" />
        <Route component={Deposits} exact path="/deposits" />
        <Route component={Payments} exact path="/payments/:token/:email" />
        <Route component={Transactions} exact path="/transactions" />
        <Route component={Vehicles} exact path="/vehicles" />
        <Route component={Drivers} exact path="/drivers" />
        <Route component={VehicleForm} exact path="/vehicles/add-new" />
        <Route component={VehicleDetails} exact path="/vehicles/:vehicle_id" />
        <Route component={Categories} exact path="/categories" />
        <Route component={CategoryForm} exact path="/categories/add-new" />
        <Route
          component={CategoryDetail}
          exact
          path="/categories/:category_id"
        />
        <Route component={Collectors} exact path="/collectors" />
        <Route component={CollectorForm} exact path="/collectors/add-new" />
        <Route
          component={CollectorDetail}
          exact
          path="/collectors/:collector_id"
        />
        <Route component={Locations} exact path="/locations" />
        <Route component={LocationForm} exact path="/locations/add-new" />
        <Route
          component={LocationDetail}
          exact
          path="/locations/:location_id"
        />
        <Route component={Icons} exact path="/icons" />
        <Route component={Account} exact path="/account" />
        <Route component={Settings} exact path="/settings" />
        <Route component={SignUp} exact path="/signup" />
        <Route component={SignIn} exact path="/login" />
        <Route component={UnderDevelopment} exact path="/under-development" />
        <Route component={NotFound} exact path="/not-found" />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default Routes;
