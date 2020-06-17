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

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';

// Component styles
import {
  usersUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast
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

const Drivers = props => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStats = async () => {
    setIsLoading(true);

    await axios
      .get(`${usersUrl}drivers/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        setDrivers(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving statistics, retry.', err, props);
      });
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getStats();
  }, []);

  const { classes, className } = props;

  const rootClassName = classNames(classes.root, className);
  const showDrivers = !isLoading && drivers.length;

  return (
    <DashboardLayout title="Drivers">
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={2} md={2} xl={2} />
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletHeader noDivider>
                <PortletLabel
                  subtitle={`${drivers.length} in total`}
                  title="Drivers"
                />
                <PortletToolbar>
                  <Link to="/">
                    <Button
                      className={classes.newEntryButton}
                      color="primary"
                      size="small"
                      variant="outlined">
                      Dashboard
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
                  {showDrivers && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell align="left">Username</TableCell>
                          <TableCell align="left">Email</TableCell>
                          <TableCell align="left">Phone</TableCell>
                          <TableCell align="left">Vehicles</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {drivers.map((driv, index) => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={driv.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{driv.username}</TableCell>
                            <TableCell className={classes.customerCell}>
                              {driv.email}
                            </TableCell>
                            <TableCell>{driv.phone}</TableCell>
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

Drivers.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Drivers);
