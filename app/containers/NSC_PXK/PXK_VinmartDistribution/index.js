import React from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';
import { makeFormSchema } from './Schema';
import * as selectors from './selectors';
import * as actions from './actions';

// eslint-disable-next-line react/prefer-stateless-function
export class PXKVinmartDistribution extends React.PureComponent {
  componentDidMount() {
    const {
      onFetchFormData,
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      history,
    } = this.props;

    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });

    if (formIsSubmitted && formSubmittedValues && !isReset) {
      onFetchFormData(formSubmittedValues, false);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  render() {
    const {
      formDefaultValues,
      formSubmittedValues,
      formIsSubmitted,
      onFetchTableData,
      onUpdateTableData,
      tableData,
    } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Chia Hàng Cho VinMart, VinMart+
        </Typography>
        <Formik
          enableReinitialize
          initialValues={
            formIsSubmitted && formSubmittedValues
              ? formSubmittedValues
              : formDefaultValues
          }
          validationSchema={makeFormSchema(tableData)}
          onSubmit={(values, formikActions) => {
            onFetchTableData(values);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            onUpdateTableData([{}], formDefaultValues);
          }}
          render={formik => (
            <Form>
              <FormSection formik={formik} />
              <TableSection formik={formik} />
            </Form>
          )}
        />
      </React.Fragment>
    );
  }
}

PXKVinmartDistribution.propTypes = {
  history: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  tableData: PropTypes.array,
  formIsSubmitted: PropTypes.bool,
  onFetchFormData: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onUpdateTableData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  tableOriginalData: selectors.tableOriginalData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

export const mapDispatchToProps = dispatch => ({
  dispatch,
  onFetchFormData: (formValues, fetchNew = true) =>
    dispatch(actions.fetchFormData(formValues, fetchNew)),
  onFetchTableData: formValues => dispatch(actions.fetchTableData(formValues)),
  onUpdateTableData: (tableData, formValues = undefined) =>
    dispatch(actions.updateTableData(tableData, formValues)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'PXK_VinmartDistribution', reducer });
const withSaga = injectSaga({ key: 'PXK_VinmartDistribution', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter,
  withImmutablePropsToJS,
)(PXKVinmartDistribution);
