import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { find, isEmpty } from 'lodash';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiInputEditor from 'components/MuiInput/Editor';
import NumberFormatter from 'components/NumberFormatter';
import * as Yup from 'yup';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import ActionsRenderer from '../TableSection/ActionRenderer';
import appTheme from '../../../../../App/theme';

export const numericParser = params =>
  formatToNumber(params.newValue) || undefined;
export const numberFormatter = params => formatToNumber(params.value) || '';
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

const columnDefs = [
  {
    field: 'stt',
    headerName: 'STT',
    width: 70,
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
    cellEditorParams: ({ node, context }) => ({
      options: context.props.formOption.basketLocators,
      valueKey: 'basketLocatorId',
      labelKey: 'basketLocatorName',
      sublabelKey: 'basketLocatorId',
      isClearable: true,
      isSearchable: true,
      onChange: option => {
        const updaterData = {
          locatorDeliver: option.basketLocatorId,
          locatorDeliverName: option.basketLocatorName,
          locatorType: option.locatorType,
        };
        context.props.onUpdateBasketDocumentDetails({
          index: node.rowIndex,
          data: updaterData,
        });
      },
    }),
    editable: ({ context, ...params }) => {
      if (params.data.totalCol) {
        return false;
      }
      return (context.isEdit() && context.isEditTable()) || context.isCreate();
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
      onChange: option => {
        const newData = {
          ...data,
          basketCode: option.value,
          basketName: option.name,
          inventoryQuantity: option.quantity,
          deliveryQuantity: 0,
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
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'inventoryQuantity',
    headerName: 'SL Tồn',
    headerClass: 'ag-numeric-header',
    cellClass: 'ag-numeric-cell',
    valueFormatter: numberCurrency,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'deliveryQuantity',
    headerName: 'SL Xuất',
    headerClass: 'ag-numeric-header ag-header-required',
    cellClass: 'ag-numeric-cell',
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
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
    // valueFormatter: numberFormatter,
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
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'locatorReceiverName',
    headerName: 'Kho đích',
    headerClass: 'ag-header-required',
    cellEditorFramework: MuiSelectInputEditor,
    cellRendererFramework: CellRenderer,
    cellStyle: ({ context }) => ({
      background: !context.isView()
        ? appTheme.palette.background.default
        : 'inherit',
    }),
    isSearchable: true,
    isClearable: true,
    valueSetter: () => false,
    cellEditorParams: ({ node, data, context }) => ({
      options: context.props.formOption.basketLocators,
      valueKey: 'basketLocatorId',
      labelKey: 'basketLocatorName',
      sublabelKey: 'basketLocatorId',
      isClearable: true,
      isSearchable: true,
      validBeforeChange: option => {
        if (data.locatorDeliver === option.basketLocatorId) {
          context.props.onShowWarning(
            'Kho đích không được trùng với kho nguồn',
          );
          return false;
        }
        const findResult = find(
          context.props.formik.values.basketDocumentDetails,
          {
            basketCode: data.basketCode,
            locatorDeliver: data.locatorDeliver,
            locatorReceiver: option.basketLocatorId,
          },
        );
        if (findResult !== undefined) {
          context.props.onShowWarning(
            'Khay sọt chuyển đến kho tương ứng đã được lựa chọn',
          );
          return false;
        }
        return true;
      },
      onChange: option => {
        const updaterData = {
          ...data,
          locatorReceiver: option.basketLocatorId,
          locatorReceiverName: option.basketLocatorName,
          locatorType: option.locatorType,
        };
        context.props.onUpdateBasketDocumentDetails({
          index: node.rowIndex,
          data: updaterData,
        });
      },
    }),
    editable: ({ context, data }) => {
      if (data.totalCol) {
        return false;
      }
      if (isEmpty(data.basketCode) || isEmpty(data.locatorDeliver)) {
        return false;
      }
      return context.isCreate() || (context.isEdit() && context.isEditTable());
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Đơn Vị Tính',
    field: 'uoM',
  },
  {
    field: 'note',
    headerName: 'Ghi Chú',
    cellEditorFramework: MuiInputEditor,
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
    tooltipField: 'note',
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
export const internalBasketConfig = {
  value: 26,
  titleSection2: () => ``,
  renderSection2: () => false,
  addRow: isView => !isView,
  titleSection3: () => `II. Thông Tin Khay Sọt`,
  section2ColumnDefs: [],
  columnDefs,
  columnDefsView,
  validSchema: Yup.object().shape({
    deliver: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    subType: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    basketDocumentDetails: Yup.array().of(
      Yup.object().shape({
        basketCode: Yup.string().when(
          'locatorDeliver',
          (locatorDeliver, schema) => {
            if (isEmpty(locatorDeliver)) return schema;
            return schema.required('Trường Không Được Bỏ Trống');
          },
        ),
        deliveryQuantity: Yup.number().when(
          'basketCode',
          (basketCode, schema) => {
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
              )
              .min(1, 'Số Lượng Xuất phải lớn hơn 0');
          },
        ),
        locatorReceiverName: Yup.string().when(
          'locatorDeliver',
          (locatorDeliver, schema) => {
            if (isEmpty(locatorDeliver)) return schema;
            return schema.required('Trường Không Được Bỏ Trống');
          },
        ),
      }),
    ),
  }),
};
