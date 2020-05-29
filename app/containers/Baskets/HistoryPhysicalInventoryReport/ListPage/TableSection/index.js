import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Paper,
  withStyles,
  createMuiTheme,
  TablePagination,
  MuiThemeProvider,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import Expansion from 'components/Expansion';
import { createStructuredSelector } from 'reselect/lib';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import appTheme from '../../../../App/theme';
import {
  convertDateString,
  convertDateTimeStringNoSecond,
} from '../../../../App/utils';

const style = (theme = appTheme) => ({
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

class TableSection extends React.Component {
  createColumns = () => {
    const columns = [
      {
        title: 'Đơn Vị',
        field: 'plantCode',
        width: '20vw',
      },
      {
        title: 'Ngày Báo Cáo',
        width: '20vw',
        render: rowData =>
          // eslint-disable-next-line prefer-template
          convertDateString(rowData.fromFinishDate) +
          '~' +
          convertDateString(rowData.toFinishDate),
        sort: false,
      },
      {
        title: 'Người Chạy Báo Cáo',
        width: '20vw',
        field: 'createdBy',
        sort: false,
      },
      {
        title: 'Thời Gian Chạy',
        width: '20vw',
        field: 'processDay',
        render: rowData => convertDateTimeStringNoSecond(rowData.processDay),
      },
    ];
    return columns;
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onSubmitForm, submittedValues, formData } = this.props;
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues, formData);
  };

  onChangePage = (event, pageIndex) => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    if (pageIndex !== submittedValues.pageIndex) {
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues, formData);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { formData, submittedValues } = this.props;
    const tableColumns = this.createColumns(formData);
    const column = tableColumns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      submittedValues.Sort = [sortOrder];
      this.props.onChangeOrder(submittedValues, formData);
    }
  };

  render() {
    const { tableData, submittedValues } = this.props;
    const columns = this.createColumns();
    return (
      <Expansion
        title="II. Lịch Sử Báo Cáo Tồn Vật Lý Khay Sọt"
        noPadding
        content={
          <Paper>
            <MuiThemeProvider theme={muiTheme}>
              <MaterialTable
                columns={columns}
                data={tableData}
                components={{
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
                options={{
                  headerStyle: {
                    background: appTheme.palette.background.head,
                  },
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  columnsButton: false,
                  exportButton: false,
                  selection: false,
                  pageSize: submittedValues.pageSize,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                }}
                totalCount={submittedValues.totalItem}
                onOrderChange={this.onOrderChange}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
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
          </Paper>
        }
      />
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  submittedValues: PropTypes.object,
  onChangeOrder: PropTypes.func,
  onSubmitForm: PropTypes.func,
  formValues: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  submittedValues: makeSelect.formSubmittedValues(),
  formValues: makeSelect.formValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeOrder: (formValues, formData, sort) =>
      dispatch(actions.onChangeOrder(formValues, formData, sort)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
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
