import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Button,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Typography,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { TYPE_PXK } from 'containers/NSC_PXK/PXK/constants';
import DeleteConfirm from './ConfirmDeletionDialog';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import { linksTo } from './linksTo';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { TYPE_FORM } from '../../../NSC_PXK/PXK/Business';
import ImportedStockReceiptDetail from '../../../NSC_ImportedStockReceipt/DetailPage';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  topButton: {
    color: theme.palette.primary.main,
    background: '#fff',
    boxShadow: `0 1px 3px #aaa`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
});

const muiThemeOptions = {
  border: false,
};

const muiTheme = (theme = appTheme, options = muiThemeOptions) =>
  createMuiTheme({
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
          height: theme.spacing.unit * 6,
          '&:first-child': {
            borderTop: !options.border
              ? '1px solid rgba(224, 224, 224, 1)'
              : undefined,
          },
        },
      },
      MuiTableCell: {
        root: {
          border: options.border
            ? '1px solid rgba(224, 224, 224, 1)'
            : undefined,
          padding: `0 ${theme.spacing.unit * 1}px`,
          '&:first-child': {
            minWidth: theme.spacing.unit * 1.5,
          },
          '&:last-child': {
            paddingRight: theme.spacing.unit * 1.5,
          },
        },
      },
      MuiTableHead: {
        root: {
          background: theme.palette.background.head,
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

class TableSection extends Component {
  state = {
    openDialog: false,
    idForDeletion: null,
    openDlDetail: false,
    importedStockId: '',
    receiverCodeRefer: '',
  };

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, idForDeletion: doId });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, idForDeletion: null });
  };

  /**
   * Print selected records
   */
  printHandler = selectedRecords => {
    this.props.onPrintSelected(selectedRecords, data => {
      const win = window.open('', 'win', 'width="100%",height="100%"'); // a window object
      if (win === null)
        throw Object({
          message:
            'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
        });
      win.document.open('text/html', 'replace');
      win.document.write(data);
      win.document.close();
    });
  };

  exportExcelHandler = () => {
    const { formSubmittedValues, onExportExcel } = this.props;
    onExportExcel(formSubmittedValues);
  };

  closeReceiptWatch = () => {
    this.setState({ openDlDetail: false });
  };

  viewImportedStock = data => {
    this.setState({
      importedStockId: data.importedStockId,
      receiverCodeRefer: data.receiverCodeRefer,
      openDlDetail: true,
    });
  };

  onRefreshWeight = data => {
    this.props.history.push(
      `danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${
        this.state.receiverCodeRefer
      }&documentId=${this.state.importedStockId}&productCode=${
        data.productCode
      }&finshedProductCode=${data.finshedProductCode}&slotCode=${
        data.slotCode
      }&processingType=${data.processingType}`,
    );
  };

  render() {
    const {
      classes,
      formData,
      tableData,
      selectedRecords,
      onDeleteRecord,
      onSelectionChange,
      onUpdateTableData,
      ui,
      history,
      match,
    } = this.props;

    // Demo Data
    // const formData = demoFormData;
    // const tableData = demoTableData;
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">Thông Tin Xuất Kho</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoPXK} on={SCREEN_CODE.PXK}>
            <Link to={linksTo.createPage} style={{ textDecoration: 'none' }}>
              <Button className={classes.topButton} color="primary">
                Tạo mới
              </Button>
            </Link>
          </Can>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => this.printHandler(selectedRecords)}
          >
            In phiếu xuất kho
          </Button>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={this.exportExcelHandler}
          >
            Xuất excel
          </Button>
        </div>
      </div>
    );

    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        onDeleteRecord={onDeleteRecord}
        idForDeletion={this.state.idForDeletion}
      />
    );

    const tableColumns = makeTableColumns(
      formData,
      this.handleDialogOpen,
      this.viewImportedStock,
    );
    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            columns={tableColumns}
            data={tableData}
            components={{
              Row: MTableBodyRowCustomized,
            }}
            options={{
              headerStyle: {
                background: appTheme.palette.background.head,
              },
              showTitle: false,
              search: false,
              columnsButton: false,
              exportButton: false,
              selection: true,
              pageSize: 5,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
            onSelectionChange={data => {
              onSelectionChange(data);
            }}
            onChangePage={() => {
              // reset selected row collection
              onSelectionChange([]);
              const updatedTableData = tableData.map(row => {
                const updatedRow = { ...row };
                updatedRow.tableData.checked = false; // uncheck
                return updatedRow;
              });
              onUpdateTableData(updatedTableData);
            }}
            // this is customized as double click, NOT single click as usual
            onRowClick={(event, rowData) => {
              if ([TYPE_PXK.PXK_CHUYEN_MA].includes(rowData.subType)) {
                this.props.history.push(
                  `danh-sach-phieu-xuat-kho/xem-phieu-xuat-chuyen-ma-hang-hoa?form=3&id=${
                    rowData.documentId
                  }`,
                );
              } else if (
                ![
                  TYPE_PXK.PXK_NOI_BO,
                  TYPE_PXK.PXK_XDC_FARM,
                  TYPE_PXK.PXK_XUAT_HUY,
                  TYPE_PXK.PXK_XUAT_BAN,
                  TYPE_PXK.PXK_XUAT_BAN_XA,
                ].includes(rowData.subType)
              ) {
                this.props.history.push(
                  `${linksTo.detailPage}/${rowData.documentId}`,
                );
              } else {
                this.props.history.push(
                  `${linksTo.viewPage}/${rowData.documentId}?type=${
                    rowData.subType
                  }&form=${TYPE_FORM.VIEW}&plantId=${rowData.deliverCode}`,
                );
              }
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
        {deleteDialog}
        {this.state.openDlDetail && (
          <ImportedStockReceiptDetail
            ui={ui}
            importedStockId={this.state.importedStockId}
            openDl={this.state.openDlDetail}
            history={history}
            match={match}
            closeDialog={this.closeReceiptWatch}
            onRefreshWeight={this.onRefreshWeight}
          />
        )}
      </Paper>
    );
  }
}

TableSection.propTypes = {
  history: PropTypes.object,
  ui: PropTypes.object,
  match: PropTypes.object,
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  onSelectionChange: PropTypes.func,
  onDeleteRecord: PropTypes.func,
  selectedRecords: PropTypes.array,
  onUpdateTableData: PropTypes.func,
  onPrintSelected: PropTypes.func,
  formSubmittedValues: PropTypes.object,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  selectedRecords: makeSelect.tableSelectedRecords(),
  formSubmittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    onDeleteRecord: recordId => dispatch(actions.deleteRecord(recordId)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onPrintSelected: (selectedRecords, callback) =>
      dispatch(actions.printSelectedRecords(selectedRecords, callback)),
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
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
