import MuiSelectEditor from 'components/MuiSelect/Editor';
import InputEditor from 'components/MuiInput/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import CellRenderer from 'components/FormikUI/CellRenderer';
import {
  formatToNumber,
  formatToDecimal,
  formatToCurrency,
} from 'utils/numberUtils';

import { orderNumberRenderer } from 'utils/index';
export const getBasketOrder = text => text.replace(/\D/g, '') * 1;

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : '';

export const noteEditable = params => {
  const {
    context: {
      props: { form },
    },
  } = params;
  return params.data.productCode && ![TYPE_FORM.VIEW].includes(form);
};

export const basketEditable = params => {
  const {
    data: { isEnterQuantity },
    context: {
      props: { form },
    },
  } = params;

  const basketOrder = getBasketOrder(params.colDef.field);
  return (
    params.data[`basketShortName${basketOrder}`] &&
    isEnterQuantity &&
    ![TYPE_FORM.VIEW].includes(form)
  );
};

export const columns = {
  stt: {
    headerName: 'STT',
    field: 'stt',
    width: 40,
    suppressNavigable: true,
    editable: false,
    cellRendererFramework: orderNumberRenderer,
    suppressSizeToFit: true,
  },
  productCode: {
    headerName: 'Mã Sản Phẩm*',
    field: 'productCode',
    width: 40,
    editable: params => params.data.isNotSaved,
    cellEditorFramework: MuiSelectEditor,
    cellRendererFramework: CellRenderer,
  },
  productName: {
    headerName: 'Tên Sản Phẩm',
    field: 'productName',
    tooltipField: 'productName',
    editable: false,
    width: 50,
  },
  batch: {
    headerName: 'Batch',
    editable: false,
    tooltipField: 'batch',
    field: 'batch',
    width: 30,
  },
  locator: {
    headerName: 'Kho Nguồn',
    tooltipField: 'locator',
    editable: false,
    field: 'locator',
    width: 40,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  quantity: {
    headerName: 'Số Lượng Hủy',
    field: 'quantity',
    width: 40,
    editable: false,
    cellEditorFramework: MuiSelectInputEditor,
    cellEditorParams: {
      InputProps: {
        inputComponent: numberFormatter,
      },
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  uom: {
    headerName: 'Đơn Vị',
    field: 'uom',
    editable: false,
    tooltipField: 'uom',
    width: 35,
  },
  unitPrice: {
    headerName: 'Đơn Giá',
    field: 'unitPrice',
    tooltipField: 'unitPrice',
    editable: false,
    width: 45,
    valueFormatter: numberCurrency,
  },
  total: {
    headerName: 'Ước Tính Giá Trị',
    field: 'total',
    tooltipField: 'total',
    editable: false,
    width: 45,
    valueFormatter: numberCurrency,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  reasonDescription: {
    headerName: 'Nguyên Nhân Hủy',
    field: 'reasonDescription',
    tooltipField: 'reasonDescription',
    editable: false,
    width: 55,
  },
  note: {
    headerName: 'Ghi Chú',
    field: 'note',
    tooltipField: 'note',
    editable: noteEditable,
    cellEditorFramework: InputEditor,
    width: 40,
  },
};

export const defaultEditable = params => {
  const rowData = params.data;
  if (rowData.productCode !== undefined && rowData.productCode !== '') {
    return true;
  }
  return false;
};

export const defaultColDef = {
  editable: defaultEditable,
};
