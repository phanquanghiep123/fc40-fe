import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { formatToDecimal } from 'utils/numberUtils';

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
  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onRemoveRow = () => {
    this.onConfirmShow({
      title: 'Xác nhận xóa',
      message: 'Bạn chắc chắn muốn xóa??',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            const nextValue = [...this.props.context.values.turnToScales];
            nextValue.splice(this.props.rowIndex, 1);
            let sum = 0;
            nextValue.forEach(item => {
              sum = formatToDecimal(item.realWeight, 2) + sum;
            });
            this.props.context.setFieldValue(
              'product[stockTakingQuantity]',
              sum,
            );
            const weightDifference =
              sum - this.props.context.values.product.inventoryQuantity;

            const rateDifference =
              (weightDifference /
                this.props.context.values.product.inventoryQuantity) *
              100;

            const text = `${formatToDecimal(
              weightDifference,
              2,
            )}       ${formatToDecimal(rateDifference, 2)}%`;
            this.props.context.setFieldValue('product[differentRatio]', text);
            this.props.context.setFieldValue(
              'product[weightDifference]',
              weightDifference,
            );
            this.props.context.setFieldValue(
              'product[rateDifference]',
              rateDifference,
            );
            this.props.context.setFieldValue('turnToScales', nextValue);
          },
        },
      ],
    });
  };

  get isDeleteVisible() {
    if (this.props.context.isCompleted) {
      const isCompleted = this.props.context.isCompleted();
      if (isCompleted) {
        return false;
      }
    }
    if (
      this.props.data &&
      (this.props.data.palletBasketCode ||
        this.props.data.palletCode ||
        this.props.data.basketQuantity > 0 ||
        this.props.data.palletQuantity > 0 ||
        this.props.data.scalesWeight > 0)
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { classes } = this.props;

    if (this.isDeleteVisible) {
      return (
        <div>
          <Tooltip title="Xóa">
            <IconButton className={classes.button} onClick={this.onRemoveRow}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <ConfirmationDialog
            ref={ref => {
              this.confirmRef = ref;
            }}
          />
        </div>
      );
    }
    return null;
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default withStyles(styles)(ActionsRenderer);
