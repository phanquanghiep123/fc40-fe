import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { Field } from 'formik';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { debounce, find } from 'lodash';
import { startOfDay } from 'date-fns';
import { SEARCH_DEBOUNCE_DELAY } from 'utils/constants';
import { loadingError } from 'containers/App/actions';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import SelectControl from 'components/SelectControl';
import PickersControl from 'components/PickersControl';
import CheckboxControl from 'components/CheckboxControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { basketGroup } from '../PXK_Sell/basketTrayUtils';

import ButtonUI from './Button';
import Group from './Group';
import WrapperBusiness, { CODE, TYPE_FORM } from './Business';

import { TYPE_PXK } from './constants';
import * as actions from './actions';
import * as selectors from './selectors';
import Receiver from './Receiver';
import { setDefaultSellTypeAndChannel } from './utils';
import {
  CHANGE_SUB_TYPE,
  CHANGE_DELIVER_CODE,
  CHANGE_DATE,
  CHANGE_RECEIVER_CODE,
} from './messages';

class PXK extends React.PureComponent {
  getTitle = () => {
    let title = 'Tạo';
    switch (this.props.typeForm) {
      case TYPE_FORM.EDIT:
        title = 'Chỉnh sửa';
        break;
      case TYPE_FORM.VIEW:
        title = 'Xem';
        break;
      default:
        break;
    }

    return title;
  };

  getType = () => {
    let type = 'Kho';
    const {
      values: { subType },
    } = this.props.formik;
    switch (subType) {
      case TYPE_PXK.PXK_XUAT_HUY:
        type = 'Huỷ';
        break;
      default:
        break;
    }

    return type;
  };

  // thay đổi loại xuất kho
  handleChangeSubType = event => {
    const { formik, confirm } = this.props;

    // show alert if subType is `PXK_XUAT_HUY`,
    // else keep going
    if (
      formik.values.subType === TYPE_PXK.PXK_XUAT_HUY &&
      formik.values.detailsCommands.length > 0
    ) {
      event.persist();
      confirm({
        title: 'Cảnh Báo',
        message: CHANGE_SUB_TYPE,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: this.changeSubType,
            payload: event,
          },
        ],
      });
    } else {
      this.changeSubType(event);
    }
  };

  // không cho phép đổi loại xuất kho
  changeSubType = event => {
    const {
      formik,
      typeForm,
      onGetListRequest,
      onGetReceiver,
      onGetInitExportSell,
      onChangeSchema,
    } = this.props;

    formik.handleChange(event);
    onChangeSchema(event.target.value, formik);
    if (event.target.value === TYPE_PXK.PXK_XUAT_HUY) {
      onGetListRequest(formik.values.deliverCode);
    }
    if ([TYPE_FORM.EDIT, TYPE_FORM.CREATE].includes(typeForm)) {
      if (event.target.value === TYPE_PXK.PXK_XDC_FARM) {
        onGetReceiver();
      } else if (event.target.value === TYPE_PXK.PXK_XUAT_BAN) {
        onGetInitExportSell();
      }
    }
  };

  getDataFromDeli = (deliver, customerCodeSelect, dateSelect) => {
    const { formik } = this.props;
    const { deliverCode, customerCode, date } = formik.values;
    this.props.getDataFromDeli(
      {
        plantCode: deliver || deliverCode.value,
        customerCode: customerCodeSelect || customerCode,
        processDate: startOfDay(new Date(dateSelect || date)).toISOString(),
      },
      this.deliCallback,
    );
  };

  deliCallback = (detailsCommandsDeli, deliBasketsTrays) => {
    const { formik } = this.props;
    const { detailsCommands } = formik.values;
    // loại bỏ sản phẩm từ deli
    // thêm sản phẩm deli mới đã được loại bỏ id
    const newDetailsCommands = detailsCommands.filter(item => !item.isFromDeli);
    formik.setFieldValue('detailsCommands', [
      ...newDetailsCommands,
      ...detailsCommandsDeli.map(item => ({
        ...item,
        canRemove: true,
      })),
    ]);
    formik.setFieldValue('deliBasketsTrays', deliBasketsTrays);
    formik.setFieldValue(
      'basketsTrays',
      basketGroup(newDetailsCommands, deliBasketsTrays),
    );
  };

  handleDeliCheckbox = e => {
    const { formik } = this.props;
    const { customerGroup, detailsCommands } = formik.values;

    if (e.target.checked) {
      this.getDataFromDeli();
      setDefaultSellTypeAndChannel(customerGroup, true, formik);
    } else {
      const newDetailsCommands = detailsCommands.filter(
        item => !item.isFromDeli,
      );
      formik.setFieldValue('deliBasketsTrays', []);
      formik.setFieldValue('detailsCommands', newDetailsCommands);
      formik.setFieldValue('basketsTrays', basketGroup(detailsCommands, []));
    }
  };

  changeDate = date => {
    const { formik } = this.props;
    formik.setFieldValue('date', date, true);
    const { subType, isDelivery } = formik.values;
    if (subType === TYPE_PXK.PXK_XUAT_BAN && isDelivery) {
      this.getDataFromDeli(null, null, date);
    }
  };

  confirmResetDeli = () => {
    const { formik } = this.props;
    const { subType, detailsCommands } = formik.values;
    if (
      subType === TYPE_PXK.PXK_XDC_FARM &&
      detailsCommands.filter(item => item.isFromDeli && item.isNotSaved)
        .length > 0
    ) {
      this.props.confirm({
        title: 'Cảnh Báo',
        message: CHANGE_RECEIVER_CODE,
        actions: [
          {
            text: 'Hủy',
          },
          {
            text: 'Đồng ý',
            onClick: this.resetDeli,
            color: 'primary',
          },
        ],
      });
    }
  };

  resetDeli = () => {
    const { formik } = this.props;
    const newDetailsCommands = formik.values.detailsCommands.filter(
      item => !(item.isFromDeli && item.isNotSaved),
    );
    formik.setFieldValue('detailsCommands', newDetailsCommands);
  };

  resetDeliBeforeAndChangeDate = date => {
    this.resetDeli();
    this.changeDate(date);
  };
  /*
  deli db + deli db  			    Không sửa
  deli db + deli manual		    Không sửa
  deli db + manual			      Không sửa
  deli manual + deli manual	  Cho sửa 		-> reset sản phẩmh
  deli manual + manual		    Cho sửa			-> reset sản phẩm
  --> không chứa deli db thì cho sửa
   */

  confirmChangeDate = date => {
    const { formik } = this.props;
    const { subType, detailsCommands } = formik.values;
    if (
      subType === TYPE_PXK.PXK_XDC_FARM &&
      detailsCommands.filter(item => item.isFromDeli && item.isNotSaved)
        .length > 0
    ) {
      this.props.confirm({
        title: 'Cảnh Báo',
        message: CHANGE_DATE,
        actions: [
          {
            text: 'Hủy',
          },
          {
            text: 'Đồng ý',
            onClick: this.resetDeliBeforeAndChangeDate,
            color: 'primary',
            payload: date,
          },
        ],
      });
    } else {
      this.changeDate(date);
    }
  };

  // thay đổi đơn vị xuất hàng
  handleChangeDeliver = ev => {
    const { formik, confirm } = this.props;

    // else keep going
    if (
      formik.values.subType === TYPE_PXK.PXK_XUAT_HUY ||
      formik.values.detailsCommands.length > 0
    ) {
      confirm({
        title: 'Cảnh Báo',
        message: CHANGE_DELIVER_CODE,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: this.changeDeliver,
            payload: ev,
          },
        ],
      });
    } else {
      this.changeDeliver(ev);
    }
  };

  changeDeliver = ev => {
    const { formik } = this.props;
    const { subType } = formik.values;
    this.props.onGetWarehouses(ev.value);
    formik.setFieldValue('detailsCommands', []);
    if (subType === TYPE_PXK.PXK_XUAT_HUY) {
      this.props.onGetListRequest(ev.value);
      formik.setFieldValue('total', '');
      formik.setFieldValue('reasonDescription', '');
      formik.setFieldValue('receiptCode', '');
      formik.setFieldValue('detailsCommands', []);
    } else if (subType === TYPE_PXK.PXK_XUAT_BAN && formik.values.isDelivery) {
      this.getDataFromDeli(ev.value, null, null);
    }
    formik.setFieldValue('deliverName', ev.label);
    formik.setFieldValue('deliverCode', ev);
    // formik.handleChange(ev);
  };

  handleChangeScalingEmployee = option => {
    const { formik } = this.props;
    // formik.setFieldValue('userID', option.value);
    // formik.setFieldValue('exporterPhone', option.phone);
    // formik.setFieldValue('exporterEmail', option.email);
    formik.setValues({
      ...formik.values,
      ...{
        userID: option.value,
        exporterPhone: option.phone,
        exporterEmail: option.email,
      },
    });
  };

  debouncedGetCustomer = debounce(
    this.props.onGetCustomer,
    SEARCH_DEBOUNCE_DELAY,
  );

  changeExportSell = (event, formik) => {
    // load lại kênh
    const { sellTypes } = this.props;
    const sellType = find(sellTypes, item => item.code === event.target.value);
    if (
      sellType &&
      sellType.distributionChannel instanceof Array &&
      sellType.distributionChannel.length === 1
    ) {
      formik.setFieldValue('channel', sellType.distributionChannel[0].code);
    } else {
      formik.setFieldValue('channel', '');
    }

    formik.handleChange(event);
  };

  render() {
    const {
      formik,
      classes,
      onGoBack,
      initDatas: { units, exportTypes, receiverUnits },
      typeForm,
      saved,
      // getChannel,
      onGetUsers,
      listRequestDestroy,
      onGetBasketMangagers,
      sellTypes,
      transporters,
    } = this.props;
    return (
      <Grid container tabIndex="-1" className={classes.clearOutline}>
        <Grid container className={classes.spaceTop}>
          <Typography variant="h5" gutterBottom>
            {this.getTitle()} Phiếu Xuất {this.getType()}
          </Typography>
        </Grid>
        <Grid container>
          <Expansion
            title="I. Thông Tin Chung"
            content={
              <Grid container justify="space-between">
                <Group classes={classes}>
                  <WrapperBusiness code={CODE.CODE_PXK} typeForm={typeForm}>
                    <Grid container justify="space-between">
                      <Grid item lg={6} md={12} sm={12} xs={12}>
                        <Field
                          name="documentCode"
                          label="Mã PXK"
                          component={InputControl}
                          onChange={formik.handleChange}
                          disabled
                        />
                      </Grid>
                      <Grid item lg={6} md={12} sm={12} xs={12}>
                        <Field
                          name="statusName"
                          label=""
                          component={InputControl}
                          style={{ color: 'red' }}
                          onChange={formik.handleChange}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </WrapperBusiness>
                  <WrapperBusiness
                    formik={formik}
                    saved={saved}
                    typeForm={typeForm}
                    code={CODE.SELECT_TYPE_PXK}
                  >
                    {props => (
                      <Field
                        name="subType"
                        label="Loại Xuất Kho"
                        component={SelectControl}
                        disabled={props.disabled}
                        onChange={this.handleChangeSubType}
                      >
                        {exportTypes.map(type => (
                          <MenuItem value={type.id} key={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    typeForm={typeForm}
                    code={CODE.DELIVER_CODE}
                    typePXK={formik.values.subType}
                    saved={saved}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="deliverCode"
                        label="Đơn Vị Xuất Hàng"
                        component={SelectAutocomplete}
                        value={formik.values.deliverCode}
                        disabled={props.disabled}
                        options={units}
                        onChangeSelectAutoComplete={this.handleChangeDeliver}
                        isClearable={false}
                      />
                      // <Field
                      //   name="deliverCode"
                      //   label="Đơn Vị Xuất Hàng"
                      //   component={SelectControl}
                      //   disabled={props.disabled}
                      //   onChange={this.handleChangeDeliver}
                      // >
                      //   {units.map(type => (
                      //     <MenuItem
                      //       value={type.id}
                      //       key={type.id}
                      //       data-unit-name={type.name}
                      //     >
                      //       {type.name}
                      //     </MenuItem>
                      //   ))}
                      // </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    formik={formik}
                    saved={saved}
                    typeForm={typeForm}
                    code={CODE.CHECKBOX_PXB}
                  >
                    {props => (
                      <Field
                        name="isDelivery"
                        label="Xuất Bán Từ Dữ Liệu Chia Chọn Thực Tế"
                        component={CheckboxControl}
                        disabled={props.disabled}
                        labelPlacement="end"
                        handleCheckbox={this.handleDeliCheckbox}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    formik={formik}
                    typeForm={typeForm}
                    code={CODE.SELECT_PYCH}
                  >
                    {props => {
                      const listRequestDestroys = listRequestDestroy.concat(
                        props.selectReceiptCode,
                      );
                      return (
                        <Field
                          name="receiptCode"
                          label="Phiếu Yêu Cầu Hủy"
                          component={SelectControl}
                          disabled={
                            props.disabled || listRequestDestroys.length === 0
                          }
                          onChange={e => {
                            this.props.onGetDestroyDetail(
                              e.target.value,
                              formik.values,
                            );
                            formik.handleChange(e);
                          }}
                        >
                          {listRequestDestroys.map(item => (
                            <MenuItem value={item} key={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Field>
                      );
                    }}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    typeForm={typeForm}
                    code={CODE.RECEIVER_CODE}
                    saved={saved}
                    typePXK={formik.values.subType}
                    formik={formik}
                  >
                    {props => (
                      <Receiver
                        resetDeli={this.confirmResetDeli}
                        getDataFromDeli={this.getDataFromDeli}
                        receiverUnits={receiverUnits}
                        disabled={props.disabled}
                        formik={formik}
                        typePXK={formik.values.subType}
                        onGetCustomer={this.debouncedGetCustomer}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.GROUP_PXK_DESTROY}
                    typeForm={typeForm}
                    formik={formik}
                  >
                    <Field
                      name="reasonDescription"
                      label="Lý Do"
                      component={InputControl}
                      onChange={formik.handleChange}
                      disabled
                    />
                    <Field
                      name="total"
                      label="Tổng Ước Tính Giá Trị Hủy Lần Này"
                      component={InputControl}
                      onChange={formik.handleChange}
                      className={classes.highlight}
                      disabled
                    />
                  </WrapperBusiness>
                  <WrapperBusiness
                    formik={formik}
                    typeForm={typeForm}
                    code={CODE.SELL_TYPE}
                  >
                    {props => {
                      if (
                        formik.values.orderTypeCode === '' &&
                        sellTypes instanceof Array &&
                        sellTypes.length > 0
                      ) {
                        formik.setFieldValue(
                          'orderTypeCode',
                          sellTypes[0].code,
                        );
                      }
                      return (
                        <Field
                          name="orderTypeCode"
                          label="Loại Đơn Bán Hàng"
                          component={SelectControl}
                          onChange={e => this.changeExportSell(e, formik)}
                          disabled={props.disabled}
                          required
                        >
                          {sellTypes.map(sellType => (
                            <MenuItem key={sellType.code} value={sellType.code}>
                              {sellType.description}
                            </MenuItem>
                          ))}
                        </Field>
                      );
                    }}
                  </WrapperBusiness>
                  <WrapperBusiness
                    formik={formik}
                    typeForm={typeForm}
                    code={CODE.CHANNEL}
                    sellTypes={sellTypes}
                  >
                    {props => {
                      if (
                        props.channels.length === 1 &&
                        formik.values.channel === ''
                      ) {
                        formik.setFieldValue('channel', props.channels[0].code);
                      }
                      return (
                        <Field
                          name="channel"
                          label="Kênh"
                          component={SelectControl}
                          onChange={formik.handleChange}
                          disabled={props.disabled}
                          required
                        >
                          {props.channels.map(channel => (
                            <MenuItem key={channel.code} value={channel.code}>
                              {channel.name}
                            </MenuItem>
                          ))}
                        </Field>
                      );
                    }}
                  </WrapperBusiness>
                  <WrapperBusiness
                    saved={saved}
                    code={CODE.NOTE_FIELD}
                    typeForm={typeForm}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="note"
                        label="Ghi Chú"
                        component={InputControl}
                        multiline={props.multiline}
                        onChange={formik.handleChange}
                        disabled={props.disabled}
                      />
                    )}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    saved={saved}
                    code={CODE.DATE}
                    typeForm={typeForm}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="date"
                        label="Thời Gian Lập Phiếu"
                        component={PickersControl}
                        controlOutside={this.confirmChangeDate}
                        required
                        disabled={props.disabled}
                        maxDate={props.maxDate}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    saved={saved}
                    code={CODE.GROUP_REQUIRED}
                    typeForm={typeForm}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="supervisorName"
                        textFieldProps={{
                          label: 'Nhân Viên Giám Sát',
                          InputLabelProps: {
                            shrink: true,
                          },
                          required: true,
                        }}
                        placeholder={formik.values.supervisorName}
                        component={InputControl}
                        promiseOptions={onGetUsers}
                        onInputChange={option =>
                          formik.setFieldValue('supervisorID', option.value)
                        }
                        autoComplete
                        disabled={props.disabled}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    typeForm={typeForm}
                    formik={formik}
                    code={CODE.TRANSPOTER}
                  >
                    {props => (
                      <Field
                        name="transporterCode"
                        label="Nhà Vận Chuyển"
                        component={SelectControl}
                        onChange={formik.handleChange}
                        disabled={props.disabled}
                      >
                        {transporters.map(transporter => (
                          <MenuItem
                            key={transporter.transporterCode}
                            value={transporter.transporterCode}
                          >
                            {transporter.fullName}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.BASKET_MANGAGER}
                    formik={formik}
                    typeForm={typeForm}
                  >
                    {props => (
                      <Field
                        name="customerBasketName"
                        textFieldProps={{
                          label: 'Đơn Vị Quản Lý Khay Sọt',
                          InputLabelProps: {
                            shrink: true,
                          },
                        }}
                        component={InputControl}
                        promiseOptions={onGetBasketMangagers}
                        placeholder={formik.values.customerBasketName}
                        disabled={props.disabled}
                        autoComplete
                        onInputChange={option => {
                          formik.setFieldValue(
                            'customerBasketCode',
                            option.value,
                          );
                          formik.setFieldValue(
                            'customerBasketType',
                            option.customerBasketType,
                          );
                        }}
                      />
                    )}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    saved={saved}
                    code={CODE.GROUP_REQUIRED}
                    typeForm={typeForm}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="exporterName"
                        textFieldProps={{
                          label: 'Nhân Viên Cân Hàng',
                          InputLabelProps: {
                            shrink: true,
                          },
                          required: true,
                        }}
                        placeholder={formik.values.exporterName}
                        component={InputControl}
                        promiseOptions={onGetUsers}
                        onInputChange={this.handleChangeScalingEmployee}
                        autoComplete
                        disabled={props.disabled}
                      />
                    )}
                  </WrapperBusiness>
                  <Field
                    name="exporterPhone"
                    label="Điện Thoại"
                    disabled
                    component={InputControl}
                  />
                  <Field
                    name="exporterEmail"
                    label="Email"
                    disabled
                    component={InputControl}
                  />
                </Group>
                <WrapperBusiness
                  saved={saved}
                  code={CODE.ACTION_GROUP1}
                  typeForm={typeForm}
                  formik={formik}
                >
                  <Grid container justify="flex-end">
                    <ButtonUI
                      type="button"
                      onClick={() => onGoBack(formik)}
                      title="Quay Lại"
                      style={classes.secondary}
                    />

                    <ButtonUI
                      color="primary"
                      onClick={formik.handleSubmitClick}
                      title="Lưu"
                      style={classes.primary}
                      disabled={formik.isSubmitting}
                    />
                  </Grid>
                </WrapperBusiness>
              </Grid>
            }
          />
        </Grid>
      </Grid>
    );
  }
}

PXK.propTypes = {
  formik: PropTypes.object,
  classes: PropTypes.object,
  onGoBack: PropTypes.func,
  initDatas: PropTypes.object,
  typeForm: PropTypes.string,
  saved: PropTypes.bool,
  // api
  getDataFromDeli: PropTypes.func,
  onGetWarehouses: PropTypes.func,
  onGetDestroyDetail: PropTypes.func,
  onGetCustomer: PropTypes.func,
  confirm: PropTypes.func,
  onGetUsers: PropTypes.func,
  onGetListRequest: PropTypes.func,
  onGetInitExportSell: PropTypes.func,
  onGetReceiver: PropTypes.func,
  onGetBasketMangagers: PropTypes.func,
  onChangeSchema: PropTypes.func,
  listRequestDestroy: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  sellTypes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  transporters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export function mapDispatchToProps(dispatch) {
  return {
    showError: messages => dispatch(loadingError(messages)),
    onGetWarehouses: plantId => dispatch(actions.getWarehouses(plantId)),
    onGetUsers: (inputText, callback) =>
      dispatch(actions.getUsers(inputText, callback)),
    onGetListRequest: plantCode =>
      dispatch(actions.getListRequestDestroy(plantCode)),
    onGetDestroyDetail: (receiptCode, formik) =>
      dispatch(actions.getDestroyDetail(receiptCode, formik)),
    onGetReceiver: subType => dispatch(actions.getReceiver(subType)),
    onGetCustomer: (inputText, callback) =>
      dispatch(actions.getCustomer(inputText, callback)),
    onGetInitExportSell: () => dispatch(actions.getInitExportSell()),
    getChannel: orderTypeCode => dispatch(actions.getChannel(orderTypeCode)),
    onGetBasketMangagers: (inputText, callback) =>
      dispatch(actions.onGetBasketMangagers(inputText, callback)),
    getDataFromDeli: (data, callback) =>
      dispatch(actions.getDataFromDeli(data, callback)),
  };
}
const mapStateToProps = createStructuredSelector({
  listRequestDestroy: selectors.makeSelectListRequestDestroy(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PXK);
