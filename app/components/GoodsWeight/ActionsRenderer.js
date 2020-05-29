import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

export const styles = {
  button: {
    margin: 0,
    padding: 5,
    fontSize: 12,
  },
  icon: {
    fontSize: '1.5em',
  },
};

export class ActionsRenderer extends React.Component {
  get isDeleteVisible() {
    if (
      this.props.data &&
      (this.props.data.basketCode ||
        this.props.data.palletCode ||
        this.props.data.basketQuantity > 0 ||
        this.props.data.palletQuantity > 0 ||
        this.props.data.quantity > 0)
    ) {
      return true;
    }
    return false;
  }

  onRemoveRow = () => {
    this.props.context.confirmRemoveRecord(
      this.props.data,
      this.props.rowIndex,
    );
  };

  render() {
    const { classes } = this.props;

    if (this.isDeleteVisible) {
      return (
        <Tooltip title="Xóa">
          <IconButton className={classes.button} onClick={this.onRemoveRow}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default withStyles(styles)(ActionsRenderer);
