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

// eslint-disable-next-line react/prefer-stateless-function
export class PalletBasketReport extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Báo cáo khay sọt đi đường
        </Typography>
        <FormSection />
        <TableSection />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'palletBasketByWay', reducer });
const withSaga = injectSaga({ key: 'palletBasketByWay', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(PalletBasketReport);
