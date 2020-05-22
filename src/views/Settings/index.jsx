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
import { UserSettings, Password } from './components';
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
    // hide playback button
    this.props.showPlaybackButton({
      type: 'SHOW_PLAYBACK_BUTTON',
      payload: false
    });
    this.props.showOtherButtons({
      type: 'SHOW_OTHER_BUTTONS',
      payload: false
    });
    // end hide playback button
  }

  render() {
    const { classes } = this.props;
    const { is_account_owner } = this.props;

    return (
      <DashboardLayout title="Settings">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid md={1} />
            {is_account_owner && (
              <Grid item md={5} xs={12}>
                <UserSettings />
              </Grid>
            )}
            <Grid item md={5} xs={12}>
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
    is_account_owner: state.usersReducer.is_account_owner
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showPlaybackButton: action =>
      dispatch({ type: action.type, payload: action.payload }),
    showOtherButtons: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const connectSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export default withStyles(styles)(connectSettings);
