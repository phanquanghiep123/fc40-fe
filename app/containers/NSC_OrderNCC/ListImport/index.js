import React from 'react';
import PropTypes from 'prop-types';

import startOfDay from 'date-fns/startOfDay';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import saga from './saga';
import reducer from './reducer';
import { makeSelectFormSearch } from './selectors';

import Section1 from './Section1';
import Section2 from './Section2';

import ImportFile from './ImportFile';

import StateProvider from './Provider';

import { FormSearchSchema } from './Schema';

import styles from './styles';

export class NCCListImportPage extends React.Component {
  providerRef = null;

  onFormReset = () => {
    const defaultValues = FormSearchSchema.cast();
    this.providerRef.onGetImportFiles(defaultValues);
  };

  onFormSubmit = values => {
    const nextValues = {
      ...values,
      pageIndex: 0,
    };
    this.providerRef.onGetImportFiles(nextValues);
  };

  onUploadFileSuccess = () => {
    this.providerRef.onGetImportFiles();
  };

  render() {
    const { classes, ui, initialSchema } = this.props;

    return (
      <FormWrapper
        FormikProps={{
          validate: values => {
            const errors = {};

            if (
              values.dateTo !== '' &&
              startOfDay(values.dateFrom).getTime() >
                startOfDay(values.dateTo).getTime()
            ) {
              errors.date = 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }

            return errors;
          },
        }}
        initialValues={initialSchema}
        enableReinitialize
        onReset={this.onFormReset}
        onSubmit={this.onFormSubmit}
        render={formik => (
          <StateProvider
            onRef={ref => {
              this.providerRef = ref;
            }}
            formik={{
              ...formik,
              ...formikPropsHelpers(formik),
            }}
          >
            <section className={classes.main}>
              <section className={classes.heading}>
                <Typography variant="h5" className={classes.titleText}>
                  Danh Sách File Import Đặt Hàng NCC
                </Typography>
              </section>
              <section className={classes.content}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Section1
                      formik={{
                        ...formik,
                        ...formikPropsHelpers(formik),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Section2
                      formik={{
                        ...formik,
                        ...formikPropsHelpers(formik),
                      }}
                    />
                  </Grid>
                </Grid>
              </section>
            </section>
            <ImportFile
              ui={ui}
              onUploadFileSuccess={this.onUploadFileSuccess}
            />
          </StateProvider>
        )}
      />
    );
  }
}

NCCListImportPage.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
};

NCCListImportPage.defaultProps = {
  initialSchema: {},
};

const withSaga = injectSaga({ key: 'listImportNCC', saga });
const withReducer = injectReducer({ key: 'listImportNCC', reducer });

export const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectFormSearch(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withStyles(styles),
  withSaga,
  withReducer,
  withConnect,
  withImmutablePropsToJS,
)(NCCListImportPage);
