import { fromJS } from 'immutable';
import { initialSchema } from '../CreatePage/schema';
import * as Constants from './constants';

export const initialState = fromJS({
  initData: initialSchema,
});

function Reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.GET_INIT_DATA_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { item } = action;
      // eslint-disable-next-line no-case-declarations
      const postingBlock = !!item.postingBlock;
      // eslint-disable-next-line no-case-declarations
      const purchBlock = !!item.purchBlock;

      return state.set(
        'initData',
        fromJS({
          ...initialSchema,
          ...action.item,
          postingBlock,
          purchBlock,
        }),
      );
    default:
      return state;
  }
}

export default Reducer;
