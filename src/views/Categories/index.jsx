import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Externals
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles, Grid } from '@material-ui/core';

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
// import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { errorToast, categoriesUrl, getHeaders, protectRoute } from 'config';
import axios from 'axios';
import { toast } from 'react-toastify';
import constants from 'store/constants';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

const Category = props => {
  const categories = useSelector(state => state.vehiclesReducer.categories);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { classes, className } = props;

  const retrieveCategories = async () => {
    setIsLoading(true);
    // get vehicles
    await axios
      .get(categoriesUrl, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_CATEGORIES, payload: res.data.results });
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'Error retrieving categories, retry.', err, props);
      });
  };

  useEffect(() => {
    protectRoute(props);
    retrieveCategories();
  }, []);

  const rootClassName = classNames(classes.root, className);
  const showCategories = !isLoading && categories.length;

  return (
    <DashboardLayout title="Vehicles">
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={2} md={2} xl={2} />
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletHeader noDivider>
                <PortletLabel
                  subtitle={`${categories.length} in total`}
                  title="Vehicle Categories"
                />
                <PortletToolbar>
                  <Link to="/categories/add-new">
                    <Button
                      className={classes.newEntryButton}
                      color="primary"
                      size="small"
                      variant="outlined">
                      Add New
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
                  {showCategories && (
                    <>
                      <Grid item lg={2} md={2} />
                      <Grid item lg={8} md={8}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell align="left">Name</TableCell>
                              <TableCell align="left">Toll Fee</TableCell>
                              <TableCell align="left">Created</TableCell>
                              <TableCell align="left">Updated</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categories.map((category, index) => (
                              <TableRow
                                className={classes.tableRow}
                                hover
                                key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className={classes.customerCell}>
                                  <Link to={`/categories/${category.id}`}>
                                    {category.name}
                                  </Link>
                                </TableCell>
                                <TableCell>{category.toll_fee}</TableCell>
                                <TableCell>
                                  {new Date(category.created_at).toDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(category.updated_at).toDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                    </>
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

Category.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Category);
