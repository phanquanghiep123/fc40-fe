/**
 *
 * PostprocessKk
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { Typography, withStyles } from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import Grid from '@material-ui/core/Grid';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import * as Yup from 'yup';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { groupBy } from 'lodash';
import { showWarning } from 'containers/App/actions';
import { sumBy } from 'utils/numberUtils';
import { formDataSelector } from './selectors';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import Section2 from './Section2';
import TableSection from './TableSection';
import * as actions from './actions';
import { URL, TYPE_PROCESS } from './constants';

export const styles = theme => ({
  spacing: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class PostprocessKk extends React.PureComponent {
  formik = null;

  // validate loại điều chuyển giữa các plant
  validationSchema = Yup.object().shape({
    adjustmentUser: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    deliverBasketStocktakingCode: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    receiver: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    receiverBasketStocktakingCode: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    date: Yup.date()
      .required('Trường không được bỏ trống')
      .nullable(),
  });

  // validate loại điều chuyển nội bô
  validationSchemaInternal = Yup.object().shape({
    adjustmentUser: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    deliverBasketStocktakingCode: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    receiverBasketStocktakingCode: Yup.object()
      .required('Trường không được bỏ trống')
      .nullable(),
    date: Yup.date()
      .required('Trường không được bỏ trống')
      .nullable(),
  });

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  // hàm khởi tạo màn hình
  init = () => {
    const { location } = this.props;
    const urlParams = new URLSearchParams(location.search);
    const plantCode = urlParams.get('plantCode');
    const basketStockTakingCode = urlParams.get('basketStockTakingCode');
    this.props.onInitFormData({ plantCode, basketStockTakingCode });
  };

  componentDidMount() {
    this.init();
  }

  // hàm gọi api để lấy mã BBKK
  getDeliveryOrder = (isDeliver, field, plantCode, date, callback) => {
    const params = {
      isDeliver,
      date: date ? date.toISOString() : this.props.formData.date.toISOString(),
      plantCode,
      typeProcess: this.props.formData.typeProcess,
    };
    if (callback) {
      this.props.onGetDeliveryOrder({ params }, callback);
    } else {
      this.props.onGetDeliveryOrder({ params });
    }
  };

  handleSubmit = e => {
    this.formik.handleSubmitClick(e);
  };

  // hàm xử lý khi ấn button điều chỉnh
  onSubmit = () => {
    const { values } = this.formik;
    if (values.tableData.length === 0) {
      this.props.onShowWarning('Không có thông tin mã khay sọt cần điều chỉnh');
      return false;
    }
    const basketDiff = [];
    const grouped = groupBy(values.tableData, value => `${value.basketCode}`);
    const stockTakingDetails = [];
    Object.keys(grouped).forEach(item => {
      const deliveryQuantity = sumBy(grouped[item], 'deliveryQuantity');
      const receiverQuantity = sumBy(grouped[item], 'receiverQuantity');
      if (deliveryQuantity !== receiverQuantity) {
        basketDiff.push(grouped[item][0].basketCode);
      }
      const basketDocumentExportDetails = [];
      const basketDocumentImportDetails = [];
      let keyData = {};
      grouped[item].forEach(subItem => {
        keyData = {
          id: 0,
          basketCode: grouped[item][0].basketCode,
        };
        if (subItem.basketLocatorDeliverId) {
          basketDocumentExportDetails.push({
            basketCode: subItem.basketCode,
            deliveryQuantity: subItem.deliveryQuantity || 0,
            receiverQuantity: subItem.deliveryQuantity || 0,
            quantityActual: subItem.deliveryQuantity || 0,
            locatorDeliver: subItem.basketLocatorDeliverId,
            locatorReceiver: subItem.basketLocatorReceiverId,
            note: subItem.note,
          });
        }
        if (subItem.basketLocatorReceiverId) {
          basketDocumentImportDetails.push({
            basketCode: subItem.basketCode,
            deliveryQuantity: subItem.receiverQuantity || 0,
            receiverQuantity: subItem.receiverQuantity || 0,
            quantityActual: subItem.receiverQuantity || 0,
            locatorReceiver: subItem.basketLocatorReceiverId,
            locatorDeliver: subItem.basketLocatorDeliverId,
            note: subItem.note,
          });
        }
      });
      const mainData = {
        ...keyData,
        basketDocumentExportDetails,
        basketDocumentImportDetails,
      };
      stockTakingDetails.push(mainData);
    });
    if (basketDiff.length > 0) {
      const text = basketDiff.join(', ');
      this.props.onShowWarning(
        `Mã Khay Sọt ${text} phải có tổng SL Xuất và tổng SL Nhập bằng nhau`,
      );
      return false;
    }
    const data = {
      id: 0,
      afterStatus: values.typeProcess,
      deliverCode: values.deliver.value,
      receiverCode: values.receiver.value || values.deliver.value,
      deliverType: 1,
      receiverType: 1,
      deliverBasketStocktakingCode: values.deliverBasketStocktakingCode.value,
      receiverBasketStocktakingCode: values.receiverBasketStocktakingCode.value,
      userId: values.adjustmentUser.value,
      date: values.date.toISOString(),
      note: values.note,
      stockTakingDetails,
    };
    this.props.submitAdjust(data, () => {
      this.props.history.push(URL.LIST_BBKK);
    });
    return true;
  };

  handleInvalidSubmission = () => {
    this.props.onShowWarning(
      'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
    );
  };

  render() {
    const { classes, history, formData, getBasketDetail } = this.props;
    return (
      <React.Fragment>
        <FormWrapper
          enableReinitialize
          initialValues={formData}
          onSubmit={this.onSubmit}
          validationSchema={
            this.props.formData.typeProcess === TYPE_PROCESS.PLANT
              ? this.validationSchema
              : this.validationSchemaInternal
          }
          onInvalidSubmission={this.handleInvalidSubmission}
          render={formik => {
            this.formik = formik;
            return (
              <React.Fragment>
                <div style={{ margin: '12px 0px' }}>
                  <Typography variant="h5" color="textPrimary">
                    Xử Lý Sau Kiểm Kê
                  </Typography>
                </div>
                <FormSection
                  {...this.props}
                  formik={formik}
                  changeData={this.props.changeData}
                  showConfirm={this.showConfirm}
                  getDeliveryOrder={this.getDeliveryOrder}
                />
                <Section2
                  {...this.props}
                  formik={formik}
                  getDeliveryOrder={this.getDeliveryOrder}
                  getBasketDetail={getBasketDetail}
                  changeData={this.props.changeData}
                  showConfirm={this.showConfirm}
                />
                <TableSection
                  {...this.props}
                  formik={formik}
                  changeData={this.props.changeData}
                  showConfirm={this.showConfirm}
                />
                <Grid
                  container
                  spacing={24}
                  justify="flex-end"
                  className={classes.spacing}
                >
                  <Grid item>
                    <MuiButton outline onClick={() => history.goBack()}>
                      Quay Lại
                    </MuiButton>
                  </Grid>
                  <Grid item>
                    <MuiButton
                      type="submit"
                      onClick={e => {
                        this.handleSubmit(e);
                      }}
                    >
                      Điều Chỉnh
                    </MuiButton>
                  </Grid>
                </Grid>
              </React.Fragment>
            );
          }}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

PostprocessKk.propTypes = {
  onInitFormData: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  formData: PropTypes.object,
  changeData: PropTypes.func,
  onUpdateDetailsCommand: PropTypes.func,
  submitAdjust: PropTypes.func,
  onShowWarning: PropTypes.func,
  handleQuantity: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: formDataSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onShowWarning: mess => dispatch(showWarning(mess)),
    onInitFormData: data => dispatch(actions.getInitFormData(data)),
    onGetDeliveryOrder: (data, callback) =>
      dispatch(actions.getDeliveryOrder(data, callback)),
    getBasketDetail: data => dispatch(actions.getBasketDetail(data)),
    changeData: data => dispatch(actions.changeData(data)),
    handleQuantity: data => dispatch(actions.handleQuantity(data)),
    submitAdjust: (data, callback) =>
      dispatch(actions.submitAdjust(data, callback)),
    onUpdateDetailsCommand: (data, field) =>
      dispatch(actions.updateDetailCommand(data, field)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'postprocessKk', reducer });
const withSaga = injectSaga({ key: 'postprocessKk', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  withImmutablePropsToJs,
)(PostprocessKk);
