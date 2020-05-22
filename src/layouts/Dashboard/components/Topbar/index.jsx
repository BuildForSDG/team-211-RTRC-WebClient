import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Badge,
  IconButton,
  Popover,
  Toolbar,
  Typography
} from '@material-ui/core';

// Material icons
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Input as InputIcon,
  ArrowForward as ArrowForwardIcon
} from '@material-ui/icons';
import NavigationIcon from '@material-ui/icons/Navigation';
import Button from '@material-ui/core/Button';

// Shared services
import { getNotifications } from 'services/notification';

// Custom components
import { NotificationList } from './components';

// Component styles
import styles from './styles';

import store from 'store';
import constants from 'store/constants';

import { connect } from 'react-redux';

class Topbar extends Component {
  signal = true;

  state = {
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null,
    connectionColor: '',
    connectionStatus: null
  };

  async getNotifications() {
    try {
      const { notificationsLimit } = this.state;

      const { notifications, notificationsCount } = await getNotifications(
        notificationsLimit
      );

      if (this.signal) {
        this.setState({
          notifications,
          notificationsCount
        });
      }
    } catch (error) {
      return;
    }
  }

  componentDidMount() {
    this.signal = true;
    this.getNotifications();

    // if (navigator.onLine) {
    //   this.setState({ connectionColor: 'primary', connectionStatus: true });
    // } else if (!navigator.onLine) {
    //   this.setState({ connectionColor: 'danger', connectionStatus: false });
    // }
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSignOut = () => {
    localStorage.removeItem('authUser');
    store.dispatch({ type: constants.REMOVE_USER });
    localStorage.removeItem('settings');
    store.dispatch({ type: constants.REMOVE_SETTINGS });
    localStorage.removeItem('playback_locations');
    store.dispatch({ type: constants.REMOVE_PLAYBACK_LOCATIONS });
    localStorage.removeItem('current_service');
    store.dispatch({ type: constants.REMOVE_CURRENT_SERVICE });
    localStorage.removeItem('services');
    store.dispatch({ type: constants.REMOVE_SERVICES });
    this.props.history.push('/login');
  };

  handleShowPlaybackDialog = () => {
    this.props.openPlaybackDialog({
      type: constants.OPEN_PLAYBACK_DIALOG,
      payload: true
    });
  };

  // handleRoutesRedirect = e => {
  //   e.preventDefault();
  //   this.props.history
  // }

  handleCloseNotifications = () => {
    this.setState({
      notificationsEl: null
    });
  };

  render() {
    const {
      classes,
      className,
      isSidebarOpen,
      onToggleSidebar,
      show_playback_button,
      show_other_buttons,
      current_service
    } = this.props;

    const {
      notifications,
      notificationsCount,
      notificationsEl,
      connectionColor
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showNotifications = Boolean(notificationsEl);

    return (
      <Fragment>
        <div className={rootClassName}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              className={classes.menuButton}
              onClick={onToggleSidebar}
              variant="text"
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              className={classes.title}
              variant="h4"
            >
              {current_service.name}
            </Typography>
            <IconButton>
              <Badge
                badgeContent={notificationsCount}
                color={connectionColor}
                variant="dot"
              >
                {''}
              </Badge>
            </IconButton>

            {show_other_buttons ? (
              // <IconButton
              //   className={classes.notificationsButton}
              //   onClick={this.handleShowPlaybackDialog}>
              //   <NavigationIcon />
              // </IconButton>
              <button
                className="btn btn-light"
                onClick={this.handleShowPlaybackDialog}
                type="button"
              >
                Choose Destination <NavigationIcon />
              </button>
            ) : (
              <IconButton className={classes.notificationsButton} />
            )}

            {/* {show_other_buttons ? (
              <a
                className="btn btn-secondary"
                href="https://maps.google.com"
                style={{ marginLeft: 10 }}
                target="blank"
              >
                Plan Routes
              </a>
            ) : (
              <IconButton className={classes.notificationsButton} />
            )} */}

            {show_playback_button ? (
              <Button
                color="primary"
                onClick={this.handleReportsPage}
                style={{ marginLeft: 10 }}
                variant="contained"
              >
                {`Order ${current_service.title}`} <ArrowForwardIcon />
              </Button>
            ) : (
              <IconButton className={classes.notificationsButton} />
            )}
            <IconButton
              className={classes.signOutButton}
              onClick={this.handleSignOut}
            >
              <InputIcon />
            </IconButton>
          </Toolbar>
        </div>
        <Popover
          anchorEl={notificationsEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={this.handleCloseNotifications}
          open={showNotifications}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <NotificationList
            notifications={notifications}
            onSelect={this.handleCloseNotifications}
          />
        </Popover>
      </Fragment>
    );
  }
}

Topbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool,
  onToggleSidebar: PropTypes.func,
  title: PropTypes.string
};

Topbar.defaultProps = {
  onToggleSidebar: () => {}
};

const mapStateToProps = state => {
  return {
    show_playback_button: state.mapsReducer.show_playback_button,
    show_other_buttons: state.mapsReducer.show_other_buttons,
    current_service: state.servicesReducer.current_service
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openPlaybackDialog: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const TopbarConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Topbar);

export default compose(
  withRouter,
  withStyles(styles)
)(TopbarConnect);
