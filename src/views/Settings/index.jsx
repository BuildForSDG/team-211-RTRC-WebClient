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
import { Account, Password } from './components';
import { protectRoute } from 'config';
import { connect } from 'react-redux';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  }
});

class Settings extends Component {
  componentWillMount() {
    protectRoute(this.props);
  }

  componentDidMount() {
    //
  }

  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Settings">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item md={3} />
            {/* <Grid
              item
              md={5}
              xs={12}
            >
              <Account />
            </Grid> */}
            <Grid item md={6} xs={12}>
              <Password />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    is_collector: state.usersReducer.is_collector
  };
};

const connectSettings = connect(mapStateToProps)(Settings);

export default withStyles(styles)(connectSettings);
