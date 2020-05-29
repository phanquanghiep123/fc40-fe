import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import { buildRequestId } from 'utils/notificationUtils';
import DatePickerControl from 'components/DatePickerControl';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { addDays } from 'date-fns';
import MuiButton from 'components/MuiButton';
import PaperPanel from 'components/PaperPanel';
import { Form, Field } from 'formik';
import { Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { getUserId } from 'utils/userContext';
import { SUBMIT_TIMEOUT } from 'utils/constants';

export default class Warning extends React.Component {
  state = {
    signalRId: null,
  };

  componentDidMount() {
    this.setState({ signalRId: buildRequestId() });
    window.signalR.on('MessageNotification', this.signalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.signalRProcessing);
  }

  signalRProcessing = res => {
    if (res) {
      const {
        meta: { requestId },
      } = res;
      const { signalRId } = this.state;
      if (signalRId === requestId) {
        if (res.data && res.data.isCheckSendMail && res.statusCode !== 204) {
          this.props.onSendEmail(this.formik.values.processDate);
        } else {
          this.props.onsignalRProcessing(res);
        }
      }
    }
  };

  checkWarning = formik => {
    const { signalRId } = this.state;
    if (isEmpty(formik.errors)) {
      const form = {
        processDate: formik.values.processDate,
        requestId: signalRId,
        userId: getUserId(),
        isCheckSendMail: false,
      };
      this.props.onCheckWarning(form);
    }
  };

  sendEmail = formik => {
    if (isEmpty(formik.errors)) {
      const { signalRId } = this.state;
      const form = {
        processDate: formik.values.processDate,
        requestId: signalRId,
        userId: getUserId(),
        isCheckSendMail: true,
      };
      this.props.onCheckWarning(form);
    }
  };

  downloadWarningFile = formik => {
    if (isEmpty(formik.errors)) {
      formik.setSubmitting(true);
      this.props.onDownloadWarningFile(formik.values.processDate);
    }
  };

  render() {
    const { onCloseDialog } = this.props;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={{ processDate: addDays(new Date(), 1) }}
        validationSchema={Yup.object().shape({
          processDate: Yup.string()
            .required('Trường không được bỏ trống')
            .nullable(),
        })}
        render={formik => {
          this.formik = formik;
          return (
            <Form>
              <PaperPanel>
                <Field
                  name="processDate"
                  label="Ngày Sơ Chế"
                  component={DatePickerControl}
                  required
                />
              </PaperPanel>
              <Grid container justify="space-between" spacing={24}>
                <Grid item>
                  <MuiButton outline onClick={onCloseDialog}>
                    Đóng
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton
                    onClick={debounce(
                      () => this.checkWarning(formik),
                      SUBMIT_TIMEOUT,
                    )}
                  >
                    Check Cảnh Báo
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton
                    onClick={debounce(
                      () => this.sendEmail(formik),
                      SUBMIT_TIMEOUT,
                    )}
                  >
                    Gửi Email
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton
                    onClick={debounce(
                      () => this.downloadWarningFile(formik),
                      SUBMIT_TIMEOUT,
                    )}
                  >
                    Tải Xuống Cảnh Báo
                  </MuiButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      />
    );
  }
}
Warning.propTypes = {
  onCloseDialog: PropTypes.func,
  onCheckWarning: PropTypes.func,
  onSendEmail: PropTypes.func,
  onDownloadWarningFile: PropTypes.func,
  onsignalRProcessing: PropTypes.func,
};
