import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import FormData from 'components/FormikUI/FormData';
import MuiInputEditor from 'components/MuiInput/Editor';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import { getTotalStocks } from '../utils';
import { TYPE_FORM } from '../constants';

export default class ForVinLog extends React.Component {
  columnDefs = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      suppressSizeToFit: true,
      cellRendererFramework: orderNumberRenderer,
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
      headerName: 'Mã Farm/NCC',
      field: 'farmSupplierCode',
    },
    {
      headerName: 'Tên Farm/NCC',
      field: 'farmSupplierName',
      tooltipField: 'farmSupplierName',
    },
    {
      headerName: 'Mã Sản Phẩm',
      field: 'productCode',
      tooltipField: 'productCode',
    },
    {
      headerName: 'Mã VCM',
      field: 'vcmCode',
    },
    {
      headerName: 'Tên Sản Phẩm',
      field: 'productName',
      tooltipField: 'productName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Số Lượng Xuất',
      field: 'quantity',
      type: 'numericColumn',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị',
      field: 'uoM',
    },
    {
      headerName: 'Ghi Chú',
      field: 'notes',
      editable: this.props.formik.status !== TYPE_FORM.VIEW,
      tooltipField: 'notes',
      cellEditorFramework: MuiInputEditor,
    },
  ];

  defaultColDef = {
    editable: false,
    resizable: false,
    valueSetter: params => {
      this.props.formik.setFieldValue(
        `deliveryReceiptStocks[${params.node.childIndex}]${
          params.colDef.field
        }`,
        params.newValue,
        true,
      );
      return true;
    },
    suppressMovable: true,
  };

  gridOptions = { alignedGrids: [] };

  totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };

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

  sortStockList(rowNodes) {
    rowNodes.sort((rowNode, nextRowNode) => {
      if (rowNode.data && nextRowNode.data) {
        if (rowNode.data.customerName < nextRowNode.data.customerName) {
          return 1;
        }
        if (rowNode.data.customerName > nextRowNode.data.customerName) {
          return -1;
        }
        if (rowNode.data.productCode < nextRowNode.data.productCode) {
          return -1;
        }
        if (rowNode.data.productCode > nextRowNode.data.productCode) {
          return 1;
        }
      }
      return 0;
    });
  }

  render() {
    const initialData = this.getStockList();
    const pinned = [
      {
        totalCol: true,
        productName: 'Tổng',
        quantity: getTotalStocks(initialData),
      },
    ];
    const gridProps = {
      postSort: this.sortStockList,
    };

    return (
      <React.Fragment>
        <FormData
          name="deliveryReceiptStocks"
          idGrid="bbgnhh-goods-vinlog"
          rowData={initialData}
          gridProps={{
            ...gridProps,
            gridOptions: this.gridOptions,
            pinnedBottomRowData: initialData.length > 0 ? pinned : [],
            frameworkComponents: {
              customPinnedRowRenderer: PinnedRowRenderer,
            },
            getRowStyle,
          }}
          autoLayout
          columnDefs={this.columnDefs}
          defaultColDef={this.defaultColDef}
          setFieldValue={this.props.formik.setFieldValue}
          setFieldTouched={this.props.formik.setFieldTouched}
        />
      </React.Fragment>
    );
  }
}

ForVinLog.propTypes = {
  formik: PropTypes.object,
};
