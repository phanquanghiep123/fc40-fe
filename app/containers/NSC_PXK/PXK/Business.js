import React from 'react';
import PropTypes from 'prop-types';
import { find, has } from 'lodash';
import { TYPE_PXK, STATUS_PXK } from './constants';
import messages from './messages';

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
  TABLE_1: 1, // bảng thông tin hàng hóa cần điều chuyển
  // xuất điều chuyển farm
  TABLE_2: 10, // bảng thông tin sản phẩm của phiếu xuất điều chuyển farm
  TABLE_3: 16, // bảng thông tin sản phẩm của phiếu xuât  hủy
  TABLE_4: 17, // Bảng thông tin sản phẩm của phiếu xuất bán
  TRANSPOTER: 18, // Nhà vận chuyển
  CHECKBOX_PXB: 19, // Checkbox chia chọn thực tế phiếu xuất bán
  CHANNEL: 20, // kênh phiếu xuất bán
  SELL_TYPE: 21, // loại đơn bán hàng phiếu xuất bán
  BASKET_MANGAGER: 22, // đơn vị quản lý khay sọt phiếu xuất bán
  DATE: 23,
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
    typePXK: PropTypes.number,
    formik: PropTypes.object,
    sellTypes: PropTypes.any,
  };

  render() {
    const { saved, code, typeForm, typePXK, formik, children } = this.props;

    // props is inject depend on bussiness logic
    let injectedProps = {
      maxDate: undefined,
      disabled: true,
      rowsIsDublicated: false,
      isFarmTransition: false,
      isDestroy: false,
      isSell: false,
      isInternal: false,
      selectedtype: [], // view/edit loại xuất kho
      channels: [], // kênh lựa chọn - phiếu xuất bán
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

        if (
          typeForm === TYPE_FORM.CREATE &&
          !saved &&
          [
            TYPE_PXK.PXK_NOI_BO,
            TYPE_PXK.PXK_XDC_FARM,
            TYPE_PXK.PXK_XUAT_BAN,
            TYPE_PXK.PXK_XUAT_BAN_XA,
          ].includes(values.subType)
        ) {
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
      // bảng thông tin hàng hóa cần điều chuyển
      // bảng thông tin sản phẩm của phiếu xuất điều chuyển plant to plant
      // bảng thông tin sản phẩm của phiếu xuât  hủy
      case CODE.TABLE_1:
      case CODE.TABLE_2:
      case CODE.TABLE_3:
      case CODE.TABLE_4: {
        const { values } = formik;
        if (
          [TYPE_FORM.CREATE].includes(typeForm) &&
          [TYPE_PXK.PXK_NOI_BO, TYPE_PXK.PXK_XDC_FARM].includes(
            values.subType,
          ) &&
          !saved
        ) {
          injectedProps = null;
        }

        if (
          ([TYPE_FORM.CREATE].includes(typeForm) && saved) ||
          ([TYPE_FORM.CREATE].includes(typeForm) &&
            values.subType === TYPE_PXK.PXK_XUAT_HUY) ||
          [TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)
        ) {
          switch (values.subType) {
            case TYPE_PXK.PXK_XDC_FARM:
              injectedProps.isFarmTransition = true; // xuất điều chuyển farm
              break;
            case TYPE_PXK.PXK_NOI_BO:
              injectedProps.isInternal = true; // xuất chuyển nội bộ
              break;
            case TYPE_PXK.PXK_XUAT_HUY:
              injectedProps.isDestroy = true; // Xuất Hủy
              break;
            case TYPE_PXK.PXK_XUAT_BAN:
              injectedProps.isSell = true; // Xuất Hủy
              break;
            default:
              break;
          }
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
      case CODE.RECEIVER_CODE: {
        if ([TYPE_PXK.PXK_NOI_BO, TYPE_PXK.PXK_XUAT_HUY].includes(typePXK)) {
          injectedProps = null;
          break;
        }

        // form tạo cho phép sửa, sửa xong sẽ xóa sản phẩm chưa lưu vào db
        if (typeForm === TYPE_FORM.CREATE) {
          injectedProps.disabled = false;
        }

        if (
          ![TYPE_FORM.VIEW].includes(typeForm) &&
          typePXK === TYPE_PXK.PXK_XUAT_BAN
        ) {
          if (
            formik.values.detailsCommands &&
            formik.values.detailsCommands.length > 0 &&
            formik.values.detailsCommands.filter(item => item.isFromDeli)
              .length === 0
          ) {
            injectedProps.disabled = false;
          }
        }

        if (
          ![TYPE_FORM.VIEW].includes(typeForm) &&
          typePXK === TYPE_PXK.PXK_XDC_FARM
        ) {
          if (
            formik.values.detailsCommands &&
            formik.values.detailsCommands.length > 0 &&
            formik.values.detailsCommands.filter(
              item => item.isFromDeli && item.isNotSaved,
            ).length > 0
          ) {
            injectedProps.disabled = false;
          }
        }

        if (
          [TYPE_FORM.EDIT].includes(typeForm) &&
          formik.values.detailsCommands &&
          formik.values.detailsCommands.length === 0
        ) {
          injectedProps.disabled = false;
        }

        if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
          const {
            values: { receiverCode, receiverName },
          } = formik;
          injectedProps.selecImportUnit = [
            { id: receiverCode, name: receiverName },
          ];
        }

        break;
      }
      case CODE.DELIVER_CODE: {
        if (typeForm === TYPE_FORM.CREATE) {
          injectedProps.disabled = false;
        }
        if (
          [TYPE_FORM.CREATE, TYPE_FORM.EDIT].includes(typeForm) &&
          formik.values.detailsCommands &&
          formik.values.detailsCommands.filter(
            item => has(item, 'id') && item.id !== null,
          ).length === 0
        ) {
          injectedProps.disabled = false;
        }
        break;
      }
      case CODE.ACTION_GROUP1:
        // tạo đã lưu thành công hoặc xem, sửa thì không hiển thị
        if (
          (typeForm === TYPE_FORM.CREATE && saved) ||
          [TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm) ||
          TYPE_PXK.PXK_XUAT_HUY === formik.values.subType
        ) {
          injectedProps = null;
        }
        break;
      case CODE.NOTE_FIELD:
      case CODE.GROUP_REQUIRED: {
        const {
          values: { status },
        } = formik;

        // pxk hoàn thành disable
        if (status !== STATUS_PXK.SCALING) {
          injectedProps.disabled = true;
          break;
        }

        if ([TYPE_FORM.EDIT, TYPE_FORM.CREATE].includes(typeForm)) {
          injectedProps.disabled = false;
        }
        break;
      }
      case CODE.DATE: {
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
        if (subType === TYPE_PXK.PXK_XDC_FARM) {
          if (
            formik.values.detailsCommands &&
            formik.values.detailsCommands.length > 0 &&
            formik.values.detailsCommands.filter(
              item => item.isFromDeli && !item.isNotSaved,
            ).length > 0
          ) {
            injectedProps.disabled = true;
          }
        }
        if (subType === TYPE_PXK.PXK_XUAT_BAN) {
          injectedProps.maxDate = new Date();
          if (
            formik.values.detailsCommands &&
            formik.values.detailsCommands.length > 0 &&
            formik.values.detailsCommands.filter(item => item.isTurnToScale)
              .length > 0
          ) {
            injectedProps.disabled = true;
          }
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
          let keys = [];
          if (subType === TYPE_PXK.PXK_NOI_BO) {
            // Trường hợp có nhiều hơn 1 dòng có cùng:
            // Kho nguồn, Mã sản phẩm, Batch, Kho đích
            keys = detailsCommands
              .map(row => ({
                locatorNameFrom: row.locatorNameFrom,
                productCode: row.productCode,
                slotCode: row.slotCode,
                locatorNameTo: row.locatorNameTo,
              }))
              .map(group => JSON.stringify(group));
          } else if (subType === TYPE_PXK.PXK_XDC_FARM) {
            keys = detailsCommands
              .map(row => ({
                productCode: row.productCode,
                slotCode: row.slotCode,
                locatorId: row.locatorId,
                processingType: row.processingType,
              }))
              .map(group => JSON.stringify(group));
          } else if (subType === TYPE_PXK.PXK_XUAT_BAN) {
            keys = detailsCommands
              .map(row => ({
                locatorId: row.locatorId,
                productCode: row.productCode,
                batch: row.batch ? row.batch.toString() : row.batch,
              }))
              .map(group => JSON.stringify(group));
          }
          if (hasDuplicates(keys)) {
            injectedProps.rowsIsDublicated = true;
            if (subType === TYPE_PXK.PXK_NOI_BO) {
              injectedProps.dupicatedMessage = messages.DUPLICATE_RECORDS;
            }
            if (subType === TYPE_PXK.PXK_XDC_FARM) {
              injectedProps.dupicatedMessage = messages.DUPLICATE_RECORDS_FARM;
            }
            if (subType === TYPE_PXK.PXK_XUAT_BAN) {
              injectedProps.dupicatedMessage = messages.DUPLICATE_RECORDS_SELL;
            }
          }
        }

        break;
      }
      case CODE.TRANSPOTER:
      case CODE.BASKET_MANGAGER:
      case CODE.SELL_TYPE: {
        const {
          values: { subType },
        } = formik;
        if (typeForm === TYPE_FORM.CREATE || typeForm === TYPE_FORM.EDIT) {
          injectedProps.disabled = false;
        }
        if (subType !== TYPE_PXK.PXK_XUAT_BAN) injectedProps = null;
        break;
      }
      case CODE.CHANNEL: {
        const {
          values: { subType, orderTypeCode },
        } = formik;
        const { sellTypes } = this.props;
        if (
          orderTypeCode &&
          (typeForm === TYPE_FORM.CREATE || typeForm === TYPE_FORM.EDIT)
        ) {
          injectedProps.disabled = false;
        }
        const sellType = find(sellTypes, item => item.code === orderTypeCode);
        injectedProps.channels = sellType ? sellType.distributionChannel : [];
        if (subType !== TYPE_PXK.PXK_XUAT_BAN) injectedProps = null;
        break;
      }
      case CODE.CHECKBOX_PXB: {
        const {
          values: { subType },
        } = formik;
        if (
          (formik.values.detailsCommands &&
            formik.values.detailsCommands.length === 0) ||
          ((formik.values.detailsCommands &&
            formik.values.detailsCommands.length > 0 &&
            formik.values.detailsCommands.filter(item => item.isFromDeli)
              .length === 0) ||
            formik.values.detailsCommands.filter(item => item.isFromDeli)
              .length ===
              formik.values.detailsCommands.filter(item => item.canRemove)
                .length)
        )
          injectedProps.disabled = typeForm === TYPE_FORM.VIEW;

        if (subType !== TYPE_PXK.PXK_XUAT_BAN || !saved) injectedProps = null;
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
  sellTypes: [],
};
