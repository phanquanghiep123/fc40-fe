import React from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import MuiButton from '../../../../components/MuiButton';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.PureComponent {
  render() {
    const { open, onClose, onConfirm, content } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={onClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Cảnh báo!</DialogTitle>
          <DialogContent id="dialog-content">{content}</DialogContent>
          <DialogActions>
            <MuiButton outline onClick={onClose}>
              Không
            </MuiButton>
            <MuiButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Có
            </MuiButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialogSlide.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  content: PropTypes.any,
};

export default AlertDialogSlide;
