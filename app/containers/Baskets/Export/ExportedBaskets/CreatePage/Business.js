// import React from 'react';
import PropTypes from 'prop-types';
import { connect as connectFormik } from 'formik';
import messages from './messages';
import { TYPE_PXKS, TYPE_FORM } from './constants';

export const hasDuplicates = array => new Set(array).size !== array.length;

export const CODE = {
  SUBTYPE_CODE: 1, // Component select loại xuất kho
  RECIEVER_CODE: 2, //  Component select đơn vị giao hàng
  DELIVER_CODE: 3, // Component select đơn vị nhận hàng
  DELIVER_ORDER_CODE: 4, // Component select mã BBGH
  GUARANTOR_CODE: 5, // Component select người bảo lãnh
  SUPERVISOR_CODE: 6, // Component select nhân viên giám sát
  COMPLETE_TABLE: 7,
  SAVE_TABLE: 8,
  DATE: 9, // ngày xuất kho
  NOTE: 10, // ghi chú
  USER_CODE: 11, // component select người xuất kho
};

export function WrapperBusiness({ formik, code, children, typeForm }) {
  let injectedProps = {
    disabled: false,
    rowsIsDublicated: false,
    rowsIsMinBasketsRecord: false,
    dupicatedMessage: '', // thông báo lỗi khi có 2 dòng trùng nhau
    minBasketsRecordMessages: '',
  };
  switch (code) {
    case CODE.SAVE_TABLE: {
      const { basketDocumentDetails, subType } = formik.values;
      if (typeForm === TYPE_FORM.VIEW) {
        injectedProps = null;
        break;
      }
      const basketDetails = basketDocumentDetails.filter(
        item => item && item.basketCode,
      );
      if (basketDetails.length > 0) {
        let keys = [];
        if (subType === TYPE_PXKS.PXKS_DIEU_CHUYEN) {
          keys = basketDetails
            .map(row => ({
              basketCode: row.basketCode,
            }))
            .map(group => JSON.stringify(group));
        }
        if (hasDuplicates(keys)) {
          injectedProps.rowsIsDublicated = true;
          if (subType === TYPE_PXKS.PXKS_DIEU_CHUYEN) {
            injectedProps.dupicatedMessage = messages.DUPLICATE_RECORDS;
          }
        }
      }
      break;
    }

    case CODE.COMPLETE_TABLE: {
      const { basketDocumentDetails } = formik.values;
      if (typeForm === TYPE_FORM.VIEW) {
        injectedProps = null;
        break;
      }
      const basketDetails = basketDocumentDetails.filter(
        item => item && item.basketCode,
      );
      if (basketDetails && basketDetails.length < 1) {
        injectedProps.disabled = true;
        injectedProps.rowsIsMinBasketsRecord = true;
        injectedProps.minBasketsRecordMessages = messages.MIN_BASKET_RECORDS;
      }
      break;
    }

    default:
      break;
  }

  if (injectedProps !== null) {
    if (typeof children === 'function') {
      return children(injectedProps);
    }
    return children;
  }
  return null;
}

WrapperBusiness.propTypes = {
  formik: PropTypes.object,
  code: PropTypes.number,
  children: PropTypes.any,
  typeForm: PropTypes.string,
  typePXKS: PropTypes.number,
};

export default connectFormik(WrapperBusiness);
