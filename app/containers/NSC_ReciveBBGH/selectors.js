import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectReceivingDeliveryOrder = state =>
  state.get('receivingDeliveryOrder', initialState);

const makeSelectInitialSchema = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('initialSchema'),
  );

const makeSelectMasterCode = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('masterCode'),
  );

const makeSelectLeadTime = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('leadTime'),
  );

const makeSelectVehicleRoute = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('vehicleRoute'),
  );

const makeSelectBackToPreviousPage = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('backToPreviousPage'),
  );

const makeSelectCheckDocument = () =>
  createSelector(selectReceivingDeliveryOrder, receivingDeliveryOrderstate =>
    receivingDeliveryOrderstate.get('checkDocument'),
  );

export {
  makeSelectInitialSchema,
  makeSelectMasterCode,
  makeSelectLeadTime,
  makeSelectVehicleRoute,
  makeSelectBackToPreviousPage,
  makeSelectCheckDocument,
};
