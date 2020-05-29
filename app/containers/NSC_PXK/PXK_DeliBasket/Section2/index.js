/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AddCircle } from '@material-ui/icons';
import { TableRowSchema } from '../Schemas';
import FormData from '../../../../components/FormikUI/FormData';
import { makeColumnDefs, defaultColDef } from './columnDefs';
import Expansion from '../../../../components/Expansion';
import appTheme from '../../../App/theme';
import { showWarning } from '../../../App/actions';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConfirmDeleteDialog from './DeleteDialog';
import './style.css';
const style = (theme = appTheme) => ({
  addBtn: {
    minWidth: 'unset',
    width: 35,
    marginRight: '0.5rem',
    color: theme.palette.primary.main,
    background: '#fff',
  },
});

class TableSection extends Component {
  state = {
    openDialogDelete: false,
    rowIndexToDelete: null,
  };

  openDialogDelete = rowIndex => {
    this.setState({ openDialogDelete: true, rowIndexToDelete: rowIndex });
  };

  closeDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  /**
   * Proceed Row Deletion
   * @param rowIndex
   */
  proceedRowDeletion = rowIndex => {
    const { formik } = this.props;
    const updateTableData = [...formik.values.tableData];
    updateTableData.splice(rowIndex, 1);
    formik.setFieldValue('tableData', updateTableData);
  };

  /**
   * Handle Row Deletion Logic
   * @param rowIndex
   */
  handleRowDeletion = rowIndex => {
    const { formik } = this.props;
    const { tableData } = formik.values;
    if (tableData && tableData[rowIndex] && tableData[rowIndex].storeCode) {
      this.openDialogDelete(rowIndex);
    } else {
      this.proceedRowDeletion(rowIndex);
    }
  };

  /**
   * Insert a new row
   */
  insertNewRow = () => {
    const { formik, onUpdateTableData } = this.props;
    const updatedTableData = [...formik.values.tableData];
    const newRow = TableRowSchema.cast({
      isEditable: true,
      isManuallyAdded: true,
      plantCode: formik.values.org,
      note: null,
      isChanged: true,
    });
    updatedTableData.push(newRow);
    formik.setFieldValue('tableData', updatedTableData);
    onUpdateTableData(updatedTableData);
  };

  handleCustomerPromise = (inputText, callback) => {
    const { submittedValues, onFetchCustomerAutocomplete } = this.props;

    onFetchCustomerAutocomplete(inputText, submittedValues, callback);
  };

  render() {
    const {
      classes,
      formik,
      onFetchBasketAutocomplete,
      gridStyle,
    } = this.props;

    const columnDefs = makeColumnDefs(
      onFetchBasketAutocomplete,
      this.handleCustomerPromise,
      this.handleRowDeletion,
    );

    const rightActions = (
      <Button
        className={classes.addBtn}
        variant="contained"
        onClick={this.insertNewRow}
      >
        <AddCircle />
      </Button>
    );

    return (
      <div style={{ marginBottom: '1rem' }}>
        <Expansion
          title="II. THÔNG TIN KHAY SỌT"
          rightActions={rightActions}
          content={
            <FormData
              name="tableData"
              idGrid="tableData"
              gridStyle={gridStyle}
              gridProps={{
                context: this,
                pagination: true,
                paginationPageSize: 50,
                localeText: {
                  noRowsToShow: 'Không có dữ liệu để hiển thị',
                  page: 'Trang',
                  to: '-',
                  of: 'trên',
                },
              }}
              onGridReady={this.onGridReady}
              rowData={formik.values.tableData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              ignoreSuppressColumns={[
                'basketName1',
                'basketName2',
                'basketName3',
              ]}
              {...formik} // pass formik props into agGrid
            />
          }
        />
        <ConfirmDeleteDialog
          open={this.state.openDialogDelete}
          onClose={this.closeDialogDelete}
          onConfirm={() => this.proceedRowDeletion(this.state.rowIndexToDelete)}
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  formik: PropTypes.object,
  onShowWarning: PropTypes.func,
  onFetchBasketAutocomplete: PropTypes.func,
  onFetchCustomerAutocomplete: PropTypes.func,
  submittedValues: PropTypes.object,
  onUpdateTableData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  submittedValues: selectors.submittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onShowWarning: message => dispatch(showWarning(message)),
    onFetchBasketAutocomplete: (inputText, callback) =>
      dispatch(actions.fetchBasketAutocomplete(inputText, callback)),
    onFetchCustomerAutocomplete: (inputText, submittedValues, callback) =>
      dispatch(
        actions.fetchCustomerAutocomplete(inputText, submittedValues, callback),
      ),
    onUpdateTableData: (tableData, formValues = undefined) =>
      dispatch(actions.updateTableData(tableData, formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(TableSection);
