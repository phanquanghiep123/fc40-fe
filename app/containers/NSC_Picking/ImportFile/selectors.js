import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTotalWeight = state => state.get('pickingImportFile', initialState);

export const fileInfo = () =>
  createSelector(selectTotalWeight, totalWeight => totalWeight.get('fileInfo'));

export const showInfo = () =>
  createSelector(selectTotalWeight, totalWeight => totalWeight.get('showInfo'));
