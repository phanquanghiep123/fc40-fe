import React from 'react';

import { compose } from 'redux';

import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';

import reducer from './reducer';
import saga from './saga';

import Popup from './Popup';

export function DeliSuggest(props) {
  return <Popup {...props} />;
}

const withReducer = injectReducer({ key: 'BBGNHHDeliSuggest', reducer });
const withSaga = injectSaga({ key: 'BBGNHHDeliSuggest', saga });

export default compose(
  withReducer,
  withSaga,
)(DeliSuggest);
