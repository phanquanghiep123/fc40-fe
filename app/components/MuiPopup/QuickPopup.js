import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import MuiButton from '../MuiButton';
import Popup from './index';

/**
 * Quickly use Popup with built-in state, just pass config into method open() to use
 */
export default class QuickPopup extends React.Component {
  state = {
    open: false,
    title: '',
    message: '',
    actions: [],
    dialogProps: {},
  };

  /**
   * Open popup with config
   * @param title
   * @param message
   * @param actions - array of actions. Ex: [{ key: 1, text: 'Đồng ý', onClick: () => {}, keepPopup: false }]
   * @param dialogProps
   */
  open({
    title = 'Cảnh báo',
    message = 'Bạn có chắc chắn thực hiện không?',
    actions = [],
    dialogProps = {},
  } = {}) {
    this.setState({
      open: true,
      title,
      message,
      actions,
      dialogProps,
    });
  }

  onClose = () => this.setState({ open: false });

  // Render actions/buttons
  renderActions = () => {
    const { actions } = this.state;
    if (!Array.isArray(actions) || !actions.length) return null;

    return (
      <DialogActions>
        {actions.map((action, index) => {
          const { key, text, outlined, onClick, keepPopup, ...rest } = action;
          const handleClick = () => {
            if (onClick) onClick();
            if (!keepPopup) this.onClose();
          };

          return (
            <MuiButton
              key={key || String(index)}
              onClick={handleClick}
              outline={outlined}
              {...rest}
            >
              {text}
            </MuiButton>
          );
        })}
      </DialogActions>
    );
  };

  render() {
    const { open, title, message, dialogProps } = this.state;

    return (
      <Popup
        onClose={this.onClose}
        open={open}
        dialogProps={{ keepMounted: false, maxWidth: 'sm', ...dialogProps }}
        content={
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ whiteSpace: 'pre-wrap' }}>
                {message}
              </DialogContentText>
            </DialogContent>

            {this.renderActions()}
          </>
        }
      />
    );
  }
}
