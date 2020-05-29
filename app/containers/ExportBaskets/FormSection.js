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
    const searchParams = new URLSearchParams(this.props.location.search);
    const doCode = searchParams.get('doCode');
    window.history.replaceState(null, null, window.location.pathname);
    this.props.onFetchFormData({ doCode });
  }

  makeFormAttr = (pr, formData) => {
    let autoCompleteTimer;
    return {
      basketDocumentCode: {
        name: 'basketDocumentCode',
        label: 'Mã Phiếu Xuất Khay Sọt',
        value: pr.values.basketDocumentCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
      exportType: {
        name: 'exportType',
        label: 'Loại Xuất Khay Sọt',
        value: pr.values.exportType,
        placeholder: 'Tất Cả',
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        isMulti: true,
        isMultiline: true,
        options: formData.listSubType,
      },
      filterBasket: {
        name: 'filterBasket',
        label: 'Mã Khay Sọt',
        value: pr.values.filterBasket,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        options: formData.listBaskets,
        placeholder: 'Tìm Và Chọn Mã Khay Sọt',
      },
      date: {
        name: 'date',
        label: 'Ngày Xuất Khay Sọt',
        component: PeriodPicker,
        from: {
          format: 'dd/MM/yyyy',
          name: 'exportedDateFrom',
          value: pr.values.exportedDateFrom,
        },
        to: {
          name: 'exportedDateTo',
          format: 'dd/MM/yyyy',
          value: pr.values.exportedDateTo,
        },
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        value: pr.values.status,
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        isMulti: true,
        isMultiline: true,
        options: formData.listStatus,
      },
      deliverCode: {
        name: 'deliverCode',
        label: 'Bên Giao Hàng',
        value: pr.values.deliverCode,
        component: SelectAutocomplete,
        options: formData.listDeliver,
        placeholder: 'Tất Cả',
      },
      receiverCode: {
        name: 'receiverCode',
        label: 'Bên Nhận Hàng',
        value: pr.values.receiverCode,
        component: SelectAutocomplete,
        placeholder: 'Tìm Và Chọn Bên Nhận Hàng',
        searchable: true,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer);
          autoCompleteTimer = setTimeout(() => {
            this.props.onGetReceiver(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      userId: {
        name: 'userId',
        label: 'Người Xuất Kho',
        value: pr.values.userId,
        placeholder: 'Lựa Chọn Người Xuất Kho',
        component: SelectAutocomplete,
        options: formData.listUser,
      },
      doCode: {
        name: 'doCode',
        label: 'Mã BBGH',
        value: pr.values.doCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
      documentCode: {
        name: 'documentCode',
        label: 'Mã PXB Hàng Hóa',
        value: pr.values.documentCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
    };
  };

  onReset = () => {
    this.props.onSearch({
      basketDocumentCode: '',
      exportType: [],
      status: [
        {
          description: null,
          label: 'Chưa hoàn thành',
          value: 1,
        },
      ],
      deliverCode: '',
      receiverCode: '',
      doCode: '',
      userId: '',
      filterBasket: '',
      exportedDateFrom: null,
      exportedDateTo: new Date(),
      documentCode: '',
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
                startOfDay(values.exportedDateFrom).getTime() >
                startOfDay(values.exportedDateTo).getTime()
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
                            <Field {...formAttr.basketDocumentCode} />
                          </Grid>
                          {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}> */}
                          {/*  <Field {...formAttr.documentReceiptCode} /> */}
                          {/* </Grid> */}
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.doCode} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.documentCode} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12} xl={6}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.status} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.exportType} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Grid container justify="space-between">
                              <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Field {...formAttr.filterBasket} />
                              </Grid>
                              <Grid
                                style={{ paddingLeft: 12 }}
                                item
                                xl={6}
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}
                              >
                                <Field {...formAttr.date} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container>
                          <Grid
                            item
                            style={{ height: 56 }}
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                          >
                            <Field {...formAttr.deliverCode} />
                          </Grid>
                          <Grid
                            item
                            style={{ height: 56 }}
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                          >
                            <Field {...formAttr.receiverCode} />
                          </Grid>
                          <Grid
                            item
                            style={{ height: 56 }}
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                          >
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
  listReceive: PropTypes.array,
  listDeliver: PropTypes.array,
  listSubType: PropTypes.array,
  listStatus: PropTypes.array,
  listUser: PropTypes.array,
  listBaskets: PropTypes.array,
  onGetReceiver: PropTypes.func,
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
    onGetReceiver: (inputValue, callback) =>
      dispatch(actions.getReceiver(inputValue, callback)),
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
