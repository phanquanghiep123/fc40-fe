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
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import MaterialTable from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import { MuiTableBody } from 'components/MuiTable';
import appTheme from 'containers/App/theme';
import * as selectors from './selectors';
import * as actions from './actions';
import { convertDateTimeString } from '../App/utils';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';

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
    title: 'Mã Phiếu',
    field: 'assetDocumentCode',
    sort: true,
  },
  {
    title: 'Loại Phiếu',
    field: 'assetDocumentName',
    sort: true,
  },
  {
    title: 'Trạng Thái',
    field: 'statusName',
    sort: true,
  },

  {
    title: 'Đơn Vị Thực Hiện',
    field: 'plantName',
    sort: true,
  },
  {
    title: 'Mã BBKK',
    field: 'stockTakingCode',
    sort: true,
  },
  {
    title: 'PYC Thanh Lý/Hủy',
    field: 'basketCancellReceiptCode',
    sort: true,
  },
  {
    title: 'Mã PNKS - PXKS Sử Dụng',
    field: 'basketDocumentCode',
    sort: true,
  },
  {
    title: 'Nhân Viên Thực Hiện',
    field: 'userName',
    sort: false,
  },
  {
    title: 'Ngày Xuất/Nhập',
    field: 'date',
    sort: true,
    render: rowData => <span>{convertDateTimeString(rowData.date)}</span>,
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
  selectedRows = [];

  exportExcelHandler = () => {
    this.props.onExportExcel();
  };

  printHandler = () => {
    if (this.selectedRows.length === 0) {
      this.props.showWarning('Chưa có phiếu Xuất/Nhập Sở Hữu nào được chọn');
      return false;
    }
    const ids = [];
    if (this.selectedRows) {
      this.selectedRows.forEach(item => {
        ids.push(item.id);
      });
    }
    this.props.onPrint(ids.toString(), data => {
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
    return true;
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  createHandle = () => {
    this.props.history.push(
      'danh-sach-phieu-xuat-nhap-so-huu/tao-phieu-nhap-kho-khay-sot?form=1',
    );
  };

  onOrderChange = (orderBy, orderDirection) => {
    const tableColumn = tableColumns();
    const column = tableColumn[orderBy];
    if (column && column.field) {
      let sortOrder = column.field;
      if (sortOrder === 'assetDocumentName') {
        sortOrder = 'AssetDocumentType';
      } else if (sortOrder === 'statusName') {
        sortOrder = 'status';
      }
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
    if (paramsSearch.totalItem < (pageSize - 1) * paramsSearch.pageIndex) {
      paramsSearch.pageIndex = Math.ceil(paramsSearch.totalItem / pageSize) - 1;
    }
    paramsSearch.pageSize = pageSize;
    onSearch(paramsSearch);
  };

  render() {
    const getColumnDefs = tableColumns();
    const { classes, table, paramsSearch } = this.props;
    return (
      <Paper className={classes.paper}>
        <Expansion
          title="II. Thông Tin Phiếu Xuất/Nhập Sở Hữu"
          noPadding
          rightActions={
            <div className={classes.topToolbarPart}>
              <Can do={CODE.taoPXNKSSH} on={SCREEN_CODE.PXNKSSH}>
                <Button
                  type="button"
                  variant="contained"
                  className={classes.btnAction}
                  onClick={this.createHandle}
                >
                  Đăng Kí Mới
                </Button>
              </Can>
              <Button
                type="button"
                variant="contained"
                className={classes.btnAction}
                onClick={this.printHandler}
                disabled={table.length === 0 && true}
              >
                In Phiếu
              </Button>
              <Button
                type="button"
                variant="contained"
                className={classes.btnAction}
                onClick={this.exportExcelHandler}
                disabled={table.length === 0 && true}
              >
                Xuất excel
              </Button>
            </div>
          }
          content={
            <MuiThemeProvider theme={muiTheme}>
              <MaterialTable
                columns={getColumnDefs}
                data={table}
                components={{
                  Row: MTableBodyRowCustomized,
                  Body: props => (
                    <MuiTableBody
                      {...props}
                      renderData={table}
                      currentPage={0}
                    />
                  ),
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
                initialPage={paramsSearch.pageIndex}
                options={{
                  headerStyle: {
                    position: 'sticky',
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
                  paging: true,
                  columnsButton: false,
                  exportButton: false,
                  pageSize: paramsSearch.pageSize,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: true,
                  emptyRowsWhenPaging: false,
                  selection: true,
                  maxBodyHeight: 555,
                }}
                onSelectionChange={data => {
                  this.selectedRows = data;
                }}
                onRowClick={(e, rowData) => {
                  this.props.history.push(
                    `/danh-sach-phieu-xuat-nhap-so-huu/xem-phieu-nhap-kho-khay-sot?form=3&id=${
                      rowData.id
                    }&type=1`,
                  );
                }}
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
  showWarning: PropTypes.func,
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
