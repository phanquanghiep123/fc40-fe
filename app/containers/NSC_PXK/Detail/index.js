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

import MuiButton from 'components/MuiButton';

import saga from './saga';
import reducer from './reducer';

import { detailRoutine } from './routines';
import { makeSelectData } from './selectors';

import Section1 from './Section1';
import Section2 from './Section2';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  buttonActions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

export class PXKDetailPage extends React.Component {
  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this.props.onGetInitPage(params.id);
  }

  render() {
    const { classes, initialSchema } = this.props;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        render={formik => (
          <section className={classes.main}>
            <section className={classes.heading}>
              <Typography variant="h5" className={classes.titleText}>
                Xem Phiếu Xuất Kho
              </Typography>
            </section>
            <section className={classes.content}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Section1 formik={formik} />
                </Grid>
                <Grid item xs={12}>
                  <Section2 formik={formik} />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={16}
                justify="flex-end"
                className={classes.buttonActions}
              >
                <Grid item>
                  <MuiButton outline onClick={this.props.history.goBack}>
                    Quay Lại
                  </MuiButton>
                </Grid>
              </Grid>
            </section>
          </section>
        )}
      />
    );
  }
}

PXKDetailPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
  history: PropTypes.object,
  initialSchema: PropTypes.object,
  onGetInitPage: PropTypes.func,
};

PXKDetailPage.defaultProps = {
  initialSchema: {},
};

const withSaga = injectSaga({ key: 'pxkDetailPage', saga });
const withReducer = injectReducer({ key: 'pxkDetailPage', reducer });

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectData('detail'),
});

export const mapDispatchToProps = dispatch => ({
  onGetInitPage: id => dispatch(detailRoutine.request({ id })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withSaga,
  withReducer,
  withConnect,
  withStyles(styles),
  withImmutablePropsToJS,
)(PXKDetailPage);
