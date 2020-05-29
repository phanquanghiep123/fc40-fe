import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

import SnackbarContentWrapper from './SnackContent';

const SnackbarWrapper = props => {
  const { open, ancho, time, variant, message, onClose } = props;

  return (
    <Snackbar
      anchorOrigin={ancho}
      open={open}
      autoHideDuration={time}
      onClose={onClose}
    >
      <SnackbarContentWrapper
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};

SnackbarWrapper.propTypes = {
  /**
   * Xác định vị trí cho thông báo trên màn hình
   */
  ancho: PropTypes.object,
  /**
   * Khoảng thời gian để thông báo tự động ẩn
   */
  time: PropTypes.number,
  /**
   * Nếu true, cho phép hiển thị thông báo
   */
  open: PropTypes.bool,
  /**
   * Chủ động click vào icon tắt thông báo để tắt thông báo
   */
  onClose: PropTypes.func,
  /**
   * Set màu nền, icon cho thông báo
   */
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  /**
   * Hiển thị nội dung thông báo
   */
  message: PropTypes.string,
};
SnackbarWrapper.defaultProps = {
  ancho: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  time: 100000,
  open: false,
  variant: 'success',
};

export default SnackbarWrapper;
