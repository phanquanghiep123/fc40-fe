import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import { getIn } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Grid from '@material-ui/core/Grid';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import MuiButton from 'components/MuiButton';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import formikPropsHelpers, { updateFieldArrayValue } from 'utils/formikUtils';
import { alertInvalidWhenSubmit } from 'containers/App/actions';
import reducer from './reducer';
import saga from './saga';
import Table from './Table';
import * as actions from './actions';
import * as selector from './selectors';
import * as pxkSelector from '../PXK/selectors';
import Suggestion from './Suggestion';
import SuggestionDeli from './SuggestionDeli';
import Section3 from './Section3';

const styles = theme => ({
  buttonSpace: { marginRight: theme.spacing.unit * 2 },
  actionButtons: {
    margin: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 4,
  },
  spaceTop: {
    marginTop: theme.spacing.unit * 2,
  },
});

class FarmTransition extends React.Component {
  state = {
    openRecommend: false,
    openSuggestionDeli: false,
  };

  controlDlOpen = () => {
    this.setState({ openRecommend: true });
  };

  controlDlClose = () => {
    this.setState({ openRecommend: false });
  };

  openSuggestionDeli = () => {
    this.setState({
      openSuggestionDeli: true,
    });
  };

  closeSuggestionDeli = () => {
    this.setState({
      openSuggestionDeli: false,
    });
  };

  constructor(props) {
    super(props);
    this.gridApi = null;
  }

  handleAddRecord = () => {
    if (this.tableRef && this.tableRef.addRecord) {
      this.tableRef.addRecord();
    }
  };

  renderButtonAdd = () => (
    <React.Fragment>
      <MuiButton icon="note_add" outline onClick={this.handleAddRecord} />

      <MuiButton
        className={this.props.classes.buttonSpace}
        onClick={this.openSuggestionDeli}
      >
        Gợi Ý Từ Chia Chọn Thực Tế
      </MuiButton>

      <MuiButton
        onClick={this.controlDlOpen}
        className={this.props.classes.buttonSpace}
      >
        Gợi Ý Từ Điều Phối
      </MuiButton>
    </React.Fragment>
  );

  componentDidMount() {
    this.props.onFetchInfoInitProductScreen();
  }

  handleSubmitClick = dataFromSuggest => {
    const { formik } = this.props;
    const { state } = this.tableRef;
    const detailsCommands = getIn(formik.values, 'detailsCommands');

    const acceptData = [];
    dataFromSuggest.forEach(suggest => {
      let flagExist = false;
      detailsCommands.forEach(item => {
        if (
          item.productCode === suggest.productCode &&
          item.slotCode === suggest.slotCode &&
          item.locatorId === suggest.locatorId
        ) {
          flagExist = true;
        }
      });
      if (!flagExist) acceptData.push({ ...suggest, exportedQuantity: 0 });
    });
    const addRows =
      acceptData.length + detailsCommands.length - state.datas.length;
    if (addRows > 0) this.tableRef.addRecord(addRows);

    formik.setFieldValue('detailsCommands', [
      ...detailsCommands,
      ...acceptData,
    ]);
    this.controlDlClose();
  };

  handleDeliSubmitClick = dataFromSuggest => {
    const acceptData = [];
    const detailsCommands = getIn(this.props.formik.values, 'detailsCommands');

    dataFromSuggest.forEach(suggest => {
      const mapping = {
        ...suggest,
        slotCode: suggest.batch,
        isNotSaved: true, // Flag sp chưa được lưu
        isFromDeli: true, // Flag sp từ Gợi ý từ deli
        processingTypeName: suggest.processingName,
        isEnterQuantity: true,
        exportedQuantity: suggest.quantity,
        inventoryQuantity: suggest.quantityInventory,
      };
      const found = detailsCommands.find(
        item =>
          item &&
          item.productCode === mapping.productCode &&
          item.slotCode === mapping.slotCode &&
          item.locatorId === mapping.locatorId,
      );
      if (!found) {
        acceptData.push(mapping);
      }
    });

    const addRows =
      acceptData.length +
      detailsCommands.length -
      this.tableRef.state.datas.length;
    if (addRows > 0) this.tableRef.addRecord(addRows);

    this.props.formik.setFieldValue('detailsCommands', [
      ...detailsCommands,
      ...acceptData,
    ]);
  };

  render() {
    const { openRecommend } = this.state;
    const ButtonAdd = this.renderButtonAdd();
    const {
      onAlertInvalidWhenSubmit,
      getProducts,
      onGetBatchAuto,
      onGetBasketAuto,
      processingTypeOptions,
      formik,
      form,
      ui,
      classes,
      onGetSuggest,
      inventories,
      onResetSuggest,
      organizations,
      history,
      onShowWarning,
      onDeleteRow,
      warehouse,
    } = this.props;
    const newFormik = { ...formik, ...formikPropsHelpers(formik) };
    return (
      <Grid container tabIndex="-1" style={{ outline: 0 }}>
        {form !== TYPE_FORM.VIEW && (
          <Suggestion
            ui={ui}
            classes={classes}
            openDl={openRecommend}
            initValues={newFormik.values}
            onControlDlClose={this.controlDlClose}
            onHandleSubmitClick={this.handleSubmitClick}
            onGetSuggest={onGetSuggest}
            onResetSuggest={onResetSuggest}
            inventories={inventories}
            organizations={organizations}
            onShowWarning={onShowWarning.confirm}
          />
        )}

        <SuggestionDeli
          open={this.state.openSuggestionDeli}
          onClose={this.closeSuggestionDeli}
          onHandleSubmitClick={this.handleDeliSubmitClick}
        />

        <Expansion
          title="II.Thông tin sản phẩm xuất kho"
          rightActions={form !== TYPE_FORM.VIEW ? ButtonAdd : null}
          content={
            <Table
              ref={ref => {
                this.tableRef = ref;
              }}
              history={history}
              form={form}
              formik={newFormik}
              values={newFormik.values}
              setFieldValue={newFormik.setFieldValue}
              updateFieldArrayValue={updateFieldArrayValue(formik)}
              onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
              getProducts={(text, callback, locatorId) =>
                getProducts(
                  text,
                  callback,
                  locatorId,
                  newFormik.values.detailsCommands,
                )
              }
              onGetBatchAuto={onGetBatchAuto}
              onGetBasketAuto={onGetBasketAuto}
              processingTypeOptions={processingTypeOptions}
              onShowWarning={onShowWarning.confirm}
              onDeleteRow={onDeleteRow}
              warehouse={warehouse}
            />
          }
        />
        <Grid item md={6} className={classes.spaceTop}>
          <Section3 formik={formik} />
        </Grid>
      </Grid>
    );
  }
}

FarmTransition.propTypes = {
  classes: PropTypes.object,
  inventories: PropTypes.array,
  ui: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
  getProducts: PropTypes.func,
  onGetBasketAuto: PropTypes.func,
  onFetchInfoInitProductScreen: PropTypes.func,
  onGetSuggest: PropTypes.func,
  onResetSuggest: PropTypes.func,
  processingTypeOptions: PropTypes.array,
  warehouse: PropTypes.array,
  organizations: PropTypes.array,
  formik: PropTypes.object,
  history: PropTypes.object,
  form: PropTypes.string,
  onShowWarning: PropTypes.object,
  onDeleteRow: PropTypes.func,
  onGetBatchAuto: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
    getProducts: (text, callback, locatorId, detailsCommands) =>
      dispatch(actions.getProducts(text, callback, locatorId, detailsCommands)),
    onFetchInfoInitProductScreen: () =>
      dispatch(actions.fetchInfoInitProductScreen()),
    onGetSuggest: (
      deliverCode,
      receiverCode,
      productName,
      slotCode,
      detailsCommands,
    ) =>
      dispatch(
        actions.getSuggest(
          deliverCode,
          receiverCode,
          productName,
          slotCode,
          detailsCommands,
        ),
      ),
    onResetSuggest: () => dispatch(actions.saveInventories([])),
    onGetBatchAuto: (params, inputText, callback) =>
      dispatch(actions.getBatchAuto(params, inputText, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  inventories: selector.makeSelectInventories(),
  processingTypeOptions: selector.makeSelectProcessingType(),
  organizations: selector.makeSelectOrganizations(),
  warehouse: pxkSelector.makeSelectData('warehouse'),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'FarmTransition', reducer });
const withSaga = injectSaga({ key: 'FarmTransition', saga });
export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(FarmTransition)));
