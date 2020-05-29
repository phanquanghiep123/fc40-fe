import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import FormData from 'components/FormikUI/FormData';
import MuiInputEditor from 'components/MuiInput/Editor';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import { getTotalStocks } from '../utils';
import { TYPE_FORM } from '../constants';

export default class ForOther extends React.Component {
  columnDefs = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      suppressSizeToFit: true,
      cellRendererFramework: orderNumberRenderer,
    },
    {
      headerName: 'Mã Sản Phẩm',
      field: 'productCode',
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
    // {
    //   headerName: 'Thông Tin Khay Sọt',
    //   children: [
    //     {
    //       headerName: 'Tên',
    //       field: 'basketName1',
    //       tooltipField: 'basketName1',
    //       headerClass: 'ag-border-left',
    //     },
    //     {
    //       headerName: 'SL',
    //       field: 'deliverQuantity1',
    //       type: 'numericColumn',
    //     },
    //     {
    //       headerName: 'Tên',
    //       field: 'basketName2',
    //       tooltipField: 'basketName2',
    //     },
    //     {
    //       headerName: 'SL',
    //       field: 'deliverQuantity2',
    //       type: 'numericColumn',
    //     },
    //     {
    //       headerName: 'Tên',
    //       field: 'basketName3',
    //       tooltipField: 'basketName3',
    //     },
    //     {
    //       headerName: 'SL',
    //       field: 'deliverQuantity3',
    //       headerClass: 'ag-border-right',
    //       type: 'numericColumn',
    //     },
    //   ],
    // },
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
          idGrid="bbgnhh-goods-other"
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

ForOther.propTypes = {
  formik: PropTypes.object,
};
