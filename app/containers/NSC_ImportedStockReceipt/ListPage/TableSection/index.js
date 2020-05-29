import { Can } from 'authorize/ability-context';
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import {
  Button,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Typography,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { openDialogImportStock } from '../../CreatePage/actions';
import ImportedStockReceipt from '../../CreatePage';
import ImportedStockReceiptDetail from '../../DetailPage';
import DeleteConfirm from './ConfirmDeletionDialog';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { SUBTYPE } from '../constants';

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
          // minWidth: '48px',
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
    openDl: false,
    documentId: null,
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

  viewImportedStock = rowData => {
    this.setState({ openDl: true, documentId: rowData.documentId });
  };

  closeImportedStock = () => {
    this.setState({ openDl: false, documentId: null });
  };

  refreshSearch = () => {
    const { onSubmitForm, submittedValues } = this.props;
    onSubmitForm(submittedValues);
  };

  /**
   * Export Excel with submittedValues by calling export API
   *
   * @param formSubmittedValues
   */
  exportExcelHandler = formSubmittedValues => {
    this.props.onExportExcel(formSubmittedValues);
  };

  render() {
    const {
      ui,
      match,
      classes,
      formData,
      tableData,
      selectedRecords,
      onDeleteRecord,
      onSelectionChange,
      onUpdateTableData,
      createImportStock,
      history,
      submittedValues,
    } = this.props;
    const { documentId, openDl } = this.state;

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">Thông Tin Nhập Kho</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoPCNK} on={SCREEN_CODE.IMPORT_STOCK}>
            <Button
              onClick={() => createImportStock(null)}
              className={classes.topButton}
              color="primary"
            >
              Tạo mới
            </Button>
          </Can>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => this.printHandler(selectedRecords)}
          >
            In phiếu nhập kho
          </Button>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => this.exportExcelHandler(submittedValues)}
            disabled={tableData.length === 0}
          >
            Tải Xuống
          </Button>
        </div>
        <ImportedStockReceipt match={match} ui={ui} history={history} />
        {openDl && (
          <ImportedStockReceiptDetail
            ui={ui}
            match={match}
            history={history}
            importedStockId={documentId}
            openDl={openDl}
            closeDialog={this.closeImportedStock}
            onCompleteSuccess={this.refreshSearch}
          />
        )}
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
      this.props.onEditImportStock,
      this.handleDialogOpen,
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
              if (rowData.subType === SUBTYPE.TRANSFER_GOODS_CODE) {
                history.push(
                  `/danh-sach-phieu-can-nhap-kho/xem-phieu-nhap-chuyen-ma-hang-hoa?form=3&id=${
                    rowData.documentId
                  }`,
                );
              } else {
                this.viewImportedStock(rowData);
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
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  onSelectionChange: PropTypes.func,
  onDeleteRecord: PropTypes.func,
  selectedRecords: PropTypes.array,
  onUpdateTableData: PropTypes.func,
  onPrintSelected: PropTypes.func,
  createImportStock: PropTypes.func,
  onEditImportStock: PropTypes.func,
  ui: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  submittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  selectedRecords: makeSelect.tableSelectedRecords(),
  submittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    createImportStock: importStockId =>
      dispatch(openDialogImportStock(importStockId)),
    onEditImportStock: importStockId => {
      dispatch(openDialogImportStock(importStockId));
    },
    onDeleteRecord: recordId => dispatch(actions.deleteRecord(recordId)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onPrintSelected: (selectedRecords, callback) =>
      dispatch(actions.printSelectedRecords(selectedRecords, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
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
