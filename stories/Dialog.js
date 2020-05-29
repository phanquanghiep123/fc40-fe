import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import AlertDialog from '../app/components/AlertDialog';

class DialogExample extends React.PureComponent {
  state = {
    openDl: false,
  };

  render() {
    const { ui, isDialog, title, content, fullWidth } = this.props;
    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ openDl: true })}
        >
          Show dialog/modal
        </Button>
        <ui.Dialog
          {...ui.props}
          title={title}
          content={content} // string | html | react node
          isDialog={isDialog} // if true: dialog, else: modal
          onConfirm={() => alert('handle confirm')} // handle confirm
          maxWidth="lg"
          fullWidth={fullWidth}
          openDl={this.state.openDl} // not need declared, because it is injected from route
          onCloseDialog={() => this.setState({ openDl: false })} // not need declared, because it is injected from route
        />
      </React.Fragment>
    );
  }
}

DialogExample.propTypes = {
  ui: PropTypes.object,
  /**
   * True: open dialog, false thì ngược lại
   */
  openDl: PropTypes.bool,
  /**
   * Tiêu đề của Dialog/Modal
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Nội dung của Dialog/Modal
   */
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Xử lý sự kiện khi click positive button
   */
  onConfirm: PropTypes.func,
  /**
   * Xử lý sự kiện khi click negative button
   */
  onCloseDialog: PropTypes.func,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  /**
   * Cho phép động rộng lớn nhất tùy thuộc vào đơn vị ở maxWidth
   */
  fullWidth: PropTypes.bool,
  /**
   * Nếu true: là dialog, false: là modal
   */
  isDialog: PropTypes.bool,
};

DialogExample.defaultProps = {
  ui: {
    Dialog: AlertDialog,
    props: {
      /**
       * @openDl :bool
       * @onCloseDialog :function
       * @onOpenDialog :function
       *
       * get from store in private route
       */
      openDl: false,
      // onCloseDialog,
      // onOpenDialog,
    },
  },
};

export default DialogExample;
