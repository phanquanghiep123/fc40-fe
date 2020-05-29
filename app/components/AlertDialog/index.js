import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  paper: {
    backgroundColor: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

export class AlertDialogSlide extends React.PureComponent {
  render() {
    const {
      openDl,
      title,
      content,
      maxWidth,
      fullWidth,
      classes,
      isDialog,
      keepMounted,
      contentProps,
      suppressClose,
      customActionDialog,
      onConfirm,
      onCloseDialog,
      onExitedDialog,
      onEnteredDialog,
    } = this.props;

    return (
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openDl}
        TransitionComponent={Transition}
        keepMounted={keepMounted}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={customActionDialog ? { paper: classes.paper } : {}}
        disableBackdropClick={suppressClose}
        disableEscapeKeyDown={suppressClose}
        onClose={onCloseDialog}
        onExited={onExitedDialog}
        onEntered={onEnteredDialog}
      >
        <React.Fragment>
          <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
          <DialogContent id="dialog-content" {...contentProps}>
            {isDialog ? (
              <DialogContentText>{content}</DialogContentText>
            ) : (
              content
            )}
          </DialogContent>
          {customActionDialog || (
            <DialogActions>
              {!isDialog ? (
                <React.Fragment>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={onCloseDialog}
                  >
                    Hủy
                    <DeleteIcon className={classes.rightIcon} />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onConfirm}
                  >
                    Lưu
                    <Icon className={classes.rightIcon}>send</Icon>
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button onClick={onCloseDialog} color="secondary">
                    Hủy
                  </Button>
                  <Button onClick={onConfirm} color="primary">
                    Đồng ý
                  </Button>
                </React.Fragment>
              )}
            </DialogActions>
          )}
        </React.Fragment>
      </Dialog>
    );
  }
}

AlertDialogSlide.propTypes = {
  classes: PropTypes.object.isRequired,
  openDl: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func,
  onCloseDialog: PropTypes.func,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  isDialog: PropTypes.bool,
  fullWidth: PropTypes.bool,
  keepMounted: PropTypes.bool,
  contentProps: PropTypes.object,
  customActionDialog: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  /**
   * If true, will not fire the onClose callback
   */
  suppressClose: PropTypes.bool,
  /**
   * Callback fired when the dialog has exited
   */
  onExitedDialog: PropTypes.func,
  /**
   * Callback fired when the dialog has entered
   */
  onEnteredDialog: PropTypes.func,
};

AlertDialogSlide.defaultProps = {
  openDl: false,
  isDialog: true,
  maxWidth: 'sm',
  fullWidth: false,
  keepMounted: true,
  suppressClose: false,
  customActionDialog: false,
};

export default withStyles(styles)(AlertDialogSlide);
