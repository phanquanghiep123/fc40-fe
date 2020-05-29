import MuiInputEditor from 'components/MuiInput/Editor';
import * as Yup from 'yup';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import NumberFormatter from 'components/NumberFormatter';
import { groupBy } from 'lodash';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { validInteger } from 'components/NumberFormatter/utils';
import ActionRender from './ActionRender';
import { TYPE_PNKS } from './constants';
import appTheme from '../../../App/theme';

export const numericParser = params => {
  if (params.newValue === '0' || params.newValue === 0) {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

const checEditable = params => {
  if (params.data.totalCol || params.context.isView()) {
    return false;
  }
  if (params.data.basketCode) {
    return true;
  }
  return false;
};

export const config = [
  // Nhập mới
  {
    value: TYPE_PNKS.PNKS_MOI,
    renderGetTurnToScale: false,
    renderSuggest: false,
    newImport: true,
    // vùng thông tin ks
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 60,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        headerClass: 'ag-header-required',
        width: 150,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        field: 'basketCode',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        editable: params => !(params.context.isView() || params.data.totalCol),
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.baskets,
          valueKey: 'basketCode',
          labelKey: 'basketCode',
          sublabelKey: 'basketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            context.props.onChangeBasketsCode({ rowIndex, data: option });
          },
        }),
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 80,
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        width: 130,
        headerClass: 'ag-numeric-header ag-header-required',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
          textAlign: 'right',
        }),
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        field: 'locatorReceiverName',
        headerClass: 'ag-header-required',
        editable: params => checEditable(params),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiSelectInputEditor,
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.locatorTo,
          valueKey: 'basketLocatorId',
          labelKey: 'basketLocatorName',
          sublabelKey: 'basketLocatorId',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            const payload = {
              rowIndex,
              ...option,
            };
            context.props.changebasketLocatorTo(payload);
          },
        }),
      },
      {
        headerName: 'Lý Do',
        tooltipField: 'reason',
        cellEditorFramework: MuiInputEditor,
        field: 'reason',
        headerClass: 'ag-header-required',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        editable: params => checEditable(params),
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
        headerName: 'Ghi Chú',
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        editable: params => checEditable(params),
        tooltipField: 'note',
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
        headerName: '',
        field: 'actions',
        width: 50,
        cellClass: 'cell-action-butons',
        cellRendererFramework: ActionRender,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],

    // vùng thông tin tài sản
    columnAsset: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 60,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Tài Sản',
        cellEditorFramework: MuiInputEditor,
        field: 'assetCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        width: 130,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header ag-header-required',
        cellStyle: {
          textAlign: 'right',
        },
        width: 170,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Nguyên Giá',
        field: 'price',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Giá Trị Còn Lại',
        field: 'depreciationRemaining',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Thời Gian Khấu Hao',
        field: 'totalDepreciation',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Ngày Khấu Hao',
        cellEditorFramework: MuiInputEditor,
        field: 'depreciationStartDate',
      },
      {
        headerName: 'Tên Tài Sản',
        cellEditorFramework: MuiInputEditor,
        field: 'description',
        tooltipField: 'description',
      },
      {
        headerName: 'Tên Tài Sản 2',
        cellEditorFramework: MuiInputEditor,
        field: 'additionalDescription',
        tooltipField: 'additionalDescription',
      },
    ],

    // Chuyển nội bộ sở hữu vùng thông tin tài sản
    columnAsset3: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 60,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Tài Sản',
        cellEditorFramework: MuiInputEditor,
        field: 'assetCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Chuyển',
        cellEditorFramework: MuiInputEditor,
        field: 'receiverQuantity',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Tên Tài Sản',
        cellEditorFramework: MuiInputEditor,
        field: 'description',
        tooltipField: 'description',
      },
      {
        headerName: 'Tên Tài Sản 2',
        cellEditorFramework: MuiInputEditor,
        field: 'additionalDescription',
        tooltipField: 'additionalDescription',
      },
    ],

    // Xuất hủy sở hữu vùng thông tin tài sản
    columnAsset4: [
      {
        headerName: 'STT',
        field: 'stt',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 60,
      },
      {
        headerName: 'Mã Tài Sản',
        cellEditorFramework: MuiInputEditor,
        field: 'assetCode',
      },
      {
        headerName: 'Đơn Vị Sở Hữu ',
        cellEditorFramework: MuiInputEditor,
        field: 'plantName',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Giá Trị Hủy ',
        cellEditorFramework: MuiInputEditor,
        field: 'priceCancell',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Hủy',
        cellEditorFramework: MuiInputEditor,
        field: 'quantityCancell',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        tooltipField: 'description',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        tooltipField: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Nguyên Nhân Hủy',
        cellEditorFramework: MuiInputEditor,
        field: 'reasonName',
        tooltipField: 'reasonName',
      },
      {
        headerName: 'Tình Trạng Trước Khi Hủy',
        cellEditorFramework: MuiInputEditor,
        field: 'state',
        width: 260,
        tooltipField: 'state',
      },
      {
        headerName: 'Ghi Chú',
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        tooltipField: 'note',
      },
    ],

    // Xuất hủy sở hữu vùng thông tin ks
    columnBasket4: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 60,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Nguyên Nhân Hủy',
        cellEditorFramework: MuiInputEditor,
        field: 'reasonName',
        tooltipField: 'reasonName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Hủy',
        cellEditorFramework: MuiInputEditor,
        field: 'quantityCancell',
        tooltipField: 'quantityCancell',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        tooltipField: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],
    validationSchema: Yup.object().shape({
      importor: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      receiver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      note: Yup.string()
        .max(500, 'Ghi chú không được nhiều hơn 500 kí tự')
        .nullable(),
      section3: Yup.array()
        .of(Yup.object().shape({}))
        // eslint-disable-next-line consistent-return
        .test('testBlank', '', function(values) {
          // values = section3
          const errors = [];
          if (values && values.length > 0) {
            for (let i = 0, len = values.length; i < len; i += 1) {
              if (values[i].basketCode && !values[i].locatorReceiverName) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].locatorReceiverName`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (values[i].receiverQuantity && !values[i].basketCode) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].basketCode`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (!values[i].reason && values[i].basketCode) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].reason`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (!values[i].receiverQuantity && values[i].basketCode) {
                if (values[i].receiverQuantity === 0) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].receiverQuantity`,
                      message: 'Số Lượng Nhập Phải Lớn Hơn 0',
                    }),
                  );
                } else {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].receiverQuantity`,
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
        })
        .test('testDuplicate', '', function(values) {
          if (values && values.length > 0) {
            const errors = [];
            const getKey = value =>
              `${value.basketCode}_${value.locatorReceiver}`;
            const grouped = groupBy(values, value => getKey(value));
            for (let i = 0, len = values.length; i < len; i += 1) {
              const value = values[i];
              if (value && value.basketCode && value.locatorReceiver) {
                const key = getKey(value);
                if (grouped[key] && grouped[key].length > 1) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].basketCode`,
                      message: 'Không được trùng',
                    }),
                    this.createError({
                      path: `${this.path}[${i}].locatorReceiverName`,
                      message: 'Không được trùng',
                    }),
                  );
                }
              }
            }
            if (errors.length > 0) {
              return new Yup.ValidationError(errors);
            }
          }
          return true;
        }),
    }),
  },
  // Nhập điều chuyển
  {
    value: TYPE_PNKS.PNKS_DIEU_CHUYEN,
    renderGetTurnToScale: true,
    renderSuggest: false,
    columnDefsSection2: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        field: 'basketCode',
        cellEditorFramework: MuiInputEditor,
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Giao',
        width: 100,
        field: 'deliveryQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Số Lượng Nhận',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Chênh lệch Giao/Nhận',
        cellEditorFramework: MuiInputEditor,
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        headerClass: 'ag-numeric-header',
        field: 'differentDeRe',
        valueGetter: params =>
          (params.data.deliveryQuantity || 0) -
          (params.data.receiverQuantity || 0),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: value => {
          if (
            (value.data.deliveryQuantity || 0) -
              (value.data.receiverQuantity || 0) <
            0
          ) {
            return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
          }
          if (
            (value.data.deliveryQuantity || 0) -
              (value.data.receiverQuantity || 0) >
            0
          ) {
            return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
          }
          return { textAlign: 'right' };
        },
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
      },
    ],
    columnDefsSection2Edit: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        field: 'basketCode',
        cellEditorFramework: MuiInputEditor,
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Giao',
        width: 100,
        field: 'deliveryQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Số Lượng Của PNK',
        cellEditorFramework: MuiInputEditor,
        valueParser: numericParser,
        cellClass: 'ag-numeric-cell',
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        field: 'importReceiptQuantity',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Số Lượng Nhận',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Chênh lệch Giao/Nhận',
        cellEditorFramework: MuiInputEditor,
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        headerClass: 'ag-numeric-header',
        field: 'differentDeRe',
        valueGetter: params =>
          (params.data.deliveryQuantity || 0) -
          (params.data.receiverQuantity || 0),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: value => {
          if (
            (value.data.deliveryQuantity || 0) -
              (value.data.receiverQuantity || 0) <
            0
          ) {
            return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
          }
          if (
            (value.data.deliveryQuantity || 0) -
              (value.data.receiverQuantity || 0) >
            0
          ) {
            return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
          }
          return { textAlign: 'right' };
        },
      },
      {
        headerName: 'Chênh Lệch PNK/Nhận',
        headerClass: 'ag-numeric-header',
        cellEditorFramework: MuiInputEditor,
        valueFormatter: numberCurrency,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        field: 'differentReceipt',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        valueGetter: params =>
          (params.data.importReceiptQuantity || 0) -
          (params.data.receiverQuantity || 0),
        cellStyle: params => {
          if (
            (params.data.importReceiptQuantity || 0) -
              (params.data.receiverQuantity || 0) <
            0
          ) {
            return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
          }
          if (
            (params.data.importReceiptQuantity || 0) -
              (params.data.receiverQuantity || 0) >
            0
          ) {
            return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
          }
          return { textAlign: 'right' };
        },
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
      },
    ],
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        headerClass: 'ag-header-required',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        field: 'basketCode',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        editable: params => !(params.context.isView() || params.data.totalCol),
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.baskets,
          valueKey: 'basketCode',
          labelKey: 'basketCode',
          sublabelKey: 'basketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            context.props.onChangeBasketsCode({ rowIndex, data: option });
          },
        }),
      },
      {
        headerName: 'Tên Khay Sọt',
        editable: false,
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        width: 50,
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Nhận',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header ag-header-required',
        cellStyle: ({ context }) => ({
          textAlign: 'right',
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        field: 'locatorReceiverName',
        width: 300,
        headerClass: 'ag-header-required',
        editable: params => checEditable(params),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.locatorTo,
          valueKey: 'basketLocatorId',
          labelKey: 'basketLocatorName',
          sublabelKey: 'basketLocatorId',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            const payload = {
              rowIndex,
              ...option,
            };
            context.props.changebasketLocatorTo(payload);
          },
        }),
      },
      {
        headerName: 'Ghi Chú',
        editable: params => checEditable(params),
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        tooltipField: 'note',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
      {
        headerName: '',
        field: 'actions',
        width: 50,
        cellClass: 'cell-action-butons',
        cellRendererFramework: ActionRender,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],
    validationSchema: Yup.object().shape({
      deliver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      deliveryOrder: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      receiver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      date: Yup.string().when('deliverDate', (deliverDate, schema) =>
        schema.required('Trường Không Được Bỏ Trống'),
      ),
      note: Yup.string()
        .max(500, 'Ghi chú không được nhiều hơn 500 kí tự')
        .nullable(),
      importor: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      section3: Yup.array()
        .of(Yup.object().shape({}))
        // eslint-disable-next-line consistent-return
        .test('testReceiverQuantity', '', function(values) {
          if (this.options.context.initialValues.btnSubmit === '3') {
            const errors = [];
            if (values && values.length > 0) {
              for (let i = 0, len = values.length; i < len; i += 1) {
                if (!values[i].receiverQuantity && values[i].basketCode) {
                  if (values[i].receiverQuantity === 0) {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
                        message: 'Số Lượng Nhập Phải Lớn Hơn 0',
                      }),
                    );
                  } else {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
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
          }
        })
        // eslint-disable-next-line consistent-return
        .test('testLocatorTo', '', function(values) {
          // values = section3
          const errors = [];
          if (values && values.length > 0) {
            for (let i = 0, len = values.length; i < len; i += 1) {
              if (values[i].basketCode && !values[i].locatorReceiverName) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].locatorReceiverName`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (values[i].receiverQuantity && !values[i].basketCode) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].basketCode`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
            }
          }
          if (errors.length > 0) {
            return new Yup.ValidationError(errors);
          }
        })
        .test('testDuplicate', '', function(values) {
          if (values && values.length > 0) {
            const errors = [];
            const getKey = value =>
              `${value.basketCode}_${value.locatorReceiver}`;
            const grouped = groupBy(values, value => getKey(value));
            for (let i = 0, len = values.length; i < len; i += 1) {
              const value = values[i];
              if (value && value.basketCode && value.locatorReceiver) {
                const key = getKey(value);
                if (grouped[key] && grouped[key].length > 1) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].basketCode`,
                      message: 'Không được trùng',
                    }),
                    this.createError({
                      path: `${this.path}[${i}].locatorReceiverName`,
                      message: 'Không được trùng',
                    }),
                  );
                }
              }
            }
            if (errors.length > 0) {
              return new Yup.ValidationError(errors);
            }
          }
          return true;
        }),
    }),
  },
  // Nhập trả khay sọt
  {
    value: TYPE_PNKS.PNKS_TRA,
    renderGetTurnToScale: false,
    renderSuggest: true,
    columnDefsSection2: [
      {
        headerName: 'STT',
        field: 'stt',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 50,
      },
      {
        headerName: 'Mã Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketCode',
        editable: false,
      },
      {
        headerName: 'Tên Khay Sọt',
        field: 'basketName',
        cellEditorFramework: MuiInputEditor,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 180,
      },
      {
        headerName: 'Số Lượng Cho Mượn',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        cellEditorFramework: MuiInputEditor,
        field: 'loanQuantity',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
        cellRendererFramework: CellRenderer,
        cellClass: 'ag-numeric-cell',
        width: 170,
      },
      {
        headerName: 'Số Lượng Trả',
        field: 'receiverQuantity',
        resizable: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        valueFormatter: numberCurrency,
        valueParser: numericParser,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellStyle: {
          textAlign: 'right',
        },
        cellEditorFramework: MuiInputEditor,
        headerClass: 'ag-numeric-header ag-header-required',
        cellRendererFramework: CellRenderer,
        cellClass: 'ag-numeric-cell',
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Chênh lệch Đang Mượn/Trả',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        headerClass: 'ag-numeric-header ag-header-required',
        cellClass: 'ag-numeric-cell',
        cellEditorFramework: MuiInputEditor,
        cellRendererFramework: CellRenderer,
        valueFormatter: numberCurrency,
        valueParser: numericParser,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        valueGetter: params =>
          (params.data.loanQuantity || 0) - (params.data.receiverQuantity || 0),
        field: 'diffrentLoanReturn',
        cellStyle: params => {
          if (params.data.loanQuantity - params.data.receiverQuantity < 0) {
            return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
          }
          return { textAlign: 'right' };
        },
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
      },
    ],
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 50,
      },
      {
        headerName: 'Mã Khay Sọt',
        field: 'basketCode',
        headerClass: 'ag-header-required',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        editable: params => !(params.context.isView() || params.data.totalCol),
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.baskets,
          valueKey: 'basketCode',
          labelKey: 'basketCode',
          sublabelKey: 'basketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            context.props.onChangeBasketsCode({ rowIndex, data: option });
          },
        }),
      },
      {
        headerName: 'Tên Khay Sọt',
        editable: false,
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        field: 'uoM',
        cellEditorFramework: MuiInputEditor,
        width: 100,
      },
      {
        headerName: 'Số Lượng Trả',
        editable: params => checEditable(params),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        headerClass: 'ag-numeric-header ag-header-required',
        field: 'receiverQuantity',
        cellStyle: ({ context }) => ({
          textAlign: 'right',
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        cellClass: 'ag-numeric-cell',
        valueFormatter: numberCurrency,
        valueParser: numericParser,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellRendererFramework: CellRenderer,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
        width: 100,
      },
      {
        headerName: 'Kho Đích',
        field: 'locatorReceiverName',
        width: 250,
        headerClass: 'ag-header-required',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        editable: params => checEditable(params),
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.locatorTo,
          valueKey: 'basketLocatorId',
          labelKey: 'basketLocatorName',
          sublabelKey: 'basketLocatorId',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            const payload = {
              rowIndex,
              ...option,
            };
            context.props.changebasketLocatorTo(payload);
          },
        }),
      },
      {
        headerName: 'Ghi Chú',
        editable: params => checEditable(params),
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        tooltipField: 'note',
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
      {
        headerName: '',
        field: 'actions',
        width: 50,
        cellClass: 'cell-action-butons',
        cellRendererFramework: ActionRender,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],
    validationSchema: Yup.object().shape({
      deliver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      receiver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      importor: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      note: Yup.string()
        .max(500, 'Ghi chú không được nhiều hơn 500 kí tự')
        .nullable(),
      section3: Yup.array()
        .of(Yup.object().shape({}))
        // eslint-disable-next-line consistent-return
        .test('testReceiverQuantity', '', function(values) {
          if (this.options.context.initialValues.btnSubmit === '3') {
            const errors = [];
            if (values && values.length > 0) {
              for (let i = 0, len = values.length; i < len; i += 1) {
                if (!values[i].receiverQuantity && values[i].basketCode) {
                  if (values[i].receiverQuantity === 0) {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
                        message: 'Số Lượng Nhập Phải Lớn Hơn 0',
                      }),
                    );
                  } else {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
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
          }
        })
        // eslint-disable-next-line consistent-return
        .test('testLocatorTo', '', function(values) {
          const errors = [];
          if (values && values.length > 0) {
            for (let i = 0, len = values.length; i < len; i += 1) {
              if (values[i].basketCode && !values[i].locatorReceiverName) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].locatorReceiverName`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (values[i].receiverQuantity && !values[i].basketCode) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].basketCode`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
            }
          }
          if (errors.length > 0) {
            return new Yup.ValidationError(errors);
          }
        })
        .test('testDuplicate', '', function(values) {
          if (values && values.length > 0) {
            const errors = [];
            const getKey = value =>
              `${value.basketCode}_${value.locatorReceiver}`;
            const grouped = groupBy(values, value => getKey(value));
            for (let i = 0, len = values.length; i < len; i += 1) {
              const value = values[i];
              if (value && value.basketCode && value.locatorReceiver) {
                const key = getKey(value);
                if (grouped[key] && grouped[key].length > 1) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].basketCode`,
                      message: 'Không được trùng',
                    }),
                    this.createError({
                      path: `${this.path}[${i}].locatorReceiverName`,
                      message: 'Không được trùng',
                    }),
                  );
                }
              }
            }
            if (errors.length > 0) {
              return new Yup.ValidationError(errors);
            }
          }
          return true;
        }),
    }),
  },
  // Nhập mượn khay sọt
  {
    value: TYPE_PNKS.PNKS_MUON,
    renderGetTurnToScale: false,
    renderSuggest: false,
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 50,
      },
      {
        headerName: 'Mã Khay Sọt',
        headerClass: 'ag-header-required',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        field: 'basketCode',
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        editable: params => !(params.data.totalCol || params.context.isView()),
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.baskets,
          valueKey: 'basketCode',
          labelKey: 'basketCode',
          sublabelKey: 'basketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            context.props.onChangeBasketsCode({ rowIndex, data: option });
          },
        }),
      },
      {
        headerName: 'Tên Khay Sọt',
        editable: false,
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        field: 'uoM',
        width: 70,
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header ag-header-required',
        cellStyle: ({ context }) => ({
          textAlign: 'right',
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        width: 150,
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        width: 290,
        headerClass: 'ag-header-required',
        field: 'locatorReceiverName',
        editable: params => checEditable(params),
        cellEditorFramework: MuiSelectInputEditor,
        suppressSizeToFit: true,
        cellStyle: ({ context }) => ({
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorParams: ({ context, rowIndex }) => ({
          options: context.props.formOption.locatorTo,
          valueKey: 'basketLocatorId',
          labelKey: 'basketLocatorName',
          sublabelKey: 'basketLocatorId',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            const payload = {
              rowIndex,
              ...option,
            };
            context.props.changebasketLocatorTo(payload);
          },
        }),
      },
      {
        headerName: 'Ghi Chú',
        editable: params => checEditable(params),
        cellEditorFramework: MuiInputEditor,
        cellStyle: ({ context }) => ({
          textAlign: 'right',
          background: !context.isView()
            ? appTheme.palette.background.default
            : 'inherit',
        }),
        field: 'note',
        tooltipField: 'note',
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
      {
        headerName: '',
        field: 'actions',
        width: 50,
        cellClass: 'cell-action-butons',
        cellRendererFramework: ActionRender,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],
    validationSchema: Yup.object().shape({
      deliver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      receiver: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      note: Yup.string()
        .max(500, 'Ghi chú không được nhiều hơn 500 kí tự')
        .nullable(),
      importor: Yup.object()
        .required('Trường Không Được Bỏ Trống')
        .nullable(),
      section3: Yup.array()
        .of(Yup.object().shape({}))
        // eslint-disable-next-line consistent-return
        .test('testLocatorTo', '', function(values) {
          const errors = [];
          if (values && values.length > 0) {
            for (let i = 0, len = values.length; i < len; i += 1) {
              if (values[i].basketCode && !values[i].locatorReceiverName) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].locatorReceiverName`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (values[i].receiverQuantity && !values[i].basketCode) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].basketCode`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
              if (
                values[i].receiverQuantity &&
                !values[i].basketCode &&
                !values[i].locatorReceiverName
              ) {
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].locatorReceiverName`,
                    message: 'Trường Không Được Bỏ Trống',
                  }),
                );
              }
            }
          }
          if (errors.length > 0) {
            return new Yup.ValidationError(errors);
          }
        })
        // eslint-disable-next-line consistent-return
        .test('testReceiverQuantity', '', function(values) {
          if (this.options.context.initialValues.btnSubmit === '3') {
            const errors = [];
            if (values && values.length > 0) {
              for (let i = 0, len = values.length; i < len; i += 1) {
                if (!values[i].receiverQuantity && values[i].basketCode) {
                  if (values[i].receiverQuantity === 0) {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
                        message: 'Số Lượng Nhập Phải Lớn Hơn 0',
                      }),
                    );
                  } else {
                    errors.push(
                      this.createError({
                        path: `${this.path}[${i}].receiverQuantity`,
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
          }
        })
        .test('testDuplicate', '', function(values) {
          if (values && values.length > 0) {
            const errors = [];
            const getKey = value =>
              `${value.basketCode}_${value.locatorReceiver}`;
            const grouped = groupBy(values, value => getKey(value));
            for (let i = 0, len = values.length; i < len; i += 1) {
              const value = values[i];
              if (value && value.basketCode && value.locatorReceiver) {
                const key = getKey(value);
                if (grouped[key] && grouped[key].length > 1) {
                  errors.push(
                    this.createError({
                      path: `${this.path}[${i}].basketCode`,
                      message: 'Không được trùng',
                    }),
                    this.createError({
                      path: `${this.path}[${i}].locatorReceiverName`,
                      message: 'Không được trùng',
                    }),
                  );
                }
              }
            }
            if (errors.length > 0) {
              return new Yup.ValidationError(errors);
            }
          }
          return true;
        }),
    }),
  },
  // Nhập chuyển nội bộ
  {
    value: TYPE_PNKS.PNKS_CHUYEN_NOI_BO,
    renderGetTurnToScale: false,
    renderSuggest: false,
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Kho nguồn',
        cellEditorFramework: MuiInputEditor,
        field: 'locatorDeliver',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 70,
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        cellEditorFramework: MuiInputEditor,
        field: 'locatorReceiverName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Ghi Chú',
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        tooltipField: 'note',
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
    ],
    validationSchema: {},
  },
  // Nhập kho di duong
  {
    value: TYPE_PNKS.PNKS_KHO_DI_DUONG,
    renderGetTurnToScale: false,
    renderSuggest: false,
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Kho nguồn',
        cellEditorFramework: MuiInputEditor,
        field: 'locatorDeliver',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        cellEditorFramework: MuiInputEditor,
        field: 'locatorReceiverName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Ghi Chú',
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        tooltipField: 'note',
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
    ],
    validationSchema: {},
  },
  // Nhập dieu chinh
  {
    value: TYPE_PNKS.PNKS_DIEU_CHINH,
    renderGetTurnToScale: false,
    renderSuggest: false,
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Mã Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketCode',
      },
      {
        headerName: 'Tên Khay Sọt',
        cellEditorFramework: MuiInputEditor,
        field: 'basketName',
      },
      {
        headerName: 'Đơn Vị Tính',
        cellEditorFramework: MuiInputEditor,
        field: 'uoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 90,
      },
      {
        headerName: 'Số Lượng Nhập',
        field: 'receiverQuantity',
        headerClass: 'ag-numeric-header',
        cellStyle: {
          textAlign: 'right',
        },
        pinnedRowCellRendererParams: {
          valueFormatter: numberCurrency,
        },
        cellClass: 'ag-numeric-cell',
        valueParser: numericParser,
        valueFormatter: numberCurrency,
        editable: params => checEditable(params),
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: () => ({
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        }),
      },
      {
        headerName: 'Kho Đích',
        cellEditorFramework: MuiInputEditor,
        field: 'locatorReceiverName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Ghi Chú',
        cellEditorFramework: MuiInputEditor,
        field: 'note',
        tooltipField: 'note',
        cellEditorParams: {
          inputProps: { maxLength: 500 },
        },
      },
    ],
    validationSchema: {},
  },
];

export const defaultColDef = {
  valueSetter: params => {
    if (params.colDef.field === 'locatorReceiverName') {
      return false;
    }
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };
    params.context.props.onUpdateDetailsCommand({
      field: 'basketDetails',
      index: params.node.rowIndex,
      data: updaterData,
    });
    return true;
  },
  suppressMovable: true,
};
export const defaultColDefSection2 = {
  suppressMovable: true,
};
export const defaultColDefAsset = {
  suppressMovable: true,
};
export const defaultColDefSection4 = {
  suppressMovable: true,
};
