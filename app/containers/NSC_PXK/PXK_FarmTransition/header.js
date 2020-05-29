import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import { transformAsyncOptions } from 'utils/transformUtils';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import InputEditor from 'components/MuiInput/Editor';
import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';
import { productSchema } from './Schema';
import ActionsRenderer from './ActionsRenderer';
import { STATUS_PXK } from '../PXK/constants';
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
      [`basketShortName${basketOrder}`]: option ? option.basketName : null,
      [`basketUoM${basketOrder}`]: option ? option.uoM : null,
    };
    context.props.updateFieldArrayValue('detailsCommands', rowIndex, nextData);
  },
});

export const basketNameEditable = params => {
  const {
    data: { isEnterQuantity },
    context: {
      props: { form },
    },
  } = params;

  return (
    params.data.productCode &&
    isEnterQuantity &&
    ![TYPE_FORM.VIEW].includes(form)
  );
};

export const basketEditable = params => {
  const {
    data: { isEnterQuantity },
    context: {
      props: { form },
    },
  } = params;

  const basketOrder = getBasketOrder(params.colDef.field);
  return (
    params.data[`basketShortName${basketOrder}`] &&
    isEnterQuantity &&
    ![TYPE_FORM.VIEW].includes(form)
  );
};

export const orderNumberRenderer = params =>
  params.data.totalCol ? '' : params.rowIndex + 1;

// comment to rebuild
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
    editable: params => params.data.isNotSaved,
    field: 'locatorName',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex }) => ({
      options: context.props.warehouse,
      onChange: option => {
        if (option !== null) {
          const updaterData = {
            ...productSchema.cast(option || undefined),
          };
          context.props.formik.updateFieldArrayValue(
            'detailsCommands',
            rowIndex,
            {
              ...updaterData,
              isNotSaved: true,
              locatorName: option.label,
              locatorId: option.value,
              productCode: '',
              productName: '',
              slotCode: '',
              uom: '',
              basketName1: '',
              basketName2: '',
              basketName3: '',
              basketQuantity1: null,
              basketQuantity2: null,
              basketQuantity3: null,
              isEnterQuantity: false,
            },
          );
        }
      },
      isSearchable: true,
    }),
    width: 40,
    cellClass: 'highlight-cell',
  },
  productCode: {
    headerName: 'Mã Sản Phẩm*',
    field: 'productCode',
    width: 50,
    editable: params => params.data.locatorId && params.data.isNotSaved,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, data }) => ({
      valueKey: 'productCode',
      labelKey: 'productCode',
      sublabelKey: 'viewAutoComplete',
      isClearable: true,
      promiseOptions: (inputText, callback) => {
        context.props.getProducts(inputText, callback, data.locatorId);
      },
      onChange: option => {
        if (option !== null) {
          const { batchs } = option;
          const { batch, inventoryQuantity, uom } = batchs[0];
          const newValue = {
            ...option,
            slotCode: batch,
            inventoryQuantity,
            uom,
            isEnterQuantity: true,
          };
          delete newValue.batchs;
          const updaterData = {
            ...productSchema.cast(newValue || undefined),
          };
          updaterData.processingType = 2000;
          updaterData.processingTypeName = 'Sơ Chế';

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
  slotCode: {
    headerName: 'Batch',
    editable: ({
      data: { locatorId, productCode },
      context: {
        props: { form },
      },
    }) => locatorId && productCode && ![TYPE_FORM.VIEW].includes(form),
    tooltipField: 'slotCode',
    field: 'slotCode',
    width: 50,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ data, context, rowIndex }) => ({
      valueKey: 'batch',
      labelKey: 'batch',
      sublabelKey: 'viewAutoComplete',
      promiseOptions: (inputText, callback) => {
        context.props.onGetBatchAuto(
          { locatorId: data.locatorId, productCode: data.productCode },
          inputText,
          callback,
        );
      },
      onChange: option => {
        const updaterData = {
          slotCode: option.batch,
          uom: option.uom,
          inventoryQuantity: option.inventoryQuantity,
        };
        context.props.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          updaterData,
        );
      },
    }),
  },
  processingTypeName: {
    headerName: 'Phân Loại Xử Lý*',
    field: 'processingTypeName',
    width: 40,
    editable: params => params.data.productCode && params.data.isNotSaved,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectInputEditor,
    cellEditorParams: ({ context, rowIndex, ...params }) => ({
      options: context.props.processingTypeOptions,
      valueKey: 'name',
      labelKey: 'name',
      isClearable: true,
      onChange: option => {
        const nextData = {
          ...params.data,
          processingType: option.id,
          processingTypeName: option.name,
        };
        context.props.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          nextData,
        );
      },
    }),
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
    editable: ({
      data: { isFromDeli, isEnterQuantity },
      context: {
        props: { form },
      },
    }) => (isFromDeli || isEnterQuantity) && ![TYPE_FORM.VIEW].includes(form),
    valueParser: decimalParser,
    cellEditorFramework: InputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, ...params }) => ({
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validDecimal,
        },
      },
      validBeforeChange: value => {
        if (value && value > params.data.inventoryQuantity) {
          context.props.onAlertInvalidWhenSubmit(
            'Số lượng xuất không được lớn hơn số lượng tồn',
          );
          return false;
        }
        return true;
      },
    }),
    maxWidth: 80,
    minWidth: 40,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
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
      basketShortName1: {
        headerName: 'Tên',
        field: 'basketShortName1',
        tooltipField: 'basketShortName1',
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
      basketShortName2: {
        headerName: 'Tên',
        field: 'basketShortName2',
        tooltipField: 'basketShortName2',
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
      basketShortName3: {
        headerName: 'Tên',
        field: 'basketShortName3',
        tooltipField: 'basketShortName3',
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
    cellRendererFramework: ActionsRenderer,
    suppressNavigable: true,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
});

export const defaultEditable = params => {
  const rowData = params.data;
  if (rowData.locatorId !== undefined && rowData.locatorId !== '') {
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
