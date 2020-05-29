import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import appTheme from '../../../App/theme';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiDialogActions: {
        root: {
          padding: '0.5rem 1rem !important',
        },
      },
    },
  });

class AlertDialogSlide extends React.PureComponent {
  render() {
    const { open, onClose, onConfirm } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={onClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Bạn có muốn hoàn thành cân tổng cho sản phẩm này?
          </DialogTitle>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Không
            </Button>
            <Button
              variant="contained"
              onClick={debounce(() => {
                onConfirm();
                onClose();
              }, SUBMIT_TIMEOUT)}
              color="primary"
            >
              Có
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

AlertDialogSlide.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AlertDialogSlide;
