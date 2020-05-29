import React from 'react';
import PropTypes from 'prop-types';

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

import MuiButton from 'components/MuiButton';

import saga from './saga';
import reducer from './reducer';

import { makeSelectFormSearch } from './selectors';
import { masterRoutine, suppliersRoutine } from './routines';

import Section1 from './Section1';
import Section2 from './Section2';

import SentResult from './SentResult';

import { FormSearchSchema } from './Schema';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  buttonActions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

export class NCCListMailSentPage extends React.Component {
  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    if (params && Number.isInteger(params.id * 1)) {
      this.props.onGetInitMaster(params.id * 1, () => {
        this.onGetSuppliers();
      });
    }
  }

  onFormReset = () => {
    const defaultValues = FormSearchSchema.cast();
    this.onGetSuppliers(defaultValues);
  };

  onFormSubmit = values => {
    const nextValues = {
      ...values,
      pageIndex: 0,
    };
    this.onGetSuppliers(nextValues);
  };

  onGetSuppliers = (values = this.props.initialSchema) => {
    this.props.onGetSuppliers(values);
  };

  render() {
    const { classes, ui, initialSchema } = this.props;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        onReset={this.onFormReset}
        onSubmit={this.onFormSubmit}
        render={formik => (
          <React.Fragment>
            <section className={classes.main}>
              <section className={classes.heading}>
                <Typography variant="h5" className={classes.titleText}>
                  Lịch Sử Gửi Mail
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
                <Grid
                  container
                  spacing={16}
                  justify="flex-end"
                  className={classes.buttonActions}
                >
                  <Grid item>
                    <MuiButton onClick={this.props.history.goBack}>
                      Quay Lại
                    </MuiButton>
                  </Grid>
                </Grid>
              </section>
            </section>
            <SentResult ui={ui} />
          </React.Fragment>
        )}
      />
    );
  }
}

NCCListMailSentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  initialSchema: PropTypes.object,
  onGetSuppliers: PropTypes.func,
  onGetInitMaster: PropTypes.func,
};

NCCListMailSentPage.defaultProps = {
  initialSchema: {},
};

const withSaga = injectSaga({ key: 'listMailSent', saga });
const withReducer = injectReducer({ key: 'listMailSent', reducer });

export const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectFormSearch(),
});

export const mapDispatchToProps = dispatch => ({
  onGetSuppliers: params => dispatch(suppliersRoutine.request({ params })),
  onGetInitMaster: (importId, callback) =>
    dispatch(masterRoutine.request({ importId, callback })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withSaga,
  withConnect,
  withReducer,
  withImmutablePropsToJS,
)(NCCListMailSentPage);
