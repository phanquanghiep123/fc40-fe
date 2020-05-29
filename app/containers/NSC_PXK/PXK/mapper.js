import { formatToCurrency } from 'utils/numberUtils';
import { responseCode } from 'utils/request';
import { clone, findIndex } from 'lodash';
import {
  initSchema,
  initSchemaInternal,
  initSchemaSell,
  initSchemaDestroy,
  initSchemaPlant,
  validationPlant,
  validationDestroy,
  validationSell,
  validationInternal,
} from './Schema';
import { mapBasketsTrays } from './utils';
import { TYPE_PXK } from './constants';
/**
 * @description
 *
 * mapping between object get from api and object in reactjs app
 */
const checkResponse = ({ ...res }) => {
  for (let i = 0, len = res.length; i < len; i += 1) {
    if (res[i].statusCode !== responseCode.ok) {
      throw Object({ message: res[i].message });
    }
  }
};
//  phiếu xuất điều chuyển plant to plant
const receiverUnits = res =>
  res.map(unit => ({
    name: unit.label,
    id: unit.value,
    value: unit.value,
    label: unit.label,
  }));

// Đơn vị xuất hàng phiếu xuất điều chuyển plant to plant
const units = res =>
  res.map(unit => ({
    name: unit.name,
    id: unit.value,
    value: unit.value,
    label: unit.name,
  }));

const transporters = res =>
  res.map(unit => ({
    name: unit.fullName,
    id: unit.transporterCode,
  }));

const channels = res =>
  res.map(unit => ({
    name: unit.description,
    id: unit.distributionChannelCode,
  }));

/**
 * @mapping
 * @create phiếu xuất kho
 */
const initCreate = (res, subType, data) => {
  checkResponse(res);

  const resTypes = res[0].data;
  // test phiếu xuất huủy
  const resUnits = res[1].data.map(unit => ({
    name: unit.name,
    id: unit.value,
    value: unit.value,
    label: unit.name,
  }));
  // danh sách đơn vị nhận hàng
  const resReceiverUnits =
    res[2].map(unit => ({
      name: unit.label,
      id: unit.value,
      value: unit.value,
      label: unit.label,
    })) || [];

  let schema = initSchema;
  let validation = validationInternal;
  const type = subType || resTypes[0].id;
  switch (type) {
    case TYPE_PXK.PXK_NOI_BO: {
      schema = initSchemaInternal;
      validation = validationInternal;
      break;
    }
    case TYPE_PXK.PXK_XDC_FARM: {
      schema = initSchemaPlant;
      validation = validationPlant;
      break;
    }
    case TYPE_PXK.PXK_XUAT_HUY: {
      schema = initSchemaDestroy;
      validation = validationDestroy;
      break;
    }
    case TYPE_PXK.PXK_XUAT_BAN: {
      schema = initSchemaSell;
      validation = validationSell;
      break;
    }
    default: {
      schema = initSchema;
      validation = validationInternal;
    }
  }
  const initDeliverIndex = findIndex(resUnits, { value: data });

  return {
    resTypes,
    resUnits,
    resReceiverUnits,
    validation: clone(validation),
    initSchema: {
      ...schema,
      subType: resTypes[0].id,
      deliverCode: resUnits[initDeliverIndex],
      // deliverCode: resUnits[0].id,
      deliverName: resUnits[0].name,
      // receiverCode: resUnits[0].id,
      receiverCode: resUnits[0],
      receiverName: resUnits[0].name,
    },
  };
};

const getWarehouses = res => {
  checkResponse(res);

  return {
    warehouse: res.data.map(warehouse => ({
      label: warehouse.description,
      value: warehouse.id,
    })),
  };
};

const getProducts = res => {
  checkResponse(res);
  return res.data;
};

const getCustomerAuto = res => {
  checkResponse(res);
  return res.data.map(item => ({
    label: item.fullName,
    value: item.customerCode,
    name: item.customerName,
    group: item.customerGroup,
  }));
};

const getBasketManagerAuto = res => {
  checkResponse(res);
  return res.data.map(item => ({
    label: item.customerName,
    value: item.customerCode,
    group: item.customerGroup,
    customerBasketType: 3,
  }));
};
const getBasketManagerAutoSupplier = res => {
  checkResponse(res);
  return res.data.map(item => ({
    label: `${item.supplierCode} ${item.name1}`,
    value: item.supplierCode,
    group: item.supplierType,
    customerBasketType: 2,
  }));
};

const getUsersAuto = res => {
  checkResponse(res);

  return res.data.map(item => ({
    label: `${item.lastName} ${item.firstName}`,
    value: item.id,
    phone: item.phoneNumber,
    email: item.email,
  }));
};

const getPXKById = res => {
  checkResponse(res);
  let schema = initSchema;
  let validation = validationInternal;
  switch (res[1].data.subType) {
    case TYPE_PXK.PXK_NOI_BO: {
      schema = initSchemaInternal;
      validation = validationInternal;
      break;
    }
    case TYPE_PXK.PXK_XDC_FARM: {
      schema = initSchemaPlant;
      validation = validationPlant;
      break;
    }
    case TYPE_PXK.PXK_XUAT_HUY: {
      schema = initSchemaDestroy;
      validation = validationDestroy;
      break;
    }
    case TYPE_PXK.PXK_XUAT_BAN: {
      schema = initSchemaSell;
      validation = validationSell;
      break;
    }
    default: {
      schema = initSchema;
      validation = validationInternal;
    }
  }
  const resTypes = res[0].data;
  const mainData = {
    resTypes,
    validation: clone(validation),
    pxk: {
      ...schema,
      ...res[1].data,
      ...{ note: res[1].data.note || '' },
      ...{ date: new Date(res[1].data.date).toISOString() },
      ...{ total: formatToCurrency(res[1].data.total) },
      ...{ basketsTrays: mapBasketsTrays(res[1].data.basketsTrays) },
      ...{
        deliBasketsTrays:
          res[1].data.basketsTrays instanceof Array &&
          res[1].data.basketsTrays.length > 0
            ? res[1].data.basketsTrays.filter(item => item.isDeliveryBasket)
            : [],
      },
      deliverCode: {
        value: res[1].data.deliverCode,
        label: res[1].data.deliverName,
      },
      receiverCode: {
        value: res[1].data.receiverCode,
        label: res[1].data.receiverName,
      },
    },
  };
  return mainData;
};

const getDestroyDetail = (res, schema, receiptCode) => ({
  ...schema,
  ...res.data,
  ...{ total: formatToCurrency(res.data.total) },
  ...{
    detailsCommands: res.data.productInfos,
    receiptCode,
  },
});

const mapPlantToPlant = res => {
  // danh sách đơn vị nhận hàng
  if (res.length > 0) {
    const resReceiverUnits = res.map(unit => ({
      name: unit.label,
      id: unit.value,
      value: unit.value,
      label: unit.label,
    }));
    const receiverCode = res[0].value;
    return { resReceiverUnits, receiverCode };
  }
  return { resReceiverUnits: null, receiverCode: null };
};
const mapExportSell = res => ({
  sellTypes: res[0].data,
  channels: res[1].data,
  transporters: res[2].data,
});
export default {
  channels,
  transporters,
  units,
  receiverUnits,
  initCreate,
  getWarehouses,
  getProducts,
  getCustomerAuto,
  getBasketManagerAuto,
  getUsersAuto,
  getPXKById,
  getDestroyDetail,
  mapPlantToPlant,
  mapExportSell,
  getBasketManagerAutoSupplier,
};
