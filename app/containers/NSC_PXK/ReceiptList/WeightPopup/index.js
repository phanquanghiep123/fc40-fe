import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { getIn } from 'formik';
import formikPropsHelpers from 'utils/formikUtils';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';

import { closeDialog, showWarning } from 'containers/App/actions';
import MESSAGE from 'containers/App/messageGlobal';

import CompleteButton from 'components/Button/ButtonComplete';
import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';
import ConfirmationDialog from 'components/ConfirmationDialog';

import * as GoodsWeight from 'components/GoodsWeight/components';
import { getTurnToScales } from 'components/GoodsWeight/utils';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { getColumnDefs } from 'utils/transformUtils';
import { columns } from 'components/GoodsWeight/header';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { BTN_COMPLETE } from 'containers/NSC_ImportedStockReceipt/WeightPage/messages';
import { connectContext } from '../connect';
import { makeSelectData } from '../selectors';
import { PRODUCT_STATUS } from '../constants';

import Title from './Title';
import Section1 from './Section1';

import WeightSchema from './Schema';
import { customerRoutine } from '../routines';

export const styles = theme => ({
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingRight: 30, // to line up with the upper section, DO NOT CHANGE
    paddingTop: 0,
  },
  button: {
    width: 150,
  },
});

export class WeightPopup extends React.Component {
  tableRef = null;

  customerColumn = {
    stt: columns.stt,
    baskets: columns.baskets,
    pallets: columns.pallets,
    quantity: columns.quantity,
    realQuantity: columns.realQuantity,
    customerName: {
      headerName: 'Khách Hàng',
      field: 'customerName',
      minWidth: 50,
      editable: params => params.data.quantity,
      cellEditorFramework: MuiSelectEditor,
      cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        valueKey: 'customerName',
        labelKey: 'customerName',
        isClearable: true,
        promiseOptions: this.props.getCustomerAuto,
        onChange: option => {
          let newValue = null;
          if (option) {
            newValue = {
              ...data,
              customerCode: option.customerCode,
              customerName: option.customerName,
            };
          } else {
            newValue = { ...data, customerCode: '', customerName: '' };
          }
          context.props.updateFieldArrayValue(
            'turnToScales',
            rowIndex,
            newValue,
          );
        },
      }),
    },
    actions: columns.actions,
  };

  columnDefs = subType =>
    getColumnDefs(subType === 53 ? this.customerColumn : columns);

  confirmRef = null;

  isComplete = false;

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.initialLoading &&
      nextProps.initialLoading !== this.props.initialLoading
    ) {
      this.onRefreshRecords();
    }
  }

  validateForm = ({ turnToScales }) => {
    if (this.isComplete) {
      if (!turnToScales || !turnToScales.length) {
        this.props.showWarning(MESSAGE.ERROR_TURN_SCALES);
        return false;
      }
    }
    return true;
  };

  onEnteredDialog = () => {};

  onImportStock = (isComplete, handleSubmit) => () => {
    handleSubmit();
    this.isComplete = isComplete;
  };

  onFormSubmit = values => {
    const nextValues = {
      ...values,
      turnToScales: getTurnToScales(values.turnToScales),
    };

    if (this.validateForm(nextValues)) {
      const params = {
        isComplete: this.isComplete,
        documentDetailId: nextValues.documentDetailId,
        weighedImportedStocks: nextValues.turnToScales,
      };

      const performFunc = () => {
        this.props.context.onImportStock(params);
      };

      if (this.isComplete) {
        this.onConfirmShow({
          title: 'Cảnh báo',
          message: 'Bạn có muốn hoàn thành cân cho sản phẩm này?',
          actions: [
            { text: 'Bỏ qua' },
            { text: 'Đồng ý', color: 'primary', onClick: performFunc },
          ],
        });
      } else {
        performFunc();
      }
    }
  };

  onFormInvalid = () => {
    this.props.showWarning(MESSAGE.INVALID_MODEL);
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onRefreshRecords = () => {
    if (this.tableRef) {
      this.tableRef.refreshRecords();
    }
  };

  onDefaultTurnScales = () => {
    if (this.tableRef) {
      this.tableRef.defaultTurnScales();
    }
  };

  render() {
    const {
      classes,
      ui,
      baskets,
      pallets,
      products,
      initialSchema,
    } = this.props;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={WeightSchema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => {
          const detailId = getIn(formik.values, 'documentDetailId');
          const detailStatus = getIn(formik.values, 'status');

          const isButtonDisabled =
            !detailId ||
            ![PRODUCT_STATUS.WEIGHT, PRODUCT_STATUS.UNWEIGHT].includes(
              detailStatus,
            ) ||
            formik.isSubmitting;

          return (
            <ui.Dialog
              {...ui.props}
              title={<Title formik={formik} />}
              content={
                <React.Fragment>
                  <Grid container spacing={24}>
                    <Grid item xs={12} lg={6}>
                      <Section1
                        formik={{
                          ...formik,
                          ...formikPropsHelpers(formik),
                        }}
                        products={products}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <GoodsWeight.Section2
                        formik={{
                          ...formik,
                          ...formikPropsHelpers(formik),
                        }}
                        baskets={baskets}
                        pallets={pallets}
                        onDefaultClick={this.onDefaultTurnScales}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <GoodsWeight.Section3
                        onRef={ref => {
                          this.tableRef = ref;
                        }}
                        formik={{
                          ...formik,
                          ...formikPropsHelpers(formik),
                        }}
                        baskets={baskets}
                        pallets={pallets}
                        quantityKey="exportedQuantity"
                        columnDefs={this.columnDefs(initialSchema.subType)}
                        title={`III. Thông Tin Cân : ${[
                          initialSchema.productCode,
                          initialSchema.productName,
                        ].join(' - ')}`}
                      />
                    </Grid>
                  </Grid>
                  <ConfirmationDialog
                    ref={ref => {
                      this.confirmRef = ref;
                    }}
                  />
                </React.Fragment>
              }
              maxWidth="lg"
              fullWidth
              isDialog={false}
              keepMounted={false}
              suppressClose
              customActionDialog={
                <DialogActions className={classes.actionButtons}>
                  <MuiButton
                    outline
                    className={classes.button}
                    onClick={this.props.closeDialog}
                  >
                    Huỷ Bỏ
                  </MuiButton>
                  <MuiButton
                    disabled={isButtonDisabled}
                    className={classes.button}
                    onClick={debounce(
                      this.onImportStock(false, formik.handleSubmitClick),
                      SUBMIT_TIMEOUT,
                    )}
                  >
                    Lưu
                  </MuiButton>
                  <CompleteButton
                    text={BTN_COMPLETE}
                    disabled={isButtonDisabled}
                    className={classes.button}
                    onClick={debounce(
                      this.onImportStock(true, formik.handleSubmitClick),
                      SUBMIT_TIMEOUT,
                    )}
                  />
                </DialogActions>
              }
              onExitedDialog={formik.handleResetClick}
              onEnteredDialog={this.onEnteredDialog}
            />
          );
        }}
      />
    );
  }
}

WeightPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  context: PropTypes.shape({
    onImportStock: PropTypes.func,
  }),
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  products: PropTypes.array,
  initialSchema: PropTypes.object,
  initialLoading: PropTypes.bool,
  closeDialog: PropTypes.func,
  showWarning: PropTypes.func,
};

WeightPopup.defaultProps = {
  baskets: [],
  pallets: [],
  products: [],
  initialSchema: {},
  initialLoading: false,
};

export const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  showWarning: message => dispatch(showWarning(message)),
  getCustomerAuto: (inputText, callback) =>
    dispatch(customerRoutine.request({ inputText, callback })),
});

const mapStateToProps = createStructuredSelector({
  baskets: makeSelectData('master', 'baskets'),
  pallets: makeSelectData('master', 'pallets'),
  products: makeSelectData('products'),
  initialSchema: makeSelectData('product'),
  initialLoading: makeSelectData('product', 'loading'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  connectContext,
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(WeightPopup);
