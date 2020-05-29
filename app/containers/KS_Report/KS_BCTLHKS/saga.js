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
import colorsChart from './colorCharts';
import { formatToCurrency } from '../../../utils/numberUtils';
const formattedValue = value =>
  Number.isNaN(parseFloat(value)) ? '' : formatToCurrency(value);
const APIs = {
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getAllPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants/get-all`,
  getReasons: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt-basket/cancellation-receipt-reason`,
  getReasonCancellation: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt-basket/cancellation-receipt-cause`,
  getReceiptTypes: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt-basket/cancellation-export-type`,
  getAllPalletBasket: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-baskets`,
  getReportData: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/cancellation-request-report/group-chart`,
  getReportDataMainTable: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellation-request-report`,
  getPrintData: `${PATH_GATEWAY.BFF_SPA_API}/cancellation-request-report/print`,
  getExcelData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellation-request-report/export-excel`,
  syncReportData: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/sync-data/basket-cancellation`,
  syncBasketInventory: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-reports/daily-basket-inventory-manual-sync`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();
let count = 0;
export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;

    if (fetchNew) {
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });

      const [
        reasonsRes,
        reasonCancellationsRes,
        receiptTypesRes,
        palletBasketRes,
        currentOrgsRes,
        usersRes,
      ] = yield all([
        call(request, APIs.getReasons, GETOption),
        call(request, APIs.getReasonCancellation, GETOption),
        call(request, APIs.getReceiptTypes, GETOption),
        call(
          request,
          `${
            APIs.getAllPalletBasket
          }?pageNumber=1&pageSize=-1&sortDirection=asc`,
          GETOption,
        ),
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
        call(request, APIs.getUsers, GETOption),
      ]);

      if (
        reasonsRes.statusCode !== 200 ||
        !reasonsRes.data ||
        !reasonsRes.data.length
      ) {
        throw Object({
          message: reasonsRes.message || 'Không lấy được danh sách lý do',
        });
      }

      if (
        reasonCancellationsRes.statusCode !== 200 ||
        !reasonCancellationsRes.data ||
        !reasonCancellationsRes.data.length
      ) {
        throw Object({
          message:
            reasonCancellationsRes.message ||
            'Không lấy được danh sách lý do hủy',
        });
      }

      if (
        receiptTypesRes.statusCode !== 200 ||
        !receiptTypesRes.data ||
        !receiptTypesRes.data.length
      ) {
        throw Object({
          message:
            receiptTypesRes.message || 'Không lấy được danh sách loại phiếu',
        });
      }

      if (!palletBasketRes.data || !palletBasketRes.data.length) {
        throw Object({
          message:
            palletBasketRes.message || 'Không lấy được danh sách khay sọt',
        });
      }

      if (!currentOrgsRes.data || !currentOrgsRes.data.length) {
        throw Object({
          message: currentOrgsRes.message || 'Không lấy được danh sách đơn vị',
        });
      }

      if (!usersRes.data || !usersRes.data.length) {
        throw Object({
          message: usersRes.message || 'Không lấy được danh sách người dùng',
        });
      }

      const formData = {
        reasons: [
          ...reasonsRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
        reasonCancellations: [
          ...reasonCancellationsRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
        receiptTypes: [
          ...receiptTypesRes.data.map(item => ({
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
        users: [
          ...usersRes.data.map(item => ({
            value: item.id,
            label: `${item.lastName} ${item.firstName}`,
          })),
        ],
      };

      yield put(actions.fetchFormDataSuccess(formData));
      // Fetch report data
      yield put(actions.fetchReportData(formValues));
    } else {
      // Fetch report data
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
      receiptCode: values.receiptCode,
      plantCode:
        values.plant.length === 0 ? null : values.plant.map(item => item.value),
      assetCode: values.assetsCode,
      exportDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      palletBasketCode: values.palletBasket ? values.palletBasket.value : null,
      approver: values.approver ? values.approver.value : null,
      exporter: values.exporter ? values.exporter.value : null,
      causeCode: values.reason === 0 ? null : values.reason,
      reasonCode:
        values.reasonCancellation === 0 ? null : values.reasonCancellation,
      exportType: values.receiptType === 0 ? null : values.receiptType,
      sort: values.sort,
      pageSize: values.pageSize,
      pageIndex: values.pageIndex,
    };
    const queryStr = serializeQueryParams(queryParams);

    const [reportRes, reportMainTableRes] = yield all([
      call(request, `${APIs.getReportData}?${queryStr}`, GetOption),
      call(request, `${APIs.getReportDataMainTable}?${queryStr}`, GetOption),
    ]);

    if (reportRes.statusCode === 200 && reportMainTableRes.statusCode === 200) {
      const mainTableDataMapped = reportMainTableRes.data.items.map(item => ({
        basketDocumentCode: item.basketDocumentCode,
        plantName: item.plantName,
        receiptCode: item.receiptCode,
        assetCode: item.assetCode,
        palletBasketCode: item.palletBasketCode,
        palletBasketName: item.palletBasketName,
        uoM: item.uoM,
        quantity: item.quantity,
        productName: item.productName,
        price: formattedValue(item.price),
        reasonName: item.reasonName,
        exportDate: convertDateString(item.exportDate),
        receiptDate: convertDateString(item.receiptDate),
        approvalDate: convertDateString(item.approvalDate),
        requesterName: item.requesterName,
        approver1Name: item.approver1Name,
        approver2Name: item.approver2Name,
        approver3Name: item.approver3Name,
        exporterName: item.exporterName,
      }));

      let totalRow = {};
      if (reportMainTableRes.data.items.length > 0) {
        totalRow = {
          totalCol: true,
          uoM: 'Tổng',
          quantity: reportMainTableRes.data.totalQuantity,
          price: formattedValue(reportMainTableRes.data.totalPrice),
        };
      }

      const colors = [];
      if (reportRes.data.priceReports.length > 0) {
        let i;
        // eslint-disable-next-line no-plusplus
        for (i = 0; i < reportRes.data.priceReports.length; i++) {
          let color;
          if (i < colorsChart.length) {
            color = colorsChart[i];
          } else {
            color = getRandomColor();
            while (colors.includes(color)) {
              color = getRandomColor();
            }
          }
          colors.push(color);
        }
      }

      // Genegate color random for chart
      const circleChartPriceMapped = reportRes.data.priceReports
        .filter(item => {
          if (
            (item.name === null && item.percentage === 0) ||
            item.percentage < 0
          ) {
            return false;
          }
          return true;
        })
        .map((item, index) => ({
          angle: item.percentage,
          value: item.percentage,
          color: colors[index],
          name: item.name != null ? item.name : 'Khác',
          label: `${formattedValue(item.price)}`,
          subLabel: `${item.percentage}%`,
        }));
      const circleChartQuantityMapped = reportRes.data.quantityReports
        .filter(item => {
          if (
            (item.name === null && item.percentage === 0) ||
            item.percentage < 0
          ) {
            return false;
          }
          return true;
        })
        .map((item, index) => ({
          angle: item.percentage,
          value: item.percentage,
          color: colors[index],
          name: item.name != null ? item.name : 'Khác',
          label: `${item.quantity}`,
          subLabel: `${item.percentage}%`,
        }));

      const barChartMapped = covertDataBarChart(
        reportRes.data.quantityCompareTotalReports,
        colors,
      );

      circleChartPriceMapped.forEach(element => {
        if (element.angle < 1) {
          // eslint-disable-next-line no-param-reassign
          element.angle = 1;
        }
      });

      circleChartQuantityMapped.forEach(element => {
        if (element.angle < 1) {
          // eslint-disable-next-line no-param-reassign
          element.angle = 1;
        }
      });

      const data = {
        submittedValues: {
          ...values,
          totalItem: reportMainTableRes.meta.count,
        },
        chart: {
          circleChartPrice: circleChartPriceMapped,
          circleChartQuantity: circleChartQuantityMapped,
          barChart: barChartMapped,
        },
        table: {
          totalTable: reportRes.data.tableReports,
          mainTable: mainTableDataMapped,
          totalRow,
        },
      };

      yield put(actions.fetchReportDataSuccess(data));
      yield put(setLoading(false));
    } else {
      yield put(loadingError(reportRes.message));
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function covertDataBarChart(data, colors) {
  return data.map((item, index) => ({
    farm: item.plant,
    color: colors[index],
    data: item.data.map(itemData => ({
      x: convertDateString(itemData.date),
      y: itemData.percentage,
      plant: item.plant,
      quantity: itemData.quantity,
      inventory: itemData.inventory,
    })),
  }));
}

export function* fetchMainTableDataSaga(action) {
  try {
    yield put(setLoading());
    const GetOption = optionReq({
      method: 'GET',
      authReq: true,
    });

    const values = action.payload;

    const queryParams = {
      receiptCode: values.receiptCode,
      plantCode:
        values.plant.length === 0 ? null : values.plant.map(item => item.value),
      assetCode: values.assetsCode,
      exportDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      palletBasketCode: values.palletBasket ? values.palletBasket.value : null,
      approver: values.approver ? values.approver.value : null,
      exporter: values.exporter ? values.exporter.value : null,
      causeCode: values.reason === 0 ? null : values.reason,
      reasonCode:
        values.reasonCancellation === 0 ? null : values.reasonCancellation,
      exportType: values.receiptType === 0 ? null : values.receiptType,
      sort: values.sort,
      pageSize: values.pageSize,
      pageIndex: values.pageIndex,
    };
    const queryStr = serializeQueryParams(queryParams);

    const [reportMainTableRes] = yield all([
      call(request, `${APIs.getReportDataMainTable}?${queryStr}`, GetOption),
    ]);

    const mainTableDataMapped = reportMainTableRes.data.items.map(item => ({
      basketDocumentCode: item.basketDocumentCode,
      plantName: item.plantName,
      receiptCode: item.receiptCode,
      assetCode: item.assetCode,
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketName,
      uoM: item.uoM,
      quantity: item.quantity,
      productName: item.productName,
      price: formattedValue(item.price),
      reasonName: item.reasonName,
      exportDate: convertDateString(item.exportDate),
      receiptDate: convertDateString(item.receiptDate),
      approvalDate: convertDateString(item.approvalDate),
      requesterName: item.requesterName,
      approver1Name: item.approver1Name,
      approver2Name: item.approver2Name,
      approver3Name: item.approver3Name,
      exporterName: item.exporterName,
    }));

    let totalRow = {};
    if (reportMainTableRes.data.items.length > 0) {
      totalRow = {
        totalCol: true,
        uoM: 'Tổng',
        quantity: reportMainTableRes.data.totalQuantity,
        price: formattedValue(reportMainTableRes.data.totalPrice),
      };
    }

    const data = {
      mainTable: mainTableDataMapped,
      totalRow,
      submittedValues: values,
    };

    yield put(actions.fetchMainTableDataSuccess(data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportReportSaga(action) {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const values = action.payload;
    const queryParams = {
      receiptCode: values.receiptCode,
      plantCode:
        values.plant.length === 0 ? null : values.plant.map(item => item.value),
      assetCode: values.assetsCode,
      exportDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      palletBasketCode: values.palletBasket ? values.palletBasket.value : null,
      approver: values.approver ? values.approver.value : null,
      exporter: values.exporter ? values.exporter.value : null,
      causeCode: values.reason === 0 ? null : values.reason,
      reasonCode:
        values.reasonCancellation === 0 ? null : values.reasonCancellation,
      exportType: values.receiptType === 0 ? null : values.receiptType,
    };
    const queryStr = serializeQueryParams(queryParams);
    yield call(
      request,
      `${APIs.getExcelData}?${queryStr}`,
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
      receiptCode: values.receiptCode,
      plantCode:
        values.plant.length === 0 ? null : values.plant.map(item => item.value),
      assetCode: values.assetsCode,
      exportDateFrom: values.exportDateFrom
        ? values.exportDateFrom.toISOString()
        : null,
      exportDateTo: values.exportDateTo
        ? values.exportDateTo.toISOString()
        : null,
      palletBasketCode: values.palletBasket ? values.palletBasket.value : null,
      approver: values.approver ? values.approver.value : null,
      exporter: values.exporter ? values.exporter.value : null,
      causeCode: values.reason === 0 ? null : values.reason,
      reasonCode:
        values.reasonCancellation === 0 ? null : values.reasonCancellation,
      exportType: values.receiptType === 0 ? null : values.receiptType,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getPrintData}?${queryStr}`,
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
      from: values.dateFrom ? values.dateFrom.toISOString() : null,
      to: values.dateTo ? values.dateTo.toISOString() : null,
      requestId: values.requestId,
    };

    const res1 = yield call(
      request,
      APIs.syncReportData,
      optionReq({
        method: 'POST',
        authReq: true,
        body,
      }),
    );

    const res2 = yield call(
      request,
      APIs.syncBasketInventory,
      optionReq({
        method: 'POST',
        authReq: true,
        body,
      }),
    );
    checkStatus(res1);
    checkStatus(res2);

    if (!res1.data) {
      throw Object({ message: res1.message });
    }
    if (!res2.data) {
      throw Object({ message: res2.message });
    }
    yield put(actions.syncReportSuccess({ dateFrom: values.dateFrom }));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* signalRProcessing(action) {
  try {
    const { requestId, response, submittedValues } = action;
    // eslint-disable-next-line no-plusplus
    if (response && response.meta.requestId === requestId && ++count > 1) {
      count = 0;
      yield put(showSuccess(response.message));
      yield put(actions.fetchReportData(submittedValues));
    }
    // yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_REPORT_DATA, fetchReportDataSaga);
  yield takeLeading(
    constants.FETCH_MAIN_TABLE_REPORT_DATA,
    fetchMainTableDataSaga,
  );
  yield takeLeading(constants.EXPORT_REPORT, exportReportSaga);
  yield takeLeading(constants.PRINT_REPORT, printReportSaga);
  yield takeLeading(constants.ORDER_CHANGE, changeOrderSaga);
  yield takeLeading(constants.SYNC_DATA, syncReportSaga);
  yield takeLeading(constants.SIGNALIR_PROCESSING, signalRProcessing);
}
