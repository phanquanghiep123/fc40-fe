/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Button } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './customAgStyle.css';

import { withRouter } from 'react-router-dom';
import FormData from '../../../../components/FormikUI/FormData';
import * as actions from '../actions';
// import * as selectors from '../selectors';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import Expansion from '../../../../components/Expansion';
import { makeProductsRowSchema } from '../Schemas';
import * as makeSelect from '../selectors';
import ConfirmDeleteDialog from './DeleteDialog';
import ImagePopup from './ImagePopup';
import appTheme from '../../../App/theme';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { getNested, getUrlParams } from '../../../App/utils';
// import { isEqual } from 'lodash';

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
  constructor(props) {
    super(props);

    this.state = {
      data: this.createInitRecords(),
      openDialogDelete: false,
      agProps: undefined, // store the agProps of the cell where delete button is clicked
      openImagePopup: false,
      columnDefs: [],
      defaultColDef: {},
    };
  }

  componentDidMount() {
    const { pageType, receiptData, formik } = this.props;

    this.setState({
      columnDefs: makeColumnDefs(
        pageType,
        receiptData,
        this.openDialogDelete,
        this.openImagePopup,
      ),
      defaultColDef: makeDefaultColDef(formik),
    });
  }

  componentDidUpdate(prevProps) {
    const { receiptData, pageType } = this.props;

    if (
      getNested(receiptData, 'isAutoReceipt') !==
      getNested(prevProps.receiptData, 'isAutoReceipt')
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          columnDefs: makeColumnDefs(
            pageType,
            receiptData,
            this.openDialogDelete,
            this.openImagePopup,
          ),
        },
        () => {
          if (this.gridApi && this.gridApi.sizeColumnsToFit) {
            this.gridApi.sizeColumnsToFit();
          }
        },
      );
    }
  }

  componentWillReceiveProps = nextProps => {
    const { values } = nextProps.formik;

    if (values.products.length > this.state.data.length) {
      // Xet state => length của state theo length của formik
    }
  };

  // Open confirm dialog
  openDialogDelete = agProps => {
    this.setState({ openDialogDelete: true, agProps });
  };

  // Close confirm dialog
  closeDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  // Open confirm dialog
  openImagePopup = (rowIndex, imgIndex, deleteImageFunc) => {
    this.setState({
      openImagePopup: true,
      rowIndex,
      imgIndex,
      deleteImageFunc,
    });
  };

  // Close confirm dialog
  closeImagePopup = () => {
    this.setState({ openImagePopup: false });
  };

  /**
   * On click confirm button in dialog
   */
  confirmDeletion = () => {
    const { agProps } = this.state;
    const { pageType, onDeleteProduct } = this.props;

    if (pageType.view) {
      onDeleteProduct(agProps.data, isOk => {
        if (isOk) this.refreshReceiptData();
      });
    } else if (
      pageType.edit &&
      getNested(agProps, 'data', 'isLoadedFromServer')
    ) {
      onDeleteProduct(agProps.data, isOk => {
        if (isOk) this.refreshReceiptData();
      });
    } else {
      this.proceedFEProductDeletion();
    }
  };

  renderConfirmDeleteMessage = () => {
    const { agProps } = this.state;

    let msg = 'Bạn có chắn chắn muốn xóa dòng này?';
    if (getNested(agProps, 'data', 'isLoadedFromServer')) {
      const { data } = agProps;
      msg = ` [${data.productName} - ${
        data.productCode
      }] đã được lưu trong hệ thống, ấn Đồng ý thì hệ thống sẽ thực hiện Xóa sản phẩm`;
    }

    return msg;
  };

  /**
   * Refresh data after remove
   */
  refreshReceiptData = () => {
    const { history, onFetchReceiptData } = this.props;
    const { isBasket } = getUrlParams(history);
    const receiptId =
      this.props.match.params && this.props.match.params.id
        ? this.props.match.params.id
        : undefined;
    if (receiptId) {
      onFetchReceiptData(receiptId, this.props.pageType, isBasket);
    }
  };

  /**
   * Delete product record in products table
   */
  proceedFEProductDeletion = () => {
    const { data, agProps } = this.state;
    const { formik } = this.props;
    const { rowIndex } = agProps;

    const updatedProducts = [...formik.values.products];
    updatedProducts.splice(rowIndex, 1);
    formik.updateFieldValue('products', updatedProducts, true);

    const updatedEstValue = this.getEstValue(updatedProducts);
    formik.setFieldValue('estValue', updatedEstValue, true);

    const nextStateData = [...data];
    nextStateData.splice(rowIndex, 1);
    this.setState({
      data: nextStateData,
    });
  };

  /**
   * Get Row Data
   * @returns {Array}
   */
  getRowData() {
    const { data } = this.state;
    const { values } = this.props.formik;

    return this.mergeRowData(data, values.products);
  }

  /**
   * Recalculate estValue
   * @returns {Number}
   */
  getEstValue(datas) {
    if (datas && datas.length > 0) {
      let grossEstValue = 0;

      datas.forEach(row => {
        if (!row) return;
        if (row.estValue && !row.isDeleted) {
          const value = parseFloat(row.estValue);

          if (Number.isNaN(value)) {
            grossEstValue += 0;
            return;
          }

          grossEstValue += value;
        }
      });

      return formatToCurrency(grossEstValue);
    }
    return 0;
  }

  /**
   * Merge formik data to state data
   * @param stateData
   * @param formikData
   * @returns {Array}
   */
  mergeRowData = (stateData, formikData) => {
    if (formikData && formikData.length > stateData.length) {
      return formikData;
    }

    const results = [];
    stateData.forEach((_, index) => {
      results[index] = formikData[index] || stateData[index];
    });

    return results;
  };

  /**
   * @param {*} numRecords Số lượng dòng khi khởi tạo
   * @param {*} initSchema Dữ liệu khi khởi tạo
   */
  createInitRecords = (numRecords = 10, initSchema = {}) => {
    if (numRecords <= 0) {
      return [];
    }

    const initRows = [];
    const row = makeProductsRowSchema(this.props.pageType).cast(initSchema);
    Array(numRecords)
      .fill(null)
      .forEach(() => initRows.push(row));

    return initRows;
  };

  /**
   * Insert new rows
   * @param quantity
   * @param initSchema
   */
  insertNewRows = (quantity = 1, initSchema = {}) => {
    const { data } = this.state;
    const nextStateData = [...data];
    const newRows = this.createInitRecords(quantity, initSchema);
    nextStateData.push(...newRows);

    this.setState({ data: nextStateData });
  };

  /**
   * Handle cell value changes
   * @param event
   */
  onCellValueChanged = event => {
    const { formik } = this.props;
    const { colDef } = event;
    const { values } = formik;

    if (
      colDef.field === 'productCode' ||
      colDef.field === 'unitPrice' ||
      colDef.field === 'quantity' ||
      colDef.field === 'estValue'
    ) {
      const estValue = this.getEstValue(values.products);
      formik.setFieldValue('estValue', estValue);
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  render() {
    const {
      classes,
      formik,
      pageType,
      receiptData,
      onFetchBigImage,
    } = this.props;

    const rowData = this.getRowData();

    const rightActions =
      pageType.create || (pageType.edit && receiptData.isEditable) ? (
        <Button
          className={classes.addBtn}
          variant="contained"
          onClick={this.insertNewRows}
        >
          <AddCircle />
        </Button>
      ) : null;

    return (
      <div style={{ marginBottom: '1rem' }}>
        <Expansion
          title="II. THÔNG TIN HÀNG YÊU CẦU HỦY"
          rightActions={rightActions}
          content={
            <FormData
              name="products"
              idGrid="products"
              gridStyle={{ height: 450 }}
              gridProps={{
                context: this,
                onCellValueChanged: this.onCellValueChanged,
              }}
              rowData={rowData}
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              ignoreSuppressColumns={['productCode', 'cause']}
              onGridReady={this.onGridReady}
              {...formik} // pass formik props into agGrid
            />
          }
        />
        <ConfirmDeleteDialog
          open={this.state.openDialogDelete}
          onClose={this.closeDialogDelete}
          onConfirm={this.confirmDeletion}
          message={this.renderConfirmDeleteMessage()}
        />
        <ImagePopup
          open={this.state.openImagePopup}
          onClose={this.closeImagePopup}
          rowIndex={this.state.rowIndex}
          imgIndex={this.state.imgIndex}
          deleteImage={this.state.deleteImageFunc}
          formik={formik}
          pageType={pageType}
          onFetchBigImage={onFetchBigImage}
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  history: PropTypes.object,
  formik: PropTypes.object,
  selectBoxData: PropTypes.object,
  pageType: PropTypes.object,
  receiptData: PropTypes.object,
  onFetchBigImage: PropTypes.func,
  onDeleteProduct: PropTypes.func,
  onFetchReceiptData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectBoxData: makeSelect.selectBoxData(),
  receiptData: makeSelect.receiptData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchProductAutocomplete: (orgCode, keyword, callback) =>
      dispatch(actions.fetchProductsAutocomplete(orgCode, keyword, callback)),
    onFetchBigImage: (id, callback, isRefactorImage) =>
      dispatch(actions.fetchBigImage(id, callback, isRefactorImage)),
    onDeleteProduct: (rowData, callback) =>
      dispatch(actions.deleteProduct(rowData, callback)),
    onFetchReceiptData: (id, pageType, isBasket) =>
      dispatch(actions.fetchReceiptData(id, pageType, isBasket)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withRouter,
  withStyles(style()),
)(TableSection);
