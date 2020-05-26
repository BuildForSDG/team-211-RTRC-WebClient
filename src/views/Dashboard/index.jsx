import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { SalesChart } from './components';
import { Profit } from './components';

import { protectRoute } from 'config';
import { connect } from 'react-redux';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
    // height: '100vh'
  },
  item: {
    height: '100%'
  }
});

class Dashboard extends Component {
  componentWillMount() {
    protectRoute(this.props);
  }

  // componentDidMount() {
  //   protectRoute(this.props);
  //   axios
  //     .get(servicesUrl, { headers: getHeaders() })
  //     .then(res => {
  //       this.props.setServices({
  //         type: constants.SET_SERVICES,
  //         payload: res.data.results
  //       });
  //     })
  //     .catch(err => {
  //       errorToast(
  //         toast,
  //         'Error retrieving service, Reload Page',
  //         err,
  //         this.props
  //       );
  //     });
  // }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dashboard">
        <Grid
          className={classes.root}
          container
          spacing={4}
        >
          <Grid
            item
            lg={6}
            md={6}
            xl={6}
          >
            <SalesChart />
          </Grid>

          <Grid
            item
            lg={6}
            md={6}
            xl={6}
          >
            <Profit />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.usersReducer.username,
    isStaff: state.usersReducer.is_staff,
    services: state.servicesReducer.services
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setServices: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const connectDashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default withStyles(styles)(connectDashboard);
