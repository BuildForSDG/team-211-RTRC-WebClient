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

  const handleName = e => {
    setName(e.target.value);
  };

  const handleTollFee = e => {
    setTollFee(e.target.value);
  };

  const handleImage = e => {
    setImage(e.target.files[0]);
    // this.profile_picture = URL.createObjectURL(file);
    // this.image_file = file;
  };

  // create new vehicle
  const createVehicle = e => {
    e.preventDefault();
    setIsLoading(true);

    let payload = new FormData();
    payload.append('name', name);
    payload.append('toll_fee', tollFee);
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
        if (err.response) {
          setServerErrors(err.response.data);
        }
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
                <div className="row">
                  <div className="col-md-2 offset-md-3">
                    <PortletLabel subtitle="" title="Add Category" />
                  </div>
                </div>
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
                        onChange={handleName}
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
                        onChange={handleTollFee}
                        value={tollFee}
                      />
                      {serverErrors.toll_fee &&
                        serverErrors.toll_fee.map(error => (
                          <div className="text-danger">{error}</div>
                        ))}

                      <form encType="multipart/form-data" className="mb-3 mt-2">
                        <div className="row">
                          <div className="col-md-12">
                            <input
                              type="file"
                              name="image"
                              id="image"
                              className="form-control"
                              placeholder="choose image file"
                              onChange={e => handleImage(e)}
                              accept="image/*"
                            />

                            {serverErrors.image &&
                              serverErrors.image.map(error => (
                                <div className="text-danger">{error}</div>
                              ))}
                          </div>
                        </div>
                      </form>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                      <Link
                        to="/categories"
                        className="btn btn-outline-primary">
                        <ArrowBackIcon />
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
