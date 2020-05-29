import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

import { Field } from 'formik/dist/index';
import { MenuItem, Grid, withStyles } from '@material-ui/core';

import { SEARCH_DEBOUNCE_DELAY } from 'utils/constants';
import { PATH_GATEWAY } from 'utils/request';
import { build } from 'utils/querystring';
import { isValidProductList } from 'utils/validation';

import appTheme from 'containers/App/theme';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import InputSuggestControl from 'components/InputSuggestControl';
import SelectControl from 'components/SelectControl';
import DatePickerControl from 'components/DatePickerControl';
import {
  // makeSelectUserIdLogin,
  makeSelectFullName,
} from 'containers/App/selectors';
import { CODE } from 'authorize/groupAuthorize';

import {
  GET_USERS_API,
  GET_CUSTOMERS_API,
  GET_RETAIL_CUSTOMERS_API,
  NOT_APPROVED,
} from './constants';
import { get, makeConfirmationOption, hasProperties } from './utils';
import {
  CHANGE_DELIVERY_CODE_CONFIRMATION,
  CONFIRMATION_TITLE,
} from './messages';

const style = (theme = appTheme) => ({
  approverLevel: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1.5,
    right: 0,
    background: theme.palette.background.default,
    padding: '.25rem 0.5rem',
    color: theme.palette.primary.main,
  },
  relative: {
    position: 'relative',
  },
});

let cacheEvent = null;

class GeneralInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      divisions: [], // suppliers
    };

    // this.getInitRetailRequest();
    this.getDivisionsByUser();
    if (props.isCreatePage) {
      props.resetForm();
    }
  }

  // ***************************************
  // #region api requests

  // getInitRetailRequest = async () => {
  //   get(
  //     `${
  //       PATH_GATEWAY.BFF_SPA_API
  //     }/exported-retail-request/init-create-retail-request`,
  //     response => {
  //       this.setState({
  //         statusData: response.data.exportedRetailRequestStatus,
  //         businessObjectData: response.data.businessObject,
  //         paymentTypeData: response.data.paymentType,
  //       });
  //     },
  //   );
  // };

  getDivisionsByUser = async () => {
    const { userId, formik } = this.props;
    get(
      `${
        PATH_GATEWAY.AUTHORIZATION_API
      }/organizations/get-by-user?userId=${userId}`,
      response => {
        this.setState({
          divisions: response.data,
        });

        if (!formik.values.deliverCode) {
          formik.setFieldValue('deliverCode', response.data[0].value);
        }
      },
    );
  };

  debouncedSearchCustomer = debounce((inputValue, setOptions) => {
    const url = `${GET_CUSTOMERS_API}?filter=${inputValue}`;

    get(url, response => {
      const data = response.data.map(item => ({
        value: item.customerCode,
        label: item.customerName,
      }));

      setOptions(data);
    });
  }, SEARCH_DEBOUNCE_DELAY);

  debouncedSearchRetailCustomer = debounce((inputValue, setOptions) => {
    const query = {
      soldTo: this.props.formik.values.customerCode || '',
      search: inputValue,
    };
    const url = `${GET_RETAIL_CUSTOMERS_API}?${build(query)}`;

    get(url, response => {
      const data = response.data.map(item => ({
        id: item.id,
        value: item.phoneNumer,
        label: item.phoneNumer,
        fullName: item.fullName,
        phoneNumber: item.phoneNumer,
        retailCustomerPhoneNumber: item.phoneNumer,
        address: item.address,
      }));

      setOptions(data);
    });
  }, SEARCH_DEBOUNCE_DELAY);

  debouncedSearchUser = debounce((inputValue, setOptions) => {
    const url = `${GET_USERS_API}?filterName=${inputValue}`;

    get(url, response => {
      const data = response.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      }));

      setOptions(data);
    });
  }, SEARCH_DEBOUNCE_DELAY);

  debouncedSearchRequester = debounce((inputValue, setOptions) => {
    const url = `${
      PATH_GATEWAY.BFF_SPA_API
    }/user/get-by-privilege?privilegeCode=${
      CODE.xemApproverList
    }&filterName=${inputValue}`;

    get(url, response => {
      const data = response.data.map(item => ({
        value: item.Id,
        label: `${item.lastName} ${item.firstName}`,
      }));

      setOptions(data);
    });
  }, SEARCH_DEBOUNCE_DELAY);
  // #endregion

  // ***************************************
  // #region handle field changes

  handleChangeDeliveryCode = ev => {
    const { formik } = this.props;

    if (isValidProductList(formik.values.detailsCommands)) {
      ev.persist();
      cacheEvent = ev;
      this.showConfirmChangingDeveliverCode();
    } else {
      formik.handleChange(ev);
    }
  };

  showConfirmChangingDeveliverCode = () => {
    const { formik } = this.props;
    this.props.showConfirmation(
      makeConfirmationOption(
        CHANGE_DELIVERY_CODE_CONFIRMATION,
        () => {
          formik.resetForm();
          formik.handleChange(cacheEvent);
          cacheEvent = null;
        },
        CONFIRMATION_TITLE,
      ),
    );
  };

  handleChangeCustomerCode = option => {
    this.props.formik.updateValues({
      customerCode: option.value,
      customerName: option.label,
    });
  };

  onSelectChangePhoneNumber = option => {
    const { formik } = this.props;

    if (hasProperties(option, 1)) {
      // click clearValue
      formik.setFieldValue(
        'retailCustomerPhoneNumber',
        option.retailCustomerPhoneNumber,
      );
    } else {
      // choosing an option
      formik.updateValues({
        retailCustomerId: option.id,
        retailCustomerPhoneNumber: option.phoneNumber,
        retailCustomerName: option.fullName,
        retailCustomerAddress: option.address,
      });
    }
  };

  changeUserId = option => {
    this.props.formik.setFieldValue('userId', option.value);
  };

  changeApprover1 = option => {
    this.props.formik.setFieldValue('approverLevel1', option.value);
  };

  changeApprover2 = option => {
    if (option) {
      this.props.formik.setFieldValue('approverLevel2', option.value);
    } else {
      this.props.formik.setFieldValue('approverLevel2', option);
    }
  };

  // #endregion

  render() {
    const {
      classes,
      isCreatePage,
      isEditPage,
      isEditableStatus,
      formik,

      statusData,
      businessObjectData,
      paymentTypeData,

      userName,
    } = this.props;
    const {
      // defaultPhoneNumber,
      divisions,
      // customers,
    } = this.state;

    const isAllowedChangingStatus =
      isEditPage && formik.values.status === NOT_APPROVED;

    return (
      <div style={{ marginBottom: '1rem' }}>
        <Expansion
          title="I. Thông tin yêu cầu"
          content={
            <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
              {/* Id */}
              <Grid item xs={6} md={3}>
                <Field
                  name="retailRequestCode"
                  label="Mã PYCBX"
                  value={formik.values.retailRequestCode}
                  onChange={formik.handleChange}
                  component={InputControl}
                  disabled
                  style={isCreatePage ? { display: 'none' } : {}}
                />
                <div className={classes.relative}>
                  <Field
                    name="status"
                    label="Trạng thái"
                    onChange={formik.handleChange}
                    component={SelectControl}
                    disabled={!isAllowedChangingStatus}
                  >
                    {statusData.map(mapDataToMenuItem)}
                  </Field>
                </div>

                <Field
                  name="deliverCode"
                  label="Đơn vị xuất hàng"
                  onChange={this.handleChangeDeliveryCode}
                  component={SelectControl}
                  disabled={!isCreatePage || !isEditableStatus}
                  required
                >
                  {divisions.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  name="businessObject"
                  label="Đối tượng bán hàng"
                  onChange={formik.handleChange}
                  component={SelectControl}
                  disabled={!isEditableStatus}
                >
                  {businessObjectData.map(mapDataToMenuItem)}
                </Field>
              </Grid>

              <Grid item xs={6} md={3}>
                <Field
                  name="customerName"
                  textFieldProps={{
                    label: 'Đơn vị nhận hàng',
                    InputLabelProps: { shrink: true },
                    required: true,
                  }}
                  component={InputControl}
                  defaultValue={{
                    label: formik.values.customerName,
                    value: formik.values.customerCode,
                  }}
                  onInputChange={this.handleChangeCustomerCode}
                  promiseOptions={this.debouncedSearchCustomer}
                  autoComplete
                  disabled={!isEditableStatus}
                />

                <Field
                  name="retailCustomerPhoneNumber"
                  label="Số điện thoại"
                  textFieldProps={{
                    InputLabelProps: { shrink: true },
                    label: 'Số điện thoại',
                  }}
                  component={InputSuggestControl}
                  defaultValue={{
                    label: formik.values.retailCustomerPhoneNumber,
                    value: formik.values.retailCustomerId,
                  }}
                  autoComplete
                  onInputChange={this.onSelectChangePhoneNumber}
                  promiseOptions={this.debouncedSearchRetailCustomer}
                  disabled={!isEditableStatus}
                />

                <Field
                  name="retailCustomerName"
                  label="Tên khách hàng"
                  value={formik.values.retailCustomerName}
                  onChange={formik.handleChange}
                  component={InputControl}
                  disabled={!isEditableStatus}
                />

                <Field
                  name="retailCustomerAddress"
                  label="Địa chỉ"
                  value={formik.values.retailCustomerAddress}
                  onChange={formik.handleChange}
                  component={InputControl}
                  disabled={!isEditableStatus}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <Field
                  name="retailRequestCreateDate"
                  label="Ngày tạo phiếu"
                  component={DatePickerControl}
                  disabled
                />
                <Field
                  name="userName"
                  textFieldProps={{
                    label: 'Người yêu cầu',
                    InputLabelProps: { shrink: true },
                    required: true,
                  }}
                  component={InputControl}
                  placeholder="Tìm và chọn người yêu cầu"
                  defaultValue={{
                    label: formik.values.userName || userName,
                    value: formik.values.userName || userName,
                  }}
                  onInputChange={this.changeUserId}
                  promiseOptions={this.debouncedSearchUser}
                  autoComplete
                  disabled={!isEditableStatus}
                />
                <Field
                  name="approverLevelName1"
                  textFieldProps={{
                    label: 'Người phê duyệt cấp 1',
                    InputLabelProps: { shrink: true },
                    required: true,
                  }}
                  component={InputControl}
                  defaultValue={{
                    label: formik.values.approverLevelName1,
                    value: formik.values.approverLevel1,
                  }}
                  onInputChange={this.changeApprover1}
                  promiseOptions={this.debouncedSearchRequester}
                  autoComplete
                  disabled={!isEditableStatus}
                />
                <Field
                  name="approverLevelName2"
                  textFieldProps={{
                    label: 'Người phê duyệt cấp 2',
                    InputLabelProps: { shrink: true },
                  }}
                  isClearable
                  component={InputControl}
                  defaultValue={{
                    label: formik.values.approverLevelName2,
                    value: formik.values.approverLevel2,
                  }}
                  onInputChange={this.changeApprover2}
                  promiseOptions={this.debouncedSearchRequester}
                  autoComplete
                  disabled={!isEditableStatus}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <Field
                  name="date"
                  label="Ngày giao hàng"
                  component={DatePickerControl}
                  disabled={!isEditableStatus}
                  clearable={false}
                  required
                />
                <Field
                  name="paymentType"
                  label="Hình thức thanh toán"
                  value={formik.values.paymentType}
                  onChange={formik.handleChange}
                  component={SelectControl}
                  disabled={!isEditableStatus}
                >
                  {paymentTypeData.map(mapDataToMenuItem)}
                </Field>
                <Field
                  name="note"
                  label="Ghi chú"
                  onChange={formik.handleChange}
                  component={InputControl}
                  multiline
                  disabled={!isEditableStatus}
                />
              </Grid>
            </Grid>
          }
        />
      </div>
    );
  }
}

GeneralInfo.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  isCreatePage: PropTypes.bool,
  isEditPage: PropTypes.bool,
  // isViewPage: PropTypes.bool,
  isEditableStatus: PropTypes.bool,

  statusData: PropTypes.array,
  businessObjectData: PropTypes.array,
  paymentTypeData: PropTypes.array,

  userName: PropTypes.string,
  userId: PropTypes.string,

  showConfirmation: PropTypes.func,
  resetForm: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  // userId: makeSelectUserIdLogin(),
  userName: makeSelectFullName(),
});

// function mapDispatchToProps(dispatch) {
//   return {
//     resetForm: () => dispatch(resetForm()),
//   };
// }

const withConnect = connect(
  mapStateToProps,
  null,
);

// ***************************************
// private
function mapDataToMenuItem(item) {
  return (
    <MenuItem key={item.id} value={item.id}>
      {item.name}
    </MenuItem>
  );
}

export default compose(
  withConnect,
  withStyles(style()),
)(GeneralInfo);
