import { fromJS } from 'immutable';
import * as constants from './constants';

const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

export const initialState = fromJS({
  form: {
    data: {
      farmFrom: [],
      farmTo: [],
      plantArray: [],
    },
    defaultValues: {
      farmFrom: null,
      farmTo: null,
      lsxFrom: null,
      lsxTo: null,
      dateFrom: firstDayOfMonth,
      dateTo: lastDayOfMonth,
      productCode: null,
      productName: '',
      maxDateRange: 31, // quãng ngày kế hoạch tối đa
      plants: '', // danh sách tất cả các farm cách nhau bởi dấu phẩy
      plantArray: [], // array tất cả farm

      /* sorting & paging */
      pageSize: 5,
      pageIndex: 0,
      sortKey: null,
      sortType: null,
      count: 0,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function ProjectedCropQuantityReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: fd } = action;
      const defaultValues = {
        // farmFrom: fd.farmFrom && fd.farmFrom.length ? fd.farmFrom[0] : null,
        // farmTo: fd.farmTo && fd.farmTo.length ? fd.farmTo[0] : null,
        maxDateRange: fd.maxDateRange,
        plants: fd.plants,
        plantArray: fd.plantArray,
      };

      return (
        state
          .setIn(['form', 'data'], action.formData)
          // .setIn(['form', 'defaultValues', 'farmFrom'], defaultValues.farmFrom)
          // .setIn(['form', 'defaultValues', 'farmTo'], defaultValues.farmTo)
          .setIn(['form', 'defaultValues', 'plants'], defaultValues.plants)
          .setIn(
            ['form', 'defaultValues', 'plantArray'],
            defaultValues.plantArray,
          )
          .setIn(
            ['form', 'defaultValues', 'maxDateRange'],
            defaultValues.maxDateRange,
          )
      );
    }

    case constants.FETCH_TABLE_DATA_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.formValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);

    default:
      return state;
  }
}

export default ProjectedCropQuantityReducer;
