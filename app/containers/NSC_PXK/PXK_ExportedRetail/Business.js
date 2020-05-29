import React from 'react';
import PropTypes from 'prop-types';
// import { isEmpty } from 'lodash';
import { TYPE_PXK, STATUS_PXK } from '../PXK/constants';
import messages from '../PXK/messages';

// utils function
export const hasDuplicates = array => new Set(array).size !== array.length;

/**
 * @description
 * code Component need apply bussiness logic
 */
export const CODE = {
  // Tạo phiếu xuất chuyển nội bộ
  SELECT_TYPE_PXK: 2, // Component select loại phiếu xuất kho
  RECEIVER_CODE: 3, // Component select đơn vị nhận hàng
  ACTION_GROUP1: 4, // nhóm actions tạo phiếu xuất kho
  DELIVER_CODE: 5, // Component select đơn vị giao hàng
  GROUP_REQUIRED: 6, // nhóm các Component được yêu cầu nhập
  NOTE_FIELD: 7, // Component ghi chú
  SAVE_TABLE: 8, // Button save thông tin sản phẩm xuất kho
  COMPLETE_TABLE: 9, // Button complete thông tin sản phẩm xuất kho
  GROUP_BUTTONS: 11, // nhóm các button (table)
  CODE_PXK: 12, // mã phiếu xuất kho (edit/view)
  BUTTON_ADD_ROW: 13, // Button thêm row mới cho table
  SELECT_PYCH: 14, // select phiếu yêu cầu hủy
  GROUP_PXK_DESTROY: 15, // Nhóm fields bị disable của phiếu xuất hủy
  TABLE: 1, // bảng thông tin hàng hóa cần điều chuyển
  BUSINESS_OBJECT: 16, // Đối Tượng Bán Hàng
  PAYMENT_TYPE: 17, // Hình thức thanh toán
  TRANSPOTER: 18, // Nhà vận chuyển
  DISABLE_ON_VIEW: 19, // disable khi view
  BASKET_MANGAGER: 22, // đơn vị quản lý khay sọt phiếu xuất bán
};

export const TYPE_FORM = {
  CREATE: '1',
  EDIT: '2',
  VIEW: '3',
};

export default class WrapperBusiness extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    saved: PropTypes.bool,
    code: PropTypes.number,
    typeForm: PropTypes.string,
    formik: PropTypes.object,
  };

  render() {
    const { saved, code, typeForm, formik, children } = this.props;

    // props is inject depend on bussiness logic
    let injectedProps = {
      maxDate: null,
      disabled: true,
      rowsIsDublicated: false,
      selectedtype: [], // view/edit loại xuất kho
      selecImportUnit: [], // view/edit đơn vị nhận hàng đã lưu
      selectReceiptCode: [], // view/edit đơn vị nhận hàng đã lưu
      isCompletePxk: false, // mặc định phiếu xuất kho chưa hoàn thành
      multiline: true, // ghi chú nhiều dòng
      dupicatedMessage: '', // thông báo lỗi khi có 2 dòng trùng nhau
    };
    // code inject khi implement
    switch (code) {
      // Button thêm row mới cho table
      case CODE.BUTTON_ADD_ROW: {
        const { values } = formik;
        if (
          typeForm === TYPE_FORM.VIEW ||
          (typeForm === TYPE_FORM.EDIT && values.status !== STATUS_PXK.SCALING)
        ) {
          injectedProps = null;
        }

        break;
      }
      // mã phiếu xuất kho (edit/view)
      case CODE.CODE_PXK:
        if (![TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
          injectedProps = null;
        }
        break;
      // nhóm các button (table) bao gồm quay lại, lưu, hoàn thành
      case CODE.GROUP_BUTTONS: {
        const { values } = formik;
        if (typeForm === TYPE_FORM.CREATE && !saved) {
          injectedProps = null;
        }
        if (
          [TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm) &&
          values.status !== STATUS_PXK.SCALING
        ) {
          injectedProps.isCompletePxk = true;
        }
        break;
      }
      case CODE.GROUP_PXK_DESTROY: {
        const {
          values: { subType },
        } = formik;

        if (subType !== TYPE_PXK.PXK_XUAT_HUY) {
          injectedProps = null;
        }
        break;
      }
      case CODE.SELECT_PYCH: {
        const {
          values: { subType, receiptCode },
        } = formik;
        if (typeForm === TYPE_FORM.CREATE) {
          injectedProps.selectReceiptCode = [];
          injectedProps.disabled = false;
        }
        if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
          injectedProps.selectReceiptCode = [receiptCode];
        }

        if (
          subType !== TYPE_PXK.PXK_XUAT_HUY // (subType === TYPE_PXK.PXK_XUAT_HUY && typeForm !== TYPE_FORM.VIEW)
        ) {
          injectedProps = null;
        }
        break;
      }
      case CODE.SELECT_TYPE_PXK: {
        if (typeForm === TYPE_FORM.CREATE && !saved) {
          injectedProps.disabled = false;
          injectedProps.selectedtype = [];
        }
        // if (
        //   typeForm === TYPE_FORM.EDIT &&
        //   formik.values.detailsCommands &&
        //   formik.values.detailsCommands.length === 0
        // ) {
        //   injectedProps.disabled = false;
        // }
        if (typeForm === TYPE_FORM.VIEW) {
          injectedProps.disabled = true;
        }

        if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
          const {
            values: { subTypeName, subType },
          } = formik;

          injectedProps.selectedtype = [{ id: subType, name: subTypeName }];
        }
        break;
      }
      case CODE.DELIVER_CODE: {
        if ([TYPE_FORM.CREATE].includes(typeForm)) {
          injectedProps.disabled = false;
        }
        if (
          [TYPE_FORM.EDIT, TYPE_FORM.CREATE].includes(typeForm) &&
          formik.values.detailsCommands &&
          formik.values.detailsCommands.length === 0
        ) {
          injectedProps.disabled = false;
        }

        break;
      }
      case CODE.ACTION_GROUP1:
        // tạo đã lưu thành công hoặc xem, sửa thì không hiển thị
        if (
          (typeForm === TYPE_FORM.CREATE && saved) ||
          [TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)
        ) {
          injectedProps = null;
        }
        break;
      case CODE.NOTE_FIELD:
      case CODE.GROUP_REQUIRED: {
        const {
          values: { status, subType },
        } = formik;

        // pxk hoàn thành disable
        if (status !== STATUS_PXK.SCALING) {
          injectedProps.disabled = true;
          break;
        }

        if ([TYPE_FORM.EDIT, TYPE_FORM.CREATE].includes(typeForm)) {
          injectedProps.disabled = false;
        }
        if (subType === TYPE_PXK.PXK_XUAT_BAN) {
          injectedProps.maxDate = new Date();
        }
        break;
      }
      // table
      case CODE.COMPLETE_TABLE: {
        const {
          values: { detailsCommands, subType },
        } = formik;

        // tất cả số lượng xuất lớn hơn 0 thì cho phép hoàn thành
        const isLagerZero = detailsCommands.every(
          product => product.exportedQuantity > 0 || product.quantity > 0,
        );

        if (detailsCommands.length > 0 && isLagerZero) {
          injectedProps.disabled = false;
        }
        // không hiển thị nếu là phiếu xuất hủy và trạng thái view
        if (subType === TYPE_PXK.PXK_XUAT_HUY && typeForm === TYPE_FORM.VIEW) {
          injectedProps = null;
        }
        break;
      }
      case CODE.TABLE: {
        if ([TYPE_FORM.CREATE].includes(typeForm) && !saved) {
          injectedProps = null;
        }
        break;
      }
      case CODE.SAVE_TABLE: {
        const {
          values: { detailsCommands, subType },
        } = formik;
        injectedProps.disabled = false;
        if (typeForm === TYPE_FORM.VIEW) {
          injectedProps = null;
          break;
        }

        if (detailsCommands.length > 0) {
          const keys = detailsCommands
            .map(row => ({
              locatorId: row.locatorId,
              productCode: row.productCode,
              slotCode: row.slotCode ? row.slotCode.toString() : row.batch,
            }))
            .map(group => JSON.stringify(group));
          if (hasDuplicates(keys)) {
            injectedProps.rowsIsDublicated = true;
            if (subType === TYPE_PXK.PXK_XUAT_BAN_XA) {
              injectedProps.dupicatedMessage =
                messages.DUPLICATE_RECORDS_EXPORTED_RETAIL;
            }
          }
        }

        break;
      }
      case CODE.DISABLE_ON_VIEW: {
        if (typeForm !== TYPE_FORM.VIEW) {
          injectedProps.disabled = false;
        }
        break;
      }
      case CODE.TRANSPOTER:
      case CODE.BASKET_MANGAGER: {
        const {
          values: { subType },
        } = formik;
        if (typeForm === TYPE_FORM.CREATE || typeForm === TYPE_FORM.EDIT) {
          injectedProps.disabled = false;
        }
        if (subType !== TYPE_PXK.PXK_XUAT_BAN) injectedProps = null;
        break;
      }
      default:
        break;
    }

    let content = null;
    if (injectedProps !== null && typeof children === 'function') {
      content = children(injectedProps); // children recive props
    } else if (injectedProps !== null && typeof children !== 'function') {
      content = children; // children not recive props
    }

    return content;
  }
}

WrapperBusiness.defaultProps = {
  saved: false,
  typeForm: TYPE_FORM.CREATE,
};
