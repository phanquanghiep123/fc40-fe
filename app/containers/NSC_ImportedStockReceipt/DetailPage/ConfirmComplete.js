import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConfirmComplete extends React.PureComponent {
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
          <DialogTitle id="alert-dialog-slide-title">
            Bạn có chắc hoàn thành việc cân nhập kho
          </DialogTitle>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Không
            </Button>
            <Button
              onClick={debounce(() => {
                agree();
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

ConfirmComplete.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  agree: PropTypes.func,
};

export default ConfirmComplete;
