import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const styles = theme => ({
  root: {
    padding: theme.spacing.unit / 2,
  },
  inline: {
    display: 'inline-flex',
  },
  iconLabel: {
    fontSize: 12,
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit * 2,
  },
  textLabel: {
    fontWeight: '500',
  },
  'value-color': {
    padding: theme.spacing.unit / 4,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
  },
  'value-color1': {
    color: theme.palette.color1,
    backgroundColor: theme.utils.fade(
      theme.palette.color1,
      theme.palette.transparency,
    ),
  },
  'value-color2': {
    color: theme.palette.color2,
    backgroundColor: theme.utils.fade(
      theme.palette.color2,
      theme.palette.transparency,
    ),
  },
});

export function GridField({
  classes,
  item,
  label,
  value,
  valueColor,
  valueJustify,
}) {
  return (
    <Grid container spacing={8} className={classes.root}>
      <Grid item xs={4} className={classes.inline}>
        {item && (
          <Icon className={classes.iconLabel} color="primary">
            trip_origin
          </Icon>
        )}
        <Typography className={classes.textLabel}>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Grid container justify={valueJustify}>
          <Grid item>
            <Typography
              className={classNames({
                [classes[`value-color`]]: valueColor,
                [classes[`value-${valueColor}`]]: valueColor,
              })}
            >
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

GridField.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  valueColor: PropTypes.oneOf(['color1', 'color2']),
  valueJustify: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
};

GridField.defaultProps = {
  item: false,
  label: '',
  valueJustify: 'flex-start',
};

export default withStyles(styles)(GridField);
