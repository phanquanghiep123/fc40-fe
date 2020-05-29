import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const formDefaultValues = {
  org: '',
  productionDate: currentDate,
  uom: null,
  productionRegion: '',
  farmNCC: [],
  productCat: [],
  productSource: '',
  productCodeName: '',
  batch: '',

  // paging & sorting
  pageIndex: 0,
  pageSize: 10,
  count: 0,
  sortKey: null,
  sortType: null,
};

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      productionRegion: [],
      farmNCC: [],
      productCat: [],
      productSource: [],
    },
    defaultValues: formDefaultValues,
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    totalRowData: {},
  },
});

function productionReportReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: dt } = action;
      const defaultValues = {
        ...formDefaultValues,
        org: dt.org && dt.org.length ? dt.org[0].value : '',
        productionRegion:
          dt.productionRegion && dt.productionRegion.length
            ? dt.productionRegion[0].value
            : '',
        farmNCC: dt.farmNCC && dt.farmNCC.length ? [dt.farmNCC[0].value] : [],
        productCat:
          dt.productCat && dt.productCat.length ? [dt.productCat[0].value] : [],
        productSource:
          dt.productSource && dt.productSource.length
            ? dt.productSource[0].value
            : '',
      };

      return state
        .setIn(['form', 'data'], dt)
        .setIn(['form', 'defaultValues'], defaultValues);
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'totalRowData'], action.totalRow);
    }

    default:
      return state;
  }
}

export default productionReportReducer;
