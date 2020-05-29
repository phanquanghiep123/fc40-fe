/**
 *
 * InventoryBasket
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import * as Yup from 'yup';
import { showWarning } from 'containers/App/actions';
import ConfirmationDialog from 'components/ConfirmationDialog';
import reducer from './reducer';
import saga from './saga';
import Create from './Create';
import Edit from './Edit';
import View from './View';
import Cancel from './Cancel';

import {
  selectFormOption,
  selectFormDataSection,
  selectFormData,
} from './selectors';
import * as actions from './actions';
import { BTN_SUBMIT, TYPE_FORM } from './constants';

/* eslint-disable react/prefer-stateless-function */
export const styles = theme => ({
  spacing: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  btnCancel: {
    background: '#d80b0b',
    '&:hover': {
      background: 'red',
    },
  },
  btnAction: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  unitLeft: {
    paddingRight: theme.spacing.unit * 2,
  },
  unitRight: {
    paddingLeft: theme.spacing.unit * 2,
  },
  titleHeading: {
    marginTop: theme.spacing.unit * 3,
  },
});

export class InventoryBasket extends React.PureComponent {
  constructor(props) {
    super(props);
    this.confirmRemoveRecordSection3 = this.confirmRemoveRecordSection3.bind(
      this,
    );
    this.confirmRemoveRecordSection4 = this.confirmRemoveRecordSection4.bind(
      this,
    );
    this.confirmInventoryComplete = this.confirmInventoryComplete.bind(this);
  }

  form = null;

  id = null;

  formik = null;

  btnSubmit = null;

  errorQuantity = 0;

  basketErrorQuantity = 'Mã Khay Sọt';

  // errors = 0: không có khay sọt nào có trùng kho đích
  // errors = 1: có ít nhất 1 khay sọt có trùng kho đích
  errors = 0;

  setErrorSection4 = data => {
    this.errors = data;
  };

  validationSchema = Yup.object().shape({
    delegateId: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    reason: Yup.string()
      .max(100, 'Lý do không được vượt quá 100 kí tự')
      .nullable(),
    note: Yup.string()
      .max(500, 'Ghi Chú không được vượt quá 500 kí tự')
      .nullable(),
    infoImplementStocktaking: Yup.array()
      .of(Yup.object().shape({}))
      // eslint-disable-next-line consistent-return
      .test('testBlank', '', function(values) {
        const errors = [];
        const arrUser = [];

        if (values) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].userName) {
              arrUser.push(values[i]);
            }
          }
          if (arrUser.length === 0) {
            errors.push(
              this.createError({
                path: `${this.path}[0].userName`,
                message: 'Trường Không Được Bỏ Trống',
              }),
            );
          }
        }
        if (values && values.length > 0) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].position && values[i].position.length > 500) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].position`,
                  message: 'Chức Danh không được vượt quá 500 kí tự',
                }),
              );
            }
          }
        }
        if (errors.length > 0) {
          return new Yup.ValidationError(errors);
        }
      }),

    infoBasketStocktaking: Yup.array()
      .of(Yup.object().shape({}))
      // eslint-disable-next-line consistent-return
      .test('testBlank', '', function(values) {
        const errors = [];
        if (values && values.length > 0) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].basketCode && !values[i].basketLocator) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].basketLocator`,
                  message: 'Trường Không Được Bỏ Trống',
                }),
              );
            }
            if (!values[i].basketCode && values[i].basketLocator) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].basketCode`,
                  message: 'Trường Không Được Bỏ Trống',
                }),
              );
            }
            if (values[i].note && values[i].note.length > 500) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].note`,
                  message: 'Giải Thích không được vượt quá 500 kí tự',
                }),
              );
            }
            if (this.options.context.values.btnSumit === BTN_SUBMIT.COMPLETE) {
              if (
                !values[i].documentQuantity &&
                values[i].basketCode &&
                !values[i].stocktakingQuantity
              ) {
                this.errorQuantity = 1;
                this.basketErrorQuantity += `,${values[i].basketCode}`;
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].documentQuantity`,
                    message: `Khay sọt ${
                      values[i].basketCode
                    } có SL tồn trên sổ sách = SL Kiểm kê = 0. Hãy xóa sản phẩm không có trong kho để hoàn thành phiếu hoặc nhập SL Kiểm kê khác 0 `,
                  }),
                  this.createError({
                    path: `${this.path}[${i}].stocktakingQuantity`,
                    message: `Khay sọt ${
                      values[i].basketCode
                    } có SL tồn trên sổ sách = SL Kiểm kê = 0. Hãy xóa sản phẩm không có trong kho để hoàn thành phiếu hoặc nhập SL Kiểm kê khác 0 `,
                  }),
                );
              }
            }
          }
        }
        if (errors.length > 0) {
          return new Yup.ValidationError(errors);
        }
      }),
  });

  validationSchemaCancel = Yup.object().shape({
    note: Yup.string()
      .required('Trường không được bỏ trống')
      .max(500, 'Ghi Chú không được vượt quá 500 kí tự'),
    reason: Yup.string()
      .max(100, 'Lý do không được vượt quá 100 kí tự')
      .nullable(),
  });

  validationSchemaTypeOther = Yup.object().shape({
    reason: Yup.string()
      .required('Trường không được bỏ trống')
      .max(100, 'Lý do không được vượt quá 100 kí tự'),
    note: Yup.string()
      .max(500, 'Ghi Chú không được vượt quá 500 kí tự')
      .nullable(),
    delegateId: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    infoImplementStocktaking: Yup.array()
      .of(Yup.object().shape({}))
      // eslint-disable-next-line consistent-return
      .test('testBlank', '', function(values) {
        const errors = [];
        const arrUser = [];

        if (values) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].userName) {
              arrUser.push(values[i]);
            }
          }
          if (arrUser.length === 0) {
            errors.push(
              this.createError({
                path: `${this.path}[0].userName`,
                message: 'Trường Không Được Bỏ Trống',
              }),
            );
          }
        }
        if (values && values.length > 0) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].position && values[i].position.length > 500) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].position`,
                  message: 'Chức Danh không được vượt quá 500 kí tự',
                }),
              );
            }
          }
        }
        if (errors.length > 0) {
          return new Yup.ValidationError(errors);
        }
      }),

    infoBasketStocktaking: Yup.array()
      .of(Yup.object().shape({}))
      // eslint-disable-next-line consistent-return
      .test('testBlank', '', function(values) {
        const errors = [];
        if (values && values.length > 0) {
          for (let i = 0, len = values.length; i < len; i += 1) {
            if (values[i].basketCode && !values[i].basketLocator) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].basketLocator`,
                  message: 'Trường Không Được Bỏ Trống',
                }),
              );
            }
            if (!values[i].basketCode && values[i].basketLocator) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].basketCode`,
                  message: 'Trường Không Được Bỏ Trống',
                }),
              );
            }
            if (values[i].note && values[i].note.length > 500) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].note`,
                  message: 'Giải Thích không được vượt quá 500 kí tự',
                }),
              );
            }
            if (this.options.context.values.btnSumit === BTN_SUBMIT.COMPLETE) {
              if (
                !values[i].documentQuantity &&
                values[i].basketCode &&
                !values[i].stocktakingQuantity
              ) {
                this.errorQuantity = 1;
                this.basketErrorQuantity += `,${values[i].basketCode}`;
                errors.push(
                  this.createError({
                    path: `${this.path}[${i}].documentQuantity`,
                    message: `Khay sọt ${
                      values[i].basketCode
                    } có SL tồn trên sổ sách = SL Kiểm kê = 0. Hãy xóa sản phẩm không có trong kho để hoàn thành phiếu hoặc nhập SL Kiểm kê khác 0 `,
                  }),
                  this.createError({
                    path: `${this.path}[${i}].stocktakingQuantity`,
                    message: `Khay sọt ${
                      values[i].basketCode
                    } có SL tồn trên sổ sách = SL Kiểm kê = 0. Hãy xóa sản phẩm không có trong kho để hoàn thành phiếu hoặc nhập SL Kiểm kê khác 0 `,
                  }),
                );
              }
            }
          }
        }
        if (errors.length > 0) {
          return new Yup.ValidationError(errors);
        }
      }),
  });

  init = () => {
    const { location } = this.props;
    const urlParams = new URLSearchParams(location.search);
    const form = urlParams.get('form');
    this.form = form;
    const id = urlParams.get('id');
    this.id = id;
    this.props.onInitFormData({ form, id });
  };

  componentDidMount() {
    this.init();
  }

  confirmRemoveRecordSection3(rowIndex, id) {
    this.showConfirm({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        {
          text: 'Hủy',
          color: 'primary',
        },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            this.props.onChangeForm({
              field: 'reason',
              value: this.formik.values.reason,
            });
            this.props.onChangeForm({
              field: 'note',
              value: this.formik.values.note,
            });
            this.props.onRemoveRecordSection3({ rowIndex, id });
          },
        },
      ],
    });
  }

  confirmRemoveRecordSection4(rowIndex, rowData) {
    this.showConfirm({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        {
          text: 'Hủy',
          color: 'primary',
        },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            this.props.onChangeForm({
              field: 'reason',
              value: this.formik.values.reason,
            });
            this.props.onChangeForm({
              field: 'note',
              value: this.formik.values.note,
            });
            this.props.onRemoveRecordSection4({
              rowIndex,
              rowData,
              basketStocktakingId: this.id,
              form: this.form,
            });
          },
        },
      ],
    });
  }

  confirmInventoryComplete(rowIndex, data) {
    if (this.errors === 1) {
      this.props.onShowWarning(
        'Không thể hoàn thành kiểm kê khi có nhiều hơn một Mã Khay Sọt có cùng một Kho Đích',
      );
      return false;
    }
    this.showConfirm({
      title: 'Xác nhận hoàn thành kiểm kê',
      message: 'Bạn chắc chắn muốn hoàn thành kiểm kê?',
      actions: [
        {
          text: 'Hủy',
          color: 'primary',
        },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            this.props.onChangeForm({
              field: 'reason',
              value: this.formik.values.reason,
            });
            this.props.onChangeForm({
              field: 'note',
              value: this.formik.values.note,
            });
            this.props.onInventoryComplete({
              rowIndex,
              data,
              stocktakingId: this.id,
              basketStocktakingCode: this.props.formData.basketStocktakingCode,
            });
          },
        },
      ],
    });
    return true;
  }

  onSubmit = btn => {
    this.props.onChangeForm({
      field: 'reason',
      value: this.formik.values.reason,
    });
    this.props.onChangeForm({
      field: 'note',
      value: this.formik.values.note,
    });
    this.btnSubmit = btn;
    this.props.onSetBtnSubmit(btn);
    this.formik.handleSubmitClick();
  };

  handleSubmit = () => {
    const { formData } = this.props;
    const userInfo = [];
    formData.infoImplementStocktaking.forEach(item => {
      if (item.userName) {
        userInfo.push(item);
      }
    });
    if (userInfo.length === 0) {
      this.props.onShowWarning('Phải có ít nhất một người thực hiện kiểm kê');
      return false;
    }
    if (this.errors === 1) {
      this.props.onShowWarning(
        'Không được nhiều hơn một Mã Khay Sọt có cùng một Kho Đích',
      );
      return false;
    }

    const arrCheckStatus = [];
    const basketStocktakingDetails = [];
    formData.infoBasketStocktaking.forEach(item => {
      if (item.basketCode) {
        basketStocktakingDetails.push({
          ...item,
          id: item.id ? item.id : 0,
          basketStocktakingCode:
            formData.basketStocktakingCode && formData.basketStocktakingCode,
          locatorId: item.basketLocatorId && item.basketLocatorId,
          stocktakingQuantity: item.stocktakingQuantity
            ? item.stocktakingQuantity
            : 0,
        });
      }
      if (item.status === 1) {
        arrCheckStatus.push(item);
      }
    });
    if (basketStocktakingDetails.length === 0) {
      this.props.onShowWarning(
        'Vùng Thông Tin Khay Sọt Tồn phải có ít nhất một Mã Khay Sọt được kiểm kê',
      );
      return false;
    }
    const basketStocktakingUsers = [];
    formData.infoImplementStocktaking.forEach(item => {
      if (item.userName) {
        basketStocktakingUsers.push({
          ...item,
          id: item.id ? item.id : 0,
          basketStocktakingCode:
            formData.basketStocktakingCode && formData.basketStocktakingCode,
        });
      }
    });
    const data = {
      basketStocktakingCode:
        formData.basketStocktakingCode && formData.basketStocktakingCode,
      plantCode: formData.plantCode,
      stocktakingType: formData.stocktakingType,
      stocktakingRound: formData.stocktakingRound,
      reason: formData.reason,
      note: formData.note,
      id: this.id ? this.id : 0,
      userId: formData.userId.value,
      plantUnitCode: formData.plantUnitCode.value,
      delegateId: formData.delegateId.value,
      basketStocktakingUsers,
      basketStocktakingDetails,
      basketStocktakingDocumentExport: formData.infoBasketByWayStocktaking.map(
        item => ({
          ...item,
          basketStocktakingCode:
            formData.basketStocktakingCode && formData.basketStocktakingCode,
          id: item.id ? item.id : 0,
          basketDocumentCode: item.basketDocumentCodeExport,
        }),
      ),
    };
    // Lưu khi tạo mới
    if (this.btnSubmit === BTN_SUBMIT.SAVE && this.form === TYPE_FORM.CREATE) {
      this.props.onCreate(
        {
          ...data,
          createDate: formData.createDate.toISOString(),
          date: formData.createDate.toISOString(),
        },
        () => {
          this.props.history.push('/danh-sach-bien-ban-kiem-ke/');
        },
      );
    }

    // Lưu khi chỉnh sửa
    if (this.btnSubmit === BTN_SUBMIT.SAVE && this.form === TYPE_FORM.EDIT) {
      this.props.onCreate(
        {
          ...data,
          createDate: formData.createDate.toISOString(),
          date: formData.date.toISOString(),
        },
        () => {
          this.props.history.push('/danh-sach-bien-ban-kiem-ke/');
        },
      );
    }

    // hoàn thành
    const confirmComplete = mainData => {
      const message = () => {
        if (arrCheckStatus.length > 0) {
          return 'Vẫn còn Khay sọt chưa kiểm kê xong. Bạn có chắc chắn hoàn thành phiếu kiểm kê này? Sau khi hoàn thành sẽ không thể sửa hoặc xóa.';
        }
        return 'Bạn có chắc chắn hoàn thành phiếu kiểm kê này? Sau khi hoàn thành sẽ không thể sửa hoặc xóa.';
      };
      this.showConfirm({
        title: 'Xác nhận hoàn thành',
        message: message(),
        actions: [
          {
            text: 'Hủy',
          },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              this.props.onComplete(mainData, () => {
                this.props.history.push('/danh-sach-bien-ban-kiem-ke/');
              });
            },
          },
        ],
      });
    };
    if (
      this.form === TYPE_FORM.CREATE &&
      this.btnSubmit === BTN_SUBMIT.COMPLETE
    ) {
      confirmComplete({
        ...data,
        createDate: formData.createDate.toISOString(),
        date: formData.createDate.toISOString(),
      });
    }

    if (
      this.form === TYPE_FORM.EDIT &&
      this.btnSubmit === BTN_SUBMIT.COMPLETE
    ) {
      confirmComplete({
        ...data,
        createDate: formData.createDate.toISOString(),
        date: formData.date.toISOString(),
      });
    }

    // Hủy kết quả
    if (this.btnSubmit === BTN_SUBMIT.CANCEL) {
      this.props.onCancel(
        {
          id: this.id,
          note: formData.note,
        },
        () => {
          this.props.history.push('/danh-sach-bien-ban-kiem-ke/');
        },
      );
    }

    return true;
  };

  handleInvalidSubmission = () => {
    this.props.onShowWarning(
      'Bạn chưa điền đầy đủ thông tin hoặc thông tin nhập chưa chính xác. Vui lòng kiểm tra lại',
    );
  };

  addUser = () => {
    this.props.onAddUser();
  };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  handlePrint = () => {
    this.props.onPrint(this.id);
  };

  render() {
    const { formData, addBaskets } = this.props;
    const checkSubmit = () => {
      if (formData.stocktakingType === 4) {
        return this.validationSchemaTypeOther;
      }
      if (this.form === TYPE_FORM.CANCEL) {
        return this.validationSchemaCancel;
      }
      return this.validationSchema;
    };
    return (
      <div>
        <FormWrapper
          enableReinitialize
          initialValues={formData}
          validationSchema={checkSubmit()}
          onSubmit={this.handleSubmit}
          onInvalidSubmission={this.handleInvalidSubmission}
          FormikProps={{
            validateOnBlur: true,
            validateOnChange: true,
          }}
          render={formik => {
            this.formik = formik;
            return (
              <React.Fragment>
                {this.form === TYPE_FORM.CREATE && (
                  <Create
                    {...this.props}
                    formik={formik}
                    onSubmit={this.onSubmit}
                    addUser={this.addUser}
                    addBaskets={addBaskets}
                    confirmRemoveRecordSection3={
                      this.confirmRemoveRecordSection3
                    }
                    confirmRemoveRecordSection4={
                      this.confirmRemoveRecordSection4
                    }
                    confirmInventoryComplete={this.confirmInventoryComplete}
                    form={this.form}
                    showConfirm={this.showConfirm}
                    setErrorSection4={this.setErrorSection4}
                    id={this.id}
                    onPrint={this.handlePrint}
                  />
                )}

                {this.form === TYPE_FORM.EDIT && (
                  <Edit
                    {...this.props}
                    formik={formik}
                    onSubmit={this.onSubmit}
                    addUser={this.addUser}
                    addBaskets={addBaskets}
                    confirmRemoveRecordSection3={
                      this.confirmRemoveRecordSection3
                    }
                    confirmRemoveRecordSection4={
                      this.confirmRemoveRecordSection4
                    }
                    confirmInventoryComplete={this.confirmInventoryComplete}
                    form={this.form}
                    showConfirm={this.showConfirm}
                    setErrorSection4={this.setErrorSection4}
                    id={this.id}
                    onPrint={this.handlePrint}
                  />
                )}

                {this.form === TYPE_FORM.VIEW && (
                  <View
                    {...this.props}
                    formik={formik}
                    onSubmit={this.onSubmit}
                    addUser={this.addUser}
                    addBaskets={addBaskets}
                    confirmRemoveRecordSection3={
                      this.confirmRemoveRecordSection3
                    }
                    confirmRemoveRecordSection4={
                      this.confirmRemoveRecordSection4
                    }
                    showConfirm={this.showConfirm}
                    confirmInventoryComplete={this.confirmInventoryComplete}
                    form={this.form}
                    setErrorSection4={this.setErrorSection4}
                    id={this.id}
                    onPrint={this.handlePrint}
                  />
                )}

                {this.form === TYPE_FORM.CANCEL && (
                  <Cancel
                    {...this.props}
                    formik={formik}
                    onSubmit={this.onSubmit}
                    addUser={this.addUser}
                    addBaskets={addBaskets}
                    confirmRemoveRecordSection3={
                      this.confirmRemoveRecordSection3
                    }
                    confirmRemoveRecordSection4={
                      this.confirmRemoveRecordSection4
                    }
                    showConfirm={this.showConfirm}
                    confirmInventoryComplete={this.confirmInventoryComplete}
                    form={this.form}
                    setErrorSection4={this.setErrorSection4}
                    id={this.id}
                    onPrint={this.handlePrint}
                  />
                )}
              </React.Fragment>
            );
          }}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </div>
    );
  }
}

InventoryBasket.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  formOption: PropTypes.object,
  formData: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  onInitFormData: PropTypes.func,
  section1: PropTypes.object,
  section2: PropTypes.object,
  section3: PropTypes.array,
  section4: PropTypes.array,
  section5: PropTypes.array,
  section6: PropTypes.array,
  section7: PropTypes.array,
  onShowWarning: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onComplete: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onUpdateDetailsCommand: PropTypes.func,
  addBaskets: PropTypes.func,
  onChangeForm: PropTypes.func,
  onGetLocator: PropTypes.func,
  onGetSection4: PropTypes.func,
  onGetSection5: PropTypes.func,
  onGetQuantity: PropTypes.func,
  filterSection4: PropTypes.func,
  onCancel: PropTypes.func,
  onPrint: PropTypes.func,
  onGetLocatorByBasket: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formOption: selectFormOption(),
  formData: selectFormData(),
  section1: selectFormDataSection(['formData', 'section1']),
  section2: selectFormDataSection(['formData', 'section2']),
  section3: selectFormDataSection(['formData', 'infoImplementStocktaking']),
  section4: selectFormDataSection(['formData', 'infoBasketStocktaking']),
  section5: selectFormDataSection(['formData', 'infoBasketByWayStocktaking']),
  section6: selectFormDataSection(['formData', 'resultStocktakingByBasket']),
  section7: selectFormDataSection(['formData', 'handleAfterStocktaking']),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onInitFormData: data => dispatch(actions.initFormData(data)),
    onCreate: (data, callback) => dispatch(actions.create(data, callback)),
    onUpdate: (data, callback) => dispatch(actions.update(data, callback)),
    onComplete: (data, callback) => dispatch(actions.complete(data, callback)),
    onAddUser: data => dispatch(actions.addUser(data)),
    onChangeField: (data, field) => dispatch(actions.changeField(data, field)),
    onShowWarning: mess => dispatch(showWarning(mess)),
    onRemoveRecordSection3: data =>
      dispatch(actions.removeRecordSection3(data)),
    onRemoveRecordSection4: data =>
      dispatch(actions.removeRecordSection4(data)),
    onInventoryComplete: data => dispatch(actions.completeInventory(data)),
    onUpdateDetailsCommand: (data, field) =>
      dispatch(actions.updateDetailCommand(data, field)),
    onChangePlant: data => dispatch(actions.changePlant(data)),
    addBaskets: data => dispatch(actions.addBasket(data)),
    onChangeForm: data => dispatch(actions.changeForm(data)),
    onGetLocator: data => dispatch(actions.getLocator(data)),
    onGetSection4: data => dispatch(actions.getSection4(data)),
    onGetSection5: data => dispatch(actions.getSection5(data)),
    onSetBtnSubmit: data => dispatch(actions.setBtnSubmit(data)),
    filterSection4: data => dispatch(actions.filterSection4(data)),
    onCancel: (data, callback) => dispatch(actions.cancel(data, callback)),
    onGetQuantity: (data, callback) =>
      dispatch(actions.getQuantity(data, callback)),
    onGetLocatorByBasket: (data, callback) =>
      dispatch(actions.getLocatorByBasket(data, callback)),
    onPrint: data => dispatch(actions.print(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'inventoryBasket', reducer });
const withSaga = injectSaga({ key: 'inventoryBasket', saga });

export default compose(
  withStyles(styles),
  withConnect,
  withReducer,
  withSaga,
  withImmutablePropsToJs,
)(InventoryBasket);
