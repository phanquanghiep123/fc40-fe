import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCancelRequest = state => state.get('pickingReport', initialState);

export const tableData = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['table', 'data']),
  );
export const formData = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['form', 'data']),
  );
export const formDefaultValues = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['form', 'submittedValues']),
  );
export const formIsSubmitted = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['form', 'isSubmitted']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectCancelRequest, pickingReport =>
    pickingReport.getIn(['table', 'selectedRecords']),
  );
