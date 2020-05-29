import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectImportPriceListDomain = state =>
  state.get('ImportPriceList', initialState);

export const importStockListPage = () =>
  createSelector(selectImportPriceListDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );
export const totalItem = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['table', ' totalItem']),
  );
export const pageIndex = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['table', ' pageIndex']),
  );
export const pageSize = () =>
  createSelector(selectImportPriceListDomain, state =>
    state.getIn(['table', ' pageSize']),
  );
export default importStockListPage;
