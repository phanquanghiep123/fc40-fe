/**
 *
 * MasterBaskets
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
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { setSortMuiTable } from 'containers/App/utils';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';
import * as actions from './actions';
import * as selectors from './selectors';

/* eslint-disable react/prefer-stateless-function */
export class MasterBaskets extends React.PureComponent {
  tableRef = null;

  componentDidMount() {
    this.props.onGetSize();
    this.props.onGetUomsAuto();
    this.props.onSearch(this.props.paramSearch);
  }

  reset = () => {
    setSortMuiTable(this.tableRef, 1, 'asc');
  };

  render() {
    const { ui } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Master Khay Sọt
        </Typography>
        <FormSection onReset={this.reset} ui={ui} />
        <TableSection
          tableRef={ref => {
            this.tableRef = ref;
          }}
          ui={ui}
        />
      </div>
    );
  }
}

MasterBaskets.propTypes = {
  ui: PropTypes.object,
  onGetUomsAuto: PropTypes.func,
  onSearch: PropTypes.func,
  onGetSize: PropTypes.func,
  paramSearch: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  paramSearch: selectors.paramSearchSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetUomsAuto: () => dispatch(actions.getUomsAuto()),
    onSearch: data => dispatch(actions.searchMaster(data)),
    onGetSize: () => dispatch(actions.getSize()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'masterBaskets', reducer });
const withSaga = injectSaga({ key: 'masterBaskets', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJs,
)(MasterBaskets);
