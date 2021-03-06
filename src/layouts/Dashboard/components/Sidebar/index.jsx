import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  // Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@material-ui/core';

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  // ShoppingBasketOutlined as ShoppingBasketIcon,
  // LockOpenOutlined as LockOpenIcon,
  SignalWifi4BarLockTwoTone,
  DirectionsCar as DirectionsCarIcon,
  // ImageOutlined as ImageIcon,
  InfoOutlined as InfoIcon,
  // AccountBoxOutlined as AccountBoxIcon,
  SettingsOutlined as SettingsIcon
} from '@material-ui/icons';

// Component styles
import styles from './styles';
import { connect } from 'react-redux';

class Sidebar extends Component {
  render() {
    const { classes, className, is_staff } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          {/* <Link className={classes.logoLink} to="/">
            <img
              alt="E-Revenue logo"
              className={classes.logoImage}
              src="/images/logo2.jpg"
            />
          </Link> */}
        </div>

        <div className={classes.profile}>
          {/* <Link to="/account">
            <Avatar
              alt="Roman Kutepov"
              className={classes.avatar}
              src="/images/avatars/avatar_1.png"
            />
          </Link> */}
          {/* <Typography className={classes.nameText} variant="h6">
            <Link title="Account Settings" to="/settings">
              <SettingsIcon /> 
              {` ${username.toUpperCase()}`}
            </Link>
          </Typography> */}
          {/* <Typography className={classes.bioText} variant="caption">
            Brain Director
          </Typography> */}
        </div>
        <Divider className={classes.profileDivider} />
        <List component="div" disablePadding>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard">
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dashboard"
            />
          </ListItem>

          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/vehicles"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Vehicles"
            />
          </ListItem> */}

          {is_staff && (
            <>
              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/categories">
                <ListItemIcon className={classes.listItemIcon}>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Vehicle Categories"
                />
              </ListItem>

              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/collectors">
                <ListItemIcon className={classes.listItemIcon}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Toll Collectors"
                />
              </ListItem>

              <ListItem
                activeClassName={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/locations">
                <ListItemIcon className={classes.listItemIcon}>
                  <SignalWifi4BarLockTwoTone />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Toll Locations"
                />
              </ListItem>
            </>
          )}

          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/settings">
            <ListItemIcon className={classes.listItemIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Settings"
            />
          </ListItem>

          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/users">
            <ListItemIcon className={classes.listItemIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Users"
            />
          </ListItem> */}
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/products">
            <ListItemIcon className={classes.listItemIcon}>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Products"
            />
          </ListItem> */}
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/sign-in">
            <ListItemIcon className={classes.listItemIcon}>
              <LockOpenIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Authentication"
            />
          </ListItem> */}
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/typography">
            <ListItemIcon className={classes.listItemIcon}>
              <TextFieldsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Typography"
            />
          </ListItem> */}
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/icons">
            <ListItemIcon className={classes.listItemIcon}>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Icons and Images"
            />
          </ListItem> */}
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/account">
            <ListItemIcon className={classes.listItemIcon}>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Account"
            />
          </ListItem> */}
        </List>
        <Divider className={classes.listDivider} />
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Support
            </ListSubheader>
          }>
          <ListItem
            className={classes.listItem}
            component="a"
            href="mailto:support@toll-revenue.digital">
            <ListItemIcon className={classes.listItemIcon}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Contact Support"
            />
          </ListItem>
        </List>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.usersReducer.username,
    email: state.usersReducer.email,
    is_staff: state.usersReducer.is_staff,
    is_collector: state.usersReducer.is_collector,
    is_user: state.usersReducer.is_user
  };
};

const connectSidebar = connect(mapStateToProps)(Sidebar);

export default withStyles(styles)(connectSidebar);
