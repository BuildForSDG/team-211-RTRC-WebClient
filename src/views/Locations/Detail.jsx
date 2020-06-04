/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  categoriesUrl,
  getHeaders,
  protectRoute,
  protectOwnerRoute,
  errorToast,
  successToast
} from 'config';
import { useSelector, useDispatch } from 'react-redux';
import constants from 'store/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack as ArrowBackIcon, Edit, Delete } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const CategoryDetail = props => {
  const dispatch = useDispatch();
  const category = useSelector(state => state.vehiclesReducer.category);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [name, setName] = useState('');
  const [tollFee, setTollFee] = useState('');
  const [serverErrors, setServerErrors] = useState([]);

  const getCategories = async () => {
    setIsLoading(true);
    const category_id = props.match.params.category_id;

    await axios
      .get(`${categoriesUrl}${category_id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_CATEGORY, payload: res.data });
        setName(res.data.name);
        setTollFee(res.data.toll_fee);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving category, retry.', err, props);
      });
  };

  // update
  const handleUpdate = e => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { name, toll_fee: tollFee };

    axios
      .put(`${categoriesUrl}${category.id}/`, payload, {
        headers: getHeaders()
      })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_CATEGORY, payload: res.data });
        setOpenUpdateDialog(false);
        successToast(toast, 'Category updated Successfully!');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error updating category, retry.', err, props);
        setServerErrors(err.response.data);
      });
  };
  // end update

  // delete
  const handleDelete = e => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .delete(`${categoriesUrl}${category.id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Category Deleted Successfully!');
        props.history.push('/categories');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error deleting category, retry.', err, props);
      });
  };
  // end delete

  const handleName = e => {
    setName(e.target.value);
  };

  const handleTollFee = e => {
    setTollFee(e.target.value);
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getCategories();
  }, []);

  const showCategory = category === {} ? false : true;

  return (
    <DashboardLayout title="Category">
      {showCategory && (
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>Name: {category.name}</b>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <b>Toll Fee: </b>
                    Ghc. {category.toll_fee}
                  </div>

                  <div className="card-subtitle">
                    <b>Created: </b>
                    {new Date(category.created_at).toDateString()}
                  </div>
                  <div className="card-subtitle">
                    <b>Updated: </b>
                    {new Date(category.updated_at).toDateString()}
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-2">
                      <Link
                        to="/categories"
                        className="btn btn-outline-primary">
                        <ArrowBackIcon /> Back
                      </Link>
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setOpenUpdateDialog(true)}>
                        Update
                      </button>
                    </div>

                    <div className="col-md-2">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setOpenDeleteDialog(true)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  <span className="text-danger">Confirm Delete</span>
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={8} md={8} xl={8} xs={10}>
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <div className="text-danger">
                            Delete {category.name} ?
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        color="primary">
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleDelete}>
                          Delete
                        </button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <Dialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className="text-danger">
                  Update Category
                </DialogTitle>
                <DialogContent>
                  <Grid>
                    <Grid item lg={2} md={2} />
                    <Grid item lg={8} md={8}>
                      <TextField
                        className={''}
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
                        className={''}
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
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid container spacing={4}>
                    <Grid item xs={6}>
                      <Button
                        onClick={() => setOpenUpdateDialog(false)}
                        color="primary">
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleUpdate}>
                          Update
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </DialogActions>
              </Dialog>
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default CategoryDetail;
