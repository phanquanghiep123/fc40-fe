/* eslint-disable indent */
// import React from 'react';
import appTheme from '../../../App/theme';
import CustomCellEditor from '../AssetsTable/CustomCellEditor';
import CellRenderer from '../AssetsTable/CustomCellRenderer';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { SELECT_BASKET_TABLE } from '../constants';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer2';
import HiddenCellData from '../../../../components/FormikUI/HiddenCellData';
import { getNested, isNumberString } from '../../../App/utils';

export const numberCurrency = params =>
  params.value && isNumberString(params.value)
    ? formatToCurrency(params.value)
    : params.value;

// positive float number regex
// const positiveNumberRgx = /^\d+(\.\d+)?$/;

const makeEditableCellStyle = props => ({
  background: props.node.rowPinned
    ? 'inherit'
    : appTheme.palette.background.default,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  ...(props.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {}),
});

const makeDefaultCellStyle = props =>
  props.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {};

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

export const makeDefaultColDef = () => ({
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: CustomCellEditor,
  cellRendererFramework: undefined,
  cellStyle: makeDefaultCellStyle,
  pinnedRowCellRendererFramework: HiddenCellData,
});

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
      cellRenderer: ({ rowIndex }) => rowIndex + 1,
      width: 40,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Mã tài sản',
      field: t.assetCode,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Đơn vị sở hữu',
      field: t.ownerName,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Giá trị còn lại của 1 đơn vị tài sản',
      field: t.currentUnitPrice,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
    },
    {
      headerName: 'SL sở hữu',
      field: t.ownQuantity,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
    },

    {
      headerName: 'SL hủy',
      field: t.cancelQuantity,
      editable: true,
      cellStyle: params => ({
        ...makeEditableCellStyle(params),
        ...alignRight,
      }),
      headerClass: 'ag-numeric-header',
      cellRendererFramework: CellRenderer,
      // eslint-disable-next-line react/prop-types
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: params => {
        const { context } = params;
        const expectedCancelQuantity = getNested(
          context,
          'formik',
          'values',
          'cancelQuantity',
        );
        if (expectedCancelQuantity && expectedCancelQuantity < params.value) {
          return {
            style: {
              color: 'red',
            },
          };
        }
        return {};
      },
      valueFormatter: numberCurrency,
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
          context.formik,
          SELECT_BASKET_TABLE,
          node.rowIndex,
          updatedValues,
        );

        return true;
      },
    },
    {
      headerName: 'Chênh lệch (Sở hữu/Huỷ)',
      field: t.difference,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
      cellStyle: params => {
        const isNegative = typeof params.value === 'number' && params.value < 0;
        // const isPositive = typeof params.value === 'number' && params.value > 0;
        let style = {};
        if (isNegative) style = { color: 'red', fontWeight: 'bold' };
        // if (isPositive) style = { color: 'blue', fontWeight: 'bold' };

        return { ...style, ...alignRight };
      },
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
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
