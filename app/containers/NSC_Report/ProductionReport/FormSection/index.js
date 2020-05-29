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
import MultipleSelectControl from '../../../../components/MultipleSelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import MuiButton from '../../../../components/MuiButton';
import DatePickerControl from '../../../../components/DatePickerControl';
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

const currentDate = new Date();

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
    const {
      formData,
      onFetchUOMAutocomplete,
      onFetchFarmNCCAutocomplete,
    } = this.props;
    let autoCompleteTimer;

    return {
      org: {
        name: 'org',
        label: 'Đơn Vị',
        component: SelectControl,
        value: pr.values.org,
        onChange: pr.handleChange,
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      productionDate: {
        name: 'productionDate',
        label: 'Ngày Sản Xuất',
        component: DatePickerControl,
        value: pr.values.productionDate,
        maxDate: currentDate,
        clearable: false,
      },
      uom: {
        name: 'uom',
        label: 'Đơn Vị Tính',
        component: SelectAutocomplete,
        value: pr.values.uom,
        onChange: pr.handleChange,
        isAsync: true,
        placeholder: 'Tìm và chọn đơn vị tính',
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchUOMAutocomplete(inputValue, callback);
          }, 1000);
        },
      },
      productionRegion: {
        name: 'productionRegion',
        label: 'Vùng Sản Xuất',
        component: SelectControl,
        value: pr.values.productionRegion,
        onChange: pr.handleChange,
        children: formData.productionRegion.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      farmNCC: {
        name: 'farmNCC',
        label: 'Farm/NCC',
        component: SelectAutocomplete,
        value: pr.values.farmNCC,
        isAsync: true,
        isMulti: true,
        isMultiline: true,
        placeholder: 'Tìm và chọn Farm/NCC',
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchFarmNCCAutocomplete(inputValue, callback);
          }, 1000);
        },
      },
      productCat: {
        name: 'productCat',
        label: 'Chủng Loại',
        component: MultipleSelectControl,
        value: pr.values.productCat,
        options: formData.productCat,
      },
      productSource: {
        name: 'productSource',
        label: 'Nguồn',
        component: SelectControl,
        value: pr.values.productSource,
        onChange: pr.handleChange,
        children: formData.productSource.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      productCodeName: {
        name: 'productCodeName',
        label: 'Mã/Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productCodeName,
        onChange: pr.handleChange,
      },
      batch: {
        name: 'batch',
        label: 'Batch',
        component: InputControl,
        value: pr.values.batch,
        onChange: pr.handleChange,
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      onFetchTableData,
      formIsSubmitted,
      formSubmittedValues,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={
          formIsSubmitted && formSubmittedValues
            ? formSubmittedValues
            : formDefaultValues
        }
        onSubmit={(values, formikActions) => {
          formikActions.setSubmitting(true);
          onFetchTableData({ ...values, pageIndex: 0 });
          formikActions.setSubmitting(false);
        }}
        onReset={(values, formikActions) => {
          formikActions.setSubmitting(true);
          onFetchTableData({ ...formDefaultValues, pageIndex: 0 });
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
                        <Field {...formAttr.productionDate} />
                        <Field {...formAttr.uom} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.productionRegion} />
                        <Field {...formAttr.farmNCC} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.productCat} />
                        <Field {...formAttr.productSource} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Field {...formAttr.productCodeName} />
                        <Field {...formAttr.batch} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                      <Grid item xs={12} className={classes.btnContainer}>
                        <MuiButton
                          outline
                          onClick={pr.handleReset}
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
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onFetchUOMAutocomplete: PropTypes.func,
  onFetchFarmNCCAutocomplete: PropTypes.func,
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
    onFetchUOMAutocomplete: (inputText, callback) =>
      dispatch(actions.fetchUOMAutocomplete(inputText, callback)),
    onFetchFarmNCCAutocomplete: (inputText, callback) =>
      dispatch(actions.fetchFarmNCCAutocomplete(inputText, callback)),
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
