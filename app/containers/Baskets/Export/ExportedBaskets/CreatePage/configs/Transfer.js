import { find, isEmpty } from 'lodash';
import * as Yup from 'yup';
import MuiInputEditor from 'components/MuiInput/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import NumberFormatter from 'components/NumberFormatter';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { REFER_TYPE } from '../constants';
import ActionsRenderer from '../TableSection/ActionRenderer';
import appTheme from '../../../../../App/theme';
export const numericParser = params => {
  if (params.newValue === '0' || params.newValue === 0) {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberFormatter = params => formatToNumber(params.value) || '';
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;
export const colorStyle = data => {
  if (
    !Number.isNaN(data.doQuantity - data.deliveryQuantity, 0) &&
    data.doQuantity - data.deliveryQuantity > 0
  ) {
    return 'blue';
  }
  if (data.doQuantity - data.deliveryQuantity === 0) {
    return 'black';
  }
  return 'red';
};
const columnDefs = [
  {
    field: 'stt',
    headerName: 'STT',
    width: 50,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    field: 'locatorDeliverName',
    headerName: 'Kho nguồn',
    headerClass: 'ag-header-required',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    isSearchable: true,
    isClearable: true,
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    valueSetter: () => false,
    cellEditorParams: ({ node, context, data }) => ({
      options: context.props.formOption.basketLocators,
      valueKey: 'basketLocatorId',
      labelKey: 'basketLocatorName',
      sublabelKey: 'basketLocatorId',
      isClearable: true,
      isSearchable: true,
      validBeforeChange: option => {
        if (option === null) return false;
        const findResult = find(
          context.props.formik.values.basketDocumentDetails,
          {
            basketCode: data.basketCode,
            locatorDeliver: option.basketLocatorId,
          },
        );
        if (findResult !== undefined) {
          context.props.onShowWarning(
            'Khay sọt trong kho tương ứng đã được lựa chọn',
          );
          return false;
        }
        return true;
      },
      onChange: option => {
        const inputValue = data.basketCode;
        const updaterData = {
          locatorDeliver: option.basketLocatorId,
          locatorDeliverName: option.basketLocatorName,
          locatorType: option.locatorType,
        };
        context.props.onFetchAutocomplete({
          orgCode: context.props.formik.values.deliver.value, // selected orgCode
          inputValue,
          callback: fieldData => {
            if (fieldData.length > 0) {
              const newData = {
                ...data,
                ...updaterData,
                inventoryQuantity: fieldData[0].quantity,
              };
              context.props.onUpdateBasketDocumentDetails({
                index: node.rowIndex,
                data: newData,
              });
            } else {
              const newData = {
                ...data,
                ...updaterData,
                inventoryQuantity: 0,
              };
              context.props.onUpdateBasketDocumentDetails({
                index: node.rowIndex,
                data: newData,
              });
            }
          },
          basketLocatorId: option.basketLocatorId,
          date: context.props.formik.values.date,
          type: 'baskets',
        });
      },
    }),
    editable: ({ context, ...params }) => {
      if (params.data.totalCol) {
        return false;
      }
      return context.isEdit() || context.isCreate();
    },
  },
  {
    field: 'basketCode',
    headerName: 'Mã Khay Sọt',
    headerClass: 'ag-header-required',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    cellEditorParams: ({ context, rowIndex, data }) => ({
      validBeforeChange: option => {
        if (option === null) return false;
        const findResult = find(
          context.props.formik.values.basketDocumentDetails,
          {
            basketCode: option.value,
            locatorDeliver: data.locatorDeliver,
          },
        );
        if (findResult !== undefined) {
          context.props.onShowWarning(
            'Khay sọt trong kho tương ứng đã được lựa chọn',
          );
          return false;
        }
        return true;
      },
      promiseOptions: (inputValue, callback) => {
        context.props.onFetchAutocomplete({
          orgCode: context.props.formik.values.deliver.value, // selected orgCode
          inputValue,
          callback,
          basketLocatorId: data.locatorDeliver,
          date: context.props.formik.values.date,
          type: 'baskets',
        });
      },
      valueKey: 'value',
      labelKey: 'value',
      sublabelKey: 'label',
      isClearable: true,
      isSearchable: true,
      /*
      * data: {
            locatorDeliver: 'K20011000',
            locatorDeliverName: 'Kho tổng sử dụng',
            locatorType: 1,
            value: 'K0000002',
            name: 'Sọt nhỏ (1.66 KG)',
            label: 'K0000002 - Sọt nhỏ (1.66 KG)',
            quantity: 844,
            quantityVendor: null,
            uoM: 'CÁI'
        } */
      onChange: option => {
        const newData = {
          ...data,
          basketCode: option.value,
          basketName: option.name,
          inventoryQuantity: option.quantity,
          deliveryQuantity: null,
          uoM: option.uoM,
        };
        context.props.onUpdateBasketDocumentDetails({
          index: rowIndex,
          data: newData,
        });
      },
    }),
    valueSetter: () => false,
    editable: ({ data, context }) =>
      !isEmpty(data.locatorDeliver) && !context.isView(),
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'inventoryQuantity',
    headerName: 'Số Lượng Tồn',
    headerClass: 'ag-numeric-header',
    cellClass: 'ag-numeric-cell',
    width: 100,
    valueParser: numericParser,
    valueFormatter: numberCurrency,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
  },
  {
    field: 'deliveryQuantity',
    headerName: 'Số Lượng Xuất',
    headerClass: 'ag-numeric-header ag-header-required',
    cellClass: 'ag-numeric-cell',
    cellEditorFramework: MuiInputEditor,
    width: 100,
    cellRendererFramework: CellRenderer,
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    editable: ({ context, ...params }) => {
      if (params.data.totalCol) {
        return false;
      }
      return (
        !isEmpty(params.data.basketCode) &&
        (context.isEdit() || context.isCreate())
      );
    },
    valueParser: numericParser,
    valueFormatter: numberCurrency,
    cellEditorParams: ({ context, ...params }) => ({
      validBeforeChange: value => {
        if (value && value > params.data.inventoryQuantity) {
          context.props.onShowWarning(
            'Số lượng xuất không được lớn hơn số lượng tồn',
          );
          return false;
        }
        return true;
      },
      InputProps: {
        inputComponent: NumberFormatter,
      },
    }),
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
  },
  {
    width: 100,
    field: 'uoM',
    headerName: 'Đơn vị tính',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    cellEditorFramework: MuiInputEditor,
    tooltipField: 'note',
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    editable: ({ context, data }) => {
      if (data.totalCol) {
        return false;
      }
      return !context.isView() && !isEmpty(data.locatorDeliver);
    },
    cellEditorParams: {
      inputProps: { maxLength: 500 },
    },
  },
  {
    field: 'actions',
    headerName: '',
    width: 50,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
];
const columnDefsView = [...columnDefs];
columnDefsView.splice(4, 1);
columnDefsView.pop();
export const transferBasketConfig = {
  renderSuggest: false,
  renderMsgConfirm: false,
  renderMsgBBGH: true,
  addRow: isView => !isView,
  value: 22,
  titleSection2: () => `II. Thông Tin Khay Sọt Của BBGH`,
  section2Name: 'doExportStockReceiptBasketDto',
  titleSection3: (context, formik) =>
    `${
      context.isEdit() &&
      [REFER_TYPE.FROM_BBGH_BBGHNHH, REFER_TYPE.FROM_BBGHKS].includes(
        formik.values.referType,
      )
        ? 'III'
        : 'II'
    }. Thông Tin Khay Sọt`,
  renderSection2: (context, formik) =>
    context.isEdit() &&
    [REFER_TYPE.FROM_BBGH_BBGHNHH, REFER_TYPE.FROM_BBGHKS].includes(
      formik.values.referType,
    ),
  section2ColumnDefs: [
    {
      headerName: 'STT',
      field: 'stt',
      width: 45,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'SL từ BBGH',
      field: 'doQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold' },
      },
    },
    {
      field: 'deliveryQuantity',
      headerName: 'SL Xuất',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold' },
      },
    },
    {
      headerName: 'Chênh lệch BBGH/Xuất',
      field: 'diffQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      valueGetter: ({ data }) =>
        Number.isNaN(data.doQuantity - data.deliveryQuantity)
          ? 0
          : data.doQuantity - data.deliveryQuantity,
      cellStyle: ({ data }) => ({
        color: colorStyle(data),
        fontWeight: 'bold',
      }),
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold' },
      },
    },
    { headerName: 'Đơn vị tính', field: 'uoM' },
  ],
  columnDefs,
  columnDefsView,
  validSchema: Yup.object().shape({
    deliver: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    subType: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    receiver: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable()
      .when('deliver', (deliver, schema) => {
        if (deliver) {
          return schema.test(
            'deliver',
            'Đơn Vị Nhận Hàng không được trùng Đơn Vị Giao Hàng',
            receiver => {
              if (!receiver) {
                return false;
              }
              return receiver.value !== deliver.value;
            },
          );
        }
        return schema;
      }),
    note: Yup.string()
      .max(500, 'Ghi chú không được nhiều hơn 500 kí tự')
      .nullable(),
    basketDocumentDetails: Yup.array().of(
      Yup.object().shape({
        deliveryQuantity: Yup.number()
          .when('basketCode', (basketCode, schema) => {
            if (
              basketCode === null ||
              basketCode === undefined ||
              basketCode === ''
            )
              return schema.nullable();
            return schema
              .required('Trường Không Được Bỏ Trống')
              .nullable()
              .max(
                Yup.ref('inventoryQuantity'),
                'Số lượng xuất không được lớn hơn số lượng tồn',
              );
          })
          .when('basketCode', (basketCode, schema) => {
            if (
              basketCode === null ||
              basketCode === undefined ||
              basketCode === ''
            )
              return schema.nullable();
            return schema
              .required('Trường Không Được Bỏ Trống')
              .nullable()
              .min(1, 'Số Lượng Xuất phải lớn hơn 0')
              .max(
                Yup.ref('inventoryQuantity'),
                'Số lượng xuất không được lớn hơn số lượng tồn',
              );
          }),
      }),
    ),
  }),
};
