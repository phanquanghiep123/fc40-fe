/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './customAgStyle.css';
import { isEqual } from 'lodash';
import FormData from '../../../../components/FormikUI/FormData';
import * as actions from '../actions';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import Expansion from '../../../../components/Expansion';
import * as makeSelect from '../selectors';
import ConfirmDeleteDialog from './DeleteDialog';
import appTheme from '../../../App/theme';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { makeAssetsRowSchema } from '../Schemas';
import { ASSET_TABLE, ASSET_TABLE_PINNED } from '../constants';
import { getNested, getUrlParams } from '../../../App/utils';
import {
  calculateTotalRowAssetTable,
  onUpdateAssetPinnedData,
  onUpdateBasketsInfoTableData,
} from '../utils';

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
      assetsData: this.createInitRecords(),
      openDialogDelete: false,
      agProps: undefined, // store the agProps of the cell where delete button is clicked
      // openImagePopup: false,
      columnDefs: [],
      defaultColDef: {},
    };
  }

  componentDidMount() {
    const { pageType, receiptData, dispatch, isDraftSelected } = this.props;

    this.setState({
      columnDefs: makeColumnDefs(
        pageType,
        receiptData,
        this.onOpenDialogDelete,
        isDraftSelected,
        dispatch,
      ),
      defaultColDef: makeDefaultColDef(),
    });
  }

  componentDidUpdate(prevProps) {
    const {
      pageType,
      receiptData,
      dispatch,
      isDraftSelected,
      selectBoxData,
    } = this.props;

    if (
      prevProps.isDraftSelected !== isDraftSelected ||
      !isEqual(prevProps.selectBoxData.causeAsset, selectBoxData.causeAsset)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        columnDefs: makeColumnDefs(
          pageType,
          receiptData,
          this.onOpenDialogDelete,
          isDraftSelected,
          dispatch,
        ),
      });
    }
  }

  // Open confirm dialog
  onOpenDialogDelete = agProps => {
    this.setState({ openDialogDelete: true, agProps });
  };

  // Close confirm dialog
  onCloseDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  /**
   * On click confirm button in dialog
   */
  confirmDeletion = () => {
    const { agProps } = this.state;
    const { onDeleteAsset } = this.props;

    const isFromServer = getNested(agProps, 'data', 'isLoadedFromServer');
    if (isFromServer) {
      onDeleteAsset(agProps.data, () => {
        this.proceedFEProductDeletion();
        this.onReloadReceiptData();
      });
    } else {
      this.proceedFEProductDeletion();
    }
  };

  /**
   * Delete product record in products table
   */
  proceedFEProductDeletion = () => {
    const { agProps } = this.state;
    if (!agProps) return;

    const { formik } = this.props;
    const { rowIndex } = agProps;

    const updatedAssets = [...formik.values[ASSET_TABLE]];
    updatedAssets.splice(rowIndex, 1);
    formik.updateFieldValue(ASSET_TABLE, updatedAssets, true);

    const updatedEstValue = this.getEstValue(updatedAssets);
    formik.setFieldValue('estValue', updatedEstValue, true);

    onUpdateBasketsInfoTableData(formik, updatedAssets);
    onUpdateAssetPinnedData(formik, updatedAssets);
    this.setState({ agProps: null });
  };

  /**
   * Reload ReceiptData
   */
  onReloadReceiptData = () => {
    const {
      match,
      history,
      pageType,
      onFetchReceiptData,
      onFetchStatusData,
    } = this.props;
    const receiptId = getNested(match, 'params', 'id');
    const { isBasket } = getUrlParams(history);

    if (receiptId) {
      onFetchReceiptData(receiptId, pageType, isBasket);
      onFetchStatusData(pageType, receiptId, isBasket);
    }
  };

  /**
   * Get Row Data
   * @returns {Array}
   */
  getRowData() {
    const { assetsData } = this.state;
    const { values } = this.props.formik;

    return this.mergeRowData(assetsData, values[ASSET_TABLE]);
  }

  /**
   * Recalculate estValue
   * @returns {string}
   */
  getEstValue(data) {
    if (data && data.length > 0) {
      let grossEstValue = 0;

      data.forEach(row => {
        if (!row) return;

        if (row.estValue && !row.isDeleted) {
          const value = parseFloat(row.estValue.replace(',', ''));

          if (Number.isNaN(value)) {
            grossEstValue += 0;
            return;
          }

          grossEstValue += value;
        }
      });

      return formatToCurrency(grossEstValue);
    }
    return '0';
  }

  /**
   * Merge formik data to state data
   * @param stateData
   * @param formikData
   * @returns {Array}
   */
  mergeRowData = (stateData, formikData) => {
    if (formikData && stateData && formikData.length > stateData.length) {
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

    const { pageType } = this.props;
    const initRows = [];
    const row = makeAssetsRowSchema(pageType).cast(initSchema);
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
    const { assetsData } = this.state;
    const nextStateData = [...assetsData];
    const newRows = this.createInitRecords(quantity, initSchema);
    nextStateData.push(...newRows);

    this.setState({ assetsData: nextStateData });
  };

  /**
   * Handle side effects on cell value changed
   * @param e
   */
  onCellValueChanged = e => {
    const { formik } = this.props;
    const fieldName = e.colDef.field;

    switch (fieldName) {
      case 'assetCode':
      case 'cancelQuantity':
      case 'cause': {
        onUpdateBasketsInfoTableData(formik);
        onUpdateAssetPinnedData(formik);
        break;
      }

      default:
    }
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { formik, pageType, receiptData } = this.props;

    const rowData = this.getRowData();
    const pinnedAssetsData =
      formik.values[ASSET_TABLE_PINNED] &&
      formik.values[ASSET_TABLE_PINNED].length
        ? formik.values[ASSET_TABLE_PINNED]
        : [calculateTotalRowAssetTable(receiptData[ASSET_TABLE])];

    return (
      <div style={{ marginBottom: '1rem' }}>
        <Expansion
          title="III. THÔNG TIN TÀI SẢN SỞ HỮU THANH LÝ/HỦY"
          // bỏ button thêm
          // rightActions={rightActions}
          content={
            <FormData
              name={ASSET_TABLE}
              idGrid={ASSET_TABLE}
              gridStyle={{ height: 'auto' }}
              gridProps={{
                context: this,
                domLayout: 'autoHeight',
                onCellValueChanged: this.onCellValueChanged,
                pinnedBottomRowData: pinnedAssetsData,
              }}
              rowData={rowData}
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              ignoreSuppressColumns={['assetCode', 'cause']}
              {...formik} // pass formik props into agGrid
            />
          }
        />
        <ConfirmDeleteDialog
          open={this.state.openDialogDelete}
          onClose={this.onCloseDialogDelete}
          onConfirm={this.confirmDeletion}
          agProps={this.state.agProps}
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  formik: PropTypes.object,
  selectBoxData: PropTypes.object,
  pageType: PropTypes.object,
  receiptData: PropTypes.object,
  isDraftSelected: PropTypes.bool,

  onFetchBigImageBasket: PropTypes.func,
  onDeleteAsset: PropTypes.func,
  onFetchReceiptData: PropTypes.func,
  onFetchAssetAC: PropTypes.func,
  onFetchCauseAssetAC: PropTypes.func,
  dispatch: PropTypes.func,
  onFetchStatusData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectBoxData: makeSelect.selectBoxData(),
  receiptData: makeSelect.receiptData(),
  isDraftSelected: makeSelect.isDraftSelected(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchProductAutocomplete: (orgCode, keyword, callback) =>
      dispatch(actions.fetchProductsAutocomplete(orgCode, keyword, callback)),
    onFetchBigImageBasket: (id, callback) =>
      dispatch(actions.fetchBigImageBasket(id, callback)),
    onDeleteAsset: (rowData, callback) =>
      dispatch(actions.deleteAsset(rowData, callback)),
    onFetchReceiptData: (id, pageType, isBasket) =>
      dispatch(actions.fetchReceiptData(id, pageType, isBasket)),
    onFetchAssetAC: (orgCode, inputText, callback) =>
      dispatch(actions.fetchAssetAC(orgCode, inputText, callback)),
    onFetchCauseAssetAC: (reasonCode, inputText, callback) =>
      dispatch(actions.fetchAssetAC(reasonCode, inputText, callback)),
    onFetchStatusData: (pageType, receiptId, isBasket) =>
      dispatch(actions.fetchStatusData(pageType, receiptId, isBasket)),
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
