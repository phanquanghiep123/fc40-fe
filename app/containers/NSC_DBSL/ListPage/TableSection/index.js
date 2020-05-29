/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { MuiTableBody } from 'components/MuiTable';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import appTheme from '../../../App/theme';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { convertDateString } from '../../../App/utils';
import AlertDialog from '../../DiaLogs/AlertDialog';
import DialogHistory from '../../DiaLogs/DialogHistory';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
    overflowX: 'auto',
    width: 'inherit',
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
  tableCell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const muiThemeOptions = {
  border: false,
};

const muiTheme = (theme = appTheme, options = muiThemeOptions) =>
  createMuiTheme({
    palette: {
      white: '#ffffff',
    },
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
          width: '100%',
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
          width: '100%',
          position: 'relative',
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
          width: '100%',
          background: theme.palette.background.head,
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: 'none',
          width: '100%',
        },
      },
      MuiToolbar: {
        root: {
          minHeight: '0 !important',
          width: '100%',
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
    openDialogView: false,
    itemView: null,
    openDialogExcel: false,
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onSubmitForm, submittedValues } = this.props;
    if (submittedValues.totalItem < pageSize * submittedValues.pageIndex) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues);
  };

  onChangePage = (event, pageIndex) => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onSubmitForm, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues);
    }
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

  openDialogViewHandle(item) {
    const { onviewItem } = this.props;
    return item.is_after || onviewItem(item, this.openDialogView);
  }

  openDialogView = data => {
    this.setState({ openDialogView: true, itemView: data });
  };

  handleDialogViewClose = () => {
    this.setState({ openDialogView: false, itemView: null });
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

  refreshSearch = () => {
    const { onSubmitForm, submittedValues } = this.props;
    onSubmitForm(submittedValues);
  };

  /**
   * Export Excel with submittedValues by calling export API
   *
   * @param formSubmittedValues
   */
  exportExcelHandler = () => {
    const { onExportExcel, submittedValues } = this.props;
    if (submittedValues.totalItem < 1) {
      this.setState({ openDialogExcel: false });
    } else {
      onExportExcel(submittedValues);
    }
  };

  exportExcelHistoryHandler = () => {
    const { onExportHistoryExcel, submittedValues } = this.props;
    onExportHistoryExcel(submittedValues);
  };

  render() {
    const { classes, tableData, submittedValues, ui } = this.props;

    const excelDialog = (
      <AlertDialog
        open={this.state.openDialogExcel}
        onClose={this.handleExcelDialogClose}
        message="Không có dữ liệu để xuất file"
      />
    );

    const historyDialog = (
      <DialogHistory
        ui={ui}
        openDl={this.state.openDialogView}
        onClose={this.handleDialogViewClose}
        DBSL={this.state.itemView}
        classes={classes}
      />
    );

    const renderCellWithColor = (rowData, index) => {
      const backgroundColor = rowData[`date${index}_color`];
      const dateValue = rowData[`date${index}`];

      const lableValue = dateValue ? formatToCurrency(dateValue) : '';

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className={classes.tableCell}
          style={{
            cursor:
              (rowData.is_after !== true && !!lableValue && 'pointer') ||
              'default',
            backgroundColor,
          }}
          onClick={() => {
            if (rowData.is_after !== true && !!lableValue) {
              const date = rowData[`date${index}_value`];
              const newRow = { ...rowData, finishDate: date };
              this.openDialogViewHandle(newRow);
            }
            return false;
          }}
        >
          {lableValue}
        </div>
      );
    };

    const newtableColumns = [];
    const { numberShowColumnDate = 10 } = submittedValues || {};
    let date;
    for (let i = 0; i <= numberShowColumnDate; i += 1) {
      date = new Date(submittedValues.dateFrom);
      date.setDate(date.getDate() + i);
      newtableColumns.push({
        title: `${convertDateString(date)}`,
        field: `date${i}`,
        sort: false,
        render: RowData => renderCellWithColor(RowData, i),
      });
    }
    const tableColumns = makeTableColumns(newtableColumns);
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Dự Báo Sản Lượng</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.topButton}
            onClick={() => this.exportExcelHandler()}
            disabled={isEmpty(tableData)}
          >
            Xuất excel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.topButton}
            onClick={() => this.exportExcelHistoryHandler()}
            disabled={isEmpty(tableData)}
          >
            Xuất lịch sử cập nhật
          </Button>
        </div>
      </div>
    );

    return (
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'grid',
        }}
      >
        <Paper className={classes.paper}>
          {topToolbar}
          <MuiThemeProvider theme={muiTheme}>
            <MaterialTable
              onOrderChange={this.onOrderChange}
              data={tableData}
              columns={tableColumns}
              options={{
                toolbar: false,
                search: false,
                pageSize: submittedValues.pageSize,
                headerStyle: {
                  background: appTheme.palette.background.head,
                  paddingTop: appTheme.spacing.unit,
                  paddingBottom: appTheme.spacing.unit,
                },
                rowStyle: row => ({
                  paddingTop: appTheme.spacing.unit / 2,
                  paddingBottom: appTheme.spacing.unit / 2,
                  backgroundColor: row.is_after
                    ? 'rgb(244, 245, 247)'
                    : appTheme.palette.white,
                }),

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
          {this.state.openDialogView && historyDialog}
          {this.state.openexcelDialog && excelDialog}
        </Paper>
      </div>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  history: PropTypes.object,
  ui: PropTypes.object,
  submittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onExportExcel: PropTypes.func,
  onviewItem: PropTypes.func,
  onExportHistoryExcel: PropTypes.func,
  itemView: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  selectedRecords: makeSelect.tableSelectedRecords(),
  submittedValues: makeSelect.formSubmittedValues(),
  itemView: makeSelect.itemViewValue(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    onviewItem: (item, callback) =>
      dispatch(actions.getViewItem(item, callback)),
    onExportExcel: submittedValues =>
      dispatch(actions.exportExcel(submittedValues)),
    onExportHistoryExcel: submittedValues =>
      dispatch(actions.exportHistoryExcel(submittedValues)),
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
