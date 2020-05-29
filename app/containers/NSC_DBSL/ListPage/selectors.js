import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectOutputPorecastsListDomain = state =>
  state.get('OutputPorecastsList', initialState);

export const importStockListPage = () =>
  createSelector(selectOutputPorecastsListDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );
export const totalItem = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['table', ' totalItem']),
  );
export const pageIndex = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['table', ' pageIndex']),
  );
export const pageSize = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn(['table', ' pageSize']),
  );

export const itemViewValue = () =>
  createSelector(selectOutputPorecastsListDomain, state =>
    state.getIn([' itemViewValue']),
  );
export default importStockListPage;
