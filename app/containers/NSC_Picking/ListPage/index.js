import React from 'react';
// import * as PropTypes from 'prop-types';

import { compose } from 'redux';
import { Typography } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class TotalWeight extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách File Import
        </Typography>
        <FormSection />
        <TableSection />
      </React.Fragment>
    );
  }
}

TotalWeight.propTypes = {};

const withReducer = injectReducer({ key: 'pickingListPage', reducer });
const withSaga = injectSaga({ key: 'pickingListPage', saga });

export default compose(
  withReducer,
  withSaga,
  withImmutablePropsToJS,
)(TotalWeight);
