import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

export const styles = {
  button: {
    margin: 0,
    padding: 5,
    fontSize: 12,
  },
  icon: {
    fontSize: '1.5em',
  },
};

export class ActionsRenderer extends React.Component {
  onRemove = () => {
    if (this.props.onRemove) {
      const rowIndex = this.props.node.childIndex;
      this.props.onRemove(rowIndex, this.props.data);
    }
  };

  render() {
    const { classes, showRemove, ...props } = this.props;

    if (showRemove && showRemove(props)) {
      return (
        <IconButton
          title="Xóa"
          onClick={this.onRemove}
          className={classes.button}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      );
    }
    return null;
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  node: PropTypes.object,
  onRemove: PropTypes.func,
  showRemove: PropTypes.func,
};

ActionsRenderer.defaultProps = {
  showRemove: () => true,
};

export default withStyles(styles)(ActionsRenderer);
