import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { HotKeys } from 'react-hotkeys';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { isEqual } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { isArray, debounce } from 'lodash';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import KEY_MAP from 'containers/App/keysmap';
import { alertInvalidWhenSubmit } from 'containers/NSC_BBGH/BBGHCreatePage/actions';
import validSchema, { shipperListDefault } from './Schema';
import { getInitPage, updateBBGH } from './actions';
import reducer from './reducer';
import styles from './styles';
import saga from './saga';
import { makeSelectBbghEdit } from './selectors';

import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section6 from './Section6';
import Section5 from './Section5';

import { BASKETS_TYPE, TYPE_BBGH } from '../BBGHCreatePage/constants';
import { viewBasketSection } from '../BBGHCreatePage/basketLogicFunction';

class BBGHEditPage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.onGetInitPage(id);
  }

  handleInvalidSubmission = () => {
    this.props.onAlertInvalidWhenSubmit(
      'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  handleSubmit = values => {
    const dateNow = new Date(values.deliveryDateTime);
    const dateCheck = new Date(values.dateCheck);
    const { stockList } = values;
    const isBasket =
      values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER ||
      values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN;
    if (!isBasket && (!stockList || !stockList.length)) {
      this.props.onAlertInvalidWhenSubmit(
        'Không có sản phẩm nào được nhập ở vùng Thông tin hàng hóa',
      );
      return;
    }

    const datas = values;
    if (
      isArray(datas.shipperList) &&
      datas.shipperList[0] &&
      !datas.shipperList[0].shipperName
    ) {
      datas.shipperList = [];
    }

    let mess = '';
    values.basketDocumentList.forEach(item => {
      if ([BASKETS_TYPE.PXKS].includes(item.type))
        mess += `${item.basketDocumentCode} ,`;
    });
    const newMess = mess.substr(0, mess.length - 1);
    let mainValues = {};
    if (values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN) {
      mainValues = {
        ...values,
        listReceiver: [
          {
            ...values.shipperList[0],
            vehicleRouteType: values.shipperList[0].vehicleRouteType
              ? values.shipperList[0].vehicleRouteType
              : 0,
            stockReceivingDateTime:
              values.stockReceivingDateTime && values.stockReceivingDateTime,
          },
        ],
        shipperList: [
          {
            ...values.shipperList[0],
            vehicleRouteType: values.shipperList[0].vehicleRouteType
              ? values.shipperList[0].vehicleRouteType
              : 0,
          },
        ],
      };
    } else {
      mainValues = values;
    }
    if (!isEqual(dateNow, dateCheck)) {
      this.onConfirmShow({
        title: 'Cảnh báo',
        message: `Nếu bạn lưu. Giá trị các BBGH: ${
          values.doCode
        }  và danh sách các PXKS: ${newMess} liên quan sẽ bị cập nhật lại Ngày Giao Hàng/Ngày Xuất Hàng!`,
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () =>
              this.props.onUpdateBBGH(mainValues, () =>
                push('/danh-sach-bien-ban-giao-hang'),
              ),
          },
        ],
      });
    } else
      this.props.onUpdateBBGH(mainValues, () =>
        push('/danh-sach-bien-ban-giao-hang'),
      );
  };

  isRender = formik => {
    const { values } = formik;
    if (
      (values.doType === TYPE_BBGH.NCC_TO_NSC &&
        formik.values.shipperList.length <= 0) ||
      values.doType === TYPE_BBGH.FARM_POST_HARVEST || // Farm nhập sau thu hoạch
      values.doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2 // Không có PXK cùng địa điểm
    ) {
      return false;
    }

    if (formik.values.shipperList.length <= 0) {
      formik.setFieldValue('shipperList', shipperListDefault);
    }
    return true;
  };

  onClickSave = e => {
    e.preventDefault();
    this.formRef.submitForm();
  };

  render() {
    const { classes, bbghEdit, onAlertInvalidWhenSubmit, ui } = this.props;
    const handlers = {
      [KEY_MAP.CREATE_BBGH.SAVE_BBGH]: this.onClickSave,
    };

    return (
      <HotKeys keyMap={KEY_MAP.CREATE_BBGH} handlers={handlers} focused>
        <FormWrapper
          formikRef={ref => {
            this.formRef = ref;
          }}
          enableReinitialize
          initialValues={bbghEdit}
          validationSchema={validSchema}
          onSubmit={this.handleSubmit}
          onInvalidSubmission={this.handleInvalidSubmission}
          render={formik => (
            <React.Fragment>
              <Grid container tabIndex="-1" style={{ outline: 0 }}>
                <Grid container justify="space-between">
                  <Grid item xl={8} lg={8} className={classes.titleBBGH}>
                    <Typography variant="h5" gutterBottom>
                      {formik.values.doType === TYPE_BBGH.NCC_TO_NSC
                        ? 'Đơn Đặt Hàng'
                        : 'Biên Bản Giao Hàng'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section1 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section2 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section3 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section4
                    ui={ui}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                    classes={classes}
                    onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
                    suggest
                    isUpdate={1}
                  />
                </Grid>
                <Grid item xs={12} xl={6} lg={6} className={classes.section}>
                  {viewBasketSection(formik.values.doType) && (
                    <Section5 formik={formik} />
                  )}
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  {this.isRender(formik) && formik.values.deliverOrReceiver ? (
                    <Section6 formik={formik} />
                  ) : null}
                </Grid>
                <Grid
                  container
                  className={classNames(classes.groupButton, classes.section)}
                  justify="flex-end"
                >
                  <Button
                    type="button"
                    variant="contained"
                    className={classNames(classes.cancel, classes.space)}
                    onClick={() =>
                      this.props.history.push('/danh-sach-bien-ban-giao-hang')
                    }
                  >
                    Hủy Bỏ
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    className={classNames(classes.submit, classes.space)}
                    disabled={formik.isSubmitting}
                    onClick={debounce(formik.handleSubmitClick, SUBMIT_TIMEOUT)}
                  >
                    Lưu
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </HotKeys>
    );
  }
}

BBGHEditPage.propTypes = {
  classes: PropTypes.object.isRequired,
  onGetInitPage: PropTypes.func,
  match: PropTypes.object,
  bbghEdit: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
  onUpdateBBGH: PropTypes.func,
  history: PropTypes.object,
  ui: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetInitPage: idBBGH => dispatch(getInitPage(idBBGH)),
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
    onUpdateBBGH: (BBGH, callback) => dispatch(updateBBGH(BBGH, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  bbghEdit: makeSelectBbghEdit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'bbghEdit', reducer });
const withSaga = injectSaga({ key: 'bbghEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(withRouter(BBGHEditPage))));
