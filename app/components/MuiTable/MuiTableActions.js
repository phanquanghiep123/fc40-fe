import React from 'react';
import PropTypes from 'prop-types';

import { MTableActions } from 'material-table';

import { withStyles } from '@material-ui/core/styles';

export const styles = {
  root: {
    display: 'inline-flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export class MuiTableActions extends React.Component {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MTableActions {...this.props} />
      </div>
    );
  }
}

MuiTableActions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'MuiTableActions' })(MuiTableActions);
