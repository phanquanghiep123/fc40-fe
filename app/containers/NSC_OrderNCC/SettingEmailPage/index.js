import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import * as selectors from './selectors';
import FormSection from './FormSection';
// import * as actions from './actions';

// eslint-disable-next-line react/prefer-stateless-function
export class TotalWeight extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Cài Đặt Email
        </Typography>
        <FormSection />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
});

export const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'settingEmail', reducer });
const withSaga = injectSaga({ key: 'settingEmail', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(TotalWeight);
