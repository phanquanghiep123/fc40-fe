import {
  all,
  call,
  put,
  takeLatest,
  takeLeading,
  select,
} from 'redux-saga/effects';

import {
  transformBaskets,
  transformPallets,
} from 'components/GoodsWeight/utils';

import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  optionReq,
  checkStatus,
  requestAuth,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import {
  setLoading,
  openDialog,
  showSuccess,
  loadingError,
} from '../../App/actions';

import * as actions from './actions';
import * as constants from './constants';
import { formSubmittedValues } from './selectors';

// import { demoTableData } from './demoData';

import { customerRoutine, masterRoutine, productRoutine } from './routines';
import { serializeQueryParams, makeSaveFileFunc } from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/totalweightmgts/weighed-input-product`, // ?orgCode={orgCode}&organizationType={orgType}
  completeWeighing: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/finish`, // POST
  completeAll: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/finish-all`, // POST
  deleteRowData: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/document-details`, // DELETE - /{documentDetailId}
  exportExcel: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/export`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
export const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

export function* fetchOrgListSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const orgRes = yield call(
        request,
        `${APIs.getOrg}?userId=${auth.meta.userId}`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      );

      if (orgRes.statusCode !== responseCode.ok || !orgRes.data) {
        throw Object({
          message: orgRes.message || 'Không lấy được danh sách đơn vị',
        });
      }

      if (orgRes.data.length < 1) {
        throw Object({
          message: 'Không lấy được danh sách đơn vị',
        });
      }

      const orgList = orgRes.data.map(item => ({
        value: item.value,
        label: item.name,
        type: item.organizationType,
      }));

      yield put(actions.fetchOrgListSuccess(orgList));

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      updatedFormValues = {
        ...formValues,
        org: JSON.stringify(orgList[0]),
        ngayThucHienCan: currentDate,
      };
    }

    yield put(actions.fetchTableData(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;
    const { org, ngayThucHienCan } = formValues;
    const parsedOrg = JSON.parse(org);

    const GETOption = optionReq({ method: 'GET', body: null, authReq: true });

    const queryParams = {
      orgCode: parsedOrg.value,
      organizationType: parsedOrg.type,
      date: ngayThucHienCan ? ngayThucHienCan.toISOString() : null,
    };
    const queryStr = serializeQueryParams(queryParams);

    const [tableDataRes, locatorsRes] = yield all([
      call(request, `${APIs.getTableData}?${queryStr}`, GETOption),
      call(
        requestAuth,
        `${CAPACITYCONTROL_URL}/exportedstockreceipts/get-locator?plantCode=${
          parsedOrg.value
        }`,
      ),
    ]);

    if (tableDataRes.statusCode !== responseCode.ok || !tableDataRes.data) {
      throw Object({
        message: tableDataRes.message || 'Không lấy được dữ liệu từ API',
      });
    }
    if (locatorsRes.statusCode !== responseCode.ok || !locatorsRes.data) {
      throw Object({
        message: locatorsRes.message || 'Không lấy được thông tin kho hàng',
      });
    }

    // filtering form data
    if (
      !tableDataRes.data.semiFinishedProducts ||
      !tableDataRes.data.farms ||
      !tableDataRes.data.batchSemiFinishedProducts
    ) {
      throw Object({ message: 'Không lấy được thông tin bộ lọc' });
    }

    // form data to render the filtering form
    const formData = {
      farms: tableDataRes.data.farms,
      semiFinishedProducts: tableDataRes.data.semiFinishedProducts,
      batchSemiFinishedProducts: tableDataRes.data.batchSemiFinishedProducts,
    };

    // table data
    if (!tableDataRes.data.totalWeightMgtsDtos) {
      throw Object({ message: 'Không lấy được thông tin hàng hóa' });
    }

    const productTypeOneCode = 10; // product type 1 code - fixed code

    // spread rows
    let key = 0;
    let spreadTableData = [];
    tableDataRes.data.totalWeightMgtsDtos.forEach(productGroup => {
      const unweightedProducts = [];
      const selectedProductCodes = [];
      const parentId = key;

      let isMainRowInserted = false;
      let addedSubRows = 0;
      let completeDisabled = true; // disable complete button
      let isTypeOneWeighed = false; // check if any product type 1 added

      // weighted (đã cân)
      productGroup.products.forEach(product => {
        let rowData = {
          ...productGroup,
          originalProducts: [...productGroup.products],
        };

        if (
          product.productBatchCode !== null &&
          product.productQuantity !== 0
        ) {
          if (completeDisabled) {
            completeDisabled = false;
          }

          if (product.gradeCode === productTypeOneCode) {
            isTypeOneWeighed = true;
          }

          rowData = {
            ...rowData,
            ...product,
            parentId: null,
            productSelectDisabled: true,
          };

          // mainRow or subRow
          if (isMainRowInserted) {
            rowData.parentId = parentId;
            addedSubRows += 1;
          }

          spreadTableData.push(rowData);
          selectedProductCodes.push(product.productCode);
          isMainRowInserted = true;
          key += 1;
        } else {
          unweightedProducts.push({ ...product });
        }
      });

      // weighted products that don't contain any product type 1
      if (
        isMainRowInserted &&
        !isTypeOneWeighed &&
        unweightedProducts.length >= 1
      ) {
        const numOfAddedRow = addedSubRows + 1; // including main row

        // pop out the added rows of current productGroup
        let poppedOutRows = []; // temporarily store popped-out rows
        new Array(numOfAddedRow).fill(null).forEach(() => {
          poppedOutRows.push(spreadTableData.pop());
        });
        poppedOutRows.reverse();
        poppedOutRows = poppedOutRows.map(item => ({ ...item, parentId })); // modify params

        // make alternative main row
        const newMainRow = {
          ...productGroup,
          parentId: null,
          ...unweightedProducts[0], // spread value of the first unweighted product
          productSelectDisabled: unweightedProducts.length === 1,
          originalProducts: [...productGroup.products],
          products: unweightedProducts, // exclude weighted products
        };

        // re-add into spreadTableData
        spreadTableData = [...spreadTableData, newMainRow, ...poppedOutRows];
        addedSubRows += 1;
        key += 1;
      }

      // unweighted (chưa cân)
      if (!isMainRowInserted && unweightedProducts.length >= 1) {
        const rowData = {
          ...productGroup,
          originalProducts: [...productGroup.products],
          products: unweightedProducts, // exclude weighted products
        };

        // mainRow or subRow
        if (isMainRowInserted) {
          rowData.parentId = parentId;
          addedSubRows += 1;
        }

        spreadTableData.push(rowData);
        isMainRowInserted = true;
        key += 1;
      }

      // update main row statuses
      spreadTableData[parentId].selectedProductCodes = selectedProductCodes;
      spreadTableData[parentId].addedSubRows = addedSubRows;
      spreadTableData[parentId].addRowDisabled = unweightedProducts.length < 1;
      spreadTableData[parentId].completeDisabled = completeDisabled;
    });

    const tableData = spreadTableData.map((rowData, index) => {
      let dynamicParams;
      const hasOnlyOneProductTypeOne =
        rowData.products.filter(item => item.gradeCode === productTypeOneCode)
          .length === 1;

      if (!rowData.productSelectDisabled && rowData.products.length > 0) {
        dynamicParams = {
          ...rowData.products[0],
          productSelectDisabled:
            rowData.products.length <= 1 || hasOnlyOneProductTypeOne,
        };
      } else {
        dynamicParams = {};
      }

      return {
        ...rowData,
        originalIndex: index, // to map tableData with tableOriginalData
        ...dynamicParams,
        baseUoM: rowData.products.length > 0 ? rowData.products[0].baseUoM : '',
        deliverCode: rowData.originCode,
        receiverCode: parsedOrg.value,
        semiFinishedProductSlotCode: rowData.semiFinishedProductSlotCode,
        products: rowData.products.map(product => ({
          ...product,
          value: product.productCode,
          label: `${product.gradeName} - ${product.productCode}`,
          deliverCode: rowData.originCode,
        })),
        originalProducts: rowData.originalProducts.map(product => ({
          ...product,
          value: product.productCode,
          label: `${product.gradeName} - ${product.productCode}`,
          deliverCode: rowData.originCode,
        })),

        isHidden: false,
        addRowDisabled: rowData.products.length <= 1,
      };
    });

    // Do FE filtering if there is any filter
    const filters = {
      originCode: formValues.farms,
      semiFinishedProductCode: formValues.semiFinishedProducts
        ? formValues.semiFinishedProducts.value
        : null,
      semiFinishedProductSlotCode: formValues.batchSemiFinishedProducts,
    };

    // filter
    let filteredTable = [...tableData];
    filteredTable = filteredTable.map(item => ({
      ...item,
      isHidden: false,
    }));

    // eslint-disable-next-line no-restricted-syntax
    for (const filterKey of Object.keys(filters)) {
      if (filters[filterKey]) {
        filteredTable = filteredTable.map(item => {
          if (item[filterKey] === filters[filterKey]) {
            return { ...item };
          }
          return { ...item, isHidden: true };
        });
      }
    }

    yield put(actions.fetchTableDataSuccess(formData, tableData, formValues));
    yield put(actions.updateTableData(filteredTable, formValues));
    yield put(actions.updateLocators(locatorsRes.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* completeWeighingSaga(action) {
  try {
    yield put(setLoading());
    const { org, date, rowData, callback } = action;

    const parsedOrg = JSON.parse(org);
    const currentDate = new Date();
    const requestBody = {
      processorCode: parsedOrg.value,
      organizationType: parsedOrg.type,
      currentDate: date ? date.toISOString() : currentDate.toISOString(),
      semiFinishedProductCode: rowData.semiFinishedProductCode,
      semiFinishedProductSlotCode: rowData.semiFinishedProductSlotCode,
    };

    const res = yield call(
      request,
      APIs.completeWeighing,
      optionReq({ method: 'POST', body: requestBody, authReq: true }),
    );

    if (res.statusCode === 409) {
      yield put(loadingError(res.message || 'Hoàn thành cân thất bại'));
      yield put(
        actions.fetchTableData({
          org: typeof org === 'object' ? JSON.stringify(org) : org,
          ngayThucHienCan: date,
        }),
      );
    } else {
      if (res.statusCode !== 200) {
        throw Object({
          message: res.message || 'Hoàn thành cân thất bại',
        });
      }

      callback(); // update table data
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* completeAllSaga(action) {
  try {
    yield put(setLoading());
    const { org, date } = action;

    const parsedOrg = JSON.parse(org);
    const currentDate = new Date();
    const requestBody = {
      processorCode: parsedOrg.value,
      organizationType: parsedOrg.type,
      currentDate: date ? date.toISOString() : currentDate.toISOString(),
    };

    const res = yield call(
      request,
      APIs.completeAll,
      optionReq({ method: 'POST', body: requestBody, authReq: true }),
    );

    if (res.statusCode === 409) {
      yield put(loadingError(res.message || 'Hoàn thành phiếu cân thất bại'));
      yield put(
        actions.fetchTableData({
          org: typeof org === 'object' ? JSON.stringify(org) : org,
          ngayThucHienCan: date,
        }),
      );
    } else {
      if (res.statusCode !== 200) {
        throw Object({
          message: res.message || 'Hoàn thành phiếu cân thất bại',
        });
      }

      yield put(showSuccess(res.message || 'Hoàn thành phiếu cân thành công'));
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  const { org, ngayThucHienCan } = action.formSubmittedValues;
  const parsedOrg = JSON.parse(org);
  try {
    yield call(
      request,
      `${APIs.exportExcel}?orgCode=${parsedOrg.value}&orgName=${
        parsedOrg.label
      }&organizationType=${parsedOrg.type}&weighedDate=${new Date(
        ngayThucHienCan,
      ).toISOString()}`,
      optionReq({ method: 'GET', authReq: true }),
      makeSaveFileFunc(),
    );
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

/**
 * Lấy dữ liệu khi mới vào page
 */
export function* getInitMaster() {
  try {
    yield put(setLoading());

    const [basketsResponse, palletsResponse] = yield all([
      call(
        requestAuth,
        `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
      ),
      call(requestAuth, `${MASTER_URL}/pallets?pageSize=-1&sortDirection=asc`),
    ]);
    // checkStatus(basketsResponse);
    // checkStatus(palletsResponse);

    const payload = {
      baskets: transformBaskets(basketsResponse.data),
      pallets: transformPallets(palletsResponse.data),
    };
    yield put(masterRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Lấy các lần cân của sản phẩm
 */
export function* getProductTurnScales(action) {
  try {
    const { params } = action.payload || {};

    let requestURL = `${BFF_SPA_URL}/totalweightmgts/turn-scale-product?`;
    requestURL += `documentId=${params.documentId}`;
    requestURL += `&productCode=${params.productCode}`;
    requestURL += `&slotCode=${params.slotCode}`;
    requestURL += `&semiFinishedProductCode=${params.semiFinishedProductCode}`;
    requestURL += `&semiFinishedProductSlotCode=${
      params.semiFinishedProductSlotCode
    }`;

    yield put(setLoading());

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data,
    };
    yield put(productRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Nhập kho sản phẩm
 */
export function* performImportStock(action) {
  const value = yield select(formSubmittedValues());
  try {
    const { data, callback } = action.payload || {};

    const requestURL = `${CAPACITYCONTROL_URL}/totalweightmgts/turn-scale-product`;

    yield put(setLoading());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: data,
      }),
    );
    checkStatus(response);

    if (callback) {
      const { id: documentId, turnToScales, documentDetails } = response.data;

      const { slotCode = '' } = turnToScales.length > 0 ? turnToScales[0] : {};
      const { id: documentDetailId = 0 } =
        documentDetails.length > 0 ? documentDetails[0] : {};

      callback(slotCode, documentId, documentDetailId);
    }

    yield put(setLoading(false));
    yield put(showSuccess(response.message));
    yield fetchTableDataSaga({ formValues: value });
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* openWeightPopupSaga(action) {
  yield put(actions.setInitWeightData(action.weightData));
  yield put(openDialog());
}

/**
 * Delete row data
 */
export function* deleteRowDataSaga(action) {
  try {
    yield put(setLoading());
    const { rowData, callback } = action;

    const res = yield call(
      request,
      `${APIs.deleteRowData}/${rowData.documentDetailId}`,
      optionReq({
        method: 'DELETE',
        authReq: true,
      }),
    );

    if (res.statusCode !== 200) {
      callback(false); // stop the FE deletion process
      throw Object({ message: res.message || 'Xóa thất bại' });
    }

    callback(true); // proceed FE deletion
    yield put(showSuccess(res.message || 'Xóa thành công'));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}
/*
* autocomplete nhập khách hàng cho phiếu chuyển nội bộ
* */
export function* getCustomerAuto(action) {
  const { inputText, callback } = action.payload;
  try {
    const requestURL = `${
      PATH_GATEWAY.RESOURCEPLANNING_API
    }/customer/autocomplete-distinct?filter=${inputText}`;
    const res = yield call(requestAuth, requestURL);
    yield callback(res.data);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_ORG_LIST, fetchOrgListSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLeading(constants.COMPLETE_WEIGHING, completeWeighingSaga);
  yield takeLeading(constants.COMPLETE_ALL, completeAllSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.OPEN_WEIGHT_POPUP, openWeightPopupSaga);
  yield takeLeading(constants.DELETE_ROW_DATA, deleteRowDataSaga);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(productRoutine.REQUEST, getProductTurnScales);
  yield takeLatest(customerRoutine.REQUEST, getCustomerAuto);
  yield takeLeading(productRoutine.EDITING_REQUEST, performImportStock);
}
