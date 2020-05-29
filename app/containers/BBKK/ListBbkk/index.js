/**
 *
 * ListBbkk
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Typography } from '@material-ui/core';
import makeSelectListBbkk from './selectors';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

/* eslint-disable react/prefer-stateless-function */
export class ListBbkk extends React.PureComponent {
  render() {
    const { ui, history, match } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Biên Bản Kiểm Kê
        </Typography>
        <FormSection history={history} />
        <TableSection ui={ui} match={match} history={history} />
      </div>
    );
  }
}

ListBbkk.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  listBbkk: makeSelectListBbkk(),
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

const withReducer = injectReducer({ key: 'listBbkk', reducer });
const withSaga = injectSaga({ key: 'listBbkk', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ListBbkk);
