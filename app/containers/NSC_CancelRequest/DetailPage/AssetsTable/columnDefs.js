/* eslint-disable indent */
import { formatToCurrency } from 'utils/numberUtils';
import CellRenderer from './CustomCellRenderer';
import CustomCellEditor from './CustomCellEditor';
import CustomSelectCellEditor from './CustomSelectCellEditor';
// import ImageUploadCellRenderer from './ImageUploadCellRenderer';
import appTheme from '../../../App/theme';
import MuiSelectEditor from '../../../../components/MuiSelect/Editor';
import { ASSET_TABLE, BASKET_INUSE_TABLE, MAX_INT } from '../constants';
import HiddenCellData from '../../../../components/FormikUI/HiddenCellData';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer2';
import { getNested, isNumberString } from '../../../App/utils';
import * as appActions from '../../../App/actions';
import { assetsTableFields, basketsInUseFields } from '../tableFields';
import { numericParser } from '../utils';

export const numberCurrency = params =>
  params.value && isNumberString(params.value)
    ? formatToCurrency(params.value)
    : params.value;

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

// positive float number regex
// const positiveNumberRgx = /^\d+(\.\d+)?$/;

const makeEditableCellStyle = params => ({
  background: params.node.rowPinned
    ? 'inherit'
    : appTheme.palette.background.default,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  ...(params.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {}),
});

const makeDefaultCellStyle = params =>
  params.data.isDeleted
    ? {
        textDecoration: 'line-through',
      }
    : {};

export const makeDefaultColDef = () => ({
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: CustomCellEditor,
  cellRendererFramework: undefined,
  cellStyle: makeDefaultCellStyle,
  pinnedRowCellRendererFramework: HiddenCellData,
});

/**
 * Check If new row added is duplicated
 * @param context
 * @param rowIndex
 * @param data
 * @param currentField - one of 'palletBasketCode' or 'basketCodeLocator'
 * @param selected - selected value
 * @param dispatch
 * @return {boolean} - true => is duplicated
 */
const checkDuplicatedRow = (
  context,
  rowIndex,
  data,
  currentField,
  selected,
  dispatch,
) => {
  const t = assetsTableFields;
  const tableData = [
    ...(getNested(context.props.formik, 'values', ASSET_TABLE) || []),
  ].filter((val, index) => val && index !== rowIndex);

  if (tableData && tableData.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const row of tableData) {
      if (
        (currentField === t.assetCode &&
          row[currentField] === selected.value &&
          row[t.causeCode] &&
          row[t.causeCode] === data[t.causeCode]) ||
        (currentField === t.cause &&
          row[t.causeCode] === selected.value &&
          row[t.assetCode] === data[t.assetCode])
      ) {
        dispatch(
          appActions.showWarning(
            'Không được chọn trùng mã tài sản và nguyên nhân huỷ',
          ),
        );

        return true;
      }
    }
  }

  return false;
};

export const makeColumnDefs = (
  pageType,
  receiptData,
  onOpenDialogDelete,
  isDraftSelected,
  dispatch,
) => {
  const t = assetsTableFields;
  const t2 = basketsInUseFields;

  return [
    {
      headerName: 'STT',
      field: t.stt,
      cellRenderer: ({ rowIndex }) => rowIndex + 1,
      width: 40,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Mã tài sản',
      field: t.assetCode,
      editable: false,
      cellStyle: params => makeDefaultCellStyle(params),
      cellRendererFramework: CellRenderer,
      suppressSizeToFit: true,
      width: 120,
      cellEditorFramework: MuiSelectEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        promiseOptions: (inputValue, callback) =>
          context.props.onFetchAssetAC(
            context.props.formik.values.org, // selected orgCode
            inputValue,
            callback,
          ),
        onChange: selected => {
          const isDuplicated = checkDuplicatedRow(
            context,
            rowIndex,
            data,
            t.assetCode,
            selected,
            dispatch,
          );

          if (isDuplicated) {
            resetRowData(context, ASSET_TABLE, rowIndex);
            return;
          }

          const isAutoReceipt = getNested(
            context.props,
            'receiptData',
            'isAutoReceipt',
          );
          const basketsInUseTable = getNested(
            context.props,
            'formik',
            'values',
            BASKET_INUSE_TABLE,
          );

          if (pageType.edit && isAutoReceipt && basketsInUseTable) {
            // Nếu bảng thông tin khay sọt sử dụng rỗng thì không cho phép thêm mã tài sản
            if (!basketsInUseTable.length) {
              resetRowData(context, ASSET_TABLE, rowIndex);
              dispatch(
                appActions.showWarning(
                  'Chưa có mã khay sọt nào được thêm vào ở bảng IV',
                ),
              );

              return;
            }

            // Chỉ cho phép chọn mã tài sản có mã khay sọt nằm trong bảng IV (nếu là phiếu tự động)
            const baskets = [];
            basketsInUseTable.forEach(row => {
              if (!row || !row[t2.palletBasketCode]) return;

              if (!baskets.includes(row[t.palletBasketCode]))
                baskets.push(row[t.palletBasketCode]);
            });

            if (selected && !baskets.includes(selected.palletBasketCode)) {
              resetRowData(context, ASSET_TABLE, rowIndex);
              dispatch(
                appActions.showWarning(
                  'Chỉ được chọn tài sản có mã khay sọt đã được thêm vào trong danh sách ở bảng IV',
                ),
              );

              return;
            }
          }
          // const causes = context.props.selectBoxData.causeAsset;
          // const [defaultCause] =
          //   causes && causes.length
          //     ? causes.filter(item => !!item.isDefault)
          //     : [null];

          const updatedValues = {
            [t.assetCode]: selected.value,
            [t.ownerCode]: selected.ownerCode,
            [t.ownerName]: selected.ownerName,
            [t.palletBasketCode]: selected.palletBasketCode,
            [t.palletBasketName]: selected.palletBasketName,
            [t.uom]: selected.uom,
            [t.unitPrice]: selected.unitPrice,
            [t.currentUnitPrice]: selected.currentUnitPrice,
            [t.seqFC]: selected.seqFC,
            // [t.causeCode]: getNested(defaultCause, 'value'),
            // [t.cause]: getNested(defaultCause, 'label'),
            [t.depreciationRemaining]: selected.depreciationRemaining,
            [t.inventoryQuantity]: selected.inventoryQuantity,
          };
          // calculate cancelValue - giá trị huỷ (tạm tính)
          if (
            data[t.cancelQuantity] &&
            isNumberString(data[t.cancelQuantity]) &&
            (selected.unitPrice || selected.unitPrice === 0) &&
            isNumberString(selected.unitPrice)
          ) {
            const cancelValue =
              (parseFloat(data[t.cancelQuantity]) *
                parseFloat(selected.depreciationRemaining)) /
              parseFloat(selected.inventoryQuantity);
            updatedValues[t.cancelValue] = cancelValue.toString();
          }

          updateRowData(context, ASSET_TABLE, rowIndex, updatedValues);
        },
        parseValue: value => value || undefined,
      }),
    },
    {
      headerName: 'Đơn vị sở hữu',
      field: t.ownerName,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Tên khay sọt',
      field: t.palletBasketName,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      width: 320,
    },
    {
      headerName: 'Giá trị huỷ (tạm tính)',
      field: t.cancelValue,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
    },
    {
      headerName: 'Giá trị huỷ (hiện tại)',
      hide: !pageType.edit && !pageType.reApprove,
      field: t.currentCancelValue,
      valueFormatter: numberCurrency,
      cellStyle: params => {
        if (
          parseFloat(params.value).toFixed(3) !==
          parseFloat(params.node.data[t.cancelValue]).toFixed(3)
        )
          return { color: 'red', fontWeight: 'bold', ...alignRight };

        return alignRight;
      },
      headerClass: 'ag-numeric-header',
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
    },
    {
      headerName: 'SL hủy',
      field: t.cancelQuantity,
      headerClass: isDraftSelected
        ? 'ag-numeric-header'
        : 'ag-numeric-header ag-header-required',
      valueFormatter: numberCurrency,
      editable: false,
      cellStyle: params => ({ ...makeDefaultCellStyle(params), ...alignRight }),
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      valueParser: numericParser,
      valueSetter: params => {
        const { data, node, newValue, context } = params;

        if ((newValue || newValue === 0) && isNumberString(newValue)) {
          if (parseFloat(newValue) > MAX_INT) {
            // if invalid input
            updateRowData(context, ASSET_TABLE, node.rowIndex, {
              cancelQuantity: undefined,
              cancelValue: '',
            });

            setTimeout(() =>
              dispatch(
                appActions.showWarning(
                  `SL huỷ không được quá ${formatToCurrency(MAX_INT)}`,
                ),
              ),
            );

            return true;
          }

          // set current cell newValue
          const updatedValues = {
            cancelQuantity: newValue,
          };

          // calculate cancelValue - Giá trị huỷ (tạm tính)
          const cancelValue =
            (parseFloat(newValue) * parseFloat(data.depreciationRemaining)) /
            parseFloat(data.inventoryQuantity);
          const currentCancelValue =
            (parseFloat(newValue) * parseFloat(data.depreciationRemaining)) /
            parseFloat(data.inventoryQuantity);
          updatedValues.cancelValue = cancelValue.toString();
          updatedValues.currentCancelValue = currentCancelValue.toString();

          updateRowData(context, ASSET_TABLE, node.rowIndex, updatedValues);

          return true;
        }

        // if invalid input
        updateRowData(context, ASSET_TABLE, node.rowIndex, {
          cancelQuantity: isNumberString(newValue) ? newValue : undefined,
          cancelValue: '',
          currentCancelValue: '',
        });

        return true;
      },
      width: 120,
    },
    {
      headerName: 'Đơn vị tính',
      field: t.uom,
      cellRendererFramework: CellRenderer,
      width: 105,
    },
    {
      headerName: 'Nguyên nhân hủy',
      field: t.cause,
      resizable: false,
      suppressSizeToFit: true,
      width: 120,
      headerClass: isDraftSelected ? null : 'ag-header-required',
      editable: false,
      cellStyle: params => makeDefaultCellStyle(params),
      cellRendererFramework: CellRenderer,
      cellEditorFramework: CustomSelectCellEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        options: context.props.selectBoxData.causeAsset,
        onChange: selected => {
          const isDuplicated = checkDuplicatedRow(
            context,
            rowIndex,
            data,
            t.cause,
            selected,
            dispatch,
          );

          const updatedValues = isDuplicated
            ? {
                cause: '',
                causeCode: null,
              }
            : {
                cause: selected.label,
                causeCode: selected.value,
              };

          updateRowData(context, ASSET_TABLE, rowIndex, updatedValues);
        },
        parseValue: value => value || undefined,
      }),
    },
    // {
    //   headerName: 'Tình trạng trước khi hủy',
    //   field: t.assetStatus,
    //   headerClass: isDraftSelected ? null : 'ag-header-required',
    //   editable: params =>
    //     pageType.create || (pageType.edit && showAssetTableButtons(params)),
    //   cellStyle: params => {
    //     if (
    //       pageType.create ||
    //       (pageType.edit && showAssetTableButtons(params))
    //     ) {
    //       return makeEditableCellStyle(params);
    //     }
    //
    //     return makeDefaultCellStyle(params);
    //   },
    //   cellRendererFramework: CellRenderer,
    // },
    // {
    //   hide: true,
    //   headerName: 'Hình ảnh',
    //   field: t.images,
    //   editable: false, // edit directly in the CellRenderer
    //   // headerClass: 'ag-header-required',
    //   suppressSizeToFit: true,
    //   width: 120,
    //   cellStyle: params => {
    //     if (pageType.create || (pageType.edit && showAssetTableButtons(params))) {
    //       return makeEditableCellStyle(params);
    //     }
    //
    //     return makeDefaultCellStyle(params);
    //   },
    //   cellRendererFramework: ImageUploadCellRenderer,
    //   cellRendererParams: ({ context }) => ({
    //     formik: context.props.formik,
    //     pageType,
    //     onOpenImagePopup,
    //   }),
    // },
    {
      headerName: 'Ghi chú',
      field: t.note,
      editable: params =>
        pageType.create || (pageType.edit && showAssetTableButtons(params)),
      cellStyle: params => {
        if (
          pageType.create ||
          (pageType.edit && showAssetTableButtons(params))
        ) {
          return makeEditableCellStyle(params);
        }

        return makeDefaultCellStyle(params);
      },
      cellRendererFramework: CellRenderer,
    },
    // {
    //   headerName: '',
    //   field: 'actions',
    //   width: 40,
    //   editable: false,
    //   cellClass: 'cell-action-butons',
    //   cellRendererFramework: ActionsRenderer,
    //   cellRendererParams: {
    //     onOpenDialogDelete,
    //     pageType,
    //   },
    //   suppressNavigable: true,
    //   suppressSizeToFit: true,
    // },
  ];
};

/**
 * Update row data
 * @param context
 * @param tableId
 * @param rowIndex
 * @param updatedValues
 */
function updateRowData(context, tableId, rowIndex, updatedValues) {
  if (!getNested(context, 'props', 'formik')) return;
  context.props.formik.updateFieldArrayValue(tableId, rowIndex, updatedValues);
}

function resetRowData(context, tableId, rowIndex) {
  if (!getNested(context, 'props', 'formik')) return;
  context.props.formik.setFieldValue(`${tableId}[${rowIndex}]`, {});
}

// function isAutoReceipt(params) {
//   return getNested(params.context.props, 'receiptData', 'isAutoReceipt');
// }

function showAssetTableButtons(params) {
  return getNested(
    params.context.props,
    'receiptData',
    'showAssetTableButtons',
  );
}
