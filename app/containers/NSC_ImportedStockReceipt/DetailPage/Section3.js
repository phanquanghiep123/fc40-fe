import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import MuiButton from 'components/MuiButton';
import CompleteButton from 'components/Button/ButtonComplete';
import {
  GET_IMPORTED_STOCK_COMPLETE_STATUS,
  UN_WEIGHT_ITEM,
  WEIGHTING_ITEM,
} from './constants';
import ConfirmFinalVehicle from './ConfirmFinalVehicle';
import ConfirmComplete from './ConfirmComplete';
import { DELIVERY_ORDER_BUSSINES } from '../../App/constants';
import { BTN_COMPLETE } from '../WeightPage/messages';

/* eslint-disable react/prefer-stateless-function */
class CustomButton extends React.Component {
  state = {
    openConfirmComplete: false,
    openConfirmFinalVehicle: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.completeSuccess > this.props.completeSuccess) {
      this.onCompleteSuccess();
    }
  }

  closeConfirm1 = () => {
    this.setState({
      openConfirmComplete: false,
    });
  };

  closeConfirm2 = () => {
    this.setState({
      openConfirmFinalVehicle: false,
    });
  };

  preProceedCompleteStep1 = () => {
    const { data } = this.props;
    let flag = false;
    data.forEach(item => {
      if (
        item.actualQuantity === 0 ||
        Number.parseFloat(item.actualQuantity) <
          Number.parseFloat(item.plannedTotalQuatity)
      ) {
        flag = true;
      }
    });
    if (flag) {
      // hiển thị confirm có chắc hoàn thành
      this.setState({ openConfirmComplete: true });
      return;
    }
    this.preProceedCompleteStep2();
  };

  preProceedCompleteStep2 = () => {
    const { importedStockId, doType } = this.props;
    // check nhà cung cấp, mở confirm tiếp theo
    if (doType === DELIVERY_ORDER_BUSSINES) {
      this.setState({ openConfirmFinalVehicle: true });
      return;
    }
    // hoàn thành
    this.props.onSubmitForm(
      { impStockRecptId: importedStockId },
      this.changeStatusImported,
    );
  };

  onCompleteSuccess = () => {
    const { onCompleteSuccess } = this.props;
    onCompleteSuccess();
  };

  proceedComplete = type => {
    const { importedStockId } = this.props;
    if (type === 2) {
      // người dùng đồng ý đây là chuyến xe cuối cùng
      this.props.onSubmitForm(
        {
          impStockRecptId: importedStockId,
          isFinalVehicle: true,
        },
        this.changeStatusImported,
      );
    } else {
      this.props.onSubmitForm(
        {
          impStockRecptId: importedStockId,
          isFinalVehicle: false,
        },
        this.changeStatusImported,
      );
    }
  };

  genComplete = () => {
    const { data, classes, formik } = this.props;
    if (
      formik.values.status !== GET_IMPORTED_STOCK_COMPLETE_STATUS &&
      !formik.values.autoFlag
    ) {
      return (
        <Grid item>
          <CompleteButton
            text={BTN_COMPLETE}
            className={classes.btn}
            onClick={this.preProceedCompleteStep1}
            disabled={
              data.length === 0 ||
              data.filter(item => item.status === WEIGHTING_ITEM).length > 0 ||
              data.filter(item => item.status === UN_WEIGHT_ITEM).length ===
                data.length
            }
          />
        </Grid>
      );
    }

    return null;
  };

  changeStatusImported = () => {
    this.props.formik.setFieldValue(
      'status',
      GET_IMPORTED_STOCK_COMPLETE_STATUS,
    );
  };

  render() {
    const { classes, formik, closeDialog } = this.props;
    const { openConfirmFinalVehicle, openConfirmComplete } = this.state;
    return (
      <React.Fragment>
        <Grid container justify="flex-end" spacing={24}>
          <Grid item>
            <MuiButton onClick={closeDialog} outline className={classes.btn}>
              Huỷ Bỏ
            </MuiButton>
          </Grid>
          {this.genComplete(formik)}
        </Grid>
        {formik.values.status !== GET_IMPORTED_STOCK_COMPLETE_STATUS && (
          <React.Fragment>
            <ConfirmComplete
              open={openConfirmComplete}
              onClose={this.closeConfirm1}
              agree={this.preProceedCompleteStep2}
            />
            <ConfirmFinalVehicle
              open={openConfirmFinalVehicle}
              onClose={this.closeConfirm2}
              agree={this.proceedComplete}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
CustomButton.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  closeDialog: PropTypes.func,
  importedStockId: PropTypes.number,
  onSubmitForm: PropTypes.func,
  onCompleteSuccess: PropTypes.func,
  data: PropTypes.array,
  doType: PropTypes.number,
  completeSuccess: PropTypes.number,
};

CustomButton.defaultProps = {
  onCompleteSuccess: () => {},
};
export default CustomButton;
