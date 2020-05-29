import React from 'react';
import PropTypes from 'prop-types';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classNames from 'classnames';
import { debounce } from 'lodash';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import FormWrapper from 'components/FormikUI/FormWrapper';

import { SUBMIT_TIMEOUT } from 'utils/constants';
import { makeSelectInitData } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { validSchema } from './schema';
import { styles } from './styles';
import * as Actions from './actions';

import {
  GeneralSection,
  AddressSection,
  ContractSection,
  StatusSection,
  NoteSection,
} from './section';

import { formDataSchema } from '../ListPage/FormSection/formats';

import { LINK } from '../ListPage/constants';

// eslint-disable-next-line react/prefer-stateless-function
class SupplierCreatePage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.onGetInitPage(id);
  }

  getTitle = () => {
    let title = 'Tạo mới';
    title = (this.isEditMode() && 'Chỉnh sửa') || title;
    return title;
  };

  isEditMode = () => {
    const { id } = this.props.match.params;
    return !!id;
  };

  handleInvalidSubmission = () => {
    this.props.onAlertInvalid(
      'Thông tin nhà cung cấp chưa được điền đầy đủ, vui lòng kiểm tra lại',
    );
  };

  onSubmit = form => {
    const { onSubmitForm } = this.props;
    onSubmitForm('', form, () => push(LINK.LIST_SUPPLIER));
  };

  onClickSave = e => {
    e.preventDefault();
    this.formRef.submitForm();
  };

  render() {
    const { classes, initData, history, match } = this.props;
    const { id } = match.params;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={initData}
        validationSchema={validSchema}
        onSubmit={this.onSubmit}
        onInvalidSubmission={this.handleInvalidSubmission}
        render={formik => (
          <React.Fragment>
            <Grid container tabIndex="-1" className={classes.clearOutline}>
              <Grid container className={classes.spaceTop}>
                <Typography variant="h5" gutterBottom>
                  {this.getTitle()} nhà cung cấp
                </Typography>
              </Grid>
              <GeneralSection
                formik={formik}
                classes={classes}
                itemId={id}
                formDataSchema={formDataSchema}
              />
              <AddressSection
                formik={formik}
                classes={classes}
                formDataSchema={formDataSchema}
              />
              <ContractSection
                formik={formik}
                classes={classes}
                formDataSchema={formDataSchema}
              />
              <StatusSection
                formik={formik}
                classes={classes}
                formDataSchema={formDataSchema}
              />
              <NoteSection formik={formik} classes={classes} />
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
                Hủy Bỏ
              </Button>

              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.submit, classes.space)}
                onClick={debounce(formik.handleSubmitClick, SUBMIT_TIMEOUT)}
                disabled={formik.isSubmitting}
              >
                Lưu
              </Button>
            </Grid>
          </React.Fragment>
        )}
      />
    );
  }
}

SupplierCreatePage.propTypes = {
  classes: PropTypes.object,
  initData: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  onGetInitPage: PropTypes.func,
  onSubmitForm: PropTypes.func,
  onAlertInvalid: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  onGetInitPage: itemId => dispatch(Actions.getInitPage(itemId)),
  onSubmitForm: (path, form, callback) =>
    dispatch(Actions.submitForm(path, form, callback)),
  onAlertInvalid: message => dispatch(Actions.alertInvalid(message)),
});

const mapStateToProps = createStructuredSelector({
  initData: makeSelectInitData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'SupplierForm', reducer });
const withSaga = injectSaga({ key: 'SupplierForm', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
)(withStyles(styles)(withImmutablePropsToJS(SupplierCreatePage)));
