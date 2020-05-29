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
  Paper,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import DatePickerControl from '../../../../components/DatePickerControl';

const styles = theme => ({
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
  });

// eslint-disable-next-line react/prefer-stateless-function
export class FormSection extends React.Component {
  componentDidMount() {
    this.props.onFetchFileList(this.props.formDefaultValues);
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { onFetchFileList } = this.props;

    return {
      processingDate: {
        name: 'processingDate',
        label: 'Ngày Xử Lý',
        component: DatePickerControl,
        value: pr.values.processingDate,
        onChangeDatePicker: date =>
          onFetchFileList({ ...pr.values, processingDate: date }),
      },
    };
  };

  render() {
    const { classes, formDefaultValues } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={formDefaultValues}
          onSubmit={(values, formikActions) => {
            formikActions.setSubmitting(false);
          }}
          render={pr => {
            const formAttr = this.makeFormAttr(pr);
            return (
              <Form>
                <Grid container spacing={24} style={{ marginBottom: '1rem' }}>
                  <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={32}>
                        <Grid item xs={12}>
                          <Field {...formAttr.processingDate} />
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
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFetchFileList: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFileList: formValues => dispatch(actions.fetchFileList(formValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
