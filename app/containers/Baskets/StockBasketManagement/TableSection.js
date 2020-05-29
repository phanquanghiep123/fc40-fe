import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  MuiThemeProvider,
  Paper,
  withStyles,
  Button,
  createMuiTheme,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { showWarning } from 'containers/App/actions';
import Expansion from 'components/Expansion';
import MaterialTable from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import { MuiTableBody } from 'components/MuiTable';
import appTheme from 'containers/App/theme';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import * as selectors from './selectors';
import * as actions from './actions';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';

export const numericParser = params => {
  if (params.newValue === '0') {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.quantity ? formatToCurrency(params.quantity) : params.quantity;

export const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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

  btnAction: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

const tableColumns = () => [
  {
    title: 'STT',
    field: 'indexOfAll',
    width: 50,
    render: params => {
      if (params.total) {
        return '';
      }
      return params.tableData.id + 1;
    },
    sort: false,
  },
  {
    title: 'Mã Đơn Vị',
    field: 'plantCode',
    sort: true,
  },
  {
    title: 'Đơn Vị Quản Lý',
    field: 'plantName',
    sort: true,
  },
  {
    title: 'Mã Kho',
    field: 'basketLocatorCode',
    sort: true,
  },
  {
    title: 'Tên Kho',
    field: 'description',
    sort: true,
  },
  {
    title: 'Mã Khay Sọt',
    field: 'basketCode',
    sort: true,
  },
  {
    title: 'Tên Khay Sọt ',
    field: 'basketName',
    sort: true,
  },
  {
    title: 'Đơn Vị Tính',
    field: 'uoM',
    cellStyle: {
      width: 120,
    },
    headerStyle: {
      width: 120,
    },
    sort: true,
    render: params => {
      if (params.total) {
        return <div style={{ fontWeight: 'bold' }}>Tổng</div>;
      }
      return params.uoM;
    },
  },
  {
    title: 'Số Lượng',
    field: 'quantity',
    cellStyle: {
      width: 150,
      textAlign: 'right',
      paddingRight: '33px',
    },
    headerStyle: { textAlign: 'right', width: 150 },
    render: params => {
      if (params.total) {
        return (
          <div style={{ fontWeight: 'bold' }}>{numberCurrency(params)}</div>
        );
      }
      return numberCurrency(params);
    },
    sort: true,
  },
];

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
  exportExcelHandler = () => {
    this.props.onExportExcel();
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const tableColumn = tableColumns();
    const column = tableColumn[orderBy];
    if (column && column.field) {
      const sortOrder = column.field;
      const sort = `${orderDirection === 'asc' ? '' : '-'}${sortOrder}`;
      this.props.onSearch({
        ...this.props.paramsSearch,
        sort,
      });
    }
  };

  onChangePage = (event, pageIndex) => {
    const { onSearch, paramsSearch } = this.props;
    if (pageIndex !== paramsSearch.pageIndex) {
      paramsSearch.pageIndex = pageIndex;
      onSearch(paramsSearch);
    }
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onSearch, paramsSearch } = this.props;
    if (
      paramsSearch.totalItem <= (pageSize - 1) * paramsSearch.pageIndex ||
      paramsSearch.totalItem === (pageSize - 1) * paramsSearch.pageIndex + 1
    ) {
      paramsSearch.pageIndex = Math.ceil(paramsSearch.totalItem / pageSize) - 1;
    }
    paramsSearch.pageSize = pageSize;
    onSearch(paramsSearch);
  };

  render() {
    const getColumnDefs = tableColumns();
    const { classes, table, paramsSearch, history } = this.props;
    return (
      <Paper className={classes.paper}>
        <Expansion
          title="II. Thông Tin Kho Khay Sọt"
          noPadding
          rightActions={
            <div className={classes.topToolbarPart}>
              <Can do={CODE.kiemkeKKS} on={SCREEN_CODE.QLKKS}>
                <Button
                  type="button"
                  variant="contained"
                  className={classes.btnAction}
                  onClick={() => {
                    history.push(
                      '/danh-sach-bien-ban-kiem-ke/tao-bien-ban-kiem-ke-khay-sot?form=1',
                    );
                  }}
                >
                  Kiểm Kê
                </Button>
              </Can>

              <Button
                type="button"
                variant="contained"
                className={classes.btnAction}
                onClick={this.exportExcelHandler}
              >
                Xuất excel
              </Button>
            </div>
          }
          content={
            <MuiThemeProvider theme={muiTheme}>
              <MaterialTable
                columns={getColumnDefs}
                data={table.filter((_, i) => i !== table.length - 1)}
                components={{
                  Row: MTableBodyRowCustomized,
                  Body: props => (
                    <MuiTableBody
                      {...props}
                      renderData={table.filter(
                        (_, i) => i !== table.length - 1,
                      )}
                      currentPage={0}
                    />
                  ),
                }}
                initialPage={paramsSearch.pageIndex}
                options={{
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
                  search: false,
                  paging: false,
                  columnsButton: false,
                  exportButton: false,
                  pageSize: paramsSearch.pageSize,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                  maxBodyHeight: 530,
                }}
                // onRowClick={(e, rowData) => {
                //   this.props.history.push(
                //     `/danh-sach-phieu-xuat-kho-khay-sot/phieu-xuat-kho-khay-sot?form=3&id=${
                //       rowData.id
                //     }`,
                //   );
                // }}
                totalCount={paramsSearch.totalItem}
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
              <MaterialTable
                columns={getColumnDefs}
                data={table.filter((_, i) => i === table.length - 1)}
                options={{
                  header: false,
                  toolbar: false,
                  emptyRowsWhenPaging: false,
                }}
                components={{
                  Pagination: props => (
                    <TablePagination
                      {...props}
                      page={paramsSearch.pageIndex || 0}
                      rowsPerPage={paramsSearch.pageSize || 10}
                      count={paramsSearch.totalItem}
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
          }
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  paramsSearch: PropTypes.object,
  table: PropTypes.array,
  onExportExcel: PropTypes.func,
  onPrint: PropTypes.func,
  onDelete: PropTypes.func,
  showWarning: PropTypes.func,
  getOrderChange: PropTypes.func,
  onSearch: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  table: selectors.tableData(),
  paramsSearch: selectors.paramsSearchSelect(),
});
function mapDispatchToProps(dispatch) {
  return {
    showWarning: message => dispatch(showWarning(message)),
    onExportExcel: () => dispatch(actions.exportExcel()),
    onPrint: (ids, callback) => dispatch(actions.print(ids, callback)),
    onDelete: data => dispatch(actions.deleteExportBasket(data)),
    getOrderChange: () => dispatch(actions.orderChange()),
    onSearch: data => dispatch(actions.search(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(TableSection);
