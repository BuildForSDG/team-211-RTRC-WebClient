/* eslint-disable */
import React, { useEffect, useState } from 'react';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  TextField,
  Grid,
  CircularProgress,
  FilledInput
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Portlet, PortletLabel, PortletContent } from 'components';

// Component styles
import styles from './styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  getFormDataHeaders,
  categoriesUrl,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import constants from 'store/constants';

const CategoryForm = props => {
  const [name, setName] = useState('');
  const [tollFee, setTollFee] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
  });

  const handleChangeName = e => {
    setName(e.target.value);
  };

  const handleTollFeeChange = e => {
    setTollFee(e.target.value);
  };

  const handleImageChange = e => {
    console.log(e);
    setImage(e.currentTarget.files[0]);
  };

  // create new vehicle
  const createVehicle = e => {
    e.preventDefault();
    setIsLoading(true);

    let payload = new FormData();
    payload.append('name', JSON.stringify(name));
    payload.append('toll_fee', JSON.stringify(tollFee));
    payload.append('image', image);

    axios
      .post(categoriesUrl, payload, { headers: getFormDataHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Category Created!');
        props.history.push('/categories');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error creating vehicle, retry.', err, props);
      });
    // end create request
  };
  // end create new vehicle

  const { className, classes } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <DashboardLayout title="Vehicle Form">
      <div className={classes.root}>
        <Grid container spacing={4} className="mt-5">
          <Grid item lg={2} md={2} xl={2}>
            <div />
          </Grid>
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletContent>
                <PortletLabel subtitle="" title="Add Category" />
                <form autoComplete="off" noValidate>
                  <Grid container>
                    <Grid item md={3} />
                    <Grid item md={6}>
                      <TextField
                        className={classes.textField}
                        label="Name"
                        margin="dense"
                        required
                        variant="outlined"
                        name="name"
                        onChange={handleChangeName}
                        value={name}
                      />
                      {serverErrors.name &&
                        serverErrors.name.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}

                      <TextField
                        className={classes.textField}
                        label="Toll Fee"
                        margin="dense"
                        required
                        variant="outlined"
                        name="tollFee"
                        onChange={handleTollFeeChange}
                        value={tollFee}
                      />
                      {serverErrors.toll_fee &&
                        serverErrors.toll_fee.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}
                      <label htmlFor="image">
                        Image
                        <input
                          type="file"
                          required
                          name="image"
                          id="image"
                          className="form-control"
                          onChange={e => handleImageChange(e)}
                          value={image}
                          accept="image/*"
                        />
                      </label>
                      {serverErrors.name &&
                        serverErrors.name.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid xs={3} />
                    <Grid item xs={3}>
                      <Link to="/categories" title="Categories">
                        <IconButton aria-label="Delete" size="small">
                          <ArrowBackIcon fontSize="inherit" />
                        </IconButton>
                      </Link>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={3}>
                      {isLoading ? (
                        <CircularProgress className={classes.progress} />
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={createVehicle}>
                          <SaveIcon /> Submit
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </PortletContent>
            </Portlet>
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

CategoryForm.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryForm);
