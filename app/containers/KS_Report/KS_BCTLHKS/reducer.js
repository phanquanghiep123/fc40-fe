import { fromJS } from 'immutable';
import { sumBy } from 'utils/numberUtils';
import * as constants from './constants';

const currentDate = new Date();
const init = {
  plant: [],
  assetsCode: '',
  reason: 0,
  exportDateFrom: currentDate,
  exportDateTo: currentDate,
  palletBasket: '',
  approver: '',
  exporter: '',
  reasonCancellation: 0,
  receiptCode: '',
  receiptType: 0,
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
};

export const initialState = fromJS({
  form: {
    data: {
      palletBaskets: [], // danh sách khay sọt
      currentOrgs: [], // các đơn vị user có quyền
      users: [], // người dùng hệ thống
      reasons: [], // lý do
      reasonCancellations: [], // lý do hủy
      receiptTypes: [], // loại xuất hủy
    },
    defaultValues: init,
    submittedValues: init,
    isSubmitted: false,
    popupInit: {
      dateFrom: new Date(),
      dateTo: new Date(),
    },
  },
  chart: {
    circleChartPrice: [],
    circleChartQuantity: [],
    barChart: [],
  },
  table: {
    totalTable: [],
    mainTable: [],
    totalRow: {},
    selectedRecords: [],
  },
});

function palletBasketCancellationReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const data = action.payload;

      return state
        .setIn(['form', 'data'], data)
        .setIn(['form', 'isSubmitted'], true);
    }

    case constants.FETCH_REPORT_DATA_SUCCESS: {
      const data = action.payload;
      data.table.totalTable.push({
        total: true,
        uoM: 'Tổng',
        quantity: sumBy(data.table.totalTable, 'quantity'),
        price: sumBy(data.table.totalTable, 'price'),
      });
      return state
        .setIn(['chart'], data.chart)
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], data.submittedValues)
        .setIn(['table', 'totalTable'], data.table.totalTable)
        .setIn(['table', 'mainTable'], data.table.mainTable)
        .setIn(['table', 'totalRow'], data.table.totalRow);
    }

    case constants.FETCH_MAIN_TABLE_REPORT_DATA_SUCCESS: {
      const { mainTable, totalRow, submittedValues } = action.payload;
      return state
        .setIn(['form', 'submittedValues'], submittedValues)
        .setIn(['table', 'mainTable'], mainTable)
        .setIn(['table', 'totalRow'], totalRow);
    }

    case constants.SYNC_DATA_SUCCESS: {
      return state.setIn(
        ['form', 'popupInit', 'dateFrom'],
        fromJS(action.payload.dateFrom),
      );
    }

    default:
      return state;
  }
}

export default palletBasketCancellationReducer;
