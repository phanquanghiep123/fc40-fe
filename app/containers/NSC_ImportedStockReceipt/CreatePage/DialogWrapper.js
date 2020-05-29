import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { IMPORT_STOCK_FROM_BUSSINES } from 'containers/App/constants';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormWrapper from 'components/FormikUI/FormWrapper';
import MenuItem from '@material-ui/core/MenuItem';
import SelectControl from 'components/SelectControl';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import { localstoreUtilites } from 'utils/persistenceData';
import PaperPanel from 'components/PaperPanel';
import { Button } from '@material-ui/core';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { validSchema } from './Schema';
import {
  makeSelectInitialSchema,
  makeSelectOrganizations,
  makeSelectImportSubType,
  makeSelectItemId,
} from './selectors';
import {
  submitForm,
  alertInvalid,
  getDeliveryOrderCode,
  getDeliveryCode,
  getUserId,
  getOrganizations,
  closeDialog,
  setImportSubType,
} from './actions';

const styles = theme => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 0px',
    '& > *': {
      padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  container: {
    justifyContent: 'space-around',
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
});
class DialogWrapper extends React.Component {
  componentDidMount() {
    const { itemId, onGetOrganizations } = this.props;
    onGetOrganizations(
      itemId,
      localstoreUtilites.getAuthFromLocalStorage().meta.userId,
    );
  }

  handleInvalidSubmission = () => {
    this.props.onAlertInvalid(
      'Phiếu chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  submit = form => {
    const {
      onSubmitForm,
      itemId,
      match,
      history,
      onCreateSuccess,
    } = this.props;
    if (match.path === '/danh-sach-phieu-can-nhap-kho') {
      // onSubmitForm(itemId ? 'update' : 'create', form, documentId =>
      //   history.push(
      //     `/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${form.receiverCode
      //       .toString()
      //       .trim()}&documentId=${documentId}`,
      //   ),
      // );
      if (itemId) {
        onSubmitForm('update', form, documentId =>
          history.push(
            `/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${form.receiverCode
              .toString()
              .trim()}&documentId=${documentId}`,
          ),
        );
      } else {
        onSubmitForm('create', form, documentId =>
          history.push(
            `/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${form.receiverCode.value
              .toString()
              .trim()}&documentId=${documentId}`,
          ),
        );
      }
    } else {
      onSubmitForm(itemId ? 'update' : 'create', form, documentId =>
        onCreateSuccess(form.receiverCode.toString().trim(), documentId),
      );
    }
  };

  changeDeliverCode = (option, formik) => {
    if (formik.values.deliverCode !== option.value) {
      formik.setFieldValue('deliveryOrderCodeLabel', '');
      formik.setFieldValue('deliveryOrderCode', '');
      formik.setFieldValue('deliverCode', option.value);
      const { receiverCode, subType } = formik.values;
      this.props.onGetDeliverOrderCodeAutoComplete(
        '',
        deliverOrderArray => this.setDeliveryOrder(deliverOrderArray, formik),
        receiverCode,
        option.value,
        subType,
      );
    }
  };

  setDeliveryOrder = (deliverOrderArray, formik) => {
    if (deliverOrderArray.length === 1) {
      formik.setFieldValue('deliveryOrderCode', deliverOrderArray[0].value);
      formik.setFieldValue(
        'deliveryOrderCodeLabel',
        deliverOrderArray[0].value,
      );
      this.setSelectVehicleNumbering(deliverOrderArray[0], formik);
    }
  };

  changeDeliveryOrderCode = (option, formik) => {
    formik.setFieldValue('deliveryOrderCode', option.value);
    formik.setFieldValue('deliverName', option.deliverName);
    formik.setFieldValue('deliverCode', option.deliverCode);
    this.setSelectVehicleNumbering(option, formik);
  };

  setSelectVehicleNumbering = (option, formik) => {
    if (
      IMPORT_STOCK_FROM_BUSSINES === formik.values.subType &&
      option.vehicleNumberings &&
      option.vehicleNumberings.length > 0
    ) {
      formik.setFieldValue('vehicleNumbering', option.vehicleNumberings[0]);
      formik.setFieldValue(
        'vehicleNumberings',
        option.vehicleNumberings.map(item => ({
          id: item,
          name: `Chuyến ${item}`,
        })),
      );
    } else {
      formik.setFieldValue('vehicleNumbering', '');
      formik.setFieldValue('vehicleNumberings', []);
    }
  };

  changeUserID = (option, formik) => {
    formik.setFieldValue('userID', option.value.id);
    formik.setFieldValue('phone', option.value.phone);
    formik.setFieldValue('email', option.value.email);
  };

  changeSupervisorID = (option, formik) => {
    formik.setFieldValue('supervisorID', option.value.id);
  };

  onGetDeliverOrderCodeAutoComplete = (inputText, callback, formik) => {
    const { deliverCode, subType } = formik.values;
    const receiverCode = formik.values.receiverCode.value;
    this.props.onGetDeliverOrderCodeAutoComplete(
      inputText,
      callback,
      receiverCode,
      deliverCode,
      subType,
    );
  };

  closeDialog = formik => {
    formik.resetForm();
    this.props.onCloseDialog();
  };

  changeReceiver = (ev, formik) => {
    // if (ev.target.value !== formik.values.receiverCode) {
    //   this.props.onSetImportSubType(ev.target.value, subType =>
    //     this.setSubType(subType, formik),
    //   );
    //   formik.setFieldValue('deliveryOrderCode', '');
    //   formik.setFieldValue('deliveryOrderCodeLabel', '');
    // }
    if (ev.value !== formik.values.receiverCode) {
      this.props.onSetImportSubType(ev.value, subType =>
        this.setSubType(subType, formik),
      );
      formik.setFieldValue('deliveryOrderCode', '');
      formik.setFieldValue('deliveryOrderCodeLabel', '');
    }
  };

  changeSubType = formik => {
    formik.setFieldValue('deliveryOrderCode', '');
    formik.setFieldValue('deliveryOrderCodeLabel', '');
    this.setSelectVehicleNumbering({}, formik);
  };

  setSubType = (subType, formik) => {
    if (subType.length > 0) {
      formik.setFieldValue('subType', subType[0].id);
    }
  };

  render() {
    const {
      ui,
      classes,
      initialSchema,
      onGetDeliverCodeAutoCompele,
      onGetUserIDCompele,
      openDl,
      organizations,
      itemId,
      importSubType,
    } = this.props;
    const trueValue = true;
    return (
      <ui.Dialog
        {...ui.props}
        title={
          itemId == null
            ? 'Tạo Phiếu Cân Nhập Kho'
            : 'Thay Đổi Phiếu Cân Nhập Kho'
        }
        content={
          <FormWrapper
            enableReinitialize
            initialValues={initialSchema}
            validationSchema={validSchema}
            onSubmit={this.submit}
            onInvalidSubmission={this.handleInvalidSubmission}
            render={formik => {
              const selectVehicleNumber = itemId == null;
              const vehicleNumbering = itemId != null;
              return (
                <React.Fragment>
                  <Grid container justify="space-between">
                    <Grid
                      item
                      lg={12}
                      xl={12}
                      md={12}
                      className={classes.group}
                    >
                      <PaperPanel title="Thông Tin Chung">
                        <Grid container spacing={24}>
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Grid container className={classes.container}>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                {itemId === null && (
                                  <Field
                                    name="subType"
                                    label="Loại Nhập Kho"
                                    component={SelectControl}
                                    onChange={ev => {
                                      this.changeSubType(formik);
                                      formik.handleChange(ev);
                                    }}
                                    disabled={itemId != null}
                                  >
                                    {importSubType.map(item => (
                                      <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                )}
                                {itemId !== null && (
                                  <InputControl
                                    label="Loại Nhập Kho"
                                    disabled
                                    required
                                    form={formik}
                                    field={{
                                      name: 'subTypeName',
                                      value: formik.values.subTypeName,
                                    }}
                                  />
                                )}
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="date"
                                  label="Ngày Lập Phiếu"
                                  component={DatePickerControl}
                                  required
                                  disabled
                                />
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                {itemId === null && (
                                  <Field
                                    name="deliveryOrderCode" // autocomplete
                                    disabled={itemId != null}
                                    textFieldProps={{
                                      label: 'Mã BBGH',
                                      InputLabelProps: {
                                        shrink: true,
                                      },
                                      required: true,
                                    }}
                                    placeholder={
                                      formik.values.deliveryOrderCodeLabel
                                    }
                                    component={InputControl}
                                    promiseOptions={(inputText, callback) =>
                                      this.onGetDeliverOrderCodeAutoComplete(
                                        inputText,
                                        callback,
                                        formik,
                                      )
                                    } // call api
                                    onInputChange={
                                      option =>
                                        this.changeDeliveryOrderCode(
                                          option,
                                          formik,
                                        ) // thay đổi các thông tin ảnh hưởng
                                    }
                                    autoComplete
                                  />
                                )}
                                {itemId !== null && (
                                  <InputControl
                                    label="Mã BBGH"
                                    disabled
                                    required
                                    form={formik}
                                    field={{
                                      name: 'deliveryOrderCode',
                                      value: formik.values.deliveryOrderCode,
                                    }}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Grid container className={classes.container}>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                {itemId === null && (
                                  <Field
                                    name="deliverName" // autocomplete
                                    disabled={itemId != null}
                                    textFieldProps={{
                                      label: 'Bên Giao Hàng',
                                      InputLabelProps: {
                                        shrink: true,
                                      },
                                      required: true,
                                    }}
                                    component={InputControl}
                                    placeholder={formik.values.deliverName}
                                    promiseOptions={(inputText, callback) =>
                                      onGetDeliverCodeAutoCompele(
                                        inputText,
                                        formik.values.receiverCode.value,
                                        callback,
                                      )
                                    } // call api
                                    onInputChange={
                                      option =>
                                        this.changeDeliverCode(option, formik) // thay đổi các thông tin ảnh hưởng
                                    }
                                    autoComplete
                                  />
                                )}
                                {itemId !== null && (
                                  <Field
                                    label="Bên Giao Hàng"
                                    disabled
                                    required
                                    name="deliverName"
                                    component={InputControl}
                                  />
                                )}
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                {itemId === null && (
                                  <Field
                                    name="receiverCode"
                                    label="Bên Nhận Hàng"
                                    component={SelectAutocomplete}
                                    onChangeSelectAutoComplete={selected => {
                                      this.changeReceiver(selected, formik);
                                      formik.setFieldValue(
                                        'receiverCode',
                                        selected,
                                      );
                                    }}
                                    options={organizations}
                                    placeholder="Lựa chọn Bên Nhận Hàng"
                                    required
                                    disabled={itemId != null}
                                    isClearable={false}
                                  />
                                )}
                                {/* <Field */}
                                {/* name="receiverCode" */}
                                {/* label="Bên Nhận Hàng" */}
                                {/* disabled={itemId != null} */}
                                {/* component={SelectControl} */}
                                {/* onChange={ev => { */}
                                {/* this.changeReceiver(ev, formik); */}
                                {/* formik.handleChange(ev); */}
                                {/* }} */}
                                {/* required */}
                                {/* > */}
                                {/* {organizations.map(item => ( */}
                                {/* <MenuItem */}
                                {/* key={item.value} */}
                                {/* value={item.value} */}
                                {/* > */}
                                {/* {item.name} */}
                                {/* </MenuItem> */}
                                {/* ))} */}
                                {/* </Field> */}
                                {itemId !== null && (
                                  <InputControl
                                    label="Bên Nhận Hàng"
                                    disabled
                                    required
                                    form={formik}
                                    field={{
                                      name: 'receiverCode',
                                      value: formik.values.receiverName,
                                    }}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Grid container className={classes.container}>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="user"
                                  textFieldProps={{
                                    label: 'Nhân Viên Cân Hàng',
                                    InputLabelProps: {
                                      shrink: true,
                                    },
                                    required: true,
                                  }}
                                  placeholder={formik.values.user}
                                  component={InputControl}
                                  promiseOptions={(inputText, callback) =>
                                    onGetUserIDCompele(inputText, callback)
                                  } // call api
                                  onInputChange={
                                    option => this.changeUserID(option, formik) // thay đổi các thông tin ảnh hưởng
                                  }
                                  autoComplete
                                />
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="phone"
                                  label="Điện Thoại"
                                  component={InputControl}
                                  onChange={formik.handleChange}
                                  disabled
                                />
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="email"
                                  label="Email"
                                  component={InputControl}
                                  onChange={formik.handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={3} md={6} sm={12} xs={12}>
                            <Grid container className={classes.container}>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="supervisor"
                                  textFieldProps={{
                                    label: 'Nhân Viên Giám Sát',
                                    InputLabelProps: {
                                      shrink: true,
                                    },
                                  }}
                                  placeholder={formik.values.supervisor}
                                  component={InputControl}
                                  promiseOptions={(inputText, callback) =>
                                    onGetUserIDCompele(inputText, callback)
                                  } // call api
                                  onInputChange={
                                    option =>
                                      this.changeSupervisorID(option, formik) // thay đổi các thông tin ảnh hưởng
                                  }
                                  autoComplete
                                />
                              </Grid>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                {selectVehicleNumber && (
                                  <Field
                                    name="vehicleNumbering"
                                    label="Chuyến Xe"
                                    component={SelectControl}
                                    disabled={
                                      formik.values.vehicleNumberings.length ===
                                      0
                                    }
                                  >
                                    {formik.values.vehicleNumberings.map(
                                      item => (
                                        <MenuItem key={item.id} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      ),
                                    )}
                                  </Field>
                                )}
                                {vehicleNumbering && (
                                  <InputControl
                                    label="Chuyến Xe"
                                    disabled
                                    required
                                    form={formik}
                                    field={{
                                      name: 'vehicleNumberingLabel',
                                      value:
                                        formik.values.vehicleNumberingLabel,
                                    }}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={6} md={12} sm={12} xs={12}>
                            <Grid container className={classes.container}>
                              <Grid item lg={12} xl={12} md={12} xs={12}>
                                <Field
                                  name="note"
                                  label="Ghi Chú"
                                  component={InputControl}
                                  onChange={formik.handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </PaperPanel>

                      <Grid
                        item
                        lg={12}
                        xl={12}
                        md={12}
                        className={classes.group}
                      >
                        <div className={classes.btnContainer}>
                          <Button
                            type="reset"
                            variant="contained"
                            className={classes.resetBtn}
                            onClick={() => this.closeDialog(formik)}
                          >
                            Huỷ Bỏ
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            className={classes.submit}
                            onClick={debounce(
                              formik.handleSubmitClick,
                              SUBMIT_TIMEOUT,
                            )}
                          >
                            Lưu
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
        }
        openDl={openDl}
        isModal
        fullWidth
        maxWidth="lg"
        customActionDialog={trueValue}
      />
    );
  }
}

DialogWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  onAlertInvalid: PropTypes.func,
  openDl: PropTypes.bool,
  onSubmitForm: PropTypes.func,
  onGetDeliverCodeAutoCompele: PropTypes.func,
  onGetUserIDCompele: PropTypes.func,
  onGetDeliverOrderCodeAutoComplete: PropTypes.func,
  onCloseDialog: PropTypes.func,
  onCreateSuccess: PropTypes.func,
  createSuccess: PropTypes.number,
  itemId: PropTypes.number, // id của phiếu nhập kho cần update
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (path, form, callback) =>
      dispatch(submitForm(path, form, callback)),
    onAlertInvalid: message => dispatch(alertInvalid(message)),
    onGetDeliverCodeAutoCompele: (inputText, receiverCode, callback) =>
      dispatch(getDeliveryCode(inputText, receiverCode, callback)),
    onGetUserIDCompele: (inputText, callback) =>
      dispatch(getUserId(inputText, callback)),
    onGetDeliverOrderCodeAutoComplete: (
      inputText,
      callback,
      receiverCode,
      deliverCode,
      subType,
    ) =>
      dispatch(
        getDeliveryOrderCode(
          inputText,
          callback,
          receiverCode,
          deliverCode,
          subType,
        ),
      ),
    onGetOrganizations: (itemId, userId) =>
      dispatch(getOrganizations(itemId, userId)),
    onCloseDialog: () => dispatch(closeDialog()),
    onSetImportSubType: (receiverCode, callback) =>
      dispatch(setImportSubType(receiverCode, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectInitialSchema(),
  organizations: makeSelectOrganizations(),
  importSubType: makeSelectImportSubType(),
  itemId: makeSelectItemId(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withStyles(styles)(withImmutablePropsToJS(DialogWrapper)),
);
