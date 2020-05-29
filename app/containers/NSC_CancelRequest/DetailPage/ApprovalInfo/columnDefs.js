import PopupEditor from '../../../../components/FormikUI/PopupEditor';
import CellRenderer from '../AssetsTable/CustomCellRenderer';
// import { getColumnDefs } from '../../../../utils/transformUtils';

export const defaultColDef = {
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: PopupEditor,
  cellRendererFramework: undefined,
};

export const makeColumnDefs = () => [
  {
    headerName: 'STT',
    field: 'stt',
    cellRenderer: ({ rowIndex }) => rowIndex + 1,
    width: 40,
    suppressSizeToFit: true,
  },

  {
    headerName: 'Người phê duyệt',
    field: 'approverName',
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Ý kiến',
    field: 'approverOpinions',
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Ghi chú',
    field: 'approverNote',
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Thời gian phê duyệt',
    field: 'approvalDate',
    cellRendererFramework: CellRenderer,
  },
];
