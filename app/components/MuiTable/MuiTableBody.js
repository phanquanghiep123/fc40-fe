import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { MTableBody } from 'material-table';

export const styles = {
  empty: {
    '& > *': {
      fontWeight: 'bold',
    },
  },
};

export class MuiTableBody extends MTableBody {
  renderEmpty(emptyRowCount, renderData) {
    const { classes } = this.props;
    const EmptyComponent = super.renderEmpty(emptyRowCount, renderData);

    if (EmptyComponent) {
      return React.cloneElement(EmptyComponent, {
        className: classes.empty,
      });
    }
    return null;
  }
}

MuiTableBody.propTypes = {
  classes: PropTypes.object.isRequired,
  renderData: PropTypes.array,
  currentPage: PropTypes.number,
};

export default withStyles(styles)(MuiTableBody);
