/**
 *
 * ImportedBasketsTray
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Typography } from '@material-ui/core';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import PropTypes from 'prop-types';
import makeSelectImportedBasketsTray from './selectors';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

/* eslint-disable react/prefer-stateless-function */
export class ImportedBasketsTray extends React.PureComponent {
  render() {
    const { ui, history, match } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Phiếu Nhập Khay Sọt
        </Typography>
        <FormSection history={history} />
        <TableSection ui={ui} match={match} history={history} />
      </div>
    );
  }
}

ImportedBasketsTray.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  importedBasketsTray: makeSelectImportedBasketsTray(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importedBasketsTray', reducer });
const withSaga = injectSaga({ key: 'importedBasketsTray', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ImportedBasketsTray);
