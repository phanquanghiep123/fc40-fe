import CheckboxControl from 'components/CheckboxControl';
import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import SelectAutocomplete from 'components/SelectAutocomplete';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid, MenuItem, Paper } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import DatePickerControl from '../../../../components/PickersControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 2}px`,
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

export class FormSection extends Component {
  componentDidMount() {
    const {
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      onFetchFormData,
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
    const { formData, onFetchDeliveryOrg } = this.props;
    let autoCompleteTimer;

    return {
      unitCode: {
        name: 'unitCode',
        label: 'Đơn Vị',
        component: SelectControl,
        value: pr.values.unitCode,
        onChange: pr.handleChange,
        children: formData.unitCode.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
        autoFocus: true,
      },
      unitCodes: {
        name: 'unitCodes',
        value: pr.values.unitCodes,
        onChange: pr.handleChange,
        component: InputControl,
        style: {
          display: 'none',
        },
        disabled: true,
      },
      processingDate: {
        name: 'processingDate',
        label: 'Ngày Sơ Chế',
        value: pr.values.processingDate,
        component: DatePickerControl,
        autoOk: true,
      },
      isPurchaseStopping: {
        name: 'isPurchaseStopping',
        label: 'Dừng Thu Mua',
        value: pr.values.isPurchaseStopping,
        component: CheckboxControl,
        labelPlacement: 'end',
      },
      supplier: {
        name: 'supplier',
        label: 'Nhà Cung Cấp',
        value: pr.values.supplier,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn NCC',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchDeliveryOrg(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      isWarning: {
        name: 'isWarning',
        label: 'Sản Phẩm Có Cảnh Báo',
        value: pr.values.isWarning,
        component: CheckboxControl,
        labelPlacement: 'end',
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formSubmittedValues,
      formIsSubmitted,
      onFormSubmit,
    } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.paper} elevation={1}>
          <Formik
            enableReinitialize
            initialValues={
              formIsSubmitted && formSubmittedValues
                ? formSubmittedValues
                : formDefaultValues
            }
            onSubmit={(values, formikActions) => {
              onFormSubmit(values);
              formikActions.setSubmitting(false);
            }}
            onReset={(values, formikActions) => {
              formikActions.setValues({ ...formDefaultValues });
              onFormSubmit({ ...formDefaultValues });
            }}
            render={pr => {
              const formAttr = this.makeFormAttr(pr);
              return (
                <Form>
                  <Grid
                    container
                    spacing={40}
                    style={{ marginBottom: '-0.5rem' }}
                  >
                    <Grid item xs={3}>
                      <Field {...formAttr.unitCode} />
                      <Field {...formAttr.unitCodes} />
                    </Grid>
                    <Grid item xs={3}>
                      <Field {...formAttr.processingDate} />
                    </Grid>
                    <Grid item xs={3}>
                      <Grid container spacing={8}>
                        <Grid item lg={12} md={12} xs={12} sm={12}>
                          <Field {...formAttr.isPurchaseStopping} />
                        </Grid>
                        <Grid item lg={12} md={12} xs={12} sm={12}>
                          <Field {...formAttr.isWarning} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Field {...formAttr.supplier} />
                    </Grid>
                  </Grid>

                  <div className={classes.btnContainer}>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={pr.handleReset}
                      className={classes.resetBtn}
                    >
                      Bỏ lọc
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </Form>
              );
            }}
          />
        </Paper>
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
  onFormSubmit: PropTypes.func,
  onFetchFormData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onFetchDeliveryOrg: (inputValue, callback) =>
      dispatch(actions.fetchDeliveryOrg(inputValue, callback)),
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
