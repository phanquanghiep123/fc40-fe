import React from 'react';
import * as PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import { Grid, withStyles } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import Expansion from 'components/Expansion';

import DatePickerControl from 'components/DatePickerControl';
import { Field, Form } from 'formik';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
// import SelectControl from 'components/SelectControl';
import MuiInput from 'components/MuiInput';
import { makeSelectFormData } from '../selectors';
import * as actions from '../actions';

export const styles = () => ({
  overload: {
    color: '#f00 !important',
  },
});

const currentDate = new Date();

class FormSection extends React.Component {
  makeFormAttr = pr => {
    const { onGetProductAuto, onGetOriginAuto, classes } = this.props;
    let autoCompleteTimer;
    const data = pr.values;
    return {
      locatorId: {
        name: 'locatorId',
        label: 'Kho Nguồn',
        value: pr.values.locatorId,
        component: SelectAutocomplete,
        required: true,
        onChange: pr.handleChange,
        options: this.props.warehouse,
        onChangeSelectAutoComplete: selected => {
          if (selected === null) {
            pr.setFieldValue('locatorId', this.props.warehouse[0]);
          } else {
            pr.setFieldValue('locatorId', selected);
          }
        },
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        value: pr.values.productCode,
        component: SelectAutocomplete,
        placeholder: 'Lựa chọn mã sản phẩm',
        isAsync: true,
        required: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetProductAuto(
              inputValue,
              fieldData => {
                callback(fieldData);
                const records = [];
                const row = 10;
                for (let i = 0; i < row; i += 1) {
                  records.push({});
                }
                pr.setValues({
                  ...pr.values,
                  stockTakingQuantity: 0,
                  rateDifference: '',
                  reasonDifference: '',
                  weightDifference: 0,
                  batch: '',
                  turnToScale: records,
                  dateCreatedBatch: new Date(),
                  stockTakingTurnToScaleDetails: [],
                });
              },
              data.plantCode,
              data.locatorId,
            );
          }, 500);
        },
      },
      productName: {
        name: 'productCode.description',
        label: 'Tên Sản Phẩm',
        value: pr.values.productName,
        component: InputControl,
        disabled: true,
      },
      uom: {
        name: 'productCode.uom',
        label: 'Đơn Vị Tính',
        value: pr.values.uom,
        component: InputControl,
        disabled: true,
      },
      inventoryQuantity: {
        name: 'inventoryQuantity',
        label: 'Số Lượng Tồn',
        value: pr.values.inventoryQuantity,
        component: InputControl,
        disabled: true,
      },
      stockTakingQuantity: {
        name: 'stockTakingQuantity',
        label: 'Số Lượng Kiểm Kê',
        value: pr.values.stockTakingQuantity,
        component: InputControl,
        disabled: true,
      },
      originCode: {
        name: 'originCode',
        label: 'Farm/NCC',
        value: pr.values.originCode,
        placeholder: 'Lựa chọn Farm/NCC',
        component: SelectAutocomplete,
        isAsync: true,
        required: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetOriginAuto(inputValue, callback);
          }, 500);
        },
      },
      dateCreatedBatch: {
        name: 'dateBatch',
        label: 'Ngày Tạo Batch',
        component: DatePickerControl,
        value: pr.values.dateCreatedBatch,
        onChange: e => {
          pr.setFieldValue('dateCreatedBatch', e);
          pr.setFieldValue('batch', '');
        },
        maxDate: currentDate,
        required: true,
        clearable: false,
      },
      batch: {
        name: 'batch',
        label: 'Batch Sản Phẩm',
        value: pr.values.batch,
        component: InputControl,
        disabled: true,
      },
      rateDifference: {
        name: 'rateDifference',
        label: 'Chênh Lệch',
        value: pr.values.rateDifference,
        component: MuiInput,
        disabled: true,
        InputProps: {
          className: classes.overload,
        },
      },
      reasonDifference: {
        name: 'reasonDifference',
        label: 'Lí Do Chênh Lệch',
        value: pr.values.reasonDifference,
        onChange: pr.handleChange,
        component: InputControl,
        multiline: true,
        required: true,
      },
    };
  };

  render() {
    const { formik } = this.props;
    const formAttr = this.makeFormAttr(formik);
    return (
      <Expansion
        title="I. Thông Tin Chung"
        content={
          <Form>
            <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.locatorId} />
                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.productCode} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.productName} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.originCode} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.dateCreatedBatch} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.batch} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.uom} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.inventoryQuantity} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.stockTakingQuantity} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.rateDifference} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.reasonDifference} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        }
      />
    );
  }
}
FormSection.propTypes = {
  warehouse: PropTypes.array,
  classes: PropTypes.object.isRequired,
  onGetProductAuto: PropTypes.func,
  onGetOriginAuto: PropTypes.func,
  formik: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  // warehouse: makeSelectWareHouse(),
  formData: makeSelectFormData(),
});
function mapDispatchToProps(dispatch) {
  return {
    onGetProductAuto: (inputText, callback, plantCode, locatorId) =>
      dispatch(
        actions.getProductAuto(inputText, callback, plantCode, locatorId),
      ),
    onGetOriginAuto: (inputText, callback) =>
      dispatch(actions.getOriginAuto(inputText, callback)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(FormSection)),
);
