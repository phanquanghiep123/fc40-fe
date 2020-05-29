import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dateFns from 'date-fns';
import { compose } from 'redux';
import { Form, Field, Formik, connect as connectFormik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { withStyles, Grid } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import MuiInput from '../../../../components/MuiInput';
import InputControl from '../../../../components/InputControl';
// import DatePickerControl from '../../../../components/DatePickerControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import Expansion from '../../../../components/Expansion';
import MuiButton from '../../../../components/MuiButton';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { getProductCodes } from '../utils';

const styles = theme => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  btn: {
    width: 140,
  },
});

export class FormSection extends React.Component {
  componentDidMount() {
    //
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const {
      formik,
      organizations,
      ongetDeliProductCodeAutocomplete,
    } = this.props;
    let autoCompleteTimer;

    return {
      exportingOrg: {
        name: 'exportingOrg',
        label: 'Đơn Vị Xuất Hàng',
        // component: InputControl,
        value: formik.values.deliverCode.value,
        select: true,
        options: organizations,
        labelKey: 'name',
        disabled: true,
      },
      importingOrg: {
        name: 'importingOrg',
        label: 'Đơn Vị Nhận Hàng',
        // component: InputControl,
        value: formik.values.receiverCode.value,
        select: true,
        options: organizations,
        labelKey: 'name',
        disabled: true,
      },

      pickingDate: {
        name: 'pickingDate',
        label: 'Ngày Chia Chọn',
        // component: DatePickerControl,
        value: dateFns.format(new Date(formik.values.date), 'dd/MM/yyyy'),
        disabled: true,
      },

      fromStock: {
        name: 'fromStock',
        label: 'Kho Nguồn',
        component: InputControl,
        value: pr.values.fromStock,
        onChange: pr.handleChange,
        disabled: true,
      },

      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        value: pr.values.productCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn SP',
        isAsync: true,
        minInputLength: 3,
        loadOptions: (inputValue, callback) => {
          if (inputValue.length < 3) {
            callback(null);
            return;
          }

          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            ongetDeliProductCodeAutocomplete(inputValue, data => {
              const maxResult = 100;
              if (data.length > maxResult) {
                callback(data.slice(0, maxResult));
                return;
              }
              callback(data);
            });
          }, 500);
        },
      },

      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
      },
    };
  };

  onGetDeliTableData = params => {
    const {
      date,
      deliverCode,
      receiverCode,
      detailsCommands,
    } = this.props.formik.values;
    const nextParams = {
      ...params,
      pickingDate: date,
      exportingOrg: deliverCode,
      importingOrg: receiverCode,
      exceptProductCodes: getProductCodes(detailsCommands),
    };
    this.props.onGetDeliTableData(nextParams);
  };

  render() {
    const { classes, deliFormDefaultValues } = this.props;
    const initialValues = { ...deliFormDefaultValues };

    return (
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, formikActions) => {
          formikActions.setSubmitting(false);
        }}
        render={pr => {
          const formAttr = this.makeFormAttr(pr);
          return (
            <div className={classes.expansionContainer}>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Form>
                    <Grid container spacing={24}>
                      <Grid item xs={6} md={3}>
                        <MuiInput {...formAttr.exportingOrg} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <MuiInput {...formAttr.importingOrg} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <MuiInput {...formAttr.pickingDate} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.fromStock} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.productCode} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.productName} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <MuiButton
                            outline
                            onClick={() => {
                              pr.setValues({ ...deliFormDefaultValues });
                              this.onGetDeliTableData(deliFormDefaultValues);
                            }}
                            style={{ marginRight: '1rem' }}
                          >
                            Bỏ lọc
                          </MuiButton>
                          <MuiButton
                            onClick={() => {
                              this.onGetDeliTableData(pr.values);
                            }}
                          >
                            Tìm kiếm
                          </MuiButton>
                        </div>
                      </Grid>
                    </Grid>
                  </Form>
                }
              />
            </div>
          );
        }}
      />
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  deliFormData: PropTypes.object,
  organizations: PropTypes.array,
  deliFormDefaultValues: PropTypes.object,
  onGetDeliTableData: PropTypes.func,
  ongetDeliProductCodeAutocomplete: PropTypes.func,
};

FormSection.defaultProps = {
  organizations: [],
};

const mapStateToProps = createStructuredSelector({
  deliFormData: selectors.deliFormData(),
  deliFormDefaultValues: selectors.deliFormDefaultValues(),
  organizations: selectors.makeSelectOrganizations(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDeliTableData: formValues =>
      dispatch(actions.getDeliTableData(formValues)),
    ongetDeliProductCodeAutocomplete: (inputValue, callback) =>
      dispatch(actions.getDeliProductCodeAutocomplete(inputValue, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  connectFormik,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
