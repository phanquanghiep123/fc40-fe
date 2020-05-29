// import React from 'react';
// import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer2';
// import HiddenCellData from 'components/FormikUI/HiddenCellData';
// import CellRenderer from 'components/FormikUI/CellRenderer';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiInputEditor from 'components/MuiInput/Editor';
import NumberFormatter from 'components/NumberFormatter';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import { validInteger } from 'components/NumberFormatter/utils';
import { isNumberString } from '../../../App/utils';
// import appTheme from '../../../App/theme';
import appTheme from '../../../App/theme';

// export const numberCurrency = params =>
//   params.value && isNumberString(params.value)
//     ? formatToCurrency(params.value)
//     : params.value;

export const numericParser = params => {
  if (params.newValue === '0' || params.newValue === 0) {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

// const makeEditableCellStyle = props => ({
//   background: props.node.rowPinned
//     ? 'inherit'
//     : appTheme.palette.background.default,
//   paddingLeft: '0.5rem',
//   paddingRight: '0.5rem',
//   ...(props.data.isDeleted
//     ? {
//         textDecoration: 'line-through',
//       }
//     : {}),
// });

// const makeDefaultCellStyle = props =>
//   props.data.isDeleted
//     ? {
//         textDecoration: 'line-through',
//       }
//     : {};

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

// export const makeDefaultColDef = () => ({
//   editable: false,
//   resizable: false,
//   suppressMovable: true,
//   // cellEditorFramework: CustomCellEditor,
//   // cellRendererFramework: undefined,
//   cellStyle: makeDefaultCellStyle,
// });

export const selectAssetsFields = {
  stt: 'stt',
  assetCode: 'assetCode',
  ownerName: 'ownerName',
  currentUnitPrice: 'currentUnitPrice',
  ownQuantity: 'ownQuantity',
  cancelQuantity: 'cancelQuantity',
  difference: 'difference',
};

export const makeColumnDefs = () => {
  const t = selectAssetsFields;

  return [
    {
      headerName: 'STT',
      field: t.stt,
      width: 40,
      suppressSizeToFit: true,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã tài sản',
      field: t.assetCode,
      // cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Đơn vị sở hữu',
      field: t.ownerName,
      // cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Giá trị còn lại của 1 đơn vị tài sản',
      field: t.currentUnitPrice,
      valueFormatter: numberCurrency,
      // cellRendererFramework: CellRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'SL sở hữu',
      field: t.ownQuantity,
      cellRendererFramework: CellRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'SL hủy',
      field: t.cancelQuantity,
      headerClass: 'ag-header-required ag-numeric-header',
      editable: ({ data }) => {
        if (data.totalCol) {
          return false;
        }
        return true;
      },
      cellStyle: {
        ...alignRight,
        background: appTheme.palette.background.default,
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CellRenderer,
      valueSetter: params => {
        const { data, node, newValue, context } = params;
        const cancelQuantity = isNumberString(newValue)
          ? parseFloat(newValue)
          : newValue;
        const updatedValues = {
          cancelQuantity,
          [t.difference]:
            isNumberString(cancelQuantity) || cancelQuantity === ''
              ? parseInt(data[t.ownQuantity], 10) -
                parseFloat(cancelQuantity || '0')
              : null,
        };

        // calculate difference - chênh lệch (sở hữu/huỷ)
        updateRowData(
          context.props.formik,
          'assetInfo',
          node.rowIndex,
          updatedValues,
        );

        return true;
      },
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validInteger,
          },
        },
      }),
    },
    {
      headerName: 'Chênh lệch (Sở hữu/Huỷ)',
      field: t.difference,
      // cellRendererFramework: CellRenderer,
      headerClass: 'ag-numeric-header',
      cellStyle: alignRight,
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
  ];
};

/**
 * Update row data
 * @param formik - popup formik
 * @param tableId
 * @param rowIndex
 * @param updatedValues
 */
function updateRowData(formik, tableId, rowIndex, updatedValues) {
  const updatedTable = [...formik.values[tableId]];
  updatedTable[rowIndex] = { ...updatedTable[rowIndex], ...updatedValues };
  formik.setFieldValue(tableId, updatedTable);
}
