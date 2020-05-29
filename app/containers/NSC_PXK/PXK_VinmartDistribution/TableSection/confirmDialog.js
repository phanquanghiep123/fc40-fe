import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Slide from '@material-ui/core/Slide/index';
import * as PropTypes from 'prop-types';
import {
  createMuiTheme,
  MuiThemeProvider,
  Typography,
} from '@material-ui/core';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import DialogContent from '@material-ui/core/DialogContent';
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
    const { open, onClose, onConfirm, formik } = this.props;
    const { soldToVinmart: vm, soldToVinmartPlus: vmp } = formik.values;

    const soldToVM = vm ? `${vm.name} (${vm.value})` : '';
    const soldToVMP = vmp ? `${vmp.name} (${vmp.value})` : '';

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={onClose}
        >
          <DialogTitle>Cảnh Báo</DialogTitle>
          <DialogContent>
            <Typography style={{ marginBottom: '0.5rem' }}>
              Hệ thống sẽ tạo tự động phiếu xuất bán cho{' '}
              <span style={{ color: 'red' }}>{soldToVM}</span>
              {' và '}
              <span style={{ color: 'red' }}>{soldToVMP}</span>.
            </Typography>
            <Typography>
              Chọn &quot;Đồng ý&quot; để thực hiện tạo phiếu xuất bán.
            </Typography>
          </DialogContent>
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
              Đồng Ý
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
  formik: PropTypes.object,
};

export default AlertDialogSlide;
