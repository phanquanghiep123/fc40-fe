import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSplitReport = state => state.get('splitReport', initialState);

export const tableData = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['table', 'data']),
  );
export const tableTotal = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['table', 'total']),
  );
export const formData = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['form', 'data']),
  );
export const formDefaultValues = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['form', 'submittedValues']),
  );
export const formIsSubmitted = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['form', 'isSubmitted']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectSplitReport, splitReport =>
    splitReport.getIn(['table', 'selectedRecords']),
  );
