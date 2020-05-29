/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBBGHDetails = state => state.get('bbghCreate', initialState);

const makeSelectBaskets = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('baskets'),
  );

const makeSelectTypesBBGH = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('typesBBGH'),
  );

const makeSelectTypeBBGHSelected = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('typeBBGHSelected'),
  );

const makeSelectCreatedUnit = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('createdUnits'),
  );

const makeSelectInitialSchema = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('initialSchema'),
  );

const makeSelectedUnit = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('selectedUnit'),
  );

const makeSelectSuppliers = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('suppliers'),
  );

const makeSelectLeadtimes = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('leadtimes'),
  );

const makeSelectProcessTypes = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('processTypes'),
  );

const makeSelectReasons = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('reasons'),
  );

const makeSelectSelectedRegion = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('selectedRegion'),
  );

const makeSelectUnitRegions = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('unitRegions'),
  );

const makeSelectVehicleRoutes = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('vehicleRoutes'),
  );

const makeSelectDataTableSuggest = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('dataTableSuggest'),
  );
const makeSelectSubmitValuesSuggest = () =>
  createSelector(selectBBGHDetails, BBGHDetailsState =>
    BBGHDetailsState.get('submitValuesSuggest'),
  );

export {
  selectBBGHDetails,
  makeSelectBaskets,
  makeSelectTypesBBGH,
  makeSelectTypeBBGHSelected,
  makeSelectCreatedUnit,
  makeSelectInitialSchema,
  makeSelectedUnit,
  makeSelectSuppliers,
  makeSelectLeadtimes,
  makeSelectProcessTypes,
  makeSelectSelectedRegion,
  makeSelectUnitRegions,
  makeSelectVehicleRoutes,
  makeSelectDataTableSuggest,
  makeSelectSubmitValuesSuggest,
  makeSelectReasons,
};
