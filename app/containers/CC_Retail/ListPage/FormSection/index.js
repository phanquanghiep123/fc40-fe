import React, { Component } from 'react';
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

import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import SelectControl from 'components/SelectControl';
import SelectAutocomplete from 'components/SelectAutocomplete';

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

export class FormSection extends Component {
  componentDidMount() {
    const {
      formDefaultValues,
      formSubmittedValues,
      onFetchFormData,
      pagingInit,
      formData,
      history,
    } = this.props;
    if (history.action === 'PUSH' || formData.isSubmit === false) {
      onFetchFormData(formDefaultValues);
    } else {
      pagingInit(formSubmittedValues);
    }
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { formData } = this.props;
    return {
      retailCode: {
        name: 'retailCode',
        label: 'Mã PYCBX',
        value: pr.values.retailCode,
        onChange: pr.handleChange,
        component: InputControl,
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        value: pr.values.status,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.status.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      deliveryCode: {
        name: 'deliveryCode',
        label: 'Đơn vị',
        value: pr.values.deliveryCode,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.deliveryCode.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      ApproverLevel: {
        name: 'ApproverLevel',
        label: 'Người phê duyệt',
        value: pr.values.ApproverLevel,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người phê duyệt',
        disabled: pr.values.orgRole === 1,
        options: formData.Approver,
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formSubmittedValues,
      onSubmitForm,
    } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Formik
          enableReinitialize
          initialValues={formSubmittedValues}
          validate={values => {
            const errors = {};
            if (
              values.importedDateTo !== '' &&
              startOfDay(values.importedDateFrom).getTime() >
                startOfDay(values.importedDateTo).getTime()
            ) {
              errors.dateComponent =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onSubmitForm({ ...values, pageIndex: 0 });
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            onSubmitForm({ ...formDefaultValues });
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
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.retailCode} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.status} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={2} lg={2} md={2} sm={12} xs={12} />
                        <Grid item xl={5} lg={5} md={5} sm={5} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.deliveryCode} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.ApproverLevel} />
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
                          onClick={pr.handleReset}
                          className={classes.resetBtn}
                          style={{ marginLeft: '16px' }}
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
  onFormSubmit: PropTypes.func,
  onFetchFormData: PropTypes.func,
  onFetchDeliveryOrg: PropTypes.func,
  onFetchApprove: PropTypes.func,
  onExportExcel: PropTypes.func,
  OnExportPdf: PropTypes.func,
  pagingInit: PropTypes.func,
  history: PropTypes.object,
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
    onFetchDeliveryOrg: (inputValue, callback) =>
      dispatch(actions.fetchDeliveryOrg(inputValue, callback)),
    onFetchApprove: (inputValue, callback) =>
      dispatch(actions.fetchApprove(inputValue, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    pagingInit: formValues => dispatch(actions.pagingInit(formValues)),
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
