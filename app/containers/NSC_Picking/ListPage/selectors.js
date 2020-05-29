import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDomain = state => state.get('pickingListPage', initialState);

export const formData = () =>
  createSelector(selectDomain, totalWeight =>
    totalWeight.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectDomain, totalWeight =>
    totalWeight.getIn(['form', 'defaultValues']),
  );

export const tableData = () =>
  createSelector(selectDomain, totalWeight =>
    totalWeight.getIn(['table', 'data']),
  );
export const processingDate = () =>
  createSelector(selectDomain, totalWeight =>
    totalWeight.getIn(['table', 'processingDate']),
  );

export const tableOriginalData = () =>
  createSelector(selectDomain, totalWeight =>
    totalWeight.getIn(['table', 'originalData']),
  );
