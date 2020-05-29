import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { Grid, withStyles, Button } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import Expansion from 'components/Expansion';
import * as PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import PeriodPicker from 'components/PeriodPicker';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { createStructuredSelector } from 'reselect';
import { startOfDay } from 'date-fns';
import * as actions from './actions';
import * as selectors from './selectors';

export const styles = theme => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& > *': {
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

class FormSection extends Component {
  formik = null;

  componentDidMount() {
    window.history.replaceState(null, null, window.location.pathname);
    this.props.onFetchFormData();
  }

  makeFormAttr = (pr, formData) => ({
    assetDocumentCode: {
      name: 'assetDocumentCode',
      label: 'Mã Phiếu',
      value: pr.values.assetDocumentCode,
      component: InputControl,
      onChange: pr.handleChange,
    },
    assetDocumentType: {
      name: 'assetDocumentType',
      label: 'Loại Phiếu',
      value: pr.values.assetDocumentType,
      placeholder: 'Tất Cả',
      component: SelectAutocomplete,
      onChange: pr.handleChange,
      options: formData.listSubType,
    },
    filterBasket: {
      name: 'filterBasket',
      label: 'Mã Khay Sọt',
      value: pr.values.filterBasket,
      component: SelectAutocomplete,
      onChange: pr.handleChange,
      options: formData.listBaskets,
      placeholder: 'Lựa Chọn Mã Khay Sọt',
    },
    date: {
      name: 'date',
      label: 'Ngày Nhập/Xuất',
      component: PeriodPicker,
      from: {
        format: 'dd/MM/yyyy',
        name: 'dateFrom',
        value: pr.values.dateFrom,
      },
      to: {
        name: 'dateTo',
        format: 'dd/MM/yyyy',
        value: pr.values.dateTo,
      },
    },
    status: {
      name: 'status',
      label: 'Trạng Thái',
      value: pr.values.status,
      component: SelectAutocomplete,
      placeholder: 'Tất Cả',
      options: formData.listStatus,
    },
    userId: {
      name: 'userId',
      label: 'Nhân Viên Thực Hiện',
      value: pr.values.userId,
      placeholder: 'Lựa Chọn Nhân Viên Thực Hiện',
      component: SelectAutocomplete,
      options: formData.listUser,
    },
    plantCode: {
      name: 'plantCode',
      label: 'Đơn Vị Thực Hiện',
      value: pr.values.plantCode,
      placeholder: 'Tất Cả',
      component: SelectAutocomplete,
      options: formData.listOrgs,
    },
    basketDocumentCode: {
      name: 'basketDocumentCode',
      label: 'Mã PNKS Sử Dụng',
      value: pr.values.basketDocumentCode,
      component: InputControl,
      onChange: pr.handleChange,
    },
    stockTakingCode: {
      name: 'stockTakingCode',
      label: 'Mã BBKK',
      value: pr.values.stockTakingCode,
      component: InputControl,
      onChange: pr.handleChange,
    },
    basketCancellReceiptCode: {
      name: 'basketCancellReceiptCode',
      label: 'PYC Thanh Lý/Hủy',
      value: pr.values.basketCancellReceiptCode,
      component: InputControl,
      onChange: pr.handleChange,
    },
  });

  onReset = () => {
    this.props.onSearch({
      assetDocumentCode: '',
      assetDocumentType: '',
      status: '',
      basketDocumentCode: '',
      userId: '',
      filterBasket: '',
      plantCode: '',
      dateFrom: null,
      dateTo: new Date(),
      stockTakingCode: '',
      basketCancellReceiptCode: '',
      pageSize: 10,
      pageIndex: 0,
      totalItem: 0,
    });
  };

  onFormSubmit = () => {
    this.props.onSearch({
      ...this.formik.values,
      pageIndex: 0,
    });
  };

  render() {
    const { classes, paramsSearch, formData } = this.props;
    return (
      <Expansion
        title="I. Thông Tin Chung"
        content={
          <Formik
            enableReinitialize
            initialValues={paramsSearch}
            onSubmit={this.onFormSubmit}
            validate={values => {
              const errors = {};
              if (
                startOfDay(values.dateFrom).getTime() >
                startOfDay(values.dateTo).getTime()
              ) {
                errors.date =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
              return errors;
            }}
            render={formik => {
              const formAttr = this.makeFormAttr(formik, formData);
              this.formik = formik;
              return (
                <div>
                  <Form>
                    <Grid
                      container
                      spacing={24}
                      style={{ marginBottom: '-0.5rem' }}
                    >
                      <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.assetDocumentCode} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.assetDocumentType} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.status} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.date} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.filterBasket} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.plantCode} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.basketDocumentCode} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.stockTakingCode} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.basketCancellReceiptCode} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.userId} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <div className={classes.btnContainer}>
                      <Button
                        type="button"
                        variant="contained"
                        className={classes.resetBtn}
                        onClick={() => {
                          formik.handleReset();
                          this.onReset();
                        }}
                      >
                        Bỏ lọc
                      </Button>
                      <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form>
                </div>
              );
            }}
          />
        }
      />
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  onFetchFormData: PropTypes.func,
  onSearch: PropTypes.func,
  listSubType: PropTypes.array,
  listStatus: PropTypes.array,
  listUser: PropTypes.array,
  listBaskets: PropTypes.array,
  paramsSearch: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  paramsSearch: selectors.paramsSearchSelect(),
  formData: selectors.listData('formData'),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: payload => dispatch(actions.fetchForm(payload)),
    onSearch: data => dispatch(actions.search(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(FormSection);
