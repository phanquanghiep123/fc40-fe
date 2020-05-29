import { formatToCurrency } from 'utils/numberUtils';

export const mappingSchema = (schema, data) => {
  const returnObj = Object.assign({}, schema);
  returnObj.doType = data.doType || 0;
  returnObj.subTypeName = data.subTypeName || '';
  returnObj.deliverCodeName = data.deliverCodeName || '';
  returnObj.receiverCode = data.receiverCode || '';
  returnObj.receiverCodeName = data.receiverCodeName || '';
  returnObj.date = data.date || '';
  returnObj.deliveryOrderCode = data.deliveryOrderCode || '';
  returnObj.importerName = data.importerName || '';
  returnObj.importerPhone = data.importerPhone || '';
  returnObj.importerEmail = data.importerEmail || '';
  returnObj.basketDocumentId = data.basketDocumentId || '';
  returnObj.basketDocumentStatus = data.basketDocumentStatus || '';
  returnObj.vehicleNumberingLabel = data.vehicleNumbering
    ? `Chuyến ${data.vehicleNumbering}`
    : '';
  returnObj.supervisorName = data.supervisorName || '';
  returnObj.note = data.note || '';
  returnObj.status = data.status || '';
  returnObj.autoFlag = data.autoFlag || false;
  return returnObj;
};

export function mappingData(data) {
  const result = [];
  let sumPlannedTotalQuatity = 0;
  let sumAfterRecoveryQuantity = 0;
  for (let i = 0; i < data.length; i += 1) {
    sumPlannedTotalQuatity += data[i].plannedTotalQuatity;
    sumAfterRecoveryQuantity += data[i].afterRecoveryQuantity;
    result.push({ index: i + 1, ...data[i] });
  }
  result.push({
    is_after: true,
    processingTypeName: 'Tổng',
    plannedTotalQuatity: formatToCurrency(sumPlannedTotalQuatity),
    afterRecoveryQuantity: formatToCurrency(sumAfterRecoveryQuantity),
  });
  return result;
}
