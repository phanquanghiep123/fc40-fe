/* eslint-disable indent */
import CellRenderer from '../CustomCellRenderer';
import HiddenCellData from '../../../../../../../components/FormikUI/HiddenCellData';
import PinnedRowRenderer from '../../../../../../../components/FormikUI/PinnedRowRenderer2';
import PopupEditor from '../../../../../../../components/FormikUI/PopupEditor';
import { basketsTableFields } from '../constants';
import { formatToCurrency } from '../../../../../../../utils/numberUtils';
import ImageUploadCellRenderer from './ImageUploadCellRenderer';
import { getNested } from '../../../../../../App/utils';

export const numberCurrency = params =>
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

export const makeColumnDefs = (onOpenImagePopup, formik) => {
  const t = basketsTableFields;
  const isAutoReceipt = getNested(formik.values, 'isAutoReceipt');

  return [
    {
      headerName: 'STT',
      field: t.stt,
      cellRenderer: ({ rowIndex }) => rowIndex + 1,
      width: 40,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Kho nguồn',
      field: t.locatorName,
      cellRendererFramework: CellRenderer,
      width: 120,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Mã khay sọt',
      field: t.palletBasketCode,
      cellRendererFramework: CellRenderer,
      width: 120,
    },
    {
      headerName: 'Tên khay sọt',
      field: t.palletBasketName,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
    },
    {
      headerName: 'SL huỷ tối đa',
      field: t.maxCancelQuantity,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
      hide: !isAutoReceipt,
      width: 120,
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
      headerName: 'Chênh lệch',
      field: t.difference,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: params => {
        const isNegative = typeof params.value === 'number' && params.value < 0;
        const isPositive = typeof params.value === 'number' && params.value > 0;

        let style = {};
        if (isNegative) style = { color: 'red', fontWeight: 'bold' };
        if (isPositive) style = { color: 'blue', fontWeight: 'bold' };

        return { ...style, ...alignRight };
      },
      headerClass: 'ag-numeric-header',
      hide: !isAutoReceipt,
      width: 120,
    },
    {
      headerName: 'Đơn vị tính',
      field: t.uom,
      cellRendererFramework: CellRenderer,
      width: 120,
    },
    {
      headerName: 'Nguyên nhân hủy',
      field: t.causeName,
      suppressSizeToFit: true,
      width: 120,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Tình trạng trước khi hủy',
      field: t.priorStatus,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Hình ảnh',
      field: t.images,
      cellRendererFramework: ImageUploadCellRenderer,
      cellRendererParams: () => ({
        onOpenImagePopup, // function to open big image popup
      }),
    },
    {
      headerName: 'Ghi chú',
      field: t.note,
      cellRendererFramework: CellRenderer,
    },
  ];
};
