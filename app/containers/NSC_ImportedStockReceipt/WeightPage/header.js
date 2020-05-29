import { getIn } from 'formik';

import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import { getColumnDefs } from 'utils/transformUtils';

import CellRenderer from 'components/FormikUI/CellRenderer';

import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';

import NumberFormatter from 'components/NumberFormatter';
import { validInteger, validDecimal } from 'components/NumberFormatter/utils';

import MuiSelectEditor from 'components/MuiSelect/Editor';
import ActionsRenderer from './ActionsRenderer';

import { ScaleSchema, BasketSchema, PalletSchema } from './Schema';

import { TYPE_BASE_UNIT, TYPE_PROCESSING } from './constants';

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

export const orderNumberRenderer = ({ rowIndex }) => rowIndex + 1;

export const columns = {
  stt: {
    headerName: 'Lần Cân',
    width: 60,
    editable: false,
    cellRenderer: orderNumberRenderer,
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
        valueSetter: params => {
          if (params.newValue) {
            return true;
          }
          return false;
        },
        cellEditorFramework: MuiSelectInputEditor,
        cellRendererFramework: CellRenderer,
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
            const quantityValue = formatToNumber(nextData.quantity);

            if (quantityValue > 0) {
              const baseUoM = getIn(context.props.values, 'baseUoM');

              if (baseUoM === TYPE_BASE_UNIT.KG) {
                const otherValue =
                  formatToNumber(nextData.basketWeight) *
                    formatToNumber(nextData.basketQuantity) +
                  formatToNumber(nextData.palletWeight) *
                    formatToNumber(nextData.palletQuantity);

                if (quantityValue >= otherValue) {
                  updaterData = {
                    ...updaterData,
                    realQuantity: formatToDecimal(quantityValue - otherValue),
                  };
                }
              } else {
                updaterData = {
                  ...updaterData,
                  realQuantity: formatToDecimal(quantityValue),
                };
              }
            }

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
        valueParser: numericParser,
        valueFormatter: numberFormatter,
        cellEditorFramework: MuiInputEditor,
        cellRendererFramework: CellRenderer,
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
        valueSetter: params => {
          if (params.newValue) {
            return true;
          }
          return false;
        },
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
            const quantityValue = formatToNumber(nextData.quantity);

            if (quantityValue > 0) {
              const baseUoM = getIn(context.props.values, 'baseUoM');

              if (baseUoM === TYPE_BASE_UNIT.KG) {
                const otherValue =
                  formatToNumber(nextData.basketWeight) *
                    formatToNumber(nextData.basketQuantity) +
                  formatToNumber(nextData.palletWeight) *
                    formatToNumber(nextData.palletQuantity);

                if (quantityValue >= otherValue) {
                  updaterData = {
                    ...updaterData,
                    realQuantity: formatToDecimal(quantityValue - otherValue),
                  };
                }
              } else {
                updaterData = {
                  ...updaterData,
                  realQuantity: formatToDecimal(quantityValue),
                };
              }
            }

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
        valueParser: numericParser,
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

const customerColumn = {
  stt: columns.stt,
  baskets: columns.baskets,
  pallets: columns.pallets,
  quantity: columns.quantity,
  realQuantity: columns.realQuantity,
  customerName: {
    headerName: 'Khách Hàng',
    field: 'customerName',
    minWidth: 50,
    editable: ({ data, context }) => {
      if (data && data.quantity) {
        const processingType = getIn(context.props.values, 'processingType');
        if (processingType !== TYPE_PROCESSING.LUU_KHO) {
          return true;
        }
      }
      return false;
    },
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
    cellEditorParams: ({ context, rowIndex, data }) => ({
      valueKey: 'customerName',
      labelKey: 'customerName',
      isClearable: true,
      promiseOptions: context.props.getCustomerAuto,
      onChange: option => {
        let newValue = null;
        if (option) {
          newValue = {
            ...data,
            customerCode: option.customerCode,
            customerName: option.customerName,
          };
        } else {
          newValue = { ...data, customerCode: '', customerName: '' };
        }
        context.props.updateFieldArrayValue('turnToScales', rowIndex, newValue);
      },
    }),
  },
  actions: columns.actions,
};

export const columnDefs = getColumnDefs(customerColumn);

export const defaultColDef = {
  editable: false,
  resizable: false,
  valueSetter: params => {
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
      const quantityValue = formatToNumber(nextData.quantity);

      if (quantityValue > 0) {
        const baseUoM = getIn(params.context.props.values, 'baseUoM');

        if (baseUoM === TYPE_BASE_UNIT.KG) {
          const otherValue =
            formatToNumber(nextData.basketWeight) *
              formatToNumber(nextData.basketQuantity) +
            formatToNumber(nextData.palletWeight) *
              formatToNumber(nextData.palletQuantity);

          if (quantityValue >= otherValue) {
            updaterData = {
              ...updaterData,
              realQuantity: formatToDecimal(quantityValue - otherValue),
            };
          } else {
            const headerName = params.colDef.headerName
              .replace('(*)', '')
              .replace('(kg)', '')
              .trim();

            const message = `Khối Lượng Thực không được âm, vui lòng ${
              params.colDef.field !== 'quantity'
                ? 'thay đổi Khối Lượng Cân trước khi'
                : ''
            } nhập lại ${headerName}`;

            params.context.props.showWarning(message);
            return false;
          }
        } else {
          updaterData = {
            ...updaterData,
            realQuantity: formatToDecimal(quantityValue),
          };
        }
      }
    }

    params.context.props.updateFieldArrayValue(
      'turnToScales',
      params.node.rowIndex,
      updaterData,
    );
    return true;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
  cellRendererFramework: undefined,
};
