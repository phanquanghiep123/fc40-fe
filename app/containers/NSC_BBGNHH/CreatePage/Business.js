import PropTypes from 'prop-types';

import { connect as connectFormik } from 'formik';

import { CODE_FORM, TYPE_FORM, TYPE_BBGNHH } from './constants';

export function WrapperBusiness({ formik, code, children }) {
  let injectedProps = {
    isICD: false,
    isVinLog: false,
    isOther: false,
    disabled: false,
  };

  const typeForm = formik.status;
  const { deliveryReceiptCode, deliveryReceiptType } = formik.values;

  switch (deliveryReceiptType) {
    case TYPE_BBGNHH.ICD:
      injectedProps.isICD = true;
      break;

    case TYPE_BBGNHH.VINLOG:
      injectedProps.isVinLog = true;
      break;

    case TYPE_BBGNHH.OTHER:
      injectedProps.isOther = true;
      break;

    default:
      break;
  }

  switch (code) {
    case CODE_FORM.PXK: {
      // Ẩn khi BBGNHH là Loại ICD
      if (injectedProps.isICD) {
        injectedProps = null;
      }
      break;
    }

    case CODE_FORM.MA_PXK: {
      // Ẩn khi BBGNHH là Loại ICD
      if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps.disabled = true;
      }
      break;
    }

    case CODE_FORM.BUTTON_DELI: {
      // Ẩn khi Xem BBGNHH
      if ([TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps = null;
      }
      break;
    }

    case CODE_FORM.BUTTON_SAVE: {
      // Ẩn khi Xem BBGNHH
      if ([TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps = null;
      }
      // Disable khi Chỉnh sửa và Không tồn tại BBGNHH
      if ([TYPE_FORM.EDIT].includes(typeForm) && !deliveryReceiptCode) {
        injectedProps.disabled = true;
      }
      break;
    }

    case CODE_FORM.KHACH_HANG: {
      // Disable khi BBGNHH là Loại khác
      if (injectedProps.isOther) {
        injectedProps.disabled = true;
      }
      // Disable khi Chỉnh sửa và Xem BBGNHH
      if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps.disabled = true;
      }
      break;
    }

    case CODE_FORM.NON_EDITABLE: {
      // Disable khi Chỉnh sửa và Xem BBGNHH
      if ([TYPE_FORM.EDIT, TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps.disabled = true;
      }
      break;
    }

    case CODE_FORM.VIEW_BBGNHH: {
      // Disable khi Xem BBGNHH
      if ([TYPE_FORM.VIEW].includes(typeForm)) {
        injectedProps.disabled = true;
      }
      break;
    }

    case CODE_FORM.TUYEN_DUONG:
    case CODE_FORM.DIA_CHI_NHAN_HANG: {
      // Hiển thị khi BBGNHH là Loại ICD
      if (!injectedProps.isICD) {
        injectedProps = null;
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
  code: PropTypes.string,
  children: PropTypes.any,
};

export default connectFormik(WrapperBusiness);
