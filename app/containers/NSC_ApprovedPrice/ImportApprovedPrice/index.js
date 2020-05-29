import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Typography } from '@material-ui/core';
import { Field } from 'formik';

import { buildRequestId } from 'utils/notificationUtils';

import FormWrapper from 'components/FormikUI/FormWrapper';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';
import DialogActions from '@material-ui/core/DialogActions';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import * as Actions from './actions';
import * as Selectors from './selectors';
import dataSample from './sample';

import schema from '../schema';

import baseStyles from '../styles';

export const styles = theme => ({
  ...baseStyles(theme),
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    width: 150,
  },
  chooseFile: {
    textAlign: 'right',
  },
  buttonChooseFile: {
    marginTop: theme.spacing.unit * 2,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class ImportApprovedPricePage extends React.Component {
  requestId = buildRequestId();

  componentDidMount() {
    this.props.getInitMaster(() => {});
    window.signalR.on('MessageNotification', this.signalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.signalRProcessing);
  }

  onFileChange = formik => event => {
    if (event.target && event.target.files[0]) {
      formik.setFieldValue('nameFile', event.target.files[0].name);
      formik.setFieldValue('uploadingFile', event.target.files[0]);

      formik.setFieldTouched('nameFile', true, true);
    }
  };

  onFormSubmit = values => {
    this.props.onUploadFile({ ...values, requestId: this.requestId });
  };

  signalRProcessing = res => {
    const { onSubmitFileSignalr, onsignalRProcessing } = this.props;
    const {
      meta: { requestId },
    } = res;
    if (this.requestId === requestId) {
      onSubmitFileSignalr(res, () => onsignalRProcessing(res));
    }
  };

  onDownloadSampleFile = () => {
    const { onDownloadSampleFile } = this.props;
    onDownloadSampleFile(dataSample);
  };

  render() {
    const { history, initialSchema, plants } = this.props;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={schema}
        onSubmit={this.onFormSubmit}
        render={formik => (
          <section className={styles.main}>
            <section className={styles.heading}>
              <Typography variant="h5">Import file giá đã phê duyệt</Typography>
            </section>
            <Card className={styles.section}>
              <CardContent className={styles.cardContent}>
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <Field
                      name="plantCode"
                      label="Đơn vị"
                      component={MuiInput}
                      select
                      options={plants}
                      valueKey="value"
                      labelKey="name"
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={8}>
                    <Grid item xs={9}>
                      <Field
                        name="nameFile"
                        label="File giá"
                        required
                        disabled
                        showError
                        component={MuiInput}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <input
                        id="button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={this.onFileChange(formik)}
                      />
                      <label htmlFor="button-file">
                        <MuiButton
                          outline
                          component="span"
                          className={styles.buttonChooseFile}
                        >
                          Chọn File
                        </MuiButton>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <DialogActions className={styles.actionButtons}>
              <MuiButton
                outline
                className={styles.button}
                onClick={() => this.onDownloadSampleFile()}
              >
                Tải file mẫu
              </MuiButton>
              <MuiButton
                disabled={formik.isSubmitting}
                className={styles.button}
                onClick={formik.handleSubmitClick}
              >
                Tải Lên
              </MuiButton>
              <MuiButton
                outline
                className={styles.button}
                onClick={() => history.goBack()}
              >
                Đóng
              </MuiButton>
            </DialogActions>
          </section>
        )}
      />
    );
  }
}

ImportApprovedPricePage.propTypes = {
  plants: PropTypes.array,
  history: PropTypes.object,
  initialSchema: PropTypes.object,
  getInitMaster: PropTypes.func,
  onUploadFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onsignalRProcessing: PropTypes.func,
  onDownloadSampleFile: PropTypes.func,
};

ImportApprovedPricePage.defaultProps = {
  plants: [],
  initialSchema: schema.cast(),
};

export const mapStateToProps = createStructuredSelector({
  plants: Selectors.makeSelectData('master', 'plants'),
});

export const mapDispatchToProps = dispatch => ({
  getInitMaster: callback => dispatch(Actions.getInitMaster(callback)),
  onUploadFile: data => dispatch(Actions.uploadFile(data)),
  onSubmitFileSignalr: (res, callback) =>
    dispatch(Actions.submitFileSignalr(res, callback)),
  onsignalRProcessing: res => dispatch(Actions.signalRProcessing(res)),
  onDownloadSampleFile: data => dispatch(Actions.downloadSampleFile(data)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importApprovedPricePage', reducer });
const withSaga = injectSaga({ key: 'importApprovedPricePage', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
  withImmutablePropsToJs,
)(ImportApprovedPricePage);
