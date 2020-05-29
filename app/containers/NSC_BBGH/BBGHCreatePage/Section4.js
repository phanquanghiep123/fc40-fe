import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import Tooltip from '@material-ui/core/Tooltip';
import { getIn } from 'formik';

import CardActions from '@material-ui/core/CardActions';

import MuiButton from 'components/MuiButton';
import Expansion from 'components/Expansion';
import {
  getProdOrderAuto,
  getFarmProductAuto,
  getFinishProductsAuto,
  getfetchPlanSaga,
  getSuggestSearch,
  getProdOrderBySuggestAuto,
} from './actions';
import { masterRoutine } from './routines';
import {
  makeSelectBaskets,
  makeSelectProcessTypes,
  makeSelectSubmitValuesSuggest,
  makeSelectDataTableSuggest,
} from './selectors';

import GoodsTable from './GoodsTable';
import WeightPopup from '../WeightPopup';
import { TYPE_BBGH, TYPE_PLANT, TYPE_PROCESSING } from './constants';
import SuggestSearchDialog from './Dialogs/SuggestSearchDialog';
import { initSubmitValues } from './Dialogs/Schema';
import Section4BasketTable from './GoodsTable/Section4Basket';
export class Section4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      openSuggeSearch: false,
      stockData: {},
      stockIndex: -1,
    };
    this.tableRef = null;
    this.isEditing = this.isEditing.bind(this);
  }

  isEditing = () => true;

  isCreate = () => true;

  componentDidMount() {
    this.props.onGetInitMaster();
  }

  getProcessingTypes() {
    const { formik, processTypes } = this.props;

    const doType = getIn(formik.values, 'doType');
    const plantType = getIn(formik.values, 'plantType');

    if (
      plantType === TYPE_PLANT.Farm &&
      (doType === TYPE_BBGH.FARM_TO_PLANT_CODE_1 ||
        doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2)
    ) {
      return processTypes.filter(item => item.value === TYPE_PROCESSING.SO_CHE);
    }
    return processTypes;
  }

  handleAddRecord = () => {
    if (this.tableRef && this.tableRef.addRecord) {
      this.tableRef.addRecord();
    }
  };

  handleAddRowBySuggest = rows => {
    if (this.tableRef && this.tableRef.addRecordByRows) {
      this.tableRef.addRecordByRows(rows);
      this.handleDialogSuggestSearchClose();
    }
  };

  onDataReturn = (...params) => {
    if (this.tableRef && this.tableRef.updateWeightReceived) {
      this.tableRef.updateWeightReceived(...params);
    }
  };

  onCancelClick = () => {
    this.setState({ showDialog: false, stockData: {}, stockIndex: -1 });
  };

  handleDialogSuggestSearchOpen = () => {
    const { onGetSuggestSearch, formik, isUpdate } = this.props;
    const {
      deliveryDateTime,
      doWorkingUnitCode,
      receiverCode,
      deliveryName,
    } = formik.values;
    const dataSubmit = {
      ...initSubmitValues,
      deliveryDateTime,
      deliverCode: doWorkingUnitCode,
      receiverCode,
      deliveryName,
      isUpdate,
    };

    onGetSuggestSearch(dataSubmit, _any => {
      this.setState({ openSuggeSearch: true });
      return _any;
    });
  };

  handleDialogSuggestSearchClose = () => {
    this.setState({ openSuggeSearch: false });
  };

  onClickButtonCan = (stockData, stockIndex) => {
    this.setState({ showDialog: true, stockData, stockIndex });
  };

  renderButtonAdd() {
    return (
      <div>
        <Tooltip title="Thêm">
          <MuiButton
            icon="note_add"
            outline
            className={this.props.classes.add}
            onClick={this.handleAddRecord}
          />
        </Tooltip>
      </div>
    );
  }

  renderActions() {
    const { formik, suggest } = this.props;
    const isNCCtoNSC = formik.values.doType === TYPE_BBGH.NCC_TO_NSC;
    const isBasket = formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER;
    const isBasketLoan =
      formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN;
    const checkShowSuggest =
      !isNCCtoNSC &&
      !isBasket &&
      !isBasketLoan &&
      formik.values.receiverCode !== '';
    return (
      suggest && (
        <Grid container spacing={24} justify="flex-end">
          {checkShowSuggest && (
            <Grid item>
              <MuiButton onClick={this.handleDialogSuggestSearchOpen}>
                Gợi Ý Từ Kế Hoạch
              </MuiButton>
            </Grid>
          )}
          {!((isBasket || isBasketLoan) && !this.isEditing()) && (
            <Grid item>
              <MuiButton
                icon="note_add"
                outline
                className={this.props.classes.add}
                onClick={this.handleAddRecord}
              />
            </Grid>
          )}
        </Grid>
      )
    );
  }

  renderGoodsTable() {
    return GoodsTable;
  }

  render() {
    const {
      ui,
      classes,
      formik,
      baskets,
      onAlertInvalidWhenSubmit,
      onGetProdOrderAuto,
      onGetFarmProductAuto,
      onGetFinishProductsAuto,
      onGetfetchPlanSaga,
      onGetProdOrderBySuggestAuto,
      submitValuesSuggest,
      tableSuggestData,
      onGetSuggestSearch,
      suggest,
    } = this.props;
    const { showDialog, openSuggeSearch, stockData, stockIndex } = this.state;
    const processTypes = this.getProcessingTypes();
    const Actions = this.renderActions();
    const ButtonAdd = this.renderButtonAdd();
    const GoodsTableSection = this.renderGoodsTable();
    const dialogSuggest = suggest !== false && (
      <SuggestSearchDialog
        ui={ui}
        openDl={openSuggeSearch}
        onClose={this.handleDialogSuggestSearchClose}
        onGetfetchPlanSaga={onGetfetchPlanSaga}
        addRowsBySuggest={this.handleAddRowBySuggest}
        onGetProdOrderBySuggestAuto={onGetProdOrderBySuggestAuto}
        onGetSuggestSearch={onGetSuggestSearch}
        submitValuesSuggest={submitValuesSuggest}
        tableSuggestData={tableSuggestData}
        deliveryName={formik.values.deliveryName}
        deliveryDateTime={formik.values.deliveryDateTime}
        deliverCode={formik.values.deliverCode}
        receiverCode={formik.values.receiverCode}
      />
    );
    const isBasket =
      formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER ||
      formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN;
    return (
      <React.Fragment>
        <Expansion
          title={isBasket ? 'IV. Thông Tin Khay Sọt' : 'IV. Thông Tin Hàng Hóa'}
          rightActions={Actions}
          content={
            <React.Fragment>
              {!isBasket && (
                <React.Fragment>
                  <GoodsTableSection
                    ref={ref => {
                      this.tableRef = ref;
                    }}
                    values={formik.values}
                    errors={formik.errors}
                    touched={formik.touched}
                    baskets={baskets}
                    processTypes={processTypes}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    updateFieldArrayValue={formik.updateFieldArrayValue}
                    updateFieldArrayTouched={formik.updateFieldArrayTouched}
                    onClickButtonCan={this.onClickButtonCan}
                    onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
                    onGetProdOrderAuto={onGetProdOrderAuto}
                    onGetFarmProductAuto={onGetFarmProductAuto}
                    onGetFinishProductsAuto={onGetFinishProductsAuto}
                  />
                  <CardActions className={classes.actions}>
                    {ButtonAdd}
                  </CardActions>
                </React.Fragment>
              )}
              {isBasket && (
                <Section4BasketTable
                  formik={formik}
                  isCreate={this.isCreate()}
                  isEditing={this.isEditing()}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  baskets={baskets}
                  updateFieldArrayValue={formik.updateFieldArrayValue}
                  ref={ref => {
                    this.tableRef = ref;
                  }}
                />
              )}
            </React.Fragment>
          }
          unmountOnExit={false}
        />
        <WeightPopup
          openDl={showDialog}
          baskets={baskets}
          stockData={stockData}
          stockIndex={stockIndex}
          onDataReturn={this.onDataReturn}
          onCancelClick={this.onCancelClick}
          onAlertInvalidWhenSubmit={this.handleAddRecord}
        />
        {dialogSuggest}
      </React.Fragment>
    );
  }
}

Section4.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  processTypes: PropTypes.array,
  onGetInitMaster: PropTypes.func,
  onAlertInvalidWhenSubmit: PropTypes.func,
  onGetProdOrderAuto: PropTypes.func,
  onGetProdOrderBySuggestAuto: PropTypes.func,
  onGetFarmProductAuto: PropTypes.func,
  onGetFinishProductsAuto: PropTypes.func,
  onGetfetchPlanSaga: PropTypes.func,
  ui: PropTypes.object,
  submitValuesSuggest: PropTypes.any,
  tableSuggestData: PropTypes.any,
  onGetSuggestSearch: PropTypes.any,
  suggest: PropTypes.bool,
  isUpdate: PropTypes.number,
};

Section4.defaultProps = {
  baskets: [],
  processTypes: [],
};

export const mapDispatchToProps = dispatch => ({
  onGetInitMaster: () => dispatch(masterRoutine.request()),
  onGetProdOrderAuto: (params, inputText, callback) =>
    dispatch(getProdOrderAuto(params, inputText, callback)),
  onGetFarmProductAuto: (params, inputText, callback) =>
    dispatch(getFarmProductAuto(params, inputText, callback)),
  onGetFinishProductsAuto: (params, inputText, callback) =>
    dispatch(getFinishProductsAuto(params, inputText, callback)),
  onGetfetchPlanSaga: (params, inputText, callback) =>
    dispatch(getfetchPlanSaga(params, inputText, callback)),
  onGetSuggestSearch: (submitValuesSuggest, callback) =>
    dispatch(getSuggestSearch(submitValuesSuggest, callback)),
  onGetProdOrderBySuggestAuto: (params, inputText, callback) =>
    dispatch(getProdOrderBySuggestAuto(params, inputText, callback)),
});

export const mapStateToProps = createStructuredSelector({
  baskets: makeSelectBaskets(),
  processTypes: makeSelectProcessTypes(),
  submitValuesSuggest: makeSelectSubmitValuesSuggest(),
  tableSuggestData: makeSelectDataTableSuggest(),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withImmutablePropsToJS(Section4));
