/**
 *
 * WeightDialog
 *
 */
import { formikPropsHelpers } from 'components/FormikUI/utils';
import { getTurnToScales } from 'components/GoodsWeight/utils';
import * as GoodsWeight from 'components/GoodsWeight/components';
import { columns } from 'components/GoodsWeight/header';
import React from 'react';
import PropTypes from 'prop-types';
import { showWarning } from 'containers/App/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import MuiButton from 'components/MuiButton';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { getColumnDefs } from 'utils/transformUtils';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MESSAGE from 'containers/App/messageGlobal';
import makeSelect from './selectors';
import reducer from './reducer';
import saga from './saga';
import { GET_BASKETS_PALLETS, GET_CUSTOMER_AUTO } from './constants';
export const styles = theme => ({
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
  button: {
    width: 150,
  },
});
/* eslint-disable react/prefer-stateless-function */
export class WeightDialog extends React.PureComponent {
  customerColumn = {
    stt: columns.stt,
    baskets: columns.baskets,
    pallets: columns.pallets,
    quantity: columns.quantity,
    realQuantity: columns.realQuantity,
    customerName: {
      headerName: 'Khách Hàng',
      field: 'customerName',
      hide: false,
      minWidth: 50,
      editable: params => params.data.quantity,
      cellEditorFramework: MuiSelectEditor,
      cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        valueKey: 'customerName',
        labelKey: 'customerName',
        isClearable: true,
        promiseOptions: this.props.onGetCustomerAuto,
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

  onDefaultTurnScales = () => {
    if (this.tableRef) {
      this.tableRef.defaultTurnScales();
    }
  };

  componentDidMount() {
    this.props.getBasketsPallets();
  }

  onEnteredDialog = () => {
    const { productBatchCode, ...params } = this.props.data;
    const nextParams = {
      ...params,
      slotCode: productBatchCode,
    };

    this.props.onGetProductTurnScales(nextParams);
  };

  onFormSubmit = values => {
    const nextValues = {
      ...values,
      turnToScales: getTurnToScales(values.turnToScales),
    };

    if (this.validateForm(nextValues)) {
      this.props.onSubmitWeight(nextValues, () => {
        if (this.props.closeDialog) {
          this.props.closeDialog();
        }
      });
    }
  };

  validateForm = ({ turnToScales }) => {
    if (!turnToScales || !turnToScales.length) {
      this.props.onShowWarning(MESSAGE.ERROR_TURN_SCALES);
      return false;
    }
    return true;
  };

  render() {
    const {
      ui,
      onShowWarning,
      ignoreCustomer,
      weightSchema,
      data,
      classes,
      baskets,
      pallets,
      title3,
    } = this.props;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={data}
        validationSchema={weightSchema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <ui.Dialog
            {...ui.props}
            openDl={this.props.openDl}
            title="Cân Hàng Hóa"
            content={
              <Grid container spacing={24}>
                <Grid item xs={12} lg={6}>
                  <GoodsWeight.Section1>
                    <Grid container spacing={16}>
                      {this.props.section1Attr.map(item => (
                        <Grid item md={6} xs={12}>
                          <Field {...item} />
                        </Grid>
                      ))}
                    </Grid>
                  </GoodsWeight.Section1>
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
                    showWarning={onShowWarning}
                    title={title3}
                    columnDefs={getColumnDefs(
                      ignoreCustomer ? columns : this.customerColumn,
                      {},
                    )}
                  />
                </Grid>
              </Grid>
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
                  onClick={this.props.closeDialog}
                  className={classes.button}
                >
                  Huỷ Bỏ
                </MuiButton>
                <MuiButton
                  disabled={formik.isSubmitting}
                  onClick={formik.handleSubmitClick}
                  className={classes.button}
                >
                  Lưu
                </MuiButton>
              </DialogActions>
            }
            onExitedDialog={formik.handleResetClick}
            // onEnteredDialog={this.onEnteredDialog}
          />
        )}
      />
    );
  }
}

WeightDialog.propTypes = {
  onSubmitWeight: PropTypes.func,
  weightSchema: PropTypes.any,
  baskets: PropTypes.any,
  classes: PropTypes.any,
  closeDialog: PropTypes.any,
  data: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
  getBasketsPallets: PropTypes.any,
  ignoreCustomer: PropTypes.bool,
  onGetCustomerAuto: PropTypes.any,
  onGetProductTurnScales: PropTypes.any,
  onShowWarning: PropTypes.any,
  openDl: PropTypes.any,
  pallets: PropTypes.any,
  section1Attr: PropTypes.any,
  title3: PropTypes.any,
  ui: PropTypes.any,
  updateFieldArrayValue: PropTypes.any,
};

WeightDialog.defaultProps = {
  ignoreCustomer: false,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelect('data'),
  baskets: makeSelect('baskets'),
  pallets: makeSelect('pallets'),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getBasketsPallets: () => dispatch({ type: GET_BASKETS_PALLETS }),
    onGetCustomerAuto: (inputText, callback) =>
      dispatch({ type: GET_CUSTOMER_AUTO, inputText, callback }),
    onShowWarning: message => dispatch(showWarning(message)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'weightDialog', reducer });
const withSaga = injectSaga({ key: 'weightDialog', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(WeightDialog);
