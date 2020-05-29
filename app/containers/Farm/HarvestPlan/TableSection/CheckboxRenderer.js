import React from 'react';
import PropTypes from 'prop-types';
import RemoveIcon from '@material-ui/icons/Remove';
import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';
import { Fab, Tooltip } from '@material-ui/core';

export const styles = {
  root: {
    padding: 0,
  },
};

export class CheckboxRenderer extends React.Component {
  deletePlanning = () => {
    if (this.props.onDeletePlanning) {
      this.props.onConfirmShow({
        title: 'Cảnh báo',
        message: 'Bạn có chắc chắn muốn xóa ?',
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              const { data } = this.props;
              this.props.onDeletePlanning({
                subIndex: data.subIndex,
                rowindex: data.currentIndex,
              });
            },
          },
        ],
      });
    }
  };

  render() {
    const { classes, value, disabled, data } = this.props;
    const cb = value !== undefined;
    const isChecked = this.props.formatValue(value);
    const showDelete =
      data.subId !== undefined && data.editting && data.isOutOfPlan;
    return (
      <>
        {cb && (
          <div>
            <Checkbox
              color="primary"
              checked={isChecked}
              disabled={disabled}
              className={classes.root}
              onChange={this.onChange}
            />
            {showDelete && (
              <Fab
                color="primary"
                style={{
                  height: 24,
                  minHeight: 24,
                  width: 24,
                  marginLeft: 6,
                }}
                onClick={this.deletePlanning}
              >
                <Tooltip title="Xóa">
                  <RemoveIcon />
                </Tooltip>
              </Fab>
            )}
          </div>
        )}
        {!cb && <div className={classes.root} />}
      </>
    );
  }
}

CheckboxRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  data: PropTypes.object,
  disabled: PropTypes.bool,
  formatValue: PropTypes.func,
  onConfirmShow: PropTypes.func,
  onDeletePlanning: PropTypes.func,
};

CheckboxRenderer.defaultProps = {
  disabled: false,
};

export default withStyles(styles)(CheckboxRenderer);
