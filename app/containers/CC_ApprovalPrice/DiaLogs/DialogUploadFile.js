import React from 'react';
import { Form, Field } from 'formik';
import InputControl from 'components/InputControl';
import MuiInput from 'components/MuiInput';
import PropTypes from 'prop-types';
import PaperPanel from 'components/PaperPanel';
import { Button, Grid, withStyles } from '@material-ui/core';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { buildRequestId } from 'utils/notificationUtils';
import { initialSchema, validSchema } from './Schema';
import dataSample from './sample';
import ConfirmImport from './ConfirmImport';

const styles = theme => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  reImportBtn: {
    marginLeft: theme.spacing.unit * 2,
  },
  browserBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});
class DialogUploadFile extends React.Component {
  state = {
    openConfirm: false,
    signalRId: null,
  };

  formik = null;

  onChangeFile = (e, formik) => {
    formik.setFieldValue('UploadingFile', e.target.files[0]);
    formik.setFieldValue('fileName', e.target.files[0].name);
  };

  handleImportCheckbox = (e, formik) => {
    if (e.target.checked) {
      formik.setFieldValue('isCreateDoForProcessor', true);
    } else {
      formik.setFieldValue('isCreateDoForProcessor', false);
    }
  };

  submit = formik => {
    const { signalRId } = this.state;
    const formData = new FormData();
    formData.append('Plant', formik.values.plantCode);
    formData.append('fileName', formik.values.fileName);
    formData.append('UploadingFile', formik.values.UploadingFile);
    formData.append('RequestId', signalRId);
    this.props.onSubmitFile(formData);
  };

  onDownloadSampleFile = () => {
    this.props.onDownloadSampleFile(dataSample);
  };

  closeDialogCallback = () => {
    const { onClose, submittedvalues, onSubmitSuccess } = this.props;
    onSubmitSuccess(submittedvalues);
    onClose();
  };

  reImportSubmit = formik => {
    if (Object.keys(formik.errors).length === 0) {
      this.submit(formik);
    }
  };

  confirm = formik => {
    formik.setFieldValue('isImport', false);
    if (Object.keys(formik.errors).length === 0) {
      this.setState({ openConfirm: true });
    }
  };

  closeConfirm = () => {
    this.setState({ openConfirm: false });
  };

  importSubmit = (e, formik) => {
    this.openConfirm = true;
    formik.setFieldValue('isImport', true);
    formik.handleSubmit();
  };

  closeDl = formik => {
    const { onClose } = this.props;
    formik.resetForm();
    onClose();
  };

  componentDidMount() {
    this.setState({ signalRId: buildRequestId() });
    window.signalR.on('MessageNotification', this.signalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.signalRProcessing);
  }

  signalRProcessing = res => {
    const { onSubmitFileSignalr } = this.props;
    const {
      meta: { requestId },
    } = res;
    const { signalRId } = this.state;
    if (signalRId === requestId) {
      onSubmitFileSignalr(
        res,
        this.closeDialogCallback,
        this.formik.values.date,
      );
    }
  };

  render() {
    const { ui, classes, openDl, plans } = this.props;
    const { openConfirm } = this.state;
    const newplans = plans.filter(item => item.value > 0).map(item => item);
    return (
      <React.Fragment>
        <ui.Dialog
          {...ui.props}
          title="Import file giá đã phê duyệt"
          content={
            <FormWrapper
              enableReinitialize
              initialValues={initialSchema}
              onSubmit={() => this.submit(this.formik)}
              onInvalidSubmission={this.handleInvalidSubmission}
              validationSchema={validSchema}
              render={formik => {
                this.formik = formik;
                return (
                  <Form>
                    <PaperPanel>
                      <Grid container>
                        <Grid item lg={12}>
                          <Field
                            name="plantCode"
                            label="Đơn vị"
                            component={MuiInput}
                            select
                            options={newplans}
                            valueKey="value"
                            labelKey="label"
                            required
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item lg={12}>
                          <Grid
                            container
                            justify="space-around"
                            alignItems="center"
                          >
                            <Grid item lg={9}>
                              <Field
                                disabled
                                name="fileName"
                                label="File giá"
                                component={InputControl}
                                required
                              />
                            </Grid>
                            <Grid item lg={3}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                }}
                              >
                                <input
                                  type="file"
                                  id="button-file"
                                  style={{ display: 'none' }}
                                  onChange={e => this.onChangeFile(e, formik)}
                                  name="fileName"
                                />
                                <label htmlFor="button-file">
                                  <Button
                                    className={classes.browserBtn}
                                    component="span"
                                    variant="contained"
                                  >
                                    Chọn File
                                  </Button>
                                </label>
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </PaperPanel>
                    <div className={classes.btnContainer}>
                      <Button
                        className={classes.cancelBtn}
                        variant="contained"
                        onClick={() => this.closeDl(formik)}
                      >
                        Huỷ Bỏ
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.cancelBtn}
                        onClick={() => {
                          this.onDownloadSampleFile();
                        }}
                      >
                        Tải file mẫu
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={debounce(
                          e => this.importSubmit(e, formik),
                          SUBMIT_TIMEOUT,
                        )}
                      >
                        Tải lên
                      </Button>

                      <ConfirmImport
                        open={openConfirm}
                        onClose={this.closeConfirm}
                        agree={() => this.reImportSubmit(formik)}
                      />
                    </div>
                  </Form>
                );
              }}
            />
          }
          openDl={openDl}
          isDialog={false}
          fullWidth
          customActionDialog
        />
      </React.Fragment>
    );
  }
}
DialogUploadFile.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmitFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onClose: PropTypes.func,
  openDl: PropTypes.bool,
  onLoadingError: PropTypes.func,
  onDownloadSampleFile: PropTypes.func,
  plans: PropTypes.array,
  submittedvalues: PropTypes.object,
  onSubmitSuccess: PropTypes.func,
};

export default withStyles(styles)(DialogUploadFile);
