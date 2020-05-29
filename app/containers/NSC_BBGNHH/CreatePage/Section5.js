import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { orderNumberRenderer } from 'utils/index';
import { getTotalBaskets, transformBasket } from './utils';

export default class Section5 extends React.Component {
  customerCode = null;

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
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      tooltipField: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Số Lượng Giao',
      field: 'totalQuantity',
      type: 'numericColumn',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uom',
    },
  ];

  columnDefs2 = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      suppressSizeToFit: true,
      cellRendererFramework: orderNumberRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã Đơn Vị Mượn KS',
      field: 'customerCode',
    },
    {
      headerName: 'Tên Đơn Vị Mượn KS',
      field: 'customerName',
      tooltipField: 'customerName',
    },
    {
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      tooltipField: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Số Lượng Giao',
      field: 'totalQuantity',
      type: 'numericColumn',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uom',
    },
  ];

  defaultColDef = {
    editable: false,
    resizable: false,
    suppressMovable: true,
  };

  gridOptions = { alignedGrids: [] };

  totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };

  componentDidMount() {
    this.gridOptions.alignedGrids.push(this.totalOptions);
    this.totalOptions.alignedGrids.push(this.gridOptions);
  }

  sortDeliveryBaskets(rowNodes) {
    rowNodes.sort((rowNode, nextRowNode) => {
      if (rowNode.data && nextRowNode.data) {
        if (rowNode.data.customerCode < nextRowNode.data.customerCode) {
          return 1;
        }
        if (rowNode.data.customerCode > nextRowNode.data.customerCode) {
          return -1;
        }
        if (rowNode.data.basketCode < nextRowNode.data.basketCode) {
          return -1;
        }
        if (rowNode.data.basketCode > nextRowNode.data.basketCode) {
          return 1;
        }
      }
      return 0;
    });
  }

  render() {
    const { formik } = this.props;
    const stocksData = getIn(formik.values, 'deliveryReceiptStocks', []);
    const stocksDataBasket = getIn(formik.values, 'deliveryReceiptBaskets', []);
    const initialData = transformBasket(
      stocksData,
      formik.values.deliveryReceiptType,
      stocksDataBasket,
    );

    const totalQuantity = getTotalBaskets(initialData);

    const gridProps = {
      postSort: this.sortDeliveryBaskets,
    };

    return (
      <Expansion
        title="V. Thông Tin Khay Sọt"
        content={
          <React.Fragment>
            <FormData
              idGrid="bbgnhh-baskets"
              rowData={initialData}
              gridProps={{
                ...gridProps,
                gridOptions: this.gridOptions,
                pinnedBottomRowData:
                  initialData.length > 0
                    ? [{ basketName: 'Tổng', totalQuantity }]
                    : [],
                frameworkComponents: {
                  customPinnedRowRenderer: PinnedRowRenderer,
                },
              }}
              autoLayout
              columnDefs={
                this.props.formik.values.deliveryReceiptType === 1
                  ? this.columnDefs
                  : this.columnDefs2
              }
              defaultColDef={this.defaultColDef}
            />
          </React.Fragment>
        }
      />
    );
  }
}

Section5.propTypes = {
  formik: PropTypes.object,
};
