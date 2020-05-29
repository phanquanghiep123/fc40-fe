import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export const CONFIRM_TITLE = 'Xác nhận xóa';
export const CONFIRM_MESSAGE =
  'Bạn chắc chắn muốn xóa? Hành động này không thể khôi phục lại dữ liệu sau khi thực hiện.';

export default class ConfirmationDialog extends React.Component {
  state = {
    open: false,
    title: '',
    message: '',
    actions: [],
  };

  showConfirm({
    title = CONFIRM_TITLE,
    message = CONFIRM_MESSAGE,
    actions = [],
  } = {}) {
    this.setState({
      open: true,
      title,
      message,
      actions,
    });
  }

  handleClose = () => this.setState({ open: false });

  renderButton = ({ text, onClick, payload, ...action }, i) => {
    const handleButtonClick = () => {
      this.handleClose();
      if (onClick) {
        onClick(payload);
      }
    };

    return (
      <Button key={String(i)} onClick={handleButtonClick} {...action}>
        {text}
      </Button>
    );
  };

  render() {
    const { open, title, message, actions } = this.state;

    return (
      <Dialog open={open} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ whiteSpace: 'pre-wrap' }}>
            {message}
          </DialogContentText>
        </DialogContent>
        {actions.length > 0 && (
          <DialogActions>{actions.map(this.renderButton)}</DialogActions>
        )}
      </Dialog>
    );
  }
}
