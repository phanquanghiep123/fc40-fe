/**
 * @description
 *
 * mapping between object get from api and object in reactjs app
 */
import { responseCode } from 'utils/request';
import { initSchemaExportedRetail } from './schema';
import { basketGroup } from './basketTrayUtils';

const checkResponse = ({ ...res }) => {
  for (let i = 0, len = res.length; i < len; i += 1) {
    if (res[i].statusCode !== responseCode.ok) {
      throw Object({ message: res[i].message });
    }
  }
};

export const getUsersAuto = res => {
  checkResponse(res);

  return res.data.map(item => ({
    label: `${item.lastName} ${item.firstName}`,
    value: item.id,
    phone: item.phoneNumber,
    email: item.email,
  }));
};

export const getCustomerAuto = res => {
  checkResponse(res);
  return res.data.map(item => ({
    label: item.customerName,
    value: item.customerCode,
  }));
};

export const getRetailCustomer = res => {
  checkResponse(res);
  return res.data.map(item => ({
    id: item.id,
    label: item.phoneNumer,
    value: item.phoneNumer,
    retailCustomerPhoneNumber: item.phoneNumer,
    address: item.address,
    fullName: item.fullName,
  }));
};

// danh sách đơn vị giao hàng
export const deliverCodeUnits = data =>
  data.map(unit => ({
    name: unit.name,
    id: unit.value,
    label: unit.name,
    value: unit.value,
  }));

export const transporters = res =>
  res.map(unit => ({
    name: unit.fullName,
    id: unit.transporterCode,
  }));

export const initCreate = res => {
  checkResponse(res);

  const resTypes = res[0].data;
  // test phiếu xuất huủy
  const resUnits = res[1].data.map(unit => ({
    name: unit.name,
    id: unit.value,
    label: unit.name,
    value: unit.value,
  }));

  return {
    resTypes,
    resUnits,
    initSchema: {
      ...initSchemaExportedRetail,
      subType: resTypes[0].id,
      deliverCode: resUnits[0].id,
      deliverName: resUnits[0].name,
      receiverCode: resUnits[0].id,
      receiverName: resUnits[0].name,
    },
  };
};

export const getPXKById = res => {
  checkResponse(res);

  const resTypes = res[0].data;
  return {
    resTypes,
    pxk: {
      ...initSchemaExportedRetail,
      ...res[1].data,
      ...{ note: res[1].data.note || '' },
      ...{ date: new Date(res[1].data.date).toISOString() },
      ...{ basketsTrays: basketGroup(res[1].data.detailsCommands) },
      deliverCode: {
        value: res[1].data.deliverCode,
        label: res[1].data.deliverName,
      },
    },
  };
};

export const getPackingStyles = data =>
  data.map(item => ({
    label: item.packingStyleName,
    value: item.packingStyleCode,
  }));

export const getRetailTypes = data =>
  data.map(item => ({
    label: item.retailTypeName,
    value: item.retailTypeCode,
  }));
