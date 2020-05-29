import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { GoChecklist } from 'react-icons/go';
import { TYPE_FORM } from './constants';
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

export class Action2RenderSection4 extends React.Component {
  get isVisible() {
    if (
      this.props.context.props.form === TYPE_FORM.EDIT &&
      this.props.data &&
      // this.props.data.id &&
      (this.props.data.documentQuantity > 0 ||
        this.props.data.stocktakingQuantity > 0) &&
      (this.props.data.basketCode || this.props.data.basketLocator) &&
      this.props.data.status === 1
    ) {
      return true;
    }
    return false;
  }

  onInventoryComplete = () => {
    this.props.context.props.confirmInventoryComplete(
      this.props.rowIndex,
      this.props.data,
    );
  };

  render() {
    const { classes } = this.props;

    if (this.isVisible) {
      return (
        <Tooltip title="Kiểm Kê Xong">
          <IconButton
            className={classes.button}
            onClick={this.onInventoryComplete}
          >
            <GoChecklist fontSize={24} />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }
}

Action2RenderSection4.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  rowIndex: PropTypes.number,
  form: PropTypes.string,
};

export default withStyles(styles)(Action2RenderSection4);
