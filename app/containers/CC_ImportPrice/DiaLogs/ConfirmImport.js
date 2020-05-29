import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConfirmImport extends React.PureComponent {
  render() {
    const { open, onClose, agree } = this.props;

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
          <DialogTitle id="alert-dialog-slide-title">Cảnh Báo</DialogTitle>
          <DialogContent id="dialog-content">
            <div id="alert-dialog-slide-description">
              Xử lí này sẽ thực hiện xóa thông tin dữ liệu cân tổng và các BBGH
              của NCC đã tạo trước đó. Bạn có chắc chắn muốn thực hiện xử lí
              này?
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
              }}
              color="primary"
            >
              Huỷ
            </Button>
            <Button
              onClick={debounce(() => {
                agree();
                onClose();
              }, SUBMIT_TIMEOUT)}
              color="primary"
            >
              Đồng Ý
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmImport.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  agree: PropTypes.func,
};

export default ConfirmImport;
