/* eslint-disable */
import React, { useEffect, useState } from 'react';
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
import { Add as AddIcon } from '@material-ui/icons';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';

// Component styles
import { useDispatch, useSelector } from 'react-redux';
import {
  collectorsUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import axios from 'axios';
import constants from 'store/constants';

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

const Collectors = props => {
  const collectors = useSelector(state => state.usersReducer.collectors);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const getCollectors = async () => {
    setIsLoading(true);

    await axios
      .get(collectorsUrl, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_COLLECTORS, payload: res.data.results });
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving collectors, retry.', err, props);
      });
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getCollectors();
  }, []);

  const { classes, className } = props;

  const rootClassName = classNames(classes.root, className);
  const showCollectors = !isLoading && collectors.length;

  return (
    <DashboardLayout title="Collectors">
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={2} md={2} xl={2} />
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletHeader noDivider>
                <PortletLabel
                  subtitle={`${collectors.length} in total`}
                  title="Collectors"
                />
                <PortletToolbar>
                  <Link
                    to="/collectors/add-new"
                    className="btn btn-outline-primary">
                    Add New <AddIcon />
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
                  {showCollectors && (
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
                        {collectors.map((collect, index) => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={collect.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Link to={`/collectors/${collect.id}`}>
                                {collect.username}
                              </Link>
                            </TableCell>
                            <TableCell className={classes.customerCell}>
                              {collect.email}
                            </TableCell>
                            <TableCell>{collect.phone}</TableCell>
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
};

Collectors.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Collectors);
