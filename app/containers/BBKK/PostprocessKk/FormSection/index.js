import React from 'react';
import * as PropTypes from 'prop-types';
import { Grid, withStyles } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import Expansion from 'components/Expansion';

import { Field, Form } from 'formik';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import SelectControl from 'components/SelectControl';
import MenuItem from '@material-ui/core/MenuItem';
import DatePickerControl from 'components/PickersControl';
import { formDataSelector, formOptionSelector } from '../selectors';
import { TYPE_PROCESS } from '../constants';

// eslint-disable-next-line react/prefer-stateless-function
class FormSection extends React.Component {
  makeFormAttr = pr => ({
    typeProcess: {
      name: 'typeProcess',
      label: 'Xử Lý Sau Kiểm Kê',
      value: pr.values.typeProcess,
      component: SelectControl,
      searchable: true,
      placeholder: 'Lựa Chọn Xử Lý',
      onChange: event => {
        this.props.showConfirm({
          title: 'Xác nhận thay đổi Xử Lý Sau Kiểm Kê',
          message:
            'Nếu bạn thay đổi Xử Lý Sau Kiểm Kê thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
          actions: [
            {
              text: 'Hủy',
            },
            {
              text: 'Đồng ý',
              color: 'primary',
              onClick: () => {
                pr.handleChange(event);
                this.props.changeData({
                  data: event.target.value,
                  field: 'typeProcess',
                });
                const data = {
                  hasData: true,
                  isDeliver: true,
                  typeProcess: event.target.value,
                };

                if (event.target.value === TYPE_PROCESS.INTERNAL) {
                  if (this.props.formData.deliverBasketStocktakingCode) {
                    this.props.getBasketDetail({
                      value: this.props.formData.deliverBasketStocktakingCode
                        .value,
                      ...data,
                    });
                  }
                }

                if (event.target.value === TYPE_PROCESS.PLANT) {
                  if (this.props.formData.deliverBasketStocktakingCode) {
                    this.props.getBasketDetail({
                      value: this.props.formData.deliverBasketStocktakingCode
                        .value,
                      ...data,
                    });
                  }
                }
              },
            },
          ],
        });
      },
      children: this.props.formOption.typeProcess.map(item => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      )),
    },
    deliver: {
      name: 'deliver',
      label: 'Đơn Vị Xuất Hàng',
      required: true,
      value: pr.values.deliver,
      component: SelectAutocomplete,
      searchable: true,
      placeholder: 'Lựa Chọn Đơn vị Xuất Hàng',
      options: this.props.formOption.plants,
      isClearable: false,
      onChangeSelectAutoComplete: selected => {
        if (pr.values.typeProcess === 1) {
          if (selected.value === pr.values.receiver.value) {
            this.props.onShowWarning(
              'Đơn Vị Xuất Hàng không đươc trùng với Đơn Vị Nhận Hàng',
            );
            return false;
          }
        }
        this.props.showConfirm({
          title: 'Xác nhận thay đổi Đơn Vị Xuất Hàng',
          message:
            'Nếu bạn thay đổi Đơn Vị Xuất Hàng thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
          actions: [
            {
              text: 'Hủy',
            },
            {
              text: 'Đồng ý',
              color: 'primary',
              onClick: () => {
                this.props.changeData({
                  data: selected,
                  field: 'deliver',
                });
                this.props.getDeliveryOrder(
                  true,
                  'deliverBasketStocktakingCode',
                  selected.value,
                );
              },
            },
          ],
        });
        return true;
      },
    },
    receiver: {
      name: 'receiver',
      label: 'Đơn Vị Nhận Hàng',
      required: true,
      value: pr.values.receiver,
      component: SelectAutocomplete,
      searchable: true,
      placeholder: 'Lựa Chọn Đơn Vị Nhận Hàng',
      options: this.props.formOption.plants,
      onChangeSelectAutoComplete: selected => {
        if (pr.values.typeProcess === 1) {
          if (selected.value === pr.values.deliver.value) {
            this.props.onShowWarning(
              'Đơn Vị Nhận Hàng không đươc trùng với Đơn Vị Xuất Hàng',
            );
            return false;
          }
        }

        this.props.showConfirm({
          title: 'Xác nhận thay đổi Đơn Vị Nhận Hàng',
          message:
            'Nếu bạn thay đổi Đơn Vị Nhận Hàng thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
          actions: [
            {
              text: 'Hủy',
            },
            {
              text: 'Đồng ý',
              color: 'primary',
              onClick: () => {
                this.props.changeData({
                  data: selected,
                  field: 'receiver',
                });
                this.props.getDeliveryOrder(
                  false,
                  'receiverBasketStocktakingCode',
                  selected.value,
                );
                // const option = this.props.formData.deliverBasketStocktakingCode;
                // if (option) {
                //   this.props.getBasketDetail({
                //     ...option,
                //     hasData: true,
                //     isDeliver: true,
                //     typeProcess: this.props.formData.typeProcess,
                //   });
                // }
              },
            },
          ],
        });
        return true;
      },
    },
    date: {
      name: 'date',
      label: 'Thời Gian Điều Chỉnh',
      component: DatePickerControl,
      isDateTimePicker: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      required: true,
      clearable: false,
      onChange: selected => {
        this.props.showConfirm({
          title: 'Xác nhận thay đổi Ngày Điều Chỉnh',
          message:
            'Nếu bạn thay đổi Ngày Điều Chỉnh thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
          actions: [
            {
              text: 'Hủy',
            },
            {
              text: 'Đồng ý',
              color: 'primary',
              onClick: () => {
                this.props.changeData({
                  data: selected,
                  field: 'date',
                });
                if (pr.values.typeProcess === 1) {
                  this.props.getDeliveryOrder(
                    true,
                    'deliverBasketStocktakingCode',
                    pr.values.deliver.value,
                    selected,
                    () => {
                      if (pr.values.receiver) {
                        this.props.getDeliveryOrder(
                          false,
                          'receiverBasketStocktakingCode',
                          pr.values.receiver.value,
                          selected,
                        );
                      }
                    },
                  );
                } else {
                  this.props.getDeliveryOrder(
                    true,
                    'deliverBasketStocktakingCode',
                    pr.values.deliver.value,
                    selected,
                  );
                }
              },
            },
          ],
        });
      },
    },
    adjustmentUser: {
      name: 'adjustmentUser',
      label: 'Người Điều Chỉnh',
      component: SelectAutocomplete,
      value: pr.values.adjustmentUser,
      placeholder: 'Lựa Chọn Người Điều Chỉnh',
      searchable: true,
      disabled: true,
      required: true,
      options: this.props.formOption.users,
      onChangeSelectAutoComplete: selected => {
        this.props.changeData({
          data: selected,
          field: 'adjustmentUser',
        });
      },
    },
  });

  render() {
    const { formik, classes, formData } = this.props;
    const formAttr = this.makeFormAttr(formik);
    return (
      <Grid className={classes.info}>
        <Expansion
          title="I. Thông Tin Chung"
          content={
            <Form>
              <Grid container spacing={24}>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.typeProcess} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.date} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.deliver} />
                    </Grid>
                    {formData.typeProcess === 1 && (
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.receiver} />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.adjustmentUser} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          }
        />
      </Grid>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  formOption: PropTypes.object,
  formData: PropTypes.object,
  changeData: PropTypes.func,
  showConfirm: PropTypes.func,
  onShowWarning: PropTypes.func,
  getBasketDetail: PropTypes.func,
  getDeliveryOrder: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  formOption: formOptionSelector(),
  formData: formDataSelector(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(withStyles()(withImmutablePropsToJS(FormSection)));
