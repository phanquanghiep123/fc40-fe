export const columnDefs = [
  {
    headerName: 'Vùng Sản Xuất',
    pinned: 'left',
    field: 'productionRegion',
    resizable: true,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 100,
  },
  {
    headerName: 'Mã Kế Hoạch',
    pinned: 'left',
    field: 'planningCode',
    resizable: true,
    width: 100,
  },
  {
    headerName: 'Nguồn',
    pinned: 'left',
    width: 50,
    field: 'productSource',
    resizable: true,
  },
  {
    headerName: 'Ngày Sản Xuất',
    pinned: 'left',
    field: 'productionDate',
    resizable: true,
    width: 100,
  },
  {
    headerName: 'Đơn Vị',
    field: 'plantName',
    resizable: true,
    width: 100,
  },
  {
    headerName: 'Farm/NCC',
    field: 'farmSupplierName',
    resizable: true,
    width: 100,
  },
  {
    headerName: 'Chủng Loại',
    field: 'productCat',
    resizable: true,
    width: 100,
  },
  { headerName: 'Mã Sản Phẩm', field: 'productCode', width: 100 },
  {
    headerName: 'Tên Sản Phẩm',
    field: 'productName',
    resizable: true,
    width: 200,
  },
  { headerName: 'Batch', field: 'batch', width: 100 },
  {
    headerName: 'Đơn Vị Tính',
    field: 'uom',
    width: 100,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Tồn Đầu Kỳ',
    children: [
      {
        headerName: 'BTP',
        field: 'tdkBTP',
        resizable: true,
        width: 100,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 1',
        field: 'tdkLoai1',
        resizable: true,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 2',
        field: 'tdkLoai2',
        resizable: true,
        width: 100,
        parentField: 'tonDauKy',
        headerClass: 'ag-border-left-right',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
    ],
  },
  {
    headerName: 'Nhập Mới Trong Ngày',
    children: [
      {
        headerName: 'BTP',
        field: 'nmtnBTP',
        resizable: true,
        cellClass: 'ag-border-left',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'BTP Không Tham Chiếu',
        field: 'nmtnBTPKTC',
        resizable: true,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 1',
        field: 'nmtnLoai1',
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        resizable: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'TP Loại 2',
        field: 'nmtnLoai2',
        resizable: true,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
    ],
  },
  {
    headerName: 'Kết Quả Sơ Chế',
    children: [
      {
        headerName: 'Xuất BTP Sơ Chế',
        field: 'kqscXuatBTP',
        resizable: true,
        width: 100,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 1',
        field: 'kqscLoai1',
        resizable: true,
        width: 100,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 2',
        field: 'kqscLoai2',
        resizable: true,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'Phế Phẩm',
        field: 'kqscPhePham',
        resizable: true,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'Tổng TP Loại 1',
        field: 'kqscTongLoai1',
        resizable: true,
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
    ],
  },
  {
    headerName: 'Kết Quả Xuất Hàng',
    children: [
      {
        headerName: 'BTP',
        field: 'kqxhBTP',
        resizable: true,
        width: 100,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 1',
        field: 'kqxhLoai1',
        resizable: true,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'TP Loại 2',
        field: 'kqxhLoai2',
        resizable: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
    ],
  },
  {
    headerName: 'Hàng Hủy',
    field: 'hangHuy',
    resizable: true,
    width: 100,
    children: [
      {
        headerName: 'BTP',
        field: 'hhBTP',
        resizable: true,
        width: 100,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'TP Loại 1',
        field: 'hhLoai1',
        resizable: true,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'TP Loại 2',
        field: 'hhLoai2',
        resizable: true,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
    ],
  },
  {
    headerName: 'Tồn Kho Cuối Kỳ',
    field: 'tonKho',
    resizable: true,
    width: 100,
    children: [
      {
        headerName: 'BTP',
        field: 'tkBTP',
        resizable: true,
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'TP Loại 1',
        field: 'tkLoai1',
        resizable: true,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
      {
        headerName: 'TP Loại 2',
        field: 'tkLoai2',
        resizable: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: {
          textAlign: 'right',
        },
        width: 100,
      },
    ],
  },
  {
    headerName: 'Tỉ Lệ Thu Hồi',
    children: [
      {
        headerName: 'Định Mức',
        field: 'tlthDinhMuc',
        resizable: true,
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        width: 100,
        cellStyle: {
          textAlign: 'right',
        },
      },
      {
        headerName: 'Thực Tế',
        field: 'tlthThucTe',
        resizable: true,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        width: 100,
        cellStyle: {
          textAlign: 'right',
        },
      },
    ],
  },
];
