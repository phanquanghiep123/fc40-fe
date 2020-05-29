/* eslint-disable indent */
import InputEditor from 'components/MuiInput/Editor';
import NumberFormatter from '../../../../components/NumberFormatter';
import MuiSelectEditor from '../../../../components/MuiSelect/Editor';
import CellRenderer from './CustomCellRenderer';
import CustomCellEditor from './CustomCellEditor';
import appTheme from '../../../App/theme';
import { validateBaskets } from '../utils';
import ActionsRenderer from './ActionsRenderer';

const editableCellStyle = {
  background: appTheme.palette.background.default,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
};

export const defaultColDef = {
  editable: false,
  resizable: false,
  suppressMovable: true,
  cellEditorFramework: CustomCellEditor,
  cellRendererFramework: undefined,
};

/**
 * Make columnDefs
 * @param onFetchBasketAutocomplete
 * @param customerPromise
 * @param handleRowDeletion
 * @returns {*[]}
 */
export const makeColumnDefs = (
  onFetchBasketAutocomplete,
  customerPromise,
  handleRowDeletion,
) => [
  {
    headerName: 'STT',
    field: 'stt',
    cellRenderer: ({ rowIndex }) => rowIndex + 1,
    width: 40,
    suppressSizeToFit: true,
  },
  {
    headerName: 'Cửa hàng',
    field: 'storeCode',
    editable: props => props.data.isManuallyAdded,
    cellStyle: props => (props.data.isManuallyAdded ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ context, rowIndex }) => ({
      isClearable: true,
      promiseOptions: customerPromise,
      validBeforeChange: selected => {
        if (!selected) return true;

        const addedRows = context.props.formik.values.tableData.filter(
          item => item.isManuallyAdded,
        );

        for (let i = 0; i < addedRows.length; i += 1) {
          if (addedRows[i].storeCode === selected.value) {
            context.props.onShowWarning('Cửa hàng đã được lựa chọn');
            return false;
          }
        }

        return true;
      },
      onChange: selected => {
        const { updateFieldArrayValue } = context.props.formik;
        const productData = {
          ...(selected
            ? {
                storeCode: selected.value,
                storeName: selected.label,
                route: selected.route,
                soldTo: selected.soldTo,
              }
            : {
                storeCode: '',
                storeName: '',
                route: '',

                basketCode1: null,
                basketName1: '',
                quantity1: null,

                basketCode2: null,
                basketName2: '',
                quantity2: null,

                basketCode3: null,
                basketName3: '',
                quantity3: null,

                note: '',
              }),
        };

        updateFieldArrayValue('tableData', rowIndex, productData);

        /* Autofill default basket */
        onFetchBasketAutocomplete('', basketData => {
          const defaultBasket = basketData ? basketData[0] : null;

          if (defaultBasket) {
            const productData2 = {
              ...productData,
              basketCode1: defaultBasket.value,
              basketName1: defaultBasket.label,
              quantity1: 0,
            };

            updateFieldArrayValue('tableData', rowIndex, productData2);
          }
        });
      },
      parseValue: value => value || undefined,
    }),
  },
  {
    headerName: 'Tên cửa hàng',
    field: 'storeName',
  },
  {
    headerName: 'Tuyến',
    field: 'route',
  },
  {
    headerName: 'Tên',
    field: 'basketName1',
    editable: props => props.data.isEditable && props.data.storeCode,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ data, context, rowIndex }) => ({
      isClearable: true,
      promiseOptions: onFetchBasketAutocomplete,
      validBeforeChange: selected => {
        if (selected) {
          const updaterData = {
            ...data,
            basketCode1: selected.value,
          };
          if (!validateBaskets(updaterData)) {
            context.props.onShowWarning('Loại khay sọt đã đươc lựa chọn');
            return false;
          }
        }
        return true;
      },
      onChange: selected => {
        const { updateFieldArrayValue } = context.props.formik;
        const productData = {
          ...(selected
            ? {
                basketName1: selected.label,
                basketCode1: selected.value,
                quantity1: 0,
              }
            : {
                basketName1: '',
                basketCode1: '',
                quantity1: null,
              }),
          isChanged: true,
        };

        updateFieldArrayValue('tableData', rowIndex, productData);
      },
      parseValue: value => value || undefined,
    }),
  },
  {
    headerName: 'SL',
    field: 'quantity1',
    width: 80,
    editable: props => props.data.isEditable && props.data.basketName1,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: InputEditor,
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
      },
    },
  },
  {
    headerName: 'Tên',
    field: 'basketName2',
    editable: props => props.data.isEditable && props.data.storeCode,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ data, context, rowIndex }) => ({
      isClearable: true,
      promiseOptions: onFetchBasketAutocomplete,
      validBeforeChange: selected => {
        if (selected) {
          const updaterData = {
            ...data,
            basketCode2: selected.value,
          };
          if (!validateBaskets(updaterData)) {
            context.props.onShowWarning('Loại khay sọt đã đươc lựa chọn');
            return false;
          }
        }
        return true;
      },
      onChange: selected => {
        const { updateFieldArrayValue } = context.props.formik;
        const productData = {
          ...(selected
            ? {
                basketName2: selected.label,
                basketCode2: selected.value,
                quantity2: 0,
              }
            : {
                basketName2: '',
                basketCode2: '',
                quantity2: null,
              }),
          isChanged: true,
        };

        updateFieldArrayValue('tableData', rowIndex, productData);
      },
      parseValue: value => value || undefined,
    }),
  },
  {
    headerName: 'SL',
    field: 'quantity2',
    width: 80,
    editable: props => props.data.isEditable && props.data.basketName2,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: InputEditor,
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
      },
    },
  },
  {
    headerName: 'Tên',
    field: 'basketName3',
    editable: props => props.data.isEditable && props.data.storeCode,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: MuiSelectEditor,
    cellEditorParams: ({ data, context, rowIndex }) => ({
      isClearable: true,
      promiseOptions: onFetchBasketAutocomplete,
      validBeforeChange: selected => {
        if (selected) {
          const updaterData = {
            ...data,
            basketCode3: selected.value,
          };
          if (!validateBaskets(updaterData)) {
            context.props.onShowWarning('Loại khay sọt đã đươc lựa chọn');
            return false;
          }
        }
        return true;
      },
      onChange: selected => {
        const { updateFieldArrayValue } = context.props.formik;
        const productData = {
          ...(selected
            ? {
                basketName3: selected.label,
                basketCode3: selected.value,
                quantity3: 0,
              }
            : {
                basketName3: '',
                basketCode3: '',
                quantity3: null,
              }),
          isChanged: true,
        };

        updateFieldArrayValue('tableData', rowIndex, productData);
      },
      parseValue: value => value || undefined,
    }),
  },
  {
    headerName: 'SL',
    field: 'quantity3',
    width: 80,
    editable: props => props.data.isEditable && props.data.basketName3,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellRendererFramework: CellRenderer,
    cellEditorFramework: InputEditor,
    cellEditorParams: {
      InputProps: {
        inputComponent: NumberFormatter,
      },
    },
  },
  {
    headerName: 'Ghi chú',
    field: 'note',
    editable: props => props.data.isEditable,
    cellStyle: props => (props.data.isEditable ? editableCellStyle : {}),
    cellEditorFramework: CustomCellEditor,
    cellRendererFramework: CellRenderer,
  },
  {
    headerName: '',
    field: 'actions',
    width: 40,
    editable: false,
    cellClass: 'cell-action-butons',
    cellRendererFramework: ActionsRenderer,
    cellRendererParams: ({ rowIndex }) => ({
      handleRowDeletion: () => handleRowDeletion(rowIndex),
    }),
    suppressNavigable: true,
    suppressSizeToFit: true,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
];
