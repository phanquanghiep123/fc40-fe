/* eslint-disable indent */
import { formatToCurrency } from 'utils/numberUtils';
import CellRenderer from './CustomCellRenderer';
import CustomCellEditor from './CustomCellEditor';
import CustomSelectCellEditor from './CustomSelectCellEditor';
import ImageUploadCellRenderer from './ImageUploadCellRenderer';
import appTheme from '../../../App/theme';
import ActionsRenderer from './ActionsRenderer';
import MuiSelectEditor from '../../../../components/MuiSelect/Editor';
import HiddenCellData from '../../../../components/FormikUI/HiddenCellData';
import MuiSelectInputEditor from '../../../../components/MuiSelect/InputEditor';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer2';
import { getNested, isNumberString } from '../../../App/utils';
import { BASKET_INUSE_TABLE, MAX_INT, ASSET_TABLE } from '../constants';
import { numericParser, searchSelectOptions } from '../utils';
import * as appActions from '../../../App/actions';
import { basketsInUseFields } from '../tableFields';

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
  const t = basketsInUseFields;
  const tableData = [
    ...(getNested(context.props.formik, 'values', BASKET_INUSE_TABLE) || []),
  ].filter((val, index) => val && index !== rowIndex);

  if (tableData && tableData.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const row of tableData) {
      if (
        (currentField === t.palletBasketCode &&
          row[currentField] === selected.value &&
          row[t.basketLocatorCode] === data[t.basketLocatorCode]) ||
        (currentField === t.basketLocatorCode &&
          row[currentField] === selected.value &&
          row[t.palletBasketCode] &&
          row[t.palletBasketCode] === data[t.palletBasketCode])
      ) {
        dispatch(
          appActions.showWarning(
            'Không được chọn trùng kho nguồn và mã khay sọt',
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
  selectBoxData,
  onOpenDialogDelete,
  onOpenImagePopup,
  onOpenSelectAssetsPopup,
  onSetDataUseTable,
  onEditPopup,
  onFetchBasketLocatorAC,
  onFetchBasketByLocatorAC,
  onUpdateBasketsInUsePinnedData,
  isDraftSelected,
  dispatch,
) => {
  const t = basketsInUseFields;
  const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');

  return [
    {
      headerName: 'STT',
      field: t.stt,
      cellRenderer: ({ rowIndex }) => rowIndex + 1,
      width: 40,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Kho nguồn',
      field: t.basketLocatorName,
      editable: false,
      cellStyle: params => makeDefaultCellStyle(params),
      cellRendererFramework: CellRenderer,
      suppressSizeToFit: true,
      width: 120,
      cellEditorFramework: MuiSelectEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        promiseOptions: (inputValue, callback) => {
          const filters = context.props.formik.values;
          onFetchBasketLocatorAC(filters, returnedData => {
            const filteredData = searchSelectOptions(inputValue, returnedData);
            callback(filteredData);
          });
        },
        onChange: selected => {
          const { formik } = context.props;

          const isDuplicated = checkDuplicatedRow(
            context,
            rowIndex,
            data,
            t.basketLocatorCode,
            selected,
            dispatch,
          );

          if (isDuplicated) {
            updateRowData(context, BASKET_INUSE_TABLE, rowIndex, data);
            return;
          }

          const updatedValues = {
            [t.basketLocatorCode]: selected.value,
            [t.basketLocatorName]: selected.label,
            [t.locatorType]: selected.locatorType,
            [t.inStockQuantityDiff]:
              data[t.palletBasketCode] &&
              data[t.cancelQuantity] &&
              isNumberString(data[t.cancelQuantity])
                ? -parseFloat(data[t.cancelQuantity] || '0')
                : null,
          };

          // update palletBasketCode & related fields if they are filled
          if (data[t.palletBasketCode]) {
            updateRowData(context, BASKET_INUSE_TABLE, rowIndex, updatedValues);
            onFetchBasketByLocatorAC(
              formik,
              selected.locatorType,
              '',
              baskets => {
                const [selectedBasket] = baskets.filter(
                  bs => bs && bs.value === data[t.palletBasketCode],
                );

                if (selectedBasket) {
                  updatedValues[t.inStockQuantity] = selectedBasket.inStock;
                  updatedValues[t.inStockQuantityDiff] =
                    data[t.cancelQuantity] &&
                    isNumberString(data[t.cancelQuantity])
                      ? parseFloat(updatedValues[t.inStockQuantity] || '0') -
                        parseFloat(data[t.cancelQuantity] || '0')
                      : null;
                } else {
                  updatedValues[t.palletBasketCode] = null;
                  updatedValues[t.inStockQuantity] = null;
                  updatedValues[t.uom] = null;
                  updatedValues[t.inStockQuantityDiff] = null;
                }

                updateRowData(
                  context,
                  BASKET_INUSE_TABLE,
                  rowIndex,
                  updatedValues,
                );

                setTimeout(() => onUpdateBasketsInUsePinnedData(formik));
              },
            );

            return;
          }

          updateRowData(context, BASKET_INUSE_TABLE, rowIndex, updatedValues);
        },
        parseValue: value => value || undefined,
      }),
    },
    {
      headerName: 'Mã khay sọt',
      field: t.palletBasketCode,
      editable: false,
      cellStyle: params => makeDefaultCellStyle(params),
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      suppressSizeToFit: true,
      width: 120,
      cellEditorFramework: CustomSelectCellEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        dependencies: [t.basketLocatorCode],
        timeout: 1000,
        promiseOptions: (inputValue, callback) => {
          const { formik } = context.props;
          const { basketLocatorCode } = data;
          if (basketLocatorCode)
            onFetchBasketByLocatorAC(
              formik,
              basketLocatorCode,
              inputValue,
              callback,
            );
        },
        onChange: selected => {
          const isDuplicated = checkDuplicatedRow(
            context,
            rowIndex,
            data,
            t.palletBasketCode,
            selected,
            dispatch,
          );

          const updatedValues = isDuplicated
            ? {
                [t.palletBasketCode]: null,
                [t.palletBasketName]: null,
                [t.inStockQuantityDiff]: null,
              }
            : {
                [t.palletBasketCode]: selected.value,
                [t.palletBasketName]: selected.palletBasketName,
                [t.inStockQuantity]: selected.inStock,
                [t.uom]: selected.uom,
                [t.inStockQuantityDiff]:
                  data[t.cancelQuantity] &&
                  isNumberString(data[t.cancelQuantity])
                    ? parseFloat(selected.inStock || '0') -
                      parseFloat(data[t.cancelQuantity] || '0')
                    : null,
              };

          updateRowData(context, BASKET_INUSE_TABLE, rowIndex, updatedValues);
        },
        parseValue: value => value || undefined,
      }),
    },
    {
      headerName: 'Tên khay sọt',
      field: t.palletBasketName,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
    },
    {
      headerName: 'SL huỷ tối đa',
      field: t.maxCancelQuantity,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
      hide: !isAutoReceipt,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
    },
    {
      headerName: 'SL tồn',
      field: t.inStockQuantity,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      hide: isAutoReceipt,
      cellStyle: alignRight,
      headerClass: 'ag-numeric-header',
    },

    {
      headerName: 'SL hủy',
      field: t.cancelQuantity,
      valueFormatter: numberCurrency,
      headerClass: isDraftSelected
        ? 'ag-numeric-header'
        : 'ag-numeric-header ag-header-required',
      editable: false,
      cellStyle: params => ({ ...makeDefaultCellStyle(params), ...alignRight }),

      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
      cellEditorParams: () => ({
        dependencies: [t.palletBasketCode],
      }),
      valueParser: numericParser,
      valueSetter: params => {
        const { data, node, newValue, context } = params;

        if ((newValue || newValue === 0) && isNumberString(newValue)) {
          if (parseFloat(newValue) > MAX_INT) {
            // if invalid input
            updateRowData(context, BASKET_INUSE_TABLE, node.rowIndex, {
              [t.cancelQuantity]: undefined,
              [t.inStockQuantityDiff]: null,
              [t.maxCancelQuantityDiff]: null,
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

          const updatedValues = {
            [t.cancelQuantity]: newValue,
            [t.inStockQuantityDiff]:
              parseFloat(data[t.inStockQuantity] || '0') -
              parseFloat(newValue || '0'),
            [t.maxCancelQuantityDiff]:
              parseFloat(data[t.maxCancelQuantity] || '0') -
              parseFloat(newValue || '0'),
          };

          updateRowData(
            context,
            BASKET_INUSE_TABLE,
            node.rowIndex,
            updatedValues,
          );
          return true;
        }

        // if invalid input
        updateRowData(context, BASKET_INUSE_TABLE, node.rowIndex, {
          [t.cancelQuantity]: isNumberString(newValue) ? newValue : undefined,
          [t.inStockQuantityDiff]: null,
          [t.maxCancelQuantityDiff]: null,
        });

        return true;
      },
    },
    {
      headerName: 'Chênh lệch (Tối đa - Huỷ)',
      field: t.maxCancelQuantityDiff,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      pinnedRowCellRendererParams: {
        style: { color: appTheme.palette.text.primary },
      },
      cellStyle: params => {
        const isNegative = typeof params.value === 'number' && params.value < 0;
        const isPositive = typeof params.value === 'number' && params.value > 0;

        let style = {};
        if (isNegative) style = { color: 'red', fontWeight: 'bold' };
        if (isPositive) style = { color: 'blue', fontWeight: 'bold' };

        return { ...style, ...alignRight };
      },
      headerClass: 'ag-numeric-header',
      hide: !isAutoReceipt,
    },
    {
      headerName: 'Chênh lệch (Tồn - Huỷ)',
      field: t.inStockQuantityDiff,
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRendererFramework: PinnedRowRenderer,
      cellStyle: params => {
        const isNegative = typeof params.value === 'number' && params.value < 0;

        let style = {};
        if (isNegative) style = { color: 'red', fontWeight: 'bold' };
        return { ...style, ...alignRight };
      },
      hide: isAutoReceipt,
    },
    {
      headerName: 'Đơn vị tính',
      field: t.uom,
      cellRendererFramework: CellRenderer,
    },
    {
      headerName: 'Nguyên nhân hủy',
      field: t.cause,
      resizable: false,
      suppressSizeToFit: true,
      width: 120,
      headerClass: isDraftSelected ? null : 'ag-header-required',
      editable: pageType.create || (pageType.edit && !isAutoReceipt),
      cellStyle: params => {
        if (pageType.create || pageType.edit) {
          return makeEditableCellStyle(params);
        }

        return makeDefaultCellStyle(params);
      },
      cellRendererFramework: CellRenderer,
      cellEditorFramework: MuiSelectInputEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        dependencies: [t.cause],
        timeout: 1000,
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
          const dataAsset = context.props.formik.values.assets.map(item => {
            if (
              data.cancelRequestBasketDetailCode ===
              item.cancelRequestBasketDetailCode
            ) {
              return {
                ...item,
                cause: selected.label,
                causeCode: selected.value,
              };
            }
            return {
              ...item,
            };
          });
          updateRowData(context, BASKET_INUSE_TABLE, rowIndex, updatedValues);
          context.props.formik.updateFieldValue(ASSET_TABLE, dataAsset, true);
        },
        parseValue: value => value || undefined,
      }),
    },
    {
      headerName: 'Tình trạng trước khi hủy',
      field: t.assetStatus,
      headerClass: isDraftSelected ? null : 'ag-header-required',
      editable: pageType.create || pageType.edit,
      cellStyle: params => {
        if (pageType.create || pageType.edit) {
          return makeEditableCellStyle(params);
        }

        return makeDefaultCellStyle(params);
      },
      cellRendererFramework: CellRenderer,
      cellEditorFramework: CustomCellEditor,
      cellEditorParams: () => ({
        dependencies: [t.palletBasketCode],
      }),
    },
    {
      headerName: 'Hình ảnh',
      field: t.images,
      editable: false, // edit directly in the CellRenderer
      // headerClass: 'ag-header-required',
      suppressSizeToFit: true,
      width: 120,
      cellStyle: params => {
        if (pageType.create || pageType.edit) {
          return makeEditableCellStyle(params);
        }

        return makeDefaultCellStyle(params);
      },
      cellRendererFramework: ImageUploadCellRenderer,
      cellRendererParams: ({ context }) => ({
        formik: context.props.formik,
        pageType,
        onOpenImagePopup,
        dispatch,
      }),
    },
    {
      headerName: 'Ghi chú',
      field: t.note,
      editable: pageType.create || (pageType.edit && !isAutoReceipt),
      cellStyle: params => {
        if (pageType.create || (pageType.edit && !isAutoReceipt)) {
          return makeEditableCellStyle(params);
        }

        return makeDefaultCellStyle(params);
      },
      cellRendererFramework: CellRenderer,
      cellEditorFramework: CustomCellEditor,
      cellEditorParams: () => ({
        dependencies: [t.palletBasketCode],
      }),
    },
    {
      headerName: '',
      field: 'actions',
      width: 100,
      editable: false,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionsRenderer,
      cellRendererParams: {
        onOpenDialogDelete,
        pageType,
        onOpenSelectAssetsPopup,
        onSetDataUseTable,
        onEditPopup,
        receiptData,
      },
      suppressNavigable: true,
      suppressSizeToFit: true,
    },
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
  context.props.formik.updateFieldArrayValue(tableId, rowIndex, updatedValues);
}

// function isLoadedFromServer(params) {
//   return getNested(params.data, 'isLoadedFromServer');
// }
