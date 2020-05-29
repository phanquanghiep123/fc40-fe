/**
 *
 * ExportedBaskets
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import MESSAGE from 'containers/App/messageGlobal';
import FormWrapper from 'components/FormikUI/FormWrapper';
import ConfirmationDialog from 'components/ConfirmationDialog';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Typography, withStyles, Button } from '@material-ui/core';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import Grid from '@material-ui/core/Grid';
import CompleteButton from 'components/Button/ButtonComplete';
import PrintPreview from 'components/PrintPreview';
import WrapperBusiness, { CODE } from './Business';
import * as selectors from './selectors';
import reducer from './reducer';
import saga from './saga';
import CreatePage from './Create';
import ViewPage from './View';
import EditPage from './Edit';
import ConfirmPage from './Confirm';
import CustomButton from '../../../../NSC_StockManagement/AddProducts/Button';
import {
  BTN_CANCEL,
  BTN_COMPLETE,
  BTN_SAVE,
} from '../../../../NSC_StockManagement/AddProducts/messages';
import * as actions from './actions';
import { TYPE_ACTION, TYPE_FORM, TYPE_PXKS } from './constants';
import QuickPopup from '../../../../../components/MuiPopup/QuickPopup';
import { getNested, getUrlParams } from '../../../../App/utils';
import MuiButton from '../../../../../components/MuiButton';
import { generalSectionFields } from './CancelReceipt/constants';
import { makeCancelReceiptSchema } from './CancelReceipt/Schema';
import { loadingError, showWarning } from '../../../../App/actions';
export const styles = theme => ({
  actions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  actionsContainer: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'flex-end',
    '& button:not(:last-child)': {
      marginRight: '1rem',
    },
  },
  completeButton: {
    backgroundColor: theme.palette.orange[800],
    color: theme.palette.getContrastText(theme.palette.orange[800]),
    '&:hover': {
      backgroundColor: theme.palette.orange[900],
      color: theme.palette.getContrastText(theme.palette.orange[900]),
    },
  },
  confirm: {
    color: 'red',
  },
  notice: {
    color: 'green',
  },
});
class ConfirmChain {
  constructor(props) {
    this.queue = [];
    this.finalFunc = props.finalFunc;
  }

  isEmptyQueue() {
    return this.queue.length === 0;
  }

  setExecuteObj(executeObj) {
    this.executeObj = executeObj;
  }

  addToQueue(item) {
    this.queue.push(item);
  }

  run() {
    // nếu mảng queue khác rỗng
    if (!this.isEmptyQueue()) {
      // xóa phần tử đầu tiên
      const item = this.queue.shift();
      item.func.call(this.executeObj, item.callback);
    } else {
      this.finalFunc();
    }
  }
}
/* eslint-disable react/prefer-stateless-function */
export class ExportedBaskets extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      actionType: null,
      printPreview: false,
      printPreviewContent: '',
      isCancelReceipt: false, // check phiếu huỷ khay sọt
    };

    this.quickPopupRef = React.createRef();
  }

  formik = null;

  typeForm = null;

  dataSection2 = [];

  setDataSection2 = data => {
    this.dataSection2 = data;
  };

  componentWillMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    this.typeForm = searchParams.get('form');
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const typeForm = searchParams.get('form');
    const id = searchParams.get('id');
    this.props.onInitValue({
      form: typeForm,
      id,
      callback: this.onLoadCancelReceiptDetail,
    });
  }

  /**
   * Load detail for cancel receipt - fetch thông tin chi tiết phiếu huỷ khay sọt
   * @desc Nếu có id => fetch theo id. Không thì fetch theo cancelRequestId
   */
  onLoadCancelReceiptDetail = () => {
    const {
      onFetchCancelReceiptById,
      onFetchCancelReceiptByRequestId,
      history,
    } = this.props;
    const { id, isCancelReceipt, cancelRequestId } = getUrlParams(history);

    if (id && isCancelReceipt === true) {
      onFetchCancelReceiptById(id, returnedData => {
        this.formik.setValues(returnedData);
      });
    } else if (cancelRequestId) {
      onFetchCancelReceiptByRequestId(
        { value: cancelRequestId },
        returnedData => {
          this.formik.setValues(returnedData);
        },
      );
    }
  };

  onFormInvalid = fkInvalid => {
    const { errors } = fkInvalid;
    Object.keys(errors).forEach((key, index) => {
      let mess = '';
      if (index === 0) {
        if (errors[key] instanceof Array && errors[key].length > 0) {
          for (let i = 0; i < errors[key].length; i += 1) {
            if (typeof errors[key][i] === 'object') {
              const keys = Object.keys(errors[key][i]);
              if (errors[key][i].quantityActual) {
                mess += `${errors[key][i][keys[0]]} \n`;
                this.props.onLoadingError(mess);
              } else {
                this.props.onShowWarning(errors[key][i][keys[0]]);
              }
            }
          }
        } else if (typeof errors[key] === 'string') {
          this.props.onShowWarning(MESSAGE.INVALID_MODEL);
        }
      }
    });
    // this.props.onShowWarning(
    //   'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
    // );
  };

  callbackSubmit = fieldData => {
    if (this.state.actionType === TYPE_ACTION.BASKETS_COMPLETE) {
      if (fieldData.subType === TYPE_PXKS.PXKS_DIEU_CHUYEN) {
        setTimeout(
          this.props.history.push(
            `/danh-sach-bien-ban-giao-hang/chinh-sua-bien-ban-giao-hang/${
              fieldData.id
            }`,
          ),
          1000,
        );
      } else if (
        fieldData.subType === TYPE_PXKS.PXKS_MUON ||
        fieldData.subType === TYPE_PXKS.PXKS_TRA
      ) {
        if (fieldData.id && this.typeForm !== TYPE_FORM.CONFIRM) {
          setTimeout(
            this.props.history.push(
              `/danh-sach-bien-ban-giao-hang/chinh-sua-bien-ban-giao-hang/${
                fieldData.id
              }`,
            ),
            1000,
          );
        } else if (fieldData.id && this.typeForm === TYPE_FORM.CONFIRM) {
          setTimeout(
            this.props.history.push(`/danh-sach-phieu-xuat-kho-khay-sot/`),
            1000,
          );
        } else {
          setTimeout(
            this.props.history.push(`/danh-sach-phieu-xuat-kho-khay-sot/`),
            1000,
          );
        }
      } else
        setTimeout(
          this.props.history.push('/danh-sach-phieu-xuat-kho-khay-sot'),
          1000,
        );
    } else {
      this.formik.setFieldValue('id', fieldData.id);
      this.props.onChangeField({
        field: 'id',
        value: fieldData.id,
      });
      setTimeout(
        this.props.history.push('/danh-sach-phieu-xuat-kho-khay-sot'),
        1000,
      );
    }
  };

  // confirm tạo pxks điều chuyển
  transformConfirm = callback => {
    this.onConfirmShow({
      title: 'Xác nhận',
      message:
        'Sau khi tạo PXKS điều chuyển, hệ thống sẽ tự tạo BBGH dành cho khay sọt tương ứng. Ấn Đồng ý để tiếp tục xử lý ',
      actions: [
        { text: 'Huỷ' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: callback,
        },
      ],
    });
  };

  // confirm cập nhật lại thông tin khay sọt trong BBGH
  updateBasketConfirm = callback => {
    let mess = 'SL xuất trong PXKS và BBGH của Mã Khay Sọt';
    this.dataSection2.forEach(item => {
      if (item.doQuantity - item.deliveryQuantity !== 0) {
        mess += ` ${item.basketCode},`;
      }
    });
    let newMess = mess.substr(0, mess.length - 1);
    newMess +=
      ' là khác nhau. Ấn Đồng ý, hệ thống sẽ tự động xử lí cập nhật lại thông tin khay sọt trong BBGH.';
    this.onConfirmShow({
      title: 'Xác nhận',
      message: newMess,
      actions: [
        { text: 'Huỷ' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: callback,
        },
      ],
    });
  };

  // error massage chỉnh sửa lại SL xuất của PXKS
  errorMassageSLX = () => {
    let mess = 'SL xuất trong PXKS và BBGH của Mã Khay Sọt';
    this.dataSection2.forEach(item => {
      if (item.doQuantity - item.deliveryQuantity !== 0) {
        mess += ` ${item.basketCode},`;
      }
    });
    let newMess = mess.substr(0, mess.length - 1);
    newMess += ' là khác nhau. Hãy chỉnh sửa lại SL xuất của PXKS.';
    return newMess;
  };

  // confirm hoàn thành bước xác nhận  phiếu xuất khay sọt
  completeConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message: 'Bạn có chắc chắn muốn hoàn thành xác nhận không ?',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm hoàn thành phiếu xuất khay sọt
  completeNomal = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message:
        'Bạn có chắc chắn muốn hoàn thành phiếu xuất khay sọt này không ?',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm Xuất cho mượn trực tiếp
  isDirectLoanConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo hoàn thành',
      message:
        'Bạn đã chọn [Xuất cho mượn trực tiếp], hệ thống sẽ hoàn thành phiếu và cập nhật [SL thực nhận] = [SL xuất]. Ấn Đồng ý để thực hiện xử lý',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm Xuất trả trực tiếp
  isDirectPaybackConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo hoàn thành',
      message:
        'Bạn đã chọn [Xuất trả trực tiếp], hệ thống sẽ hoàn thành phiếu và cập nhật [SL thực nhận] = [SL xuất]. Ấn [Đồng ý] để thực hiện xử lý',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm không chọn Xuất cho mượn trực tiếp
  isNotDirectLoanConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo hoàn thành',
      message:
        'Bạn không chọn [Xuất cho mượn trực tiếp], Phiếu sẽ có trạng thái [Chờ xác nhận] SL thực nhận từ Vendor. Ấn Đồng ý để thực hiện xử lý',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm khác số lượng
  diffConfirm = () => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message:
        'Số lượng khay sọt ở phiếu xuất khay sọt cho mượn phải phải giống phiếu xuất bán',
      actions: [{ text: 'Đồng ý', color: 'primary' }],
    });
  };

  // confirm không chọn Xuất trả trực tiếp
  isNotDirectPaybackConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo hoàn thành',
      message:
        'Bạn không chọn [Xuất trả trực tiếp], Phiếu sẽ có trạng thái [Chờ xác nhận] SL thực nhận từ Vendor. Ấn Đồng ý để thực hiện xử lý',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm sl thực nhận khác sl xuất [xuất cho mượn]
  diffQuantityConfirm = callback => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message: '[SL xác nhận] khác [SL xuất]. Bạn vẫn muốn tiếp tục!',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  // confirm hoàn thành phiếu Xuất cho mượn với SL thực nhận có chênh lệch với số lượng xuất
  diffQuantityCompleteConfirm = callback => {
    let mess = '';
    this.formik.values.basketDocumentDetails.forEach(item => {
      if (item.quantityActual > item.deliveryQuantity) {
        mess += `Mã khay sọt ${item.basketCode} Kho nguồn ${
          item.locatorDeliver
        } sẽ thực hiện xuất bổ sung SL = ${item.quantityActual -
          item.deliveryQuantity}. \n`;
      } else if (item.quantityActual < item.deliveryQuantity) {
        mess += `Mã khay sọt ${item.basketCode} Kho nguồn ${
          item.locatorDeliver
        } sẽ thực hiện tạo PYC thanh lý/hủy tự động với SL = ${Math.abs(
          item.quantityActual - item.deliveryQuantity,
        )}. \n`;
      }
    });
    this.onConfirmShow({
      title: 'Cảnh báo Hoàn thành',
      message: mess,
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  diffQuantityCompleteConfirmPayback = callback => {
    let mess = '';
    this.formik.values.basketDocumentDetails.forEach(item => {
      if (item.quantityActual > item.deliveryQuantity) {
        if (item.quantityActual <= item.quantityBorrowByVendorActual) {
          mess += `Mã khay sọt ${item.basketCode} của Kho nguồn ${
            item.locatorDeliver
          } sẽ thực hiện xuất bù với SL = ${item.quantityActual -
            item.deliveryQuantity}. \n`;
        } else if (item.quantityActual > item.quantityBorrowByVendorActual) {
          mess += `Mã khay sọt ${item.basketCode} Kho nguồn ${
            item.locatorDeliver
          } sẽ thực hiện xuất cho Vendor cho mượn = ${item.quantityActual -
            item.quantityBorrowByVendorActual}, thực hiện xuất bù với SL = ${Math.abs(
            item.quantityBorrowByVendorActual - item.deliveryQuantity,
          )}.  \n`;
        }
      } else if (item.quantityActual < item.deliveryQuantity) {
        mess += `Mã khay sọt ${item.basketCode} Kho nguồn ${
          item.locatorDeliver
        } sẽ thực hiện tạo PYC thanh lý/hủy tự động với SL = ${Math.abs(
          item.quantityActual - item.deliveryQuantity,
        )}. \n`;
      }
    });
    this.onConfirmShow({
      title: 'Cảnh báo Hoàn thành',
      message: mess,
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: callback },
      ],
    });
  };

  onFormSubmit = values => {
    const newValues = { ...values };
    newValues.dataSection2 = this.dataSection2;
    newValues.errormsg = this.errorMassageSLX();
    const chain = new ConfirmChain({
      finalFunc: () =>
        this.props.onBasketSubmit(
          this.typeForm,
          this.state.actionType,
          newValues,
          this.callbackSubmit,
        ),
    });
    const checkDiffBasket = values.basketDocumentDetails.filter(item => {
      if (item.quantityActual - item.deliveryQuantity !== 0) {
        return item;
      }
      return null;
    });

    const checkBasket = values.basketDocumentDetails.filter(item => {
      if (
        item.quantityActual > item.deliveryQuantity ||
        item.quantityActual < item.deliveryQuantity
      ) {
        return item;
      }
      return null;
    });
    const callback = () => {
      ConfirmChain.prototype.run.call(chain);
    };
    const basketDetails = values.basketDocumentDetails.filter(
      item => item.basketCode,
    );
    if (
      [TYPE_PXKS.PXKS_DIEU_CHUYEN].includes(values.subType.value) &&
      values.deliveryOrderCode === null &&
      basketDetails.length > 0
    ) {
      chain.addToQueue({
        func: this.transformConfirm,
        callback,
      });
    }
    const data = [];
    this.dataSection2.forEach(item => {
      if (item.doQuantity - item.deliveryQuantity !== 0) {
        data.push(item.basketCode);
      }
    });
    if (data.length > 0) {
      if (
        [TYPE_PXKS.PXKS_DIEU_CHUYEN].includes(values.subType.value) &&
        values.referType === 3
      ) {
        chain.addToQueue({
          func: this.updateBasketConfirm,
          callback,
        });
      }
    }

    if (
      [TYPE_PXKS.PXKS_MUON, TYPE_PXKS.PXKS_TRA].includes(
        values.subType.value,
      ) &&
      this.typeForm === TYPE_FORM.CONFIRM &&
      checkDiffBasket.length > 0
    ) {
      chain.addToQueue({
        func: this.diffQuantityConfirm,
        callback,
      });
    }
    if (this.state.actionType === TYPE_ACTION.BASKETS_COMPLETE) {
      if (
        [TYPE_PXKS.PXKS_MUON].includes(values.subType.value) &&
        values.isDirect &&
        this.typeForm !== TYPE_FORM.CONFIRM
      ) {
        chain.addToQueue({
          func: this.isDirectLoanConfirm,
          callback,
        });
      } else if (
        [TYPE_PXKS.PXKS_MUON].includes(values.subType.value) &&
        this.typeForm === TYPE_FORM.CONFIRM &&
        checkBasket.length > 0
      ) {
        chain.addToQueue({
          func: this.diffQuantityCompleteConfirm,
          callback,
        });
      } else if (
        [TYPE_PXKS.PXKS_TRA].includes(values.subType.value) &&
        this.typeForm === TYPE_FORM.CONFIRM &&
        checkBasket.length > 0
      ) {
        chain.addToQueue({
          func: this.diffQuantityCompleteConfirmPayback,
          callback,
        });
      } else if (
        [TYPE_PXKS.PXKS_TRA].includes(values.subType.value) &&
        values.isDirect
      ) {
        chain.addToQueue({
          func: this.isDirectPaybackConfirm,
          callback,
        });
      } else if (
        [TYPE_PXKS.PXKS_MUON].includes(values.subType.value) &&
        !values.isDirect &&
        this.typeForm !== TYPE_FORM.CONFIRM
      ) {
        chain.addToQueue({
          func: this.isNotDirectLoanConfirm,
          callback,
        });
      } else if (
        [TYPE_PXKS.PXKS_TRA].includes(values.subType.value) &&
        !values.isDirect &&
        this.typeForm !== TYPE_FORM.CONFIRM
      ) {
        chain.addToQueue({
          func: this.isNotDirectPaybackConfirm,
          callback,
        });
      } else if (this.typeForm === TYPE_FORM.CONFIRM) {
        chain.addToQueue({
          func: this.completeConfirm,
          callback,
        });
      } else {
        chain.addToQueue({
          func: this.completeNomal,
          callback,
        });
      }
    }
    chain.run();
  };

  onBasketSubmit = (actionType, callback) => {
    this.setState({ actionType }, () => callback());
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  onGoToListPage = () => {
    this.props.history.push('/danh-sach-phieu-xuat-kho-khay-sot');
  };

  preview = () => {
    const { onPrintPreview, dataValues } = this.props;
    onPrintPreview(dataValues, content => {
      this.setState({ printPreview: true, printPreviewContent: content });
    });
  };

  closePrintPreview = () => {
    this.setState({
      printPreview: false,
      printPreviewContent: '',
    });
  };

  print = dataValues => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message: 'Bạn có chắc chắn muốn in không ?',
      actions: [
        { text: 'Bỏ qua' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () =>
            this.props.onExportPdf({ ...dataValues, onRePrint: false }),
        },
      ],
    });
  };

  rePrint = dataValues => {
    if (dataValues.printTimes === 0) {
      this.onConfirmShow({
        title: 'Cảnh báo',
        message: 'Bạn có chắc chắn muốn in không ?',
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              this.props.onExportPdf({ ...dataValues, onRePrint: false });
            },
          },
        ],
      });
    } else
      this.onConfirmShow({
        title: 'Xác nhận',
        message: 'Có phải bạn muốn in lại lần đầu không ?',
        actions: [
          {
            text: 'Sai',
            color: 'primary',
            onClick: () =>
              this.props.onExportPdf({ ...dataValues, onRePrint: false }),
          },
          {
            text: 'Đúng',
            color: 'primary',
            onClick: () =>
              this.props.onExportPdf({ ...dataValues, onRePrint: true }),
          },
        ],
      });
  };

  // on saving cancel receipt
  onSaveCancelReceipt = formik => {
    const { onSubmitSaveCancelReceipt, history } = this.props;
    const { id } = getUrlParams(history);
    onSubmitSaveCancelReceipt(formik, id, this.onGoToListPage);
  };

  // on completing cancel receipt
  onCompleteCancelReceipt = formik => {
    const { onSubmitCompleteCancelReceipt, history } = this.props;
    const { id } = getUrlParams(history);
    const f = generalSectionFields;
    const needConfirmation = getNested(formik.values, f.needConfirmation);
    const popup = getNested(this.quickPopupRef, 'current');

    if (needConfirmation && popup) {
      popup.open({
        title: 'Cảnh báo',
        message:
          'Giá trị hủy tại thời điểm hủy khác với Giá trị hủy (tạm tính) lúc tạo PYCH. Ấn Đồng ý để thực hiện xuất hủy',
        actions: [
          { text: 'Bỏ qua', outlined: true },
          {
            text: 'Đồng ý',
            onClick: () =>
              onSubmitCompleteCancelReceipt(formik, id, this.onGoToListPage),
          },
        ],
      });
    } else {
      popup.open({
        title: 'Xác nhận',
        message: 'Bạn có muốn hoàn thành phiếu không?',
        actions: [
          { text: 'Bỏ qua', outlined: true },
          {
            text: 'Đồng ý',
            onClick: () =>
              onSubmitCompleteCancelReceipt(formik, id, this.onGoToListPage),
          },
        ],
      });
    }
  };

  /**
   * @return {{confirm: boolean, view: boolean, edit: boolean, create: boolean}}
   */
  getPageType = () => {
    const { history } = this.props;
    const { form } = getUrlParams(history);
    return {
      create: String(form) === TYPE_FORM.CREATE,
      edit: String(form) === TYPE_FORM.EDIT,
      view: String(form) === TYPE_FORM.VIEW,
      confirm: String(form) === TYPE_FORM.CONFIRM,
    };
  };

  /**
   * Check and set isCancelReceipt state
   * @param formik
   */
  checkIsCancelReceipt = formik => {
    const f = generalSectionFields;

    if (
      getNested(formik.values[f.subType], 'value') === TYPE_PXKS.PXKS_HUY &&
      !this.state.isCancelReceipt
    ) {
      this.setState({ isCancelReceipt: true });
    } else if (
      getNested(formik.values[f.subType], 'value') !== TYPE_PXKS.PXKS_HUY &&
      this.state.isCancelReceipt
    ) {
      this.setState({ isCancelReceipt: false });
    }
  };

  render() {
    const { data, classes, config, onShowWarning, dispatch } = this.props;
    const pageType = this.getPageType();
    const validationSchema = this.state.isCancelReceipt
      ? makeCancelReceiptSchema()
      : config.validSchema;
    return (
      <FormWrapper
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        onConfirmShow={this.onConfirmShow}
        FormikProps={{
          validateOnBlur: true,
          validateOnChange: true,
        }}
        render={formik => {
          this.formik = formik;
          this.checkIsCancelReceipt(formik);

          // Check trường hợp loại xuất kho là phiếu xuất huỷ
          const isCancelReceipt =
            getNested(formik.values, 'subType', 'value') === TYPE_PXKS.PXKS_HUY;

          return (
            <>
              <div style={{ margin: '12px 0px' }}>
                {this.typeForm === TYPE_FORM.CREATE && (
                  <Typography variant="h5" color="textPrimary">
                    Tạo Phiếu Xuất Khay Sọt
                  </Typography>
                )}
                {this.typeForm === TYPE_FORM.EDIT && (
                  <Typography variant="h5" color="textPrimary">
                    Chỉnh Sửa Phiếu Xuất Khay Sọt
                  </Typography>
                )}
                {this.typeForm === TYPE_FORM.VIEW && (
                  <Typography variant="h5" color="textPrimary">
                    Xem Phiếu Xuất Khay Sọt
                  </Typography>
                )}
                {this.typeForm === TYPE_FORM.CONFIRM && (
                  <Typography variant="h5" color="textPrimary">
                    Xác Nhận Phiếu Xuất Khay Sọt
                  </Typography>
                )}
              </div>
              {this.typeForm === TYPE_FORM.CREATE && (
                <CreatePage
                  {...this.props}
                  formik={formik}
                  setDataSection2={this.setDataSection2}
                  dataSection2={this.dataSection2}
                />
              )}
              {this.typeForm === TYPE_FORM.EDIT && (
                <EditPage
                  {...this.props}
                  formik={formik}
                  setDataSection2={this.setDataSection2}
                  dataSection2={this.dataSection2}
                />
              )}
              {this.typeForm === TYPE_FORM.VIEW && (
                <ViewPage
                  {...this.props}
                  onPreview={this.preview}
                  onPrint={this.print}
                  onRePrint={this.rePrint}
                  formik={formik}
                  setDataSection2={this.setDataSection2}
                  dataSection2={this.dataSection2}
                />
              )}
              {this.typeForm === TYPE_FORM.CONFIRM && (
                <ConfirmPage
                  formik={formik}
                  {...this.props}
                  setDataSection2={this.setDataSection2}
                  dataSection2={this.dataSection2}
                />
              )}

              {!isCancelReceipt && (
                <>
                  <div>
                    <Grid
                      container
                      spacing={16}
                      justify="flex-end"
                      className={classes.actions}
                    >
                      <Grid item>
                        <CustomButton
                          text={BTN_CANCEL}
                          outline
                          onClick={this.onGoBack}
                        />
                      </Grid>

                      <WrapperBusiness
                        code={CODE.SAVE_TABLE}
                        formik={formik}
                        typeForm={this.typeForm}
                      >
                        {props => (
                          <Grid item>
                            <CustomButton
                              text={BTN_SAVE}
                              type="submit"
                              onClick={() => {
                                if (props.rowsIsDublicated) {
                                  onShowWarning(props.dupicatedMessage);
                                } else {
                                  this.onBasketSubmit(
                                    TYPE_ACTION.BASKETS_SAVE,
                                    () => formik.handleSubmitClick(),
                                  );
                                }
                              }}
                            />
                          </Grid>
                        )}
                      </WrapperBusiness>
                      <WrapperBusiness
                        code={CODE.COMPLETE_TABLE}
                        formik={formik}
                        typeForm={this.typeForm}
                      >
                        {props => (
                          <Grid item>
                            <CompleteButton
                              text={BTN_COMPLETE}
                              className={classes.completeButton}
                              disabled={props.disabled}
                              onClick={() => {
                                if (props.rowsIsMinBasketsRecord) {
                                  onShowWarning(props.minBasketsRecordMessages);
                                } else if (props.rowsIsDublicated) {
                                  onShowWarning(props.dupicatedMessage);
                                } else
                                  this.onBasketSubmit(
                                    TYPE_ACTION.BASKETS_COMPLETE,
                                    formik.handleSubmitClick,
                                  );
                              }}
                            />
                          </Grid>
                        )}
                      </WrapperBusiness>
                    </Grid>
                  </div>
                  <PrintPreview
                    content={this.state.printPreviewContent}
                    open={this.state.printPreview}
                    close={this.closePrintPreview}
                  />
                </>
              )}

              {isCancelReceipt && (
                <>
                  <div className={classes.actionsContainer}>
                    <MuiButton outline onClick={this.onGoBack}>
                      QUAY LẠI
                    </MuiButton>
                    {(pageType.create || pageType.edit) && (
                      <>
                        <MuiButton
                          onClick={() => {
                            formik.validateForm().then(res => {
                              if (res && Object.keys(res).length) {
                                formik.setErrors(res);
                                formik.setTouched(res);
                                dispatch(
                                  loadingError(
                                    'Thông tin đã nhập chưa đủ hoặc không đúng. Vui lòng kiểm tra lại!',
                                  ),
                                );
                                return;
                              }

                              this.onSaveCancelReceipt(formik);
                            });
                          }}
                        >
                          LƯU
                        </MuiButton>
                        <Button
                          variant="contained"
                          className={classes.completeButton}
                          onClick={() => {
                            formik.validateForm().then(res => {
                              if (res && Object.keys(res).length) {
                                formik.setErrors(res);
                                formik.setTouched(res);
                                dispatch(
                                  loadingError(
                                    'Thông tin đã nhập chưa đủ hoặc không đúng. Vui lòng kiểm tra lại!',
                                  ),
                                );
                                return;
                              }

                              this.onCompleteCancelReceipt(formik);
                            });
                          }}
                        >
                          HOÀN THÀNH
                        </Button>
                      </>
                    )}
                  </div>

                  <QuickPopup ref={this.quickPopupRef} />
                </>
              )}

              <ConfirmationDialog
                ref={ref => {
                  this.confirmRef = ref;
                }}
              />
            </>
          );
        }}
      />
    );
  }
}

ExportedBaskets.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  data: PropTypes.object,
  classes: PropTypes.object,
  onShowWarning: PropTypes.func,
  onLoadingError: PropTypes.func,
  location: PropTypes.object,
  onInitValue: PropTypes.func,
  config: PropTypes.object,
  onBasketSubmit: PropTypes.func,
  onChangeField: PropTypes.func,
  onFetchCancelRequestsAC: PropTypes.func,
  onFetchCancelReceiptByRequestId: PropTypes.func,
  onSubmitSaveCancelReceipt: PropTypes.func,
  onSubmitCompleteCancelReceipt: PropTypes.func,
  dispatch: PropTypes.func,
  onFetchCancelReceiptById: PropTypes.func,
  onPrintCancelReceipt: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  data: selectors.dataValues(),
  config: selectors.configData(),
  dataValues: selectors.dataValues(),
  formOption: selectors.formOptions(),
  typeExported: selectors.typeExported(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeField: payload => dispatch(actions.changeField(payload)),
    onShowWarning: message => dispatch(showWarning(message)),
    onLoadingError: message => dispatch(loadingError(message)),
    onInitValue: payload => dispatch(actions.getValueForm(payload)),
    onBasketSubmit: (typeForm, type, data, callback) => {
      dispatch(actions.basketsSaveComplete(typeForm, type, data, callback));
    },
    onAddRows: () => dispatch(actions.addRows()),
    onChangeType: payload => dispatch(actions.changeSaga(payload)),
    onChangeDeliver: payload => dispatch(actions.changeDeliver(payload)),
    onGetPlants: (inputValue, typeExported, callback) =>
      dispatch(actions.getReceiverPlant(inputValue, typeExported, callback)),
    onChangeDelivery: payload => dispatch(actions.changeDelivery(payload)),
    onChangeSellDocument: payload =>
      dispatch(actions.changeSellDocument(payload)),
    onChangeUser: payload => dispatch(actions.changeUser(payload)),
    onGetDeliveryOrder: (
      inputValue,
      receiverCode,
      deliveryCode,
      subType,
      callback,
    ) =>
      dispatch(
        actions.getDelivery(
          inputValue,
          receiverCode,
          deliveryCode,
          subType,
          callback,
        ),
      ),
    onPrintPreview: (formValues, callback) =>
      dispatch(actions.printPreview(formValues, callback)),
    onExportPdf: formValues => dispatch(actions.exportPdf(formValues)),
    onResetBasketsDetail: payload =>
      dispatch(actions.resetBasketsDetail(payload)),
    onDeleteRow: rowIndex => dispatch(actions.deleteRow(rowIndex)),
    onDeleteRowServer: (id, idRow, rowIndex) =>
      dispatch(actions.deleteRowServer(id, idRow, rowIndex)),
    onUpdateBasketDocumentDetails: payload =>
      dispatch(actions.updateBasketDocumentDetails(payload)),
    onFetchAutocomplete: payload =>
      dispatch(actions.fetchAutocomplete(payload)),
    onChangeBasketsCode: payload =>
      dispatch(actions.changeBasketsCode(payload)),
    onResetDeliveryOrder: () => dispatch(actions.resetDeliveryOrder()),
    onResetDocumnetSell: () => dispatch(actions.resetDocumentSell()),
    onGetLoanBasket: payload => dispatch(actions.getLoanBasket(payload)),
    onFetchCancelRequestsAC: (formik, inputText, callback = undefined) =>
      dispatch(actions.fetchCancelRequestsAC(formik, inputText, callback)),
    onFetchCancelReceiptByRequestId: (cancelReceipt, callback = undefined) =>
      dispatch(actions.fetchCancelReceiptByRequestId(cancelReceipt, callback)),
    onFetchBigImageBasket: (id, callback) =>
      dispatch(actions.fetchBigImageBasket(id, callback)),
    onSubmitSaveCancelReceipt: (formik, receiptId, callback) =>
      dispatch(actions.submitSaveCancelReceipt(formik, receiptId, callback)),
    onSubmitCompleteCancelReceipt: (formik, receiptId, callback) =>
      dispatch(
        actions.submitCompleteCancelReceipt(formik, receiptId, callback),
      ),
    onFetchCancelReceiptById: (id, callback) =>
      dispatch(actions.fetchCancelReceiptById(id, callback)),
    onPrintCancelReceipt: (formik, isPreview, isReprint, callback) =>
      dispatch(
        actions.printCancelReceipt(formik, isPreview, isReprint, callback),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'exportedBaskets', reducer });
const withSaga = injectSaga({ key: 'exportedBaskets', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
  withRouter,
  withImmutablePropsToJs,
  withStyles(styles),
)(ExportedBaskets);
