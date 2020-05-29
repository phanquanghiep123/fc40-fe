import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPalletCancellationReport = state =>
  state.get('palletBasketCancellationReport', initialState);

export const tableData = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['table', 'data']),
  );

export const defaultValues = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const submittedValues = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const formData = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['form', 'data']),
  );

export const mainTableData = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['table', 'mainTable']),
  );

export const totalTableData = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['table', 'totalTable']),
  );

export const chartData = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['chart']),
  );

export const totalRow = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['table', 'totalRow']),
  );

export const popupInit = () =>
  createSelector(selectPalletCancellationReport, state =>
    state.getIn(['form', 'popupInit']),
  );
