import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
// Externals
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles, Grid } from '@material-ui/core';
import {
  ArrowForward as ArrowForwardIcon,
  DeleteOutline as DeleteIcon
} from '@material-ui/icons';

// Material components
import {
  Button,
  CircularProgress,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography
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
import { connect, useDispatch, useSelector } from 'react-redux';
import { errorToast, vehiclesUrl, getHeaders, protectRoute } from 'config';
import axios from 'axios';
import { toast } from 'react-toastify';
import constants from 'store/constants';

const Vehicles = props => {
  const store = useSelector(store => store);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [vehicles, setVehicles] = useState([]);

  const retrieveVehicles = async () => {
    setIsLoading(true);
    // get vehicles
    await axios
      .get(vehiclesUrl, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        setVehicles(res.data.results);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'Error retrieving vehicles, retry.', err, props);
      });
  };

  useEffect(() => {
    retrieveVehicles();
    protectRoute();
  }, []);

  const handleRoute = vehicle_id => {
    props.history.push(`/vehicles/${vehicle_id}`);
  };

  const { is_user, is_collector } = store;
  const { classes, className } = props;

  const rootClassName = classNames(classes.root, className);
  const showVehicles = !isLoading && vehicles.length > 0;

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
              <Grid
                className={classes.root}
                container
                spacing={4}
              >
                {vehicles.map((vehicle, index) => (
                  <Grid lg={4}>
                    <Card className={classes.root}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image="/images/qr-code.png"
                          title={vehicle.registration_number}
                        />
                        <CardContent>
                          <Typography
                            component="h2"
                            gutterBottom
                            variant="h5"
                          >
                            {vehicle.registration_number}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            component="p"
                            variant="body2"
                          >
                            <p>
                              <b>Model:</b> {vehicle.model}
                            </p>
                            <p>
                              <b>Category:</b>{' '}
                              {`${vehicle.category.name} | ${vehicle.category.toll_fee}`}
                            </p>
                            <p>
                              <b>Chassis Number:</b> {vehicle.chassis_number}
                            </p>
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        {is_user && (
                          <Button
                            color="primary"
                            size="small"
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                        <Button
                          color="primary"
                          onClick={handleRoute.bind(vehicle.id)}
                          size="small"
                        >
                          <ArrowForwardIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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

// const mapStateToProps = state => {
//   return {
//     vehicles: state.vehiclesReducer.vehicles,
//     is_user: state.usersReducer.is_user,
//     is_collector: state.usersReducer.is_collector
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     setVehicles: action =>
//       dispatch({ type: action.type, payload: action.payload }),
//     setSettings: action =>
//       dispatch({ type: action.type, payload: action.payload })
//   };
// };

// const connectVehicles = connect(mapStateToProps, mapDispatchToProps)(Vehicles);

export default withStyles(styles)(Vehicles);
