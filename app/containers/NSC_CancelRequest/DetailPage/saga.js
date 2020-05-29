/* eslint-disable indent */
import React from 'react';
import {
  put,
  all,
  call,
  takeEvery,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import * as constants from './constants';
import * as actions from './actions';
import {
  loadingError,
  setLoading,
  showWarning,
  showSuccess,
} from '../../App/actions';
import request, { PATH_GATEWAY, optionReq } from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import {
  convertDateTimeString,
  getNested,
  getUrlParams,
  serializeQueryParams,
  updateUrlFilters,
} from '../../App/utils';
import { linksTo } from './linksTo';
import { formatToCurrency } from '../../../utils/numberUtils';
import { basketsInUseFields, assetsTableFields } from './tableFields';
import { calculateBasketsInfoTableData } from './utils';
import { CODE } from '../../../authorize/groupAuthorize';

const APIs = {
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getStatuses: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/request-cancellation-status`,
  getReasons: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/get-cancellation-receipt-reason`,
  getRequesters: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`, // &filterName={keyword}
  getApprovers: `${PATH_GATEWAY.BFF_SPA_API}/user/get-by-privileges`, // &filterName={keyword}
  getAccumulatedValue: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/total-accumulated`, // ?id={id}&plantCode={orgCode}&reasonCode={reasonCode}
  getProducts: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/product-in-locator`, // ?plantCode={code}&filter={keyword}
  getCauses: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/cause-cancellation-type?isIncludeAll=false`,
  getReceiptData: `${PATH_GATEWAY.BFF_SPA_API}/cancellationrequestreceipt`, // /{id}
  submitCreateReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/create`, // POST
  submitEditReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/update`, // POST
  submitApproveReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/approved`, // POST
  submitReApproveReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/re-approved`, // POST
  getBigImage: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/image-detail`, // /{id}
  getBigImageRefer: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/adjust/image-basket-detail`, // /{id}
  getBigImageBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/image-basket-detail`, // /{id}
  deleteProduct: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/delete-cancellation-request-detail`,
  getExportCancellation: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/export-cancellation-handler`, // /{id}
  getAssetAC: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets/asset-autocomplete`, // ?search={}&plantCode={}
  getCauseAsset: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets/reason-asset`, // ?reasonCode={} - get nguyên nhân huỷ cho tài sản
  getBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/palletbasketinfo/plant-baskets`, // POST - /{plantCode}
  fetchPopupTable: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/palletbasketinfo/asset-inventories`, // POST
  submitCreateReceiptBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets`, // POST
  submitEditReceiptBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets`, // /{id} - PUT
  getBasketReceiptData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/baskets`, // /{id}
  deleteAsset: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt-basket/basket-detail`, // /{id} - DELETE
  getBasketLocators: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/get-basket-locator`,
  discardReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets/{id}/cancel`,
  printCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/print`,
};

const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { pageType, history, match } = action;
    let { isBasket } = getUrlParams(history);
    const receiptId = getNested(match, 'params', 'id');

    if (!isBasket) {
      isBasket = false;
    }

    const GETOption = optionReq({ method: 'GET', authReq: true });

    const statusQueryParams = {
      isIncludeAll: false,
      isReApprove: !!pageType.reApprove,
      isCreatePage: !!pageType.create,
      isUpdatePage: !!pageType.edit,
      isBasket,
      receiptId,
    };
    const statusQueryStr = serializeQueryParams(statusQueryParams);

    const [orgByUserRes, statusRes, reasonRes, causeRes] = yield all([
      call(request, `${APIs.getOrgsByUserId}?userId=${userId}`, GETOption),
      call(request, `${APIs.getStatuses}?${statusQueryStr}`, GETOption),
      call(request, `${APIs.getReasons}`, GETOption),
      call(request, `${APIs.getCauses}`, GETOption),
    ]);

    if (orgByUserRes.statusCode !== 200 || !orgByUserRes.data) {
      yield put(
        showWarning(orgByUserRes.message || 'Không lấy được thông tin đơn vị'),
      );
    }

    if (statusRes.statusCode !== 200 || !statusRes.data) {
      yield put(
        showWarning(statusRes.message || 'Không lấy được thông tin trạng thái'),
      );
    }

    if (reasonRes.statusCode !== 200 || !reasonRes.data) {
      yield put(
        showWarning(reasonRes.message || 'Không lấy được thông tin lý do hủy'),
      );
    }

    if (causeRes.statusCode !== 200 || !causeRes.data) {
      yield put(
        showWarning(
          causeRes.message || 'Không lấy được thông tin nguyên nhân hủy',
        ),
      );
    }

    const selectBoxData = {
      status: statusRes.data
        ? statusRes.data.map(item => ({
            value: item.id,
            label: item.name,
          }))
        : [],
      org: orgByUserRes.data
        ? orgByUserRes.data.map(item => ({
            value: item.value,
            label: item.name,
            type: item.organizationType,
          }))
        : [],
      reason: reasonRes.data
        ? reasonRes.data.map(item => ({
            value: item.id,
            label: item.name,
            isBasket: !!item.isBasket, // true => lý do của loại khay sọt
          }))
        : [],
      cause: causeRes.data
        ? causeRes.data.map(item => ({
            value: item.id,
            label: item.name,
          }))
        : [],
    };

    // Only keep reasons with type = receipt type
    if (!pageType.create) {
      selectBoxData.reason = selectBoxData.reason.filter(
        item => item && item.isBasket === isBasket,
      );
    }

    let defaultIsBasket = false;
    if (pageType.create || pageType.edit) {
      defaultIsBasket =
        selectBoxData.reason &&
        selectBoxData.reason.length &&
        selectBoxData.reason[0].isBasket;

      // update url params to match with default selected reason
      updateUrlFilters(history, { isBasket: defaultIsBasket });
    }

    /**
     * Fetch Accumulated Value - for product only
     */
    const tempFormValues = {
      org:
        selectBoxData.org && selectBoxData.org.length
          ? selectBoxData.org[0]
          : '',
      // org:
      //   selectBoxData.org && selectBoxData.org.length
      //     ? selectBoxData.org[0].value
      //     : '',
      reason:
        selectBoxData.reason && selectBoxData.reason.length
          ? selectBoxData.reason[0].value
          : '',
    };

    if (defaultIsBasket && tempFormValues.reason) {
      yield put(actions.fetchCauseAsset(tempFormValues.reason)); // fetch nguyên nhân huỷ của khay sọt
    }

    if (!defaultIsBasket) {
      const queryParams = {
        id: pageType.create ? 0 : tempFormValues.id || null,
        plantCode: tempFormValues.org.value || null,
        reasonCode: tempFormValues.reason || null,
      };
      const queryStr = serializeQueryParams(queryParams);

      const accumRes = yield call(
        request,
        `${APIs.getAccumulatedValue}?${queryStr}`,
        optionReq({ method: 'GET', authReq: true }),
      );

      if (accumRes.statusCode !== 200 || typeof accumRes.data === 'undefined') {
        yield put(
          showWarning(
            accumRes.message || 'Có lỗi xảy ra khi lấy thông tin lũy kế',
          ),
        );
      } else {
        selectBoxData.accumulatedValue = formatToCurrency(accumRes.data);
      }
      yield put(actions.fetchBasketLocators({ org: tempFormValues.org }));
    }
    yield put(actions.fetchFormDataSuccess(selectBoxData));
    if (pageType.create) yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchRequesterSaga(action) {
  try {
    const { keyword, callback } = action;
    const res = yield call(
      request,
      `${APIs.getRequesters}&filterName=${keyword}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi tìm kiếm' });
    }

    const mappedData = res.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchApproverSaga(action) {
  try {
    const { keyword, isBasket, callback } = action;
    const queryParams = {
      filterName: keyword,
      privilegeCodes: isBasket ? CODE.pheDuyetYCHKS : CODE.pheDuyetYCH,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getApprovers}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi tìm kiếm' });
    }

    const mappedData = res.data.map(item => ({
      value: item.id || item.Id,
      label: `${item.lastName} ${item.firstName}`,
    }));

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchAccumulatedValueSaga(action) {
  try {
    yield put(setLoading());
    const { pageType, formValues, callback } = action;
    const queryParams = {
      id: pageType.create ? 0 : formValues.id || null,
      plantCode: formValues.org.value || null,
      reasonCode: formValues.reason || null,
    };

    const queryStr = serializeQueryParams(queryParams);

    const res = yield call(
      request,
      `${APIs.getAccumulatedValue}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || typeof res.data === 'undefined') {
      throw Object({
        message: res.message || 'Có lỗi xảy ra lấy thông tin lũy kế',
      });
    }

    callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchProductAutocompleteSaga(action) {
  try {
    const { orgCode, keyword, callback } = action;
    const queryParams = {
      plantCode: orgCode.value || null,
      filter: keyword,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getProducts}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Có lỗi xảy ra lấy thông tin sản phẩm',
      });
    }

    const returnedData = res.data.map(item => ({
      value: item.productCode,
      label: (
        <span>
          {item.slotCode}
          <br />
          {item.locatorName}
          <br />
          {item.productName}
        </span>
      ),
      renderLabel: item.productCode,
      productName: item.productName,
      slotCode: item.slotCode,
      locatorId: item.locatorId,
      locatorName: item.locatorName,
      inventoryQuantity: item.inventoryQuantity,
      unitPrice: item.unitPrice,
    }));

    callback(returnedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchReceiptDataSaga(action) {
  try {
    yield put(setLoading());
    const { id, pageType, isBasket, callback } = action;
    const t2 = assetsTableFields;
    const t3 = basketsInUseFields;

    const res = yield call(
      request,
      `${isBasket ? APIs.getBasketReceiptData : APIs.getReceiptData}/${id ||
        ''}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin của phiếu hủy',
      });
    }

    const dt = res.data;
    let mappedData;

    if (isBasket) {
      mappedData = {
        isShowExportCancellationButton: dt.isShowExportCancellationButton, // show button "Xuat Huy"
        isShowCancelButton: dt.isShowCancelButton, // show button "Huy Phieu"
        isEditable: dt.isEditable, // products table is editable
        isStatusEditable: dt.isStatusEditable, // field status is editable with 2 options "ko phe duyet" & "cho phe duyet"
        isReasonEditable: dt.isReasonEditable, // field reason is editable
        isAutoReceipt: dt.isAutoReceipt, // phiếu được tạo tự động
        originSource: dt.originSource, // nguồn gốc phiếu tạo tự động
        isDraft: dt.isDraft, // status is draft
        exportCancellationReceiptId: null, // id of cancel receipt (for product)
        basketDocumentExportCancellationId:
          dt.basketDocumentExportCancellationId, // id of cancel receipt (for basket)
        org: dt.plantCode || '',
        printNumber: dt.printNumber,

        showAssetTableButtons: dt.isShowButtonAsset, // hiển thị các nút cho bảng thông tin tài sản sở hữu
        showBasketsInUseTableButtons: dt.isShowButtonBasketInsert, // hiển thị các nút ở bảng thông tin khay sọt sử dụng

        [constants.GENERAL_INFO_SECTION]: {
          id: dt.id,
          receiptCode: dt.receiptCode || '',
          status: dt.status || '',
          createdAt: dt.receiptDate || null,
          // org: dt.plantCode || '',
          org: {
            label: dt.plantName || '',
            value: dt.plantCode || '',
          },
          reason: dt.reasonCode || '',
          requester: dt.requester
            ? { value: dt.requester, label: dt.requesterName }
            : null,
          approver1: dt.approverLevel1
            ? { value: dt.approverLevel1, label: dt.approverLevel1Name }
            : null,
          approver2: dt.approverLevel2
            ? { value: dt.approverLevel2, label: dt.approverLevel2Name }
            : null,
          approver3: dt.approverLevel3
            ? { value: dt.approverLevel3, label: dt.approverLevel3Name }
            : null,
          note: dt.note,

          level: dt.level, // cap phe duyet
          indexLink: 0,
          totalCancelValue: dt.totalPrice || '0', // tổng giá trị huỷ tạm tính
          totalCurrentCancelValue: dt.totalCurrentPrice || '0', // tổng giá trị huỷ hiện tại
        },
        // section 2 table data
        [constants.ASSET_TABLE]: dt.assetDetails
          ? dt.assetDetails.map(item => ({
              [t2.id]: item.id,
              [t2.assetCode]: item.assetCode,
              [t2.ownerCode]: item.ownerCode,
              [t2.ownerName]: item.ownerName || '',
              [t2.palletBasketCode]: item.palletBasketCode,
              [t2.palletBasketName]: item.palletBasketShortName,
              [t2.cancelQuantity]: item.quantity,
              [t2.uom]: item.uom || item.uoM,
              [t2.unitPrice]: item.unitPrice,
              [t2.currentUnitPrice]: item.currentUnitPrice,
              [t2.cancelValue]: item.price, // giá trị huỷ tạm tính
              [t2.currentCancelValue]: item.currentPrice, // giá trị huỷ hiện tại
              [t2.causeCode]: item.reasonCode,
              [t2.cause]: item.reasonName || '',
              [t2.assetStatus]: item.state || '',
              [t2.note]: item.note,
              [t2.seqFC]: item.seqFC,
              [t2.cancelRequestBasketDetailCode]:
                item.cancelRequestBasketDetailCode,
              [t2.depreciationRemaining]: item.depreciationRemaining,
              [t2.inventoryQuantity]: item.inventoryQuantity,
              isLoadedFromServer: true,
              // isDeleted: item.isDeleted,
              // isDeletable: item.isShowButtonAsset,
            }))
          : [],

        [constants.BASKET_INUSE_TABLE]: dt.basketDetails
          ? dt.basketDetails.map(item => ({
              [t3.id]: item.id,
              [t3.basketLocatorCode]: item.basketLocatorId,
              [t3.basketLocatorName]: item.basketLocatorDescription,
              [t3.palletBasketShortName]: item.palletBasketShortName,
              [t3.locatorType]: item.locatorType,
              [t3.palletBasketCode]: item.palletBasketCode,
              [t3.palletBasketName]: item.palletBasketShortName,
              [t3.maxCancelQuantity]: item.maxCancelQuantity,
              [t3.inStockQuantity]: item.stockQuantity,
              [t3.cancelQuantity]: item.cancelQuantity,
              [t3.inStockQuantityDiff]: item.compareStockCancelQuantity,
              [t3.maxCancelQuantityDiff]: item.compareMaxCancelQuantity,
              [t3.uom]: item.uom || item.uoM,
              [t3.isRefactorImage]: item.isRefactorImage,
              [t3.images]: item.images
                ? item.images.map(img => ({
                    id: img.id,
                    fileName: img.fileName || '',
                    previewData: img.image,
                  }))
                : [],
              [t3.note]: item.note,
              [t3.causeCode]: item.reasonCode,
              [t3.cause]: item.reasonName || '',
              [t3.assetStatus]: item.state || '',
              [t3.cancelRequestBasketDetailCode]:
                item.cancelRequestBasketDetailCode,
              isLoadedFromServer: true,
              isDeleted: item.isDeleted,
              isDeletable: dt.isShowButtonBasketInsert,
            }))
          : [],

        // section 3 table
        [constants.APPROVAL_TABLE]: dt.approvalInformation
          ? dt.approvalInformation.map(item => ({
              id: item.id,
              receiptCode: item.receiptCode,
              approver: item.approver,
              approverName: item.approverName,
              approverOpinions: item.isAgreementText,
              approverNote: item.note,
              approvalDate: convertDateTimeString(item.approvalDate),
            }))
          : [],
      };

      mappedData[constants.BASKET_INFO_TABLE] = calculateBasketsInfoTableData(
        mappedData[constants.ASSET_TABLE],
        mappedData[constants.BASKET_INUSE_TABLE],
      );

      if (callback) callback(mappedData);
    } else {
      mappedData = {
        isShowExportCancellationButton: dt.isShowExportCancellationlButton, // show button "Xuat Huy"
        isEditable: dt.isEditable, // products table is editable
        isStatusEditable: dt.isStatusEditable, // field status is editable with 2 options "ko phe duyet" & "cho phe duyet"
        isDraft: dt.isDraft, // status is draft
        exportCancellationReceiptId: null,
        // org: dt.plantCode || '',
        org: {
          label: dt.plantName || '',
          value: dt.plantCode || '',
        },
        isAutoReceipt: dt.isAuto,
        printNumber: dt.printNumber,

        [constants.GENERAL_INFO_SECTION]: {
          id: dt.id,
          receiptCode: dt.receiptCode || '',
          status: dt.status || '',
          createdAt: dt.receiptDate || null,
          // org: dt.plantCode || '',
          org: {
            label: dt.plantName || '',
            value: dt.plantCode || '',
          },
          reason: dt.reasonCode || '',
          accumulatedValue:
            dt.accumulatedValue || dt.accumulatedValue === 0
              ? formatToCurrency(dt.accumulatedValue)
              : '0',
          requester: dt.requester
            ? { value: dt.requester, label: dt.requesterName }
            : null,
          approver1: dt.approverLevel1
            ? { value: dt.approverLevel1, label: dt.approverLevel1Name }
            : null,
          approver2: dt.approverLevel2
            ? { value: dt.approverLevel2, label: dt.approverLevel2Name }
            : null,
          level: dt.level, // cap phe duyet
          indexLink: 0,
          estValue: 0, // calculate later in FE
        },

        // section 2 table data
        [constants.PRODUCT_TABLE]: dt.details
          ? dt.details.map(item => ({
              id: item.id,
              receiptCode: item.receiptCode,
              productCode: item.productCode,
              productName: item.productName || '',
              batch: item.slotCode,
              sloc: item.locatorName,
              slotCode: item.slotCode || '',
              locatorId: item.locatorId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              estValue:
                item.quantity && item.unitPrice
                  ? parseFloat(item.quantity) * parseFloat(item.unitPrice)
                  : '',
              causeCode: item.reasonCode,
              cause: item.reasonName || '',
              productStatus: item.state || '',
              priorAction: item.remedies || '',
              isDeleted: item.isDeleted,
              images: item.images
                ? item.images.map(img => ({
                    id: img.id,
                    previewData: img.previewData,
                  }))
                : [],
              note: item.note,
              isLoadedFromServer: true,
              isDeletable: item.isDeletable, // is deletable - for pageType.view only

              // isRefactorImage:  if true => get new api /basket-stocktaking/adjust/image-basket-detail/id
              // isRefactorImage:  if false => get old api /cancellationrequestreceipt/image-detail/id
              isRefactorImage: item.isRefactorImage,
            }))
          : [],

        // section 3 table
        [constants.APPROVAL_TABLE]: dt.approvalInformations
          ? dt.approvalInformations.map(item => ({
              id: item.id,
              receiptCode: item.receiptCode,
              approver: item.approver,
              approverName: item.approverName,
              approverOpinions: item.isAgreementText,
              approverNote: item.note,
              approvalDate: convertDateTimeString(item.approvalDate),
            }))
          : [],
      };

      if (dt.id) {
        const exportCancellationRes = yield call(
          request,
          `${APIs.getExportCancellation}/${dt.id}`,
          optionReq({ method: 'GET', authReq: true }),
        );

        if (
          exportCancellationRes.statusCode === 200 ||
          exportCancellationRes.data
        ) {
          mappedData.exportCancellationReceiptId = exportCancellationRes.data;
        }
      }

      // calculate gross estValue
      if (mappedData[constants.PRODUCT_TABLE].length) {
        let estValue = 0;
        mappedData[constants.PRODUCT_TABLE].forEach(row => {
          if (!row.isDeleted) {
            estValue += row.estValue;
          }
        });
        mappedData[constants.GENERAL_INFO_SECTION].estValue = formatToCurrency(
          estValue,
        );
      }

      // fetch status data for page edit when status = "không phê duyệt"
      if (pageType.edit && mappedData.isStatusEditable) {
        const statusQueryParams = {
          isStatusEditable: true,
          isDraft: mappedData.isDraft,
        };
        const statusQueryStr = serializeQueryParams(statusQueryParams);
        const statusRes = yield call(
          request,
          `${APIs.getStatuses}?${statusQueryStr}`,
          optionReq({ method: 'GET', authReq: true }),
        );

        if (statusRes.statusCode !== 200 || !statusRes.data) {
          yield put(
            showWarning(
              statusRes.message || 'Không lấy được thông tin trạng thái',
            ),
          );
        } else {
          mappedData.statusData = statusRes.data.map(item => ({
            value: item.id,
            label: item.name,
          }));
        }
      }
    }
    if (isBasket) {
      yield put(actions.fetchCauseAsset(dt.reasonCode));
      yield put(
        actions.fetchBasketLocators({
          org: { value: dt.plantCode, label: dt.plantName },
        }),
      );
    }
    yield put(actions.fetchReceiptDataSuccess(mappedData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitCreateReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { data, isBasket } = action;
    const t1 = assetsTableFields;
    const t2 = basketsInUseFields;

    let mappedData;
    if (isBasket) {
      mappedData = {
        plantCode: data.org.value,
        status: data.status,
        receiptDate: data.createdAt ? data.createdAt.toISOString() : null,
        reasonCode: data.reason,
        requester: data.requester ? data.requester.value : null,
        approverLevel1: data.approver1 ? data.approver1.value : null,
        approverLevel2: data.approver2 ? data.approver2.value : null,
        approverLevel3: data.approver3 ? data.approver3.value : null,
        note: data.note,

        assetDetailCommands: data[constants.ASSET_TABLE]
          ? data[constants.ASSET_TABLE].filter(item => !!item).map(item => ({
              assetCode: item[t1.assetCode],
              palletBasketCode: item[t1.palletBasketCode],
              palletBasketName: item[t1.palletBasketName],
              ownerCode: item[t1.ownerCode],
              ownerName: item[t1.ownerName],
              price: item[t1.cancelValue]
                ? parseFloat(item[t1.cancelValue])
                : 0,
              quantity: item[t1.cancelQuantity]
                ? parseInt(item[t1.cancelQuantity], 10)
                : 0,
              uoM: item[t1.uom],
              reasonCode: item[t1.causeCode],
              // state: item[t1.assetStatus],
              note: item[t1.note],
              seqFC: item[t1.seqFC],
              cancelRequestBasketDetailCode:
                item[t1.cancelRequestBasketDetailCode],
              id: item[t1.id] || 0,
            }))
          : null,

        basketDetailCommands: data[constants.BASKET_INUSE_TABLE]
          ? data[constants.BASKET_INUSE_TABLE]
              .filter(item => !!item)
              .map(item => ({
                basketLocatorId: item[t2.basketLocatorCode],
                basketLocatorName: item[t2.basketLocatorName],
                palletBasketCode: item[t2.palletBasketCode],
                palletBasketName: item[t2.palletBasketName],
                stockQuantity: item[t2.inStockQuantity],
                cancelQuantity: item[t2.cancelQuantity]
                  ? parseInt(item[t2.cancelQuantity], 10)
                  : 0,
                uoM: item[t2.uom],
                imageFiles:
                  item[t2.images] && item[t2.images].length > 0
                    ? item[t2.images].map(img => ({
                        fileName: img.file ? img.file.name : '',
                        file: img.previewData,
                      }))
                    : [],
                note: item[t2.note],
                cancelRequestBasketDetailCode:
                  item[t2.cancelRequestBasketDetailCode],
                reasonCode: item[t2.causeCode],
                state: item[t2.assetStatus],
              }))
          : null,
      };
    } else {
      mappedData = {
        plantCode: data.org.value,
        receiptDate: data.createdAt ? data.createdAt.toISOString() : null,
        reasonCode: data.reason,
        requester: data.requester ? data.requester.value : null,
        approverLevel1: data.approver1 ? data.approver1.value : null,
        approverLevel2: data.approver2 ? data.approver2.value : null,
        detailCommands: data[constants.PRODUCT_TABLE]
          ? data[constants.PRODUCT_TABLE].filter(item => !!item).map(item => ({
              productCode: item.productCode,
              locatorId: item.locatorId,
              slotCode: item.slotCode,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              reasonCode: item.causeCode,
              state: item.productStatus,
              remedies: item.priorAction,
              note: item.note,
              imageFiles:
                item.images && item.images.length > 0
                  ? item.images.map(img => ({
                      fileName: img.file ? img.file.name : '',
                      file: img.previewData,
                    }))
                  : [],
            }))
          : [],
      };
    }

    const res = yield call(
      request,
      isBasket ? APIs.submitCreateReceiptBasket : APIs.submitCreateReceipt,
      optionReq({ method: 'POST', body: mappedData, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Lưu thông tin thất bại' });
    }

    yield put(setLoading(false));
    yield put(push(linksTo.dsPYCH));
    yield put(showSuccess(res.message || 'Lưu thông tin thành công'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitEditReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { id, data, isBasket } = action;
    const t1 = assetsTableFields;
    const t2 = basketsInUseFields;

    let mappedData;
    if (isBasket) {
      mappedData = {
        id,
        status: data.status,
        reasonCode: data.reason,
        requester: data.requester ? data.requester.value : null,
        approverLevel1: data.approver1 ? data.approver1.value : null,
        approverLevel2: data.approver2 ? data.approver2.value : null,
        approverLevel3: data.approver3 ? data.approver3.value : null,
        note: data.note,

        assetDetailCommands: data[constants.ASSET_TABLE]
          ? data[constants.ASSET_TABLE].filter(item => !!item).map(item => ({
              id: item[t1.id] || 0,
              assetCode: item[t1.assetCode],
              palletBasketCode: item[t1.palletBasketCode],
              palletBasketName: item[t1.palletBasketName],
              ownerCode: item[t1.ownerCode],
              ownerName: item[t1.ownerName],
              quantity: item[t1.cancelQuantity],
              price: item[t1.currentCancelValue],
              uoM: item[t1.uom],
              reasonCode: item[t1.causeCode],
              state: item[t1.assetStatus],
              note: item[t1.note],
              seqFC: item[t1.seqFC],
              cancelRequestBasketDetailCode:
                item[t1.cancelRequestBasketDetailCode],
            }))
          : [],

        basketDetailCommands: data[constants.BASKET_INUSE_TABLE]
          ? data[constants.BASKET_INUSE_TABLE]
              .filter(item => !!item)
              .map(item => ({
                id: item[t2.id],
                basketLocatorId: item[t2.basketLocatorCode],
                basketLocatorName: item[t2.basketLocatorName],
                palletBasketCode: item[t2.palletBasketCode],
                palletBasketName: item[t2.palletBasketName],
                stockQuantity: item[t2.inStockQuantity],
                cancelQuantity: item[t2.cancelQuantity],
                uoM: item[t2.uom],
                note: item[t2.note],
                imageFiles:
                  item[t2.images] && item[t2.images].length > 0
                    ? item[t2.images].map(img => ({
                        ...(img.id ? { id: img.id } : {}),
                        fileName:
                          img.newlyUploaded && img.file
                            ? img.file.name
                            : img.fileName || '',
                        file: img.previewData,
                        willDelete: img.markedDelete,
                      }))
                    : [],
                cancelRequestBasketDetailCode:
                  item[t2.cancelRequestBasketDetailCode],
                reasonCode: item[t2.causeCode],
                state: item[t2.assetStatus],
              }))
          : [],
      };
    } else {
      mappedData = {
        id,
        statusCode: data.status,
        reasonCode: data.reason,
        requester: data.requester ? data.requester.value : null,
        approverLevel1: data.approver1 ? data.approver1.value : null,
        approverLevel2: data.approver2 ? data.approver2.value : null,
        detailCommands: data[constants.PRODUCT_TABLE]
          ? data[constants.PRODUCT_TABLE].filter(item => !!item).map(item => ({
              id: item.id,
              productCode: item.productCode,
              locatorId: item.locatorId,
              slotCode: item.slotCode,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              reasonCode: item.causeCode,
              state: item.productStatus,
              remedies: item.priorAction,
              note: item.note,
              imageDeleted: item.imageDeleted,
              isLoadedFromServer: item.isLoadedFromServer,
              imageFiles:
                item.images && item.images.length > 0
                  ? item.images
                      .filter(img => img && img.newlyUploaded)
                      .map(img => ({
                        fileName: img.file ? img.file.name : '',
                        file: img.previewData,
                      }))
                  : [],
            }))
          : [],
      };
    }

    const res = yield call(
      request,
      isBasket
        ? `${APIs.submitEditReceiptBasket}/${id}`
        : APIs.submitEditReceipt,
      optionReq({
        method: isBasket ? 'PUT' : 'POST',
        body: mappedData,
        authReq: true,
      }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Lưu thông tin thất bại' });
    }

    yield put(setLoading(false));
    yield put(push(linksTo.dsPYCH));
    yield put(showSuccess(res.message || 'Lưu thông tin thành công'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitApproveReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { id, data } = action;

    const mappedData = {
      id,
      isAgreement: data.approve === '1',
      note: data.approverNote,
    };

    const res = yield call(
      request,
      APIs.submitApproveReceipt,
      optionReq({ method: 'POST', body: mappedData, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Lưu thông tin thất bại' });
    }

    yield put(showSuccess(res.message || 'Lưu thông tin thành công'));
    yield put(push(linksTo.dsPYCH));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitReApproveReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { id, data } = action;

    const mappedData = {
      id,
      approverLevel1: data.approver1 ? data.approver1.value : null,
      approverLevel2: data.approver2 ? data.approver2.value : null,
      approverLevel3: data.approver3 ? data.approver3.value : null,
      note: data.note,
      status: data.status,
    };

    const res = yield call(
      request,
      APIs.submitReApproveReceipt,
      optionReq({ method: 'POST', body: mappedData, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Lưu thông tin thất bại' });
    }

    yield put(showSuccess(res.message || 'Lưu thông tin thành công'));
    yield put(push(linksTo.dsPYCH));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBigImageSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback, isRefactorImage } = action;
    let res;
    if (isRefactorImage) {
      // get new api
      res = yield call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/basket-stocktaking/adjust/image-basket-detail/${id}`,
        optionReq({ method: 'GET', authReq: true }),
      );
    } else {
      // get old api
      res = yield call(
        request,
        `${APIs.getBigImage}/${id}`,
        optionReq({ method: 'GET', authReq: true }),
      );
    }

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Lấy thông tin ảnh thất bại' });
    }

    yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBigImageReferSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback } = action;
    const res = yield call(
      request,
      `${APIs.getBigImageRefer}/${id}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Lấy thông tin ảnh thất bại' });
    }

    yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBigImageBasketSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback } = action;
    const res = yield call(
      request,
      `${APIs.getBigImageBasket}/${id}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Lấy thông tin ảnh thất bại' });
    }

    yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteProductSaga(action) {
  try {
    yield put(setLoading());
    const { rowData, callback } = action;

    const queryBody = {
      receiptCode: rowData.receiptCode,
      receiptDetailId: rowData.id,
    };

    const res = yield call(
      request,
      `${APIs.deleteProduct}`,
      optionReq({ method: 'DELETE', body: queryBody, authReq: true }),
    );

    if (res.statusCode !== 200) {
      yield callback(false);
      throw Object({ message: res.message || 'Xóa không thành công' });
    }

    yield put(showSuccess(res.message || 'Xóa thành công'));
    yield callback(true);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchAssetACSaga(action) {
  try {
    const { orgCode, inputText, callback } = action.payload;

    const queryParams = {
      plantCode: orgCode.value,
      search: inputText,
      pageSize: -1,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getAssetAC}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      yield callback(false);
      throw Object({ message: res.message || 'Không lấy được dữ liệu' });
    }

    const mappedData = res.data.map(item => ({
      ...item,
      value: item.assetCode,
      label: (
        <span>
          {item.palletBasketShortName}
          <br />
          {item.ownerName}
        </span>
      ),
      assetCode: item.assetCode,
      ownerCode: item.ownerCode,
      ownerName: item.ownerName,
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketShortName,
      unitPrice: item.unitPrice,
      currentUnitPrice: item.currentUnitPrice,
      uom: item.uoM || item.uom,
      depreciationRemaining: item.depreciationRemaining,
      // quantity: item.quantity,
      inventoryQuantity: item.inventoryQuantity,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchCauseAssetSaga(action) {
  try {
    const { reasonCode, callback } = action.payload;

    const queryParams = { reasonCode };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getCauseAsset}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message:
          res.message || 'Không lấy được dữ liệu nguyên nhân huỷ tài sản',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.id,
      label: item.name,
      isDefault: item.isDefault,
    }));

    if (callback) callback(mappedData);
    yield put(actions.fetchCauseAssetSuccess(mappedData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPopupBasketSaga(action) {
  try {
    const {
      formik,
      basketLocatorCode,
      isEdit,
      data,
      callback,
    } = action.payload;
    if (!basketLocatorCode) {
      throw Object({
        message: 'Thiếu thông tin kho nguồn. Vui lòng thử lại.',
      });
    }
    const queryParams = {
      plantCode: formik.values.org.value,
      basketLocatorId: basketLocatorCode.value,
      isEdit,
      idBasket: isEdit && data ? data.cancelRequestBasketDetailCode : null,
    };
    const queryStr = serializeQueryParams(queryParams);
    const basketsInUseData = formik.values[constants.BASKET_INUSE_TABLE];
    const body = basketsInUseData
      ? basketsInUseData
          .filter(item => item && item.palletBasketCode)
          .map(rowData => ({
            basketLocatorId: rowData.basketLocatorCode,
            palletBasketCode: rowData.palletBasketCode,
            quantity: rowData.cancelQuantity
              ? parseFloat(rowData.cancelQuantity)
              : 0,
            idBasket:
              isEdit && data ? rowData.cancelRequestBasketDetailCode : null,
            id: rowData.id ? rowData.id : null,
          }))
      : [];

    const res = yield call(
      request,
      `${APIs.getBasket}?${queryStr}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin mã khay sọt',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.palletBasketShortName}`,
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketShortName,
      inStock: item.quantity,
      inStockOriginal: item.stockQuantity,
      uom: item.uoM || item.uom,
    }));

    yield put(actions.fetchPopupBasketSuccess(mappedData));
    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBasketByLocatorACSaga(action) {
  try {
    const { formik, basketLocatorCode, inputText, callback } = action.payload;
    if (!basketLocatorCode) {
      throw Object({
        message: 'Thiếu thông tin kho nguồn. Vui lòng thử lại.',
      });
    }

    const queryParams = {
      plantCode: formik.values.org.value,
      basketLocatorId: basketLocatorCode,
      search: inputText,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getBasket}?${queryStr}`,
      optionReq({ method: 'POST', body: [], authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin mã khay sọt',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.palletBasketShortName}`,
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketShortName,
      inStock: item.quantity,
      inStockOriginal: item.stockQuantity,
      uom: item.uoM || item.uom,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPopupTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { filters, assetsTable, callback } = action.payload;
    const queryParams = {
      quantityCancellation: filters.cancelQuantity
        ? parseInt(filters.cancelQuantity, 10)
        : 0,
      quantityInventory: filters.inStock,
      // plantCode: filters.org,
      palletBasketCode: filters.palletBasket.value,
      idBasket: filters.isEdit ? filters.cancelRequestBasketDetailCode : null,
      isEdit: filters.isEdit || null,
      isFirstClick: filters.isFirstClick,
    };

    const body = assetsTable
      ? assetsTable.filter(item => !!item).map(item => ({
          assetCode: item.assetCode,
          palletBasketCode: item.palletBasketCode,
          quantity: item.cancelQuantity ? parseInt(item.cancelQuantity, 10) : 0,
          idBasket: filters.isEdit ? item.cancelRequestBasketDetailCode : null,
          id: filters.isEdit ? item.id : null,
        }))
      : [];

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.fetchPopupTable}?${queryStr}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin tài sản',
      });
    }

    const mappedData = res.data.map(item => ({
      id: item.id,
      assetCode: item.assetCode,
      ownerCode: item.ownerCode,
      ownerName: item.ownerName,
      unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : 0,
      currentUnitPrice: item.currentUnitPrice
        ? parseFloat(item.currentUnitPrice)
        : 0,
      ownQuantity: item.quantity ? parseInt(item.quantity, 10) : 0,
      cancelQuantity: item.quantityCancellation
        ? parseInt(item.quantityCancellation, 10)
        : 0,
      difference:
        parseInt(item.quantity, 10) - parseInt(item.quantityCancellation, 10),
      seqFC: item.seqFC,
      depreciationRemaining: item.depreciationRemaining,
      inventoryQuantity: item.inventoryQuantity,
    }));

    const updatedValues = {
      cancelValue:
        mappedData
          .map(item => item.cancelQuantity * item.currentUnitPrice)
          .reduce((curr, accum) => accum + curr, 0) || '0',
      [constants.SELECT_BASKET_TABLE]: mappedData,
    };

    if (callback) callback(updatedValues);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteAssetSaga(action) {
  try {
    yield put(setLoading());
    const { rowData, callback } = action;

    const res = yield call(
      request,
      `${APIs.deleteAsset}/${rowData.id}`,
      optionReq({ method: 'DELETE', authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Xóa không thành công' });
    }

    if (callback) yield callback();
    yield put(showSuccess(res.message || 'Xóa thành công'));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBasketLocatorsSaga(action) {
  try {
    const { filters, callback } = action.payload;
    const queryParams = {
      plantCode: filters.org.value,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getBasketLocators}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin kho nguồn',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.basketLocatorId,
      label: item.basketLocatorName,
      locatorType: item.locatorType,
    }));

    yield put(actions.fetchBasketLocatorsSuccess(mappedData));
    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBasketLocatorsACSaga(action) {
  try {
    const { filters, callback } = action.payload;
    const queryParams = {
      plantCode: filters.org.value,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getBasketLocators}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin kho nguồn',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.basketLocatorId,
      label: item.basketLocatorName,
      locatorType: item.locatorType,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* discardReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { id } = action.payload;

    const res = yield call(
      request,
      APIs.discardReceipt.replace('{id}', id),
      optionReq({ method: 'PUT', authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Huỷ phiếu không thành công',
      });
    }

    yield put(showSuccess(res.message || 'Huỷ phiếu thành công'));

    yield put(push(linksTo.dsPYCH));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { id, isPreview, isRePrint, callback } = action.payload;
    if (!id) {
      throw Object({ message: 'Thiếu ID của phiếu' });
    }

    const queryParams = {
      ids: id,
      isPreview,
      ...(!isPreview ? { isReprint: isRePrint } : {}),
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.printCancelRequest}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({
        message:
          response.message ||
          `Có lỗi xảy ra khi ${isPreview ? 'xem trước bản in' : 'in'}`,
      });
    }

    if (callback) yield callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchStatusDataSaga(action) {
  try {
    yield put(setLoading());
    const { pageType, receiptId, isBasket } = action.payload;

    const requestParams = {
      isIncludeAll: false,
      isReApprove: !!pageType.reApprove,
      isCreatePage: !!pageType.create,
      isUpdatePage: !!pageType.edit,
      isBasket,
      receiptId,
    };

    const requestStr = serializeQueryParams(requestParams);
    const res = yield call(
      request,
      `${APIs.getStatuses}?${requestStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được danh sách trạng thái',
      });
    }

    const data = res.data
      ? res.data.map(item => ({
          value: item.id,
          label: item.name,
        }))
      : [];

    yield put(actions.fetchStatusDataSuccess(data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.FETCH_REQUESTER, fetchRequesterSaga);
  yield takeLatest(constants.FETCH_APPROVER, fetchApproverSaga);
  yield takeLeading(
    constants.FETCH_ACCUMULATED_VALUE,
    fetchAccumulatedValueSaga,
  );
  yield takeLatest(
    constants.FETCH_PRODUCTS_AUTOCOMPLETE,
    fetchProductAutocompleteSaga,
  );
  yield takeLeading(constants.FETCH_RECEIPT_DATA, fetchReceiptDataSaga);
  yield takeLeading(constants.SUBMIT_CREATE_RECEIPT, submitCreateReceiptSaga);
  yield takeLeading(constants.SUBMIT_EDIT_RECEIPT, submitEditReceiptSaga);
  yield takeLeading(constants.SUBMIT_APPROVE_RECEIPT, submitApproveReceiptSaga);
  yield takeLeading(
    constants.SUBMIT_REAPPROVE_RECEIPT,
    submitReApproveReceiptSaga,
  );
  yield takeLeading(constants.DELETE_PRODUCT, deleteProductSaga);
  yield takeEvery(constants.FETCH_BIG_IMAGE, fetchBigImageSaga);
  yield takeEvery(constants.FETCH_REFER_IMAGE, fetchBigImageReferSaga);

  yield takeLeading(constants.FETCH_ASSET_AC, fetchAssetACSaga);
  yield takeLatest(constants.FETCH_CAUSE_ASSET, fetchCauseAssetSaga);
  yield takeLeading(constants.FETCH_POPUP_BASKET, fetchPopupBasketSaga);
  yield takeLeading(constants.FETCH_POPUP_TABLE_DATA, fetchPopupTableDataSaga);
  yield takeLeading(constants.DELETE_ASSET, deleteAssetSaga);
  yield takeLeading(constants.FETCH_BIG_IMAGE_BASKET, fetchBigImageBasketSaga);
  yield takeLeading(constants.FETCH_BASKET_LOCATORS, fetchBasketLocatorsSaga);
  yield takeLeading(
    constants.FETCH_BASKET_LOCATORS_AC,
    fetchBasketLocatorsACSaga,
  );
  yield takeLeading(
    constants.FETCH_BASKET_BY_LOCATOR_AC,
    fetchBasketByLocatorACSaga,
  );
  yield takeLeading(constants.DISCARD_RECEIPT, discardReceiptSaga);
  yield takeLeading(constants.PRINT_RECEIPT, printReceiptSaga);
  yield takeLeading(constants.FETCH_STATUS_DATA, fetchStatusDataSaga);
}
