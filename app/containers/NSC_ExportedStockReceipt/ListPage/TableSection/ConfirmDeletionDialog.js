import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.PureComponent {
  render() {
    const { open, onClose, onDeleteRecord, idForDeletion } = this.props;

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
          <DialogTitle id="alert-dialog-slide-title">
            Bạn có chắc chắn muốn xóa phiếu xuất kho này?
          </DialogTitle>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Không
            </Button>
            <Button
              onClick={debounce(() => {
                onDeleteRecord(idForDeletion);
                onClose();
              }, SUBMIT_TIMEOUT)}
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
  onDeleteRecord: PropTypes.func,
  idForDeletion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AlertDialogSlide;
