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
import DatePickerControl from 'components/PickersControl';
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
      onChangeSelectAutoComplete: selected => {
        pr.setFieldValue('plantCode', selected);
        const plantCodes =
          selected.length !== 0
            ? selected.map(item => item.value).toString()
            : formData.listPlant.map(item => item.value).toString();
        this.props.onGetReceiver({
          plantCodes,
        });
      },
    },
    filterLocator: {
      name: 'filterLocator',
      label: 'Kho',
      value: pr.values.filterLocator,
      component: SelectAutocomplete,
      placeholder: 'Tất Cả',
      isMulti: true,
      isMultiline: true,
      // isAsync: true,
      options: formData.locators,
      // loadOptions: (filter, callback) => {
      //   clearTimeout(autoCompleteTimer);
      //   autoCompleteTimer = setTimeout(() => {
      //     const plantCodes =
      //       pr.values.plantCode.length !== 0
      //         ? pr.values.plantCode.map(item => item.value).toString()
      //         : formData.listPlant.map(item => item.value).toString();
      //     this.props.onGetReceiver({ filter, plantCodes }, fieldData => {
      //       callback(fieldData);
      //     });
      //   }, 1000);
      // },
    },
    date: {
      name: 'date',
      label: 'Ngày Tồn',
      component: DatePickerControl,
      format: 'dd/MM/yyyy',
      value: new Date(),
      disabled: true,
    },
  });

  onReset = () => {
    this.props.onSearch({
      plantCode: [],
      basketCode: '',
      date: new Date().toISOString(),
      filterLocator: [],
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
                      <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.plantCode} />
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.date} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                        <Grid container>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Field {...formAttr.filterLocator} />
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
