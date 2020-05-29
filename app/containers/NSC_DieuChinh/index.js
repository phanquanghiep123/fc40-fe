import React from 'react';
import PropTypes from 'prop-types';

import { startOfDay } from 'date-fns';

import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { Formik } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { formikPropsHelpers } from 'components/FormikUI/utils';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import saga from './saga';
import reducer from './reducer';

import Popup from './Popup';

import Section1 from './Section1';
import Section2 from './Section2';

import StateProvider from './Provider';

import { FormTimKiemSchema } from './Schema';

import styles from './styles';
import { makeSelectData } from './selectors';

export class NSCDieuChinhPage extends React.Component {
  isSearch = true;

  providerRef = null;

  onFormReset = () => {
    const defaultValues = FormTimKiemSchema.cast();
    this.providerRef.onGetReceipts(defaultValues);
  };

  onFormSubmit = (values, formik) => {
    const nextValues = {
      ...values,
      pageIndex: 0,
    };

    this.providerRef.onGetReceipts(nextValues);

    if (!this.isSearch) {
      this.providerRef.onExportReceipts(nextValues);
    }

    formik.setSubmitting(false);
  };

  onSearchChange = isSearch => {
    this.isSearch = isSearch;
  };

  render() {
    const { classes, ui, initialSchema, orgCodes } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={{ ...initialSchema, orgCodes }}
        validate={values => {
          const errors = {};

          if (
            values.dateTo !== '' &&
            startOfDay(values.dateFrom).getTime() >
              startOfDay(values.dateTo).getTime()
          ) {
            errors.date = 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
          }

          return errors;
        }}
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
                  Danh Sách Dữ Liệu Điều Chỉnh
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
                      onSearchChange={this.onSearchChange}
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
            <Popup ui={ui} />
          </StateProvider>
        )}
      />
    );
  }
}

NSCDieuChinhPage.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
  orgCodes: PropTypes.string,
};

NSCDieuChinhPage.defaultProps = {
  initialSchema: FormTimKiemSchema.cast(),
};

export const mapStateToProps = createStructuredSelector({
  orgCodes: makeSelectData('master', 'orgCodes'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

const withSaga = injectSaga({ key: 'phieuDieuChinh', saga });
const withReducer = injectReducer({ key: 'phieuDieuChinh', reducer });

export default compose(
  withSaga,
  withReducer,
  withConnect,
  withStyles(styles),
)(NSCDieuChinhPage);
