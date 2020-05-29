import { getColumnDefs } from 'utils/transformUtils';
import { formatToDecimal } from 'utils/numberUtils';

import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';

import CellRenderer from 'components/FormikUI/CellRenderer';
import { validateSetterColumns } from 'components/FormikUI/utils';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal, validInteger } from 'components/NumberFormatter/utils';

import ActionsRenderer from './ActionsRenderer';

import {
  numberParser,
  decimalParser,
  numberFormatter,
  calculateRealQuantity,
} from './utils';

import { ScaleSchema, BasketSchema, PalletSchema } from './Schema';

export const columns = {
  stt: {
    headerName: 'Lần Cân',
    width: 60,
    editable: false,
    cellRenderer: ({ rowIndex }) => rowIndex + 1,
    suppressSizeToFit: true,
  },
  baskets: {
    headerName: 'Khay Sọt',
    group: {
      basketCode: {
        headerName: 'Mã Sọt',
        field: 'basketCode',
        width: 80,
        editable: true,
        headerClass: 'ag-border-left',
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: ({ context, rowIndex, ...params }) => ({
          options: context.props.baskets,
          valueKey: 'basketCode',
          labelKey: 'basketCode',
          sublabelKey: 'basketName',
          isClearable: true,
          isSearchable: true,
          onChange: option => {
            let updaterData = {
              ...BasketSchema.cast(option || undefined),
              basketQuantity: 0,
            };

            const nextData = {
              ...params.data,
              ...updaterData,
            };

            updaterData = {
              ...updaterData,
              realQuantity: calculateRealQuantity(context, nextData),
            };

            params.api.clearFocusedCell();

            context.props.updateFieldArrayValue(
              context.props.turnScalesKey,
              rowIndex,
              updaterData,
            );
          },
        }),
        suppressSizeToFit: true,
      },
      basketName: {
        headerName: 'Tên Sọt',
        field: 'basketName',
        tooltipField: 'basketName',
      },
      basketQuantity: {
        headerName: 'Số Sọt',
        field: 'basketQuantity',
        width: 100,
        editable: params => {
          if (params.data.basketCode !== undefined) {
            return true;
          }
          return false;
        },
        headerClass: 'ag-border-right',
        valueParser: numberParser,
        valueFormatter: numberFormatter,
        cellEditorFramework: MuiInputEditor,
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
        editable: true,
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: ({ context, rowIndex, ...params }) => ({
          options: context.props.pallets,
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

            updaterData = {
              ...updaterData,
              realQuantity: calculateRealQuantity(context, nextData),
            };

            params.api.clearFocusedCell();

            context.props.updateFieldArrayValue(
              'turnToScales',
              rowIndex,
              updaterData,
            );
          },
        }),
        suppressSizeToFit: true,
      },
      palletName: {
        headerName: 'Tên Pallet',
        field: 'palletName',
        tooltipField: 'palletName',
      },
      palletQuantity: {
        headerName: 'Số Pallet',
        field: 'palletQuantity',
        width: 100,
        editable: params => {
          if (params.data.palletCode !== undefined) {
            return true;
          }
          return false;
        },
        headerClass: 'ag-border-right',
        valueParser: numberParser,
        valueFormatter: numberFormatter,
        cellEditorFramework: MuiInputEditor,
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
  quantity: {
    headerName: 'Khối Lượng Cân (*)',
    field: 'quantity',
    editable: true,
    valueParser: decimalParser,
    valueFormatter: numberFormatter,
    cellEditorFramework: MuiInputEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
        inputProps: {
          isAllowed: validDecimal,
        },
      },
    },
  },
  realQuantity: {
    headerName: 'Khối Lượng Thực',
    field: 'realQuantity',
    minWidth: 50,
    valueFormatter: numberFormatter,
    cellRendererFramework: CellRenderer,
  },
  actions: {
    headerName: '',
    field: 'actions',
    width: 30,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    suppressNavigable: true,
    suppressSizeToFit: true,
  },
};

export const columnDefs = getColumnDefs(columns, {});

export const defaultColDef = {
  editable: false,
  resizable: false,
  valueSetter: params => {
    if (validateSetterColumns(params, ['basketCode', 'palletCode'])) {
      let updaterData = {
        realQuantity: undefined,
        [params.colDef.field]: params.newValue,
      };

      if (
        params.data.quantity === undefined &&
        params.data.basketCode === undefined &&
        params.data.palletCode === undefined
      ) {
        updaterData = {
          ...ScaleSchema.cast({
            quantity: null,
            basketCode: null,
            palletCode: null,
          }),
          ...updaterData,
        };
        if (params.colDef.field === 'quantity') {
          updaterData = {
            ...updaterData,
            realQuantity: formatToDecimal(updaterData.quantity),
          };
        }
      } else {
        const nextData = {
          ...params.data,
          ...updaterData,
        };

        updaterData = {
          ...updaterData,
          realQuantity: calculateRealQuantity(params.context, nextData),
        };
      }

      params.context.props.setFieldTouched(
        `${params.context.props.turnScalesKey}[${
          params.node.rowIndex
        }]realQuantity`,
        true,
        false,
      );
      params.context.props.updateFieldArrayValue(
        params.context.props.turnScalesKey,
        params.node.rowIndex,
        updaterData,
      );
      return true;
    }

    return false;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
  cellRendererFramework: undefined,
};
