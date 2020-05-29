import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import MuiButton from 'components/MuiButton';
import FormData from 'components/FormikUI/FormData';
import ConfirmationDialog from 'components/ConfirmationDialog';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import DeliSuggest from '../../DeliSuggest/Loadable';
import { openPopup } from '../../DeliSuggest/actions';
import WrapperBusiness from '../Business';
import ActionsRenderer from '../ActionsRenderer';
import { bbgnhhRoutine } from '../routines';
import {
  decimalFormatter,
  sortStockList,
  getTotalStocks,
  transformDeliStocks,
} from '../utils';

import { CODE_FORM, TYPE_FORM } from '../constants';
import appTheme from '../../../App/theme';

export class ForICD extends React.Component {
  gridApi = null;

  columnDefs = [
    {
      headerName: 'STT',
      width: 40,
      valueFormatter: this.renderOrderNumber,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Cửa Hàng',
      field: 'shipToCode',
      tooltipField: 'shipToCode',
    },
    {
      headerName: 'Địa Chỉ',
      field: 'routeAddress',
      tooltipField: 'routeAddress',
    },
    {
      headerName: 'Mã Tuyến',
      field: 'routeCode',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Số Lượng Xuất',
      field: 'quantity',
      type: 'numericColumn',
      valueFormatter: decimalFormatter,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uoM',
    },
    {
      headerName: 'Thông Tin Khay Sọt',
      children: [
        {
          headerName: 'Tên',
          field: 'basketName1',
          tooltipField: 'basketName1',
          headerClass: 'ag-border-left',
        },
        {
          headerName: 'SL',
          field: 'deliverQuantity1',
          type: 'numericColumn',
        },
        {
          headerName: 'Tên',
          field: 'basketName2',
          tooltipField: 'basketName2',
        },
        {
          headerName: 'SL',
          field: 'deliverQuantity2',
          type: 'numericColumn',
        },
        {
          headerName: 'Tên',
          field: 'basketName3',
          tooltipField: 'basketName3',
        },
        {
          headerName: 'SL',
          field: 'deliverQuantity3',
          headerClass: 'ag-border-right',
          type: 'numericColumn',
        },
      ],
    },
    {
      headerName: 'Ghi Chú',
      field: 'notes',
      tooltipField: 'notes',
    },
    {
      headerName: '',
      width: 30,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionsRenderer,
      cellRendererParams: {
        onRemove: (rowIndex, rowData) => this.onRemove(rowIndex, rowData),
        showRemove: ({ data }) => data && data.isMainRow,
      },
      suppressSizeToFit: true,
    },
  ];

  defaultColDef = {
    editable: false,
    resizable: false,
    suppressMovable: true,
  };

  gridOptions = { alignedGrids: [] };

  totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };

  confirmationDialog = null;

  componentDidMount() {
    this.gridOptions.alignedGrids.push(this.totalOptions);
    this.totalOptions.alignedGrids.push(this.gridOptions);
  }

  getStockList() {
    const stockList = getIn(
      this.props.formik.values,
      'deliveryReceiptStocks',
      [],
    );
    return stockList.slice();
  }

  setStockList(value = []) {
    this.props.formik.setFieldValue('deliveryReceiptStocks', value);
  }

  getRowStyle({ data }) {
    if (!data.isMainRow) {
      return {
        borderTop: 'none',
        backgroundColor: appTheme.palette.background.default,
      };
    }
    return {};
  }

  mergeStockList(datas, nextDatas) {
    if (nextDatas && nextDatas.length > 0) {
      for (let i = 0, len = nextDatas.length; i < len; i += 1) {
        const data = nextDatas[i];
        if (data && !this.checkStockExist(datas, data)) {
          datas.push(data);
        }
      }
    }
    return datas;
  }

  /**
   * Kiểm tra hàng hóa đã tồn tại
   */
  checkStockExist(datas, data) {
    if (datas && datas.length > 0) {
      const found = datas.find(
        item =>
          item &&
          item.shipToCode === data.shipToCode &&
          item.customerCode === data.customerCode,
      );
      if (found) {
        return true;
      }
    }
    return false;
  }

  /**
   * Thực hiện xóa dòng
   */
  removeLocal = (_, { rowIndex }) => {
    const stockList = this.getStockList();

    if (stockList && stockList[rowIndex]) {
      stockList.splice(rowIndex, 1);
      this.setStockList(stockList);
    }
  };

  /**
   * Thực hiện xóa dòng remote
   */
  removeRemote = (rowIndex, rowData) => {
    this.props.onRemoveRemote(rowData.shipToCode, rowData.stockIds, () => {
      this.removeLocal(rowIndex, rowData);
    });
  };

  /**
   * Xác nhận thực hiện xóa dòng
   */
  performRemove = (rowIndex, rowData) => {
    if (this.props.formik.status === TYPE_FORM.VIEW) {
      this.removeRemote(rowIndex, rowData);
    } else {
      this.removeLocal(rowIndex, rowData);
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  /**
   * Nhận sự kiện xóa dòng
   */
  onRemove = (rowIndex, rowData) => {
    this.confirmationDialog.showConfirm({
      title: 'Cảnh báo',
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.performRemove(rowIndex, rowData),
        },
      ],
    });
  };

  /**
   * Nhận sự kiện mở popup Gợi ý từ deli
   */
  onDeliSuggestOpen = () => {
    const {
      deliverCode,
      deliverName,
      deliveryDate,
      deliveryReceiptStocks,
    } = this.props.formik.values;
    this.props.onDeliSuggestOpen(
      deliverCode,
      deliverName,
      new Date(deliveryDate),
      deliveryReceiptStocks,
    );
  };

  /**
   * Nhận sự kiện khi Chọn cửa hàng
   */
  onSelectionSuccess = selectedData => {
    const stockList = this.getStockList();
    const nextStockList = this.mergeStockList(stockList, selectedData);
    this.setStockList(sortStockList(nextStockList));
  };

  renderOrderNumber({ data }) {
    if (data && data.isMainRow && !data.totalCol) {
      return data.rowIndex + 1;
    }
    return null;
  }

  render() {
    const { ui } = this.props;

    const stockList = this.getStockList();
    const initialData = transformDeliStocks(stockList);

    const pinned = [
      {
        totalCol: true,
        routeCode: 'Tổng',
        quantity: getTotalStocks(initialData),
      },
    ];

    const gridProps = {
      getRowStyle: this.getRowStyle,
    };

    return (
      <Grid container>
        <WrapperBusiness code={CODE_FORM.BUTTON_DELI}>
          <Grid item xs={12}>
            <MuiButton onClick={this.onDeliSuggestOpen}>
              Gợi Ý Từ Deli
            </MuiButton>
          </Grid>
        </WrapperBusiness>
        <Grid item xs={12}>
          <FormData
            name="deliveryReceiptStocks"
            idGrid="bbgnhh-goods-icd"
            rowData={initialData}
            gridProps={{
              ...gridProps,
              gridOptions: this.gridOptions,
              pinnedBottomRowData: initialData.length === 0 ? [] : pinned,
              frameworkComponents: {
                customPinnedRowRenderer: PinnedRowRenderer,
              },
            }}
            autoLayout
            columnDefs={this.columnDefs}
            defaultColDef={this.defaultColDef}
            onGridReady={this.onGridReady}
          />
        </Grid>
        <DeliSuggest ui={ui} onSelectionSuccess={this.onSelectionSuccess} />
        <ConfirmationDialog
          ref={ref => {
            this.confirmationDialog = ref;
          }}
        />
      </Grid>
    );
  }
}

ForICD.propTypes = {
  ui: PropTypes.object,
  formik: PropTypes.object,
  onRemoveRemote: PropTypes.func,
  onDeliSuggestOpen: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  onRemoveRemote: (shipToCode, stockIds, callback) =>
    dispatch(bbgnhhRoutine.editingRequest({ shipToCode, stockIds, callback })),
  onDeliSuggestOpen: (
    deliverCode,
    deliverName,
    deliveryDate,
    deliveryReceiptStocks,
  ) =>
    dispatch(
      openPopup(deliverCode, deliverName, deliveryDate, deliveryReceiptStocks),
    ),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(ForICD);
