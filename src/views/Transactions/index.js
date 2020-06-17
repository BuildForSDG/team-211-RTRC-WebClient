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
  transactionsUrl,
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

const Transactions = props => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getStats = () => {
    setIsLoading(true);

    axios
      .get(`${transactionsUrl}stats/`, { headers: getHeaders() })
      .then(res => {
        setIsLoading(false);
        setTransactions(res.data.results.transactions);
        setTotalAmount(res.data.results.total_amount);
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
  const showTransactions = !isLoading && transactions.length;

  return (
    <DashboardLayout title="Transactions">
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={2} md={2} xl={2} />
          <Grid item lg={8} md={8} xl={8} xs={12}>
            <Portlet className={rootClassName}>
              <PortletHeader noDivider>
                <PortletLabel
                  subtitle={`${transactions.length} in total`}
                  title="Transactions"
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
                  {showTransactions && (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell align="left">User</TableCell>
                          <TableCell align="left">Amount</TableCell>
                          <TableCell align="left">Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((dep, index) => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={dep.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {dep.wallet.user.username} |{' '}
                              {dep.wallet.user.email}
                            </TableCell>
                            <TableCell className={classes.customerCell}>
                              {dep.amount}
                            </TableCell>
                            <TableCell>
                              {new Date(dep.updated_at).toDateString()}
                            </TableCell>
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

Transactions.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Transactions);
