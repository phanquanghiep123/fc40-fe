import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import MuiInputEditor from 'components/MuiInput/Editor';
const columnDefs = [
  {
    field: 'stt',
    headerName: 'STT',
    width: 50,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    field: 'locatorDeliverName',
    headerName: 'Kho nguồn',
  },
  {
    field: 'basketCode',
    headerName: 'Mã Khay Sọt',
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'note',
    headerName: 'SL Huỷ Tối Đa',
  },
  {
    field: 'note',
    headerName: 'SL Huỷ',
  },
  {
    field: 'note',
    headerName: 'Chênh Lệch',
  },
  {
    field: 'uoM',
    headerName: 'Đơn Vị Tính',
    width: 70,
  },
  {
    field: 'note',
    headerName: 'Hình Ảnh',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    tooltipField: 'note',
  },
];
const columnDefsView = [...columnDefs];
columnDefsView.pop();
export const destroyBasketConfig = {
  renderTotal: true,
  addRow: () => false,
  value: 21,
  titleSection2: () => `II. Thông Tin Tài Sản Sở Hữu Thanh Lý/Huỷ`,
  titleSection3: () => `III. Thông Tin Khay Sọt Sử Dụng Thanh Lý/Huỷ`,
  renderSection2: () => true,
  section2ColumnDefs: [
    {
      field: 'stt',
      headerName: 'STT',
      width: 70,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      field: 'basketName',
      headerName: 'Mã Tài Sản',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      field: 'basketName',
      headerName: 'Đơn Vị Sở Hữu',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      field: 'basketName',
      headerName: 'Tên Khay Sọt',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      field: 'uoM',
      headerName: 'Giá Trị Huỷ(Tạm Tính)',
    },
    {
      field: 'uoM',
      headerName: 'Giá Trị Huỷ',
    },
    {
      field: 'uoM',
      headerName: 'SL Huỷ',
    },
    {
      field: 'uoM',
      headerName: 'Đơn Vị Tính',
    },
    {
      field: 'note',
      headerName: 'Nguyên Nhân Huỷ',
    },
    {
      field: 'note',
      headerName: 'Tình Trạng Trước Khi Huỷ',
    },
    {
      field: 'note',
      headerName: 'Ghi Chú',
      cellEditorFramework: MuiInputEditor,
      editable: ({ context, data }) => {
        if (data.totalCol) {
          return false;
        }
        return !context.isView() && !isEmpty(data.locatorDeliver);
      },
    },
  ],
  // STT
  // Kho nguồn
  // Mã khay sọt (*)
  // Tên khay sọt
  // SL hủy tối đa
  // SL hủy
  // Chênh lệch
  // Đơn vị tính
  // Hình ảnh
  // Ghi chú
  columnDefs,
  validSchema: Yup.object(),
};
