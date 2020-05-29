import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import {
  transformAsyncOptions,
  transformAsyncOptionsWithParams,
} from 'utils/transformUtils';
import CellRenderer from 'components/FormikUI/CellRenderer';
import {
  formatToNumber,
  formatToDecimal,
  formatToCurrency,
} from 'utils/numberUtils';
import InputEditor from 'components/MuiInput/Editor';
import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';
import { orderNumberRenderer } from 'utils/index';
import { productSchema } from './schema';
import ActionsRenderer from './ActionsRenderer';
import { STATUS_PRODUCT } from './constants';
import { STATUS_PXK } from '../PXK/constants';
export const getBasketOrder = text => text.replace(/\D/g, '') * 1;

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

export const calTotal = params => {
  const { data } = params;
  if (
    (data.exportedQuantity || data.exportedQuantity === 0) &&
    posNumberRgx.test(data.exportedQuantity) &&
    (data.unitPrice || data.unitPrice === 0) &&
    posNumberRgx.test(data.unitPrice)
  ) {
    return Number(
      parseFloat(data.exportedQuantity) * parseFloat(data.unitPrice),
    ).toFixed();
  }
  return null;
};

const posNumberRgx = /^\d+(\.\d+)?$/;
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

export const basketEditorParams = ({ context, rowIndex, ...params }) => ({
  valueKey: 'basketCode',
  labelKey: 'basketCode',
  sublabelKey: 'basketName',
  isClearable: true,
  promiseOptions: transformAsyncOptions(context.props.onGetBasketAuto, null),
  validBeforeChange: option => {
    if (option) {
      const basketOrder = getBasketOrder(params.colDef.field);

      const nextData = {
        ...params.data,
        [`basketCode${basketOrder}`]: option.basketCode,
      };

      if (
        (nextData.basketCode1 &&
          nextData.basketCode1 === nextData.basketCode2) ||
        (nextData.basketCode1 &&
          nextData.basketCode1 === nextData.basketCode3) ||
        (nextData.basketCode2 && nextData.basketCode2 === nextData.basketCode3)
      ) {
        context.props.onAlertInvalidWhenSubmit(
          'Loại khay sọt đã đươc lựa chọn',
        );
        return false;
      }
    }
    return true;
  },
  onChange: option => {
    const basketOrder = getBasketOrder(params.colDef.field);
    const nextData = {
      [`basketCode${basketOrder}`]: option ? option.basketCode : null,
      [`basketQuantity${basketOrder}`]: option ? 0 : null,
      [`basketShortName${basketOrder}`]: option ? option.basketName : null,
      [`basketUoM${basketOrder}`]: option ? option.uoM : null,
    };
    context.props.updateFieldArrayValue('detailsCommands', rowIndex, nextData);
  },
});

export const basketNameEditable = params => {
  const {
    data: { status },
    context: {
      props: { form },
    },
  } = params;
  return (
    params.data.productCode &&
    // eslint-disable-next-line eqeqeq
    (status !== STATUS_PRODUCT.NOT_SCALE_YET ||
      // eslint-disable-next-line eqeqeq
      status !== STATUS_PRODUCT.NO_SCALE) &&
    ![TYPE_FORM.VIEW].includes(form)
  );
};

export const basketEditable = params => {
  const {
    // data: { isEnterQuantity },
    context: {
      props: { form },
    },
  } = params;

  const basketOrder = getBasketOrder(params.colDef.field);
  return (
    params.data[`basketShortName${basketOrder}`] &&
    // isEnterQuantity &&
    ![TYPE_FORM.VIEW].includes(form)
  );
};

export const locatorEditable = params => {
  const {
    data: { isNotSaved },
  } = params;
  return isNotSaved;
};

export const productEditable = params =>
  locatorEditable(params) && params.data.locatorName;

export const batchEditable = params => {
  const {
    data: { locatorName, productCode },
    context: {
      props: { form },
    },
  } = params;
  return locatorName && productCode && form !== TYPE_FORM.VIEW;
};

export const columns = formik => ({
  stt: {
    headerName: 'STT',
    field: 'stt',
    width: 40,
    suppressNavigable: true,
    editable: false,
    cellRendererFramework: orderNumberRenderer,
    suppressSizeToFit: true,
  },
  locatorName: {
    headerName: 'Kho Xuất',
    tooltipField: 'locatorName',
    field: 'locatorName',
    width: 40,
    editable: locatorEditable,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex }) => ({
      options: context.props.warehouse,
      onChange: option => {
        const updaterData = {
          ...productSchema.cast(option || undefined),
        };
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          {
            ...updaterData,
            locatorName: option.label,
            locatorId: option.value,
            productCode: '',
            productName: '',
            slotCode: '',
            uom: '',
            basketShortName1: '',
            basketShortName2: '',
            basketShortName3: '',
            basketQuantity1: null,
            basketQuantity2: null,
            basketQuantity3: null,
          },
        );
      },
      isSearchable: true,
    }),
  },
  productCode: {
    headerName: 'Mã Sản Phẩm*',
    field: 'productCode',
    width: 50,
    editable: productEditable,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, ...params }) => ({
      valueKey: 'productCode',
      labelKey: 'productCode',
      sublabelKey: 'productName',
      isClearable: true,
      promiseOptions: transformAsyncOptionsWithParams(
        context.props.sync,
        {
          url: `exportedstockreceipts/exported-retail-product-locators?locatorId=${
            params.data.locatorId
          }&plantCode=${context.props.values.deliverCode.value}`,
        },
        null,
      ),
      onChange: option => {
        if (option !== null) {
          const { productCode, productName, uom, listBatch } = option;
          const newValue = {
            productCode,
            productName,
            uom,
          };

          const updaterData = {
            ...productSchema.cast(newValue || undefined),
          };
          updaterData.isNotSaved = true;
          updaterData.exportedQuantity = 0;
          updaterData.retailTypeName = 'Khác';
          updaterData.retailTypeCode = 'L99';
          updaterData.packingStyleName = 'Không yêu cầu';
          updaterData.packingStyleCode = 'M00';
          updaterData.slotCode = '';
          if (listBatch.length > 0) {
            updaterData.slotCode = listBatch[0].slotCode;
            updaterData.regionCode = listBatch[0].regionCode;
            updaterData.inventoryQuantity = listBatch[0].inventoryQuantity;
          }
          context.props.updateFieldArrayValue(
            'detailsCommands',
            rowIndex,
            updaterData,
          );
        }
      },
    }),
  },
  productName: {
    headerName: 'Tên Sản Phẩm',
    field: 'productName',
    tooltipField: 'productName',
    editable: false,
    width: 60,
  },
  slotCode: {
    headerName: 'Batch',
    editable: batchEditable,
    tooltipField: 'slotCode',
    field: 'slotCode',
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, ...params }) => ({
      valueKey: 'slotCode',
      labelKey: 'slotCode',
      sublabelKey: 'inventoryQuantity',
      isClearable: true,
      promiseOptions: transformAsyncOptionsWithParams(
        context.props.sync,
        {
          url: `inventories/get-batch-autocomplete-retail?locatorId=${
            params.data.locatorId
          }&productCode=${params.data.productCode}`,
        },
        null,
      ),
      onChange: option => {
        if (option !== null) {
          const updaterData = {
            ...productSchema.cast(option || undefined),
          };
          updaterData.exportedQuantity = 0;
          context.props.updateFieldArrayValue(
            'detailsCommands',
            rowIndex,
            updaterData,
          );
        }
      },
    }),
    width: 50,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  quantity: {
    headerName: 'SL Tồn',
    field: 'inventoryQuantity',
    hide: formik.values.status === STATUS_PXK.COMPLETE,
    tooltipField: 'inventoryQuantity',
    editable: false,
    width: 30,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  exportedQuantity: {
    headerName: 'SL Xuất*',
    field: 'exportedQuantity',
    tooltipField: 'exportedQuantity',
    editable: batchEditable,
    valueParser: decimalParser,
    cellEditorFramework: InputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validDecimal,
        },
      },
    },
    width: 40,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  uom: {
    headerName: 'Đơn Vị',
    field: 'uom',
    editable: false,
    tooltipField: 'uom',
    width: 30,
  },
  unitPrice: {
    headerName: 'Đơn Giá',
    valueFormatter: numberCurrency,
    field: 'unitPrice',
    tooltipField: 'unitPrice',
    width: 35,
    editable: batchEditable,
    cellEditorFramework: InputEditor,
    valueSetter: params => {
      let newValue = parseFloat(params.newValue.replace(/[^0-9.-]+/g, ''));
      if (Number.isNaN(newValue)) {
        newValue = 0;
      }
      const updaterData = {
        ...params.data,
        [params.colDef.field]: newValue,
      };
      params.context.props.updateFieldArrayValue(
        'detailsCommands',
        params.node.rowIndex,
        updaterData,
      );
      return true;
    },
  },
  total: {
    headerName: 'Thành Tiền',
    // tooltipValueGetter: calTotal,
    // valueFormatter: numberCurrency,
    field: 'total',
    editable: false,
    width: 40,
    valueGetter: params =>
      params.data.totalCol
        ? params.data.total
        : formatToCurrency(calTotal(params)),
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  packingStyleName: {
    field: 'packingStyleName',
    tooltipField: 'packingStyleName',
    headerName: 'Qui Cách Đóng Gói',
    editable: batchEditable,
    width: 40,
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, data }) => ({
      options: context.props.packingStyles,
      onChange: option => {
        const updaterData = {
          ...data,
          packingStyleName: option.label,
          packingStyleCode: option.value,
        };
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          updaterData,
        );
      },
    }),
  },
  retailTypeName: {
    field: 'retailTypeName',
    headerName: 'Loại Hàng Xá',
    tooltipField: 'retailTypeName',
    editable: batchEditable,
    width: 40,
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, data }) => ({
      options: context.props.retailTypes,
      onChange: option => {
        const updaterData = {
          ...data,
          retailTypeName: option.label,
          retailTypeCode: option.value,
        };
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          updaterData,
        );
      },
    }),
  },
  baskets: {
    headerName: 'Thông Tin Khay Sọt',
    group: {
      basketShortName1: {
        headerName: 'Tên',
        field: 'basketShortName1',
        tooltipField: 'basketShortName1',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        width: 40,
      },
      basketQuantity1: {
        headerName: 'SL',
        editable: basketEditable,
        field: 'basketQuantity1',
        valueParser: decimalParser,
        cellEditorFramework: InputEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validDecimal,
            },
          },
        },

        width: 40,
        suppressSizeToFit: true,
      },
      basketShortName2: {
        headerName: 'Tên',
        field: 'basketShortName2',
        tooltipField: 'basketShortName2',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        width: 40,
      },
      basketQuantity2: {
        headerName: 'SL',
        editable: basketEditable,
        field: 'basketQuantity2',
        valueParser: decimalParser,
        suppressSizeToFit: true,
        cellEditorFramework: InputEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validDecimal,
            },
          },
        },
        width: 40,
      },
      basketShortName3: {
        headerName: 'Tên',
        field: 'basketShortName3',
        tooltipField: 'basketShortName3',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        width: 40,
      },
      basketQuantity3: {
        headerName: 'SL',
        editable: basketEditable,
        valueParser: decimalParser,
        field: 'basketQuantity3',
        suppressSizeToFit: true,
        cellEditorFramework: InputEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validDecimal,
            },
          },
        },
        width: 40,
      },
    },
  },
  statusName: {
    headerName: 'Trạng Thái',
    field: 'statusName',
    tooltipField: 'statusName',
    editable: false,
    width: 45,
  },
  actions: {
    headerName: '',
    field: 'actions',
    width: 60,
    cellClass: 'cell-action-butons',
    editable: false,
    cellRendererFramework: ActionsRenderer,
    suppressNavigable: true,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
});

export const defaultEditable = params => {
  const rowData = params.data;
  if (rowData.productCode !== undefined && rowData.productCode !== '') {
    return true;
  }
  return false;
};

export const defaultColDef = {
  editable: defaultEditable,
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };
    if (updaterData.locatorName === '') {
      return false;
    }

    params.context.props.updateFieldArrayValue(
      'detailsCommands',
      params.node.rowIndex,
      updaterData,
    );
    return true;
  },
};
