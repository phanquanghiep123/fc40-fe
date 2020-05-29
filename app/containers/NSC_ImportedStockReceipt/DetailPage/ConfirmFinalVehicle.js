import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConfirmFinalVehicle extends React.PureComponent {
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
            Chuyến xe này có phải là chuyến xe cuối cùng?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                agree(1);
                onClose();
              }}
              color="primary"
            >
              Sai
            </Button>
            <Button
              onClick={() => {
                agree(2);
                onClose();
              }}
              color="primary"
            >
              Đúng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmFinalVehicle.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  agree: PropTypes.func,
};

export default ConfirmFinalVehicle;
