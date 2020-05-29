import { isEmpty } from 'lodash';
import SelectAutocomplete from '../../../../../../components/SelectAutocomplete';
import InputControl from '../../../../../../components/InputControl';
import DatePickerControl from '../../../../../../components/PickersControl';
import CheckboxControl from '../../../../../../components/CheckboxControl';
import { REFER_TYPE, TYPE_PXKS } from '../constants';
import { getNested } from '../../../../../App/utils';
import {
  ASSETS_TABLE,
  ASSETS_TABLE_PINNED,
  BASKETS_TABLE,
  BASKETS_TABLE_PINNED,
  generalSectionFields,
} from '../CancelReceipt/constants';

const notEmptyObject = item => !!Object.keys(item).length;
const solidRecord = item => !!item.id;

export const makeFormAttr = (context, onConfirmChangePlant) => {
  const pr = context.props.formik;
  let autoCompleteTimer;
  const {
    formik,
    onGetDeliveryOrder,
    onChangeDelivery,
    onChangeSellDocument,
    dataValues,
    onChangeUser,
    onGetPlants,
    typeExported,
    onFetchCancelRequestsAC,
    onFetchCancelReceiptByRequestId,
  } = context.props;
  const f = generalSectionFields;
  const recieverCode = dataValues.receiver ? dataValues.receiver.value : '';
  const baseFormField = {
    deliver: {
      name: 'deliver',
      label: 'Đơn vị Giao Hàng',
      component: SelectAutocomplete,
      value: pr.values.deliver,
      placeholder: 'Lựa chọn đơn vị giao hàng',
      searchable: true,
      required: true,
      onChangeSelectAutoComplete: selected => {
        if (dataValues.basketDocumentDetails.some(notEmptyObject)) {
          context.onConfirmShow({
            title: 'Cảnh báo',
            message:
              'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! ' +
              'Bạn vẫn muốn thay đổi?',
            actions: [
              { text: 'Bỏ qua' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  context.props.onChangeDeliver({
                    field: 'deliver',
                    value: selected && selected,
                    deliverType: selected && selected.type,
                    subType: pr.values.subType,
                  });
                  context.props.onResetBasketsDetail({
                    field: 'deliver',
                  });
                },
              },
            ],
          });
        } else {
          context.props.onChangeDeliver({
            field: 'deliver',
            value: selected && selected,
            deliverType: selected && selected.type,
            subType: pr.values.subType,
          });
        }
      },
      options: context.props.formOption.orgs,
      disabled:
        context.isView() ||
        (context.isEdit() && context.isDisable()) ||
        context.isConfirm(),
    },
    subType: {
      name: 'subType',
      label: 'Loại Xuất Kho',
      component: SelectAutocomplete,
      placeholder: 'Lựa chọn loại xuất kho',
      value: pr.values.subType,
      options: context.props.formOption.subTypes,
      onChangeSelectAutoComplete: option => {
        if (option.value !== dataValues.subType.value) {
          context.onConfirmShow({
            title: 'Cảnh báo',
            message:
              'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! ' +
              'Bạn vẫn muốn thay đổi?',
            actions: [
              { text: 'Bỏ qua' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  context.props.onResetBasketsDetail({
                    field: 'subType',
                  });
                  context.props.onChangeType({
                    ...option,
                    plantCode: dataValues.deliver
                      ? dataValues.deliver.value
                      : null,
                  });
                },
              },
            ],
          });
        } else context.props.onChangeType(option);
      },
      required: true,
      isClearable: false,
      disabled:
        context.isView() ||
        (context.isEdit() && context.isDisable()) ||
        context.isConfirm(),
    },
    receiver: {
      name: 'receiver',
      label: 'Đơn vị Nhận Hàng',
      component: SelectAutocomplete,
      value: pr.values.receiver,
      placeholder: 'Lựa chọn đơn vị nhận hàng',
      searchable: true,
      required: true,
      isAsync: true,
      loadOptions: (inputValue, callback) => {
        clearTimeout(autoCompleteTimer); // clear previous timeout
        autoCompleteTimer = setTimeout(() => {
          onGetPlants(inputValue, typeExported, callback);
        }, 1000);
      },
      onChangeSelectAutoComplete: selected => {
        context.props.onChangeField({
          field: 'receiver',
          value: selected,
          receiverType: selected ? selected.type : null,
        });
      },
      disabled:
        context.isView() ||
        (context.isEdit() && context.isDisable()) ||
        context.isConfirm(),
    },
    supervisor: {
      name: 'supervisor',
      label: 'Nhân Viên Giám Sát',
      component: SelectAutocomplete,
      value: pr.values.plantCode,
      placeholder: `${context.isView() ? '' : 'Lựa chọn nhân viên'}`,
      searchable: true,
      onChangeSelectAutoComplete: selected => {
        context.props.onChangeField({
          field: 'supervisor',
          value: selected,
        });
      },
      options: context.props.formOption.users,
      disabled: context.isView(),
    },
    date: {
      name: 'date',
      label: 'Ngày Xuất Kho',
      component: DatePickerControl,
      isDateTimePicker: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      onChange: date => {
        if (dataValues.basketDocumentDetails.some(notEmptyObject)) {
          context.onConfirmShow({
            title: 'Cảnh báo',
            message:
              'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! ' +
              'Bạn vẫn muốn thay đổi?',
            actions: [
              { text: 'Bỏ qua' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  context.props.onResetBasketsDetail({
                    field: 'date',
                  });
                  context.props.onChangeField({
                    field: 'date',
                    value: date,
                  });
                },
              },
            ],
          });
        } else {
          context.props.onChangeField({
            field: 'date',
            value: date,
          });
        }
      },
      required: true,
      disabled: context.isView(),
      maxDate: new Date(),
      clearable: false,
    },
    dateApproved: {
      name: 'dateApproved',
      label: 'Ngày Xác Nhận',
      component: DatePickerControl,
      isDateTimePicker: true,
      format: 'dd/MM/yyyy HH:mm:ss',
      disabled: true,
    },
    user: {
      name: 'user',
      label: 'Nhân Viên Xuất Kho',
      component: SelectAutocomplete,
      value: pr.values.plantCode,
      placeholder: 'Lựa chọn nhân viên',
      searchable: true,
      options: context.props.formOption.users,
      onChangeSelectAutoComplete: selected => onChangeUser(selected),
      disabled: true,
      // disabled: context.isView(),
      required: true,
    },
    phone: {
      name: 'phone',
      label: 'Điện Thoại',
      component: InputControl,
      disabled: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      component: InputControl,
      disabled: true,
    },
    statusName: {
      name: 'statusName',
      label: 'Trạng Thái',
      component: InputControl,
      disabled: true,
    },
    basketDocumentCode: {
      name: 'basketDocumentCode',
      label: 'Mã Phiếu Xuất Khay Sọt',
      component: InputControl,
      disabled: true,
    },
    directPayback: {
      name: 'isDirect',
      label: 'Xuất Trả Trực Tiếp',
      component: CheckboxControl,
      labelPlacement: 'end',
    },
    note: {
      name: 'note',
      label: 'Ghi Chú',
      value: pr.values.note,
      component: InputControl,
      multiline: true,
      disabled: context.isView(),
      onChange: pr.handleChange,
    },
  };
  if (pr.values.subType) {
    switch (pr.values.subType.value) {
      case TYPE_PXKS.PXKS_HUY: {
        baseFormField.subType = {
          ...baseFormField.subType,
          disabled: !context.isCreate(),
          onChangeSelectAutoComplete: selected => {
            if (
              selected.value !== dataValues.subType.value &&
              getNested(pr.values, f.cancelRequest)
            ) {
              context.onConfirmShow({
                title: 'Cảnh báo',
                message:
                  'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                  'Bạn vẫn muốn thay đổi?',
                actions: [
                  { text: 'Bỏ qua' },
                  {
                    text: 'Đồng ý',
                    color: 'primary',
                    onClick: () => {
                      context.props.onResetBasketsDetail({
                        field: 'subType',
                      });
                      context.props.onChangeType({
                        ...selected,
                        plantCode: pr.values.deliver.value,
                      });
                    },
                  },
                ],
              });
            } else context.props.onChangeType(selected);
          },
        };
        baseFormField.date.disabled = true;
        baseFormField.deliver = {
          ...baseFormField.deliver,
          label: 'Đơn Vị Huỷ',
          placeholder: 'Lựa chọn đơn vị huỷ',
          isClearable: false,
          disabled: !context.isCreate(),
          onChangeSelectAutoComplete: selected => {
            const prev = pr.values[f.deliver];
            const cancelRequest = pr.values[f.cancelRequest];

            // cases which don't require confirmation
            if (
              !prev ||
              !cancelRequest ||
              (selected && selected.value === prev.value)
            ) {
              pr.setFieldValue(f.deliver, selected);
              return;
            }

            // confirm before change
            onConfirmChangePlant(() => {
              resetCancelReceipt(pr, { [f.deliver]: selected });
            });
          },
        };
        baseFormField.reason = {
          name: 'reason',
          label: 'Lý Do',
          component: SelectAutocomplete,
          isClearable: false,
          disabled: true,
          placeholder: null,
        };
        baseFormField.total = {
          name: 'total',
          label: 'Tổng Giá Trị Huỷ',
          component: InputControl,
          disabled: true,
        };
        baseFormField.cancelRequest = {
          key: getNested(pr.values.deliver, 'value') || 0,
          name: 'cancelRequest',
          required: true,
          label: 'Mã PYC Thanh Lý/Hủy',
          placeholder: 'Lựa chọn phiếu',
          component: SelectAutocomplete,
          isAsync: true,
          defaultOptions: true,
          loadOptionsFunc: (input, callback) => {
            onFetchCancelRequestsAC(formik, input, returnedData => {
              let data = returnedData;
              const maxResult = 100;
              if (data && data.length > maxResult) {
                data = data.slice(0, maxResult);
              }

              callback(data);
            });
          },
          afterHandleChange: selected => {
            if (!selected) {
              resetCancelReceipt(pr);
              return;
            }

            onFetchCancelReceiptByRequestId(selected, returnedData => {
              formik.setValues({
                ...formik.values,
                ...returnedData,
                [f.cancelRequest]: selected,
              });
            });
          },
          disabled:
            !context.isCreate() || !pr.values.subType || !pr.values.deliver,
        };
        baseFormField.user = {
          ...baseFormField.user,
          label: 'Nhân Viên Huỷ',
          isClearable: false,
          onChangeSelectAutoComplete: selected => {
            const updatedValues = {
              ...pr.values,
              [f.user]: selected,
              [f.phone]: selected.phoneNumber,
              [f.email]: selected.email,
            };

            pr.setValues(updatedValues);
          },
        };
        baseFormField.supervisor = {
          ...baseFormField.supervisor,
          onChangeSelectAutoComplete: undefined,
        };

        baseFormField.note = {
          name: 'note',
          label: 'Ghi Chú',
          value: pr.values.note,
          component: InputControl,
          multiline: true,
          disabled: context.isView(),
          onChange: pr.handleChange,
        };

        delete baseFormField.receiver;
        return baseFormField;
      }
      case TYPE_PXKS.PXKS_NOI_BO: {
        baseFormField.receiver = { ...baseFormField.deliver };
        baseFormField.receiver.value = baseFormField.deliver.value;
        baseFormField.receiver.disabled = true;
        baseFormField.receiver.label = 'Đơn Vị Nhận Hàng';
        baseFormField.receiver.placeholder = 'Lựa chọn đơn vị nhận hàng';
        baseFormField.date.disabled = true;
        baseFormField.note.onChange = note =>
          context.props.onChangeField({
            field: 'note',
            value: note.target.value,
          });
        return baseFormField;
      }
      case TYPE_PXKS.PXKS_TRA: {
        baseFormField.directPayback = {
          name: 'isDirect',
          label: 'Xuất Trả Trực Tiếp',
          component: CheckboxControl,
          labelPlacement: 'end',
          disabled: context.isView() || context.isConfirm(),
          handleCheckbox: e =>
            context.props.onChangeField({
              field: 'isDirect',
              value: e.currentTarget.checked,
            }),
        };
        baseFormField.note.onChange = note =>
          context.props.onChangeField({
            field: 'note',
            value: note.target.value,
          });
        baseFormField.date.disabled = true;
        baseFormField.receiver.onChangeSelectAutoComplete = selected => {
          if (dataValues.basketDocumentDetails.some(notEmptyObject)) {
            context.onConfirmShow({
              title: 'Cảnh báo',
              message:
                'Nếu bạn thay đổi giá trị thì thông tin khay sọt đang mượn và thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                'Bạn vẫn muốn thay đổi?',
              actions: [
                { text: 'Bỏ qua' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: () => {
                    context.props.onResetBasketsDetail({
                      field: 'receiver',
                    });
                    context.props.onChangeField({
                      field: 'receiver',
                      value: selected,
                      receiverType: selected ? selected.type : null,
                    });
                    if (dataValues.deliver && selected) {
                      context.props.onGetLoanBasket({
                        receiverCode: selected.value,
                        deliverCode: dataValues.deliver.value,
                        receiverType: selected.type,
                      });
                    }
                  },
                },
              ],
            });
          } else {
            context.props.onResetBasketsDetail({
              field: 'receiver',
            });
            context.props.onChangeField({
              field: 'receiver',
              value: selected,
              receiverType: selected ? selected.type : null,
            });
            if (dataValues.deliver && selected) {
              context.props.onGetLoanBasket({
                receiverCode: selected.value,
                deliverCode: dataValues.deliver.value,
                receiverType: selected.type,
              });
            }
          }
        };
        baseFormField.deliver.onChangeSelectAutoComplete = selected => {
          if (dataValues.basketDocumentDetails.some(notEmptyObject)) {
            context.onConfirmShow({
              title: 'Cảnh báo',
              message:
                'Nếu bạn thay đổi giá trị thì thông tin khay sọt đang mượn và thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                'Bạn vẫn muốn thay đổi?',
              actions: [
                { text: 'Bỏ qua' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: () => {
                    context.props.onResetBasketsDetail({
                      field: 'deliver',
                    });
                    context.props.onChangeField({
                      field: 'deliver',
                      value: selected,
                      receiverType: selected ? selected.type : null,
                    });
                    context.props.onChangeDeliver({
                      field: 'deliver',
                      value: selected && selected,
                      deliverType: selected && selected.type,
                      subType: pr.values.subType,
                    });
                    if (dataValues.receiver && selected) {
                      context.props.onGetLoanBasket({
                        receiverCode: dataValues.receiver.value,
                        deliverCode: selected ? selected.value : null,
                        receiverType: dataValues.receiver.type,
                      });
                    }
                  },
                },
              ],
            });
          } else {
            context.props.onResetBasketsDetail({
              field: 'deliver',
            });
            context.props.onChangeField({
              field: 'deliver',
              value: selected,
              receiverType: selected ? selected.type : null,
            });
            context.props.onChangeDeliver({
              field: 'deliver',
              value: selected && selected,
              deliverType: selected && selected.type,
              subType: pr.values.subType,
            });
            if (dataValues.receiver && selected) {
              context.props.onGetLoanBasket({
                receiverCode: dataValues.receiver.value,
                deliverCode: selected ? selected.value : null,
                receiverType: dataValues.receiver.type,
              });
            }
          }
        };
        return baseFormField;
      }
      case TYPE_PXKS.PXKS_MUON: {
        baseFormField.pxbCode = {
          name: 'pxbCode',
          label: 'Mã Phiếu Xuất Bán Hàng Hóa',
          component: SelectAutocomplete,
          isAsync: true,
          searchable: true,
          placeholder:
            context.isView() || context.isConfirm()
              ? ''
              : 'Lựa chọn mã PXB hàng hóa',
          loadOptions: (inputValue, callback) => {
            clearTimeout(autoCompleteTimer);
            autoCompleteTimer = setTimeout(() => {
              context.props.onFetchAutocomplete({
                type: 'sellDocument',
                inputValue,
                callback,
                deliveryCode: pr.values.deliver && pr.values.deliver.value,
                receiverCode: pr.values.receiver
                  ? pr.values.receiver.value
                  : '',
                date: pr.values.date,
              });
            }, 1000);
          },
          onChangeSelectAutoComplete: selected => {
            if (dataValues.basketDocumentDetails.some(notEmptyObject)) {
              context.onConfirmShow({
                title: 'Cảnh báo',
                message:
                  'Nếu bạn thay đổi giá trị thì thông tin khay sọt đang mượn và thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                  'Bạn vẫn muốn thay đổi?',
                actions: [
                  { text: 'Bỏ qua' },
                  {
                    text: 'Đồng ý',
                    color: 'primary',
                    onClick: () => {
                      context.props.onResetBasketsDetail({
                        field: 'pxbCode',
                      });
                      context.props.onChangeField({
                        field: 'doBasketDetails',
                        value: selected ? selected.doBasketDetails : null,
                      });
                      onChangeSellDocument(selected);
                    },
                  },
                ],
              });
            } else {
              context.props.onResetBasketsDetail({
                field: 'pxbCode',
              });
              context.props.onChangeField({
                field: 'doBasketDetails',
                value: selected ? selected.doBasketDetails : null,
              });
              onChangeSellDocument(selected);
            }
          },
          disabled:
            (context.props.data.isAutoComplete && context.isEdit()) ||
            context.isConfirm() ||
            context.isView(),
        };
        baseFormField.note.onChange = note =>
          context.props.onChangeField({
            field: 'note',
            value: note.target.value,
          });
        baseFormField.date = {
          name: 'date',
          label: 'Ngày Xuất Kho',
          component: DatePickerControl,
          isDateTimePicker: true,
          format: 'dd/MM/yyyy HH:mm:ss',
          disabled: true,
          onChange: date => {
            if (
              dataValues.basketDocumentDetails.some(notEmptyObject) ||
              dataValues.documentCode
            ) {
              context.onConfirmShow({
                title: 'Cảnh báo',
                message:
                  'Nếu bạn thay đổi ngày xuất kho mã PXB sẽ thay đổi ' +
                  'và thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                  'Bạn vẫn muốn thay đổi?',
                actions: [
                  { text: 'Bỏ qua' },
                  {
                    text: 'Đồng ý',
                    color: 'primary',
                    onClick: () => {
                      context.props.onResetDocumnetSell();
                      context.props.onResetBasketsDetail({
                        field: 'deliver',
                      });
                      context.props.onChangeField({
                        field: 'date',
                        value: date,
                      });
                    },
                  },
                ],
              });
            } else {
              context.props.onChangeField({
                field: 'date',
                value: date,
              });
            }
          },
        };
        baseFormField.directLoan = {
          name: 'isDirect',
          label: 'Xuất Cho Mượn Trực Tiếp',
          component: CheckboxControl,
          labelPlacement: 'end',
          disabled: context.isView() || context.isConfirm(),
          handleCheckbox: e =>
            context.props.onChangeField({
              field: 'isDirect',
              value: e.currentTarget.checked,
            }),
        };
        baseFormField.guarantor = {
          name: 'guarantor',
          label: 'Người Bảo Lãnh',
          component: SelectAutocomplete,
          value: pr.values.plantCode,
          placeholder: 'Lựa chọn người bảo lãnh',
          searchable: true,
          required: true,
          onChangeSelectAutoComplete: selected =>
            context.props.onChangeField({
              field: 'guarantor',
              value: selected,
            }),
          disabled: context.isView(),
          options: context.props.formOption.users,
        };
        baseFormField.deliver.disabled =
          context.isView() ||
          context.isConfirm() ||
          dataValues.basketDocumentDetails.some(solidRecord) ||
          !isEmpty(dataValues.documentCode);
        // không cho phép sửa khi có mã pxb, màn xem, màn xác nhận và cho phép sửa nếu nó là phiếu tạo tự động từ PXB,PXBX
        baseFormField.receiver.disabled =
          (!isEmpty(dataValues.documentCode) ||
            context.isView() ||
            context.isConfirm()) &&
          !(context.isEdit() && dataValues.isAutoComplete);
        // không cần confirm, cho sửa ngay
        baseFormField.receiver.onChangeSelectAutoComplete = selected => {
          context.onConfirmShow({
            title: 'Cảnh báo',
            message:
              'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
            actions: [
              { text: 'Bỏ qua' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  context.props.onChangeField({
                    field: 'receiver',
                    value: selected,
                    receiverType: selected ? selected.type : null,
                  });
                },
              },
            ],
          });
        };
        return baseFormField;
      }
      case TYPE_PXKS.PXKS_DIEU_CHUYEN:
      case TYPE_PXKS.PXKS_DIEU_CHINH: {
        baseFormField.deliveryOrderCode = {
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
          disabled:
            context.isView() ||
            (context.isEdit() &&
              (typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
                [REFER_TYPE.FROM_BBGHKS, REFER_TYPE.FROM_BBGH_BBGHNHH].includes(
                  dataValues.referType,
                ))),
        };
        baseFormField.date = {
          name: 'date',
          label: 'Ngày Xuất Kho',
          component: DatePickerControl,
          isDateTimePicker: true,
          format: 'dd/MM/yyyy HH:mm:ss',
          onChange: date => {
            if (
              dataValues.basketDocumentDetails.some(notEmptyObject) ||
              dataValues.deliveryOrderCode
            ) {
              context.onConfirmShow({
                title: 'Cảnh báo',
                message:
                  'Nếu bạn thay đổi ngày xuất kho mã BBGH sẽ thay đổi ' +
                  'và thông tin khay sọt vừa nhập sẽ không được lưu! ' +
                  'Bạn vẫn muốn thay đổi?',
                actions: [
                  { text: 'Bỏ qua' },
                  {
                    text: 'Đồng ý',
                    color: 'primary',
                    onClick: () => {
                      context.props.onResetDeliveryOrder();
                      context.props.onResetBasketsDetail({
                        field: 'date',
                      });
                      context.props.onChangeField({
                        field: 'date',
                        value: date,
                      });
                    },
                  },
                ],
              });
            } else {
              context.props.onChangeField({
                field: 'date',
                value: date,
              });
            }
          },
          required: true,
          disabled:
            (typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
              [REFER_TYPE.FROM_BBGH_BBGHNHH, REFER_TYPE.FROM_BBGHKS].includes(
                dataValues.referType,
              )) ||
            typeExported === TYPE_PXKS.PXKS_DIEU_CHINH,
          maxDate: new Date(),
          clearable: false,
        };
        baseFormField.deliver.disabled =
          context.isView() ||
          dataValues.basketDocumentDetails.some(solidRecord) ||
          !isEmpty(dataValues.deliveryOrderCode);
        baseFormField.note.label =
          'Ghi chú (Hãy ghi Mã BBGH vào nội dung Ghi chú)';
        baseFormField.receiver.disabled =
          !isEmpty(dataValues.deliveryOrderCode) ||
          typeExported === TYPE_PXKS.PXKS_DIEU_CHINH;
        baseFormField.receiver.onChangeSelectAutoComplete = selected =>
          context.props.onChangeField({
            field: 'receiver',
            value: selected,
            receiverType: selected ? selected.type : null,
          });
        baseFormField.note.onChange = note =>
          context.props.onChangeField({
            field: 'note',
            value: note.target.value,
          });
        return baseFormField;
      }
      default:
        return baseFormField;
    }
  }
  return baseFormField;
};

/**
 * Reset phiếu xuất huỷ khay sọt
 * @param formik
 * @param updatedValues
 */
function resetCancelReceipt(formik, updatedValues = {}) {
  if (!formik) return;
  const f = generalSectionFields;

  formik.setValues({
    ...formik.values,
    ...updatedValues,
    [f.cancelRequest]: null,
    [f.total]: '',
    [f.reason]: null,
    [f.note]: '',
    [ASSETS_TABLE]: [],
    [ASSETS_TABLE_PINNED]: [],
    [BASKETS_TABLE]: [],
    [BASKETS_TABLE_PINNED]: [],
  });
}
