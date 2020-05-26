import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const Service = props => {
  const classes = useStyles();
  const { title, description } = props;

  const handleRoute = e => {
    e.preventDefault();
    props.history.push(`/services/${props.service_id}`);
  };

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image="/images/keke.png"
            title={title}
          />
          <CardContent>
            <Typography
              component="h2"
              gutterBottom
              variant="h5"
            >
              {title}
            </Typography>
            <Typography
              color="textSecondary"
              component="p"
              variant="body2"
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* <Button
            color="primary"
            size="small"
          >
            Share
          </Button> */}
          <Button
            color="primary"
            onClick={handleRoute}
            size="small"
          >
            Order
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

const wrappedServices = withRouter(Service);

export default wrappedServices;
