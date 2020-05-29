import React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide/index';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { getNested } from '../../../App/utils';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.PureComponent {
  render() {
    const { open, onClose, onConfirm, agProps } = this.props;
    const isBasketLoadedFromServer = getNested(
      agProps,
      'data',
      'isLoadedFromServer',
    );

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
              {isBasketLoadedFromServer ? (
                <Typography variant="body1">
                  Thao tác này sẽ thực hiện xoá thông tin đã có của phiếu trên
                  hệ thống. Bạn có chắn chắn muốn xóa dòng này?
                </Typography>
              ) : (
                <Typography variant="body1">
                  Bạn có chắn chắn muốn xóa dòng này?
                </Typography>
              )}
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
  agProps: PropTypes.object,
};

export default AlertDialogSlide;
