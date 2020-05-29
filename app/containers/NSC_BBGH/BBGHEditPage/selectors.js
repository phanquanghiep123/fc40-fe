/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBBGHEdit = state => state.get('bbghEdit', initialState);

const makeSelectUserLogin = () =>
  createSelector(selectBBGHEdit, BBGHEditState =>
    BBGHEditState.get('userLogin'),
  );

const makeSelectSuppliers = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('suppliers'),
  );

const makeSelectLeadtimes = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('leadtimes'),
  );

const makeSelectReasons = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('reasons'),
  );
const makeSelectOptions = options =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get(options),
  );
const makeSelectBbghEdit = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('bbghEdit'),
  );

const makeSelectTypeUserEdit = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('typeUserEdit'),
  );

const makeSelectIsQLNH = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('isQLNH'),
  );

const makeSelectProcessTypes = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('processTypes'),
  );

const makeSelectVehicleRoutes = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('vehicleRoutes'),
  );

export {
  selectBBGHEdit,
  makeSelectUserLogin,
  makeSelectSuppliers,
  makeSelectLeadtimes,
  makeSelectBbghEdit,
  makeSelectTypeUserEdit,
  makeSelectIsQLNH,
  makeSelectProcessTypes,
  makeSelectVehicleRoutes,
  makeSelectReasons,
  makeSelectOptions,
};
