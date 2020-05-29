import { DELIVERY_ORDER_PLANT_TO_PLANT } from 'containers/App/constants';
import { groupBy, sumBy } from 'lodash';
import { fromJS } from 'immutable';
import { TYPE_PXK } from './constants';
import {
  initSchemaDestroy,
  initSchemaInternal,
  initSchemaPlant,
  initSchemaSell,
  validationDestroy,
  validationInternal,
  validationPlant,
  validationSell,
} from './Schema';
import {
  initSchemaExportedRetail,
  validationExportedRetail,
} from '../PXK_ExportedRetail/schema';
// nhấn nút hoàn thành
export const getPathCompletePXK = action => {
  // phiếu xuất chuyển nội bộ
  let path = '/exportedstockreceipts/complete-internal-transfer';
  switch (action.values.subType) {
    case TYPE_PXK.PXK_XDC_FARM:
      path = '/exportedstockreceipts/complete-transfer';
      break;
    case TYPE_PXK.PXK_XUAT_HUY:
      path = '/exportedstockreceipts/complete-exported-cancellation'; // path phiếu xuất hủy
      break;
    case TYPE_PXK.PXK_XUAT_BAN:
      path = '/exportedstockreceipts/complete-exported-sell'; // path phiếu xuất bán
      break;
    case TYPE_PXK.PXK_XUAT_BAN_XA:
      path = '/exportedstockreceipts/complete-exported-retail'; // path phiếu xuất bán xá
      break;
    default:
      break;
  }

  return path;
};

/**
 * @param {*} action object
 * @param {*} idBBGH number: id of BBGH is created auto
 * @param {*} currentPath : pathname of complete button
 *
 * url redirect when compelte success
 */
export const getPathRedirectCompletePXk = (action, id) => {
  let path = '/danh-sach-phieu-xuat-kho';
  switch (action.values.subType) {
    case TYPE_PXK.PXK_XUAT_BAN: {
      if (id > 0) {
        path = `/danh-sach-phieu-xuat-kho-khay-sot/chinh-sua-phieu-xuat-kho-khay-sot?form=2&id=${id}`;
      } else {
        path = '/danh-sach-phieu-xuat-kho';
      }
      break;
    }
    case TYPE_PXK.PXK_XUAT_BAN_XA: {
      if (id > 0) {
        path = `/danh-sach-phieu-xuat-kho-khay-sot/chinh-sua-phieu-xuat-kho-khay-sot?form=2&id=${id}`;
      } else {
        path = '/danh-sach-phieu-xuat-kho';
      }
      break;
    }
    case TYPE_PXK.PXK_XDC_FARM:
      path = `/danh-sach-bien-ban-giao-hang/chinh-sua-bien-ban-giao-hang/${id}`; // Thay đổi BBGH
      break;
    default:
      break;
  }

  return path;
};

export const getUrlPXKDetails = action => {
  let url = `/ExportedStockReceipts/${
    action.params.id
  }/details-internal-transfer`;

  switch (action.params.type) {
    case `${TYPE_PXK.PXK_XDC_FARM}`:
      url = `/exportedstockreceipts/${
        action.params.id
      }/details-transfer?isWeight=false`;
      break;
    case `${TYPE_PXK.PXK_XUAT_HUY}`:
      url = `/exportedstockreceipts/request-cancellation-detail?documentId=${
        action.params.id
      }`;
      break;
    case `${TYPE_PXK.PXK_XUAT_BAN}`:
      url = `/exportedstockreceipts/export-sell/${action.params.id}`;
      break;
    case `${TYPE_PXK.PXK_XUAT_BAN_XA}`:
      url = `/exportedstockreceipts/${action.params.id}/details-retail`;
      break;
    default:
      break;
  }

  return url;
};

export const getUrlReceiver = action => {
  let url = `/plants/auto-complete?name=&type=${DELIVERY_ORDER_PLANT_TO_PLANT}`;
  switch (action.subType) {
    case TYPE_PXK.PXK_XUAT_HUY:
      url = `/plants/auto-complete?name=&type=${DELIVERY_ORDER_PLANT_TO_PLANT}`;
      break;
    default:
      break;
  }
  return url;
};

export const getPathSavePXKTable = action => {
  // phiếu xuất chuyển nội bộ
  let path = '/exportedstockreceipts/update-internal-transfer';
  switch (action.values.subType) {
    case TYPE_PXK.PXK_XDC_FARM:
      path = '/exportedstockreceipts/update-transfer'; // xuất điều chuyển farm
      break;
    case TYPE_PXK.PXK_XUAT_HUY:
      path = '/exportedstockreceipts/create-exported-cancellation'; // path phiếu xuất hủy
      break;
    case TYPE_PXK.PXK_XUAT_BAN:
      path = '/exportedstockreceipts/create-update-exported-sell'; // path phiếu xuất bán
      break;
    case TYPE_PXK.PXK_XUAT_BAN_XA:
      path = '/exportedstockreceipts/update-exported-retail'; // path phiếu xuất bán xá
      break;
    default:
      break;
  }

  return path;
};

export const getUrlCreatePXK = action => {
  let url = null;
  switch (action.values.subType) {
    case TYPE_PXK.PXK_XDC_FARM:
      url = '/exportedstockreceipts/create-transfer';
      break;
    case TYPE_PXK.PXK_XUAT_HUY:
      url = '/exportedstockreceipts/create-exported-cancellation'; // khi lưu phiếu xuất hủy lần đầu
      break;
    case TYPE_PXK.PXK_XUAT_BAN:
      url = '/exportedstockreceipts/create-update-exported-sell';
      break;
    case TYPE_PXK.PXK_XUAT_BAN_XA:
      url = '/exportedstockreceipts/create-exported-retail';
      break;
    default:
      url = '/exportedstockreceipts/create-internal-transfer';
      break;
  }

  return url;
};

export const setDefaultSellTypeAndChannel = (group, isDelivery, formik) => {
  if (isDelivery) {
    // set giá trị mặc định
    if (['Y100', 'Y299'].includes(group)) {
      formik.setFieldValue('orderTypeCode', 'ZVG'); // ZVG: Nội bộ Tập đoàn
      formik.setFieldValue('channel', '10'); // B2B Nội Bộ TĐ
    } else if (['Y200', 'Y230'].includes(group)) {
      formik.setFieldValue('orderTypeCode', 'ZHR'); // ZHR: Bán Horeca
      formik.setFieldValue('channel', '20'); // B2B Nội Địa
    }
  }
};

const compareBasketCode = (a, b) => {
  if (a.basketCode < b.basketCode) {
    return -1;
  }
  if (a.basketCode > b.basketCode) {
    return 1;
  }
  return 0;
};

/* gộp thông tin khay sọt
* data: Array (không phân biệt deli hay người dùng nhập)
* return: Array
*/

export const mapBasketsTrays = data => {
  if (!(data instanceof Array && data.length > 0)) {
    return [];
  }
  const gr = groupBy(data, 'basketCode');
  const result = Object.keys(gr)
    .map((key, index) => ({
      stt: index + 1,
      basketName: gr[key][0].basketName,
      basketCode: gr[key][0].basketCode,
      quantity: sumBy(gr[key], 'quantity'),
      basketUoM: gr[key][0].basketUoM,
    }))
    .sort(compareBasketCode);
  return result;
};
/*
* type (number): thay đổi tới loại phiếu xuất kho nào
* onUpdateReducer (func): Hàm cập nhật lại reducer
* cloneValues: các giá trị cần giữ lại khi đổi schema
* */
export const onChangeSchemaUtils = (
  type,
  onUpdateReducer,
  cloneValues = {},
) => {
  switch (type) {
    case TYPE_PXK.PXK_NOI_BO: {
      onUpdateReducer({
        set: {
          initSchema: fromJS({ ...initSchemaInternal, ...cloneValues }),
          validationSchema: validationInternal,
        },
      });
      break;
    }
    case TYPE_PXK.PXK_XDC_FARM: {
      onUpdateReducer({
        set: {
          initSchema: fromJS({ ...initSchemaPlant, ...cloneValues }),
          validationSchema: validationPlant,
        },
      });
      break;
    }
    case TYPE_PXK.PXK_XUAT_HUY: {
      onUpdateReducer({
        set: {
          initSchema: fromJS({ ...initSchemaDestroy, ...cloneValues }),
          validationSchema: validationDestroy,
        },
      });
      break;
    }
    case TYPE_PXK.PXK_XUAT_BAN: {
      onUpdateReducer({
        set: {
          initSchema: fromJS({ ...initSchemaSell, ...cloneValues }),
          validationSchema: validationSell,
        },
      });
      break;
    }
    case TYPE_PXK.PXK_XUAT_BAN_XA: {
      onUpdateReducer({
        set: {
          initSchema: fromJS({
            ...initSchemaExportedRetail,
            ...cloneValues,
          }),
          validationSchema: validationExportedRetail,
        },
      });
      break;
    }
    default:
      break;
  }
};
