import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectOutputOfSemiFinishedProductsDomain = state =>
  state.get('OutputOfSemiFinishedProducts', initialState);

export const importStockListPage = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.toJS(),
  );

export const formData = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );
export const totalItem = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['table', ' totalItem']),
  );
export const pageIndex = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['table', ' pageIndex']),
  );
export const pageSize = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn(['table', ' pageSize']),
  );

export const itemViewValue = () =>
  createSelector(selectOutputOfSemiFinishedProductsDomain, state =>
    state.getIn([' itemViewValue']),
  );
export default importStockListPage;
