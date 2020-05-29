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
import FormSection from './FormSection';
import TableSection from './TableSection';
import * as selectors from './selectors';
// import * as actions from './actions';

// eslint-disable-next-line react/prefer-stateless-function
export class TotalWeight extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Phiếu Yêu Cầu Thanh Lý/Huỷ
        </Typography>
        <FormSection />
        <TableSection />
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

const withReducer = injectReducer({ key: 'cancelRequest', reducer });
const withSaga = injectSaga({ key: 'cancelRequest', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(TotalWeight);
