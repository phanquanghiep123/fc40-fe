import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import { TYPE_FORM } from './constants';

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

export class ActionRenderSection4 extends React.Component {
  get isDeleteVisible() {
    if (this.props.context.props.form === TYPE_FORM.CANCEL) {
      return false;
    }
    if (
      this.props.data &&
      this.props.data.basketCode &&
      this.props.data.status !== 2 &&
      this.props.data.documentQuantity <= 0
    ) {
      return true;
    }
    return false;
  }

  onRemoveRow = () => {
    this.props.context.props.confirmRemoveRecordSection4(
      this.props.rowIndex,
      this.props.data,
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

ActionRenderSection4.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default withStyles(styles)(ActionRenderSection4);
