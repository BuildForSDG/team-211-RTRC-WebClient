import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import { ArrowUpward as NumberIcon } from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';

class Profit extends Component {
  render() {
    const { classes, className, ...rest } = this.props;
    const { title, data } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Paper {...rest} className={rootClassName}>
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography className={classes.title} variant="body2">
              {title}
            </Typography>
            <Typography className={classes.value} variant="h3">
              {data}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <NumberIcon className={classes.icon} />
          </div>
        </div>
      </Paper>
    );
  }
}

Profit.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profit);
