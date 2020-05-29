import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  MenuItem,
  Button,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import SelectControl from '../../../../components/SelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import PeriodPicker from '../../../../components/PeriodPicker';

const styles = theme => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& :not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  btn: {
    margin: 'unset',
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
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
   * Filter reasons by selected receiptType
   * @param receiptType
   * @return {[]}
   */
  filterReasons = receiptType => {
    const { formData } = this.props;

    let filteredReason = [];
    if (formData && formData.reason.length && formData.receiptType.length) {
      filteredReason = formData.reason.filter(item => {
        // 0 => option "Tất cả"
        if (receiptType === 0) return true;

        // other options
        const [selectedReceiptType] = formData.receiptType.filter(
          _ => _ && _.value === receiptType,
        );
        return (
          selectedReceiptType && item.receiptType === selectedReceiptType.value
        );
      });
    }

    if (
      filteredReason.length &&
      filteredReason.length < formData.reason.length
    ) {
      return [{ value: 0, label: 'Tất cả' }, ...filteredReason];
    }

    return filteredReason;
  };

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const {
      formData,
      // onFetchBasketAC,
      onFetchRequesterAC,
      onFetchExecutorAC,
      onFetchApproverAC,
    } = this.props;

    const filteredReasons = this.filterReasons(pr.values.receiptType);

    return {
      receiptCode: {
        name: 'receiptCode',
        label: 'Mã PYCH',
        component: InputControl,
        value: pr.values.receiptCode,
        onChange: pr.handleChange,
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        component: SelectControl,
        value: pr.values.status,
        onChange: pr.handleChange,
        children: formData.status.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      reason: {
        name: 'reason',
        label: 'Lý Do Huỷ',
        component: SelectControl,
        value: pr.values.reason,
        onChange: pr.handleChange,
        children: filteredReasons.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      receiptType: {
        name: 'receiptType',
        label: 'Loại Phiếu',
        value: pr.values.receiptType,
        component: SelectControl,
        onChange: e => {
          const selected = e.target.value;
          const [newDefaultReason] = this.filterReasons(selected);
          pr.setValues({
            ...pr.values,
            receiptType: selected,
            ...(newDefaultReason ? { reason: newDefaultReason.value } : {}),
          });
        },
        children: formData.receiptType.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      goodCode: {
        name: 'goodCode',
        label: 'Mã Hàng Hoá',
        component: InputControl,
        value: pr.values.goodCode,
        onChange: pr.handleChange,
      },
      org: {
        name: 'org',
        label: 'Đơn Vị',
        value: pr.values.org,
        component: SelectAutocomplete,
        options: formData.org,
        placeholder: 'Tất Cả',
      },
      // org: {
      //   name: 'org',
      //   label: 'Đơn Vị',
      //   component: SelectControl,
      //   value: pr.values.org,
      //   onChange: pr.handleChange,
      //   children: formData.org.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      // },
      requestDate: {
        name: 'requestDate',
        label: 'Ngày Tạo',
        component: PeriodPicker,
        from: {
          name: 'requestDateFrom',
          value: pr.values.requestDateFrom,
        },
        to: {
          name: 'requestDateTo',
          value: pr.values.requestDateTo,
        },
      },
      approveDate: {
        name: 'approveDate',
        label: 'Ngày Phê Duyệt',
        component: PeriodPicker,
        from: {
          name: 'approveDateFrom',
          value: pr.values.approveDateFrom,
        },
        to: {
          name: 'approveDateTo',
          value: pr.values.approveDateTo,
        },
      },
      executeDate: {
        name: 'executeDate',
        label: 'Ngày Xuất Huỷ',
        component: PeriodPicker,
        from: {
          name: 'executeDateFrom',
          value: pr.values.executeDateFrom,
        },
        to: {
          name: 'executeDateTo',
          value: pr.values.executeDateTo,
        },
      },
      requester: {
        name: 'requester',
        label: 'Người Tạo Phiếu',
        component: SelectAutocomplete,
        value: pr.values.requester,
        isAsync: true,
        // defaultOptions: true,
        cacheOptions: true,
        loadOptionsFunc: onFetchRequesterAC,
        placeholder: 'Tìm và chọn người tạo phiếu',
      },
      approver: {
        name: 'approver',
        label: 'Người Phê Duyệt',
        component: SelectAutocomplete,
        value: pr.values.approver,
        isAsync: true,
        cacheOptions: true,
        loadOptionsFunc: onFetchApproverAC,
        placeholder: 'Tìm và chọn người phê duyệt',
      },
      executor: {
        name: 'executor',
        label: 'Người Xuất Huỷ',
        component: SelectAutocomplete,
        value: pr.values.executor,
        isAsync: true,
        // defaultOptions: true,
        cacheOptions: true,
        loadOptionsFunc: onFetchExecutorAC,
        placeholder: 'Tìm và chọn người xuất huỷ',
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      onFormSubmit,
      formIsSubmitted,
      formSubmittedValues,
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
          onSubmit={(values, formikActions) => {
            onFormSubmit(values);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            onFormSubmit({ ...formDefaultValues });
          }}
          validate={values => {
            const error = {};
            const dateRangeError = 'Ngày đầu phải bé hơn hoặc bằng ngày cuối';

            if (
              values.requestDateFrom &&
              values.requestDateTo &&
              new Date(values.requestDateFrom.toDateString()) >
                new Date(values.requestDateTo.toDateString())
            ) {
              error.requestDate = dateRangeError;
            }

            if (
              values.approveDateFrom &&
              values.approveDateTo &&
              new Date(values.approveDateFrom.toDateString()) >
                new Date(values.approveDateTo.toDateString())
            ) {
              error.approveDate = dateRangeError;
            }

            if (
              values.executeDateFrom &&
              values.executeDateTo &&
              new Date(values.executeDateFrom.toDateString()) >
                new Date(values.executeDateTo.toDateString())
            ) {
              error.executeDate = dateRangeError;
            }

            return error;
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
                          <Field {...formAttr.receiptCode} />
                          <Field {...formAttr.org} />
                          <Field {...formAttr.status} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.receiptType} />
                          <Field {...formAttr.reason} />
                          <Field {...formAttr.goodCode} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid
                            container
                            spacing={32}
                            style={{ marginBottom: '1rem' }}
                          >
                            <Grid item xs={6}>
                              <Field {...formAttr.requestDate} />
                              <Field {...formAttr.approveDate} />
                              <Field {...formAttr.executeDate} />
                            </Grid>
                            <Grid item xs={6}>
                              <Field {...formAttr.requester} />
                              <Field {...formAttr.approver} />
                              <Field {...formAttr.executor} />
                            </Grid>
                          </Grid>
                          <Grid container spacing={40}>
                            <Grid item xs={12}>
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
                                  className={classes.btn}
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  onClick={pr.handleSubmit}
                                >
                                  Tìm kiếm
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
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
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  tableData: PropTypes.array,
  onFormSubmit: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  onFetchFormData: PropTypes.func,
  // onUpdateFormData: PropTypes.func,
  // onFetchBasketAC: PropTypes.func,
  onFetchRequesterAC: PropTypes.func,
  onFetchExecutorAC: PropTypes.func,
  onFetchApproverAC: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
  tableData: selectors.tableData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    // onFetchBasketAC: (inputText, callback) =>
    //   dispatch(actions.fetchBasketAC(inputText, callback)),
    onFetchRequesterAC: (inputText, callback) =>
      dispatch(actions.fetchRequesterAC(inputText, callback)),
    onFetchExecutorAC: (inputText, callback) =>
      dispatch(actions.fetchExecutorAC(inputText, callback)),
    onFetchApproverAC: (inputText, callback) =>
      dispatch(actions.fetchApproverAC(inputText, callback)),
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
