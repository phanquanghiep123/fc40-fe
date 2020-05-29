import { GET_SUGGEST_FROM_TURN_TO_SCALE } from '../PXK/constants';

export const suggestFromTurnToScale = payload => ({
  type: GET_SUGGEST_FROM_TURN_TO_SCALE,
  payload,
});
