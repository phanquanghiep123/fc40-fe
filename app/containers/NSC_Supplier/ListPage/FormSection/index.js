import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik/dist/index';
import {
  Paper,
  MenuItem,
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Button,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import appTheme from '../../../App/theme';
import * as makeSelect from '../selectors';
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
    padding: '0',
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
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
        maxWidth: 'unset',
      },
    },
  },
});

class FormSection extends Component {
  componentDidMount() {
    const {
      formDefaultValues,
      submittedValues,
      onFetchFormData,
      history,
    } = this.props;
    if (history.action === 'POP') {
      onFetchFormData(submittedValues);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  render() {
    const {
      classes,
      formData,
      formDefaultValues,
      onSubmitForm,
      submittedValues,
    } = this.props;

    const formAttr = pr => ({
      supplierCode: {
        name: 'supplierCode',
        label: 'Mã NCC',
        value: pr.values.supplierCode,
        onChange: pr.handleChange,
        component: InputControl,
      },
      supplierName: {
        name: 'supplierName',
        label: 'Tên NCC',
        value: pr.values.name1,
        onChange: pr.handleChange,
        component: InputControl,
      },
      supplierType: {
        name: 'supplierType',
        label: 'Loại NCC',
        value: pr.values.supplierType,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.supplierType.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      email: {
        name: 'email',
        label: 'Email',
        value: pr.values.email,
        onChange: pr.handleChange,
        component: InputControl,
      },
      contractCode: {
        name: 'contractCode',
        label: 'Mã HĐ',
        value: pr.values.contractCode,
        onChange: pr.handleChange,
        component: InputControl,
      },
      contractType: {
        name: 'contractType',
        label: 'Loại HĐ',
        value: pr.values.contractType,
        onChange: pr.handleChange,
        component: InputControl,
      },
      regionCode: {
        name: 'regionCode',
        label: 'Vùng/Miền',
        value: pr.values.regionCode,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.regionCode.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      source: {
        name: 'source',
        label: 'Nguồn nhập',
        value: pr.values.source,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.source.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      block: {
        name: 'Block',
        label: 'Block',
        value: pr.values.postingBlock,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.postingBlock.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
    });

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <Formik
            enableReinitialize
            initialValues={{ ...submittedValues }}
            onSubmit={(values, formikActions) => {
              onSubmitForm(values);
              formikActions.setSubmitting(false);
            }}
            onReset={(values, formikActions) => {
              formikActions.setValues({ ...formDefaultValues });
              onSubmitForm({ ...formDefaultValues });
            }}
            render={pr => (
              <Form>
                <Grid
                  container
                  spacing={40}
                  style={{ marginBottom: '-0.5rem' }}
                >
                  <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).supplierCode} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).supplierName} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).supplierType} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).email} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).contractCode} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).contractType} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).regionCode} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).source} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr(pr).block} />
                      </Grid>
                    </Grid>
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
            )}
          />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  submittedValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onSubmitForm: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  submittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(style()),
  withImmutablePropsToJs,
)(FormSection);
