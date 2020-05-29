import React from 'react';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { makeSelectOpenDl } from './selectors';
import DialogWrapper from './DialogWrapper';
import reducer from './reducer';
import saga from './saga';
/* eslint-disable react/prefer-stateless-function */
class ImportedStockReceipt extends React.Component {
  render() {
    const { ui, openDl, history, onCreateSuccess, match } = this.props;
    return openDl ? (
      <DialogWrapper
        onCreateSuccess={onCreateSuccess}
        openDl={openDl}
        ui={ui}
        history={history}
        match={match}
      />
    ) : (
      ''
    );
  }
}

ImportedStockReceipt.propTypes = {
  ui: PropTypes.object.isRequired,
  openDl: PropTypes.bool,
  history: PropTypes.object,
  onCreateSuccess: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  openDl: makeSelectOpenDl(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

const withReducer = injectReducer({ key: 'importedStockReceipt', reducer });
const withSaga = injectSaga({ key: 'importedStockReceipt', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
)(ImportedStockReceipt);
