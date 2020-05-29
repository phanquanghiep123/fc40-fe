/* eslint-disable indent */
import CellRenderer from '../CustomCellRenderer';
import { formatToCurrency } from '../../../../../../../utils/numberUtils';
import PopupEditor from '../../../../../../../components/FormikUI/PopupEditor';
import HiddenCellData from '../../../../../../../components/FormikUI/HiddenCellData';
import appTheme from '../../../../../../App/theme';
import { assetsTableFields } from '../constants';
import PinnedRowRenderer from '../../../../../../../components/FormikUI/PinnedRowRenderer2';

const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

const alignRight = { textAlign: 'right', paddingRight: 5 };

const makeDefaultCellStyle = params =>
  params.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {};

export const makeDefaultColDef = () => ({
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: PopupEditor,
  cellRendererFramework: undefined,
  cellStyle: makeDefaultCellStyle,
  pinnedRowCellRendererFramework: HiddenCellData,
});

export const makeColumnDefs = () => {
  const t = assetsTableFields;

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
      suppressSizeToFit: true,
      width: 120,
    },
    {
      headerName: 'Đơn vị sở hữu',
      field: t.ownerName,
      cellRendererFramework: CellRenderer,
      width: 150,
    },
    {
      headerName: 'Tên khay sọt',
      field: t.palletBasketName,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      width: 230,
    },
    {
      headerName: 'Giá trị huỷ (tạm tính)',
      field: t.tempCancelValue,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      width: 230,
    },
    {
      headerName: 'Giá trị huỷ',
      field: t.cancelValue,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: params => {
        if (
          parseFloat(params.value).toFixed(3) !==
          parseFloat(params.node.data[t.tempCancelValue]).toFixed(3)
        ) {
          return { color: 'red', fontWeight: 'bold', ...alignRight };
        }

        return alignRight;
      },
      headerClass: 'ag-numeric-header',
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
      width: 230,
    },
    {
      headerName: 'SL hủy',
      field: t.cancelQuantity,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      width: 120,
    },
    {
      headerName: 'Đơn vị tính',
      field: t.uom,
      cellRendererFramework: CellRenderer,
      width: 100,
    },
    {
      headerName: 'Ghi chú',
      field: t.note,
      cellRendererFramework: CellRenderer,
    },
  ];
};
