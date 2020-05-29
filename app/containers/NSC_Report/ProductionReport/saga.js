/* eslint-disable indent */
import { all, call, put, takeLeading } from 'redux-saga/effects';
import { startOfDay } from 'date-fns';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, { optionReq, PATH_GATEWAY } from '../../../utils/request';
import { loadingError, setLoading, showWarning } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import {
  convertDateString,
  genOptionAll,
  makeSaveFileFunc,
  serializeQueryParams,
} from '../../App/utils';
import { formatToCurrency } from '../../../utils/numberUtils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/Regions`,
  getSuppliersAutocomplete: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers`, // ?pageSize=100&search={inputText}
  getPlantsAutocomplete: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants`, // ?pageSize=100&search={inputText}
  getProductCat: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/materials/get-for-production-report`,
  getProductSources: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sources/get-all`,
  getUomAutocomplete: `${PATH_GATEWAY.RESOURCEPLANNING_API}/uoms/auto-complete`, // key={inputText}
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/inventory-reports`,
  getExportExcel: `${PATH_GATEWAY.BFF_SPA_API}/inventory-reports/export-excel`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({ method: 'GET', authReq: true });

      const [orgRes, regionRes, productCatRes, productSrcRes] = yield all([
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
        call(
          request,
          `${APIs.getRegions}?&pageSize=-1&includeInactive=false`,
          GETOption,
        ),
        call(request, `${APIs.getProductCat}`, GETOption),
        call(request, `${APIs.getProductSources}`, GETOption),
      ]);

      if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
        yield put(
          showWarning(orgRes.message || 'Không lấy được danh sách đơn vị'),
        );
      }

      if (
        regionRes.statusCode !== 200 ||
        !regionRes.data ||
        !regionRes.data.length
      ) {
        yield put(
          showWarning(
            regionRes.message || 'Không lấy được danh sách vùng sản xuất',
          ),
        );
      }

      if (!productCatRes.data || !productCatRes.data.length) {
        yield put(
          showWarning(
            productCatRes.message || 'Không lấy được danh sách chủng loại',
          ),
        );
      }

      if (!productSrcRes.data || !productSrcRes.data.length) {
        yield put(
          showWarning(
            productSrcRes.message || 'Không lấy được danh sách nguồn',
          ),
        );
      }

      // Map data
      const formData = {
        org: orgRes.data
          ? [
              ...genOptionAll(orgRes.data),
              ...orgRes.data.map(item => ({
                value: item.value,
                label: item.name,
              })),
            ]
          : [],
        productionRegion: regionRes.data
          ? [
              ...genOptionAll(regionRes.data),
              ...regionRes.data.map(item => ({
                value: item.value,
                label: item.name,
              })),
            ]
          : [],
        productCat: productCatRes.data
          ? [
              ...genOptionAll(productCatRes.data),
              ...productCatRes.data.map(item => ({
                value: item.materialGroupCode,
                label: item.description,
              })),
            ]
          : [],
        productSource: productSrcRes.data
          ? [
              ...genOptionAll(productSrcRes.data),
              ...productSrcRes.data.map(item => ({
                value: item.sourceCode,
                label: item.description,
              })),
            ]
          : [],
      };

      yield put(actions.fetchFormDataSuccess(formData));

      const dt = formData;
      updatedFormValues = {
        ...formValues,
        org: dt.org && dt.org.length ? dt.org[0].value : '',
        productionRegion:
          dt.productionRegion && dt.productionRegion.length
            ? dt.productionRegion[0].value
            : '',
        farmNCC: dt.farmNCC && dt.farmNCC.length ? [dt.farmNCC[0].value] : [],
        productCat:
          dt.productCat && dt.productCat.length ? [dt.productCat[0].value] : [],
        productSource:
          dt.productSource && dt.productSource.length
            ? dt.productSource[0].value
            : '',
      };
    }

    yield put(actions.fetchTableData(updatedFormValues || formValues));
    // yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues: val } = action;

    const sortKeyMapping = {
      planningCode: 'planningCode',
      productSource: 'source',
      productionDate: 'dateProcess',
      productCode: 'productCode',
      batch: 'batch',
      uom: 'uom',
    };
    const sortKey = sortKeyMapping[val.sortKey] || '';
    const sortType =
      sortKey && val.sortType && val.sortType.toLowerCase() === 'desc'
        ? '-'
        : '';

    const queryParams = {
      plantCode: val.org !== 0 ? val.org : null,
      region: val.productionRegion !== 0 ? val.productionRegion : null,
      materialGroups: val.productCat[0] !== 0 ? val.productCat.join(',') : null,
      productCode: val.productCodeName,
      processDate: val.productionDate
        ? startOfDay(val.productionDate).toISOString()
        : null,
      farmSupplierCodes: val.farmNCC
        ? val.farmNCC.map(item => item.value).join(',')
        : null,
      source: val.productSource !== 0 ? val.productSource : null,
      batch: val.batch,
      uom: val.uom ? val.uom.value : null,

      pageIndex: val.pageIndex,
      pageSize: val.pageSize,
      sort: `${sortType}${sortKey}`,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được danh sách Phiếu Yêu Cầu Huỷ.',
      });
    }
    const formattedValue = value =>
      Number.isNaN(parseFloat(value)) || value === 0
        ? ''
        : formatToCurrency(value);
    const tableData = res.data.inventoryReportDetails.map(item => ({
      productionRegion: item.region,
      planningCode: item.planningCode,
      productSource: item.source,
      productionDate: item.dateProcess
        ? convertDateString(item.dateProcess)
        : '',
      plantName: item.plantName,
      plantCode: item.plantCode,
      farmSupplierName: item.farmSupplierName,
      farmSupplierCode: item.farmSupplierCode,
      productCat: item.materialGroup,
      productCode: item.productCode,
      productName: item.productName,
      batch: item.batch,
      uom: item.uom,

      /* Tồn đầu kỳ */
      tdkBTP: formattedValue(item.openingStockSemiProduct),
      tdkLoai1: formattedValue(item.openingStockProductType1),
      tdkLoai2: formattedValue(item.openingStockProductType2),

      /* Nhập mới trong ngày */
      nmtnBTP: formattedValue(item.importSemiProduct),
      nmtnBTPKTC: formattedValue(item.importSemiProductNoRef), //  BTP không tham chiếu
      nmtnLoai1: formattedValue(item.importProductType1),
      nmtnLoai2: formattedValue(item.importProductType2),

      /* Kết quả sơ chế */
      kqscXuatBTP: formattedValue(item.exportSemiProductProcessing),
      kqscLoai1: formattedValue(item.importProductType1Processing),
      kqscLoai2: formattedValue(item.importProductType2Processing),
      kqscPhePham: formattedValue(item.wasteQuantity),
      kqscTongLoai1: formattedValue(item.productType1),

      /* Kết quả xuất hàng */
      kqxhBTP: formattedValue(item.exportSemiProduct),
      kqxhLoai1: formattedValue(item.exportProductType1),
      kqxhLoai2: formattedValue(item.exportProductType2),

      /* Hàng hủy */
      hhBTP: formattedValue(item.exportCancelationSemiProduct),
      hhLoai1: formattedValue(item.exportCancelationProductType1),
      hhLoai2: formattedValue(item.exportCancelationProductType2),

      /* Tồn kho */
      tkBTP: formattedValue(item.closingStockSemiProduct),
      tkLoai1: formattedValue(item.closingStockProductType1),
      tkLoai2: formattedValue(item.closingStockProductType2),

      /* Tỉ lệ thu hồi */
      tlthDinhMuc: item.planReceiveRatio,
      tlthThucTe: item.realReceiveRatio,
    }));

    // Insert total data as last row

    let totalRowData = {};
    if (res.data.inventoryReportDetails.length > 0) {
      totalRowData = {
        totalCol: true,
        uom: 'Tổng',

        /* Tồn đầu kỳ */
        tdkBTP: formattedValue(res.data.openingStockSemiProductTotal),
        tdkLoai1: formattedValue(res.data.openingStockProductType1Total),
        tdkLoai2: formattedValue(res.data.openingStockProductType2Total),

        /* Nhập mới trong ngày */
        nmtnBTP: formattedValue(res.data.importSemiProductTotal),
        nmtnBTPKTC: formattedValue(res.data.importSemiProductNoRefTotal), // BTP không tham chiếu
        nmtnLoai1: formattedValue(res.data.importProductType1Total),
        nmtnLoai2: formattedValue(res.data.importProductType2Total),

        /* Kết quả sơ chế */
        kqscXuatBTP: formattedValue(res.data.exportSemiProductProcessingTotal),
        kqscLoai1: formattedValue(res.data.importProductType1ProcessingTotal),
        kqscLoai2: formattedValue(res.data.importProductType2ProcessingTotal),
        kqscPhePham: formattedValue(res.data.wasteQuantityTotal),
        kqscTongLoai1: formattedValue(res.data.productType1Total),

        /* Kết quả xuất hàng */
        kqxhBTP: formattedValue(res.data.exportSemiProductTotal),
        kqxhLoai1: formattedValue(res.data.exportProductType1Total),
        kqxhLoai2: formattedValue(res.data.exportProductType2Total),

        /* Hàng hủy */
        hhBTP: formattedValue(res.data.exportCancelationSemiProductTotal),
        hhLoai1: formattedValue(res.data.exportCancelationProductType1Total),
        hhLoai2: formattedValue(res.data.exportCancelationProductType2Total),

        /* Tồn kho cuối kỳ */
        tkBTP: formattedValue(res.data.closingStockSemiProductTotal),
        tkLoai1: formattedValue(res.data.closingStockProductType1Total),
        tkLoai2: formattedValue(res.data.closingStockProductType2Total),
      };
    }

    val.count = res.meta.count;

    yield put(actions.fetchTableDataSuccess(val, tableData, totalRowData));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchUOMAutocompleteSaga(action) {
  try {
    const { inputText, callback } = action;

    const res = yield call(
      request,
      `${APIs.getUomAutocomplete}?key=${inputText}&pageSize=100`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (!res.data) {
      throw Object({ message: res.message || 'Không tải được đơn vị tính' });
    }

    // limit result to 100
    if (res.data.length > 100) {
      res.data = res.data.slice(0, 100);
    }

    const mappedData = res.data.map(item => ({
      value: item.intMeasUnit,
      label: `${item.intMeasUnit} ${
        item.measUnitText ? `(${item.measUnitText})` : ''
      }`,
    }));

    yield callback(mappedData);
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchFarmNCCAutocompleteSaga(action) {
  try {
    const { inputText, callback } = action;

    const [plantRes, supplierRes] = yield all([
      call(
        request,
        `${APIs.getPlantsAutocomplete}?search=${inputText}&pageSize=100`,
        optionReq({ method: 'GET', authReq: true }),
      ),
      call(
        request,
        `${APIs.getSuppliersAutocomplete}?search=${inputText}&pageSize=100`,
        optionReq({ method: 'GET', authReq: true }),
      ),
    ]);

    if (!plantRes.data) {
      throw Object({ message: plantRes.message || 'Không tải được Farm' });
    }

    let mappedData = [
      ...plantRes.data.map(item => ({
        value: item.plantCode,
        label: `${item.plantCode} ${item.plantName}`,
      })),
      ...supplierRes.data.map(item => ({
        value: item.supplierCode,
        label: `${item.supplierCode} ${item.name1}`,
      })),
    ];

    // limit result to 100
    if (mappedData.length > 100) {
      mappedData = mappedData.slice(0, 100);
    }

    yield callback(mappedData);
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportReportSaga(action) {
  try {
    yield put(setLoading());
    const { formValues: val } = action;

    const sortKeyMapping = {
      planningCode: 'planningCode',
      productSource: 'source',
      productionDate: 'dateProcess',
      productCode: 'productCode',
      batch: 'batch',
      uom: 'uom',
    };
    const sortKey = sortKeyMapping[val.sortKey] || '';
    const sortType =
      sortKey && val.sortType && val.sortType.toLowerCase() === 'desc'
        ? '-'
        : '';

    const queryParams = {
      plantCode: val.org !== 0 ? val.org : null,
      region: val.productionRegion !== 0 ? val.productionRegion : null,
      materialGroups: val.productCat[0] !== 0 ? val.productCat.join(',') : null,
      productCode: val.productCodeName,
      processDate: val.productionDate
        ? startOfDay(val.productionDate).toISOString()
        : null,
      farmSupplierCodes: val.farmNCC
        ? val.farmNCC.map(item => item.value).join(',')
        : null,
      source: val.productSource !== 0 ? val.productSource : null,
      batch: val.batch,
      uom: val.uom ? val.uom.value : null,
      sort: `${sortType}${sortKey}`,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getExportExcel}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
      makeSaveFileFunc(),
    );

    if (res.statusCode && res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Xuất báo cáo không thành công.',
      });
    }

    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLeading(constants.FETCH_UOM_AC, fetchUOMAutocompleteSaga);
  yield takeLeading(constants.FETCH_FARM_NCC_AC, fetchFarmNCCAutocompleteSaga);
  yield takeLeading(constants.EXPORT_REPORT, exportReportSaga);
}
