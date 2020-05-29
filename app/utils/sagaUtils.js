/**
 * Refer
 * https://github.com/afitiskin/redux-saga-routines
 *
 * https://rangle.io/blog/higher-order-reducers
 * https://alligator.io/redux/higher-order-reducers
 */

import camelCase from 'lodash/camelCase';
import { createAction } from 'redux-actions';

export const TRIGGER = 'TRIGGER';
export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const requestStages = [TRIGGER, REQUEST, SUCCESS, FAILURE];

export const createActionCreator = (section, prefix, type) =>
  createAction(`${prefix}/${section.toUpperCase()}_${type.toUpperCase()}`);

export const createRequestRoutine = (section, prefix = 'ACTION_PREFIX') =>
  requestStages.reduce((result, stage) => {
    const actionCreator = createActionCreator(`LOAD_${section}`, prefix, stage);
    const actionEditingCreator = createActionCreator(
      `EDITING_${section}`,
      prefix,
      stage,
    );

    const TYPE_EDITING = `EDITING_${stage.toUpperCase()}`;

    return Object.assign(result, {
      [stage.toLowerCase()]: actionCreator,
      [stage.toUpperCase()]: actionCreator.toString(),
      [camelCase(TYPE_EDITING)]: actionEditingCreator,
      [TYPE_EDITING]: actionEditingCreator.toString(),
    });
  }, {});

export const withLoading = baseReducer => (state, action) => {
  const matches = RegExp(`/(.*)_(.*)_(${REQUEST}|${SUCCESS}|${FAILURE})$`).exec(
    action.type,
  );
  if (!matches || matches.length < 4) {
    return baseReducer(state, action);
  }

  const type = matches[3];
  const section = matches[2].toLowerCase();
  if (!type || !state.has(section)) {
    return baseReducer(state, action);
  }

  let newState;

  switch (type) {
    case REQUEST.toString():
      newState = state
        .setIn([section, 'loading'], true)
        .setIn([section, 'error'], false);
      break;
    case SUCCESS.toString():
      newState = state
        .setIn([section, 'loading'], false)
        .setIn([section, 'error'], false);
      break;
    case FAILURE.toString():
      newState = state
        .setIn([section, 'loading'], false)
        .setIn([section, 'error'], true);
      break;
    default:
      newState = state;
  }

  return baseReducer(newState, action);
};
