import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, IconButton } from '@material-ui/core';
import { AddCircle, Check, Delete } from '@material-ui/icons';
import { FaBalanceScale } from 'react-icons/fa';
// import appTheme from '../../../App/theme';
import { withSnackbar } from 'notistack';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';

const snackbarOptions = {
  variant: 'warning',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

const style = () => ({
  root: {
    display: 'flex',
  },
});

class ButtonsCellRenderer extends React.PureComponent {
  /**
   * Push Notification
   *
   * @param message
   * @param option
   */
  pushMessage = (message, option = snackbarOptions) => {
    this.props.enqueueSnackbar(message, option);
  };

  scaleRow = () => {
    const { rowData } = this.props;
    const { id: rowIndex } = rowData.tableData;
    this.props.onWeighTableData({ ...rowData, rowIndex });
  };

  /**
   * Add new Sub Row
   */
  addNewSubRow = () => {
    const {
      tableData,
      tableOriginalData,
      rowData,
      onUpdateTableData,
    } = this.props;

    // check adding subRow condition
    if (rowData.products.length <= rowData.selectedProductCodes.length) {
      this.pushMessage('Đã thêm tất cả các loại của sản phẩm này');
      return;
    }

    // update main Row data
    const updatedTableData = [...tableData];
    const updatedRow = { ...rowData };
    updatedRow.productSelectDisabled = true;
    updatedRow.addedSubRows += 1;

    updatedRow.selectedProductCodes = [];
    for (let i = 0; i < updatedRow.addedSubRows; i += 1) {
      const rowIndex = i + updatedRow.tableData.id;
      updatedRow.selectedProductCodes.push(
        updatedTableData[rowIndex].productCode,
      );
      updatedTableData[rowIndex].productSelectDisabled = true;
    }

    // filter the product options. exclude the selected products
    const { products } = tableOriginalData[updatedRow.originalIndex];
    let filteredProducts = [...products];
    updatedRow.selectedProductCodes.forEach(productCode => {
      filteredProducts = filteredProducts.filter(
        product => product.value !== productCode,
      );
    });

    if (filteredProducts.length === 1) {
      updatedRow.addRowDisabled = true;
    }

    // prepare new subRow data
    const newSubRow = {
      originalIndex: updatedRow.originalIndex,
      parentId: updatedRow.tableData.id, // id of the main row
      semiFinishedProductCode: updatedRow.semiFinishedProductCode,
      originCode: updatedRow.originCode,
      deliverCode: updatedRow.deliverCode,
      receiverCode: updatedRow.receiverCode,
      semiFinishedProductSlotCode: updatedRow.semiFinishedProductSlotCode,
      products: filteredProducts,
      productSelectDisabled: filteredProducts.length === 1,
      ...filteredProducts[0],
    };

    // update current mainRow and its sub rows
    updatedTableData[updatedRow.tableData.id] = updatedRow;
    updatedTableData.splice(
      updatedRow.tableData.id + updatedRow.addedSubRows,
      0,
      newSubRow,
    );

    // update parentId for all following rows. Indexes change (+1) when we add a new row
    const nextMainRowIndex =
      updatedRow.tableData.id + updatedRow.addedSubRows + 1;
    for (let i = nextMainRowIndex; i < updatedTableData.length; i += 1) {
      const isSubRow = updatedTableData[i].parentId !== null;
      if (isSubRow) {
        updatedTableData[i].parentId += 1;
      }
    }

    // dispatch changes
    onUpdateTableData(updatedTableData);
  };

  render() {
    const {
      classes,
      rowData,
      tableData,
      openDialogCompleteOne,
      openDialogDelete,
    } = this.props;

    const isMainRow = rowData.parentId === null;

    return (
      <div className={classes.root}>
        <IconButton
          color="primary"
          size="small"
          title="Cân"
          disabled={
            rowData.isCompleted ||
            (rowData.parentId !== null &&
              tableData[rowData.parentId].isCompleted)
          }
          onClick={this.scaleRow}
        >
          <FaBalanceScale />
        </IconButton>

        {isMainRow ? (
          <React.Fragment>
            <IconButton
              color="primary"
              size="small"
              disabled={rowData.addRowDisabled}
              title="Thêm Dòng"
              onClick={this.addNewSubRow}
            >
              <AddCircle />
            </IconButton>

            <IconButton
              color="primary"
              size="small"
              title="Hoàn Thành"
              disabled={rowData.completeDisabled}
              onClick={() => openDialogCompleteOne(rowData)}
            >
              <Check />
            </IconButton>
          </React.Fragment>
        ) : (
          <IconButton
            color="primary"
            size="small"
            title="Xóa"
            onClick={debounce(() => openDialogDelete(rowData), SUBMIT_TIMEOUT)}
          >
            <Delete />
          </IconButton>
        )}
      </div>
    );
  }
}

ButtonsCellRenderer.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  tableOriginalData: PropTypes.array,
  rowData: PropTypes.object,
  onUpdateTableData: PropTypes.func,
  onWeighTableData: PropTypes.func,
  openDialogCompleteOne: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  openDialogDelete: PropTypes.func,
};

export default withSnackbar(withStyles(style())(ButtonsCellRenderer));
