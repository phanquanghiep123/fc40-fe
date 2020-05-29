import { formatToNumber, formatToDecimal } from 'utils/numberUtils';

import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';

import { getColumnDefs } from 'utils/transformUtils';
import NumberFormatter from 'components/NumberFormatter';
import { validInteger, validDecimal } from 'components/NumberFormatter/utils';
import { getIn } from 'formik';
import { BasketSchema, PalletSchema, ScaleSchema } from '../Schema';
import { TYPE_BASE_UNIT } from '../constants';
import ActionsRenderer from '../ActionRenderer';

export const numericParser = params =>
  formatToNumber(params.newValue) || undefined;

export const decimalParser = params =>
  formatToDecimal(params.newValue) || undefined;

export const numberFormatter = params => formatToNumber(params.value) || '';
export const orderNumberRenderer = ({ rowIndex }) => rowIndex + 1;
const columns = {
  stt: {
    headerName: 'Lần Cân',
    width: 60,
    editable: false,
    cellRendererFramework: orderNumberRenderer,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  baskets: {
    headerName: 'Khay Sọt',
    group: {
      palletBasketCode: {
        headerName: 'Mã Sọt',
        field: 'palletBasketCode',
        width: 80,
        editable: params => !params.data.edited,
        headerClass: 'ag-border-left',
        cellEditorFramework: MuiSelectInputEditor,
        cellRendererFramework: CellRenderer,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorParams: ({ context, rowIndex, ...params }) => ({
          options: context.props.data.baskets,
          valueKey: 'palletBasketCode',
          labelKey: 'palletBasketCode',
          sublabelKey: 'palletBasketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            let updaterData = {
              ...BasketSchema.cast(option || undefined),
              palletBasketQuantity: 0,
            };
            const nextData = {
              ...params.data,
              ...updaterData,
            };
            const quantityValue = formatToNumber(nextData.scalesWeight);

            if (quantityValue > 0) {
              const baseUoM = getIn(context.props.formik.values, [
                'productCode',
                'uom',
              ]);
              if (baseUoM === TYPE_BASE_UNIT.KG) {
                const otherValue =
                  formatToNumber(nextData.basketWeight) *
                    formatToNumber(nextData.palletBasketQuantity) +
                  formatToNumber(nextData.palletWeight) *
                    formatToNumber(nextData.palletQuantity);

                if (quantityValue >= otherValue) {
                  updaterData = {
                    ...updaterData,
                    realWeight: formatToDecimal(quantityValue - otherValue),
                  };
                }
              } else {
                updaterData = {
                  ...updaterData,
                  realWeight: formatToDecimal(quantityValue),
                };
              }
            }
            params.api.clearFocusedCell();
            context.props.formik.updateFieldArrayValue(
              'turnToScale',
              rowIndex,
              updaterData,
            );
          },
        }),
      },
      palletBasketName: {
        headerName: 'Tên Sọt',
        field: 'palletBasketName',
        tooltipField: 'palletBasketName',
        cellEditorFramework: MuiInputEditor,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      palletBasketQuantity: {
        headerName: 'Số Sọt',
        field: 'palletBasketQuantity',
        editable: params => {
          if (params.data.palletBasketCode) {
            return true;
          }
          return false;
        },
        width: 100,
        headerClass: 'ag-border-right',
        cellEditorFramework: MuiInputEditor,
        cellRendererFramework: CellRenderer,
        valueParser: numericParser,
        valueFormatter: numberFormatter,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        },
      },
    },
  },
  pallets: {
    headerName: 'Pallet',
    group: {
      palletCode: {
        headerName: 'Mã Pallet',
        field: 'palletCode',
        width: 80,
        editable: params => !params.data.edited,
        cellEditorFramework: MuiSelectInputEditor,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        cellEditorParams: ({ context, rowIndex, ...params }) => ({
          options: context.props.data.pallets,
          valueKey: 'palletCode',
          labelKey: 'palletCode',
          sublabelKey: 'palletName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            let updaterData = {
              ...PalletSchema.cast(option || undefined),
              palletQuantity: 0,
            };

            const nextData = {
              ...params.data,
              ...updaterData,
            };
            const quantityValue = formatToNumber(nextData.scalesWeight);
            if (quantityValue > 0) {
              const baseUoM = getIn(context.props.formik.values, [
                'productCode',
                'uom',
              ]);
              if (baseUoM === TYPE_BASE_UNIT.KG) {
                const otherValue =
                  formatToNumber(nextData.basketWeight) *
                    formatToNumber(nextData.palletBasketQuantity) +
                  formatToNumber(nextData.palletWeight) *
                    formatToNumber(nextData.palletQuantity);

                if (quantityValue >= otherValue) {
                  updaterData = {
                    ...updaterData,
                    realWeight: formatToDecimal(quantityValue - otherValue),
                  };
                }
              } else {
                updaterData = {
                  ...updaterData,
                  realWeight: formatToDecimal(quantityValue),
                };
              }
            }
            params.api.clearFocusedCell();
            context.props.formik.updateFieldArrayValue(
              'turnToScale',
              rowIndex,
              updaterData,
            );
          },
        }),
      },
      palletName: {
        headerName: 'Tên Pallet',
        field: 'palletName',
        tooltipField: 'palletName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      palletQuantity: {
        headerName: 'Số Pallet',
        field: 'palletQuantity',
        editable: params => {
          if (params.data.palletCode) {
            return true;
          }
          return false;
        },
        width: 100,
        headerClass: 'ag-border-right',
        cellEditorFramework: MuiInputEditor,
        cellRendererFramework: CellRenderer,
        valueParser: numericParser,
        valueFormatter: numberFormatter,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        },
      },
    },
  },
  scalesWeight: {
    headerName: 'Khối Lượng Cân (*)',
    field: 'scalesWeight',
    editable: params => !params.data.edited,
    valueParser: decimalParser,
    cellEditorFramework: MuiInputEditor,
    cellRendererFramework: CellRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validDecimal,
        },
      },
    },
  },
  realWeight: {
    headerName: 'Khối Lượng Thực',
    field: 'realWeight',
    minWidth: 50,
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiInputEditor,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  actions: {
    headerName: '',
    field: 'actions',
    width: 30,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    suppressNavigable: true,
    suppressSizeToFit: true,
  },
};
export const columnDefs = getColumnDefs(columns);
export const defaultColDef = {
  editable: false,
  resizable: false,
  valueSetter: params => {
    let updaterData = {
      realWeight: undefined,
      [params.colDef.field]: params.newValue,
    };
    if (
      params.data.scalesWeight === undefined &&
      params.data.palletBasketCode === undefined &&
      params.data.palletCode === undefined
    ) {
      updaterData = {
        ...ScaleSchema.cast({
          scalesWeight: null,
          palletBasketCode: null,
          palletCode: null,
        }),
        ...updaterData,
      };
      if (params.colDef.field === 'scalesWeight') {
        updaterData = {
          ...updaterData,
          realWeight: formatToDecimal(updaterData.scalesWeight) || undefined,
        };
      }
    } else {
      const nextData = {
        ...params.data,
        ...updaterData,
      };
      const quantityValue = formatToNumber(nextData.scalesWeight);
      if (quantityValue > 0) {
        const baseUoM = getIn(params.context.props.formik.values, [
          'productCode',
          'uom',
        ]);
        if (baseUoM === TYPE_BASE_UNIT.KG) {
          const otherValue =
            formatToNumber(nextData.basketWeight) *
              formatToNumber(nextData.palletBasketQuantity) +
            formatToNumber(nextData.palletWeight) *
              formatToNumber(nextData.palletQuantity);
          if (quantityValue >= otherValue) {
            updaterData = {
              ...updaterData,
              realWeight: formatToDecimal(quantityValue - otherValue),
            };
          } else {
            const headerName = params.colDef.headerName
              .replace('(*)', '')
              .replace('(kg)', '')
              .trim();

            const message = `Khối Lượng Thực không được âm, vui lòng ${
              params.colDef.field !== 'scalesWeight'
                ? 'thay đổi Khối Lượng Cân trước khi'
                : ''
            } nhập lại ${headerName}`;

            params.context.props.showWarning(message);
            return false;
          }
        } else {
          updaterData = {
            ...updaterData,
            realWeight: formatToDecimal(quantityValue),
          };
        }
      }
    }

    params.context.props.formik.updateFieldArrayValue(
      'turnToScale',
      params.node.rowIndex,
      updaterData,
    );
    return true;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
  cellRendererFramework: undefined,
};
