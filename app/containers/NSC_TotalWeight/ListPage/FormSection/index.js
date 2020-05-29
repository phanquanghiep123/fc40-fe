import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { withStyles, Grid, MenuItem } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { Can } from 'authorize/ability-context';
import MuiButton from 'components/MuiButton';
import { withRouter } from 'react-router-dom';
import SelectControl from '../../../../components/SelectControl';
import InputControl from '../../../../components/InputControl';
import DatePickerControl from '../../../../components/DatePickerControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';

const styles = theme => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  btn: {
    width: 140,
  },
});

export class FormSection extends React.Component {
  componentDidMount() {
    const {
      onFetchOrgList,
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
      onFetchOrgList(formSubmittedValues, false);
    } else {
      onFetchOrgList(formDefaultValues);
    }
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const {
      formData,
      tableData,
      onFetchTableData,
      onUpdateFormData,
    } = this.props;

    return {
      org: {
        name: 'org',
        label: 'Bộ Phận',
        component: SelectControl,
        value: pr.values.org,
        onChange: event => {
          pr.handleChange(event);
          onFetchTableData({ ...pr.values, org: event.target.value });
          this.resetFilters(pr);
        },
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={JSON.stringify(item)}>
            {item.label}
          </MenuItem>
        )),
      },
      nguoiThucHien: {
        name: 'nguoiThucHien',
        label: 'Người Thực Hiện Cân',
        component: InputControl,
        value: pr.values.nguoiThucHien,
        onChange: pr.handleChange,
        disabled: true,
      },
      ngayThucHienCan: {
        name: 'ngayThucHienCan',
        label: 'Ngày Thực Hiện Cân',
        component: DatePickerControl,
        value: pr.values.ngayThucHienCan,
        onChangeDatePicker: selectedDate => {
          onFetchTableData({ ...pr.values, ngayThucHienCan: selectedDate });
          this.resetFilters(pr);
        },
      },
      maVach: {
        name: 'maVach',
        label: 'Mã Vạch',
        component: InputControl,
        value: pr.values.maVach,
        onChange: pr.handleChange,
        disabled: true,
      },
      farms: {
        name: 'farms',
        label: 'Farm/NCC',
        component: SelectControl,
        value: pr.values.farms,
        onChange: e => {
          pr.handleChange(e);

          // reset filter
          let filteredTable = [...tableData];
          filteredTable = filteredTable.map(item => ({
            ...item,
            isHidden: false,
          }));

          // filter by farm/ncc
          if (e.target.value) {
            filteredTable = filteredTable.map(item => {
              if (item.originCode === e.target.value) {
                return item;
              }
              return { ...item, isHidden: true };
            });
          }

          // update BTP options
          const btpOptions = [];
          if (e.target.value) {
            filteredTable.forEach(item => {
              if (item.isHidden) {
                return;
              }

              const isAdded =
                btpOptions.filter(
                  option => item.semiFinishedProductCode === option.value,
                ).length > 0;

              if (!isAdded) {
                btpOptions.push({
                  value: item.semiFinishedProductCode,
                  label: item.semiFinishedProductName,
                });
              }
            });
          }

          // dispatch change
          onUpdateFormData({
            ...formData,
            semiFinishedProducts: btpOptions,
          });

          // reset BTP and Batch BTP
          pr.setFieldValue('semiFinishedProducts', null);
          pr.setFieldValue('batchSemiFinishedProducts', '');
        },
        children: formData.farms.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      semiFinishedProducts: {
        name: 'semiFinishedProducts',
        label: 'BTP',
        component: SelectAutocomplete,
        options: formData.semiFinishedProducts,
        placeholder: 'Tìm và chọn BTP',
        value: pr.values.semiFinishedProducts,
        afterHandleChange: selected => {
          // reset filter
          let filteredTable = [...tableData];
          filteredTable = filteredTable.map(item => ({
            ...item,
            isHidden: false,
          }));

          // filter by farm/ncc
          filteredTable = filteredTable.map(item => {
            if (item.originCode === pr.values.farms) {
              return item;
            }
            return { ...item, isHidden: true };
          });

          // then filter by BTP
          if (selected && selected.value) {
            filteredTable = filteredTable.map(item => {
              if (item.semiFinishedProductCode === selected.value) {
                return item;
              }
              return { ...item, isHidden: true };
            });
          }

          // update Batch BTP options
          const batchBtpOptions = [];
          if (selected && selected.value) {
            filteredTable.forEach(item => {
              if (item.isHidden) {
                return;
              }

              const isAdded =
                batchBtpOptions.filter(
                  option => item.semiFinishedProductSlotCode === option.value,
                ).length > 0;

              if (!isAdded) {
                batchBtpOptions.push({
                  value: item.semiFinishedProductSlotCode,
                  label: item.semiFinishedProductSlotCode,
                });
              }
            });
          }

          // dispatch change
          onUpdateFormData({
            ...formData,
            batchSemiFinishedProducts: batchBtpOptions,
          });

          // reset Batch BTP
          pr.setFieldValue('batchSemiFinishedProducts', '');
        },
        children: formData.semiFinishedProducts.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
        disabled: !pr.values.farms,
      },
      batchSemiFinishedProducts: {
        name: 'batchSemiFinishedProducts',
        label: 'Batch BTP',
        component: SelectControl,
        value: pr.values.batchSemiFinishedProducts,
        onChange: pr.handleChange,
        children: formData.batchSemiFinishedProducts.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
        disabled: !pr.values.semiFinishedProducts,
      },
    };
  };

  /**
   * Reset Filters
   * @param pr
   */
  resetFilters = pr => {
    pr.setFieldValue('farms', '');
    pr.setFieldValue('semiFinishedProducts', null);
    pr.setFieldValue('batchSemiFinishedProducts', '');
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      tableData,
      onUpdateTableData,
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
          const errors = {};
          if (
            values.expectedArrivalDateTo !== '' &&
            values.expectedArrivalDateFrom > values.expectedArrivalDateTo
          ) {
            errors.expectedArrivalDateTo =
              'Phải lớn hơn hoặc bằng ngày bắt đầu';
          }
          return errors;
        }}
        onSubmit={(values, formikActions) => {
          const filters = {
            originCode: values.farms,
            semiFinishedProductCode: values.semiFinishedProducts
              ? values.semiFinishedProducts.value
              : null,
            semiFinishedProductSlotCode: values.batchSemiFinishedProducts,
          };

          // filter
          let filteredTable = [...tableData];
          filteredTable = filteredTable.map(item => ({
            ...item,
            isHidden: false,
          }));

          // eslint-disable-next-line no-restricted-syntax
          for (const filterKey of Object.keys(filters)) {
            if (filters[filterKey]) {
              filteredTable = filteredTable.map(item => {
                if (item[filterKey] === filters[filterKey]) {
                  return { ...item };
                }
                return { ...item, isHidden: true };
              });
            }
          }

          // dispatch change
          onUpdateTableData(filteredTable, values);
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
                        <Field {...formAttr.nguoiThucHien} />
                        <Can
                          do={CODE.suaTTCT}
                          on={SCREEN_CODE.DSCT}
                          passThrough
                        >
                          {can => (
                            <Field
                              {...formAttr.ngayThucHienCan}
                              disabled={!can}
                            />
                          )}
                        </Can>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.maVach} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid
                          container
                          spacing={32}
                          style={{ marginBottom: '1rem' }}
                        >
                          <Grid item xs={6}>
                            <Field {...formAttr.farms} />
                          </Grid>
                          <Grid item xs={6}>
                            <Field {...formAttr.semiFinishedProducts} />
                            <Field {...formAttr.batchSemiFinishedProducts} />
                          </Grid>
                        </Grid>
                        <Grid container spacing={24} justify="flex-end">
                          <Grid item>
                            <MuiButton
                              className={classes.btn}
                              onClick={() => {
                                this.resetFilters(pr);
                                const resetTableData = tableData.map(item => ({
                                  ...item,
                                  isHidden: false,
                                }));

                                // dispatch change
                                onUpdateTableData(resetTableData, {
                                  ...pr.values,
                                  // reset filters in form
                                  farms: '',
                                  semiFinishedProducts: null,
                                  batchSemiFinishedProducts: '',
                                });
                              }}
                              outline
                            >
                              Bỏ Lọc
                            </MuiButton>
                          </Grid>
                          <Grid item>
                            <MuiButton
                              className={classes.btn}
                              onClick={pr.handleSubmit}
                            >
                              Tìm kiếm
                            </MuiButton>
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
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  tableData: PropTypes.array,
  onFetchOrgList: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  onUpdateFormData: PropTypes.func,
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
    onFetchOrgList: (formValues, fetchNew = true) =>
      dispatch(actions.fetchOrgList(formValues, fetchNew)),
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
    onUpdateTableData: (tableData, formValues) =>
      dispatch(actions.updateTableData(tableData, formValues)),
    onUpdateFormData: formData => dispatch(actions.updateFormData(formData)),
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
