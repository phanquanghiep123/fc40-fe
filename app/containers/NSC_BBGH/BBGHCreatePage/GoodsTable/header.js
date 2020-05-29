/* eslint-disable prefer-const */
import { getIn } from 'formik';

import {
  getColumnDefs,
  transformAsyncOptionsWithParams,
} from 'utils/transformUtils';

import SelectRenderer from 'components/FormikUI/SelectRenderer';
import CheckboxRenderer from 'components/FormikUI/CheckboxRenderer';

import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';

import NumberFormatter from 'components/NumberFormatter';
import { validInteger } from 'components/NumberFormatter/utils';

import ActionsRenderer from './ActionsRenderer';

import {
  initSchema,
  productSchema,
  originalProductSchema,
} from '../section4Schema';

import {
  getColumnDef,
  numericParser,
  decimalParser,
  getBasketOrder,
  numericFormatter,
  percentFormatter,
} from './utils';

import { TYPE_USER_EDIT } from '../../BBGHEditPage/constants';
import { TYPE_BBGH, TYPE_MATERIAL, TYPE_SUPERVIOR } from '../constants';

export const basketEditorParams = ({ context, rowIndex, ...params }) => ({
  options: context.props.baskets,
  valueKey: 'basketCode',
  labelKey: 'basketCode',
  sublabelKey: 'basketName',
  isClearable: true,
  isSearchable: true,
  validBeforeChange: option => {
    if (option) {
      const basketOrder = getBasketOrder(params.colDef.field);

      const nextData = {
        ...params.data,
        [`basketCode${basketOrder}`]: option.basketCode,
      };

      if (
        (nextData.basketCode1 &&
          nextData.basketCode1 === nextData.basketCode2) ||
        (nextData.basketCode1 &&
          nextData.basketCode1 === nextData.basketCode3) ||
        (nextData.basketCode2 && nextData.basketCode2 === nextData.basketCode3)
      ) {
        context.props.onAlertInvalidWhenSubmit(
          'Loại khay sọt đã đươc lựa chọn',
        );
        return false;
      }
    }
    return true;
  },
  onChange: option => {
    const basketOrder = getBasketOrder(params.colDef.field);
    const nextData = {
      [`basketCode${basketOrder}`]: option ? option.basketCode : 0,
      [`basketShortName${basketOrder}`]: option ? option.basketName : '',
      [`deliverQuantity${basketOrder}`]: option ? 0 : null,
      [`basketUoM${basketOrder}`]: option ? option.basketUoM : null,
    };

    context.props.updateFieldArrayValue('stockList', rowIndex, nextData);
  },
});

export const defaultEditable = params => {
  const rowData = params.data;

  if (rowData.productionOrder !== undefined) {
    return true;
  }
  return false;
};

export const QLNHEditable = ({ context }) => {
  if (context.isQLNH()) {
    return false;
  }
  return true;
};

export const basketEditable = params => {
  if (defaultEditable(params)) {
    // const doType = getIn(params.context.props.values, 'doType');
    // if (doType === TYPE_BBGH.FARM_POST_HARVEST) {
    //   return false;
    // }
    return QLNHEditable(params);
  }
  return false;
};

export const quantityEditable = params => {
  const rowData = params.data;
  const basketOrder = getBasketOrder(params.colDef.field);
  if (rowData[`basketCode${basketOrder}`]) {
    return true;
  }
  return false;
};

export const transcodingDisable = ({ context, rowIndex, ...params }) => {
  const rowData = params.data;

  if (rowData) {
    if (rowData.deliveryOrderId >= 0) {
      const typeUser = context.getTypeUser();

      if (rowData.isInScale) {
        return true;
      }

      if (typeUser === TYPE_USER_EDIT.DELIVER) {
        return false;
      }

      if (typeUser === TYPE_USER_EDIT.RECIVER) {
        return true;
      }

      if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
        return false;
      }
    }

    if (rowData.productionOrder) {
      return false;
    }
  }

  return true;
};

export const finishProductEditable = ({ data }) => {
  if (data && data.doConnectingId) {
    if (!data.isInScale && !data.receivingStockFlag) {
      return true;
    }
  }
  return false;
};

export const columns = {
  stt: {
    headerName: 'STT',
    field: 'stt',
    width: 40,
    editable: false,
    suppressNavigable: true,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customHiddenCellData',
  },
  isTranscoding: {
    headerName: 'CM',
    field: 'isTranscoding',
    hide: true,
    width: 25,
    editable: false,
    cellStyle: {
      paddingTop: '2px !important',
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
    headerClass: 'ag-header-small',
    headerTooltip: 'Chuyển mã',
    cellRendererFramework: CheckboxRenderer,
    cellRendererParams: ({ context, rowIndex, ...params }) => ({
      disabled: transcodingDisable({ context, rowIndex, ...params }),
      onChange: isChecked => {
        let rowData = getIn(context.props.values, ['stockList', rowIndex]);
        let nextData = {};
        if (isChecked) {
          // Mã đi hàng, Tên SP, Loại SP hiển thị trắng
          nextData = {
            isTranscoding: true,

            // Reset
            ...productSchema.cast(),
          };

          // Delay before start editing
          setTimeout(() => {
            params.api.startEditingCell({
              rowIndex,
              colKey: getColumnDef(params, 'doConnectingId'),
            });
          });
        } else {
          // Mã đi hàng, Tên SP, Loại SP hiển thị ứng với LSX
          nextData = {
            isTranscoding: false,

            ...productSchema.cast({
              doConnectingId: rowData.originalCode,
              productType: rowData.originalType,
              productTypeName: rowData.originalTypeName,
              materialDescription: rowData.originalDescription,
            }),

            productionSupervior: TYPE_SUPERVIOR.NONE,
          };
        }

        context.props.updateFieldArrayValue('stockList', rowIndex, nextData);
      },
    }),
    suppressNavigable: true,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customHiddenCellData',
  },
  productionOrder: {
    headerName: 'LSX',
    field: 'productionOrder',
    width: 90,
    editable: true,
    headerClass: 'ag-header-required',
    tooltipField: 'productionOrder',
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ context, rowIndex }) => ({
      valueKey: 'farmProdOrderCode',
      labelKey: 'farmProdOrderCode',
      sublabelKey: 'slotNumber',
      defaultOptions: false,
      promiseOptions: transformAsyncOptionsWithParams(
        context.props.onGetProdOrderAuto,
        {
          unitCode: getIn(context.props.values, 'deliverCode'),
          unitCodeReceived: getIn(context.props.values, 'receiverCode'),
        },
        null,
      ),
      onChange: ({
        farmProdOrderCode,
        productCode,
        productType,
        productTypeName,
        pvCode,
        materialDescription,
        grade,
        materialTypeCode,
        baseUoM,
      }) => {
        let updaterData = {
          isTranscoding: false,
          productionOrder: farmProdOrderCode,
          doConnectingId: productCode,
          productType,
          productTypeName,
          materialDescription,
          plannedTotalQuatity: null,
          farmQcRecoveryRate: null,

          pvCode,
          baseUoM,

          ...originalProductSchema.cast({
            originalCode: productCode,
            originalType: productType,
            originalTypeName: productTypeName,
            originalDescription: materialDescription,
          }),

          productionSupervior: TYPE_SUPERVIOR.NONE,
        };

        let processingType = context.getDefaultProcessType(
          grade,
          materialTypeCode,
        );

        const updaterTouched = {
          doConnectingId: true,
          processingType: true,
        };

        if (processingType) {
          updaterData = {
            ...updaterData,
            processingType: processingType.value,
            processingTypeName: processingType.label,
          };
        }
        context.props.updateFieldArrayValue('stockList', rowIndex, updaterData);
        context.props.updateFieldArrayTouched(
          'stockList',
          rowIndex,
          updaterTouched,
        );
      },
    }),
    suppressSizeToFit: true,
  },
  doConnectingId: {
    headerName: 'Mã Đi Hàng',
    field: 'doConnectingId',
    width: 85,
    editable: true,
    headerClass: 'ag-header-required',
    tooltipField: 'doConnectingId',
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ context, rowIndex }) => {
      let requestParams = {
        unitCode: getIn(context.props.values, 'deliverCode'),
        unitCodeReceived: getIn(context.props.values, 'receiverCode'),
      };
      let productionOrder = getIn(context.props.values, [
        'stockList',
        rowIndex,
        'productionOrder',
      ]);

      if (context.isQLNH()) {
        requestParams = {
          ...requestParams,
          isNCC: true,
          materialType: TYPE_MATERIAL.NCC,
        };
      } else {
        requestParams = {
          ...requestParams,
          isNCC: false,
        };

        if (productionOrder) {
          requestParams = {
            ...requestParams,
            isTranscoding: getIn(context.props.values, [
              'stockList',
              rowIndex,
              'isTranscoding',
            ]),
          };
        }
      }

      return {
        valueKey: 'productCode',
        labelKey: 'productCode',
        sublabelKey: 'materialDescription',
        defaultOptions: false,
        promiseOptions: transformAsyncOptionsWithParams(
          context.props.onGetFarmProductAuto,
          requestParams,
          null,
        ),
        onChange: ({
          farmProdOrderCode,
          productCode,
          productType,
          productTypeName,
          materialDescription,
          pvCode,
          grade,
          materialTypeCode,
          baseUoM,
          finishProducts,
        }) => {
          let updaterData = {
            baseUoM,
            productType,
            finishProducts,
            productTypeName,
            materialDescription,
            finishProductCode: null,
            finishProductName: '',
            productionSupervior: TYPE_SUPERVIOR.BY_CODE,
          };
          let isTranscoding = getIn(context.props.values, [
            'stockList',
            rowIndex,
            'isTranscoding',
          ]);
          let processingType = context.getDefaultProcessType(
            grade,
            materialTypeCode,
          );

          if (processingType) {
            updaterData = {
              ...updaterData,
              processingType: processingType.value,
              processingTypeName: processingType.label,
            };
          }

          if (!isTranscoding) {
            updaterData = {
              ...updaterData,
              productionSupervior: TYPE_SUPERVIOR.BY_PRODUCT,
            };
          }
          if (!productionOrder) {
            updaterData = {
              ...updaterData,

              productionOrder: farmProdOrderCode,
              pvCode,

              ...originalProductSchema.cast({
                originalCode: productCode,
                originalType: productType,
                originalTypeName: productTypeName,
                originalDescription: materialDescription,
                doConnectingId: productCode,
              }),
            };
          }

          if (finishProducts && finishProducts.length === 1) {
            updaterData = {
              ...updaterData,
              finishProductCode: finishProducts[0].productCode,
              finishProductName: finishProducts[0].materialDescription,
            };
          }

          context.props.updateFieldArrayValue(
            'stockList',
            rowIndex,
            updaterData,
          );
        },
      };
    },
    suppressSizeToFit: true,
  },
  materialDescription: {
    headerName: 'Tên Sản Phẩm',
    field: 'materialDescription',
    editable: false,
    minWidth: 180,
    maxWidth: 360,
    tooltipField: 'materialDescription',
  },
  productTypeName: {
    headerName: 'Loại Sản Phẩm',
    field: 'productTypeName',
    editable: false,
    minWidth: 65,
    maxWidth: 80,
    cellClass: 'cell-nowrap-text',
    headerClass: 'ag-header-required',
  },
  finishProductCode: {
    headerName: 'Mã TP',
    field: 'finishProductCode',
    hide: true,
    width: 90,
    editable: finishProductEditable,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ context, data, rowIndex }) => ({
      valueKey: 'productCode',
      labelKey: 'productCode',
      sublabelKey: 'materialDescription',
      isClearable: true,
      isSearchable: false,
      defaultOptions: data.finishProducts || true,
      promiseOptions: (inputText, callback) => {
        const params = {
          productCode: data.doConnectingId,
          unitCodeReceived: getIn(context.props.values, 'receiverCode'),
        };
        context.props.onGetFinishProductsAuto(params, inputText, callback);
      },
      onChange: option => {
        const updaterData = {
          finishProductCode: option ? option.productCode : null,
          finishProductName: option ? option.materialDescription : '',
        };
        context.props.updateFieldArrayValue('stockList', rowIndex, updaterData);
      },
    }),
    suppressSizeToFit: true,
  },
  slotCode: {
    headerName: 'Batch',
    field: 'slotCode',
    hide: true,
    minWidth: 95,
    maxWidth: 95,
    editable: false,
  },
  processingType: {
    headerName: 'Phân Loại Xử Lý',
    field: 'processingType',
    minWidth: 70,
    maxWidth: 80,
    headerClass: 'ag-header-required',
    cellEditorFramework: MuiInputEditor,
    cellRendererFramework: SelectRenderer,
    cellEditorParams: ({ context, rowIndex }) => ({
      select: true,
      options: context.props.processTypes,
      onChange: option => {
        const nextData = {
          processingType: option.value,
          processingTypeName: option.label,
        };

        context.props.updateFieldArrayValue('stockList', rowIndex, nextData);
      },
    }),
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  plannedTotalQuatity: {
    headerName: 'Tổng Lượng Dự Kiến',
    field: 'plannedTotalQuatity',
    minWidth: 80,
    maxWidth: 100,
    headerClass: 'ag-header-required',
    valueParser: decimalParser,
    valueFormatter: numericFormatter,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: {
      type: 'number',
      inputProps: { min: 0, max: 100000 },
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  totalReceivingWeight: {
    headerName: 'Tổng Lượng Thực Tế',
    field: 'totalReceivingWeight',
    minWidth: 80,
    maxWidth: 90,
    editable: false,
    valueFormatter: numericFormatter,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  palletBaskets: {
    headerName: 'Thông Tin Khay Sọt',
    group: {
      basketShortName1: {
        headerName: 'Tên',
        field: 'basketShortName1',
        tooltipField: 'basketShortName1',
        editable: basketEditable,
        minWidth: 50,
        maxWidth: 100,
        cellClass: 'cell-nowrap-text',
        headerClass: 'ag-border-left',
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: basketEditorParams,
      },
      deliverQuantity1: {
        headerName: 'SL',
        field: 'deliverQuantity1',
        width: 40,
        editable: quantityEditable,
        valueParser: numericParser,
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        },
        suppressSizeToFit: true,
      },
      basketShortName2: {
        headerName: 'Tên',
        field: 'basketShortName2',
        tooltipField: 'basketShortName2',
        editable: basketEditable,
        minWidth: 50,
        maxWidth: 100,
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: basketEditorParams,
      },
      deliverQuantity2: {
        headerName: 'SL',
        field: 'deliverQuantity2',
        width: 40,
        editable: quantityEditable,
        valueParser: numericParser,
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        },
        suppressSizeToFit: true,
      },
      basketShortName3: {
        headerName: 'Tên',
        field: 'basketShortName3',
        tooltipField: 'basketShortName3',
        editable: basketEditable,
        minWidth: 50,
        maxWidth: 100,
        cellEditorFramework: MuiSelectInputEditor,
        cellEditorParams: basketEditorParams,
      },
      deliverQuantity3: {
        headerName: 'SL',
        field: 'deliverQuantity3',
        width: 40,
        editable: quantityEditable,
        headerClass: 'ag-border-right',
        valueParser: numericParser,
        cellEditorFramework: MuiInputEditor,
        cellEditorParams: {
          InputProps: {
            inputComponent: NumberFormatter,
            inputProps: {
              isAllowed: validInteger,
            },
          },
        },
        suppressSizeToFit: true,
      },
    },
  },
  farmQcRecoveryRate: {
    headerName: 'Tỉ Lệ Thu Hồi Dự Kiến QC Farm',
    field: 'farmQcRecoveryRate',
    minWidth: 80,
    maxWidth: 110,
    headerClass: 'ag-header-required',
    valueParser: numericParser,
    valueFormatter: percentFormatter,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: {
      type: 'number',
      inputProps: { min: 0, max: 100, step: 1 },
    },
  },
  processorQcRecoveryRate: {
    headerName: 'Tỉ Lệ Thu Hồi Dự Kiến QC NSC',
    field: 'processorQcRecoveryRate',
    editable: false,
    minWidth: 80,
    maxWidth: 110,
    headerClass: 'ag-header-required',
    valueParser: numericParser,
    valueFormatter: percentFormatter,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: {
      type: 'number',
      inputProps: { min: 0, max: 100, step: 1 },
    },
  },
  notes: {
    headerName: 'Ghi Chú',
    field: 'notes',
    tooltipField: 'notes',
    minWidth: 45,
    cellEditorFramework: MuiInputEditor,
    cellEditorParams: {
      inputProps: { maxLength: 50 },
    },
  },
  actions: {
    headerName: '',
    field: 'actions',
    width: 60,
    editable: false,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    suppressNavigable: true,
    suppressSizeToFit: true,
  },
};

export const columnDefs = getColumnDefs(columns, {});

export const defaultColDef = {
  editable: defaultEditable,
  resizable: false,
  valueSetter: params => {
    let updaterData = {
      [params.colDef.field]: params.newValue,
    };

    if (params.data.productionOrder === undefined) {
      updaterData = {
        ...initSchema,
        ...updaterData,
      };

      if (!updaterData.productionOrder && !updaterData.doConnectingId) {
        return false;
      }
    }

    params.context.props.updateFieldArrayValue(
      'stockList',
      params.node.rowIndex,
      updaterData,
    );
    return true;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
};
