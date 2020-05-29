import React from 'react';
import { Button, Grid } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/DatePickerControl';
import { Field, Form } from 'formik/dist/index';
import Expansion from 'components/Expansion';
import ConfirmationDialog from 'components/ConfirmationDialog';

const currentDate = new Date();

// eslint-disable-next-line react/prefer-stateless-function
export default class FormCreate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.makeFormAttr = this.makeFormAttr.bind(this);
  }

  isCreate = () => true;

  isEdit = () => false;

  isView = () => false;

  makeFormAttr = () => {
    const pr = this.props.formik;
    let autoCompleteTimer;
    const {
      onGetDeliveryOrder,
      onChangeDelivery,
      dataValues,
      onChangeUser,
      onGetPlants,
      typeExported,
    } = this.props;
    const recieverCode = dataValues.receiver ? dataValues.receiver.value : '';
    return {
      deliver: {
        name: 'deliver',
        label: 'Bên Giao Hàng',
        component: SelectAutocomplete,
        value: pr.values.deliver,
        placeholder: 'Lựa chọn Bên giao hàng',
        searchable: true,
        required: true,
        onChangeSelectAutoComplete: selected => {
          if (
            dataValues.deliver ||
            // selected.value !== dataValues.receiver.value ||
            !selected.value
          ) {
            this.onConfirmShow({
              title: 'Cảnh báo',
              message:
                'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhâp sẽ không được lưu!' +
                'Bạn vẫn muốn thay đổi?',
              actions: [
                { text: 'Bỏ qua' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: () => {
                    this.props.onResetBasketsDetail();
                    this.props.onChangeField({
                      field: 'deliver',
                      value: selected,
                    });
                  },
                },
              ],
            });
          } else
            this.props.onChangeField({
              field: 'deliver',
              value: selected,
            });
        },
        options: this.props.formOption.orgs,
        disabled: this.isView() || (this.isEdit() && this.isDisable()),
      },
      subType: {
        name: 'subType',
        label: 'Loại Xuất Kho',
        component: SelectAutocomplete,
        placeholder: 'Lựa chọn loại xuất kho',
        value: pr.values.subType,
        options: this.props.formOption.subTypes,
        onChangeSelectAutoComplete: option => {
          if (option.value !== dataValues.subType.value) {
            this.onConfirmShow({
              title: 'Cảnh báo',
              message:
                'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhâp sẽ không được lưu!' +
                'Bạn vẫn muốn thay đổi?',
              actions: [
                { text: 'Bỏ qua' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: () => {
                    this.props.onResetBasketsDetail();
                    this.props.onChangeType(option);
                  },
                },
              ],
            });
          } else this.props.onChangeType(option);
        },
        required: true,
        disabled: this.isView() || (this.isEdit() && this.isDisable()),
      },
      receiver: {
        name: 'receiver',
        label: 'Bên Nhận Hàng',
        component: SelectAutocomplete,
        value: pr.values.receiver,
        placeholder: 'Lựa chọn Bên nhận hàng',
        searchable: true,
        required: true,
        isAsync: true,

        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetPlants(inputValue, typeExported, callback);
          }, 500);
        },
        onChangeSelectAutoComplete: selected => {
          this.props.onChangeField({
            field: 'receiver',
            value: selected,
          });
        },
        disabled: this.isView() || (this.isEdit() && this.isDisable()),
      },
      supervisor: {
        name: 'supervisor',
        label: 'Nhân Viên Giám Sát',
        component: SelectAutocomplete,
        value: pr.values.plantCode,
        placeholder: 'Lựa chọn nhân viên',
        searchable: true,
        onChangeSelectAutoComplete: selected => {
          this.props.onChangeField({
            field: 'supervisor',
            value: selected,
          });
        },
        options: this.props.formOption.users,
        disabled: this.isView(),
      },
      date: {
        name: 'date',
        label: 'Ngày Xuất Kho',
        component: DatePickerControl,
        format: 'dd/MM/yyyy HH:mm:ss',
        onChange: date =>
          this.props.onChangeField({
            field: 'date',
            value: date,
          }),
        required: true,
        disabled: this.isView(),
        maxDate: currentDate,
        clearable: false,
      },
      user: {
        name: 'user',
        label: 'Nhân viên xuất kho',
        component: SelectAutocomplete,
        value: pr.values.plantCode,
        placeholder: 'Lựa chọn nhân viên',
        searchable: true,
        options: this.props.formOption.users,
        onChangeSelectAutoComplete: selected => onChangeUser(selected),
        disabled: this.isView(),
        required: true,
      },
      phone: {
        name: 'phone',
        label: 'Điện thoại',
        component: InputControl,
        disabled: true,
      },
      email: {
        name: 'email',
        label: 'Email',
        component: InputControl,
        disabled: true,
      },
      deliveryOrderCode: {
        name: 'deliveryOrderCode',
        label: 'Mã BBGH',
        component: SelectAutocomplete,
        value: pr.values.plantCode,
        placeholder: 'Lựa chọn mã BBGH',
        searchable: true,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetDeliveryOrder(
              inputValue,
              recieverCode,
              dataValues.deliver.value,
              dataValues.subType.value,
              callback,
            );
          }, 1000);
        },
        onChangeSelectAutoComplete: selected => onChangeDelivery(selected),
        disabled: this.isView() || (this.isEdit() && this.isDisable()),
      },
      note: {
        name: 'note',
        label: 'Ghi chú',
        value: pr.values.note,
        component: InputControl,
        multiline: true,
        disabled: this.isView(),
        onChange: e =>
          this.props.onChangeField({
            field: 'note',
            value: e.target.value,
          }),
      },
      guarantor: {
        name: 'guarantor',
        label: 'Người bảo lãnh',
        component: SelectAutocomplete,
        value: pr.values.plantCode,
        placeholder: 'Lựa chọn người bảo lãnh',
        searchable: true,
        required: true,
        onChangeSelectAutoComplete: selected =>
          this.props.onChangeField({
            field: 'guarantor',
            value: selected,
          }),
        disabled: this.isView(),
        options: this.props.formOption.users,
      },
    };
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  exportPdfHandler = () => {
    const { onExportPdf, dataValues } = this.props;
    onExportPdf(dataValues);
  };

  render() {
    const { config } = this.props;
    const formAttr = this.makeFormAttr();
    return (
      <div>
        <Expansion
          title="I. Thông tin chung"
          rightActions={
            this.isView() && (
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => this.exportPdfHandler()}
              >
                In PXKS
              </Button>
            )
          }
          content={
            <Form>
              <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.subType} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.deliver} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.receiver} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      {config.renderBBGH && (
                        <Field {...formAttr.deliveryOrderCode} />
                      )}
                      {config.renderNBL && <Field {...formAttr.guarantor} />}
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.supervisor} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.date} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.note} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.user} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.phone} />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Field {...formAttr.email} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <ConfirmationDialog
                ref={ref => {
                  this.confirmRef = ref;
                }}
              />
            </Form>
          }
        />
      </div>
    );
  }
}
FormCreate.propTypes = {};
