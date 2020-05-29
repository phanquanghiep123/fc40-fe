import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  Grid,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import Expansion from '../../../../components/Expansion';
import PeriodPicker from '../../../../components/PeriodPicker';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import InputControl from '../../../../components/InputControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import MuiButton from '../../../../components/MuiButton';
import { calcDateGap } from '../../../App/utils';

const style = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  btnContainer: {
    marginTop: '30px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& button:not(:last-child)': {
      marginRight: '1rem',
    },
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      ...theme.overrides,
      MuiButton: {
        label: {
          margin: '0 !important',
          padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit * 3}px`,
          minWidth: 100,
        },
      },
    },
  });

export class FormSection extends React.Component {
  componentDidMount() {
    const {
      onFetchFormData,
      formDefaultValues,
      formSubmittedValues,
      formIsSubmitted,
      history,
    } = this.props;

    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });

    if (formIsSubmitted && !isReset) {
      onFetchFormData(formSubmittedValues, false);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const {
      formData,
      onfetchProductsAutocomplete,
      onfetchLSXAutocomplete,
    } = this.props;

    return {
      farmFrom: {
        name: 'farmFrom',
        label: 'Farm (từ)',
        value: pr.values.farmFrom,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.farmFrom,
        placeholder: 'Tìm và chọn Farm',
      },
      farmTo: {
        name: 'farmTo',
        label: 'Farm (đến)',
        value: pr.values.farmTo,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.farmTo,
        placeholder: 'Tìm và chọn Farm',
      },
      lsxFrom: {
        name: 'lsxFrom',
        label: 'Mã LSX (từ)',
        value: pr.values.lsxFrom,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn LSX',
        isAsync: true,
        // minInputLength: 4,
        loadOptionsFunc: (inputValue, callback) =>
          onfetchLSXAutocomplete(inputValue, formData.plantArray, callback),
      },
      lsxTo: {
        name: 'lsxTo',
        label: 'Mã LSX (đến)',
        value: pr.values.lsxTo,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn LSX',
        isAsync: true,
        // minInputLength: 4,
        loadOptionsFunc: (inputValue, callback) =>
          onfetchLSXAutocomplete(inputValue, formData.plantArray, callback),
      },
      datePeriod: {
        name: 'datePeriod',
        label: 'Ngày Kế Hoạch',
        component: PeriodPicker,
        from: {
          name: 'dateFrom',
          value: pr.values.dateFrom,
        },
        to: {
          name: 'dateTo',
          value: pr.values.dateTo,
        },
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        value: pr.values.productCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Mã sản phẩm',
        isAsync: true,
        // minInputLength: 4,
        loadOptionsFunc: onfetchProductsAutocomplete,
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

  render() {
    const {
      classes,
      formDefaultValues,
      formSubmittedValues,
      formIsSubmitted,
      onFetchTableData,
    } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={
            formIsSubmitted && formSubmittedValues
              ? formSubmittedValues
              : formDefaultValues
          }
          validate={values => {
            const { maxDateRange, dateFrom, dateTo } = values;
            const errors = {};

            if (!dateFrom || !dateTo) {
              errors.datePeriod = 'Trường bắt buộc';
            } else {
              const dateGap = calcDateGap(dateFrom, dateTo);

              if (dateGap < 0) {
                errors.datePeriod =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              } else if (dateGap + 1 > maxDateRange) {
                errors.datePeriod = `Khoảng cách ngày không được quá ${maxDateRange} ngày`;
              }
            }

            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onFetchTableData({ ...values, pageIndex: 0 });
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            onFetchTableData(formDefaultValues);
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
                      <Grid container spacing={40}>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.farmFrom} />
                          <Field {...formAttr.lsxFrom} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.farmTo} />
                          <Field {...formAttr.lsxTo} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.datePeriod} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.productCode} />
                          <Field {...formAttr.productName} />
                        </Grid>
                      </Grid>

                      <div className={classes.btnContainer}>
                        <MuiButton outline onClick={pr.handleReset}>
                          Bỏ lọc
                        </MuiButton>
                        <MuiButton onClick={pr.handleSubmit}>
                          Tìm kiếm
                        </MuiButton>
                      </div>
                    </Form>
                  }
                />
              </div>
            );
          }}
        />
      </MuiThemeProvider>
    );
  }
}
FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  onFetchFormData: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onfetchProductsAutocomplete: PropTypes.func,
  onfetchLSXAutocomplete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
  tableData: selectors.tableData(),
  submittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
    onfetchProductsAutocomplete: (inputValue, callback) =>
      dispatch(actions.fetchProductsAutocomplete(inputValue, callback)),
    onfetchLSXAutocomplete: (inputValue, plantArray, callback) =>
      dispatch(actions.fetchLSXAutocomplete(inputValue, plantArray, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJs,
  withStyles(style()),
)(FormSection);
