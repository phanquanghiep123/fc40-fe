/* eslint-disable indent */
import { formatToCurrency } from '../../../../utils/numberUtils';
import CellRenderer from '../AssetsTable/CustomCellRenderer';
import CustomCellEditor from '../AssetsTable/CustomCellEditor';
import { isNumberString } from '../../../App/utils';
import { basketsInfoFields } from '../tableFields';

export const numberCurrency = params =>
  params.value && isNumberString(params.value)
    ? formatToCurrency(params.value)
    : params.value;

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

const makeDefaultCellStyle = params =>
  params.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {};

/**
 * Default column def for basketsInfo table
 * @returns {Object}
 */
export const makeBasketsInfoDefaultColDef = () => ({
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: CustomCellEditor,
  cellRendererFramework: undefined,
  cellStyle: makeDefaultCellStyle,
});

/**
 * Column defs for basketsInfo Table
 * @returns {Array}
 */
export const makeBasketsInfoColumnDefs = () => [
  {
    headerName: 'STT',
    field: basketsInfoFields.stt,
    cellRenderer: ({ rowIndex }) => rowIndex + 1,
    width: 40,
    suppressSizeToFit: true,
  },
  {
    headerName: 'Mã khay sọt',
    field: basketsInfoFields.palletBasketCode,
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Tên khay sọt',
    field: basketsInfoFields.palletBasketName,
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'SL huỷ (sử dụng)',
    field: basketsInfoFields.cancelQuantityInUse,
    cellRendererFramework: CellRenderer,
    cellStyle: alignRight,
    valueFormatter: numberCurrency,
    headerClass: 'ag-numeric-header',
  },
  {
    headerName: 'SL huỷ (sở hữu)',
    field: basketsInfoFields.cancelQuantityInStock,
    cellRendererFramework: CellRenderer,
    cellStyle: alignRight,
    valueFormatter: numberCurrency,
    headerClass: 'ag-numeric-header',
  },
  {
    headerName: 'Chênh lệch (Sử dụng - Sở hữu)',
    field: basketsInfoFields.inUseInStockDiff,
    cellRendererFramework: CellRenderer,
    valueFormatter: numberCurrency,
    cellStyle: params => {
      const { data } = params;
      if (data[basketsInfoFields.inUseInStockDiff] < 0) {
        return {
          color: 'red',
          fontWeight: 'bold',
          ...alignRight,
        };
      }
      if (data[basketsInfoFields.inUseInStockDiff] > 0) {
        return {
          color: 'blue',
          fontWeight: 'bold',
          ...alignRight,
        };
      }
      return alignRight;
    },
    headerClass: 'ag-numeric-header',
  },
  {
    headerName: 'Đơn vị tính',
    field: basketsInfoFields.uom,
    cellRendererFramework: CellRenderer,
  },
];
