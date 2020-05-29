import React from 'react';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Expansion from 'components/Expansion';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid } from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import moment from 'moment';

import withImmutablePropsToJs from 'with-immutable-props-to-js';
import PeriodPicker from 'components/PeriodPicker';
import { buildRequestId } from 'utils/notificationUtils';

import InputControl from 'components/InputControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { Can } from '../../../../authorize/ability-context';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';

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
  requestId = buildRequestId();

  componentDidMount() {
    const {
      formDefaultValues,
      onFormSubmit,
      history,
      formSubmittedValues,
      onFetchFormData,
    } = this.props;
    if (history.action === 'PUSH' || formSubmittedValues.isSubmit === false) {
      onFetchFormData(formDefaultValues);
    } else {
      onFormSubmit(formSubmittedValues);
    }
    window.signalR.on('MessageNotification', this.signalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.signalRProcessing);
  }

  onDataSynchronization = formik => {
    const { values } = formik;
    const data = {
      from: values.dateFrom,
      to: values.dateTo,
      requestId: this.requestId,
    };
    this.props.onDataSynchronization(data);
  };

  signalRProcessing = res => {
    const { onsignalRProcessing } = this.props;
    const {
      meta: { requestId },
    } = res;
    if (this.requestId === requestId) {
      onsignalRProcessing(res);
    }
  };

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => ({
    DateFromTo: {
      name: 'DateFromTo',
      label: 'Ngày sản xuất(từ - đến) (*)',
      component: PeriodPicker,
      datePickerProps: {
        clearable: false,
        showTodayButton: false,
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
    ConfigShowDate: {
      label: 'ConfigShowDate',
      name: 'ConfigShowDate',
      component: InputControl,
      value: pr.values.ConfigShowDate,
      onChange: pr.handleChange,
    },
  });

  renderGridField(item, cols = { xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }) {
    return (
      <Grid item {...cols}>
        <Field {...item} />
      </Grid>
    );
  }

  runSuccess = () => {
    const { history } = this.props;
    setTimeout(() => {
      history.push('/danh-sach-ghi-nhan-slbtp-thuc-te?isrun=true');
    }, 5000);
  };

  render() {
    const { classes, formSubmittedValues, onFormRun } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Formik
          enableReinitialize
          initialValues={formSubmittedValues}
          validate={values => {
            const errors = {};
            const { dateFrom, dateTo } = values;
            if (!dateFrom || !dateTo)
              errors.DateFromTo =
                'Ngày bắt đầu và ngày kết thúc không được trống';
            else if (
              values.DateTo !== '' &&
              startOfDay(values.dateFrom).getTime() >
                startOfDay(values.dateTo).getTime()
            ) {
              errors.DateFromTo =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }

            const MdateFrom = moment([
              dateFrom.getFullYear(),
              dateFrom.getMonth(),
              dateFrom.getDate(),
            ]);
            const MdateTo = moment([
              dateTo.getFullYear(),
              dateTo.getMonth(),
              dateTo.getDate(),
            ]);
            const numberShowColumnDate = MdateTo.diff(MdateFrom, 'days');
            if (numberShowColumnDate > values.ConfigShowDate) {
              errors.DateFromTo = `Tổng số ngày sản xuất từ và ngày sản xuất đến không được lớn hơn ${
                values.ConfigShowDate
              } ngày`;
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onFormRun({ ...values }, this.runSuccess);
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
                      <Grid
                        container
                        spacing={40}
                        style={{ marginBottom: '-0.5rem', marginTop: '20px' }}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                          <Grid container spacing={32}>
                            {this.renderGridField(formAttr.DateFromTo, {
                              xl: 12,
                              lg: 12,
                              md: 12,
                              sm: 12,
                              xs: 12,
                            })}
                          </Grid>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={false} />
                        <Grid item xl={4} lg={4} md={4} sm={4} xs={false} />
                      </Grid>
                      <Can
                        do={CODE.chayBCSLBTP}
                        on={SCREEN_CODE.DSLSSLBTP}
                        passThrough
                      >
                        {can => (
                          <div className={classes.btnContainer}>
                            <Button
                              type="button"
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                              disabled={formSubmittedValues.isRuning || !can}
                              onClick={() => {
                                if (isEmpty(pr.errors))
                                  this.onDataSynchronization(pr);
                              }}
                            >
                              Chạy cưỡng chế
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              style={{ marginLeft: '16px' }}
                              className={classes.submit}
                              disabled={formSubmittedValues.isRuning || !can}
                            >
                              Run
                            </Button>
                          </div>
                        )}
                      </Can>
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
  ui: PropTypes.object,
  onsignalRProcessing: PropTypes.func,
  onDataSynchronization: PropTypes.func,
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
    onFormRun: (formValues, callback) =>
      dispatch(actions.submitRunForm(formValues, callback)),
    onDataSynchronization: values =>
      dispatch(actions.dataSynchronization(values)),
    onsignalRProcessing: res => dispatch(actions.signalRProcessing(res)),
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
