import React from 'react';
import { Button, Grid, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import Expansion from 'components/Expansion';
import { debounce, isEmpty } from 'lodash';
import classNames from 'classnames';
import { DELIVERY_ORDER_BUSSINES } from 'containers/App/constants';
import DatePickerControl from 'components/PickersControl';
import TimePickerControl from 'components/TimePickersControl';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import InputControl from '../../components/InputControl';
import SelectControl from '../../components/SelectControl';
import { DELIVER } from './constants';
import CheckboxControl from '../../components/CheckboxControl';
import { ReceivingDeliveryOrderFarmSchema } from './ReceivingDeliveryOrderSchema';
import { formatTimes, splitTimes } from '../../utils/datetimeUtils';
import {
  changeReceivingPerson,
  changeShippingLeadtime,
  calculateShippingLeadtime,
  onChangeActualArrivalHour,
} from './Utils';
import { VehicleDetail } from './Section4';
import reducer from './reducer';
import saga from './saga';
import * as selectors from './selectors';

export class FarmProcesor extends React.Component {
  formik = null;

  // thay đổi thời gian di chuyển
  onChangeDrivingDuration = (event, prs) => {
    const { regulatedDepartureHour } = prs.values;
    let { actualDepartureHour } = prs.values;
    // tính lại thời gian đến theo quy định
    const drivingDurationTime = splitTimes(parseFloat(event.target.value || 0));
    if (regulatedDepartureHour.toString().length === 0) return;
    const regulatedDepartureTime = splitTimes(regulatedDepartureHour);
    const regulatedArrivalHour = formatTimes(
      regulatedDepartureTime.hours + drivingDurationTime.hours,
      regulatedDepartureTime.minutes + drivingDurationTime.minutes,
    );
    prs.setFieldValue('regulatedArrivalHour', regulatedArrivalHour.hour);

    // tính lại giờ dự kiến đến
    actualDepartureHour = splitTimes(actualDepartureHour);
    const plannedArrivalHour = formatTimes(
      actualDepartureHour.hours + drivingDurationTime.hours,
      actualDepartureHour.minutes + drivingDurationTime.minutes,
    );
    prs.setFieldValue('plannedArrivalHour', plannedArrivalHour.hour);

    // tính lại vận chuyển theo leadtime
    prs.setFieldValue(
      'shippingLeadtime',
      calculateShippingLeadtime(
        prs,
        regulatedDepartureTime, // giờ đến theo quy định regulatedArrivalHour
        drivingDurationTime,
        prs.values.actualArrivalHour,
      ),
    );
  };

  //  thay đổi thời gian đến
  changeStockReceivingDateTime = (date, prs) => {
    const {
      regulatedDepartureHour,
      drivingDuration,
      actualArrivalHour,
    } = prs.values;
    prs.setFieldValue(
      'shippingLeadtime',
      calculateShippingLeadtime(
        prs,
        splitTimes(regulatedDepartureHour),
        splitTimes(parseFloat(drivingDuration || 0)),
        actualArrivalHour,
        date,
      ),
    );
  };

  // checkbox
  changeUnregulatedLeadtime = (e, prs) => {
    const { initialSchema } = this.props;
    if (!e.target.checked) {
      prs.setFieldValue(
        'regulatedDepartureHour',
        initialSchema.regulatedDepartureHour,
      );
      prs.setFieldValue('drivingDuration', initialSchema.drivingDuration);
      prs.setFieldValue('shippingLeadtime', initialSchema.shippingLeadtime);
      prs.setFieldValue(
        'regulatedArrivalHour',
        initialSchema.regulatedArrivalHour,
      );
      prs.setFieldValue('plannedArrivalHour', initialSchema.plannedArrivalHour);
    }
  };

  // giờ xuất phát theo quy định
  changeRegulatedDepartureHour = (currentDate, prs) => {
    const { drivingDuration } = prs.values;
    const drivingDurationTime = splitTimes(parseFloat(drivingDuration || 0));
    const regulatedArrivalHour = formatTimes(
      currentDate.getHours() + drivingDurationTime.hours,
      currentDate.getMinutes() + drivingDurationTime.minutes,
    );
    prs.setFieldValue('regulatedArrivalHour', regulatedArrivalHour.hour);
    // tính lại vận chuyển theo leadtime
    prs.setFieldValue(
      'shippingLeadtime',
      calculateShippingLeadtime(
        prs,
        { hours: currentDate.getHours(), minutes: currentDate.getMinutes() },
        drivingDurationTime,
        prs.values.actualArrivalHour,
      ),
    );
  };

  getReceivingPersonAutoCompele = (inputText, orgId, callback) => {
    this.props.onGetReceivingPersonAutoCompele(inputText, orgId, callback);
  };

  handleImport = (e, type) => {
    this.formik.setFieldValue('fieldName', type);
    this.formik.handleSubmit(e);
  };

  render() {
    const {
      classes,
      masterCode,
      initialSchema,
      onAlertInvalidWhenSubmit,
      onSubmitForm,
      vehicleRoute,
      history,
      checkDocument,
    } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={ReceivingDeliveryOrderFarmSchema}
        onSubmit={values => {
          onSubmitForm(values);
        }}
        render={prs => {
          this.formik = prs;
          return (
            <Grid container>
              <Grid item xs={12} className={classes.section}>
                <Expansion
                  title="I. Thông Tin Chung"
                  content={
                    <Grid container spacing={32}>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              name="doCode"
                              label="Mã BGGH"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              name="status"
                              label="Trạng thái"
                              component={SelectControl}
                              onChange={prs.handleChange}
                              disabled
                            >
                              {masterCode.status.map(status => (
                                <MenuItem key={status.id} value={status.id}>
                                  {status.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            {initialSchema.doType !==
                              DELIVERY_ORDER_BUSSINES && (
                              <Field
                                label="Số Seal"
                                name="sealNumber"
                                component={InputControl}
                                onChange={prs.handleChange}
                                required
                              />
                            )}
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              name="sealStatus"
                              label="Trạng thái của Seal"
                              component={SelectControl}
                              onChange={prs.handleChange}
                              required
                            >
                              {masterCode.sealStatus.map(status => (
                                <MenuItem key={status.id} value={status.id}>
                                  {status.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            {/* không lưu vào DB */}
                            <Field
                              label="Bên Giao Hàng"
                              component={InputControl}
                              name="deliveryName"
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            {/* không lưu vào DB */}
                            <Field
                              label="Đại Diện Giao Hàng"
                              component={InputControl}
                              name="deliveryPersonName"
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Số Điện Thoại"
                              name="deliveryPersonPhone"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Ngày Giao Hàng"
                              name="deliveryDateTime"
                              component={DatePickerControl}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Bên Nhận Hàng"
                              component={InputControl}
                              name="receiverName"
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              name="receivingPersonName"
                              textFieldProps={{
                                label: 'Đại Diện Nhận Hàng',
                                InputLabelProps: {
                                  shrink: true,
                                },
                                required: true,
                              }}
                              placeholder={prs.values.receivingPersonName}
                              component={InputControl}
                              promiseOptions={(inputText, callback) =>
                                this.getReceivingPersonAutoCompele(
                                  inputText,
                                  prs.values.receiverCode,
                                  callback,
                                )
                              }
                              onInputChange={option =>
                                changeReceivingPerson(option, prs)
                              }
                              autoComplete
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Số Điện Thoại"
                              name="receivingPersonPhone"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Ngày Nhận Hàng"
                              minDate={prs.values.deliveryDateTime}
                              name="stockReceivingDateTime"
                              component={DatePickerControl}
                              onChangeDatePicker={date =>
                                this.changeStockReceivingDateTime(date, prs)
                              }
                              required
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12} />
                    </Grid>
                  }
                />
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <Expansion
                  title="II. Thông Tin Nhà Vận Chuyển"
                  content={
                    <Grid container spacing={32}>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Nhà Vận Chuyển"
                              name="shipperName"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Lái Xe"
                              name="driver"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Số Điện Thoại"
                              name="phone"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Biển Số Xe"
                              name="drivingPlate"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Trọng Tải"
                              name="vehicleWeight"
                              component={InputControl}
                              onChange={prs.handleChange}
                              disabled
                            />
                          </Grid>
                        </Grid>
                        <Grid item lg={3} xs={12} />
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <Expansion
                  title="III. Thông Tin Thời Gian Vận Chuyển"
                  content={
                    <Grid container spacing={32}>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              component={CheckboxControl}
                              name="unregulatedLeadtime"
                              label="Leadtime Không Theo Quy Định"
                              handleCheckbox={e =>
                                this.changeUnregulatedLeadtime(e, prs)
                              }
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              name="shippingLeadtime"
                              label="Vận Chuyển Theo Leadtime"
                              component={SelectControl}
                              onChange={event => {
                                prs.handleChange(event);
                                changeShippingLeadtime(event, prs);
                              }}
                              disabled={!prs.values.unregulatedLeadtime}
                            >
                              {masterCode.shippingLeadtime.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            {prs.values.unregulatedLeadtime && (
                              <Field
                                label="Giờ Xuất Phát Theo Quy Định"
                                name="regulatedDepartureHour"
                                component={TimePickerControl}
                                onChangeTimePicker={currentDate =>
                                  this.changeRegulatedDepartureHour(
                                    currentDate,
                                    prs,
                                  )
                                }
                                required
                              />
                            )}
                            {!prs.values.unregulatedLeadtime && (
                              <Field
                                label="Giờ Xuất Phát Theo Quy Định"
                                name="regulatedDepartureHour"
                                component={InputControl}
                                disabled
                                required
                              />
                            )}
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Giờ Xuất Phát Thực Tế"
                              name="actualDepartureHour"
                              component={InputControl}
                              required
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Thời Gian Di Chuyển (giờ)"
                              name="drivingDuration"
                              component={InputControl}
                              onChange={e => {
                                this.onChangeDrivingDuration(e, prs);
                                prs.handleChange(e);
                              }}
                              type="number"
                              required={prs.values.unregulatedLeadtime}
                              disabled={!prs.values.unregulatedLeadtime}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Giờ Đến Theo Quy Định"
                              name="regulatedArrivalHour"
                              component={InputControl}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Giờ Dự Kiến Đến"
                              name="plannedArrivalHour"
                              component={InputControl}
                              disabled
                            />
                          </Grid>
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Giờ Đến Thực Tế"
                              name="actualArrivalHour"
                              component={TimePickerControl}
                              onChangeTimePicker={currentDate =>
                                onChangeActualArrivalHour(currentDate, prs)
                              }
                              required
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12}>
                        <Grid
                          container
                          spacing={8}
                          className={classes.container}
                        >
                          <Grid item lg={12} xs={12}>
                            <Field
                              label="Nguyên Nhân"
                              name="reason"
                              component={SelectControl}
                              onChange={prs.handleChange}
                              disabled={prs.values.shippingLeadtime !== 0}
                              required={prs.values.shippingLeadtime !== 1}
                            >
                              {masterCode.reason.map(reason => (
                                <MenuItem key={reason.id} value={reason.id}>
                                  {reason.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <VehicleDetail
                  classes={classes}
                  masterCode={masterCode}
                  prs={prs}
                  vehicleRoute={vehicleRoute}
                />
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <div className={classes.btnContainer}>
                  <Button
                    type="reset"
                    variant="contained"
                    className={classNames(classes.resetBtn, classes.space)}
                    onClick={() => history.goBack()}
                  >
                    Huỷ Bỏ
                  </Button>
                  {prs.values.deliverOrReceiver !== DELIVER && (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classNames(classes.submit, classes.space)}
                      onClick={e => {
                        prs.handleSubmit(e);
                        if (!isEmpty(prs.errors)) {
                          onAlertInvalidWhenSubmit(
                            'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
                          );
                        }
                      }}
                    >
                      Lưu
                    </Button>
                  )}
                  {checkDocument.isSaveAndCreateBasketDocument && (
                    <Button
                      color="primary"
                      style={{ marginLeft: 15 }}
                      variant="contained"
                      onClick={debounce(
                        e => this.handleImport(e, 'PNKS'),
                        SUBMIT_TIMEOUT,
                      )}
                    >
                      Lưu và Tạo PNKS
                    </Button>
                  )}

                  {checkDocument.isSaveAndCreateDocument && (
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ marginLeft: 15 }}
                      onClick={debounce(
                        e => this.handleImport(e, 'PNK'),
                        SUBMIT_TIMEOUT,
                      )}
                    >
                      Lưu và Tạo PNK
                    </Button>
                  )}
                </div>
              </Grid>
            </Grid>
          );
        }}
      />
    );
  }
}

FarmProcesor.propTypes = {
  classes: PropTypes.object.isRequired,
  masterCode: PropTypes.object,
  initialSchema: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
  onSubmitForm: PropTypes.func,
  vehicleRoute: PropTypes.array,
  history: PropTypes.object,
  onGetReceivingPersonAutoCompele: PropTypes.func,
  checkDocument: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  checkDocument: selectors.makeSelectCheckDocument(),
});

const withReducer = injectReducer({ key: 'receivingDeliveryOrder', reducer });
const withSaga = injectSaga({ key: 'receivingDeliveryOrder', saga });
const withConnect = connect(
  mapStateToProps,
  null,
);
export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(FarmProcesor);
