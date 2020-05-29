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
import { calcDateGap } from '../../../App/utils';
import * as selectors from '../selectors';
import * as actions from '../actions';
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
      status: {
        name: 'status',
        label: 'Trạng thái',
        component: SelectControl,
        value: pr.values.status,
        onChange: pr.handleChange,
        children: formData.status.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      warnings: {
        name: 'warnings',
        label: 'Phân loại cảnh báo',
        component: SelectControl,
        value: pr.values.warnings,
        onChange: pr.handleChange,
        children: formData.warnings.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      documentCode: {
        name: 'documentCode',
        label: 'Mã phiếu xuất/nhập kho',
        component: InputControl,
        value: pr.values.documentCode,
        onChange: pr.handleChange,
      },
      deliveryOrderCode: {
        name: 'deliveryOrderCode',
        label: 'Mã BBGH',
        component: InputControl,
        value: pr.values.deliveryOrderCode,
        onChange: pr.handleChange,
      },
      exportPeriod: {
        name: 'exportPeriod',
        label: 'Ngày Xuất Hàng',
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
      receivedPeriod: {
        name: 'receivedPeriod',
        label: 'Ngày Nhận Hàng',
        component: PeriodPicker,
        from: {
          name: 'receivedDateFrom',
          value: pr.values.receivedDateFrom,
        },
        to: {
          name: 'receivedDateTo',
          value: pr.values.receivedDateTo,
        },
      },
      palletBasket: {
        name: 'palletBasket',
        label: 'Mã/Tên khay sọt',
        component: SelectAutocomplete,
        value: pr.values.palletBasket,
        options: formData.palletBaskets,
        placeholder: 'Tìm và chọn Khay sọt',
      },
      org: {
        name: 'org',
        label: 'Đơn Vị',
        component: SelectAutocomplete,
        value: pr.values.org,
        placeholder: 'Tất Cả',
        options: formData.currentOrgs,
      },
      roles: {
        name: 'roles',
        label: 'Vai trò',
        component: SelectControl,
        value: pr.values.roles,
        onChange: e => {
          pr.handleChange(e);
          if (e.target.value === 2) {
            pr.setFieldValue('orgReceived', null);
          } else if (e.target.value === 1) {
            pr.setFieldValue('orgDeliver', null);
          }
        },
        children: formData.roles.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      orgReceived: {
        name: 'orgReceived',
        label: 'Đơn Vị Nhận',
        component: SelectAutocomplete,
        value: pr.values.orgReceived,
        placeholder: 'Tìm và chọn Đơn vị Nhận',
        options: formData.orgs,
        disabled: pr.values.org !== null && pr.values.roles === 2,
      },
      orgDeliver: {
        name: 'orgDeliver',
        label: 'Đơn Vị Giao',
        component: SelectAutocomplete,
        value: pr.values.orgDeliver,
        options: formData.orgs,
        placeholder: 'Tìm và chọn Đơn vị Giao',
        disabled: pr.values.org !== null && pr.values.roles === 1,
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
            const {
              exportDateFrom,
              exportDateTo,
              receivedDateFrom,
              receivedDateTo,
            } = values;
            const errors = {};

            if (exportDateFrom && exportDateTo) {
              const dateGap = calcDateGap(exportDateFrom, exportDateTo);
              if (dateGap < 0) {
                errors.exportPeriod =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
            }

            if (receivedDateFrom && receivedDateTo) {
              const dateGap = calcDateGap(receivedDateFrom, receivedDateTo);

              if (dateGap < 0) {
                errors.receivedPeriod =
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
                          <Field {...formAttr.status} />
                          <Field {...formAttr.warnings} />
                          <Field {...formAttr.deliveryOrderCode} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.exportPeriod} />
                          <Field {...formAttr.receivedPeriod} />
                          <Field {...formAttr.documentCode} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.org} />
                          <Field {...formAttr.roles} />
                          <Field {...formAttr.palletBasket} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Field {...formAttr.orgReceived} />
                          <Field {...formAttr.orgDeliver} />
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
  formIsSubmitted: PropTypes.bool,
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
