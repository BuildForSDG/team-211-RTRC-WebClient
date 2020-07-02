/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collectorsUrl,
  idTypesUrl,
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
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
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

const CollectorDetail = props => {
  const dispatch = useDispatch();
  const collector = useSelector(state => state.usersReducer.collector);
  const idTypes = useSelector(state => state.usersReducer.idTypes);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState('');
  const [dummyIdTypeTitle, setDummyIdTypeTitle] = useState('');
  const [serverErrors, setServerErrors] = useState([]);

  const getCollector = async () => {
    setIsLoading(true);
    const collector_id = props.match.params.collector_id;

    await axios
      .get(`${collectorsUrl}${collector_id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_COLLECTOR, payload: res.data });
        setName(res.data.name);
        setPhone(res.data.phone);
        setIdNumber(res.data.national_id);
        setIdType(res.data.national_id_type.id);
        setDummyIdTypeTitle(res.data.national_id_type.title);
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error retrieving category, retry.', err, props);
      });
  };

  const getIdTypes = async () => {
    await axios
      .get(idTypesUrl, { headers: getHeaders() })
      .then(res => {
        dispatch({ type: constants.SET_ID_TYPES, payload: res.data.results });
      })
      .catch(err => {
        errorToast(toast, 'error fetching ID Types', err, props);
      });
  };

  // update
  const handleUpdate = e => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      name,
      national_id: idNumber,
      national_id_type: idType,
      phone
    };

    axios
      .put(`${collectorsUrl}${collector.id}/`, payload, {
        headers: getHeaders()
      })
      .then(res => {
        setIsLoading(false);
        dispatch({ type: constants.SET_COLLECTOR, payload: res.data });
        setName(res.data.name);
        setPhone(res.data.phone);
        setIdNumber(res.data.national_id);
        setIdType(res.data.national_id_type);
        setDummyIdTypeTitle(res.data.national_id_type.title);
        setOpenUpdateDialog(false);
        successToast(toast, 'Collector updated Successfully!');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error updating collector, retry.', err, props);
        if (err.response) {
          setServerErrors(err.response.data);
        }
      });
  };
  // end update

  // delete
  const handleDelete = e => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .delete(`${collectorsUrl}${collector.id}/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        successToast(toast, 'Collector Deleted Successfully!');
        props.history.push('/collectors');
      })
      .catch(err => {
        setIsLoading(false);
        errorToast(toast, 'error deleting collector, retry.', err, props);
      });
  };
  // end delete

  const handleName = e => {
    setName(e.target.value);
  };

  const handlePhone = e => {
    setPhone(e.target.value);
  };

  const handleIdNumber = e => {
    setIdNumber(e.target.value);
  };

  const handleIdType = e => {
    setIdType(e.target.value);
  };

  useEffect(() => {
    protectRoute(props);
    protectOwnerRoute(props);
    getCollector();
    getIdTypes();
  }, []);

  const showCollector = collector === {} ? false : true;

  return (
    <DashboardLayout title="Collector">
      {showCollector && (
        <Grid>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-5">
              <div className="card">
                <div className="card-header">
                  <b>
                    {collector.username} | {collector.email}{' '}
                  </b>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <b>Name: </b>
                    {collector.name}
                  </div>
                  <div className="card-body">
                    <div className="card-title">
                      <b>Phone: </b>
                      {collector.phone}
                    </div>

                    <div className="card-subtitle">
                      <b>National ID Number: </b>
                      {collector.national_id}
                    </div>
                    <div className="card-subtitle">
                      <b>National ID Type: </b>
                      {dummyIdTypeTitle}
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-2">
                        <Link
                          to="/collectors"
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
                              Delete {collector.name} ?
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setOpenDeleteDialog(false)}>
                          Cancel
                        </button>
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
                    <div className="row">
                      <div className="col-md-5 offset-md-2">
                        Update Collector
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogContent>
                    <Grid container>
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
                          label="Phone"
                          margin="dense"
                          required
                          variant="outlined"
                          name="phone"
                          onChange={handlePhone}
                          value={phone}
                        />
                        {serverErrors.phone &&
                          serverErrors.phone.map(error => (
                            <div className="text-danger">{error}</div>
                          ))}

                        <TextField
                          className={''}
                          label="National ID Number"
                          margin="dense"
                          required
                          variant="outlined"
                          name="idNumber"
                          onChange={handleIdNumber}
                          value={idNumber}
                        />
                        {serverErrors.national_id &&
                          serverErrors.national_id.map(error => (
                            <div className="text-danger">{error}</div>
                          ))}

                        <InputLabel id="national-id-type">ID Type</InputLabel>
                        <Select
                          labelId="national-id-type"
                          value={idType}
                          onChange={handleIdType}>
                          {idTypes.map(idtype => (
                            <MenuItem value={idtype.id} key={idtype.id}>
                              {idtype.title}
                            </MenuItem>
                          ))}
                        </Select>
                        {serverErrors.national_id_type &&
                          serverErrors.national_id_type.map(error => (
                            <div className="text-danger">{error}</div>
                          ))}
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Grid container>
                      <Grid item xs={2} />
                      <Grid item xs={3}>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setOpenUpdateDialog(false)}>
                          Cancel
                        </button>
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
          </div>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default CollectorDetail;
