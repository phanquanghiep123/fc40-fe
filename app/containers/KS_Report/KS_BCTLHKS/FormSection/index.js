import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { withStyles, Grid, MenuItem } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { calcDateGap } from '../../../App/utils';
import Expansion from '../../../../components/Expansion';
import PeriodPicker from '../../../../components/PeriodPicker';
import MuiButton from '../../../../components/MuiButton';
import SelectControl from '../../../../components/SelectControl';
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
const styles = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& button:not(:last-child)': {
      marginRight: '1rem !important',
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

  clearFilter = pr => {
    const { formDefaultValues, onFetchReportData } = this.props;
    pr.handleReset();
    onFetchReportData(formDefaultValues);
  };

  /**
   * Make form field attributes
   * @param pr - formik props
   */
  makeFormAttr = pr => {
    const { formData } = this.props;
    return {
      plant: {
        name: 'plant',
        label: 'Đơn vị xuất hủy',
        component: SelectAutocomplete,
        value: pr.values.plant,
        options: formData.currentOrgs,
        placeholder: 'Tất Cả',
        isMulti: true,
        isMultiline: true,
      },
      assetsCode: {
        name: 'assetsCode',
        label: 'Mã tài sản',
        component: InputControl,
        value: pr.values.assetsCode,
        onChange: pr.handleChange,
      },
      reason: {
        name: 'reason',
        label: 'Lý do',
        component: SelectControl,
        value: pr.values.reason,
        onChange: pr.handleChange,
        children: formData.reasons.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      exportPeriod: {
        name: 'exportPeriod',
        label: 'Ngày xuất hủy',
        component: PeriodPicker,
        from: {
          name: 'exportDateFrom',
          value: pr.values.exportDateFrom,
        },
        to: {
          name: 'exportDateTo',
          value: pr.values.exportDateTo,
        },
      },
      palletBasket: {
        name: 'palletBasket',
        label: 'Mã khay sọt',
        component: SelectAutocomplete,
        value: pr.values.palletBasket,
        options: formData.palletBaskets,
        placeholder: 'Tìm và chọn Khay sọt',
      },
      approver: {
        name: 'approver',
        label: 'Người phê duyệt',
        component: SelectAutocomplete,
        value: pr.values.approver,
        options: formData.users,
        placeholder: 'Tìm và chọn người phê duyệt',
      },
      exporter: {
        name: 'exporter',
        label: 'Người xuất hủy',
        component: SelectAutocomplete,
        value: pr.values.exporter,
        options: formData.users,
        placeholder: 'Tìm và chọn người xuất hủy',
      },
      reasonCancellation: {
        name: 'reasonCancellation',
        label: 'Lý do hủy',
        component: SelectControl,
        value: pr.values.reasonCancellation,
        onChange: pr.handleChange,
        children: formData.reasonCancellations.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      receiptCode: {
        name: 'receiptCode',
        label: 'Mã PYCH',
        component: InputControl,
        value: pr.values.receiptCode,
        onChange: pr.handleChange,
      },
      receiptType: {
        name: 'receiptType',
        label: 'Loại xuất hủy',
        component: SelectControl,
        value: pr.values.receiptType,
        onChange: pr.handleChange,
        children: formData.receiptTypes.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
    };
  };

  render() {
    const { classes, formDefaultValues, onFetchReportData } = this.props;
    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={formDefaultValues}
          validate={values => {
            const { exportDateFrom, exportDateTo } = values;
            const errors = {};

            if (!exportDateFrom || !exportDateTo) {
              errors.exportPeriod = 'Trường bắt buộc';
            } else {
              const dateGap = calcDateGap(exportDateFrom, exportDateTo);

              if (dateGap < 0) {
                errors.exportPeriod =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
            }

            return errors;
          }}
          onSubmit={(values, formikActions) => {
            formikActions.setSubmitting(true);
            onFetchReportData(values);
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
                          <Field {...formAttr.plant} />
                          <Field {...formAttr.assetsCode} />
                          <Field {...formAttr.reason} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.exportPeriod} />
                          <Field {...formAttr.palletBasket} />
                          <Field {...formAttr.approver} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.exporter} />
                          <Field {...formAttr.reasonCancellation} />
                          <Field {...formAttr.receiptCode} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.receiptType} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={24}>
                        <Grid item xs={12} className={classes.btnContainer}>
                          <MuiButton
                            outline
                            onClick={() => this.clearFilter(pr)}
                            disabled={pr.isSubmitting}
                          >
                            Bỏ Lọc
                          </MuiButton>
                          <MuiButton
                            onClick={pr.handleSubmit}
                            disabled={pr.isSubmitting}
                          >
                            Tìm Kiếm
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
      </div>
    );
  }
}

FormSection.propTypes = {
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onFetchReportData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.defaultValues(),
  formSubmittedValues: selectors.submittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onFetchReportData: formValues =>
      dispatch(actions.fetchReportData(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
