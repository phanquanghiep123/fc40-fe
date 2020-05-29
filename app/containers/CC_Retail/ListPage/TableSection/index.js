import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { isEmpty as lodashEmpty } from 'lodash';
import { createStructuredSelector } from 'reselect/lib/index';
import TablePagination from '@material-ui/core/TablePagination';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import {
  MuiThemeProvider,
  Paper,
  withStyles,
  createMuiTheme,
  Button,
  Typography,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import DeleteConfirm from '../../DiaLogs/ConfirmDeletionDialog';
import ApproveDialog from '../../DiaLogs/ApproveDialog';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import AlertDialog from '../../DiaLogs/AlertDialog';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { LINK } from '../constants';

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
    // background: theme.palette.background.default,
    background: '#fff',
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 3}px`,
    boxShadow: `0 1px 3px #aaa`,
    '&:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
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
    openApproveDialog: false,
    Item: null,
    openDialogExcel: false,
  };

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, idForDeletion: doId });
  };

  openDialogExcel() {
    this.setState({ openDialogExcel: true });
  }

  handleExcelDialogClose = () => {
    this.setState({ openDialogExcel: false });
  };

  createNew = () => {
    const { history } = this.props;
    history.push(LINK.CREATE);
  };

  handleDialogAprovalOpen = item => {
    this.setState({ openApproveDialog: true, Item: item });
  };

  handleDialogAprovaClose = () => {
    this.setState({ openApproveDialog: false });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, idForDeletion: null });
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

  onSelectionChange = items => {
    const { submittedValues } = this.props;
    submittedValues.ids = items.map(item => item.id);
  };

  refreshSearch = () => {
    const { onSubmitForm, submittedValues } = this.props;
    onSubmitForm(submittedValues);
  };

  /**
   * Export Excel with submittedValues by calling export API
   *
   * @param submittedValues
   */
  exportExcelHandler = submittedValues => {
    this.props.onExportExcel(submittedValues);
  };

  onDeleteRecord = recordId => {
    const { submittedValues, onDeleteRecord } = this.props;
    onDeleteRecord(submittedValues, recordId);
  };

  exportExcelHandler = () => {
    const { OnExportExcel, submittedValues } = this.props;
    if (submittedValues.totalItem < 1) {
      this.openDialogExcel();
    } else {
      OnExportExcel(submittedValues);
    }
  };

  exportPdfHandler = () => {
    const { OnExportPdf, submittedValues } = this.props;
    OnExportPdf(submittedValues);
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { formData, submittedValues } = this.props;
    const tableColumns = makeTableColumns(formData);
    const column = tableColumns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      submittedValues.sort = [sortOrder];
      this.props.onChangeOrder(submittedValues);
    }
  };

  render() {
    const {
      tableData,
      submittedValues,
      classes,
      history,
      onApprovelItem,
    } = this.props;

    const isEmpty = lodashEmpty(tableData);

    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        onDeleteRecord={this.onDeleteRecord}
        idForDeletion={this.state.idForDeletion}
        submittedValues={submittedValues}
      />
    );

    const approveDialog = (
      <ApproveDialog
        open={this.state.openApproveDialog}
        onClose={this.handleDialogAprovaClose}
        item={this.state.Item}
        submittedValues={submittedValues}
        onApprovel={onApprovelItem}
      />
    );

    const exceltdialog = (
      <AlertDialog
        open={this.state.openDialogExcel}
        onClose={this.handleExcelDialogClose}
        message="Không có phiếu để xuất file"
      />
    );

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">
            II. Thông Tin Phiếu Yêu Cầu Bán Xá
          </Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoPXBX} on={SCREEN_CODE.PXBX}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={this.createNew}
              className={classes.topButton}
            >
              Tạo mới
            </Button>
          </Can>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.topButton}
            onClick={() => this.exportExcelHandler()}
            disabled={isEmpty}
          >
            Xuất excel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.topButton}
            onClick={() => this.exportPdfHandler()}
            disabled={isEmpty}
          >
            In PYCBX
          </Button>
        </div>
      </div>
    );
    const tableColumns = makeTableColumns(this.handleDialogOpen, history);
    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            data={tableData}
            columns={tableColumns}
            onOrderChange={this.onOrderChange}
            options={{
              search: false,
              toolbar: false,
              headerStyle: {
                background: appTheme.palette.background.head,
                paddingTop: appTheme.spacing.unit,
                paddingBottom: appTheme.spacing.unit,
              },
              rowStyle: {
                paddingTop: appTheme.spacing.unit / 2,
                paddingBottom: appTheme.spacing.unit / 2,
              },
              showTitle: false,
              columnsButton: false,
              exportButton: false,
              selection: true,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
            onRowClick={(event, rowData) => {
              history.push(`${LINK.VIEW}/${rowData.id}`);
            }}
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
            onSelectionChange={this.onSelectionChange}
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
        {approveDialog}
        {exceltdialog}
      </Paper>
    );
  }
}
TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  onPrintSelected: PropTypes.func,
  submittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
  onExportExcel: PropTypes.func,
  pagingInit: PropTypes.func,
  onDeleteRecord: PropTypes.func,
  onApprovelItem: PropTypes.func,
  history: PropTypes.object,
  onChangeOrder: PropTypes.func,
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
    onDeleteRecord: (formValues, recordId) =>
      dispatch(actions.deleteRecord(formValues, recordId)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onExportExcel: submittedValues =>
      dispatch(actions.exportExcel(submittedValues)),
    pagingInit: formValues => dispatch(actions.pagingInit(formValues)),
    onApprovelItem: (item, submittedValues) =>
      dispatch(actions.onApprovel(item, submittedValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    OnExportExcel: formValues => dispatch(actions.exportExcel(formValues)),
    OnExportPdf: formValues => dispatch(actions.exportPdf(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
