import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';

import { Form } from 'formik';
import { Typography, Grid, withStyles } from '@material-ui/core';

import { toMidnightISOString } from 'utils/datetimeUtils';
import { PATH_GATEWAY } from 'utils/request';
import injectReducer from 'utils/injectReducer';
import { isObjectWithValidProperty } from 'utils/validation';

// import { loadingError } from 'containers/App/actions';
import messageGlobal from 'containers/App/messageGlobal';
import { makeSelectUserIdLogin } from 'containers/App/selectors';
import { showSuccess, showWarning } from 'containers/App/actions';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { MuiButton } from 'components/MuiButton';
import ButtonWhite from 'components/Button/ButtonWhite';
import { formikPropsHelpers } from 'components/FormikUI/utils';
import FormWrapper from 'components/FormikUI/FormWrapper';

import GeneralInfo from './GeneralInfo';
import ProductTable from './Table';
import reducer, {
  setGeneralInfo,
  DETAILS_COMMANDS_KEY,
  resetForm,
} from './reducer';

import {
  CREATE,
  EDIT,
  VIEW,
  CREATE_WITHDRAWAL_REQUEST_API,
  UPDATE_WITHDRAWAL_REQUEST_API,
  REAPPROVE_WITHDRAWAL_REQUEST_API,
  APPROVE,
  REAPPROVE,
  IN_PROGRESS,
  NOT_APPROVED,
  PAGE_TYPE_MAP,
} from './constants';
import { makeSelectGeneralInfo } from './selectors';
import { RequestIssueSchema } from './Schema';
import {
  post,
  get,
  makeArrayOfProductCast,
  coerceEmptyStringToNull,
} from './utils';
import TableApprove from './TableApprove';

const style = () => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > button': {
      marginBottom: '1rem',
    },
  },
});

let cacheEmptyRows = 0;

export class CreateEditWithdrawalRequest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: PAGE_TYPE_MAP[this.getPageTypePath()].title,
      pageType: PAGE_TYPE_MAP[this.getPageTypePath()].type,

      statusData: [],
      businessObjectData: [],
      paymentTypeData: [],
    };

    this.confirmationRef = null;
  }

  componentDidMount() {
    this.initDetails();
  }

  componentWillUnmount() {
    // clear formik.values between page navigations
    this.props.resetFormToInitial();
  }

  // #region init

  getPageTypePath = () => this.props.match.path.split('/')[2];

  initDetails = async () => {
    await this.getInitRetailRequest();

    if (this.state.pageType !== CREATE) {
      await this.getDetails();
    }
  };

  // #endregion

  back = () => {
    this.props.history.goBack();
  };

  onFormInvalid = formik => {
    // eslint-disable-next-line no-console
    console.log(formik.errors);

    if (cacheEmptyRows) {
      formik.setFieldValue(
        DETAILS_COMMANDS_KEY,
        formik.values.detailsCommands.concat(
          makeArrayOfProductCast(cacheEmptyRows),
        ),
      );
      cacheEmptyRows = 0;
    }

    this.props.showWarning(messageGlobal.INVALID_FORM);
  };

  showConfirmation = options => {
    if (this.confirmationRef) {
      this.confirmationRef.showConfirm(options);
    }
  };

  // ***************************************
  // #region api calls

  onSubmit = async values => {
    const { pageType } = this.state;

    // this.props.setIsLoading(true);

    let url = CREATE_WITHDRAWAL_REQUEST_API;

    if (pageType === EDIT) {
      url = UPDATE_WITHDRAWAL_REQUEST_API;
    } else if (pageType === REAPPROVE) {
      url = REAPPROVE_WITHDRAWAL_REQUEST_API;
    }

    // only keep valid product rows
    const detailsCommands = values.detailsCommands.filter(product =>
      isObjectWithValidProperty(product),
    );

    detailsCommands.forEach(product => {
      coerceEmptyStringToNull(product);
    });

    const payload = coerceEmptyStringToNull({
      ...values,
      date: toMidnightISOString(values.date),
      retailRequestCreateDate: toMidnightISOString(
        values.retailRequestCreateDate,
      ),
      detailsCommands,
    });

    await post(url, payload, response => {
      this.props.history.goBack();
      setImmediate(() => this.props.notifySuccess(response.message));
    });

    // this.props.setIsLoading(false);
  };

  getInitRetailRequest = async () => {
    get(
      `${
        PATH_GATEWAY.BFF_SPA_API
      }/exported-retail-request/init-create-retail-request`,
      response => {
        this.setState({
          statusData: response.data.exportedRetailRequestStatus,
          businessObjectData: response.data.businessObject,
          paymentTypeData: response.data.paymentType,
        });
      },
    );
  };

  getDetails = async () => {
    get(
      `${PATH_GATEWAY.BFF_SPA_API}/exported-retail-request/${
        this.props.match.params.id
      }/details-retail-request`,
      response => {
        response.data.detailsCommands.forEach(item => {
          // eslint-disable-next-line no-param-reassign
          item.isSaved = true;
        });

        // const { date, retailRequestCreateDate } = response.data;

        // response.data.date = normalizeNonISODateString(date);
        // response.data.retailRequestCreateDate = normalizeNonISODateString(
        //   retailRequestCreateDate,
        // );

        if (this.state.pageType === REAPPROVE) {
          response.data.status = IN_PROGRESS;
        }

        if (response.data.status === NOT_APPROVED) {
          this.setState(state => ({
            statusData: state.statusData.filter(
              item => item.id === NOT_APPROVED || item.id === IN_PROGRESS,
            ),
          }));
        }

        this.props.setGeneralInfo(response.data);
      },
    );
  };

  // #endregion

  render() {
    const {
      classes,
      match,
      history,
      generalInfo,
      userId,
      resetFormToInitial,
      notifySuccess,
    } = this.props;

    const {
      title,
      pageType,

      statusData,
      businessObjectData,
      paymentTypeData,
    } = this.state;

    const isCreatePage = pageType === CREATE;
    const isEditPage = pageType === EDIT;
    const isViewPage = pageType === VIEW;
    const isApprovePage = pageType === APPROVE;
    const isReapprovePage = pageType === REAPPROVE;

    const initialFormikValues = {
      ...generalInfo,
    };

    if (!initialFormikValues.userId) {
      initialFormikValues.userId = userId;
    }

    if (isCreatePage) {
      initialFormikValues.detailsCommands = makeArrayOfProductCast(10);
    }

    return (
      <div>
        <div className={classes.headerContainer}>
          <Typography variant="h5" color="textPrimary" gutterBottom>
            {title}
          </Typography>
        </div>

        <FormWrapper
          enableReinitialize
          initialValues={initialFormikValues}
          validationSchema={RequestIssueSchema}
          onInvalidSubmission={this.onFormInvalid}
          onSubmit={this.onSubmit}
          render={formik => {
            const { detailsCommands, status } = formik.values;

            const formikWithAddedMethods = Object.assign(
              formikPropsHelpers(formik),
              formik,
            );

            const isEditableStatus =
              (status === IN_PROGRESS || status === NOT_APPROVED) &&
              (!isViewPage && !isApprovePage);

            function onClickSubmitForm(ev) {
              ev.persist();

              // only keep valid product rows
              const filledProducts = detailsCommands.filter(product =>
                isObjectWithValidProperty(product),
              );

              if (filledProducts.length < detailsCommands.length) {
                cacheEmptyRows = detailsCommands.length - filledProducts.length;
                formik.setFieldValue(DETAILS_COMMANDS_KEY, filledProducts);
              }

              setImmediate(() => formik.handleSubmitClick(ev));
            }

            return (
              <Fragment>
                <Form>
                  <GeneralInfo
                    key={formik.values.retailRequestCode}
                    statusData={statusData}
                    businessObjectData={businessObjectData}
                    paymentTypeData={paymentTypeData}
                    isCreatePage={isCreatePage}
                    isEditPage={isEditPage}
                    isEditableStatus={isEditableStatus}
                    userId={userId}
                    formik={formikWithAddedMethods}
                    match={match}
                    showConfirmation={this.showConfirmation}
                    resetForm={resetFormToInitial}
                  />

                  <ProductTable
                    key={match.params.id}
                    formik={formikWithAddedMethods}
                    showConfirmation={this.showConfirmation}
                    notifySuccess={notifySuccess}
                    isCreatePage={isCreatePage}
                    isEditPage={isEditPage}
                    isViewPage={isViewPage}
                    isReapprovePage={isReapprovePage}
                    isEditableStatus={isEditableStatus}
                  />

                  {/* eslint-disable prettier/prettier */}
                  {!isCreatePage &&
                    !isReapprovePage && (
                    <TableApprove
                      id={match.params.id}
                      userId={userId}
                      classes={classes}
                      history={history}
                      formik={formikWithAddedMethods}
                      back={this.back}
                      notifySuccess={notifySuccess}
                      isApprovePage={isApprovePage}
                    />
                  )}
                  {/* eslint-enable prettier/prettier */}

                  {/* buttons */}
                  {!isApprovePage && (
                    <Grid
                      container
                      spacing={16}
                      justify="flex-end"
                      className={classes.btnContainer}
                    >
                      <Grid item>
                        <ButtonWhite text="Quay lại" onClick={this.back} />
                      </Grid>
                      {!isViewPage && (
                        <Grid item>
                          <MuiButton
                            classes={classes}
                            onClick={onClickSubmitForm}
                          >
                            Lưu
                          </MuiButton>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Form>
                <ConfirmationDialog
                  ref={ref => {
                    this.confirmationRef = ref;
                  }}
                />
              </Fragment>
            );
          }}
        />
      </div>
    );
  }
}

CreateEditWithdrawalRequest.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  generalInfo: PropTypes.object,

  resetFormToInitial: PropTypes.func,
  setGeneralInfo: PropTypes.func,
  // setIsLoading: PropTypes.func,

  showWarning: PropTypes.func,
  notifySuccess: PropTypes.func,
  // showConfirmation: PropTypes.func,
  userId: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  generalInfo: makeSelectGeneralInfo(),
  userId: makeSelectUserIdLogin(),
});

function mapDispatchToProps(dispatch) {
  return {
    resetFormToInitial: () => dispatch(resetForm()),
    setGeneralInfo: info => dispatch(setGeneralInfo(info)),
    // setIsLoading: isLoading => dispatch(setLoading(isLoading)),

    showWarning: message => dispatch(showWarning(message)),
    notifySuccess: message => dispatch(showSuccess(message)),
    // showConfirmation: message => dispatch(showWarning(message)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'withdrawalRequest', reducer });

export default compose(
  withConnect,
  withRouter,
  withReducer,
  withImmutablePropsToJs,
  withStyles(style),
)(CreateEditWithdrawalRequest);
