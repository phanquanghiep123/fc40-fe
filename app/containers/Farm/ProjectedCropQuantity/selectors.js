import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDomain = state => state.get('projectedCropQuantity', initialState);

export const importStockListPage = () =>
  createSelector(selectDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'data']));

export const formDefaultValues = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(selectDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'isSubmitted']));

export const tableData = () =>
  createSelector(selectDomain, state => state.getIn(['table', 'data']));

export const tableSelectedRecords = () =>
  createSelector(selectDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );

export const totalItem = () =>
  createSelector(selectDomain, state => state.getIn(['table', ' totalItem']));

export const pageIndex = () =>
  createSelector(selectDomain, state => state.getIn(['table', ' pageIndex']));

export const pageSize = () =>
  createSelector(selectDomain, state => state.getIn(['table', ' pageSize']));

export const itemViewValue = () =>
  createSelector(selectDomain, state => state.getIn([' itemViewValue']));

export default importStockListPage;
