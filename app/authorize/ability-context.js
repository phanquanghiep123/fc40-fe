import { createContext } from 'react';
import * as PropTypes from 'prop-types';
import CanUI from './CanUI';

export const AbilityContext = createContext();
export const Can = CanUI(AbilityContext.Consumer);

Can.propTypes = {
  do: PropTypes.string,
  not: PropTypes.string,
  on: PropTypes.string,
  passThrough: PropTypes.bool,
};
