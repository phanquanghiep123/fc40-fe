import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import Grid from '@material-ui/core/Grid';
import CompleteButton from 'components/Button/ButtonComplete';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { CrossIcon } from 'react-select/lib/components/indicators';

import Expansion from 'components/Expansion';
import { SELECT_OPTION, CLEAR } from 'components/AsyncSelect/constants';
import InputControl from 'components/InputControl';
import InputSuggestControl from 'components/InputSuggestControl';
import SelectControl from 'components/SelectControl';
import PickersControl from 'components/PickersControl';
import { Field } from 'formik';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CheckboxControl from 'components/CheckboxControl';
import { build } from 'utils/querystring';
import request, {
  PATH_GATEWAY,
  optionReq,
  METHOD_REQUEST,
} from 'utils/request';
import { SEARCH_DEBOUNCE_DELAY } from 'utils/constants';
import { toMidnightISOString } from 'utils/datetimeUtils';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { alertInvalidWhenSubmit, loadingError } from 'containers/App/actions';
import Spacing from 'components/Spacing';
import SelectAutocomplete from 'components/SelectAutocomplete';
import ButtonUI from '../PXK/Button';
import Group from '../PXK/Group';
import WrapperBusiness, { CODE, TYPE_FORM } from './Business';
import * as actions from './actions';
import * as selectors from './selectors';
import reducer from './reducer';
import saga from './saga';
import ExportedRetailTable from './Section2';
import BasketTrayTable from './Section3';
import { validationExportedRetail } from './schema';
import messages from '../PXK/messages';
import { STATUS_PXK, TYPE_PXK } from './constants';

let clearProps = null;
let isClearingManually = false;

const CustomClearIndicator = props => {
  const {
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;

  function customClearValue() {
    clearProps = props;
    isClearingManually = true;
  }

  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles('clearIndicator', props)}
    >
      <div style={{ padding: '0px 5px' }}>
        <CrossIcon onMouseDown={customClearValue} />
      </div>
    </div>
  );
};

class ExportedRetail extends React.PureComponent {
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

  // không cho phép đổi loại xuất kho
  handleChangeSubType = (event, formik) => {
    const {
      typeForm,
      onGetReceiver,
      onGetInitExportSell,
      onChangeSchema,
    } = this.props;
    formik.handleChange(event);
    onChangeSchema(event.target.value, formik);
    if ([TYPE_FORM.CREATE].includes(typeForm)) {
      if (event.target.value === TYPE_PXK.PXK_XDC_FARM) {
        onGetReceiver();
      } else if (event.target.value === TYPE_PXK.PXK_XUAT_BAN) {
        onGetInitExportSell();
      }
    }
  };

  handleChangeRetailRequestCode = (option, { action }) => {
    const { formik, onShowWarning } = this.props;

    if (action === SELECT_OPTION) {
      formik.setValues({
        ...formik.values,
        ...option,
      });
      this.getRequestDetails(option.retailRequestCode);
    } else if (action === CLEAR && isClearingManually) {
      isClearingManually = false;
      onShowWarning.confirm({
        message:
          'Xóa phiếu yêu cầu sẽ xóa hết thông thông sản phẩm và khách hàng. Bạn có chắc chắn muốn xóa?',
        title: 'Xác nhận',
        actions: [
          { text: 'Hủy', onClick: this.cancelClearValue },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: this.clearRetailRequestCode,
          },
        ],
      });
    }
  };

  cancelClearValue = () => {
    if (clearProps) {
      clearProps.setValue(clearProps.selectProps.value);
      clearProps = null;
    }
  };

  clearRetailRequestCode = () => {
    const { formik } = this.props;
    clearProps.clearValue();
    clearProps = null;

    formik.setValues({
      ...formik.values,
      retailRequestCode: null,
      customerCode: '',
      customerName: '',
      retailCustomerPhoneNumber: '',
      retailCustomerName: '',
      retailCustomerAddress: '',
      detailsCommands: [],
    });
  };

  changeDeliver = (e, formik) => {
    this.props.onGetWarehouses(e.value);
    // formik.handleChange(e);
    formik.setFieldValue('deliverCode', {
      value: e.value,
      label: e.label,
    });
    formik.setFieldValue('detailsCommands', []);
  };

  init = () => {
    const {
      location: { search },
      match: { params, path },
      history,
    } = this.props;
    // view/edit

    // 1.0. Tạo phiếu xuất kho có điều kiện, callback là tiền xử lý trước khi hiển thị theo từng loại xuất bán
    // 1.1 . Chi tiết/chỉnh sửa phiếu xuất kho,
    // 2. Tạo phiếu xuất kho thuần
    // 3. Case khác chuyển về trang danh sách
    if (search) {
      const urlParams = new URLSearchParams(search); // not support IE
      const type = urlParams.get('type'); // type pxk
      const form = urlParams.get('form'); // 1:create/2:edit/3:view
      const plantId = urlParams.get('plantId'); // mã đơn vị xuất hàng
      this.props.onGetPXKbyId(params.id, type, form, plantId);
    } else if (path.indexOf('tao-phieu-xuat-kho') > -1) {
      // this.props.onGetInitPXK();
    } else {
      history.push('/danh-sach-phieu-xuat-kho');
    }
  };

  componentDidMount() {
    const {
      onGetBusinessObject,
      onGetPaymentTypes,
      onGetPackingStyles,
      onGetRetailTypes,
      onUpdateReducer,
      onGetWarehouses,
      formik,
    } = this.props;
    this.init();
    onGetBusinessObject();
    onGetPaymentTypes();
    onGetPackingStyles();
    onGetRetailTypes();
    onGetWarehouses(formik.values.deliverCode.value);

    setTimeout(() => {
      onUpdateReducer({
        set: {
          validationSchema: validationExportedRetail,
        },
      });
    }, 1500);
  }

  // #region api calls

  getRetailCustomer = (inputText, callback) => {
    const {
      formik: {
        values: { customerCode },
      },
      onGetRetailCustomer,
    } = this.props;
    onGetRetailCustomer(inputText, callback, customerCode);
  };

  get = async (url, callback) => {
    try {
      const response = await request(
        url,
        optionReq({ method: METHOD_REQUEST.GET }),
      );

      // checkStatus(response);

      callback(response);
    } catch (err) {
      this.props.showError(err.message);
    }
  };

  debouncedSearchRetailRequestCode = debounce((inputValue, setOptions) => {
    const { values } = this.props.formik;

    const url = `${
      PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
    }/exported-retail-request/export-retail-request`;

    const params = {
      plantCode: values.deliverCode.value,
      date: toMidnightISOString(values.date),
      search: inputValue,
    };

    this.get(`${url}?${build(params)}`, response => {
      const data = response.data.map(item => ({
        id: item.id,
        value: item.retailRequestCode,
        label: item.retailRequestCode,
        retailRequestCode: item.retailRequestCode,
        businessObject: item.businessObject,
        businessObjectName: item.businessObjectName,
        // deliverCode: item.deliverCode,
        deliverCode: {
          label: item.deliverName,
          value: item.deliverCode,
        },
        deliverName: item.deliverName,
        customerCode: item.customerCode,
        customerName: item.customerName,
        customerRetailId: item.customerRetailId,
        retailCustomerPhoneNumber: item.retailCustomerPhoneNumber,
        retailCustomerAddress: item.retailCustomerAddress,
        date: item.date,
        paymentType: item.paymentType,
        paymentTypeName: item.paymentTypeName,
      }));

      setOptions(data);
    });
  }, SEARCH_DEBOUNCE_DELAY);

  getRequestDetails = async code => {
    const { formik } = this.props;

    const url = `${
      PATH_GATEWAY.BFF_SPA_API
    }/exported-retail-request/retail-request-for-exported`;

    try {
      const response = await request(
        `${url}?retailRequestCode=${code}`,
        optionReq({ method: METHOD_REQUEST.GET }),
      );

      // response.data.date = normalizeNonISODateString(response.data.date);
      formik.setValues({
        ...formik.values,
        ...response.data,
      });
    } catch (err) {
      this.props.showError(err.message);
    }
  };

  // #endregion

  goBack = formik => {
    const { form, onShowWarning, onGoBack } = this.props;
    const {
      values: {
        supervisorId,
        note,
        detailsCommands,
        customerCode,
        businessObject,
      },
    } = formik;
    if (
      form !== TYPE_FORM.VIEW &&
      (supervisorId ||
        customerCode ||
        businessObject ||
        note ||
        (detailsCommands && detailsCommands.length > 0))
    ) {
      onShowWarning.confirm({
        message: messages.GO_BACK,
        title: messages.NOT_SAVE_DATA,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => onGoBack(),
          },
        ],
      });
    } else {
      onGoBack();
    }
  };

  render() {
    const {
      formik,
      classes,
      onGetBasketMangagers,
      businessObjects,
      typeForm,
      saved,
      transporters,
      onGetCustomerCode,
      onGetUsers,
      paymentTypes,
      onShowWarning,
      form,
      onClickComplete,
      exportTypes,
      units,
    } = this.props;
    const isCreateView = form === TYPE_FORM.CREATE;

    return (
      <Grid
        container
        tabIndex="-1"
        className={classes.clearOutline}
        key={formik.values.documentCode}
      >
        <Grid container className={classes.spaceTop}>
          <Typography variant="h5" gutterBottom>
            {this.getTitle()} Phiếu Xuất Bán Xá
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
                        onChange={event =>
                          this.handleChangeSubType(event, formik)
                        }
                      >
                        {exportTypes.map(type => (
                          <MenuItem value={type.id} key={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  {/* <WrapperBusiness */}
                  {/* typeForm={typeForm} */}
                  {/* code={CODE.DELIVER_CODE} */}
                  {/* saved={saved} */}
                  {/* formik={formik} */}
                  {/* > */}
                  {/* {props => ( */}
                  {/* <Field */}
                  {/* name="deliverCode" */}
                  {/* label="Đơn Vị Xuất Hàng" */}
                  {/* component={SelectControl} */}
                  {/* disabled={!isCreateView || props.disabled} */}
                  {/* onChange={e => this.changeDeliver(e, formik)} */}
                  {/* > */}
                  {/* {units.map(type => ( */}
                  {/* <MenuItem value={type.id} key={type.id}> */}
                  {/* {type.name} */}
                  {/* </MenuItem> */}
                  {/* ))} */}
                  {/* </Field> */}
                  {/* )} */}
                  {/* </WrapperBusiness> */}
                  <WrapperBusiness
                    typeForm={typeForm}
                    code={CODE.DELIVER_CODE}
                    saved={saved}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="deliverCode"
                        label="Đơn Vị Xuất Hàng"
                        component={SelectAutocomplete}
                        options={units}
                        onChangeSelectAutoComplete={e =>
                          this.changeDeliver(e, formik)
                        }
                        isClearable={false}
                        disabled={!isCreateView || props.disabled}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="businessObject"
                        label="Đối Tượng Bán Hàng"
                        component={SelectControl}
                        disabled={props.disabled}
                        onChange={formik.handleChange}
                        required
                      >
                        {businessObjects.map(type => (
                          <MenuItem value={type.id} key={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="paymentType"
                        label="Hình Thức Thanh Toán"
                        component={SelectControl}
                        onChange={formik.handleChange}
                        disabled={props.disabled}
                        required
                      >
                        {paymentTypes.map(paymentType => (
                          <MenuItem key={paymentType.id} value={paymentType.id}>
                            {paymentType.name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="isCreateDeliveryOrder"
                        label="Tạo Biên Bản Giao Nhận Hàng Hóa"
                        component={CheckboxControl}
                        disabled={props.disabled}
                        labelPlacement="end"
                        handleCheckbox={formik.handleChange}
                      />
                    )}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="retailRequestCode"
                        textFieldProps={{
                          label: 'Phiếu Yêu Cầu Bán Xá',
                          InputLabelProps: {
                            shrink: true,
                          },
                        }}
                        defaultValue={
                          formik.values.retailRequestCode && {
                            label: formik.values.retailRequestCode,
                            value: formik.values.retailRequestCode,
                          }
                        }
                        isClearable
                        component={InputControl}
                        components={{ ClearIndicator: CustomClearIndicator }}
                        onInputChange={this.handleChangeRetailRequestCode}
                        promiseOptions={this.debouncedSearchRetailRequestCode}
                        autoComplete
                        disabled={
                          formik.values.status === STATUS_PXK.COMPLETE ||
                          props.disabled
                        }
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        key={formik.values.customerName}
                        disabled={props.disabled}
                        name="customerName"
                        textFieldProps={{
                          label: 'Đơn Vị Nhận Hàng',
                          InputLabelProps: {
                            shrink: true,
                          },
                          required: true,
                        }}
                        component={InputControl}
                        defaultValue={
                          formik.values.customerCode && {
                            label: formik.values.customerName,
                            value: formik.values.customerCode,
                          }
                        }
                        promiseOptions={onGetCustomerCode}
                        onInputChange={option => {
                          formik.setValues({
                            ...formik.values,
                            ...{
                              customerCode: option.value,
                              customerName: option.label,
                            },
                          });
                        }}
                        autoComplete
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
                        name="retailCustomerPhoneNumber"
                        label="Số Điện Thoại"
                        textFieldProps={{
                          InputLabelProps: {
                            shrink: true,
                          },
                        }}
                        component={InputSuggestControl}
                        promiseOptions={this.getRetailCustomer}
                        placeholder={formik.values.retailCustomerPhoneNumber}
                        onInputChange={option => {
                          const newValue = {
                            retailCustomerPhoneNumber:
                              option.retailCustomerPhoneNumber,
                          };
                          if (option.fullName)
                            newValue.retailCustomerName = option.fullName;
                          if (option.address)
                            newValue.retailCustomerAddress = option.address;
                          if (option.id) {
                            newValue.retailCustomerId = option.id;
                          } else {
                            newValue.retailCustomerId = null;
                          }
                          formik.setValues({
                            ...formik.values,
                            ...newValue,
                          });
                        }}
                        autoComplete
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
                        name="retailCustomerName"
                        label="Tên Khách Hàng"
                        component={InputControl}
                        onChange={formik.handleChange}
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
                        name="retailCustomerAddress"
                        label="Địa Chỉ"
                        component={InputControl}
                        multiline
                        onChange={formik.handleChange}
                      />
                    )}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="date"
                        label="Thời Gian Lập Phiếu"
                        component={PickersControl}
                        autoOk
                        disabled={props.disabled}
                        required
                        isDateTimePicker={false}
                        format="dd/MM/yyyy"
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="supervisorName"
                        disabled={props.disabled}
                        textFieldProps={{
                          label: 'Nhân Viên Giám Sát',
                          InputLabelProps: {
                            shrink: true,
                          },
                          required: true,
                        }}
                        component={InputControl}
                        promiseOptions={onGetUsers}
                        placeholder={formik.values.supervisorName}
                        onInputChange={option => {
                          formik.setValues({
                            ...formik.values,
                            ...{
                              supervisorId: option.value,
                            },
                          });
                        }}
                        autoComplete
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="supervisorName2"
                        disabled={props.disabled}
                        textFieldProps={{
                          label: 'Nhân Viên Giám Sát 2',
                          InputLabelProps: {
                            shrink: true,
                          },
                        }}
                        component={InputControl}
                        promiseOptions={onGetUsers}
                        placeholder={formik.values.supervisorName2}
                        onInputChange={option => {
                          formik.setValues({
                            ...formik.values,
                            ...{
                              supervisorId2: option.value,
                            },
                          });
                        }}
                        autoComplete
                      />
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        name="note"
                        disabled={props.disabled}
                        label="Ghi Chú"
                        component={InputControl}
                        multiline
                        onChange={formik.handleChange}
                      />
                    )}
                  </WrapperBusiness>
                </Group>
                <Group classes={classes}>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
                        name="transporterCode"
                        label="Nhà Vận Chuyển"
                        component={SelectControl}
                        onChange={formik.handleChange}
                      >
                        {transporters.map(transporter => (
                          <MenuItem key={transporter.id} value={transporter.id}>
                            {transporter.name}
                          </MenuItem>
                        ))}
                      </Field>
                    )}
                  </WrapperBusiness>
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
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
                  <WrapperBusiness
                    code={CODE.DISABLE_ON_VIEW}
                    typeForm={form}
                    formik={formik}
                  >
                    {props => (
                      <Field
                        disabled={props.disabled}
                        name="userName"
                        textFieldProps={{
                          label: 'Nhân Viên Cân Hàng',
                          InputLabelProps: {
                            shrink: true,
                          },
                          required: true,
                        }}
                        placeholder={formik.values.userName}
                        component={InputControl}
                        promiseOptions={onGetUsers}
                        onInputChange={option => {
                          formik.setValues({
                            ...formik.values,
                            ...{
                              userId: option.value,
                              userPhone: option.phone,
                              userEmail: option.email,
                            },
                          });
                        }}
                        autoComplete
                        // disabled={props.disabled}
                      />
                    )}
                  </WrapperBusiness>
                  <Field
                    name="userPhone"
                    label="Điện Thoại"
                    disabled
                    component={InputControl}
                  />
                  <Field
                    name="userEmail"
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
                      onClick={() => this.goBack(formik)}
                      title="Quay Lại"
                      style={classes.secondary}
                    />

                    <ButtonUI
                      color="primary"
                      onClick={() => {
                        formik.handleSubmitClick();
                      }}
                      title="Lưu"
                      style={classes.primary}
                      disabled={formik.isSubmitting}
                    />
                  </Grid>
                </WrapperBusiness>
              </Grid>
            }
          />
          <Grid container className={classes.spaceTop} />
          <WrapperBusiness
            formik={formik}
            saved={saved}
            code={CODE.TABLE}
            typeForm={form}
          >
            {() => (
              <React.Fragment>
                <ExportedRetailTable {...this.props} />
                <Grid item md={6} className={classes.spaceTop}>
                  <BasketTrayTable {...this.props} />
                </Grid>
              </React.Fragment>
            )}
          </WrapperBusiness>
          <WrapperBusiness
            formik={formik}
            saved={saved}
            code={CODE.GROUP_BUTTONS}
            typeForm={form}
          >
            {propsGroup => (
              <Grid
                container
                justify="flex-end"
                tabIndex="-1"
                style={{ outline: 0 }}
              >
                <ButtonUI
                  type="button"
                  onClick={() => this.goBack(formik)}
                  title="Quay Lại"
                  style={classes.secondary}
                />

                {!propsGroup.isCompletePxk ? (
                  <React.Fragment>
                    <WrapperBusiness
                      typeForm={form}
                      code={CODE.SAVE_TABLE}
                      formik={formik}
                    >
                      {props => (
                        <ButtonUI
                          color="primary"
                          type="button"
                          onClick={e => {
                            if (props.rowsIsDublicated) {
                              onShowWarning.dublicate(props.dupicatedMessage);
                            } else {
                              onClickComplete(false, formik, () =>
                                formik.handleSubmitClick(e),
                              );
                            }
                          }}
                          title="Lưu"
                          style={classes.primary}
                          disabled={formik.isSubmitting || props.disabled}
                        />
                      )}
                    </WrapperBusiness>
                    <WrapperBusiness
                      code={CODE.COMPLETE_TABLE}
                      formik={formik}
                      typeForm={form}
                    >
                      {props => (
                        <CompleteButton
                          color="primary"
                          onClick={() =>
                            onClickComplete(
                              true,
                              formik,
                              formik.handleSubmitClick,
                            )
                          }
                          text="Hoàn Thành"
                          disabled={formik.isSubmitting || props.disabled}
                        />
                      )}
                    </WrapperBusiness>
                    <Spacing height={10} />
                  </React.Fragment>
                ) : null}
              </Grid>
            )}
          </WrapperBusiness>
        </Grid>
      </Grid>
    );
  }
}

ExportedRetail.propTypes = {
  formik: PropTypes.object,
  classes: PropTypes.object,
  onGoBack: PropTypes.func,
  initDatas: PropTypes.object,
  typeForm: PropTypes.string,
  saved: PropTypes.bool,
  // api
  onGetWarehouses: PropTypes.func,
  onGetListRequest: PropTypes.func,
  onGetInitExportSell: PropTypes.func,
  onGetReceiver: PropTypes.func,
  onChangeSchema: PropTypes.func,
  transporters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // ------------------------------------------
  onGetBasketMangagers: PropTypes.func,
  onGetCustomerCode: PropTypes.func,
  onGetRetailCustomer: PropTypes.func,
  onGetUsers: PropTypes.func,
  onGetBusinessObject: PropTypes.func,
  onGetPaymentTypes: PropTypes.func,
  onGetPackingStyles: PropTypes.func,
  onGetRetailTypes: PropTypes.func,
  paymentTypes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  businessObjects: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onShowWarning: PropTypes.object,
  showError: PropTypes.func,
  onAlertInvalidWhenSubmit: PropTypes.func,
  form: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetInitPXK: callback => dispatch(actions.getInitPXK(callback)),
    onGetPXKbyId: (id, type, form, plantId) =>
      dispatch(actions.getPXKbyId({ id, type, form, plantId })),
    showError: message => dispatch(loadingError(message)),
    onGetWarehouses: plantId => dispatch(actions.getWarehouses(plantId)),
    onGetUsers: (inputText, callback) =>
      dispatch(actions.getUsers(inputText, callback)),
    onGetBasketMangagers: (inputText, callback) =>
      dispatch(actions.onGetBasketMangagers(inputText, callback)),
    onGetCustomerCode: (inputText, callback) =>
      dispatch(actions.getCustomerCode(inputText, callback)),
    onGetRetailCustomer: (inputText, callback, soldTo) =>
      dispatch(actions.getRetailCustomer(inputText, callback, soldTo)),
    onGetBusinessObject: () => dispatch(actions.getBusinessObject()),
    onGetPaymentTypes: () => dispatch(actions.getPaymentTypes()),
    onGetPackingStyles: () => dispatch(actions.getPackingStypes()),
    onGetRetailTypes: () => dispatch(actions.getRetailTypes()),
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
  };
}
const mapStateToProps = createStructuredSelector({
  businessObjects: selectors.makeSelectData('businessObjects'),
  paymentTypes: selectors.makeSelectData('paymentTypes'),
  exportTypes: selectors.makeSelectData('exportTypes'),
  units: selectors.makeSelectData('units'),
  transporters: selectors.makeSelectData('transporters'),
  warehouse: selectors.makeSelectData('warehouse'),
  packingStyles: selectors.makeSelectData('packingStyles'),
  retailTypes: selectors.makeSelectData('retailTypes'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'ExportedRetail', reducer });
const withSaga = injectSaga({ key: 'ExportedRetail', saga });
export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExportedRetail);
