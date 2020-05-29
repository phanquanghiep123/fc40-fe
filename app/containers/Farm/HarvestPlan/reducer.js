/*
 *
 * HarvestPlan reducer
 *
 */

import { fromJS } from 'immutable';
import { divideNumbers } from 'utils/numberUtils';
import {
  SUBMIT_FORM_SUCCESS,
  EDIT_FIELD,
  ADD_ROW,
  CANCEL_EDIT_ROW,
  GET_ORGANIZATION_SUCCESS,
  RESET_FORM,
  ADD_NEW_PLAN,
  UPDATE_PLAN,
  EDIT_ELEMENT,
  SUBMIT_FORM_FAILURE,
  CHANGE_PRODUCTION_ORDER_CODE,
  DELETE_PLANNING,
} from './constants';
import { formDataSchema } from './FormSection/formats';
import { initialSchema } from './FormSection/schema';

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    values: initialSchema,
    submittedValues: initialSchema,
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
    meta: [],
  },
});

function harvestPlanReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_FORM: {
      return state
        .setIn(['form', 'values'], fromJS(initialSchema))
        .setIn(
          ['form', 'values', 'plantCode'],
          state.getIn(['form', 'data', 'plantCodes'])[0],
        );
    }
    case GET_ORGANIZATION_SUCCESS: {
      return state
        .setIn(['form', 'data', 'plantCodes'], action.payload.orgs)
        .setIn(['form', 'values', 'plantCode'], action.payload.orgs[0]);
    }
    case SUBMIT_FORM_FAILURE:
      return state
        .setIn(['table', 'data'], fromJS([]))
        .setIn(['table', 'meta', 'count'], 0);
    case SUBMIT_FORM_SUCCESS:
      return state
        .setIn(
          ['form', 'submittedValues'],
          fromJS(action.payload.submittedValues),
        )
        .setIn(['table', 'data'], fromJS(action.payload.tableData))
        .setIn(['table', 'meta'], fromJS(action.payload.tableMeta));
    case EDIT_FIELD: {
      const { rowindex, values } = action.payload;
      return state.setIn(['table', 'data', rowindex], values);
    }
    case DELETE_PLANNING: {
      const { rowindex, subIndex } = action.payload;
      return state.updateIn(['table', 'data', rowindex, 'details'], list =>
        list.splice(subIndex, 1),
      );
    }
    case ADD_NEW_PLAN:
      // caching state & add row
      return state
        .setIn(['table', 'currentCaching'], state.getIn(['table', 'data']))
        .updateIn(['table', 'data'], list =>
          list.push(
            fromJS({
              editMode: true,
              editting: true,
              isCreate: true,
              details: [
                {
                  isOutOfPlan: true,
                  planningDivideQuantity: 0,
                  reponseRateQuantityByOrder: 0,
                  allocationRateQuantityType1: 1,
                },
              ],
            }),
          ),
        );
    case UPDATE_PLAN: {
      const { rowindex } = action.payload;
      // caching state & update
      return state
        .setIn(['table', 'currentCaching'], state.getIn(['table', 'data']))
        .updateIn(['table', 'data', rowindex], item =>
          item.set('editMode', true),
        )
        .updateIn(['table', 'data', rowindex, 'details'], list =>
          list.map(current => fromJS({ ...current.toJS(), editting: true })),
        );
    }
    case ADD_ROW: {
      const { rowindex } = action.payload;
      // caching state & add row
      // todo add row
      return state
        .setIn(['table', 'currentCaching'], state.getIn(['table', 'data']))
        .updateIn(['table', 'data', rowindex], item =>
          item.set('editMode', true),
        )
        .updateIn(['table', 'data', rowindex, 'details'], list =>
          list.push(
            fromJS({
              productionOrderCode: '',
              recoveryRate: '',
              allocationRateQuantityType1: 1,
              reponseRateQuantityByOrder: 0,
              isOutOfPlan: true,
            }),
          ),
        )
        .updateIn(['table', 'data', rowindex, 'details'], list =>
          list.map(current => fromJS({ ...current.toJS(), editting: true })),
        );
    }
    case CANCEL_EDIT_ROW: {
      return state
        .setIn(['table', 'data'], state.getIn(['table', 'currentCaching']))
        .setIn(['table', 'currentCaching'], null);
    }
    case EDIT_ELEMENT: {
      const { index, subIndex, field, newValue } = action.payload;
      let updatedValue = null;
      if (['allocationRateQuantityType1', 'recoveryRate'].includes(field)) {
        const newNumber = Number.parseFloat(newValue.toString());
        if (Number.isNaN(newNumber)) {
          updatedValue = '';
        } else {
          updatedValue = divideNumbers(newNumber, 100).toFixed(3);
        }
      } else {
        updatedValue = newValue;
      }
      if (subIndex !== null) {
        return state.setIn(
          ['table', 'data', index, 'details', subIndex, field],
          updatedValue,
        );
      }
      return state.setIn(['table', 'data', index, field], updatedValue);
    }
    case CHANGE_PRODUCTION_ORDER_CODE: {
      const { index, selected } = action.payload;
      const currentData = state.getIn(['table', 'data', index]);
      return state.mergeDeepIn(
        ['table', 'data', index],
        currentData,
        fromJS(selected),
      );
    }
    default:
      return state;
  }
}

export default harvestPlanReducer;
