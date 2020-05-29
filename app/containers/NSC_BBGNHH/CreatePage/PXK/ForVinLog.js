import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import MuiButton from 'components/MuiButton';

import FormData from 'components/FormikUI/FormData';

import ConfirmationDialog from 'components/ConfirmationDialog';

import { openDialog } from 'containers/App/actions';

import Popup from './Popup';

import WrapperBusiness from '../Business';
import ActionsRenderer from '../ActionsRenderer';

import { exportReceiptsRoutine, deliveryStocksRoutine } from '../routines';

import { CODE_FORM, TYPE_FORM } from '../constants';

import { transformExportReceiptCodes } from '../utils';

export class ForVinLog extends React.Component {
  columnDefs = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Mã PXK',
      field: 'stockExportReceiptCode',
    },
    {
      headerName: 'Mã Khách Hàng',
      field: 'customerCode',
    },
    {
      headerName: 'Tên Khách Hàng',
      field: 'customerName',
      tooltipField: 'customerName',
    },
    {
      headerName: 'Mã PXKS Cho Mượn',
      field: 'basketDocumentCode',
      tooltipField: 'basketDocumentCode',
    },
    {
      headerName: '',
      width: 30,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionsRenderer,
      cellRendererParams: {
        onRemove: (rowIndex, rowData) => this.onRemove(rowIndex, rowData),
      },
      suppressSizeToFit: true,
    },
  ];

  defaultColDef = {
    editable: false,
    resizable: false,
    suppressMovable: true,
  };

  confirmationDialog = null;

  componentWillMount() {
    if (this.props.formik.status === TYPE_FORM.VIEW) {
      this.columnDefs.pop();
    }
  }

  getStockList() {
    const stockList = getIn(
      this.props.formik.values,
      'deliveryReceiptStocks',
      [],
    );
    return stockList.slice();
  }

  getExportReceipts() {
    const stockList = getIn(
      this.props.formik.values,
      'deliveryReceiptStockExports',
      [],
    );
    return stockList.slice();
  }

  setStockList(stock, basket) {
    this.props.formik.setFieldValue('deliveryReceiptStocks', stock);
    this.props.formik.setFieldValue('deliveryReceiptBaskets', basket);
  }

  setExportReceipts(value = []) {
    this.props.formik.setFieldValue('deliveryReceiptStockExports', value);
  }

  sortExportReceipts(rowNodes) {
    rowNodes.sort((rowNode, nextRowNode) => {
      if (rowNode.data && nextRowNode.data) {
        if (
          rowNode.data.stockExportReceiptCode <
          nextRowNode.data.stockExportReceiptCode
        ) {
          return -1;
        }
        if (
          rowNode.data.stockExportReceiptCode >
          nextRowNode.data.stockExportReceiptCode
        ) {
          return 1;
        }
      }
      return 0;
    });
  }

  /**
   * Get Danh sách PXK chưa có
   */
  getExportReceiptsNonExist(datas, nextDatas) {
    const results = [];

    if (nextDatas && nextDatas.length > 0) {
      for (let i = 0, len = nextDatas.length; i < len; i += 1) {
        const data = nextDatas[i];
        if (data && !this.checkExportReceiptExist(datas, data)) {
          results.push(data);
        }
      }
    }

    return results;
  }

  /**
   * Kiểm tra PXK đã tồn tại
   */
  checkExportReceiptExist(datas, data) {
    if (datas && datas.length > 0) {
      const found = datas.find(
        item =>
          item && item.stockExportReceiptCode === data.stockExportReceiptCode,
      );
      if (found) {
        return true;
      }
    }
    return false;
  }

  /**
   * Xác nhận thực hiện xóa dòng
   */
  performRemove = (rowIndex, rowData) => {
    const exportReceipts = this.getExportReceipts();
    if (exportReceipts && exportReceipts[rowIndex]) {
      exportReceipts.splice(rowIndex, 1);
      this.onRemoveSuccess(rowIndex, rowData);
      this.setExportReceipts(exportReceipts);
    }
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
          onClick: () => {
            this.performRemove(rowIndex, rowData);
          },
        },
      ],
    });
  };

  /**
   * Nhận sự kiện mở popup
   */
  onPopupOpen = () => {
    const { deliverCode, deliveryDate } = this.props.formik.values;
    this.props.onPopupOpen(deliverCode, deliveryDate);
  };

  /**
   * Nhận sự kiện khi xóa PXK thành công
   */
  onRemoveSuccess = (rowIndex, rowData) => {
    const stockList = this.getStockList();
    if (rowData) {
      if (stockList && stockList.length > 0) {
        const nextStockList = stockList.filter(
          data =>
            data &&
            (data.customerCode !== rowData.customerCode ||
              data.stockExportReceiptCode !== rowData.stockExportReceiptCode),
        );
        const nextExportReceiptCodes = transformExportReceiptCodes(
          nextStockList,
        );
        this.onGetDeliveryStocks(nextExportReceiptCodes);
        this.setStockList(nextStockList);
      }
    }
  };

  /**
   * Nhận sự kiện khi Chọn PXK
   */
  onSelectionSuccess = selectedData => {
    const exportReceipts = this.getExportReceipts();
    const nextExportReceipts = this.getExportReceiptsNonExist(
      exportReceipts,
      selectedData,
    );
    const stockData = getIn(
      this.props.formik.values,
      'deliveryReceiptStockExports',
      [],
    );
    const concatStock = nextExportReceipts.concat(stockData);
    // const nextExportReceiptCodes = transformExportReceiptCodes(
    //   nextExportReceipts,
    // );
    const nextExportReceiptCodes = transformExportReceiptCodes(concatStock);
    this.setExportReceipts([...exportReceipts, ...nextExportReceipts]);
    this.onGetDeliveryStocks(nextExportReceiptCodes);
  };

  onGetDeliveryStocks = exportReceiptCodes => {
    this.props.onGetDeliveryStocks(exportReceiptCodes, deliveryStocks => {
      this.setStockList([]);
      const stockList = this.getStockList();

      if (
        deliveryStocks.exportStockReceiptProductInfos &&
        deliveryStocks.exportStockReceiptProductInfos.length > 0
      ) {
        stockList.push(...deliveryStocks.exportStockReceiptProductInfos);
        this.setStockList(
          stockList || [],
          deliveryStocks.deliveryReceiptBasketInfos || [],
        );
      }
    });
  };

  render() {
    const { ui } = this.props;

    const initialData = this.getExportReceipts();

    const gridProps = {
      postSort: this.sortExportReceipts,
    };

    return (
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
            {({ disabled }) => (
              <Grid item xs={12}>
                <MuiButton disabled={disabled} onClick={this.onPopupOpen}>
                  Chọn PXK
                </MuiButton>
              </Grid>
            )}
          </WrapperBusiness>
          <Grid item xs={12} lg={6}>
            <FormData
              idGrid="bbgnhh-pxk"
              rowData={initialData}
              gridProps={gridProps}
              autoLayout
              columnDefs={this.columnDefs}
              defaultColDef={this.defaultColDef}
            />
          </Grid>
        </Grid>
        <Popup ui={ui} onSelectionSuccess={this.onSelectionSuccess} />
        <ConfirmationDialog
          ref={ref => {
            this.confirmationDialog = ref;
          }}
        />
      </Grid>
    );
  }
}

ForVinLog.propTypes = {
  ui: PropTypes.object,
  formik: PropTypes.object,
  onPopupOpen: PropTypes.func,
  onGetDeliveryStocks: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  onPopupOpen: () => {
    dispatch(openDialog());
    dispatch(exportReceiptsRoutine.trigger());
  },
  onGetDeliveryStocks: (exportReceiptCodes, callback) =>
    dispatch(deliveryStocksRoutine.request({ exportReceiptCodes, callback })),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(ForVinLog);
