/**
 *
 * ListOwnerBasket
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import FormWrapper from 'components/FormikUI/FormWrapper';
import Grid from '@material-ui/core/Grid';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import formikPropsHelpers from 'utils/formikUtils';
import reducer from './reducer';
import saga from './saga';
import Heading from './Heading';
import Section1 from './Section1';
import * as actions from './actions';
import { makeSelectData } from './selectors';
export const styles = theme => ({
  titleText: {
    fontWeight: 500,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class ListOwnerBasket extends React.Component {
  componentDidMount() {
    const { onFetchFormData, onSearchBasket } = this.props;
    onFetchFormData();
    onSearchBasket();
  }

  render() {
    const { ui, classes, initValue } = this.props;
    return (
      <React.Fragment>
        <section>
          <Grid item>
            <Typography variant="h5" className={classes.titleText}>
              Danh Sách Khay Sọt Sở Hữu
            </Typography>
          </Grid>
          <FormWrapper
            enableReinitialize
            initialValues={initValue}
            render={formik => (
              <React.Fragment>
                <Heading
                  formik={{
                    ...formik,
                    ...formikPropsHelpers(formik),
                  }}
                />
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Section1
                    ui={ui}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
              </React.Fragment>
            )}
          />
        </section>
      </React.Fragment>
    );
  }
}

ListOwnerBasket.propTypes = {
  classes: PropTypes.object.isRequired,
  onFetchFormData: PropTypes.func,
  ui: PropTypes.object,
  initValue: PropTypes.object,
  onSearchBasket: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  initValue: makeSelectData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: callback => {
      dispatch(actions.fetchFormData(callback));
    },
    onSearchBasket: () => {
      dispatch(actions.searchBasket());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'listOwnerBasket', reducer });
const withSaga = injectSaga({ key: 'listOwnerBasket', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(ListOwnerBasket);
