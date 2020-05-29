import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { withStyles, Grid, MenuItem } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import SelectControl from '../../../../components/SelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import PeriodPicker from '../../../../components/PeriodPicker';
import MuiButton from '../../../../components/MuiButton';
import { calcDateGap } from '../../../App/utils';

const styles = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
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
   * @param pr - formik props
   */
  makeFormAttr = pr => {
    const { formData } = this.props;

    return {
      org: {
        name: 'org',
        label: 'Đơn vị',
        required: true,
        component: SelectControl,
        value: pr.values.org,
        onChange: pr.handleChange,
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      datePeriod: {
        name: 'datePeriod',
        label: 'Ngày báo cáo',
        required: true,
        component: PeriodPicker,
        datePickerProps: {
          clearable: false,
        },
        from: {
          name: 'dateFrom',
          value: pr.values.dateFrom,
        },
        to: {
          name: 'dateTo',
          value: pr.values.dateTo,
        },
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      onFetchTableData,
      onProceedReport,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={
          formIsSubmitted && formSubmittedValues
            ? formSubmittedValues
            : formDefaultValues
        }
        validate={values => {
          const { dateFrom, dateTo } = values;
          const errors = {};

          if (!dateFrom || !dateTo) {
            errors.datePeriod = 'Trường bắt buộc';
          } else {
            const dateGap = calcDateGap(dateFrom, dateTo);

            if (dateGap < 0) {
              errors.datePeriod =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }
          }

          return errors;
        }}
        onSubmit={(values, formikActions) => {
          formikActions.setSubmitting(true);

          if (values.btn === 'proceedReport') {
            onProceedReport({ ...values, pageIndex: 0 });
          } else {
            onFetchTableData({ ...values, pageIndex: 0 });
          }

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
                        <Field {...formAttr.org} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.datePeriod} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                      <Grid
                        item
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <MuiButton
                          outline
                          onClick={() => {
                            pr.setFieldValue('btn', 'viewHistory');
                            setTimeout(pr.handleSubmit, 100);
                          }}
                          style={{ marginRight: '1rem' }}
                          disabled={pr.isSubmitting}
                        >
                          Xem Lịch Sử
                        </MuiButton>
                        <MuiButton
                          onClick={() => {
                            pr.setFieldValue('btn', 'proceedReport');
                            setTimeout(pr.handleSubmit, 100);
                          }}
                          disabled={pr.isSubmitting}
                        >
                          Chạy Báo Cáo
                        </MuiButton>
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
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onProceedReport: PropTypes.func,
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
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
    onProceedReport: formValues => dispatch(actions.proceedReport(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
