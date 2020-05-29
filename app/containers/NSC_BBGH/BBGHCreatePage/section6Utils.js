import { formatTimes, splitTimes } from 'utils/datetimeUtils';

// reciver
export const initSchemaReciver = {
  gioXeDenThucTe: '',
  tgTraHangXong: '',
  tgNoXeLanhTraHang: '',
  palletLotSanXe: '',
  loaiXeTuyen: '',
  nhietDoThucTe: '',
  nhietDoMin: '',
  nhietDoMax: '',
  trangThaiNhietDo: '',
  nhietDoChip1: '',
  nhietDoChip2: '',
  trangThaiNhietDoChip: '',
  veSinhxe: '',
  vanChuyenTheoLeadtime: '',
  nguyenNhan: '',
  ghiChu: '',
};

export const caculateShipingTime = shipper => {
  const ship = Object.assign({}, shipper);
  const drivingDuration = splitTimes(parseFloat(shipper.drivingDuration || 0));
  const actualDepartureHour = splitTimes(shipper.actualDepartureHour || 0);
  const regulatedDepartureHour = splitTimes(
    shipper.regulatedDepartureHour || 0,
  );
  // giờ dự kiến đến
  const plannedArrivalHour = formatTimes(
    actualDepartureHour.hours + drivingDuration.hours,
    actualDepartureHour.minutes + drivingDuration.minutes,
  );
  ship.plannedArrivalHour = plannedArrivalHour.hour;
  ship.plannedArrivalDate = plannedArrivalHour.date;

  // gio den theo quy dinh
  const regulatedArrivalHour = formatTimes(
    regulatedDepartureHour.hours + drivingDuration.hours,
    regulatedDepartureHour.minutes + drivingDuration.minutes,
  );
  ship.regulatedArrivalHour = regulatedArrivalHour.hour;
  ship.regulatedArrivalDate = regulatedArrivalHour.date;

  return ship;
};
