import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Button,
  Typography,
  TablePagination,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import DeleteConfirm from './ConfirmDeletionDialog';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

import DialogUploadFile from '../../DiaLogs/DialogUploadFile';
import AlertDialog from '../../DiaLogs/AlertDialog';

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
    openDialogExcel: false,
  };

  importHandler = () => {
    this.setState({ openDl: true });
  };

  closeImportDl = () => {
    this.setState({ openDl: false });
  };

  openDialogExcel() {
    this.setState({ openDialogExcel: true });
  }

  handleExcelDialogClose = () => {
    this.setState({ openDialogExcel: false });
  };

  exportHandler = () => {
    const { onExportExcel, submittedValues, formData } = this.props;
    onExportExcel(submittedValues, formData);
  };

  signalRProcessing = res => {
    const { onSubmitFileSignalr, onsignalRProcessing } = this.props;
    const {
      meta: { requestId },
    } = res;
    if (this.requestId === requestId) {
      onSubmitFileSignalr(res, () => onsignalRProcessing(res));
    }
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { pagingInit, submittedValues } = this.props;
    if (submittedValues.totalItem < pageSize * submittedValues.pageIndex) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    pagingInit(submittedValues);
  };

  onChangePage = (event, pageIndex) => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { pagingInit, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      pagingInit(submittedValues);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { formData, submittedValues } = this.props;
    const tableColumns = makeTableColumns(formData);
    const column = tableColumns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      submittedValues.sort = sortOrder;
      this.props.onChangeOrder(submittedValues);
    }
  };

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, idForDeletion: doId });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, idForDeletion: null });
  };

  render() {
    const {
      ui,
      classes,
      formData,
      tableData,
      onDeleteRecord,
      submittedValues,
      onSubmitFile,
      onSubmitFileSignalr,
      onSubmitForm,
      onDownloadSampleFile,
    } = this.props;

    const { openDl } = this.state;

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

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Giá Sàn</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoGS} on={SCREEN_CODE.DSGS}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => this.importHandler()}
              className={classes.topButton}
            >
              Import
            </Button>
          </Can>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={isEmpty(tableData)}
            className={classes.topButton}
            onClick={() => this.exportHandler()}
          >
            Xuất excel
          </Button>
        </div>
      </div>
    );

    const dialogUploadFile = openDl && (
      <DialogUploadFile
        ui={ui}
        openDl={openDl}
        onClose={this.closeImportDl}
        Regions={formData.RegionConsumeCode}
        onSubmitFile={onSubmitFile}
        onSubmitFileSignalr={onSubmitFileSignalr}
        onSubmitSuccess={onSubmitForm}
        submittedvalues={submittedValues}
        onDownloadSampleFile={onDownloadSampleFile}
      />
    );

    const exceltdialog = (
      <AlertDialog
        open={this.state.openDialogExcel}
        onClose={this.handleExcelDialogClose}
        message="Không có phiếu để xuất file"
      />
    );

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            onOrderChange={this.onOrderChange}
            data={tableData}
            columns={tableColumns}
            options={{
              search: false,
              pageSize: submittedValues.pageSize,
              headerStyle: {
                background: appTheme.palette.background.head,
                paddingTop: appTheme.spacing.unit,
                paddingBottom: appTheme.spacing.unit,
              },
              rowStyle: {
                paddingTop: appTheme.spacing.unit / 2,
                paddingBottom: appTheme.spacing.unit / 2,
              },
              toolbar: false,
              showTitle: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
            totalCount={submittedValues.totalItem}
            components={{
              Row: MTableBodyRowCustomized,
              Body: props => (
                <MuiTableBody
                  {...props}
                  renderData={tableData}
                  currentPage={0}
                />
              ),
              Pagination: props => (
                <TablePagination
                  {...props}
                  page={submittedValues.pageIndex}
                  count={submittedValues.totalItem}
                  rowsPerPage={submittedValues.pageSize}
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
              ),
            }}
            initialPage={submittedValues.pageIndex}
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
        {dialogUploadFile}
        {exceltdialog}
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
  pagingInit: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onSubmitFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onsignalRProcessing: PropTypes.func,
  onDownloadSampleFile: PropTypes.func,
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
    onDeleteRecord: recordId => dispatch(actions.deleteRecord(recordId)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onPrintSelected: (selectedRecords, callback) =>
      dispatch(actions.printSelectedRecords(selectedRecords, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    pagingInit: formValues => dispatch(actions.pagingInit(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    onSubmitFile: form => dispatch(actions.onSubmitFile(form)),
    onSubmitFileSignalr: (res, callback) =>
      dispatch(actions.submitFileSignalr(res, callback)),
    onsignalRProcessing: res => dispatch(actions.signalRProcessing(res)),
    onDownloadSampleFile: data => dispatch(actions.downloadSampleFile(data)),
    onExportExcel: (formSubmittedValues, formData) =>
      dispatch(actions.exportExcel(formSubmittedValues, formData)),
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
