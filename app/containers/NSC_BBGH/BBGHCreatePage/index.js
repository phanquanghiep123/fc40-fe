import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Field } from 'formik';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectFullName } from 'containers/App/selectors';
import InputControl from 'components/InputControl';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { localstoreUtilites } from 'utils/persistenceData';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';
import { isArray, debounce, get } from 'lodash';
import { push } from 'connected-react-router';
import { HotKeys } from 'react-hotkeys';
import KEY_MAP from 'containers/App/keysmap';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import SelectAutocomplete from 'components/SelectAutocomplete';
import {
  makeSelectTypesBBGH,
  makeSelectCreatedUnit,
  makeSelectInitialSchema,
  makeSelectTypeBBGHSelected,
  makeSelectedUnit,
  makeSelectSuppliers,
  makeSelectLeadtimes,
  makeSelectUnitRegions,
  makeSelectVehicleRoutes,
  makeSelectReasons,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

import BBGHDetailsSchema from './BBGHDetailsSchema';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import {
  createBBGHFarm,
  getInitCreatedBBGH,
  getUsersAuto,
  getFarmNSCAuto,
  changeSelectedUnit,
  alertInvalidWhenSubmit,
} from './actions';

import styles from './styles';
import { TYPE_BBGH } from './constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();

export class DetailsOfDeliveryRecordsPage extends React.PureComponent {
  state = {
    eventTem: null,
    propsTem: null,
  };

  formRef = null;

  componentWillMount() {
    // call api get init created
    this.props.onGetInitCreatedBBGH();
  }

  /**
   * @param{e: object} event from form
   * @param{formik: object} props of formik
   *
   * @description is called when change "Đơn Vị" field
   */
  changeUnitCreateBB = (e, formik) => {
    this.props.ui.props.onOpenDialog();
    // save temp
    this.setState({ eventTem: e, propsTem: formik });
  };

  confirmChangeUnit = () => {
    const { propsTem, eventTem } = this.state;
    // close dialog
    this.props.ui.props.onCloseDialog();
    // reset form
    propsTem.resetForm();
    // set data for section 2 when change unit field
    const selectedUnit = this.props.unitsByUserLogin.filter(
      item => item.value === eventTem.value,
    )[0];
    // change store, reset typeBBGH
    this.props.onChangeSelectedUnit(selectedUnit.value, types => {
      const firstId = get(types[0], 'id', 0) || 0;
      propsTem.setFieldValue('doType', firstId);
      // NCC to NSC
      if (
        firstId === TYPE_BBGH.NCC_TO_NSC ||
        firstId === TYPE_BBGH.FARM_POST_HARVEST
      ) {
        propsTem.setFieldValue('receivingPersonName', auth.meta.fullName);
        propsTem.setFieldValue('receivingPersonPhone', auth.meta.phoneNumber);
        propsTem.setFieldValue('receivingPersonCode', auth.meta.userId);
        propsTem.setFieldValue('receiverCode', selectedUnit.value);
        propsTem.setFieldValue('receiverName', selectedUnit.label);
      }

      if (firstId === TYPE_BBGH.NCC_TO_NSC) {
        propsTem.setFieldValue('deliverCode', '');
        propsTem.setFieldValue('deliveryName', '');
      }
    });
    // api
    propsTem.setFieldValue('deliveryName', selectedUnit.label);
    propsTem.setFieldValue('deliverCode', selectedUnit.value);
    propsTem.setFieldValue('doWorkingUnitCode', selectedUnit);
    // UI
    propsTem.setFieldValue('doWorkingUnitName', selectedUnit.label);
    propsTem.setFieldValue(
      'regionName',
      this.props.unitRegions[selectedUnit.value].name,
    );
    // call handleChange of formik of unit field
    propsTem.handleChange(eventTem);

    // reset free memory
    this.setState({ eventTem: null, propsTem: null });
  };

  /**
   * @param {inputText: string} text is input in UI
   * @param {callback: function} function is called when reponse return is successful
   */
  getUnitAutoComplete = formik => (inputText, callback) => {
    const { doType } = formik.values;
    // if user not select typeBBGH, default get id of the first record of typeBBGH list
    this.props.onGetFarmNSCAutocomplete(callback, inputText, doType);
  };

  handleInvalidSubmission = () => {
    this.props.onAlertInvalidWhenSubmit(
      'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  handleReset = () => {
    this.moizeApiTest.clear();
  };

  getOrganizationType = () => {
    const { unitRegions, selectedUnit } = this.props;
    if (unitRegions.length > 0) {
      return unitRegions[selectedUnit].organizationType;
    }

    return 0;
  };

  handleSubmit = values => {
    const { stockList } = values;

    if (
      values.doType !== TYPE_BBGH.BASKET_DELIVERY_ORDER &&
      (!stockList || !stockList.length)
    ) {
      this.props.onAlertInvalidWhenSubmit(
        'Không có sản phẩm nào được nhập ở vùng Thông tin hàng hóa',
      );
      return;
    }

    const datas = values;
    if (
      isArray(datas.shipperList) &&
      datas.shipperList[0] &&
      !datas.shipperList[0].shipperName
    ) {
      datas.shipperList = [];
    }

    this.props.onCreateBBGHFarm(datas, this.getOrganizationType(), () =>
      push('/danh-sach-bien-ban-giao-hang'),
    );
  };

  onClickSave = e => {
    e.preventDefault();
    this.formRef.submitForm();
  };

  render() {
    const {
      ui,
      classes,
      typesBBGH,
      selectedUnit,
      nameUserLogin,
      initialSchema,
      unitsByUserLogin,
      typeBBGHSelected,
      onGetUsersAutocomplete,
      onAlertInvalidWhenSubmit,
    } = this.props;

    // condition for rendering section6
    const renderSection6 =
      typeBBGHSelected !== TYPE_BBGH.NCC_TO_NSC &&
      typeBBGHSelected !== TYPE_BBGH.FARM_POST_HARVEST &&
      typeBBGHSelected !== TYPE_BBGH.FARM_TO_PLANT_CODE_2;

    const handlers = {
      [KEY_MAP.CREATE_BBGH.SAVE_BBGH]: this.onClickSave,
    };

    return (
      <HotKeys keyMap={KEY_MAP.CREATE_BBGH} handlers={handlers} focused>
        <FormWrapper
          formikRef={ref => {
            this.formRef = ref;
          }}
          enableReinitialize
          initialValues={initialSchema}
          validationSchema={BBGHDetailsSchema}
          onReset={this.handleReset}
          onSubmit={this.handleSubmit}
          onInvalidSubmission={this.handleInvalidSubmission}
          render={formik => (
            <React.Fragment>
              <Grid container tabIndex="-1" style={{ outline: 0 }}>
                <Grid container justify="space-between">
                  <Grid item xl={8} lg={8} className={classes.titleBBGH}>
                    <Typography variant="h5" gutterBottom>
                      {typeBBGHSelected === TYPE_BBGH.NCC_TO_NSC
                        ? 'Đơn Đặt Hàng'
                        : 'Biên Bản Giao Hàng'}
                    </Typography>
                  </Grid>
                  <Grid item xl={4} lg={4}>
                    <Grid container justify="space-between">
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        xs={6}
                        className={classes.unitLeft}
                      >
                        <Field
                          name="doWorkingUnitCode"
                          label="Đơn Vị"
                          component={SelectAutocomplete}
                          onChangeSelectAutoComplete={e =>
                            this.changeUnitCreateBB(e, formik)
                          }
                          required
                          isClearable={false}
                          options={unitsByUserLogin}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        xs={6}
                        className={classes.unitRight}
                      >
                        <Field
                          name="regionName"
                          label="Vùng Miền"
                          component={InputControl}
                          onChange={formik.handleChange}
                          // outlined
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section1
                    formik={formik}
                    classes={classes}
                    selectedUnit={selectedUnit}
                    typeBBGH={typesBBGH}
                    typeBBGHSelected={typeBBGHSelected}
                    createdBBGHUser={nameUserLogin}
                  />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section2
                    formik={formik}
                    classes={classes}
                    loginInfor={{ nameUserLogin }}
                    onGetUsersAuto={onGetUsersAutocomplete}
                    typeBBGHSelected={typeBBGHSelected}
                    onGetFarmNSCAutocomplete={this.getUnitAutoComplete(formik)}
                  />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section3
                    formik={formik}
                    classes={classes}
                    loginInfor={{ nameUserLogin }}
                    onGetUsersAuto={onGetUsersAutocomplete}
                    typeBBGHSelected={typeBBGHSelected}
                    onGetFarmNSCAutocomplete={this.getUnitAutoComplete(formik)}
                  />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section4
                    ui={ui}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                    classes={classes}
                    onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
                    suggest
                    isUpdate={0}
                  />
                </Grid>
                <Grid item lg={6} xl={6} xs={12} className={classes.section}>
                  {![
                    TYPE_BBGH.NCC_TO_NSC,
                    TYPE_BBGH.BASKET_DELIVERY_ORDER,
                    TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN,
                  ].includes(typeBBGHSelected) && (
                    <Section5 formik={formik} classes={classes} />
                  )}
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  {renderSection6 ? (
                    <Section6
                      typeBBGHSelected={typeBBGHSelected}
                      formik={formik}
                      classes={classes}
                    />
                  ) : null}
                </Grid>
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
                  onClick={() => this.props.history.goBack()}
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
        <ui.Dialog
          {...ui.props}
          title="Cảnh báo"
          content="Việc thay đổi Đơn Vị sẽ không lưu biên bản giao hàng vừa nhập"
          isDialog
          onConfirm={this.confirmChangeUnit} // handle confirm
          maxWidth="lg"
          openDl={ui.props.openDl}
          onCloseDialog={ui.props.onCloseDialog}
        />
      </HotKeys>
    );
  }
}

DetailsOfDeliveryRecordsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  onCreateBBGHFarm: PropTypes.func,
  onGetInitCreatedBBGH: PropTypes.func,
  onGetUsersAutocomplete: PropTypes.func,
  nameUserLogin: PropTypes.string,
  typesBBGH: PropTypes.array,
  unitsByUserLogin: PropTypes.array,
  onGetFarmNSCAutocomplete: PropTypes.func,
  typeBBGHSelected: PropTypes.number,
  onChangeSelectedUnit: PropTypes.func,
  onAlertInvalidWhenSubmit: PropTypes.func,
  suppliers: PropTypes.array,
  leadtimes: PropTypes.array,
  reasons: PropTypes.array,
  vehicleRoutes: PropTypes.array,
  /**
   * @description schema formik
   */
  initialSchema: PropTypes.object,
  /**
   * @description object is injected from PrivateRoute
   * component for using common
   */
  ui: PropTypes.object,
  unitRegions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectedUnit: PropTypes.string,
  history: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onCreateBBGHFarm: (BBGH, organizationType, callback) =>
      dispatch(createBBGHFarm(BBGH, organizationType, callback)),
    onGetInitCreatedBBGH: () => dispatch(getInitCreatedBBGH()),
    onGetUsersAutocomplete: (inputText, farmNscId, callback) =>
      dispatch(getUsersAuto(inputText, farmNscId, callback)),
    onGetFarmNSCAutocomplete: (callback, inputText, typeAuto) =>
      dispatch(getFarmNSCAuto(callback, inputText, typeAuto)),
    onChangeSelectedUnit: (selectedUnit, callback) =>
      dispatch(changeSelectedUnit(selectedUnit, callback)),
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
  };
}

const mapStateToProps = createStructuredSelector({
  typesBBGH: makeSelectTypesBBGH(),
  nameUserLogin: makeSelectFullName(),
  unitsByUserLogin: makeSelectCreatedUnit(),
  initialSchema: makeSelectInitialSchema(),
  typeBBGHSelected: makeSelectTypeBBGHSelected(),
  selectedUnit: makeSelectedUnit(),
  unitRegions: makeSelectUnitRegions(),
  // section 6
  suppliers: makeSelectSuppliers(),
  leadtimes: makeSelectLeadtimes(),
  reasons: makeSelectReasons(),
  vehicleRoutes: makeSelectVehicleRoutes(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'bbghCreate', reducer });
const withSaga = injectSaga({ key: 'bbghCreate', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  withImmutablePropsToJS,
  withRouter,
)(DetailsOfDeliveryRecordsPage);
