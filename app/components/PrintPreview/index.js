import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

export default function PrintPreview(props) {
  return (
    <div>
      <Dialog open={props.open} maxWidth="md" fullWidth>
        <DialogTitle>Xem Trước Phiếu In</DialogTitle>
        <DialogContent dividers>{parse(props.content)}</DialogContent>
        <DialogActions>
          <Button onClick={props.close} variant="contained" color="primary">
            Quay Lại
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

PrintPreview.propTypes = {
  content: PropTypes.string.isRequired,
  open: PropTypes.bool,
  close: PropTypes.func,
};
