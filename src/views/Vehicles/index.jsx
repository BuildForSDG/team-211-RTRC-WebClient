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
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';
import { Dashboard as DashboardLayout } from 'layouts';

// Component styles
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { errorToast, vehiclesUrl, getHeaders, protectRoute } from 'config';
import axios from 'axios';
import { toast } from 'react-toastify';
import constants from 'store/constants';

const Vehicles = props => {
  const vehicles = useSelector(state => state.vehiclesReducer.vehicles);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { classes, className } = props;

  const retrieveVehicles = async () => {
    setIsLoading(true);
    // get vehicles
    await axios
      .get(vehiclesUrl, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_VEHICLES, payload: res.data.results });
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'Error retrieving vehicles, retry.', err, props);
      });
  };

  useEffect(() => {
    protectRoute();
    retrieveVehicles();
  }, []);

  // const handleRoute = vehicle_id => {
  //   props.history.push(`/vehicles/${vehicle_id}`);
  // };

  const rootClassName = classNames(classes.root, className);
  const showVehicles = !isLoading && vehicles.length;

  return (
    <DashboardLayout title="Vehicles">
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            subtitle={`${vehicles.length} in total`}
            title="Vehicles"
          />
          <PortletToolbar>
            <Link to="/vehicles/add-new">
              <Button
                className={classes.newEntryButton}
                color="primary"
                size="small"
                variant="outlined"
              >
                Add New
              </Button>
            </Link>
          </PortletToolbar>
        </PortletHeader>
        <PerfectScrollbar>
          <PortletContent
            className={classes.portletContent}
            noPadding
          >
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}
            {showVehicles && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align="left">Registration #</TableCell>
                    <TableCell align="left">Chassis #</TableCell>
                    <TableCell align="left">Model</TableCell>
                    <TableCell align="left">Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle, index) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={index}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className={classes.customerCell}>
                        <Link to={`/vehicles/${vehicle.id}`}>
                          {vehicle.registration_number}
                        </Link>
                      </TableCell>
                      <TableCell>{vehicle.chassis_number}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>
                        {vehicle.category.name} @ Ghc.
                        {vehicle.category.toll_fee}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PortletContent>
        </PerfectScrollbar>
      </Portlet>
    </DashboardLayout>
  );
};

Vehicles.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Vehicles);
