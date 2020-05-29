import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import AssessmentIcon from '@material-ui/icons/Assessment';
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
  // componentWillUnmount() {
  //   const { context, data } = this.props;
  //   context.setDataRecord(data);
  // }

  isEdit = false;

  onOpenDialog = () => {
    const { context, data } = this.props;
    context.onOpenSelectAssetsPopup(this.isEdit, data);
    // setTimeout(context.props.onFetchPopupTableData(data), 2000);
  };

  render() {
    const { classes, data } = this.props;

    return (
      <div>
        {data.isAdjusted && (
          <Tooltip title="Xác định tài sản hủy">
            <IconButton className={classes.button} onClick={this.onOpenDialog}>
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  // rowIndex: PropTypes.number,
  data: PropTypes.object,
};

export default withStyles(styles)(ActionsRenderer);
