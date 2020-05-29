import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.PureComponent {
  render() {
    const { open, onClose, onConfirm } = this.props;

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
          <DialogContent id="dialog-content">
            <div id="alert-dialog-slide-description">
              Dòng này đã được thêm dữ liệu. Bạn có chắn chắn muốn xóa dòng này?
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Không
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              color="primary"
            >
              Có
            </Button>
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
};

export default AlertDialogSlide;
