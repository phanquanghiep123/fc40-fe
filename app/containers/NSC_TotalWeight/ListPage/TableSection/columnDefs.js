import React from 'react';
import SelectCellRenderer, { targetFields } from './SelectCellRenderer';
import ButtonCellRenderer from './ButtonsCellRenderer';

export const makeColumnDefs = (
  tableData,
  tableOriginalData,
  onUpdateTableData,
  onWeighTableData,
  openDialogCompleteOne,
  openDialogDelete,
) => [
  {
    title: 'Tên Farm/NCC',
    field: 'originName',
    render: rowData => (rowData.parentId === null ? rowData.originName : ''),
  },
  {
    title: 'Mã BTP',
    field: 'semiFinishedProductCode',
    render: rowData =>
      rowData.parentId === null ? rowData.semiFinishedProductCode : '',
  },
  {
    title: 'Tên BTP',
    field: 'semiFinishedProductName',
    render: rowData =>
      rowData.parentId === null ? rowData.semiFinishedProductName : '',
  },
  {
    title: 'Batch BTP',
    field: 'semiFinishedProductSlotCode',
    render: rowData =>
      rowData.parentId === null ? rowData.semiFinishedProductSlotCode : '',
  },
  {
    title: 'Tổng Lượng Sản Phẩm Trước Sơ Chế',
    field: 'semiFinishedProductQuantity',
    render: rowData =>
      rowData.parentId === null ? rowData.semiFinishedProductQuantity : '',
  },
  {
    title: 'Sản phẩm',
    field: 'productCode',
    render: rowData => {
      const isMainRow = rowData.parentId === null;
      const typeOneCode = 10; // product type 1 code - fixed code

      return (
        <SelectCellRenderer
          tableData={tableData}
          tableOriginalData={tableOriginalData}
          rowData={rowData}
          options={
            // only show type 1 options on main row
            isMainRow && !rowData.productSelectDisabled
              ? rowData.products.filter(item => item.gradeCode === typeOneCode)
              : rowData.products
          }
          targetField={targetFields.productCode}
          onUpdateTableData={onUpdateTableData}
        />
      );
    },
  },
  {
    title: 'Tên TP',
    field: targetFields.productName,
  },
  {
    title: 'Batch TP',
    field: 'productBatchCode',
  },
  {
    title: 'Tổng Lượng Sản Phẩm Sau Sơ Chế',
    field: 'productQuantity',
  },
  {
    title: 'Đơn vị tính',
    field: 'baseUoM',
  },
  {
    title: 'Thao tác',
    field: 'action',
    render: rowData => (
      <ButtonCellRenderer
        rowData={rowData}
        tableData={tableData}
        tableOriginalData={tableOriginalData}
        onUpdateTableData={onUpdateTableData}
        onWeighTableData={onWeighTableData}
        openDialogCompleteOne={openDialogCompleteOne}
        openDialogDelete={openDialogDelete}
      />
    ),
  },
];
