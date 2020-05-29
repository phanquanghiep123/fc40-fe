import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect';
// import * as actions from '../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MuiButton from 'components/MuiButton';
import { debounce } from 'lodash';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  Typography,
} from '@material-ui/core';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import ConfirmCompleteAllDialog from './ConfirmCompleteAllDialog';
import ConfirmCompleteOneDialog from './ConfirmCompleteOneDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  btn: {
    width: 140,
  },
  completeButton: {
    backgroundColor: theme.palette.orange[800],
    color: theme.palette.getContrastText(theme.palette.orange[800]),
    '&:hover': {
      backgroundColor: theme.palette.orange[900],
      color: theme.palette.getContrastText(theme.palette.orange[900]),
    },
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiCheckbox: {
        colorSecondary: {
          '&$checked': {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiTableRow: {
        head: {
          background: '#000 !important',
          // borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      MuiTableCell: {
        root: {
          padding: `0 ${theme.spacing.unit}px`,
          '&:first-child': {
            paddingLeft: theme.spacing.unit * 2,
          },
          '&:last-child': {
            paddingRight: theme.spacing.unit * 1.5,
          },
        },
      },
      MuiTableHead: {
        root: {
          background: '#000 !important',
          // background: theme.palette.background.head,
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: 'none',
        },
      },
      MuiToolbar: {
        root: {
          minHeight: '0 !important',
        },
      },
      MuiTypography: {
        h6: {
          display: 'none',
        },
      },
    },
  });

/**
 * Helper function to sort product list by gradeCode, so that product type 1 will come first
 *
 * @example productArray.sort(productSorter)
 * @param a - this object
 * @param b - next object
 * @returns {number}
 */
function productSorter(a, b) {
  if (!a.gradeCode || !b.gradeCode) return 0;
  if (a.gradeCode < b.gradeCode) {
    return -1;
  }
  if (a.gradeCode > b.gradeCode) {
    return 1;
  }
  return 0;
}

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  state = {
    openDialogCompleteAll: false, // dialog cho nút hoàn thành phiếu cân (tất cả)
    openDialogCompleteOne: false, // dialog cho nút hoàn thành sản phẩm
    openDialogDelete: false, // dialog cho nút xóa dòng khi đã có thông tin cân
    rowData: {}, // rowData truyền vào dialog
  };

  openDialogCompleteAll = () => {
    this.setState({ openDialogCompleteAll: true });
  };

  closeDialogCompleteAll = () => {
    this.setState({ openDialogCompleteAll: false });
  };

  openDialogCompleteOne = rowData => {
    this.setState({ openDialogCompleteOne: true, rowData });
  };

  closeDialogCompleteOne = () => {
    this.setState({ openDialogCompleteOne: false });
  };

  openDialogDelete = rowData => {
    const needDeletionOnServer = !!rowData.documentDetailId;

    if (!needDeletionOnServer) {
      this.proceedFEDeletion(rowData); // proceed without confirmation
    } else {
      this.setState({ openDialogDelete: true, rowData });
    }
  };

  closeDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  /**
   * Handle deleting sub row (BE + FE)
   */
  deleteSubRow = rowData => {
    const { onDeleteRow } = this.props;

    onDeleteRow(rowData, isOk => {
      if (isOk) {
        this.proceedFEDeletion(rowData);
      }
    });
  };

  /**
   * Proceed FrontEnd Deleting
   */
  proceedFEDeletion = rowData => {
    const { tableData, onUpdateTableData } = this.props;

    const rowIndex = rowData.tableData.id;
    const mainRowIndex = rowData.parentId;
    const firstSubRowIndex = mainRowIndex + 1;
    const updatedTableData = [...tableData];
    const updatedMainRow = { ...updatedTableData[mainRowIndex] };
    const typeOneCode = 10; // product type 1 code

    // remove current row
    updatedTableData.splice(rowIndex, 1);

    // update main row
    updatedMainRow.products = [...updatedMainRow.originalProducts];
    updatedMainRow.products.sort(productSorter);
    updatedMainRow.addedSubRows -= 1;
    updatedMainRow.addRowDisabled = false;
    updatedMainRow.completeDisabled = !updatedMainRow.productBatchCode;
    updatedMainRow.productSelectDisabled =
      updatedMainRow.productBatchCode ||
      updatedMainRow.products.filter(
        product => product.gradeCode === typeOneCode,
      ).length === 1 ||
      (updatedMainRow.addedSubRows > 0 &&
        !updatedTableData[firstSubRowIndex].productBatchCode);

    // get the last unweighted product of current productGroup
    let lastUnweightedRowIndex = mainRowIndex;
    const numOfAddedRow = updatedMainRow.addedSubRows + 1; // including main row
    new Array(numOfAddedRow).fill(null).forEach((_, i) => {
      const currentRowIndex = i + updatedMainRow.tableData.id;
      const currentRow = { ...updatedTableData[currentRowIndex] };
      const isWeighted = !!currentRow.productBatchCode;

      if (!isWeighted) {
        lastUnweightedRowIndex = currentRowIndex;
      }
    });

    // update selected product list
    updatedMainRow.selectedProductCodes = updatedMainRow.selectedProductCodes.filter(
      code =>
        code !== rowData.productCode &&
        code !== tableData[lastUnweightedRowIndex].productCode,
    );

    // filter the product options. exclude the selected products
    let remainingProducts = [...updatedMainRow.products];
    updatedMainRow.selectedProductCodes.forEach(productCode => {
      remainingProducts = remainingProducts.filter(
        product => product.value !== productCode,
      );
    });

    const updatedLastUnweightedRow = {
      ...updatedTableData[lastUnweightedRowIndex],
      ...remainingProducts[0],
      products: remainingProducts,
      productBatchCode: null,
      productQuantity: 0,
    };
    updatedLastUnweightedRow.productSelectDisabled =
      updatedLastUnweightedRow.products.length === 1;

    // update parentId for all following rows. Indexes change (-1) when we remove a row
    const nextMainRowIndex = mainRowIndex + updatedMainRow.addedSubRows + 1;
    for (let i = nextMainRowIndex; i < updatedTableData.length; i += 1) {
      const isSubRow = updatedTableData[i].parentId !== null;
      if (isSubRow) {
        updatedTableData[i].parentId -= 1;
      }
    }

    // update current mainRow and its sub rows
    updatedTableData[mainRowIndex] = updatedMainRow;
    if (mainRowIndex !== lastUnweightedRowIndex) {
      updatedTableData[lastUnweightedRowIndex] = updatedLastUnweightedRow;
    }

    // dispatch changes
    onUpdateTableData(updatedTableData);
  };

  render() {
    const {
      classes,
      tableData,
      tableOriginalData,
      formSubmittedValues,
      onUpdateTableData,
      onWeighTableData,
      onCompleteWeighing,
      onCompleteAll,
      onExportExcel,
    } = this.props;

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Hàng Hóa</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Grid container spacing={24}>
            <Grid item>
              <MuiButton
                onClick={() => onExportExcel(formSubmittedValues)}
                className={classes.btn}
                outline
                disabled={tableData.length < 1}
              >
                Tải Xuống
              </MuiButton>
            </Grid>
            <Grid item>
              <MuiButton
                className={classNames(classes.btn, classes.completeButton)}
                onClick={this.openDialogCompleteAll}
              >
                Hoàn Thành
              </MuiButton>
            </Grid>
          </Grid>
        </div>
      </div>
    );

    const columnDefs = makeColumnDefs(
      tableData,
      tableOriginalData,
      onUpdateTableData,
      onWeighTableData,
      this.openDialogCompleteOne,
      this.openDialogDelete,
    );

    // xác nhận hoàn thành cân tổng cho cả ngày
    const confirmAllDialog = (
      <ConfirmCompleteAllDialog
        open={this.state.openDialogCompleteAll}
        onClose={this.closeDialogCompleteAll}
        onConfirm={() =>
          onCompleteAll(
            formSubmittedValues.org,
            formSubmittedValues.ngayThucHienCan,
          )
        }
      />
    );

    // xác nhận hoàn thành cân tổng cho từng sản phẩm
    const confirmOneDialog = (
      <ConfirmCompleteOneDialog
        open={this.state.openDialogCompleteOne}
        onClose={this.closeDialogCompleteOne}
        onConfirm={() =>
          onCompleteWeighing(
            formSubmittedValues.org,
            formSubmittedValues.ngayThucHienCan,
            this.state.rowData,
            () => {
              const updatedRow = { ...this.state.rowData, isCompleted: true };
              const updatedTable = [...tableData];
              updatedTable[updatedRow.tableData.id] = updatedRow;
              onUpdateTableData(updatedTable);
            },
          )
        }
      />
    );

    const confirmDeleteDialog = (
      <ConfirmDeleteDialog
        open={this.state.openDialogDelete}
        onClose={this.closeDialogDelete}
        onConfirm={debounce(
          () => this.deleteSubRow(this.state.rowData),
          SUBMIT_TIMEOUT,
        )}
      />
    );

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            columns={columnDefs}
            data={tableData}
            options={{
              headerStyle: {
                background: appTheme.palette.background.head,
              },
              rowStyle: rowData => ({
                ...(rowData.isCompleted ||
                rowData.isHidden ||
                (rowData.parentId !== null &&
                  tableData[rowData.parentId].isCompleted)
                  ? { display: 'none' }
                  : {}),
              }),
              showTitle: false,
              search: false,
              sorting: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              paging: false,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
            localization={{
              toolbar: {
                nRowsSelected: '{0} dòng được chọn',
              },
              pagination: {
                labelRowsSelect: 'dòng',
                labelDisplayedRows: '{from}-{to} trên {count}',
              },
              body: {
                emptyDataSourceMessage:
                  'Không tìm thấy kết quả nào để hiển thị',
              },
            }}
          />
        </MuiThemeProvider>
        {confirmAllDialog}
        {confirmOneDialog}
        {confirmDeleteDialog}
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  tableOriginalData: PropTypes.array,
  formSubmittedValues: PropTypes.object,
  onUpdateTableData: PropTypes.func,
  onCompleteWeighing: PropTypes.func,
  onWeighTableData: PropTypes.func,
  onCompleteAll: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  tableData: selectors.tableData(),
  tableOriginalData: selectors.tableOriginalData(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onWeighTableData: tableData => dispatch(actions.openWeightPopup(tableData)),
    onCompleteWeighing: (org, date, rowData, callback) =>
      dispatch(actions.completeWeighing(org, date, rowData, callback)),
    onCompleteAll: (org, date) => dispatch(actions.completeAll(org, date)),
    onDeleteRow: (rowData, callback) =>
      dispatch(actions.deleteRowData(rowData, callback)),
    onExportExcel: formSubmittedValues =>
      dispatch(actions.exportExcel(formSubmittedValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(style()),
)(TableSection);
