import React from 'react';
import { Field } from 'formik';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';

export const makeColumnDefs = (formik, onFetchSoldToVinmartAutocomplete) => [
  {
    title: 'STT',
    render: rowData =>
      rowData.tableData.id === 0 ? null : rowData.tableData.id,
    cellStyle: { width: 40 },
  },
  {
    title: 'Mã kế hoạch',
    field: 'planningCode',
  },
  {
    title: 'Tên kế hoạch',
    field: 'planningName',
    cellStyle: { width: 100 },
  },
  {
    title: 'Mã Farm/NCC',
    field: 'vendorCode',
  },
  {
    title: 'Tên Farm/NCC',
    field: 'vendorName',
  },
  {
    title: 'Đơn vị tính',
    field: 'uom',
    cellStyle: { width: 50 },
  },
  {
    title: 'SL chia dự kiến',
    field: 'quantityExpect',
    cellStyle: { width: 60 },
  },
  {
    title: 'Mã sản phẩm',
    field: 'productCode',
    headerStyle: { borderLeft: '1px solid #ddd' },
    cellStyle: { borderLeft: '1px solid #ddd' },
  },
  {
    title: 'Tên sản phẩm',
    field: 'productName',
  },
  {
    title: 'Batch',
    field: 'batch',
  },
  {
    title: 'SL chia',
    field: 'quantityAllocation',
  },
  {
    title: 'Tỉ lệ VM',
    field: 'ratioVinMartString',
    headerStyle: { borderLeft: '1px solid #ddd' },
    cellStyle: { borderLeft: '1px solid #ddd' },
  },
  {
    title: 'Tỉ lệ VM+',
    field: 'ratioVinMartPlusString',
  },
  {
    title: 'SL xuất cho VM',
    field: 'quantityExportVinMart',
    cellStyle: { width: 110 },
    render: rowData => {
      if (rowData.tableData.id === 0) {
        return (
          <Field
            name="soldToVinmart"
            value={formik.values.soldToVinmart}
            onChange={formik.handleChange}
            component={SelectAutocomplete}
            placeholder="Chọn..."
            maxMenuHeight={250}
            isAsync
            loadOptionsFunc={onFetchSoldToVinmartAutocomplete}
            maxResults={100}
          />
        );
      }
      return rowData.quantityExportVinMart;
    },
  },
  {
    title: 'SL xuất cho VM+',
    field: 'quantityExportVinMartPlus',
    cellStyle: { width: 110 },
    render: rowData => {
      if (rowData.tableData.id === 0) {
        return (
          <Field
            name="soldToVinmartPlus"
            value={formik.values.soldToVinmartPlus}
            onChange={formik.handleChange}
            component={SelectAutocomplete}
            placeholder="Chọn..."
            maxMenuHeight={250}
            isAsync
            loadOptionsFunc={onFetchSoldToVinmartAutocomplete}
            maxResults={100}
          />
        );
      }
      return rowData.quantityExportVinMartPlus;
    },
  },
];
