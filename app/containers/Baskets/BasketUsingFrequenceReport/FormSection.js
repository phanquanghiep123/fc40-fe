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
import SelectAutocomplete from 'components/SelectAutocomplete';
import { createStructuredSelector } from 'reselect';
import { startOfDay } from 'date-fns';
import * as actions from './actions';
import * as selectors from './selectors';
import MonthYearPickerControl from '../../../components/MonthYearPickerControl';

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

  makeFormAttr = (pr, formData) => ({
    basketCode: {
      name: 'basketCode',
      label: 'Mã Khay Sọt',
      value: pr.values.basketCode,
      component: SelectAutocomplete,
      placeholder: 'Tìm Và Chọn Mã Khay Sọt',
      isMulti: true,
      isMultiline: true,
      options: formData.listBaskets,
    },
    plantCode: {
      name: 'plantCode',
      label: 'Đơn Vị Quản Lý',
      value: pr.values.plantCode,
      component: SelectAutocomplete,
      placeholder: 'Tất Cả',
      isMulti: true,
      isMultiline: true,
      searchable: true,
      options: formData.listPlant,
    },
    date: {
      name: 'date',
      label: 'Tháng',
      component: MonthYearPickerControl,
      clearable: false,
      from: {
        name: 'dateFrom',
        value: pr.values.dateFrom,
      },
      to: {
        name: 'dateTo',
        value: pr.values.dateTo,
      },
      // onChange: value => {
      //   console.log(value);
      // },
    },
  });

  onReset = () => {
    this.props.onSearch({
      plantCode: [],
      basketCode: '',
      dateFrom: new Date(),
      dateTo: new Date(),
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
                  'Tháng bắt đầu phải nhỏ hơn hoặc bằng tháng kết thúc';
              }
              if (
                startOfDay(values.dateFrom).getTime() > new Date() ||
                startOfDay(values.dateTo).getTime() > new Date()
              ) {
                errors.date =
                  'Tháng được chọn phải nhỏ hơn hoặc bằng tháng hiện tại';
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
                      <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.plantCode} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.basketCode} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.date} />
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
