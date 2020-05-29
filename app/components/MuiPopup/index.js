import React from 'react';
import { MuiThemeProvider, Dialog, Slide } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import appTheme from '../../containers/App/theme';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Popup extends React.PureComponent {
  render() {
    const { open, onClose, content, dialogProps, theme } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          keepMounted
          maxWidth="md"
          fullWidth
          {...dialogProps}
        >
          {content}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

Popup.propTypes = {
  open: PropTypes.bool.isRequired, // open state - true => open
  onClose: PropTypes.func.isRequired, // function to close popup
  content: PropTypes.node.isRequired, // popup content (including title, content, action,...)
  dialogProps: PropTypes.object, // props for Dialog component
  theme: PropTypes.object,
};

Popup.defaultProps = {
  theme: appTheme,
};

export default Popup;
