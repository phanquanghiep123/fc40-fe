/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Typography, createMuiTheme } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './customAgStyle.css';
import FormData from '../../../../components/FormikUI/FormData';
import * as actions from '../actions';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import Expansion from '../../../../components/Expansion';
import * as makeSelect from '../selectors';
import ConfirmDeleteDialog from './DeleteDialog';
import ImagePopup from './ImagePopup';
import appTheme from '../../../App/theme';
import { makeBasketsInUseRowSchema } from '../Schemas';
import {
  BASKET_INUSE_TABLE,
  BASKET_INUSE_TABLE_PINNED,
  ASSET_TABLE,
} from '../constants';
import { getNested } from '../../../App/utils';
import {
  calculateTotalRowBasketsInUseTable,
  onUpdateBasketsInfoTableData,
  onUpdateBasketsInUsePinnedData,
  onUpdateAssetPinnedData,
} from '../utils';
import { basketsInUseFields } from '../tableFields';
import MuiButton from '../../../../components/MuiButton';
import Popup from '../../../../components/MuiPopup';
import SelectAssetsPopup from '../SelectAssetsPopup';

const style = (theme = appTheme) => ({
  addBtn: {
    minWidth: 'unset',
    width: 40,
    color: theme.palette.primary.main,
    background: '#fff',
  },
  rightActions: {
    '& button': {
      marginRight: '0.5rem',
    },
    '& button:not(:last-child)': {
      marginRight: '1rem',
    },
  },
});

const selectAssetsPopupTheme = createMuiTheme({
  ...appTheme,
  overrides: {
    ...appTheme.overrides,
    MuiDialog: {
      paper: {
        backgroundColor: appTheme.palette.background.default,
      },
    },
    MuiDialogTitle: {
      root: {
        padding: `${appTheme.spacing.unit * 2}px ${appTheme.spacing.unit *
          3}px ${appTheme.spacing.unit}px`,
      },
    },
    MuiDialogContent: {
      root: {
        padding: `${appTheme.spacing.unit}px ${appTheme.spacing.unit * 3}px`,
        '&:first-child': {
          paddingTop: appTheme.spacing.unit,
        },
      },
    },
  },
});

class BasketsInUseTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basketsInUseData: this.createInitRecords(),
      openDialogDelete: false,
      agProps: undefined, // store the agProps of the cell where delete button is clicked
      openImagePopup: false,
      columnDefs: [],
      defaultColDef: {},
      openSelectAssetsPopup: false,
    };
  }

  isEdit = false;

  dataUseTable = {};

  componentDidMount() {
    this.onMakeColumnDefs();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { receiptData, isDraftSelected, formik } = this.props;
    if (
      prevProps.receiptData.isAutoReceipt !== receiptData.isAutoReceipt ||
      prevProps.isDraftSelected !== isDraftSelected ||
      prevProps.formik.values.org !== formik.values.org
    ) {
      this.onMakeColumnDefs();
    }
  }

  onOpenSelectAssetsPopup = (isEdit, data) => {
    const { formik, onFetchPopupBasket, selectBoxData } = this.props;
    const defaultBasketLocatorCode =
      selectBoxData.basketLocatorCode && selectBoxData.basketLocatorCode.length
        ? selectBoxData.basketLocatorCode[0]
        : '';
    onFetchPopupBasket(formik, defaultBasketLocatorCode, isEdit, data);
    this.setState({ openSelectAssetsPopup: true });
  };

  closeSelectAssetsPopup = () => {
    this.setState({ openSelectAssetsPopup: false });
  };

  onEditPopup = () => {
    this.isEdit = true;
  };

  onResetEditPopup = () => {
    this.isEdit = false;
  };

  onSetDataUseTable = data => {
    this.dataUseTable = data;
  };

  /**
   * Make table column definitions
   */
  onMakeColumnDefs = () => {
    const {
      pageType,
      receiptData,
      selectBoxData,
      onFetchBasketLocatorAC,
      onFetchBasketByLocatorAC,
      isDraftSelected,
      dispatch,
    } = this.props;
    this.setState({
      columnDefs: makeColumnDefs(
        pageType,
        receiptData,
        selectBoxData,
        this.onOpenDialogDelete,
        this.onOpenImagePopup,
        this.onOpenSelectAssetsPopup,
        this.onEditPopup,
        this.onSetDataUseTable,
        onFetchBasketLocatorAC,
        onFetchBasketByLocatorAC,
        onUpdateBasketsInUsePinnedData,
        isDraftSelected,
        dispatch,
      ),
      defaultColDef: makeDefaultColDef(),
    });
  };

  // Open confirm dialog
  onOpenDialogDelete = agProps => {
    this.setState({ openDialogDelete: true, agProps });
  };

  // Close confirm dialog
  onCloseDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  // Open confirm dialog
  onOpenImagePopup = (rowIndex, imgIndex, deleteImageFunc) => {
    this.setState({
      openImagePopup: true,
      rowIndex,
      imgIndex,
      deleteImageFunc,
    });
  };

  // Close confirm dialog
  closeImagePopup = () => {
    this.setState({
      openImagePopup: false,
      rowIndex: null,
      imgIndex: null,
      deleteImageFunc: undefined,
    });
  };

  /**
   * On click confirm button in dialog
   */
  confirmDeletion = () => {
    const { agProps } = this.state;
    const { onDeleteBasket } = this.props;
    const isFromServer = getNested(agProps, 'data', 'isLoadedFromServer');
    if (isFromServer) {
      onDeleteBasket(agProps.data, this.proceedFEDeletion);
    } else {
      this.proceedFEDeletion();
    }
  };

  /**
   * Delete product record in products table
   */
  proceedFEDeletion = () => {
    const { agProps } = this.state;
    if (!agProps) return;
    const { formik } = this.props;
    const { rowIndex } = agProps;

    const updatedData = [...formik.values[BASKET_INUSE_TABLE]];
    updatedData.splice(rowIndex, 1);
    formik.updateFieldValue(BASKET_INUSE_TABLE, updatedData, true);

    const valueAsset = formik.values.assets;
    const dataAssetTable = valueAsset.filter(item => {
      if (
        item.cancelRequestBasketDetailCode !==
        agProps.data.cancelRequestBasketDetailCode
      ) {
        return item;
      }
      return null;
    });
    formik.updateFieldValue(ASSET_TABLE, dataAssetTable, true);

    // const updatedEstValue = this.getEstValue(updatedData);
    // formik.setFieldValue('estValue', updatedEstValue, true);
    onUpdateBasketsInUsePinnedData(formik, updatedData);
    onUpdateAssetPinnedData(formik, dataAssetTable);
    onUpdateBasketsInfoTableData(formik, undefined, updatedData);
    this.setState({ agProps: null });
  };

  /**
   * Get Row Data
   * @returns {Array}
   */
  getRowData() {
    const { basketsInUseData } = this.state;
    const { values } = this.props.formik;

    return this.mergeRowData(basketsInUseData, values[BASKET_INUSE_TABLE]);
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

    const { pageType } = this.props;
    const initRows = [];
    const row = makeBasketsInUseRowSchema(pageType).cast(initSchema);
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
    const { basketsInUseData } = this.state;
    const { selectBoxData, formik } = this.props;
    const t = basketsInUseFields;
    let [newRow] = this.createInitRecords(quantity, initSchema);
    this.setState({ basketsInUseData: [...basketsInUseData, newRow] });

    if (
      selectBoxData &&
      selectBoxData.basketLocatorCode &&
      selectBoxData.basketLocatorCode[0]
    ) {
      const defaultLocator = selectBoxData.basketLocatorCode[0];

      newRow = {
        ...newRow,
        [t.basketLocatorCode]: defaultLocator.value,
        [t.basketLocatorName]: defaultLocator.label,
        [t.locatorType]: defaultLocator.locatorType,
      };
    }

    const nextTableData = this.mergeRowData(
      basketsInUseData,
      formik.values[BASKET_INUSE_TABLE],
    );
    nextTableData.push(newRow);
    formik.setFieldValue(BASKET_INUSE_TABLE, nextTableData);
  };

  /**
   * Handle side effects on cell value changed
   * @param e
   */
  onCellValueChanged = e => {
    const { formik } = this.props;
    const fieldName = e.colDef.field;
    const t = basketsInUseFields;
    const basketsInUseTable = getNested(
      e.context.props,
      'formik',
      'values',
      BASKET_INUSE_TABLE,
    );

    switch (fieldName) {
      case t.basketLocatorCode:
      case t.basketLocatorName:
      case t.palletBasketCode:
      case t.inStockQuantity:
      case t.cancelQuantity: {
        onUpdateBasketsInUsePinnedData(formik);
        onUpdateBasketsInfoTableData(formik, undefined, basketsInUseTable);
        break;
      }

      default:
    }
  };

  render() {
    const {
      classes,
      formik,
      pageType,
      receiptData,
      onFetchBigImageBasket,
      onFetchBigImageBasketRefer,
    } = this.props;
    const t = basketsInUseFields;
    const rowData = this.getRowData();
    const pinnedData =
      formik.values[BASKET_INUSE_TABLE_PINNED] &&
      formik.values[BASKET_INUSE_TABLE_PINNED].length
        ? formik.values[BASKET_INUSE_TABLE_PINNED]
        : [calculateTotalRowBasketsInUseTable(receiptData[BASKET_INUSE_TABLE])];

    const rightActions = (
      <div className={classes.rightActions}>
        {pageType.create || (pageType.edit && !receiptData.isAutoReceipt) ? (
          <MuiButton
            outline
            onClick={() => this.onOpenSelectAssetsPopup(this.isEdit)}
          >
            Chọn Khay Sọt Thanh Lý/Hủy
          </MuiButton>
        ) : null}
        {/* {pageType.create || */}
        {/* (pageType.edit && receiptData.showBasketsInUseTableButtons) ? ( */}
        {/*  <Button */}
        {/*    className={classes.addBtn} */}
        {/*    variant="contained" */}
        {/*    onClick={this.insertNewRows} */}
        {/*  > */}
        {/*    <AddCircle /> */}
        {/*  </Button> */}
        {/* ) : null} */}
      </div>
    );

    let hasDiffMoreThanZero = false;
    const basketsInUseData = formik.values[BASKET_INUSE_TABLE];
    // eslint-disable-next-line no-restricted-syntax
    for (const row of basketsInUseData) {
      if (row && row[t.maxCancelQuantityDiff] > 0) {
        hasDiffMoreThanZero = true;
        break;
      }
    }

    const showMessage =
      !pageType.create && receiptData.isAutoReceipt && hasDiffMoreThanZero;

    return (
      <>
        <div style={{ marginBottom: '1rem' }}>
          <Expansion
            title="II. THÔNG TIN KHAY SỌT SỬ DỤNG THANH LÝ/HỦY"
            rightActions={rightActions}
            content={
              <>
                {showMessage && (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{ marginBottom: '0.5rem', marginTop: '-1rem' }}
                  >
                    Phần chênh lệch = SL hủy tối đa - SL hủy sẽ được xử lí
                    chuyển về kho nguồn khi Xuất hủy.
                  </Typography>
                )}

                <FormData
                  name={BASKET_INUSE_TABLE}
                  idGrid={BASKET_INUSE_TABLE}
                  gridStyle={{ height: 'auto' }}
                  gridProps={{
                    context: this,
                    domLayout: 'autoHeight',
                    onCellValueChanged: this.onCellValueChanged,
                    pinnedBottomRowData: pinnedData,
                  }}
                  rowData={rowData}
                  columnDefs={this.state.columnDefs}
                  defaultColDef={this.state.defaultColDef}
                  ignoreSuppressColumns={[
                    'basketLocatorCode',
                    'palletBasketCode',
                  ]}
                  {...formik} // pass formik props into agGrid
                />
              </>
            }
          />
          <ConfirmDeleteDialog
            open={this.state.openDialogDelete}
            onClose={this.onCloseDialogDelete}
            onConfirm={this.confirmDeletion}
            agProps={this.state.agProps}
          />
          <ImagePopup
            open={this.state.openImagePopup}
            onClose={this.closeImagePopup}
            rowIndex={this.state.rowIndex}
            imgIndex={this.state.imgIndex}
            deleteImage={this.state.deleteImageFunc}
            formik={formik}
            pageType={pageType}
            onFetchBigImageBasket={onFetchBigImageBasket}
            onFetchBigImageBasketRefer={onFetchBigImageBasketRefer}
          />
        </div>

        <Popup
          open={this.state.openSelectAssetsPopup}
          onClose={this.closeSelectAssetsPopup}
          content={
            <SelectAssetsPopup
              formik={formik}
              pageType={pageType}
              onClose={this.closeSelectAssetsPopup}
              isEdit={this.isEdit}
              data={this.dataUseTable}
              onResetEdit={this.onResetEditPopup}
            />
          }
          dialogProps={{ maxWidth: 'lg', keepMounted: false }}
          theme={selectAssetsPopupTheme}
        />
      </>
    );
  }
}

BasketsInUseTable.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  selectBoxData: PropTypes.object,
  pageType: PropTypes.object,
  receiptData: PropTypes.object,
  isDraftSelected: PropTypes.bool,

  dispatch: PropTypes.func,
  onFetchBigImageBasket: PropTypes.func,
  onFetchBigImageBasketRefer: PropTypes.func,

  onDeleteBasket: PropTypes.func,
  onFetchReceiptData: PropTypes.func,
  onFetchAssetAC: PropTypes.func,
  onFetchCauseAssetAC: PropTypes.func,
  onFetchBasketByLocatorAC: PropTypes.func,
  onFetchBasketLocatorAC: PropTypes.func,
  onFetchPopupBasket: PropTypes.func,
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
    onFetchBigImageBasketRefer: (id, callback) =>
      dispatch(actions.fetchBigImageRefer(id, callback)),
    onDeleteBasket: (rowData, callback) =>
      dispatch(actions.deleteAsset(rowData, callback)),
    onFetchReceiptData: (id, pageType, isBasket) =>
      dispatch(actions.fetchReceiptData(id, pageType, isBasket)),
    onFetchAssetAC: (orgCode, inputText, callback) =>
      dispatch(actions.fetchAssetAC(orgCode, inputText, callback)),
    onFetchCauseAssetAC: (reasonCode, inputText, callback) =>
      dispatch(actions.fetchAssetAC(reasonCode, inputText, callback)),
    onFetchBasketByLocatorAC: (
      formik,
      basketLocatorCode,
      inputText,
      callback,
    ) =>
      dispatch(
        actions.fetchBasketByLocatorAC(
          formik,
          basketLocatorCode,
          inputText,
          callback,
        ),
      ),
    onFetchBasketLocatorAC: (filters, callback) =>
      dispatch(actions.fetchBasketLocatorsAC(filters, callback)),
    onFetchPopupBasket: (formik, basketLocatorCode, isEdit, data) =>
      dispatch(
        actions.fetchPopupBasket(formik, basketLocatorCode, isEdit, data),
      ),
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
)(BasketsInUseTable);
