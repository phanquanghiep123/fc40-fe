// section 6
export const columnDefsDeliver = [
  {
    headerName: 'STT',
    field: 'vehicleNumbering',
    editable: true,
    width: 80,
  },
  {
    headerName: 'Bên Vận Chuyển',
    field: 'shipperName',
    editable: true,
    tooltipField: 'shipperName',
  },
  {
    headerName: 'Lái Xe',
    field: 'driver',
    editable: true,
    headerClass: 'ag-header-required',
    tooltipField: 'driver',
  },
  {
    headerName: 'Điện Thoại',
    field: 'phone',
    editable: true,
  },
  {
    headerName: 'Biển Số Xe',
    field: 'drivingPlate',
    editable: true,
  },
  {
    headerName: 'Tải Trọng Xe (Tấn)',
    field: 'vehicleWeight',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Leadtime Không Theo Quy Định',
    field: 'unregulatedLeadtime',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Quy Định',
    field: 'regulatedDepartureHour',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Thực Tế',
    field: 'actualDepartureHour',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Thời Gian Di Chuyển (Giờ)',
    field: 'drivingDuration',
    editable: true,
  },
  {
    headerName: 'Giờ Đến Theo Quy Định',
    field: 'regulatedArrivalHour',
  },
  {
    headerName: 'Giờ Dự Kiến Đến',
    field: 'plannedArrivalHour',
  },
  {
    headerName: 'Loại Xe Tuyến',
    field: 'vehicleRouteTypeName',
    editable: true,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Min)',
    field: 'minStandardTemperature',
    editable: true,
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Max)',
    field: 'maxStandardTemperature',
    editable: true,
  },
];

// section 6
export const columnDefsDeliverNotEdit = [
  {
    headerName: 'STT',
    field: 'vehicleNumbering',
    width: 80,
  },
  {
    headerName: 'Bên Vận Chuyển',
    field: 'shipperName',
    tooltipField: 'shipperName',
    editable: false,
  },
  {
    headerName: 'Lái Xe',
    field: 'driver',
    headerClass: 'ag-header-required',
    tooltipField: 'driver',
  },
  {
    headerName: 'Điện Thoại',
    field: 'phone',
  },
  {
    headerName: 'Biển Số Xe',
    field: 'drivingPlate',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Tải Trọng Xe (Tấn)',
    field: 'vehicleWeight',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Leadtime Không Theo Quy Định',
    field: 'unregulatedLeadtime',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Quy Định',
    field: 'regulatedDepartureHour',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Thực Tế',
    field: 'actualDepartureHour',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Thời Gian Di Chuyển (Giờ)',
    field: 'drivingDuration',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Đến Theo Quy Định',
    field: 'regulatedArrivalHour',
  },
  {
    headerName: 'Giờ Dự Kiến Đến',
    field: 'plannedArrivalHour',
  },
  {
    headerName: 'Loại Xe Tuyến',
    field: 'vehicleRouteTypeName',
    width: 250,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Min)',
    field: 'minStandardTemperature',
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Max)',
    field: 'maxStandardTemperature',
  },
];

// column bên giao màn chỉnh sửa Loại BBGH là KS.Cho mượn.Trả
export const columnDefsDeliverLoanPay = [
  {
    headerName: 'STT',
    field: 'vehicleNumbering',
    editable: true,
    width: 80,
  },
  {
    headerName: 'Bên Vận Chuyển',
    field: 'shipperName',
    editable: true,
    tooltipField: 'shipperName',
  },
  {
    headerName: 'Lái Xe',
    field: 'driver',
    editable: true,
    headerClass: 'ag-header-required',
    tooltipField: 'driver',
  },
  {
    headerName: 'Điện Thoại',
    field: 'phone',
    editable: true,
  },
  {
    headerName: 'Biển Số Xe',
    field: 'drivingPlate',
    editable: true,
  },
  {
    headerName: 'Tải Trọng Xe (Tấn)',
    field: 'vehicleWeight',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Leadtime Không Theo Quy Định',
    field: 'unregulatedLeadtime',
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Quy Định',
    field: 'regulatedDepartureHour',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Giờ Xuất Phát Thực Tế',
    field: 'actualDepartureHour',
    editable: true,
    headerClass: 'ag-header-required',
  },
  {
    headerName: 'Thời Gian Di Chuyển (Giờ)',
    field: 'drivingDuration',
    editable: true,
  },
  {
    headerName: 'Giờ Đến Theo Quy Định',
    field: 'regulatedArrivalHour',
  },
  {
    headerName: 'Giờ Dự Kiến Đến',
    field: 'plannedArrivalHour',
  },
];

// section 6
export const columnDefsReciver = [
  {
    headerName: 'Giờ Xe Đến Thực Tế',
    field: 'actualArrivalHour',
  },
  {
    headerName: 'TG Trả Hàng Xong',
    field: 'deliveryTime',
  },
  {
    headerName: 'TG Nổ Xe Lạnh Trả Hàng',
    field: 'coolingVehicleTime',
  },
  {
    headerName: 'Pallet Lót Sàn Xe',
    field: 'vehiclePalletName',
  },
  {
    headerName: 'Nhiệt Độ Thực Tế',
    field: 'actualTemperature',
  },
  {
    headerName: 'Trạng Thái Nhiệt Độ',
    field: 'temperatureStatusName',
  },
  {
    headerName: 'Nhiệt Độ Chip 1',
    field: 'chipTemperature1',
  },
  {
    headerName: 'Nhiệt Độ Chip 2',
    field: 'chipTemperature2',
  },
  {
    headerName: 'Trạng Thái Nhiệt Độ Chip',
    field: 'chipTemperatureStatusName',
  },
  {
    headerName: 'Vệ Sinh Xe',
    field: 'vehicleCleaningName',
  },
  {
    headerName: 'Vận Chuyển Theo Leadtime',
    field: 'shippingLeadtimeName',
  },
  {
    headerName: 'Nguyên Nhân',
    field: 'reasonName',
    width: 200,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
  },
  {
    headerName: 'Ghi Chú',
    field: 'notes',
    cellClass: 'cell-wrap-text',
    autoHeight: true,
    width: 200,
  },
];

// column bên nhận màn chỉnh sửa Loại BBGH là KS.Cho mượn.Trả
export const columnDefsReciverLoanPay = [
  {
    headerName: 'Giờ Xe Đến Thực Tế',
    field: 'actualArrivalHour',
    editable: true,
  },
  {
    headerName: 'TG Trả Hàng Xong',
    field: 'deliveryTime',
    editable: true,
  },
  {
    headerName: 'TG Nổ Xe Lạnh Trả Hàng',
    field: 'coolingVehicleTime',
    editable: true,
  },
  {
    headerName: 'Pallet Lót Sàn Xe',
    field: 'vehiclePalletName',
    editable: true,
  },
  {
    headerName: 'Loại Xe Tuyến',
    field: 'vehicleRouteTypeName',
    editable: true,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
  },
  {
    headerName: 'Nhiệt Độ Thực Tế',
    field: 'actualTemperature',
    editable: params => {
      // Loại xe tuyến: 1 là xe bạt, 5 là xe thùng
      if (
        params.data.vehicleRouteType === 1 ||
        params.data.vehicleRouteType === 5
      ) {
        return false;
      }
      return true;
    },
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Min)',
    field: 'minStandardTemperature',
    // Loại xe tuyến: 4 là loại khác
    editable: params => params.data.vehicleRouteType === 4,
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Max)',
    field: 'maxStandardTemperature',
    // Loại xe tuyến: 4 là loại khác
    editable: params => params.data.vehicleRouteType === 4,
  },
  {
    headerName: 'Trạng Thái Nhiệt Độ',
    field: 'temperatureStatusName',
    editable: true,
  },
  {
    headerName: 'Nhiệt Độ Chip 1',
    field: 'chipTemperature1',
    editable: true,
  },
  {
    headerName: 'Nhiệt Độ Chip 2',
    field: 'chipTemperature2',
    editable: true,
  },
  {
    headerName: 'Trạng Thái Nhiệt Độ Chip',
    field: 'chipTemperatureStatusName',
    editable: true,
  },
  {
    headerName: 'Vệ Sinh Xe',
    field: 'vehicleCleaningName',
    editable: true,
  },
  {
    headerName: 'Vận Chuyển Theo Leadtime',
    field: 'shippingLeadtimeName',
    editable: true,
  },
  {
    headerName: 'Nguyên Nhân',
    field: 'reasonName',
    editable: true,
    cellClass: 'cell-wrap-text',
    autoHeight: true,
  },
  {
    headerName: 'Ghi Chú',
    field: 'notes',
    cellClass: 'cell-wrap-text',
    autoHeight: true,
    width: 200,
    editable: true,
  },
];
