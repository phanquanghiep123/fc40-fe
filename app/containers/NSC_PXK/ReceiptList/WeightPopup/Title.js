import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

import { getReceiptDisplayName } from '../utils';

export const styles = theme => ({
  label: {
    backgroundColor: theme.palette.action.selected,
  },
  titleText: {
    fontWeight: 500,
  },
  labelText: {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
});

export const Title = ({ classes, formik }) => {
  const displayName = getReceiptDisplayName(formik.values);

  return (
    <Grid container spacing={16}>
      <Grid item>Cân Xuất Kho</Grid>
      {displayName && (
        <Grid item>
          <Chip
            label={displayName}
            classes={{
              root: classes.label,
              label: classNames(classes.titleText, classes.labelText),
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

Title.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
};

export default withStyles(styles)(Title);
