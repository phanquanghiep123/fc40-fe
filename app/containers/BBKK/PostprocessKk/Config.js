import MuiInputEditor from 'components/MuiInput/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import NumberFormatter from 'components/NumberFormatter';
import { validInteger } from 'components/NumberFormatter/utils';
import { groupBy, sumBy } from 'lodash';
import appTheme from '../../App/theme';

export const numericParser = params => {
  if (params.newValue === '0' || params.newValue === 0) {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

export const commonColumns = [
  {
    field: 'basketCode',
    headerName: 'Mã Khay Sọt',
    tooltipField: 'basketCode',
    valueGetter: params => {
      if (params.data.indexRowMerge === 0) {
        return params.data.basketCode;
      }
      return '';
    },
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    tooltipField: 'basketName',
    valueGetter: params => {
      if (params.data.indexRowMerge === 0) {
        return params.data.basketName;
      }
      return '';
    },
  },
  {
    field: 'uoM',
    headerName: 'Đơn Vị',
    tooltipField: 'uoM',
    width: 100,
    valueGetter: params => {
      if (params.data.indexRowMerge === 0) {
        return params.data.uoM;
      }
      return '';
    },
  },
  {
    field: 'maxAdjustQuantity',
    headerName: 'Tổng SL Có Thể Điều Chỉnh Tối Đa ',
    headerClass: 'ag-numeric-header',
    tooltipField: 'maxAdjustQuantity',
    cellStyle: {
      textAlign: 'right',
    },
    valueGetter: params => {
      let deliverQuantity = 0;
      let receiverQuantity = 0;
      if (
        params.data.expectAdjustDeliverQuantity &&
        params.data.expectAdjustReceiverQuantity
      ) {
        params.context.props.tableData.forEach(item => {
          if (item.basketCode === params.data.basketCode) {
            if (item.expectAdjustDeliverQuantity) {
              deliverQuantity += item.expectAdjustDeliverQuantity;
            }
            if (item.expectAdjustReceiverQuantity) {
              receiverQuantity += item.expectAdjustReceiverQuantity;
            }
          }
        });
        if (params.data.indexRowMerge === 0) {
          if (Math.abs(deliverQuantity) > Math.abs(receiverQuantity)) {
            return Math.abs(receiverQuantity);
          }
          return Math.abs(deliverQuantity);
        }
      }
      return '';
    },
  },
  {
    field: 'locatorDeliver',
    headerName: 'Kho Nguồn',
    tooltipField: 'locatorDeliver',
  },
  {
    field: 'expectAdjustDeliverQuantity',
    headerName: 'SL Cần Điều Chỉnh',
    headerClass: 'ag-numeric-header',
    tooltipField: 'expectAdjustDeliverQuantity',
    cellStyle: {
      textAlign: 'right',
    },
  },
  {
    headerName: 'SL Xuất Điều Chỉnh',
    field: 'deliveryQuantity',
    tooltipField: 'deliveryQuantity',
    headerClass: 'ag-numeric-header',
    editable: context => {
      if (context.data.basketCode && !context.data.locatorDeliver) {
        return false;
      }
      if (context.data.isDisable) {
        return false;
      }
      return true;
    },
    cellClass: 'ag-numeric-cell',
    cellStyle: context => ({
      textAlign: 'right',
      background:
        context.data.isDisable ||
        (context.data.basketCode && !context.data.locatorDeliver)
          ? 'inherit'
          : appTheme.palette.background.default,
      // background:
      //   context.data.basketCode &&
      //   context.data.basketLocatorDeliverId &&
      //   !context.data.basketLocatorReceiverId &&
      //   context.data.indexRowMerge === 0
      //     ? 'inherit'
      //     : appTheme.palette.background.default,
    }),
    valueParser: numericParser,
    valueFormatter: numberCurrency,
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: params => ({
      validBeforeChange: value => {
        let sumDeliverQuantity = 0;
        let sumReceiverQuantity = 0;
        let maxAdjustQuantity = 0;
        const tableData = [];
        const updaterData = {
          ...params.data,
          [params.colDef.field]: value,
        };
        const table = params.context.props.tableData;
        table[params.node.rowIndex] = updaterData;
        const grouped = groupBy(
          params.context.props.tableData,
          subValue => `${subValue.basketCode}`,
        );
        params.context.props.tableData.forEach(item => {
          if (item.basketCode === params.data.basketCode) {
            tableData.push(item);
            if (item.expectAdjustDeliverQuantity) {
              sumDeliverQuantity += item.expectAdjustDeliverQuantity;
            }
            if (item.expectAdjustReceiverQuantity) {
              sumReceiverQuantity += item.expectAdjustReceiverQuantity;
            }
          }
        });
        if (Math.abs(sumDeliverQuantity) > Math.abs(sumReceiverQuantity)) {
          maxAdjustQuantity = Math.abs(sumReceiverQuantity);
        } else {
          maxAdjustQuantity = Math.abs(sumDeliverQuantity);
        }
        sumDeliverQuantity = Math.abs(sumDeliverQuantity);
        sumReceiverQuantity = Math.abs(sumReceiverQuantity);
        if (
          value > sumReceiverQuantity ||
          value > Math.abs(params.data.expectAdjustDeliverQuantity) ||
          sumBy(grouped[params.data.basketCode], 'deliveryQuantity') >
            maxAdjustQuantity
        ) {
          params.context.props.onShowWarning(
            'SL Xuất Điều Chỉnh phải nhỏ hơn hoặc bằng Tổng Số Lượng Có Thể Điều Chỉnh Tối Đa và Tổng Số Lượng Cần Điều Chỉnh của bên nhận và Số Lượng Cần Điều Chỉnh của bên giao',
          );
        }

        return true;
      },
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validInteger,
        },
      },
    }),
  },
  {
    field: 'locatorReceiver',
    headerName: 'Kho Đích',
    tooltipField: 'locatorReceiver',
  },
  {
    field: 'expectAdjustReceiverQuantity',
    headerName: 'SL Cần Điều Chỉnh',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    tooltipField: 'expectAdjustReceiverQuantity',
  },
  {
    headerName: 'SL Nhập Điều Chỉnh',
    field: 'receiverQuantity',
    headerClass: 'ag-numeric-header',
    tooltipField: 'receiverQuantity',
    editable: params => params.data.expectAdjustReceiverQuantity,
    cellClass: 'ag-numeric-cell',
    valueParser: numericParser,
    cellStyle: context => ({
      textAlign: 'right',
      background: context.data.expectAdjustReceiverQuantity
        ? appTheme.palette.background.default
        : 'inherit',
    }),

    valueFormatter: numberCurrency,
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: params => ({
      validBeforeChange: value => {
        let deliverQuantity = 0;
        let receiverQuantity = 0;
        let maxAdjustQuantity = 0;
        params.context.props.tableData.forEach(item => {
          if (item.basketCode === params.data.basketCode) {
            if (item.expectAdjustDeliverQuantity) {
              deliverQuantity += item.expectAdjustDeliverQuantity;
            }
            if (item.expectAdjustReceiverQuantity) {
              receiverQuantity += item.expectAdjustReceiverQuantity;
            }
          }
        });
        if (Math.abs(deliverQuantity) > Math.abs(receiverQuantity)) {
          maxAdjustQuantity = Math.abs(receiverQuantity);
        } else {
          maxAdjustQuantity = Math.abs(deliverQuantity);
        }

        if (
          value > params.data.expectAdjustReceiverQuantity &&
          value > maxAdjustQuantity
        ) {
          params.context.props.onShowWarning(
            'SL Nhập Điều Chỉnh phải nhỏ hơn hoặc bằng Số Lượng Cần Điều Chỉnh',
          );
          return false;
        }
        return true;
      },
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validInteger,
        },
      },
    }),
  },
  {
    field: 'note',
    headerName: 'Ghi Chú',
    tooltipField: 'note',
    editable: context => {
      if (context.data.isDisable) {
        return false;
      }
      return true;
    },
    cellEditorFramework: MuiInputEditor,
    cellStyle: context => ({
      textAlign: 'right',
      background: context.data.isDisable
        ? 'inherit'
        : appTheme.palette.background.default,
    }),
  },
];
