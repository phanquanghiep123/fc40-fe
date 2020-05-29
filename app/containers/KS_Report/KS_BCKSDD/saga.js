/* eslint-disable indent */
import { all, call, put, takeLeading } from 'redux-saga/effects';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  optionReq,
  PATH_GATEWAY,
  checkStatus,
} from '../../../utils/request';
import { setLoading, loadingError, showSuccess } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import {
  makeSaveFileFunc,
  serializeQueryParams,
  convertDateString,
} from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getAllPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants/get-all`,
  getReportStatus: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-byway-report/export-receipt-status`,
  getReportWarningType: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-byway-report/basket-delivery-status`,
  getRoleTypes: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-byway-report/role-enum`, // ?userId={id}
  getAllPalletBasket: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-baskets`,
  getReportData: `${PATH_GATEWAY.REPORTADAPTER_API}/basket-byway-report`,
  getReportDataExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/basket-byway-report/export-excel`,
  getReportDataPrint: `${PATH_GATEWAY.BFF_SPA_API}/basket-byway-report/print`,
  syncReport: `${PATH_GATEWAY.REPORTADAPTER_API}/sync-data/basket-byway-report`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    if (fetchNew) {
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });
      const plantTypeString = '2,4';
      const [
        reportStatusRes,
        reportWarningRes,
        roleTypesRes,
        palletBasketRes,
        currentOrgsRes,
        orgsRes,
      ] = yield all([
        call(request, APIs.getReportStatus, GETOption),
        call(request, APIs.getReportWarningType, GETOption),
        call(request, APIs.getRoleTypes, GETOption),
        call(
          request,
          `${
            APIs.getAllPalletBasket
          }?pageNumber=1&pageSize=-1&sortColumn=0&sortDirection=asc`,
          GETOption,
        ),
        call(
          request,
          `${APIs.getOrg}?userId=${
            auth.meta.userId
          }&plantType=${plantTypeString}`,
          GETOption,
        ),
        call(request, APIs.getAllPlants, GETOption),
      ]);

      if (
        reportStatusRes.statusCode !== 200 ||
        !reportStatusRes.data ||
        !reportStatusRes.data.length
      ) {
        throw Object({
          message:
            reportStatusRes.message || 'Không lấy được danh sách trạng thái',
        });
      }

      if (
        reportWarningRes.statusCode !== 200 ||
        !reportWarningRes.data ||
        !reportWarningRes.data.length
      ) {
        throw Object({
          message:
            reportWarningRes.message || 'Không lấy được danh sách cảnh báo',
        });
      }

      if (
        roleTypesRes.statusCode !== 200 ||
        !roleTypesRes.data ||
        !roleTypesRes.data.length
      ) {
        throw Object({
          message: roleTypesRes.message || 'Không lấy được danh sách vai trò',
        });
      }

      if (!palletBasketRes.data || !palletBasketRes.data.length) {
        throw Object({
          message: roleTypesRes.message || 'Không lấy được danh sách khay sọt',
        });
      }

      const formData = {
        status: [
          ...reportStatusRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
        warnings: [
          ...reportWarningRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
        roles: [
          ...roleTypesRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
        palletBaskets: [
          ...palletBasketRes.data.map(item => ({
            value: item.palletBasketCode,
            label: `${item.palletBasketCode} ${item.shortName}`,
          })),
        ],
        currentOrgs: [
          ...currentOrgsRes.data.map(item => ({
            value: item.value,
            label: item.name,
          })),
        ],
        orgs: [
          ...orgsRes.data.map(item => ({
            value: item.plantCode,
            label: item.plantName,
          })),
        ],
      };

      yield put(actions.fetchFormDataSuccess(formData));
      yield put(actions.fetchReportData(formValues));
    } else {
      yield put(actions.fetchReportData(formValues));
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchReportDataSaga(action) {
  try {
    yield put(setLoading());
    const GetOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const values = action.payload;

    const queryParams = {
      status: values.status === 0 ? null : values.status,
      basketDeliveryStatus: values.warnings === 0 ? null : values.warnings,
      basketDocumentCode: values.documentCode,
      deliveryOrderCode: values.deliveryOrderCode,
      exportReceiptDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportReceiptDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      importReceiptDateFrom: values.receivedDateFrom
        ? values.receivedDateFrom.toISOString()
        : null,
      importReceiptDateTo: values.receivedDateTo
        ? values.receivedDateTo.toISOString()
        : null,
      palletBasket: values.palletBasket ? values.palletBasket.value : null,
      plant: values.org ? values.org.value : '0',
      role: values.roles === 0 ? null : values.roles,
      receiverCode: values.orgReceived ? values.orgReceived.value : null,
      deliverCode: values.orgDeliver ? values.orgDeliver.value : null,
      sort: values.sort,
      pageSize: values.pageSize,
      pageIndex: values.pageIndex,
    };
    const queryStr = serializeQueryParams(queryParams);

    const [reportData] = yield all([
      call(request, `${APIs.getReportData}?${queryStr}`, GetOption),
    ]);
    const tableData = transformDataRows(reportData.data.items);
    const tableDataMapped = tableData.map(item => ({
      isMainRow: item.isMainRow,
      isLastRow: item.isLastRow,
      doCode: item.doCode,
      deliveryName: item.deliveryName,
      receiverName: item.receiverName,
      status: item.status,
      basketDocumentStatusName: item.basketDocumentStatusName,
      date: convertDateString(item.date),
      plannedArrivalDate: convertDateString(item.plannedArrivalDate),
      actualArrivalDate: convertDateString(item.actualArrivalDate),
      importBywayDate: convertDateString(item.importBywayDate),
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketName,
      uoM: item.uoM,
      deliveryQuantity: item.deliveryQuantity,
      quantityActual: item.quantityActual,
      difference: item.difference,
      basketDocumentStatus: item.basketDocumentStatus,
    }));

    let totalRow = {};
    if (reportData.data.items.length > 0) {
      totalRow = {
        totalCol: true,
        uoM: 'Tổng',
        deliveryQuantity: reportData.data.totalDeliveryQuantity,
        quantityActual: reportData.data.totalQuantityActual,
        difference: reportData.data.totalDifference,
      };
    }

    const data = {
      submittedValues: {
        ...values,
        totalItem: reportData.meta.count,
      },
      table: tableDataMapped,
      totalRow,
    };
    yield put(actions.fetchReportDataSuccess(data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

const transformDataRows = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const parentData = datas[i];

      if (parentData) {
        const childDatas = parentData.basketDetails;
        if (childDatas && childDatas.length > 0) {
          for (let j = 0, clen = childDatas.length; j < clen; j += 1) {
            const childData = childDatas[j];

            if (childData) {
              const isMainRow = j === 0;
              const isLastRow = j === clen - 1;

              const rowData = {
                rowIndex: i + 1,
                ...(isMainRow
                  ? {
                      isMainRow: true,
                      spanRows: childDatas.length,
                      ...parentData,
                    }
                  : {}),
                ...(isLastRow ? { isLastRow: true } : {}),
                ...childData,
              };

              results.push(rowData);
            }
          }
        }
      }
    }
  }
  return results;
};

export function* exportReportSaga(action) {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const values = action.payload;
    const queryParams = {
      status: values.status === 0 ? null : values.status,
      basketDeliveryStatus: values.warnings === 0 ? null : values.warnings,
      basketDocumentCode: values.documentCode,
      deliveryOrderCode: values.deliveryOrderCode,
      exportReceiptDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportReceiptDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      importReceiptDateFrom: values.receivedDateFrom
        ? values.receivedDateFrom.toISOString()
        : null,
      importReceiptDateTo: values.receivedDateTo
        ? values.receivedDateTo.toISOString()
        : null,
      palletBasket: values.palletBasket ? values.palletBasket.value : null,
      plant: values.org ? values.org.value : '0',
      role: values.roles === 0 ? null : values.roles,
      receiverCode: values.orgReceived ? values.orgReceived.value : null,
      deliverCode: values.orgDeliver ? values.orgDeliver.value : null,
      pageSize: -1,
    };
    const queryStr = serializeQueryParams(queryParams);
    yield call(
      request,
      `${APIs.getReportDataExcel}?${queryStr}`,
      GETOption,
      makeSaveFileFunc(),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printReportSaga(action) {
  try {
    yield put(setLoading());

    const values = action.payload;
    const queryParams = {
      status: values.status === 0 ? null : values.status,
      basketDeliveryStatus: values.warnings === 0 ? null : values.warnings,
      basketDocumentCode: values.documentCode,
      deliveryOrderCode: values.deliveryOrderCode,
      exportReceiptDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportReceiptDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      importReceiptDateFrom: values.receivedDateFrom
        ? values.receivedDateFrom.toISOString()
        : null,
      importReceiptDateTo: values.receivedDateTo
        ? values.receivedDateTo.toISOString()
        : null,
      palletBasket: values.palletBasket ? values.palletBasket.value : null,
      plant: values.org ? values.org.value : '0',
      role: values.roles === 0 ? null : values.roles,
      receiverCode: values.orgReceived ? values.orgReceived.value : null,
      deliverCode: values.orgDeliver ? values.orgDeliver.value : null,
      pageSize: -1,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getReportDataPrint}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi in.' });
    }

    yield action.callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* changeOrderSaga(action) {
  const { formData, sort } = action.payload;
  try {
    yield put(setLoading());
    formData.sort = sort;
    yield put(actions.fetchReportData(formData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* syncReportSaga(action) {
  const { values } = action.payload;

  try {
    yield put(setLoading());
    const body = {
      processDateFrom: values.dateFrom ? values.dateFrom.toISOString() : null,
      processDateTo: values.dateTo ? values.dateTo.toISOString() : null,
      requestId: values.requestId,
      // plantCode: values.plantCode.value === 0 ? null : values.plantCode.value,
      plantCode:
        values.plantCode.length !== 0
          ? values.plantCode.map(item => item.value).toString()
          : null,
    };

    const res = yield call(
      request,
      APIs.syncReport,
      optionReq({
        method: 'POST',
        authReq: true,
        body,
      }),
    );
    checkStatus(res);

    if (!res.data) {
      throw Object({ message: res.message });
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* signalRProcessing(action) {
  try {
    const { requestId, response, submittedValues } = action;
    if (response && response.meta.requestId === requestId) {
      yield put(showSuccess(response.message));
      yield put(actions.fetchReportData(submittedValues));
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_REPORT_DATA, fetchReportDataSaga);
  yield takeLeading(constants.EXPORT_REPORT, exportReportSaga);
  yield takeLeading(constants.PRINT_REPORT, printReportSaga);
  yield takeLeading(constants.ORDER_CHANGE, changeOrderSaga);
  yield takeLeading(constants.SYNC_DATA, syncReportSaga);
  yield takeLeading(constants.SIGNALIR_PROCESSING, signalRProcessing);
}
