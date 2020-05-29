import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  createMuiTheme,
  Grid,
  MenuItem,
  Paper,
  withStyles,
  MuiThemeProvider,
  Typography,
  Button,
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import CheckboxControl from 'components/CheckboxControl';
import * as selectors from '../selectors';
import * as actions from '../actions';
import SelectControl from '../../../components/SelectControl';
import InputControl from '../../../components/InputControl';
import appTheme from '../../App/theme';
const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
    height: '100%',
  },
  btnContainer: {
    textAlign: 'right',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
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
    MuiButton: {
      root: {
        minWidth: 120,
      },
    },
    MuiFormControlLabel: {
      root: {
        flexBasis: '50%',
        flexGrow: 1,
        marginRight: 0,
      },
    },
  },
});

class FormSection extends Component {
  componentDidMount() {
    this.props.onFetchOrgList();
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { formData, onFetchTableData } = this.props;

    return {
      org: {
        name: 'org',
        label: 'Bộ phận',
        component: SelectControl,
        value: pr.values.org,
        onChange: event => {
          pr.handleChange(event);

          // auto submit on change
          const formValues = {
            org: event.target.value,
            unConfirmAndNotPv: true,
            unConfirmAndHasPv: true,
            confirmed: true,
          };

          // reset checkbox
          pr.setFieldValue('unConfirmAndNotPv', true);
          pr.setFieldValue('unConfirmAndHasPv', true);
          pr.setFieldValue('confirmed', true);

          onFetchTableData(formValues);
        },
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      weighingEmployee: {
        name: 'weighingEmployee',
        label: 'Người Thực Hiện',
        placeholder: ' ',
        component: InputControl,
        value: pr.values.weighingEmployee,
        onChange: pr.handleChange,
        disabled: true,
      },
      unConfirmAndHasPv: {
        name: 'unConfirmAndHasPv',
        label: 'Chờ xác nhận',
        component: CheckboxControl,
        labelPlacement: 'end',
      },
      unConfirmAndNotPv: {
        name: 'unConfirmAndNotPv',
        label: 'Kiểm tra PV',
        component: CheckboxControl,
        labelPlacement: 'end',
      },
      confirmed: {
        name: 'confirmed',
        label: 'Đã xác nhận',
        component: CheckboxControl,
        labelPlacement: 'end',
      },
    };
  };

  render() {
    const { classes, formDefaultValues, onFetchTableData } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Formik
          enableReinitialize
          initialValues={formDefaultValues}
          onSubmit={(values, formikActions) => {
            onFetchTableData(values);
            formikActions.setSubmitting(false);
          }}
          render={pr => {
            const formAttr = this.makeFormAttr(pr);
            return (
              <Form>
                <Grid
                  container
                  spacing={32}
                  style={{ marginTop: 0, marginBottom: '1rem' }}
                >
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={32}>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            I. Thông Tin Chung
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Field {...formAttr.org} />
                        </Grid>
                        <Grid item xs={6}>
                          <Field {...formAttr.weighingEmployee} />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={32}>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            II. Dữ Liệu Hiển Thị
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={24}>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Field {...formAttr.unConfirmAndNotPv} />
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Field {...formAttr.unConfirmAndHasPv} />
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={6}>
                              <Field {...formAttr.confirmed} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <div className={classes.btnContainer}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              Tìm kiếm
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        />
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFetchOrgList: PropTypes.func,
  onFetchTableData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onFetchOrgList: () => dispatch(actions.fetchOrgList()),
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(style()),
)(FormSection);
