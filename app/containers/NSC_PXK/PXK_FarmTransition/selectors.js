import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFarmTransition = state => state.get('FarmTransition', initialState);

const makeSelectProcessingType = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.get('processingType'),
  );

const makeSelectInventories = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.get('inventories'),
  );

const makeSelectOrganizations = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.get('organizations'),
  );

const deliFormData = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.getIn(['deliPopup', 'formData']),
  );

const deliFormDefaultValues = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.getIn(['deliPopup', 'formDefaultValues']),
  );

const deliTableData = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.getIn(['deliPopup', 'tableData']),
  );

const deliSelectedRows = () =>
  createSelector(selectFarmTransition, farmTransitionState =>
    farmTransitionState.getIn(['deliPopup', 'selectedRows']),
  );

export {
  selectFarmTransition,
  makeSelectProcessingType,
  makeSelectInventories,
  makeSelectOrganizations,
  deliFormData,
  deliFormDefaultValues,
  deliTableData,
  deliSelectedRows,
};
