import React from 'react';

import NumberFormat from 'react-number-format';
import { validDecimal } from 'components/NumberFormatter/utils';
import {
  getColumnDefs,
  transformAsyncOptionsWithParams,
} from 'utils/transformUtils';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import InputEditor from 'components/MuiInput/Editor';
import { orderNumberRenderer } from 'utils/index';
import ActionsRenderer from './ActionsRenderer';
import { productEmpty } from './Schema';
import { TYPE_FORM } from './Business';
import { STATUS_PXK } from './constants';

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

export const validNumber = value => {
  if (
    value.formattedValue === '' || // empty
    (!/^0./g.test(value.value) && // 0%, not 0*%
      value.floatValue >= 0)
  ) {
    return true;
  }
  return false;
};

export const NumberFormatter = ({ inputRef, onChange, ...props }) => (
  <NumberFormat
    isAllowed={validNumber}
    {...props}
    getInputRef={inputRef}
    onValueChange={values => {
      onChange({
        target: {
          name: props.name,
          value: values.value !== '' ? values.floatValue : '',
        },
      });
    }}
  />
);

export const batchEditable = params => {
  const {
    data: { locatorNameFrom, productCode },
    context: {
      props: { form },
    },
  } = params;
  return locatorNameFrom && productCode && form !== TYPE_FORM.VIEW;
};

export const columns = formik => ({
  stt: {
    headerName: 'STT',
    width: 60,
    editable: false,
    cellRenderer: orderNumberRenderer,
    suppressSizeToFit: true,
  },
  locatorNameFrom: {
    headerName: 'Kho Nguồn',
    field: 'locatorNameFrom',
    tooltipField: 'locatorNameFrom',
    editable: params => params.data.isNotSaved,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex }) => ({
      options: context.props.warehouse,
      onChange: option => {
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          {
            ...productEmpty,
            locatorNameFrom: option.label,
            locatorIdFrom: option.value,
          },
        );
      },
      isSearchable: true,
    }),
  },
  productCode: {
    headerName: 'Mã Sản Phẩm*',
    field: 'productCode',
    width: 150,
    tooltipField: 'productCode',
    editable: ({ data: { locatorNameFrom, isNotSaved } }) =>
      locatorNameFrom && isNotSaved,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, ...params }) => ({
      labelKey: 'productCode',
      sublabelKey: 'productName',
      valueKey: 'productCode',
      isClearable: true,
      isSearchable: true,
      promiseOptions: transformAsyncOptionsWithParams(
        context.props.onGetProducts,
        {
          url: `inventories/get-product-autocomplete?locatorId=${
            params.data.locatorIdFrom
          }`,
        },
        null,
      ),
      onChange: option => {
        if (option !== null) {
          const { batchs } = option;
          const { batch, inventoryQuantity, uom } = batchs[0];
          const updaterData = {
            ...option,
            slotCode: batch,
            inventoryQuantity,
            uom,
            exportedQuantity: 0,
          };
          context.props.formik.updateFieldArrayValue(
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
    minWidth: 150,
  },
  slotCode: {
    editable: batchEditable,
    headerName: 'Batch',
    field: 'slotCode',
    tooltipField: 'slotCode',
    width: 150,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ data, context, rowIndex }) => ({
      valueKey: 'batch',
      labelKey: 'batch',
      sublabelKey: 'viewAutoComplete',
      promiseOptions: (inputText, callback) => {
        context.props.onGetBatchAuto(
          { locatorId: data.locatorIdFrom, productCode: data.productCode },
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
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          updaterData,
        );
      },
    }),
  },
  locatorNameTo: {
    headerName: 'Kho Đích*',
    field: 'locatorNameTo',
    editable: params => params.data.isNotSaved,
    cellClass: 'highlight-cell',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex }) => ({
      options: context.props.warehouse,
      onChange: option => {
        context.props.formik.updateFieldArrayValue(
          'detailsCommands',
          rowIndex,
          {
            locatorNameTo: option.label,
            locatorIdTo: option.value,
          },
        );
      },
      isSearchable: true,
    }),
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  inventoryQuantity: {
    headerName: 'Số Lượng Tồn',
    hide: formik.values.status === STATUS_PXK.COMPLETE,
    field: 'inventoryQuantity',
    width: 150,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  exportedQuantity: {
    headerName: 'Số Lượng Xuất*',
    field: 'exportedQuantity',
    tooltipField: 'exportedQuantity',
    width: 150,
    editable: ({
      data: { isEnterQuantity },
      context: {
        props: { form },
      },
    }) => isEnterQuantity && ![TYPE_FORM.VIEW].includes(form),
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
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  uom: {
    headerName: 'Đơn Vị',
    field: 'uom',
    width: 150,
  },
  statusName: {
    headerName: 'Trạng Thái',
    field: 'statusName',
    tooltipField: 'statusName',
    width: 150,
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

export const columnDefs = formik => getColumnDefs(columns(formik), {});

export const defaultColDef = {
  editable: false,
  resizable: false,
  valueSetter: params => {
    if (
      ((params.colDef.field === 'locatorNameFrom' ||
        params.colDef.field === 'locatorNameTo') &&
        params.newValue === '') ||
      (params.colDef.field === 'exportedQuantity' &&
        params.newValue === 0 &&
        params.data.locatorNameFrom === null)
    ) {
      return false;
    }
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.formik.updateFieldArrayValue(
      'detailsCommands',
      params.node.rowIndex,
      updaterData,
    );

    return true;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
  cellRendererFramework: undefined,
};
