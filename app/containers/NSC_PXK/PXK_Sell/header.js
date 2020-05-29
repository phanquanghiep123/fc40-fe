import MuiSelectEditor from 'components/MuiSelect/Editor';
// import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import {
  transformAsyncOptions,
  transformAsyncOptionsWithParams,
} from 'utils/transformUtils';
import { orderNumberRenderer } from 'utils/index';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import InputEditor from 'components/MuiInput/Editor';
import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';
import { PRODUCT_STATUS } from 'containers/NSC_ImportedStockReceipt/WeightPage/constants';
import { productSchema } from './Schema';
import ActionsRenderer from './ActionsRenderer';
import MuiSelectInputEditor from '../../../components/MuiSelect/InputEditor';
import { STATUS_PXK } from '../PXK/constants';

function isViewForm(formType) {
  return formType === TYPE_FORM.VIEW;
}

export const getBasketOrder = text => text.replace(/\D/g, '') * 1;

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

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
      [`basketName${basketOrder}`]: option ? option.basketName : null,
      [`basketUoM${basketOrder}`]: option ? option.uoM : null,
    };
    context.props.updateFieldArrayValue('detailsCommands', rowIndex, nextData);
  },
});

export const basketNameEditable = params => {
  const {
    data: { isFromDeli, productCode, isTurnToScale },
    context: {
      props: { form },
    },
  } = params;
  return !isFromDeli && productCode && !isTurnToScale && !isViewForm(form);
};

export const basketEditable = params => {
  const {
    data: { isFromDeli, isTurnToScale },
    context: {
      props: { form },
    },
  } = params;

  const basketOrder = getBasketOrder(params.colDef.field);
  return (
    !isFromDeli &&
    params.data[`basketName${basketOrder}`] &&
    !isTurnToScale &&
    !isViewForm(form)
  );
};

export const locatorEditable = params => {
  const {
    data: { isNotSaved, isTurnToScale },
  } = params;
  return isNotSaved && !isTurnToScale;
};

export const productEditable = params =>
  locatorEditable(params) && params.data.locatorName;

export const batchEditable = params => {
  const {
    data: { locatorName, productCode, status, isTurnToScale },
    context: {
      props: { form },
    },
  } = params;
  return (
    locatorName &&
    productCode &&
    !isViewForm(form) &&
    status !== PRODUCT_STATUS.COMPLETED &&
    !isTurnToScale
  );
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
    headerName: 'Kho Nguồn',
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
            batch: '',
            uom: '',
            basketName1: '',
            basketName2: '',
            basketName3: '',
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
          url: `inventories/get-product-autocomplete?locatorId=${
            params.data.locatorId
          }`,
        },
        null,
      ),
      onChange: option => {
        if (option !== null) {
          const { productCode, productName, batchs } = option;
          const { batch, inventoryQuantity, uom } = batchs[0];
          const newValue = {
            productCode,
            productName,
            batch,
            inventoryQuantity,
            uom,
          };
          const updaterData = {
            ...productSchema.cast(newValue || undefined),
          };
          updaterData.isNotSaved = true;
          updaterData.exportedQuantity = 0;
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
  batch: {
    headerName: 'Batch',
    editable: batchEditable,
    tooltipField: 'batch',
    field: 'batch',
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, ...params }) => ({
      valueKey: 'batch',
      labelKey: 'batch',
      sublabelKey: 'inventoryQuantity',
      isClearable: true,
      promiseOptions: transformAsyncOptionsWithParams(
        context.props.sync,
        {
          url: `inventories/get-batch-autocomplete?locatorId=${
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
          updaterData.exportedQuantity = params.data.exportedQuantity || 0;
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
    headerName: 'Số Lượng Tồn',
    field: 'inventoryQuantity',
    tooltipField: 'inventoryQuantity',
    hide: formik.values.status === STATUS_PXK.COMPLETE,
    editable: false,
    maxWidth: 80,
    minWidth: 40,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  exportedQuantity: {
    headerName: 'Số Lượng Xuất*',
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
    maxWidth: 80,
    minWidth: 40,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    //
  },
  uom: {
    headerName: 'Đơn Vị',
    field: 'uom',
    editable: false,
    tooltipField: 'uom',
    width: 35,
  },
  baskets: {
    headerName: 'Thông Tin Khay Sọt',
    group: {
      basketName1: {
        headerName: 'Tên',
        field: 'basketName1',
        tooltipField: 'basketName1',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        minWidth: 50,
        maxWidth: 100,
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
      basketName2: {
        headerName: 'Tên',
        field: 'basketName2',
        tooltipField: 'basketName2',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        minWidth: 50,
        maxWidth: 100,
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
      basketName3: {
        headerName: 'Tên',
        field: 'basketName3',
        tooltipField: 'basketName3',
        editable: basketNameEditable,
        cellEditorFramework: MuiSelectEditor,
        cellRendererFramework: CellRenderer,
        cellEditorParams: basketEditorParams,
        minWidth: 50,
        maxWidth: 100,
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
