import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid, MenuItem } from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import PeriodPicker from 'components/PeriodPicker';
import Expansion from 'components/Expansion';
import SelectAutocomplete from 'components/SelectAutocomplete';
import SelectControl from 'components/SelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
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
  gridDate: {
    display: 'flex',
    justifyContent: 'space-betwwen',
    '& > div': {
      marginTop: '0 !important',
    },
  },
  gridDateDivider: {
    alignSelf: 'flex-start',
    padding: '.5rem .75rem',
  },
  dateLabel: {
    display: 'block',
    fontSize: '0.75rem',
    marginBottom: '0.25rem',
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
      },
    },
  },
});

export class FormSection extends React.Component {
  componentDidMount() {
    const {
      formDefaultValues,
      onFormSubmit,
      formData,
      history,
      formSubmittedValues,
      onFetchFormData,
    } = this.props;
    if (history.action === 'PUSH' || formData.isSubmit === false) {
      onFetchFormData(formDefaultValues);
    } else {
      onFormSubmit(formSubmittedValues);
    }
  }

  makeFormAttr = pr => {
    const { formData, onGetProductAuto } = this.props;
    let autoCompleteTimer;
    return {
      org: {
        name: 'org',
        label: 'Đơn vị',
        value: pr.values.org,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      DateFromTo: {
        name: 'DateFromTo',
        label: 'Ngày hiệu lực từ ~ đến',
        component: PeriodPicker,
        from: {
          format: 'dd/MM/yyyy',
          name: 'DateFrom',
          value: pr.values.DateFrom,
        },
        to: {
          name: 'DateTo',
          format: 'dd/MM/yyyy',
          value: pr.values.DateTo,
        },
      },
      RegionProductionCode: {
        name: 'RegionProductionCode',
        label: 'Vùng Sản Xuất',
        value: pr.values.RegionProductionCode,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.RegionProductionCode.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      productCode: {
        name: 'productCode',
        label: 'Mã/Tên sản phẩm',
        value: pr.values.productCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Mã/Tên sản phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetProductAuto(inputValue, callback);
          }, 1000);
        },
      },
    };
  };

  render() {
    const { classes, formDefaultValues, formSubmittedValues } = this.props;

    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <Formik
            enableReinitialize
            initialValues={formSubmittedValues}
            validate={values => {
              const errors = {};
              if (
                values.DateTo !== '' &&
                startOfDay(values.DateFrom).getTime() >
                  startOfDay(values.DateTo).getTime()
              ) {
                errors.DateFromTo =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
              return errors;
            }}
            onSubmit={(values, formikActions) => {
              this.props.onFormSubmit({ ...values, pageIndex: 0 });
              formikActions.setSubmitting(false);
            }}
            onReset={(values, formikActions) => {
              formikActions.setValues({ ...formDefaultValues });
              this.props.onFormSubmit({ ...formDefaultValues });
            }}
            render={pr => {
              const formAttr = this.makeFormAttr(pr);
              return (
                <div className={classes.expansionContainer}>
                  <Expansion
                    title="I. Thông Tin Chung"
                    content={
                      <Form>
                        <Grid
                          container
                          spacing={40}
                          style={{ marginBottom: '-0.5rem' }}
                        >
                          <Grid item xl={5} lg={5} md={5} sm={5} xs={12}>
                            <Grid container>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.org} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.DateFromTo} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xl={2} lg={2} md={2} sm={2} xs={12} />
                          <Grid item xl={5} lg={5} md={5} sm={5} xs={12}>
                            <Grid container>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.RegionProductionCode} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.productCode} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <div
                          className={classes.btnContainer}
                          style={{ marginTop: '30px' }}
                        >
                          <Button
                            type="button"
                            variant="contained"
                            className={classes.resetBtn}
                            onClick={pr.handleReset}
                          >
                            Bỏ lọc
                          </Button>
                          <Button
                            className={classes.btn}
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Tìm kiếm
                          </Button>
                        </div>
                      </Form>
                    }
                  />
                </div>
              );
            }}
          />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}
FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  onFormSubmit: PropTypes.func,
  onFetchFormData: PropTypes.func,
  ui: PropTypes.object,
  onGetProductAuto: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onGetProductAuto: (inputText, callback) =>
      dispatch(actions.getProductAuto(inputText, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(FormSection);
