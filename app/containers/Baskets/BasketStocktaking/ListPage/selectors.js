import { createSelector } from 'reselect';
import { initialState } from './reducer';

const domain = state => state.get('BasketStocktaking', initialState);

export const BasketStocktaking = () =>
  createSelector(domain, state => state.toJS());

export const formData = () =>
  createSelector(domain, state => state.getIn(['form', 'data']));

export const formValues = () =>
  createSelector(domain, state => state.getIn(['table', 'data']));

export const formValuesBasket = () =>
  createSelector(domain, state => state.getIn(['table', 'data']));

export const formDefaultValues = () =>
  createSelector(domain, state => state.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(domain, state => state.getIn(['form', 'submittedValues']));

export const tableData = () =>
  createSelector(domain, state => state.getIn(['table', 'data']));

export const totalRowData = () =>
  createSelector(domain, state => state.getIn(['table', 'totalRowData']));

export const tableBasketData = () =>
  createSelector(domain, state => state.getIn(['table', 'tableBasketData']));

export const totalRowBasketData = () =>
  createSelector(domain, state => state.getIn(['table', 'totalRowBasketData']));

export const formSubmittedValuesBasket = () =>
  createSelector(domain, state =>
    state.getIn(['form', 'submittedValuesBasket']),
  );

export const formIsSubmitted = () =>
  createSelector(domain, state => state.getIn(['form', 'isSubmitted']));

export default BasketStocktaking;
