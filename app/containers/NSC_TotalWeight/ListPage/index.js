import React from 'react';
import * as PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { Typography } from '@material-ui/core';

import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { masterRoutine } from './routines';

import FormSection from './FormSection';
import TableSection from './TableSection';
import WeightPopup from './WeightPopup';
import * as selectors from './selectors';
import * as actions from './actions';

// eslint-disable-next-line react/prefer-stateless-function
export class TotalWeight extends React.PureComponent {
  componentDidMount() {
    this.props.onGetInitMaster();
  }

  /**
   * Sau khi Nhập kho thành công
   *
   * @param {number} rowIndex
   * @param {number} quantity  Tổng khối lượng thực
   * @param {string} batchCode Batch TP
   * @param {string} documentId
   * @param {string} documentDetailId
   */
  onImportedSuccess = (
    rowIndex,
    quantity,
    batchCode,
    documentId,
    documentDetailId,
  ) => {
    const updatedTable = [...this.props.tableData];
    updatedTable[rowIndex] = {
      ...updatedTable[rowIndex],
      productQuantity: quantity,
      productBatchCode: batchCode,
      documentId: documentId || null,
      documentDetailId: documentDetailId || null,
      productSelectDisabled: true,
    };

    const isSubRow = updatedTable[rowIndex].parentId !== null;
    if (isSubRow) {
      const mainRowIndex = updatedTable[rowIndex].parentId;
      updatedTable[mainRowIndex].completeDisabled = false;
    } else {
      updatedTable[rowIndex].completeDisabled = false;
    }

    // dispatch change
    this.props.onUpdateTableData(updatedTable);
  };

  render() {
    const { ui } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Cân Hàng
        </Typography>
        <FormSection />
        <TableSection />
        <WeightPopup ui={ui} onImportedSuccess={this.onImportedSuccess} />
      </React.Fragment>
    );
  }
}

TotalWeight.propTypes = {
  ui: PropTypes.object,
  tableData: PropTypes.array,
  onGetInitMaster: PropTypes.func,
  onUpdateTableData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  tableOriginalData: selectors.tableOriginalData(),
});

export const mapDispatchToProps = dispatch => ({
  onGetInitMaster: () => dispatch(masterRoutine.request()),
  onUpdateTableData: tableData => dispatch(actions.updateTableData(tableData)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'totalWeight', reducer });
const withSaga = injectSaga({ key: 'totalWeight', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(TotalWeight);
