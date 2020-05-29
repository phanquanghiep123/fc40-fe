import DatePickerControl from 'components/PickersControl';
import React from 'react';
import { Form, Field } from 'formik';
import PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import PaperPanel from 'components/PaperPanel';
import { Button, Grid, MenuItem, withStyles } from '@material-ui/core';
import CheckboxControl from 'components/CheckboxControl';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { Can } from 'authorize/ability-context';
import { SCREEN_CODE, CODE } from 'authorize/groupAuthorize';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { buildRequestId } from 'utils/notificationUtils';
import SelectControl from 'components/SelectControl';
import { initialSchema, validSchema } from './Schema';
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
class TotalWeightImportFile extends React.Component {
  state = {
    openConfirm: false,
    signalRId: null,
  };

  formik = null;

  onChangeFile = (e, formik) => {
    formik.setFieldValue('uploadingFile', e.target.files[0]);
    formik.setFieldValue('name', e.target.files[0].name);
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
    this.props.onSubmitFile(
      { ...formik.values, requestId: signalRId },
      this.closeDialogCallback,
    );
  };

  closeDialogCallback = () => {
    this.formik.resetForm();
    this.props.onSubmitSuccess();
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
        this.formik.values.date,
        this.closeDialogCallback,
      );
    }
  };

  render() {
    const { ui, classes, openDl, formData } = this.props;
    const { openConfirm } = this.state;
    return (
      <React.Fragment>
        <ui.Dialog
          {...ui.props}
          title="Tải Lên Cân Tổng Điều Phối"
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
                            name="date"
                            label="Ngày Sơ Chế"
                            component={DatePickerControl}
                            minDate={new Date()}
                            required
                          />
                        </Grid>
                        <Grid item lg={12}>
                          <Field
                            name="supplyRegion"
                            label="Vùng Miền"
                            component={SelectControl}
                            onChange={formik.handleChange}
                            required
                          >
                            {formData.regions.map(status => (
                              <MenuItem key={status.value} value={status.value}>
                                {status.name}
                              </MenuItem>
                            ))}
                          </Field>
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
                                name="name"
                                label="Tài Liệu Đã Chọn"
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
                                  accept=".xlsx; .xls"
                                  id="button-file"
                                  style={{ display: 'none' }}
                                  onChange={e => this.onChangeFile(e, formik)}
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
                        <Grid item lg={6}>
                          <Field
                            label="Tải Lên Bổ Sung"
                            name="isSupplementImportForProcessor"
                            component={CheckboxControl}
                            handleCheckbox={e =>
                              this.handleImportCheckbox(e, formik)
                            }
                          />
                        </Grid>
                        <Grid item lg={6} />
                        <Grid item lg={6}>
                          <Field
                            label="Tạo BBGH cho Nhà Cung Cấp"
                            name="isCreateDoForProcessor"
                            component={CheckboxControl}
                            disabled={
                              formik.values.isSupplementImportForProcessor &&
                              formik.values.isCreateDoForProcessor
                            }
                          />
                        </Grid>
                        <Grid item lg={6} />
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
                        onClick={debounce(
                          e => this.importSubmit(e, formik),
                          SUBMIT_TIMEOUT,
                        )}
                      >
                        Tải lên
                      </Button>
                      <Can do={CODE.suaCTDP} on={SCREEN_CODE.IMPORT_FILE_1}>
                        <Button
                          className={classes.reImportBtn}
                          onClick={() => this.confirm(formik)}
                          variant="contained"
                          color="primary"
                        >
                          Tải lại
                        </Button>
                      </Can>
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
TotalWeightImportFile.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmitFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onClose: PropTypes.func,
  openDl: PropTypes.bool,
  formData: PropTypes.object,
  onLoadingError: PropTypes.func,
};

export default withStyles(styles)(TotalWeightImportFile);
