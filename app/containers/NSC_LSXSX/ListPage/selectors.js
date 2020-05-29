import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAttributionProductionDomain = state =>
  state.get('AttributionProduction', initialState);

export const importStockListPage = () =>
  createSelector(selectAttributionProductionDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );
export const totalItem = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['table', ' totalItem']),
  );
export const pageIndex = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['table', ' pageIndex']),
  );
export const pageSize = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn(['table', ' pageSize']),
  );

export const itemViewValue = () =>
  createSelector(selectAttributionProductionDomain, state =>
    state.getIn([' itemViewValue']),
  );
export default importStockListPage;
