import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { DELIVERY_ORDER_BUSSINES } from '../../App/constants';

const LinkToOthesPage = props => {
  const { formik } = props.context.props;
  return (
    <IconButton
      size="small"
      title="Sửa Tiếp Nhận"
      onClick={() =>
        props.history.push(
          `/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/${
            formik.values.id
          }/tiep-nhan-bien-ban-giao-hang/${props.data.deliveryOrderId}${
            formik.values.doType === DELIVERY_ORDER_BUSSINES
              ? `?shipperId=${props.data.id}`
              : ''
          }`,
        )
      }
      style={{ margin: 0, padding: 2, paddingTop: 0 }}
    >
      <Edit />
    </IconButton>
  );
};

LinkToOthesPage.propTypes = {
  history: PropTypes.object,
  data: PropTypes.object,
  context: PropTypes.object,
};
const Wrapper = withRouter(LinkToOthesPage);

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
  {
    headerName: '',
    field: 'actions',
    cellRendererFramework: Wrapper,
    width: 150,
  },
];
// column bên nhận màn xem Loại BBGH là KS.Cho mượn.Trả
export const columnDefsReciverLoanPay = [
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
    headerName: 'Loại Xe Tuyến',
    field: 'vehicleRouteTypeName',
  },
  {
    headerName: 'Nhiệt Độ Thực Tế',
    field: 'actualTemperature',
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Min)',
    field: 'minStandardTemperature',
  },
  {
    headerName: 'Nhiệt Độ Tiêu Chuẩn (Max)',
    field: 'maxStandardTemperature',
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
// column bên giao màn xem Loại BBGH là KS.Cho mượn.Trả
export const columnDefsDeliverLoanPay = [
  {
    headerName: 'STT',
    field: 'vehicleNumbering',
    width: 80,
  },
  {
    headerName: 'Bên Vận Chuyển',
    field: 'shipperName',
    tooltipField: 'shipperName',
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
