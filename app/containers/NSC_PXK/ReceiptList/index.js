import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import saga from './saga';
import reducer from './reducer';

import Heading from './Heading';

import Section1 from './Section1';
import Section2 from './Section2';

import WeightPopup from './WeightPopup';

import StateProvider from './Provider';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
});

export function ReceiptListPage({ classes, ui }) {
  return (
    <FormWrapper
      persist="FC40_PXK"
      initialValues={{
        plantCode: '',
        receiptId: null,
      }}
      enableReinitialize
      render={formik => (
        <StateProvider
          formik={{
            ...formik,
            ...formikPropsHelpers(formik),
          }}
        >
          <section className={classes.main}>
            <Heading />
            <section className={classes.content}>
              <Grid container spacing={24}>
                <Grid item xs={12} md={6}>
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
          <WeightPopup ui={ui} />
        </StateProvider>
      )}
    />
  );
}

ReceiptListPage.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
};

const withSaga = injectSaga({ key: 'pxkReceiptList', saga });
const withReducer = injectReducer({ key: 'pxkReceiptList', reducer });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
)(ReceiptListPage);
