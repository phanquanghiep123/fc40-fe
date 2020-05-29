import React from 'react';
import { Button, Grid, MenuItem } from '@material-ui/core';
import Expansion from 'components/Expansion';
import { Field, Formik } from 'formik';
import DatePickerControl from 'components/PickersControl';
import TimePickerControl from 'components/TimePickersControl';
import * as PropTypes from 'prop-types';
import { debounce, isEmpty } from 'lodash';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import InputControl from '../../components/InputControl';
import SelectControl from '../../components/SelectControl';
import CheckboxControl from '../../components/CheckboxControl';
import { ReceivingDeliveryOrderBussinesSchema } from './ReceivingDeliveryOrderSchema';
import { formatTimes } from '../../utils/datetimeUtils';
import { changeShippingLeadtime, changeReceivingPerson } from './Utils';
import { VehicleDetail } from './Section4';
import { DELIVER } from './constants';
import reducer from './reducer';
import saga from './saga';
import * as selectors from './selectors';

export class Bussines extends React.Component {
  // checkbox
  changeUnregulatedLeadtime = (e, prs) => {
    const { shippingLeadtime, regulatedArrivalHour } = this.props.initialSchema;
    const { actualArrivalHour } = prs.values;
    if (!e.target.checked) {
      prs.setFieldValue('shippingLeadtime', shippingLeadtime);
      prs.setFieldValue('regulatedArrivalHour', regulatedArrivalHour);
      prs.setFieldValue(
        'shippingLeadtime',
        this.calculateShippingLeadtime(
          prs,
          regulatedArrivalHour,
          actualArrivalHour,
        ),
      );
    }
  };

  // giờ đến theo quy định (select)
  selectRegulatedDepartureHour = (event, prs) => {
    const { actualArrivalHour } = prs.values;
    prs.setFieldValue('regulatedDepartureHour', event.target.value);
    // tính lại vận chuyển theo leadtime
    prs.setFieldValue(
      'shippingLeadtime',
      this.calculateShippingLeadtime(
        prs,
        event.target.value,
        actualArrivalHour,
      ),
    );
  };

  // giờ đến theo quy định (nhập liệu)
  changeRegulatedArrivalHour = (currentDate, prs) => {
    const { actualArrivalHour } = prs.values;
    const regulatedArrivalHour = formatTimes(
      currentDate.getHours(),
      currentDate.getMinutes(),
    );
    prs.setFieldValue('regulatedArrivalHour', regulatedArrivalHour.hour);

    // tính lại vận chuyển theo leadtime
    prs.setFieldValue(
      'shippingLeadtime',
      this.calculateShippingLeadtime(
        prs,
        regulatedArrivalHour.hour,
        actualArrivalHour,
      ),
    );
  };

  selectRegulatedArrivalHour = (event, prs) => {
    const { name, value } = event.target;
    const { actualArrivalHour } = prs.values;
    prs.setFieldValue(name, value);
    // tính lại vận chuyển theo leadtime
    prs.setFieldValue(
      'shippingLeadtime',
      this.calculateShippingLeadtime(prs, value, actualArrivalHour),
    );
  };

  // thay đổi giờ đến thực tế
  onChangeActualArrivalHour = (currentDate, prs) => {
    const { regulatedArrivalHour } = prs.values;
    // tính lại vận chuyển theo leadtime
    const shippingLeadtime = this.calculateShippingLeadtime(
      prs,
      regulatedArrivalHour,
      `${currentDate.getHours()}: ${currentDate.getMinutes()}`,
    );
    prs.setFieldValue('shippingLeadtime', shippingLeadtime);
    if (shippingLeadtime === 1) {
      prs.setFieldValue('reason', '');
    }
  };

  calculateShippingLeadtime = (
    prs,
    regulatedArrivalHour,
    actualArrivalTime,
  ) => {
    // tính ngày giờ theo quy định = Ngày nhận hàng + Giờ đến theo qui định
    // tính ngày giờ đến thực tế = Ngày nhận hàng + Giờ đến thực tế
    let actualArrivalString;
    let regulatedArrivalString;
    if (prs.values.stockReceivingDateTime instanceof Date) {
      // quy định
      regulatedArrivalString = `${prs.values.stockReceivingDateTime.toLocaleDateString(
        'en-US',
      )} ${regulatedArrivalHour}`;
      // thực tế
      actualArrivalString = `${prs.values.stockReceivingDateTime.toLocaleDateString(
        'en-US',
      )} ${actualArrivalTime}`;
    } else {
      // quy định
      regulatedArrivalString = `${prs.values.stockReceivingDateTime.substr(
        0,
        10,
      )} ${regulatedArrivalHour}`;
      // thực tế
      actualArrivalString = `${prs.values.stockReceivingDateTime.substr(
        0,
        10,
      )} ${actualArrivalTime}`;
    }

    const actualArrival = new Date(actualArrivalString);
    const regulatedArrival = new Date(regulatedArrivalString);
    return actualArrival.getTime() <= regulatedArrival.getTime() ? 1 : 0;
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
      onAlertInvalidWhenSubmit,
      masterCode,
      initialSchema,
      vehicleRoute,
      onSubmitForm,
      history,
      leadTime,
      checkDocument,
    } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={ReceivingDeliveryOrderBussinesSchema}
        onSubmit={values => {
          onSubmitForm(values);
        }}
        render={prs => (
          <Grid container>
            <Grid item xs={12} className={classes.section}>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Grid container spacing={32}>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
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
                        <Grid item lg={12} xs={12} />
                        <Grid item lg={12} xs={12} />
                      </Grid>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
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
                      <Grid container spacing={8} className={classes.container}>
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
                            name="stockReceivingDateTime"
                            minDate={prs.values.deliveryDateTime}
                            component={DatePickerControl}
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
                      <Grid container spacing={8} className={classes.container}>
                        <Grid item lg={12} xs={12}>
                          <Field
                            label="Chuyến"
                            name="vehicleNumbering"
                            component={InputControl}
                            onChange={prs.handleChange}
                            disabled
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
                        <Grid item lg={12} xs={12}>
                          <Field
                            label="Biển Số Xe"
                            name="drivingPlate"
                            component={InputControl}
                            onChange={prs.handleChange}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
                        <Grid item lg={12} xs={12}>
                          <Field
                            label="Trọng Tải"
                            name="vehicleWeight"
                            component={InputControl}
                            onChange={prs.handleChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid item lg={3} xs={12} />
                    </Grid>
                    <Grid item lg={3} xs={12} />
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
                      <Grid container spacing={8} className={classes.container}>
                        <Grid item lg={12} xs={12}>
                          <Field
                            name="unregulatedLeadtime"
                            label="Leadtime Không Theo Quy Định"
                            component={CheckboxControl}
                            handleCheckbox={e =>
                              this.changeUnregulatedLeadtime(e, prs)
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
                        <Grid item lg={12} xs={12}>
                          {prs.values.unregulatedLeadtime && (
                            <Field
                              label="Giờ Đến Theo Quy Định"
                              name="regulatedArrivalHour"
                              component={TimePickerControl}
                              onChangeTimePicker={currentDate =>
                                this.changeRegulatedArrivalHour(
                                  currentDate,
                                  prs,
                                )
                              }
                              required
                            />
                          )}
                          {!prs.values.unregulatedLeadtime && (
                            <Field
                              label="Giờ Đến Theo Quy Định"
                              name="regulatedArrivalHour"
                              component={SelectControl}
                              onChange={ev =>
                                this.selectRegulatedArrivalHour(ev, prs)
                              }
                              // disabled
                            >
                              {leadTime.map(item => (
                                <MenuItem
                                  key={item.id}
                                  value={item.regulatedArrivalHour}
                                >
                                  {item.regulatedArrivalHour}
                                </MenuItem>
                              ))}
                            </Field>
                          )}
                        </Grid>
                        <Grid item lg={12} xs={12}>
                          <Field
                            label="Giờ Đến Thực Tế"
                            name="actualArrivalHour"
                            required
                            component={TimePickerControl}
                            onChangeTimePicker={currentDate =>
                              this.onChangeActualArrivalHour(currentDate, prs)
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <Grid container spacing={8} className={classes.container}>
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
                      <Grid container spacing={8} className={classes.container}>
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
                  className={classes.resetBtn}
                  onClick={() => history.goBack()}
                >
                  Huỷ Bỏ
                </Button>
                {prs.values.deliverOrReceiver !== DELIVER && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={debounce(e => {
                      prs.handleSubmit(e);
                      if (!isEmpty(prs.errors)) {
                        onAlertInvalidWhenSubmit(
                          'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
                        );
                      }
                    }, SUBMIT_TIMEOUT)}
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
        )}
      />
    );
  }
}

Bussines.propTypes = {
  classes: PropTypes.object.isRequired,
  onAlertInvalidWhenSubmit: PropTypes.func,
  masterCode: PropTypes.object,
  initialSchema: PropTypes.object,
  onSubmitForm: PropTypes.func,
  history: PropTypes.object,
  onGetReceivingPersonAutoCompele: PropTypes.func,
  vehicleRoute: PropTypes.array,
  leadTime: PropTypes.array,
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
)(Bussines);
