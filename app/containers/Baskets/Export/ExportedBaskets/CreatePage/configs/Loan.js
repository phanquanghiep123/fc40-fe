import * as Yup from 'yup';
import { find, isEmpty } from 'lodash';
import MuiInputEditor from 'components/MuiInput/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import NumberFormatter from 'components/NumberFormatter';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import ActionsRenderer from '../TableSection/ActionRenderer';
import { numberCurrency, numericParser } from './Transfer';
import './style.css';
import appTheme from '../../../../../App/theme';

export const colorStyle = data => {
  if (
    !Number.isNaN((data.doQuantity || 0) - (data.deliveryQuantity || 0), 0) &&
    (data.doQuantity || 0) - (data.deliveryQuantity || 0) > 0
  ) {
    return 'blue';
  }
  if ((data.doQuantity || 0) - (data.deliveryQuantity || 0) === 0) {
    return 'black';
  }
  return 'red';
};
// style cho chênh lệnh cho phần thông tin khay sọt
export const colorStyleDiff = data => {
  if (
    !Number.isNaN((data.deliveryQuantity || 0) - (data.quantityActual || 0)) &&
    (data.deliveryQuantity || 0) - (data.quantityActual || 0) > 0
  ) {
    return 'blue';
  }
  if ((data.deliveryQuantity || 0) - (data.quantityActual || 0) === 0) {
    return 'black';
  }
  return 'red';
};

const commonColumns = [
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
    cellStyle: ({ context }) => ({
      background:
        !context.isView() && !context.isConfirm()
          ? appTheme.palette.background.default
          : 'inherit',
    }),
  },
  {
    field: 'basketCode',
    headerName: 'Mã Khay Sọt',
    headerClass: 'ag-header-required',
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, data }) => ({
      validBeforeChange: option => {
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
        if (!context.props.formik.values.receiver) {
          context.props.onShowWarning('Cần nhập thông tin Đơn vị Nhận Hàng');
          return;
        }
        context.props.onFetchAutocomplete({
          orgCode: context.props.formik.values.deliver.value, // selected orgCode
          inputValue,
          callback,
          basketLocatorId: data.locatorDeliver,
          receiverCode: context.props.formik.values.receiver.value,
          receiverType: context.props.formik.values.receiver.type,
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
          deliveryQuantity: 0,
          uoM: option.uoM,
          netOff: option.netOff,
        };
        context.props.onFetchAutocomplete({
          orgCode: context.props.formik.values.deliver.value, // selected orgCode
          inputValue: option.value,
          callback: null,
          basketLocatorId: data.locatorDeliver,
          receiverCode: context.props.formik.values.receiver.value,
          receiverType: context.props.formik.values.receiver.type,
          date: context.props.formik.values.date,
          type: 'baskets',
        });
        context.props.onUpdateBasketDocumentDetails({
          index: rowIndex,
          data: newData,
        });
      },
    }),
    valueSetter: () => false,
    editable: ({ data, context }) =>
      !isEmpty(data.locatorDeliver) && !context.isView(),
    cellStyle: ({ context }) => ({
      background:
        !context.isView() && !context.isConfirm()
          ? appTheme.palette.background.default
          : 'inherit',
    }),
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'inventoryQuantity',
    headerName: 'SL tồn',
    valueFormatter: numberCurrency,
    headerClass: 'ag-numeric-header',
    cellClass: 'ag-numeric-cell',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
  },
  {
    headerName: 'SL Xuất',
    field: 'deliveryQuantity',
    headerClass: 'ag-numeric-header ag-header-required',
    cellClass: 'ag-numeric-cell',
    width: 160,
    cellEditorFramework: MuiInputEditor,
    cellRendererFramework: CellRenderer,
    editable: ({ context, ...params }) => {
      if (params.data.totalCol) {
        return false;
      }
      return context.isEdit() || context.isCreate();
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
    cellStyle: ({ context }) => ({
      background:
        !context.isView() && !context.isConfirm()
          ? appTheme.palette.background.default
          : 'inherit',
    }),
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
  },
  {
    headerName: 'SL Xác Nhận',
    field: 'quantityActual',
    headerClass: 'ag-numeric-header',
    cellClass: 'pm-grid-number-cell',
    width: 160,
    cellStyle: ({ context }) => ({
      textAlign: 'right',
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    editable: ({ context, ...params }) => {
      if (params.data.totalCol) {
        return false;
      }
      return context.isConfirm();
    },
    cellEditorFramework: MuiInputEditor,
    cellRendererFramework: CellRenderer,
    valueParser: numericParser,
    valueFormatter: numberCurrency,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
    cellEditorParams: () => ({
      InputProps: {
        inputComponent: NumberFormatter,
      },
    }),
  },
  {
    field: 'chenhlech',
    headerName: 'SL Chênh Lệch (Xuất/Nhập)',
    cellRendererFramework: CellRenderer,
    valueParser: numericParser,
    valueFormatter: numberCurrency,
    headerClass: 'ag-numeric-header header-right',
    cellClass: 'pm-grid-number-cell',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    valueGetter: ({ data }) =>
      Number.isNaN((data.deliveryQuantity || 0) - (data.quantityActual || 0))
        ? 0
        : (data.deliveryQuantity || 0) - (data.quantityActual || 0),
    cellStyle: ({ data }) => ({
      color: colorStyleDiff(data),
      fontWeight: 'bold',
      textAlign: 'right',
    }),
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
      style: { fontWeight: 'bold' },
    },
  },
  {
    field: 'uoM',
    headerName: 'Đơn vị tính',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    cellEditorFramework: MuiInputEditor,
    tooltipField: 'note',
    editable: ({ context, data }) => {
      if (data.totalCol) {
        return false;
      }
      return !context.isView() && !isEmpty(data.locatorDeliver);
    },
    cellEditorParams: {
      inputProps: { maxLength: 500 },
    },
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
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
const columnDefsConfirm = [...commonColumns];
const columnDefs = [...commonColumns];
const columnDefsView = [...commonColumns];
columnDefs.splice(6, 1);
columnDefs.splice(6, 1);
columnDefsView.splice(4, 1);
// columnDefsView.splice(6, 1);
columnDefsView.pop();
columnDefsConfirm.splice(4, 1);
columnDefsConfirm.pop();
export const loanBasketConfig = {
  renderMsgConfirm: true,
  renderDateApprove: true,
  renderMsgCheckboxLoan: true,
  renderSection2: context => !context.isView() && !context.isConfirm(),
  addRow: (isView, isConfirm) => !isView && !isConfirm,
  value: 23,
  titleSection2: () => `II. Thông Tin Khay Sọt Phiếu Xuất Bán`,
  titleSection3: context =>
    `${
      !context.isView() && !context.isConfirm() ? 'III' : 'II'
    }. Thông Tin Khay Sọt`,
  section2ColumnDefs: [
    {
      headerName: 'STT',
      field: 'stt',
      width: 45,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    { headerName: 'Mã Khay Sọt', field: 'basketCode' },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Net Off',
      field: 'netOff',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'SL từ PXB',
      field: 'doQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold' },
      },
    },
    {
      field: 'deliveryQuantity',
      headerName: 'SL Xuất',
      cellClass: 'ag-numeric-cell',
      headerClass: 'ag-numeric-header',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold' },
      },
    },
    {
      headerName: 'Chênh lệch PXB/Xuất',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      field: 'diffQuantity',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      valueGetter: ({ data }) =>
        Number.isNaN((data.doQuantity || 0) - (data.deliveryQuantity || 0))
          ? 0
          : (data.doQuantity || 0) - (data.deliveryQuantity || 0),
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
  columnDefsConfirm,
  validSchema: Yup.object({
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
    guarantor: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    basketDocumentDetails: Yup.array()
      .of(Yup.object().shape({}))
      // eslint-disable-next-line consistent-return
      .test('basketDocumentDetails', '', function(values) {
        const errors = [];
        if (this.options.context.initialValues.typeForm !== '4') {
          if (values && values.length > 0) {
            for (let i = 0, len = values.length; i < len; i += 1) {
              if (values[i].basketCode) {
                if (values[i].deliveryQuantity === 0) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].deliveryQuantity`,
                      message: 'Số Lượng Xuất Phải Lớn Hơn 0',
                    }),
                  );
                } else if (
                  values[i].deliveryQuantity - values[i].inventoryQuantity >
                  0
                ) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].deliveryQuantity`,
                      message: 'Số Lượng Xuất Phải Nhỏ Hơn Số Lượng Tồn',
                    }),
                  );
                } else if (!values[i].deliveryQuantity) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].deliveryQuantity`,
                      message: 'Trường Không Được Bỏ Trống',
                    }),
                  );
                }
              }
            }
          }
          if (errors.length > 0) {
            return new Yup.ValidationError(errors);
          }
        } else {
          values.forEach((item, index) => {
            if (item.quantityActual) {
              if (
                item.quantityActual > item.deliveryQuantity &&
                item.quantityActual - item.inventoryQuantityActual > 0
              ) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${index}].quantityActual`,
                    message: `Mã khay sọt ${item.basketCode}, Kho nguồn ${
                      item.locatorDeliver
                    } có SL tồn = ${
                      item.inventoryQuantity
                    } SL cần bổ sung là SL = ${item.quantityActual -
                      item.deliveryQuantity}`,
                  }),
                );
              }
            }
          });
          if (errors.length > 0) {
            return new Yup.ValidationError(errors);
          }
        }
        // eslint-disable-next-line consistent-return
      }),
  }),
};
