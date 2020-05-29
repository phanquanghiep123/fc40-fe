import { getColumnDefs } from 'utils/transformUtils';
import { orderNumberRenderer } from 'utils/index';

export const columns = {
  stt: {
    headerName: 'STT',
    field: 'stt',
    width: 60,
    cellRenderer: orderNumberRenderer,
    suppressSizeToFit: true,
  },
  productCode: {
    headerName: 'Mã Sản Phẩm',
    field: 'productCode',
  },
  productName: {
    headerName: 'Tên Sản Phẩm',
    field: 'productName',
    tooltipField: 'productName',
  },
  slotCode: {
    headerName: 'Batch',
    field: 'slotCode',
  },
  locatorNameFrom: {
    headerName: 'Kho Nguồn',
    field: 'locatorNameFrom',
    tooltipField: 'locatorNameFrom',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  locatorNameTo: {
    headerName: 'Kho Đích',
    field: 'locatorNameTo',
    hide: true,
    tooltipField: 'locatorNameTo',
  },
  exportedQuantity: {
    headerName: 'Số Lượng Xuất',
    field: 'exportedQuantity',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  uom: {
    headerName: 'Đơn Vị',
    field: 'uom',
  },
  statusName: {
    headerName: 'Trạng Thái',
    field: 'statusName',
  },
};

export const columnDefs = getColumnDefs(columns);

export const defaultColDef = {
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellRendererFramework: undefined,
};
