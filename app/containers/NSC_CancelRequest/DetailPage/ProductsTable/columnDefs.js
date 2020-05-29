/* eslint-disable indent */
import { formatToCurrency } from 'utils/numberUtils';
import MuiSelectEditor from '../../../../components/MuiSelect/Editor';
// import CellRenderer from '../../../../components/FormikUI/CellRenderer';
import CellRenderer from './CustomCellRenderer';
import CustomCellEditor from './CustomCellEditor';
import CustomSelectCellEditor from './CustomSelectCellEditor';
import ImageUploadCellRenderer from './ImageUploadCellRenderer';
import appTheme from '../../../App/theme';
import ActionsRenderer from './ActionsRenderer';
import { getNested } from '../../../App/utils';
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

// positive float number regex
const posNumberRgx = /^\d+(\.\d+)?$/;

const makeEditableCellStyle = props => ({
  background: appTheme.palette.background.default,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  ...(props.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {}),
});

const makeDefaultCellStyle = props =>
  getNested(props, 'data', 'isDeleted')
    ? {
        textDecoration: 'line-through',
      }
    : {};

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

export const makeDefaultColDef = () => ({
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: CustomCellEditor,
  cellRendererFramework: undefined,
  cellStyle: makeDefaultCellStyle,
});

export const makeColumnDefs = (
  pageType,
  receiptData,
  openDialogDelete,
  openImagePopup,
) => [
  {
    headerName: 'STT',
    field: 'stt',
    cellRenderer: ({ rowIndex }) => rowIndex + 1,
    width: 40,
    suppressSizeToFit: true,
  },
  {
    headerName: 'Mã sản phẩm',
    field: 'productCode',
    editable: props =>
      pageType.create ||
      (pageType.edit &&
        receiptData.isEditable &&
        !props.data.isLoadedFromServer),
    cellStyle: props =>
      pageType.create ||
      (pageType.edit &&
        receiptData.isEditable &&
        !props.data.isLoadedFromServer)
        ? makeEditableCellStyle(props)
        : makeDefaultCellStyle(props),
    cellRendererFramework: CellRenderer,
    suppressSizeToFit: true,
    width: 80,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ context, rowIndex }) => ({
      promiseOptions: (inputValue, callback) =>
        context.props.onFetchProductAutocomplete(
          context.props.formik.values.org, // selected orgCode
          inputValue,
          callback,
        ),
      onChange: selected => {
        const productData = {
          productCode: selected.value,
          slotCode: selected.slotCode,
          locatorId: selected.locatorId,
          productName: selected.productName,
          batch: selected.slotCode,
          sloc: selected.locatorName,
          quantity: selected.inventoryQuantity,
          unitPrice: selected.unitPrice,
          estValue: selected.inventoryQuantity * selected.unitPrice,
        };

        // // set estValue
        // let estValue;
        // if (data.unitPrice && posNumberRgx.test(data.unitPrice)) {
        //   estValue =
        //     parseFloat(data.unitPrice) * parseFloat(productData.quantity);

        //   if (estValue || estValue === 0) {
        //     productData.estValue = estValue.toString();
        //   }
        // }

        context.props.formik.updateFieldArrayValue(
          'products',
          rowIndex,
          productData,
        );
      },
      parseValue: value => value || undefined,
    }),
  },
  {
    headerName: 'Tên sản phẩm',
    field: 'productName',
    cellRendererFramework: CellRenderer,
    // suppressSizeToFit: true,
    // width: 60,
  },
  {
    headerName: 'Batch',
    field: 'batch',
    suppressSizeToFit: true,
    width: 90,
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Kho nguồn',
    field: 'sloc',
    suppressSizeToFit: true,
    width: 90,
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Tổng lượng hủy',
    field: 'quantity',
    suppressSizeToFit: true,
    resizable: false,
    width: 60,
    headerClass: 'ag-numeric-header ag-header-required',
    editable: props =>
      !!(
        pageType.create ||
        (pageType.edit &&
          receiptData.isEditable &&
          !props.data.isLoadedFromServer)
      ),
    cellStyle: props =>
      pageType.create ||
      (pageType.edit &&
        receiptData.isEditable &&
        !props.data.isLoadedFromServer)
        ? { ...makeEditableCellStyle(props), ...alignRight }
        : { ...makeDefaultCellStyle(props), ...alignRight },
    cellRendererFramework: CellRenderer,
    valueFormatter: numberCurrency,
    valueSetter: params => {
      const { data, node, newValue, context } = params;

      if (posNumberRgx.test(newValue)) {
        const updatedValues = {
          quantity: newValue,
        };

        // set estValue cell newValue
        let estValue;
        if (data.unitPrice && posNumberRgx.test(data.unitPrice)) {
          estValue = parseFloat(data.unitPrice) * parseFloat(newValue);

          if (estValue || estValue === 0) {
            updatedValues.estValue = estValue.toString();
          }
        }

        context.props.formik.updateFieldArrayValue(
          'products',
          node.rowIndex,
          updatedValues,
        );
      } else {
        context.props.formik.updateFieldArrayValue('products', node.rowIndex, {
          quantity: null,
          estValue: '',
        });
      }

      return true;
    },
  },
  {
    headerName: 'Đơn giá',
    suppressSizeToFit: true,
    valueFormatter: numberCurrency,
    field: 'unitPrice',
    resizable: false,
    width: 80,
    headerClass: 'ag-numeric-header ag-header-required',
    editable: ({ data }) =>
      (pageType.create || pageType.edit) && !data.isDeleted,
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? { ...makeEditableCellStyle(params), ...alignRight }
        : { ...makeDefaultCellStyle(params), ...alignRight },
    cellRendererFramework: CellRenderer,
    valueSetter: params => {
      const { data, node, newValue, context } = params;

      if (posNumberRgx.test(newValue)) {
        // set current cell newValue
        const updatedValues = {
          unitPrice: newValue,
        };

        // set estValue cell newValue
        let estValue;
        if (data.quantity && posNumberRgx.test(data.quantity)) {
          estValue = parseFloat(data.quantity) * parseFloat(newValue);

          if (estValue || estValue === 0) {
            updatedValues.estValue = estValue.toString();
          }
        }

        context.props.formik.updateFieldArrayValue(
          'products',
          node.rowIndex,
          updatedValues,
        );
      } else {
        context.props.formik.updateFieldArrayValue('products', node.rowIndex, {
          unitPrice: null,
          estValue: '',
        });
      }

      return true;
    },
  },
  {
    headerName: 'Ước tính giá trị',
    field: 'estValue',
    resizable: false,
    headerClass: 'ag-numeric-header ag-header-required',
    valueFormatter: numberCurrency,
    cellRendererFramework: CellRenderer,
    cellStyle: params => ({ ...makeDefaultCellStyle(params), ...alignRight }),
  },
  {
    headerName: 'Nguyên nhân hủy',
    field: 'cause',
    resizable: false,
    suppressSizeToFit: true,
    width: 120,
    headerClass: 'ag-header-required',
    editable: ({ data }) =>
      (pageType.create || pageType.edit) && !data.isDeleted,
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? makeEditableCellStyle(params)
        : makeDefaultCellStyle(params),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: CustomSelectCellEditor,
    cellEditorParams: ({ context, rowIndex }) => ({
      defaultOptions: true,
      isSearchable: true,
      valueKey: 'value',
      labelKey: 'label',
      options: context.props.selectBoxData.cause,
      onChange: selected => {
        const productData = {
          causeCode: selected.value,
          cause: selected.label,
        };

        context.props.formik.updateFieldArrayValue(
          'products',
          rowIndex,
          productData,
        );
      },
    }),
  },
  {
    headerName: 'Tình trạng SP trước khi hủy',
    field: 'productStatus',
    // suppressSizeToFit: true,
    // width: 60,
    headerClass: 'ag-header-required',
    editable: ({ data }) =>
      (pageType.create || pageType.edit) && !data.isDeleted,
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? makeEditableCellStyle(params)
        : makeDefaultCellStyle(params),
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Biện pháp khắc phục đã thực hiện',
    field: 'priorAction',
    // suppressSizeToFit: true,
    // width: 60,
    headerClass: 'ag-header-required',
    editable: ({ data }) =>
      (pageType.create || pageType.edit) && !data.isDeleted,
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? makeEditableCellStyle(params)
        : makeDefaultCellStyle(params),
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: 'Hình ảnh',
    field: 'images',
    // width: 60,
    // suppressSizeToFit: true,
    editable: false, // edit directly in the CellRenderer
    // headerClass: 'ag-header-required',
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? makeEditableCellStyle(params)
        : makeDefaultCellStyle(params),
    cellRendererFramework: ImageUploadCellRenderer,
    cellRendererParams: ({ context }) => ({
      formik: context.props.formik,
      pageType,
      openImagePopup,
    }),
  },
  {
    headerName: 'Ghi chú',
    field: 'note',
    suppressSizeToFit: true,
    width: 60,
    editable: ({ data }) =>
      (pageType.create || pageType.edit) && !data.isDeleted,
    cellStyle: params =>
      (pageType.create || pageType.edit) &&
      !getNested(params, 'data', 'isDeleted')
        ? makeEditableCellStyle(params)
        : makeDefaultCellStyle(params),
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: '',
    field: 'actions',
    width: 40,
    editable: false,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    cellRendererParams: {
      onOpenDialogDelete: agProps => openDialogDelete(agProps),
      pageType,
      receiptData,
    },
    suppressNavigable: true,
    suppressSizeToFit: true,
  },
];
