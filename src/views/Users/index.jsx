/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// Externals
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid
} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';

// Component styles
import { connect } from 'react-redux';
import {
  managersUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import axios from 'axios';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { toast } from 'react-toastify';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

class UsersList extends Component {
  constructor(props) {
    super(props);
    this.signal = false;

    this.state = {
      isLoading: false,
      managers: [],
      limit: 10
    };
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
    // end hide playback button

    this.signal = true;

    this.setState({ isLoading: true });
    axios
      .get(managersUrl, { headers: getHeaders() })
      .then(res => {
        this.setState({ isLoading: false, managers: res.data });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        errorToast(toast, 'error retrieving managers, retry.', err, this.props);
      });
  }

  componentWillMount() {
    protectRoute(this.props);
    protectOwnerRoute(this.props);
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className, vehicles } = this.props;
    const { isLoading, managers } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showManagers = !isLoading && managers.length > 0;

    return (
      <DashboardLayout title="Manager Accounts">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={2} md={2} xl={2} />
            <Grid item lg={8} md={8} xl={8} xs={12}>
              {/* <Vehicles className={classes.item} /> */}
              <Portlet className={rootClassName}>
                <PortletHeader noDivider>
                  <PortletLabel
                    subtitle={`${managers.length} in total`}
                    title="Managers"
                  />
                  <PortletToolbar>
                    <Link to="/users/add-new">
                      <Button
                        className={classes.newEntryButton}
                        color="primary"
                        size="small"
                        variant="outlined">
                        Add New Manager
                      </Button>
                    </Link>
                  </PortletToolbar>
                </PortletHeader>
                <PerfectScrollbar>
                  <PortletContent className={classes.portletContent} noPadding>
                    {isLoading && (
                      <div className={classes.progressWrapper}>
                        <CircularProgress />
                      </div>
                    )}
                    {showManagers && (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Username</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Phone</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {managers.map((manager, index) => (
                            <TableRow
                              className={classes.tableRow}
                              hover
                              key={manager.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Link
                                  to={
                                    '/users/' +
                                    manager.username +
                                    '-' +
                                    manager.id
                                  }>
                                  {manager.username}
                                </Link>
                              </TableCell>
                              <TableCell className={classes.customerCell}>
                                {manager.email}
                              </TableCell>
                              <TableCell>{manager.phone}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </PortletContent>
                </PerfectScrollbar>
              </Portlet>
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

UsersList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    vehicles: state.vehiclesReducer.vehicles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showPlaybackButton: action =>
      dispatch({ type: action.type, payload: action.payload }),
    showOtherButtons: action =>
      dispatch({ type: action.type, payload: action.payload }),
    setVehicles: action =>
      dispatch({ type: action.type, payload: action.payload })
  };
};

const connectUsersList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersList);

export default withStyles(styles)(connectUsersList);
