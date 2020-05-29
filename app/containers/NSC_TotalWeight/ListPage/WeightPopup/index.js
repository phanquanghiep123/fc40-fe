import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getColumnDefs } from 'utils/transformUtils';
import { columns } from 'components/GoodsWeight/header';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import formikPropsHelpers from 'utils/formikUtils';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import MESSAGE from 'containers/App/messageGlobal';
import { makeSelectedWeight } from 'containers/App/selectors';
import { closeDialog, showWarning } from 'containers/App/actions';
import MuiButton from 'components/MuiButton';
import FormWrapper from 'components/FormikUI/FormWrapper';
import * as GoodsWeight from 'components/GoodsWeight/components';
import { getTurnToScales } from 'components/GoodsWeight/utils';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import {
  makeSelectData,
  formDefaultValues,
  formSubmittedValues,
} from '../selectors';
import { productRoutine, customerRoutine } from '../routines';
import Section1 from './Section1';
import GoodsWeightSchema from './Schema';

import { GRADE_CODE } from './constants';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export const styles = theme => ({
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
  button: {
    width: 150,
  },
});

export class WeightPopup extends React.Component {
  tableRef = null;

  defaultColumns = {
    stt: columns.stt,
    baskets: columns.baskets,
    pallets: columns.pallets,
    quantity: columns.quantity,
    realQuantity: columns.realQuantity,
    locatorName: {
      headerName: 'Kho',
      field: 'locatorName',
      hide: false,
      minWidth: 50,
      editable: params => params.data.quantity,
      cellEditorFramework: MuiSelectEditor,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        promiseOptions: (inputText, callback) => {
          const filterResult = this.props.locators.filter(
            item =>
              item.description.indexOf(inputText) > -1 ||
              item.id.indexOf(inputText) > -1,
          );
          callback(filterResult);
        },
        valueKey: 'description',
        labelKey: 'description',
        sublabelKey: 'id',
        isClearable: true,
        isSearchable: true,
        onChange: option => {
          let newValue = null;
          if (option) {
            newValue = {
              ...data,
              locatorName: option.description,
              locatorIdTo: option.id,
            };
          } else {
            newValue = { ...data, locatorName: '', locatorIdTo: '' };
          }
          context.props.updateFieldArrayValue(
            context.props.turnScalesKey,
            rowIndex,
            newValue,
          );
        },
      }),
    },
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

  componentWillReceiveProps(nextProps) {
    if (this.props.weightAuto.length < nextProps.weightAuto.length) {
      const nextWeight = nextProps.weightAuto[nextProps.weightAuto.length - 1];
      if (this.tableRef) {
        this.tableRef.setNextWeightAuto(nextWeight);
      }
    }
  }

  getExtraColumns = () => {
    const { productBatchCode, ...params } = this.props.initialSchema;

    if (params.gradeCode * 1 === GRADE_CODE.BTP * 1) {
      return {
        locatorName: {
          hide: true,
        },
        customerName: {
          hide: true,
        },
      };
    }
    return {};
  };

  mappingForm = data => {
    let org = {};

    if (data.org) {
      if (typeof data.org === 'string') {
        org = JSON.parse(data.org);
      } else {
        org = { ...data.org };
      }
    }

    return {
      userId: data.nguoiThucHienId,
      receiverCode: org.value,
      organizationType: org.type,
      date: data.ngayThucHienCan,
    };
  };

  validateForm = ({ turnToScales }) => {
    if (!turnToScales || !turnToScales.length) {
      // this.props.onShowWarning(MESSAGE.ERROR_TURN_SCALES);
      // return false;
    }
    return true;
  };

  onEnteredDialog = () => {
    const { productBatchCode, ...params } = this.props.initialSchema;
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

    const { rowIndex, quantity } = nextValues;

    if (this.validateForm(nextValues)) {
      this.props.onImportStock(
        nextValues,
        (batchCode, documentId, documentDetailId) => {
          if (this.props.onImportedSuccess) {
            this.props.onImportedSuccess(
              rowIndex,
              quantity,
              batchCode,
              documentId,
              documentDetailId,
            );
          }
          if (this.props.closeDialog) {
            this.props.closeDialog();
          }
        },
      );
    }
  };

  onFormInvalid = () => {
    this.props.onShowWarning(MESSAGE.INVALID_MODEL);
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
      initialSchema,
      frmDefaultValues,
      frmSubmittedValues,
      onShowWarning,
    } = this.props;
    const mappedFormValues = this.mappingForm({
      ...frmDefaultValues,
      ...frmSubmittedValues,
    });

    return (
      <FormWrapper
        enableReinitialize
        initialValues={{
          ...initialSchema,
          ...mappedFormValues,
        }}
        validationSchema={GoodsWeightSchema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <ui.Dialog
            {...ui.props}
            title="Cân Hàng Hóa"
            content={
              <Grid container spacing={24}>
                <Grid item xs={12} lg={6}>
                  <Section1 formik={formik} />
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
                    columnDefs={getColumnDefs(this.defaultColumns)}
                    showWarning={onShowWarning}
                    title={`III. Thông Tin Cân : ${[
                      initialSchema.productCode,
                      initialSchema.productName,
                    ].join(' - ')}`}
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
                  className={classes.button}
                  onClick={this.props.closeDialog}
                >
                  Huỷ Bỏ
                </MuiButton>
                <MuiButton
                  disabled={formik.isSubmitting}
                  className={classes.button}
                  onClick={debounce(formik.handleSubmitClick, SUBMIT_TIMEOUT)}
                >
                  Lưu
                </MuiButton>
              </DialogActions>
            }
            onExitedDialog={formik.handleResetClick}
            onEnteredDialog={this.onEnteredDialog}
          />
        )}
      />
    );
  }
}

WeightPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  weightAuto: PropTypes.array,
  initialSchema: PropTypes.object,
  frmDefaultValues: PropTypes.object,
  frmSubmittedValues: PropTypes.object,
  closeDialog: PropTypes.func,
  onShowWarning: PropTypes.func,
  onImportStock: PropTypes.func,
  onImportedSuccess: PropTypes.func,
  onGetProductTurnScales: PropTypes.func,
};

WeightPopup.defaultProps = {
  baskets: [],
  pallets: [],
  weightAuto: [],
  initialSchema: {},
  frmDefaultValues: {},
  frmSubmittedValues: {},
};

export const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  onShowWarning: message => dispatch(showWarning(message)),
  onImportStock: (data, callback) =>
    dispatch(productRoutine.editingRequest({ data, callback })),
  onGetProductTurnScales: params =>
    dispatch(productRoutine.request({ params })),
  onGetCustomerAuto: (inputText, callback) =>
    dispatch(customerRoutine.request({ inputText, callback })),
});

const mapStateToProps = createStructuredSelector({
  locators: makeSelectData('master', 'locators'),
  baskets: makeSelectData('master', 'baskets'),
  pallets: makeSelectData('master', 'pallets'),
  weightAuto: makeSelectedWeight(),
  initialSchema: makeSelectData('product'),
  frmDefaultValues: formDefaultValues(),
  frmSubmittedValues: formSubmittedValues(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withStyles(styles)(withImmutablePropsToJS(WeightPopup)),
);
