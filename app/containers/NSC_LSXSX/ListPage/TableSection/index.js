import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Typography,
  TablePagination,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import AlertDialog from '../../DiaLogs/AlertDialog';
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

  /**
   * Export Excel with submittedValues by calling export API
   *
   * @param formSubmittedValues
   */
  exportExcelHandler = () => {
    const { onExportExcel, submittedValues } = this.props;
    if (submittedValues.totalItem < 1) {
      this.setState({ openDialogExcel: true });
    } else {
      onExportExcel(submittedValues);
    }
  };

  handleExcelDialogClose = () => {
    this.setState({ openDialogExcel: false });
  };

  render() {
    const { classes, tableData, submittedValues } = this.props;
    const excelDialog = (
      <AlertDialog
        open={this.state.openDialogExcel}
        onClose={() => {
          this.handleExcelDialogClose();
        }}
        message="Không có dữ liệu để xuất file"
      />
    );
    const tableColumns = makeTableColumns();
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Lịch Sử Xử Lý</Typography>
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
              initialPage={submittedValues.pageIndex}
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
              components={{
                Row: MTableBodyRowCustomized,
                Body: props => (
                  <MuiTableBody
                    {...props}
                    renderData={tableData}
                    currentPage={0}
                    onRowCl
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
          {excelDialog}
        </Paper>
      </div>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  submittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
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
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
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
