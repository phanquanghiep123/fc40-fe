import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Form } from 'formik';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import Section1 from './Section1';
import Section2 from './Section2';
import * as makeSelect from './selectors';
import * as actions from './actions';
import FormWrapper from '../../../components/FormikUI/FormWrapper';
import formikPropsHelpers from '../../../utils/formikUtils';
import { FormikGeneralSchema } from './Schemas';
import MuiButton from '../../../components/MuiButton';

const style = () => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& > *': {
      minWidth: 120,
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class ImportStockListPage extends React.Component {
  state = { gridStyle: { height: 420 } };

  componentDidMount() {
    const {
      defaultValues,
      submittedValues,
      isSubmitted,
      onFetchFieldsData,
      history,
    } = this.props;

    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });

    if (isSubmitted && !isReset) {
      onFetchFieldsData(submittedValues, false);
    } else {
      onFetchFieldsData(defaultValues);
    }
  }

  changedExpand = expanded => {
    let gridStyle = { height: 420 };
    if (!expanded) {
      gridStyle = { height: 620 };
    }
    this.setState({ gridStyle });
  };

  render() {
    const {
      classes,
      defaultValues,
      submittedValues,
      isSubmitted,
      tableData,
      onSubmitData,
    } = this.props;

    const initialValues = {
      ...(isSubmitted && submittedValues ? submittedValues : defaultValues),
      tableData,
    };

    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Đăng Kí Thông Tin Khay Sọt Sau Chia Chọn Thực Tế
        </Typography>

        <FormWrapper
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values, formikActions) => {
            onSubmitData(values, submittedValues);
            formikActions.setSubmitting(false);
          }}
          validationSchema={FormikGeneralSchema}
          render={formik => (
            <Form>
              <Section1 formik={formik} onChangeExpand={this.changedExpand} />
              <Section2
                formik={{ ...formik, ...formikPropsHelpers(formik) }}
                gridStyle={this.state.gridStyle}
              />

              <div className={classes.btnContainer}>
                <MuiButton onClick={formik.handleSubmit}>Lưu</MuiButton>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

ImportStockListPage.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  defaultValues: PropTypes.object,
  submittedValues: PropTypes.object,
  isSubmitted: PropTypes.bool,
  tableData: PropTypes.array,
  onFetchFieldsData: PropTypes.func,
  onSubmitData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  defaultValues: makeSelect.defaultValues(),
  submittedValues: makeSelect.submittedValues(),
  isSubmitted: makeSelect.isSubmitted(),
  tableData: makeSelect.tableData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFieldsData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFieldsData(formValues, fetchNew)),
    onSubmitData: (formValues, submittedValues) =>
      dispatch(actions.submitData(formValues, submittedValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'PXKDeliBasket', reducer });
const withSaga = injectSaga({ key: 'PXKDeliBasket', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
  withRouter,
  withImmutablePropsToJs,
  withStyles(style()),
)(ImportStockListPage);
