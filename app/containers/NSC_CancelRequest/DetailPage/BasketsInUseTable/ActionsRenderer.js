import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Tooltip, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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
  isEdit = true;

  onChangeInfoInit = data => {
    this.props.onEditPopup(data);
    this.props.onSetDataUseTable(data);
  };

  render() {
    const {
      classes,
      onOpenDialogDelete,
      pageType,
      data,
      onOpenSelectAssetsPopup,
      receiptData,
    } = this.props;
    // const isAutoReceipt = getNested(
    //   context.props,
    //   'receiptData',
    //   'isAutoReceipt',
    // );
    const showDeleteBtn =
      data.basketLocatorCode &&
      (pageType.create || (pageType.edit && !receiptData.isAutoReceipt));
    const showEditBtn =
      data.basketLocatorCode && (pageType.create || pageType.edit);
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
        {showEditBtn && (
          <Tooltip title="Sửa">
            <IconButton
              className={classes.button}
              onClick={() => {
                onOpenSelectAssetsPopup(this.isEdit, data);
                this.onChangeInfoInit(data);
              }}
            >
              <EditIcon fontSize="small" />
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
  // context: PropTypes.object,
  receiptData: PropTypes.object,
  onOpenSelectAssetsPopup: PropTypes.func,
  onEditPopup: PropTypes.func,
  onSetDataUseTable: PropTypes.func,
};

export default withStyles(styles)(ActionsRenderer);
