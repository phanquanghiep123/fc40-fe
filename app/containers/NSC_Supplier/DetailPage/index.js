import React from 'react';
import PropTypes from 'prop-types';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { makeSelectInitData } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { styles } from '../CreatePage/styles';
import * as Actions from './actions';

import {
  GeneralSection,
  AddressSection,
  ContractSection,
  StatusSection,
  NoteSection,
} from '../CreatePage/section';

import { formDataSchema } from '../ListPage/FormSection/formats';

// eslint-disable-next-line react/prefer-stateless-function
class SupplierDetailPage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.onGetInitPage(id);
  }

  render() {
    const { classes, initData, history, match } = this.props;
    const { id } = match.params;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={initData}
        render={formik => (
          <React.Fragment>
            <Grid container tabIndex="-1" className={classes.clearOutline}>
              <Grid container className={classes.spaceTop}>
                <Typography variant="h5" gutterBottom>
                  Chi tiết nhà cung cấp
                </Typography>
              </Grid>
              <GeneralSection
                formik={formik}
                classes={classes}
                itemId={parseFloat(id)}
                disabled
                formDataSchema={formDataSchema}
              />
              <AddressSection
                formik={formik}
                classes={classes}
                disabled
                formDataSchema={formDataSchema}
              />
              <ContractSection
                formik={formik}
                classes={classes}
                disabled
                formDataSchema={formDataSchema}
              />
              <StatusSection
                formik={formik}
                classes={classes}
                disabled
                formDataSchema={formDataSchema}
              />
              <NoteSection formik={formik} classes={classes} disabled />
            </Grid>
            <Grid
              container
              className={classNames(classes.groupButton, classes.section)}
              justify="flex-end"
            >
              <Button
                type="button"
                variant="contained"
                className={classNames(classes.cancel, classes.space)}
                onClick={() => history.goBack()}
              >
                Quay lại
              </Button>
            </Grid>
          </React.Fragment>
        )}
      />
    );
  }
}

SupplierDetailPage.propTypes = {
  classes: PropTypes.object,
  initData: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  onGetInitPage: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  onGetInitPage: itemId => dispatch(Actions.getInitPage(itemId)),
});

const mapStateToProps = createStructuredSelector({
  initData: makeSelectInitData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'SupplierDetail', reducer });
const withSaga = injectSaga({ key: 'SupplierDetail', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
)(withStyles(styles)(withImmutablePropsToJS(SupplierDetailPage)));
