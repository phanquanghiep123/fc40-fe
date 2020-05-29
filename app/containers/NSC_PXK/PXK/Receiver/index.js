import React from 'react';
import { Field } from 'formik';
import InputControl from 'components/InputControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { TYPE_PXK } from '../constants';
import { setDefaultSellTypeAndChannel } from '../utils';

export default class Receiver extends React.Component {
  onChangeReceiver = e => {
    const {
      formik,
      formik: {
        values: { subType },
      },
      resetDeli,
    } = this.props;
    // formik.handleChange(e);
    formik.setFieldValue('receiverCode', e);
    formik.setFieldValue('receiverName', e.label);
    if (subType === TYPE_PXK.PXK_XDC_FARM) {
      resetDeli();
    }
  };

  onChangeCustomer = option => {
    const { formik } = this.props;
    // getChannel(option.value);
    formik.setFieldValue('customerCode', option.value);
    formik.setFieldValue('customerGroup', option.group);
    formik.setFieldValue('customerName', option.name);
    // xóa sản phẩm chưa lưu vào db và load lại deli
    if (formik.values.isDelivery) {
      this.props.getDataFromDeli(null, option.value, null);
    }
    setDefaultSellTypeAndChannel(
      option.group,
      formik.values.isDelivery,
      formik,
    );
  };

  // renderChildren = () => {
  //   const receivers = this.props.receiverUnits;
  //   return receivers.map(type => (
  //     <MenuItem value={type.id} key={type.id}>
  //       {type.name}
  //     </MenuItem>
  //   ));
  // };

  formAttr = () => {
    const {
      onGetCustomer,
      formik,
      formik: {
        values: { subType },
      },
    } = this.props;
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return {
        name: 'fullName',
        textFieldProps: {
          label: 'Khách Hàng',
          InputLabelProps: {
            shrink: true,
          },
          required: true,
        },
        component: InputControl,
        disabled: this.props.disabled,
        autoComplete: true,
        promiseOptions: onGetCustomer,
        onInputChange: this.onChangeCustomer,
        placeholder: formik.values.fullName,
      };
    }
    return {
      name: 'receiverCode',
      label: 'Đơn Vị Nhận Hàng',
      component: SelectAutocomplete,
      // onChange: this.onChangeReceiver,
      onChangeSelectAutoComplete: this.onChangeReceiver,
      disabled: this.props.disabled,
      // children: this.renderChildren(),
      options: this.props.receiverUnits,
      isClearable: false,
      placeholder: 'Lựa Chọn Đơn Vị Nhận Hàng',
    };
  };

  render() {
    return <Field {...this.formAttr()} />;
  }
}
