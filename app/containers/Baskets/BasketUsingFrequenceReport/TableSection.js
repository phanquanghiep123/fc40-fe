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
import Expansion from 'components/Expansion';
import appTheme from 'containers/App/theme';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import FormDataFree from 'components/FormikUI/FormDataFree';
import * as selectors from './selectors';
import * as actions from './actions';
import PinnedRowRenderer from '../../../components/FormikUI/PinnedRowRenderer';

export const numericParser = params => {
  if (params.newValue === '0') {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};

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
  actionButtons: {
    marginRight: theme.spacing.unit * 4,
  },
});

const tableColumns = () => [
  {
    headerName: 'STT',
    field: 'indexOfAll',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 50,
    pinned: 'left',
    valueGetter: params => {
      if (!params.data.totalCol) {
        return params.node.rowIndex + 1;
      }
      return '';
    },
  },
  {
    headerName: 'Tháng',
    field: 'date',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 90,
    pinned: 'left',
    tooltipField: 'date',
  },
  {
    headerName: 'Đơn Vị',
    field: 'plantName',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    pinned: 'left',
    tooltipField: 'plantName',
  },
  {
    headerName: 'Mã Khay Sọt',
    field: 'basketCode',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 100,
    pinned: 'left',
    tooltipField: 'basketCode',
  },
  {
    headerName: 'Tên Khay Sọt ',
    field: 'basketName',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 150,
    tooltipField: 'basketName',
  },
  {
    headerName: 'Đơn Vị Tính',
    field: 'uoM',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 80,
    tooltipField: 'uoM',
  },
  {
    headerName: 'SL Tồn Vật Lý (1)',
    field: 'inventoryQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 100,
    tooltipField: 'inventoryQuantity',
    valueGetter: params => formatToCurrency(params.data.inventoryQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'SL Đi Đường (2)',
    field: 'bywayQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 100,
    tooltipField: 'bywayQuantity',
    valueGetter: params => formatToCurrency(params.data.bywayQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'SL Vendor Mượn (3)',
    field: 'lendQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    tooltipField: 'lendQuantity',
    valueGetter: params => formatToCurrency(params.data.lendQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName:
      'SL Sử Dụng TB Đơn Vị (4) = ((1) + (2) + (3))/Số Ngày Có Tồn Trong Tháng',
    field: 'averageQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 140,
    tooltipField: 'averageQuantity',
    valueGetter: params => formatToCurrency(params.data.averageQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'SL KS Sử Dụng Nhiều Nhất Trong Tháng',
    field: 'maxUseQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    tooltipField: 'maxUseQuantity',
    valueGetter: params => formatToCurrency(params.data.maxUseQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'SL Hủy Do Mất Lũy Kế (5)',
    field: 'cancelQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 110,
    tooltipField: 'cancelQuantity',
    valueGetter: params => formatToCurrency(params.data.cancelQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: ' SL Hủy Do Mất Trong Tháng',
    field: 'cancelQuantityInMonth',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 110,
    tooltipField: 'cancelQuantityInMonth',
    valueGetter: params => formatToCurrency(params.data.cancelQuantityInMonth),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Tổng SL Sử Dụng TB Và Mất Của ĐV (6) = (5) + (4)',
    field: 'totalInPlantQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    tooltipField: 'totalInPlantQuantity',
    valueGetter: params => formatToCurrency(params.data.totalInPlantQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'SL TB Cả Nước (7)',
    field: 'totalAllPlantQuantity',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 110,
    tooltipField: 'totalAllPlantQuantity',
    valueGetter: params => formatToCurrency(params.data.totalAllPlantQuantity),
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Hệ Số Sử Dụng (8)=(6)/(7)',
    field: 'frequencyOfUse',
    headerClass: 'ag-numeric-header ag-border-left',
    cellClass: 'ag-border-left',
    width: 110,
    tooltipField: 'frequencyOfUse',
    valueGetter: params => `${formatToCurrency(params.data.frequencyOfUse)}%`,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Trạng Thái',
    field: 'statusName',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    tooltipField: 'statusName',
  },
  {
    headerName: 'Version',
    field: 'version',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 110,
    tooltipField: 'version',
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

  onChangePage = pageIndex => {
    const { onSearch, paramsSearch } = this.props;
    if (pageIndex !== paramsSearch.pageIndex) {
      paramsSearch.pageIndex = pageIndex;
      onSearch(paramsSearch);
    }
  };

  onChangeRowsPerPage = event => {
    const pageSize = event;
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

  showPopup = () => {
    this.props.history.push(
      '/bao-cao-tan-suat-su-dung-khay-sot/tinh-toan-bao-cao-tan-xuat-su-dung-khay-sot',
    );
    // this.props.ui.props.onOpenDialog();
    // this.props.handleSearchPopup({
    //   plantCode: [],
    //   date: new Date(),
    //   pageSize: 10,
    //   pageIndex: 0,
    // });
  };

  handlePrint = () => {
    this.props.onPrint(data => {
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

  render() {
    const getColumnDefs = tableColumns();
    const { classes, table, paramsSearch, onExportExcel, onSync } = this.props;

    const totalBottom = () => {
      const rowBottom = table[table.length - 1];
      if (rowBottom) {
        return [
          {
            uoM: 'Tổng',
            totalCol: true,
            inventoryQuantity: rowBottom.inventoryQuantity,
            bywayQuantity: rowBottom.bywayQuantity,
            lendQuantity: rowBottom.lendQuantity,
            averageQuantity: rowBottom.averageQuantity,
            maxUseQuantity: rowBottom.maxUseQuantity,
            cancelQuantity: rowBottom.cancelQuantity,
            cancelQuantityInMonth: rowBottom.cancelQuantityInMonth,
            totalInPlantQuantity: rowBottom.totalInPlantQuantity,
            frequencyOfUse: rowBottom.frequencyOfUse,
            totalAllPlantQuantity: rowBottom.totalAllPlantQuantity,
          },
        ];
      }
      return [];
    };

    return (
      <Paper className={classes.paper}>
        <Expansion
          title="II. Báo Cáo Tần Suất Sử Dụng Khay Sọt"
          noPadding
          rightActions={
            <div className={classes.topToolbarPart}>
              <Can do={CODE.dongboSAPBCTSSDKS} on={SCREEN_CODE.BCTSSDKS}>
                <Button
                  type="button"
                  variant="contained"
                  className={classes.btnAction}
                  onClick={onSync}
                >
                  Đồng bộ SAP
                </Button>
              </Can>
              <Can do={CODE.chayBCTSSDKS} on={SCREEN_CODE.BCTSSDKS}>
                <Button
                  type="button"
                  variant="contained"
                  className={classes.btnAction}
                  onClick={this.showPopup}
                >
                  Chạy báo cáo
                </Button>
              </Can>

              <Button
                type="button"
                variant="contained"
                className={classes.btnAction}
                onClick={onExportExcel}
              >
                Xuất excel
              </Button>
              <Button
                type="button"
                variant="contained"
                className={classes.btnAction}
                onClick={this.handlePrint}
              >
                In báo cáo
              </Button>
            </div>
          }
          content={
            <MuiThemeProvider theme={muiTheme}>
              <FormDataFree
                columnDefs={getColumnDefs}
                rowData={table.filter((_, i) => i !== table.length - 1)}
                gridStyle={{ height: 432 }}
                customizePagination
                remotePagination
                totalCount={paramsSearch.totalItem || 0}
                pageIndex={paramsSearch.pageIndex || 0}
                // onOrderChange={this.onOrderChange}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                pageSize={paramsSearch.pageSize}
                gridProps={{
                  headerHeight: 86,
                  pinnedBottomRowData: totalBottom(),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle: params => {
                    if (params.data.totalCol) {
                      return {
                        fontWeight: 'bold',
                        backgroundColor: appTheme.palette.background.default,
                      };
                    }
                    return {};
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
  onSearch: PropTypes.func,
  onSync: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  table: selectors.tableData(),
  paramsSearch: selectors.paramsSearchSelect(),
});
function mapDispatchToProps(dispatch) {
  return {
    onExportExcel: () => dispatch(actions.exportExcel()),
    onPrint: callback => dispatch(actions.print(callback)),
    onSearch: data => dispatch(actions.search(data)),
    onSync: () => dispatch(actions.onSync()),
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
