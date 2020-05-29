import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Tooltip, IconButton } from '@material-ui/core';
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

// eslint-disable-next-line react/prefer-stateless-function
export class ActionsRenderer extends React.Component {
  render() {
    const {
      classes,
      onOpenDialogDelete,
      pageType,
      data,
      receiptData,
    } = this.props;

    const showDeleteBtn =
      data.productCode &&
      (pageType.create ||
        (pageType.view && data.isDeletable) ||
        (pageType.edit && !data.isDeleted && !receiptData.isAutoReceipt));

    return (
      <React.Fragment>
        {showDeleteBtn && (
          <Tooltip title="Xóa">
            <IconButton
              className={classes.button}
              onClick={() => onOpenDialogDelete(this.props)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  onOpenDialogDelete: PropTypes.func,
  pageType: PropTypes.object,
  receiptData: PropTypes.object,
};

export default withStyles(styles)(ActionsRenderer);
