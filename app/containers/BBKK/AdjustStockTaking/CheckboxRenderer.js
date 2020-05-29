import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';

export const styles = {
  root: {
    padding: 0,
  },
};

export class CheckboxRenderer extends React.Component {
  onChange = event => {
    const isChecked = event.target.checked;
    const { formik } = this.props.context.props;
    // formik.setFieldValue(
    //   `cancelBaskets[${this.props.rowIndex}]isAdjusted`,
    //   isChecked,
    // );
    const adjustedCheck = formik.values.assetCancels.filter(
      item => item.basketStocktakingDetailId === this.props.data.id,
    );
    const assetCancel = formik.values.assetCancels.filter(
      item => item.basketStocktakingDetailId !== this.props.data.id,
    );

    if (
      !isChecked &&
      this.props.table === 'cancelBaskets' &&
      adjustedCheck.length > 0
    ) {
      this.props.context.onConfirmShow({
        title: 'Cảnh báo',
        message:
          'Nếu bỏ check thì sẽ không điều chỉnh cho khay sọt này và xóa thông tin sở hữu liên quan',
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              this.props.onUpdateBasketCancelDetails({
                index: this.props.rowIndex,
                data: {
                  ...this.props.data,
                  isAdjusted: isChecked,
                },
                table: this.props.table,
              });
              this.props.onChangeField({
                field: 'assetCancels',
                value: assetCancel,
              });
            },
          },
        ],
      });
    } else
      this.props.onUpdateBasketCancelDetails({
        index: this.props.rowIndex,
        data: {
          ...this.props.data,
          isAdjusted: isChecked,
        },
        table: this.props.table,
      });
  };

  render() {
    const { classes, value, form, data } = this.props;
    const disableCheckbox = () => {
      if (form === '2') {
        return true;
      }
      if (data.isAdjusted && data.isAdjustedBefore) {
        return true;
      }
      return false;
    };
    const isChecked = this.props.formatValue(value);

    return (
      <Checkbox
        color="primary"
        checked={isChecked}
        disabled={disableCheckbox()}
        className={classes.root}
        onChange={this.onChange}
      />
    );
  }
}

CheckboxRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  // disabled: PropTypes.bool,
  formatValue: PropTypes.func,
  onUpdateBasketCancelDetails: PropTypes.func,
  onChangeField: PropTypes.func,
  rowIndex: PropTypes.number,
  data: PropTypes.object,
  table: PropTypes.string,
  context: PropTypes.object,
  form: PropTypes.string,
  formik: PropTypes.string,
};

// CheckboxRenderer.defaultProps = {
//   disabled: false,
// };

export default withStyles(styles)(CheckboxRenderer);
