import { TYPE_PXK } from 'containers/NSC_PXK/PXK/constants';
import MESSAGE from 'containers/App/messageGlobal';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { HotKeys } from 'react-hotkeys';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import startOfDay from 'date-fns/startOfDay';

import FormWrapper from 'components/FormikUI/FormWrapper';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { BTN_COMPLETE } from 'containers/NSC_ImportedStockReceipt/WeightPage/messages';
import KEY_MAP from 'containers/App/keysmap';
import { showWarning } from 'containers/App/actions';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CompleteButton from 'components/Button/ButtonComplete';
import { fromJS } from 'immutable';
import Spacing from 'components/Spacing';
import message from './messages';
import reducer from './reducer';
import saga from './saga';
import { initSchemaSell, validationSell } from './Schema';
import * as actions from './actions';
import styles from './styles';
import PXK from './PXK';
import WrapperBusiness, { CODE, TYPE_FORM } from './Business';
import PXKInternal from './PXKInternal';
import PXKFarmTransition from '../PXK_FarmTransition/Create';
import PXKDestroy from '../PXK_Destroy';
import ExportedRetail from '../PXK_ExportedRetail/Section1';
import ButtonUI from './Button';
import * as selectors from './selectors';
import Sell from '../PXK_Sell';
import { onChangeSchemaUtils } from './utils';
import './styles.css';

class NSC_PXK extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: TYPE_FORM.CREATE,
      complete: false,
      saved: false,
      idPxk: null,
      type: TYPE_PXK.PXK_NOI_BO,
    };
    this.pxkRef = null;
  }

  hotKeysHandler = () => ({
    [KEY_MAP.PXK.PXK_SAVE]: this.onSave,
  });

  getPXKbyId = (id, type, form, plantId) =>
    this.props.onGetPXKbyId(id, type, form, plantId); // view/update

  init = () => {
    const {
      location: { search },
      match: { params, path },
      history,
    } = this.props;
    // view/edit

    // 1.0. Tạo phiếu xuất kho có điều kiện, callback là tiền xử lý trước khi hiển thị theo từng loại xuất bán
    // 1.1 . Chi tiết/chỉnh sửa phiếu xuất kho,
    // 2. Tạo phiếu xuất kho thuần
    // 3. Case khác chuyển về trang danh sách
    if (search) {
      const urlParams = new URLSearchParams(search); // not support IE
      const type = urlParams.get('type'); // type pxk
      const form = urlParams.get('form'); // 1:create/2:edit/3:view
      const plantId = urlParams.get('plantId'); // mã đơn vị xuất hàng
      const receiptCode = urlParams.get('receiptCode'); // mã đơn vị xuất hàng
      this.props.onUpdateReducer({ set: { type: Number(type) } });
      // 1.0
      if (path.indexOf('tao-phieu-xuat-kho') > -1) {
        this.setState({ form, idPxk: params.id });
        let callback = null;
        if (Number(type) === TYPE_PXK.PXK_XUAT_HUY) {
          callback = () => {
            this.props.onUpdateReducer({
              setIn: {
                initSchema_subType: Number(type),
                // initSchema_deliverCode: plantId,
                initSchema_receiptCode: receiptCode,
                deliverCode: plantId,
                receiptcode: receiptCode,
              },
            });
            this.pxkRef.props.onGetDestroyDetail(
              receiptCode,
              this.pxkRef.props.formik.values,
            );
            this.pxkRef.props.onGetListRequest(
              this.pxkRef.props.formik.values.deliverCode.value,
            );
          };
        } else if (Number(type) === TYPE_PXK.PXK_XUAT_BAN) {
          callback = () => {
            this.props.onUpdateReducer({
              set: {
                initSchema: fromJS(initSchemaSell),
                validationSchema: validationSell,
                deliverCode: plantId,
              },
              setIn: {
                initSchema_deliverCode: plantId,
                deliverCode: plantId,
              },
            });
            this.props.onGetInitExportSell();
          };
        }
        this.props.onGetInitPXK(callback, Number(type), plantId);
      } else {
        this.setState({ form, idPxk: params.id, saved: true }, () => {
          if (Number(type) !== TYPE_PXK.PXK_XUAT_BAN_XA) {
            this.getPXKbyId(params.id, type, form, plantId);
          } else {
            this.setState({ type: TYPE_PXK.PXK_XUAT_BAN_XA });
          }
        });
      }
    } else if (path.indexOf('tao-phieu-xuat-kho') > -1) {
      this.props.onGetInitPXK();
    } else {
      history.push('/danh-sach-phieu-xuat-kho');
    }
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.props.resetForm();
  }

  onClickComplete = (complete, formik, callback) => {
    formik.setFieldValue('isCompleteAction', complete);
    this.setState({ complete }, () => callback());
  };

  confirmExportSell = values => {
    const basketArr = [];
    values.basketsTrays.forEach(item => {
      if (item.basketCode && item.quantity > 0) {
        basketArr.push(item);
      }
    });

    // Không chọn Đơn vị quản lý ks
    if (!values.customerBasketCode) {
      // k có thông tin ks
      if (basketArr.length === 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message:
            'Bạn có muốn tạo BBGNHH khi hoàn thành Phiếu xuất bán không?',
          actions: [
            {
              text: 'Không',
              color: 'primary',
              onClick: () => {
                this.onCompletePXK({ ...values, isAgreement: false });
              },
            },
            {
              text: 'Có',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }

      // có thông tin ks
      if (basketArr.length > 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message:
            'Bạn có muốn cho khách hàng mượn khay sọt không, Ấn [Đồng ý] để chọn [Đơn vị quản lý khay sọt] tương ứng',
          actions: [
            {
              text: 'Hủy',
              color: 'primary',
              onClick: () => {
                this.showConfirm({
                  title: message.CONFIRM,
                  message:
                    'Bạn có muốn tạo BBGNHH khi hoàn thành Phiếu xuất bán không?',
                  actions: [
                    {
                      text: 'Hủy',
                      color: 'primary',
                      onClick: () =>
                        this.onCompletePXK({ ...values, isAgreement: false }),
                    },
                    {
                      text: 'Đồng Ý',
                      color: 'primary',
                      onClick: () => {
                        this.onCompletePXK({ ...values, isAgreement: true });
                      },
                    },
                  ],
                });
              },
            },
            {
              text: 'Đồng Ý',
              color: 'primary',
              onClick: () => false,
            },
          ],
        });
      }
    }

    // Chọn Đơn vị quản lý ks
    if (values.customerBasketCode) {
      // k có thông tin ks
      if (basketArr.length === 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message:
            'Bạn có muốn tạo BBGNHH khi hoàn thành Phiếu xuất bán không?',
          actions: [
            {
              text: 'Không',
              color: 'primary',
              onClick: () => {
                this.onCompletePXK({ ...values, isAgreement: false });
              },
            },
            {
              text: 'Có',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }

      // có thông tin ks
      if (basketArr.length > 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message: `Hệ thống sẽ xử lí xuất khay sọt cho mượn cho Tên đơn vị quản lí khay sọt là ${
            values.customerBasketName
          }. Bạn có muốn tạo BBGNHH khi tạo Phiếu xuất bán không?`,
          actions: [
            {
              text: 'Không',
              color: 'primary',
              onClick: () => {
                this.onCompletePXK({ ...values, isAgreement: false });
              },
            },
            {
              text: 'Có',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }
    }
  };

  confirmExportResell = values => {
    const basketArr = [];
    values.basketsTrays.forEach(item => {
      if (item.basketCode && item.quantity > 0) {
        basketArr.push(item);
      }
    });

    // Không chọn Đơn vị quản lý ks
    if (!values.customerBasketCode) {
      // k có thông tin ks
      if (basketArr.length === 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message: 'Bạn có chắc chắn muốn hoàn thành Phiếu xuất bán xá không?',
          actions: [
            {
              text: 'Hủy',
              color: 'primary',
            },
            {
              text: 'Đồng Ý',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }

      // có thông tin ks
      if (basketArr.length > 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message:
            'Bạn có muốn cho khách hàng mượn khay sọt không, Ấn [Đồng ý] để chọn [Đơn vị quản lý khay sọt] tương ứng',
          actions: [
            {
              text: 'Hủy',
              color: 'primary',
              onClick: () => {
                this.showConfirm({
                  title: message.CONFIRM,
                  message:
                    'Bạn có chắc chắn muốn hoàn thành Phiếu xuất bán xá không?',
                  actions: [
                    {
                      text: 'Hủy',
                      color: 'primary',
                    },
                    {
                      text: 'Đồng Ý',
                      color: 'primary',
                      onClick: () =>
                        this.onCompletePXK({ ...values, isAgreement: true }),
                    },
                  ],
                });
              },
            },
            {
              text: 'Đồng Ý',
              color: 'primary',
              onClick: () => false,
            },
          ],
        });
      }
    }

    // Chọn Đơn vị quản lý ks
    if (values.customerBasketCode) {
      // k có thông tin ks
      if (basketArr.length === 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message: 'Bạn có chắc chắn muốn hoàn thành Phiếu xuất bán xá không?',
          actions: [
            {
              text: 'Hủy',
              color: 'primary',
            },
            {
              text: 'Đồng Ý',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }

      // có thông tin ks
      if (basketArr.length > 0) {
        this.showConfirm({
          title: message.CONFIRM,
          message: `Hệ thống sẽ xử lí xuất khay sọt cho mượn cho Tên đơn vị quản lí khay sọt là ${
            values.customerBasketName
          }. Bạn có chắc chắn muốn hoàn thành Phiếu xuất bán xá không?`,
          actions: [
            {
              text: 'Hủy',
              color: 'primary',
              onClick: () => false,
            },
            {
              text: 'Đồng Ý',
              color: 'primary',
              onClick: () =>
                this.onCompletePXK({ ...values, isAgreement: true }),
            },
          ],
        });
      }
    }
  };

  onCompletePXK = values => {
    this.props.onCompletePXK(
      {
        ...values,
        ...{ id: this.state.idPxk },
      },
      this.props.location.pathname,
    );
  };

  savePXB = submitValues => {
    if (submitValues.detailsCommands.length === 0) {
      this.props.onShowWarning(
        'Phiếu xuất kho phải có ít nhất 1 sản phẩm cần xuất',
      );
      return false;
    }
    let isExportedQuantityEqualZero = false;
    for (let i = 0; i < submitValues.detailsCommands.length; i += 1) {
      if (submitValues.detailsCommands[i].exportedQuantity === 0) {
        isExportedQuantityEqualZero = true;
      }
    }
    if (isExportedQuantityEqualZero) {
      this.props.onShowWarning('Số lượng xuất phải lớn hơn 0');
      return false;
    }
    this.props.onCheckSave(
      {
        ...submitValues,
        ...{ id: this.state.idPxk },
      },
      response => {
        let warning = '';
        if (response.listNotOkProductExtend.length > 0) {
          response.listNotOkProductExtend.forEach(item => {
            warning += `Mã sản phẩm ${item.productCode} thiếu extend \n`;
          });
        } else if (response.listNotOkSalePrice.length > 0) {
          response.listNotOkSalePrice.forEach(item => {
            warning += `Mã sản phẩm ${item.productCode} thiếu giá \n`;
          });
        } else {
          warning = 'Bạn có chắc chắn lưu không?';
        }
        this.showConfirm({
          title: message.WARNING,
          message: warning,
          actions: [
            { text: 'Hủy', color: 'primary' },
            {
              text: 'Đồng ý',
              color: 'primary',
              onClick: () => {
                this.props.onSavePXK({
                  ...submitValues,
                  ...{ id: this.state.idPxk },
                });
              },
            },
          ],
        });
      },
    );
    return true;
  };

  onSave = values => {
    const submitValues = {
      ...values,
      ...{ date: startOfDay(new Date(values.date)) },
      deliverCode: values.deliverCode && values.deliverCode.value,
      receiverCode: values.receiverCode && values.receiverCode.value,
    };
    if (this.state.saved && submitValues.subType === TYPE_PXK.PXK_XUAT_BAN) {
      if (this.state.complete) {
        this.props.onCheckSave(
          {
            ...submitValues,
            ...{ id: this.state.idPxk },
          },
          response => {
            let warning = '';
            if (response.listNotOkProductExtend.length > 0) {
              response.listNotOkProductExtend.forEach(item => {
                warning += `Mã sản phẩm ${item.productCode} thiếu extend \n`;
              });
            } else if (response.listNotOkSalePrice.length > 0) {
              response.listNotOkSalePrice.forEach(item => {
                warning += `Mã sản phẩm ${item.productCode} thiếu giá \n`;
              });
            }
            this.showConfirm({
              title: message.WARNING,
              message: warning + message.WARNING_COMPLETE,
              actions: [
                { text: 'Hủy' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: debounce(() => {
                    // Xuất Bán Từ Dữ Liệu Chia Chọn Thực Tế
                    if (submitValues.isDelivery) {
                      this.onCompletePXK({ ...values, isAgreement: false });

                      // Xuất Bán không phải Từ Dữ Liệu Chia Chọn Thực Tế
                    } else {
                      this.confirmExportSell(submitValues);
                    }
                  }, 1000),
                },
              ],
            });
          },
        );
      } else {
        this.savePXB(submitValues);
      }
    } else if (
      this.state.saved ||
      submitValues.subType === TYPE_PXK.PXK_XUAT_HUY
    ) {
      if (this.state.complete) {
        if (submitValues.subType === TYPE_PXK.PXK_XUAT_BAN_XA) {
          this.confirmExportResell(submitValues);
        } else {
          this.showConfirm({
            title: message.WARNING,
            message: message.WARNING_COMPLETE,
            actions: [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => this.onCompletePXK(submitValues),
              },
            ],
          });
        }
      } else {
        // click lưu với table
        this.props.onSavePXK({ ...submitValues, ...{ id: this.state.idPxk } });
        // console.log('----{ ...submitValues, ...{ id: this.state.idPxk }----', {
        //   ...submitValues,
        //   ...{ id: this.state.idPxk },
        // });
      }
    } else {
      this.props.onSave(submitValues, idPxk => {
        this.setState({ saved: true, idPxk });
      });
      // this.setState({ saved: true }, this.scrollToRef);
    }
  };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onGoBack = formik => {
    const {
      values: { supervisorID, note, detailsCommands },
    } = formik;
    if (
      this.state.form !== TYPE_FORM.VIEW &&
      (supervisorID || note || (detailsCommands && detailsCommands.length > 0))
    ) {
      this.showConfirm({
        message: message.GO_BACK,
        title: message.NOT_SAVE_DATA,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => this.goBack(),
          },
        ],
      });
    } else {
      this.goBack();
    }
  };

  goBack = () => {
    const {
      match: { path },
      history,
    } = this.props;
    if (path !== '/tao-phieu-xuat-kho') {
      history.goBack();
    }
    history.push('/danh-sach-phieu-xuat-kho');
  };

  changeSchema = (type, formik) => {
    const { onUpdateReducer } = this.props;
    const cloneValues = {};
    if (this.props.units.length > 0) {
      // cloneValues.deliverCode = this.props.units[0].id;
      const { first } = this.props.units;
      cloneValues.deliverCode = first;
    }
    if (formik.values.deliverCode) {
      cloneValues.deliverCode = {
        value: formik.values.deliverCode.value,
        label: formik.values.deliverCode.label,
      };
      cloneValues.deliverName = formik.values.deliverCode.label;
    }
    onChangeSchemaUtils(type, onUpdateReducer, cloneValues);
    this.setState({ type });
  };

  onInvalidSubmission = fkInvalid => {
    const { errors } = fkInvalid;
    Object.keys(errors).forEach((key, index) => {
      if (index === 0) {
        if (errors[key] instanceof Array && errors[key].length > 0) {
          for (let i = 0; i < errors[key].length; i += 1) {
            if (typeof errors[key][i] === 'object') {
              const keys = Object.keys(errors[key][i]);
              this.props.onShowWarning(errors[key][i][keys[0]]);
            }
          }
        } else if (typeof errors[key] === 'string') {
          this.props.onShowWarning(MESSAGE.INVALID_MODEL);
        }
      }
    });
  };

  render() {
    const {
      classes,
      history,
      units,
      receiverUnits,
      exportTypes,
      warehouse,
      initSchema,
      onShowWarning,
      onGetProducts,
      ui,
      onDeleteRow,
      onGetInitPXK,
      onGetBasketAuto,
      validationSchema,
      onGetBatchAuto,
    } = this.props;
    const { type } = this.state;

    return (
      <HotKeys
        keyMap={KEY_MAP.PXK}
        handlers={this.hotKeysHandler()}
        focused
        attach={document}
        style={{ outline: 0 }}
      >
        <FormWrapper
          enableReinitialize
          initialValues={initSchema}
          validationSchema={validationSchema}
          onSubmit={this.onSave}
          onInvalidSubmission={this.onInvalidSubmission}
          FormikProps={{
            validateOnBlur: false,
            validateOnChange: false,
          }}
          render={formik => (
            <React.Fragment>
              {type === TYPE_PXK.PXK_XUAT_BAN_XA && (
                <ExportedRetail
                  ref={ref => {
                    this.pxkRef = ref;
                  }}
                  formik={formik}
                  onGetInitPXK={onGetInitPXK}
                  classes={classes}
                  history={history}
                  initDatas={{ units, exportTypes, receiverUnits }}
                  saved={this.state.saved}
                  typeForm={this.state.form}
                  onGoBack={this.goBack}
                  onChangeSchema={this.changeSchema}
                  onClickComplete={this.onClickComplete}
                  form={this.state.form}
                  {...this.props}
                  onShowWarning={{
                    dublicate: onShowWarning,
                    confirm: this.showConfirm,
                  }}
                />
              )}
              {type !== TYPE_PXK.PXK_XUAT_BAN_XA && (
                <PXK
                  ref={ref => {
                    this.pxkRef = ref;
                  }}
                  ui={ui}
                  formik={formik}
                  onGetInitPXK={onGetInitPXK}
                  classes={classes}
                  history={history}
                  initDatas={{ units, exportTypes, receiverUnits }}
                  saved={this.state.saved}
                  typeForm={this.state.form}
                  onChangeSchema={this.changeSchema}
                  onGoBack={this.onGoBack}
                  confirm={this.showConfirm}
                  {...this.props}
                />
              )}
              <Grid container className={classes.spaceTop} />
              <WrapperBusiness
                formik={formik}
                saved={this.state.saved}
                code={CODE.TABLE_1}
                typeForm={this.state.form}
              >
                {props =>
                  props.isInternal && (
                    <PXKInternal
                      formik={formik}
                      classesParent={classes}
                      warehouse={warehouse}
                      onGetProducts={onGetProducts}
                      onClickComplete={this.onClickComplete}
                      onGoBack={this.onGoBack}
                      history={history}
                      onGetBatchAuto={onGetBatchAuto}
                      onShowWarning={{
                        dublicate: onShowWarning,
                        confirm: this.showConfirm,
                      }}
                      form={this.state.form}
                      onDeleteRow={onDeleteRow}
                    />
                  )
                }
              </WrapperBusiness>
              <WrapperBusiness
                formik={formik}
                saved={this.state.saved}
                code={CODE.TABLE_2}
                typeForm={this.state.form}
              >
                {props =>
                  props.isFarmTransition && (
                    <PXKFarmTransition
                      history={history}
                      ui={ui}
                      formik={formik}
                      onShowWarning={{
                        dublicate: onShowWarning,
                        confirm: this.showConfirm,
                      }}
                      onDeleteRow={onDeleteRow}
                      onGetBasketAuto={onGetBasketAuto}
                      form={this.state.form}
                    />
                  )
                }
              </WrapperBusiness>
              <WrapperBusiness
                formik={formik}
                saved={this.state.saved}
                code={CODE.TABLE_4}
                typeForm={this.state.form}
              >
                {props =>
                  props.isSell && (
                    <Sell
                      onGetProducts={onGetProducts}
                      ui={ui}
                      formik={formik}
                      history={history}
                      form={this.state.form}
                      classes={classes}
                      warehouse={warehouse}
                      onGetBasketAuto={onGetBasketAuto}
                      onShowWarning={{
                        dublicate: onShowWarning,
                        confirm: this.showConfirm,
                      }}
                      onDeleteRow={onDeleteRow}
                    />
                  )
                }
              </WrapperBusiness>
              {/* Xuất hủy */}
              <WrapperBusiness
                formik={formik}
                saved={this.state.saved}
                code={CODE.TABLE_3}
                typeForm={this.state.form}
              >
                {props =>
                  props.isDestroy && (
                    <PXKDestroy
                      formik={formik}
                      form={this.state.form}
                      classesParent={classes}
                      onShowWarning={{
                        dublicate: onShowWarning,
                        confirm: this.showConfirm,
                      }}
                    />
                  )
                }
              </WrapperBusiness>
              <Grid container className={classes.spaceTop} />
              {type !== TYPE_PXK.PXK_XUAT_BAN_XA && (
                <WrapperBusiness
                  formik={formik}
                  saved={this.state.saved}
                  code={CODE.GROUP_BUTTONS}
                  typeForm={this.state.form}
                >
                  {propsGroup => (
                    <Grid
                      container
                      justify="flex-end"
                      tabIndex="-1"
                      style={{ outline: 0, paddingTop: 24, paddingBottom: 32 }}
                    >
                      <ButtonUI
                        type="button"
                        onClick={() => this.onGoBack(formik)}
                        title="Quay Lại"
                        style={classes.secondary}
                      />

                      {!propsGroup.isCompletePxk && (
                        <>
                          <WrapperBusiness
                            typeForm={this.state.form}
                            code={CODE.SAVE_TABLE}
                            formik={formik}
                          >
                            {props => (
                              <ButtonUI
                                color="primary"
                                type="button"
                                onClick={e => {
                                  if (props.rowsIsDublicated) {
                                    onShowWarning(props.dupicatedMessage);
                                  } else {
                                    this.onClickComplete(false, formik, () =>
                                      formik.handleSubmitClick(e),
                                    );
                                  }
                                }}
                                title="Lưu"
                                style={classes.primary}
                                disabled={formik.isSubmitting || props.disabled}
                              />
                            )}
                          </WrapperBusiness>
                          {!formik.values.autoFlag && (
                            <WrapperBusiness
                              code={CODE.COMPLETE_TABLE}
                              formik={formik}
                              typeForm={this.state.form}
                            >
                              {props => (
                                <CompleteButton
                                  text={BTN_COMPLETE}
                                  onClick={() =>
                                    this.onClickComplete(
                                      true,
                                      formik,
                                      formik.handleSubmitClick,
                                    )
                                  }
                                  title="Hoàn Thành"
                                  disabled={
                                    formik.isSubmitting || props.disabled
                                  }
                                />
                              )}
                            </WrapperBusiness>
                          )}
                        </>
                      )}
                    </Grid>
                  )}
                </WrapperBusiness>
              )}
              <Spacing height={10} />
              <ConfirmationDialog
                ref={ref => {
                  this.confirmRef = ref;
                }}
              />
            </React.Fragment>
          )}
        />
      </HotKeys>
    );
  }
}

NSC_PXK.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  ui: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  // init data
  units: PropTypes.array,
  receiverUnits: PropTypes.array,
  exportTypes: PropTypes.array,
  warehouse: PropTypes.array,
  initSchema: PropTypes.object,
  // api
  resetForm: PropTypes.func,
  onGetInitPXK: PropTypes.func,
  onGetProducts: PropTypes.func,
  onSave: PropTypes.func,
  onShowWarning: PropTypes.func,
  onSavePXK: PropTypes.func,
  onCompletePXK: PropTypes.func,
  onGetPXKbyId: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onGetBasketAuto: PropTypes.func,
  type: PropTypes.number,
  onGetInitExportSell: PropTypes.func,
  onCheckSave: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    resetForm: () => dispatch(actions.resetForm()),
    onGetInitPXK: (callback, subType, data) =>
      dispatch(actions.getInitPXK(callback, subType, data)),
    onGetProducts: (options, inputText, callback) =>
      dispatch(actions.getProducts({ options, inputText, callback })),
    onGetBatchAuto: (params, inputText, callback) =>
      dispatch(actions.getBatchAuto(params, inputText, callback)),
    onSave: (values, callback) => dispatch(actions.save(values, callback)),
    onShowWarning: mes => dispatch(showWarning(mes)),
    onSavePXK: values => dispatch(actions.savePXK(values)),
    onCompletePXK: (values, location) =>
      dispatch(actions.completePXK(values, location)),
    onGetPXKbyId: (id, type, form, plantId) =>
      dispatch(actions.getPXKbyId({ id, type, form, plantId })),
    onDeleteRow: (params, callback) =>
      dispatch(actions.deleteRow(params, callback)),
    onGetBasketAuto: (textInput, callback) =>
      dispatch(actions.getBasketAuto(textInput, callback)),
    onUpdateReducer: data => {
      dispatch(actions.updateReducer(data));
    },
    onGetDestroyDetail: (receiptCode, formik) =>
      dispatch(actions.getDestroyDetail(receiptCode, formik)),
    onGetListRequest: plantCode =>
      dispatch(actions.getListRequestDestroy(plantCode)),
    onGetInitExportSell: () => dispatch(actions.getInitExportSell()),
    // Lưu ở trang chỉnh sửa của xuất bán
    onCheckSave: (data, callback) => {
      dispatch(actions.checkSave(data, callback));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  units: selectors.makeSelectUnits(), // Đơn vị xuất hàng
  receiverUnits: selectors.makeSelectReceiverUnits(), // Đơn vị nhận hàng
  exportTypes: selectors.makeSelectExportTypes(), // Loại xuất kho
  warehouse: selectors.makeSelectWarehouse(), // Kho nguồn, đích
  initSchema: selectors.makeSelectInitSchema(),
  sellTypes: selectors.makeSelectData('sellTypes'), // loại đơn bán hàng
  channels: selectors.makeSelectData('channels'), // kênh
  transporters: selectors.makeSelectData('transporters'), // nhà vận chuyển
  validationSchema: selectors.makeSelectData('validationSchema'), // nhà vận chuyển
  type: selectors.makeSelectData('type'), // nhà vận chuyển
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'pxk', reducer });
const withSaga = injectSaga({ key: 'pxk', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
  withImmutablePropsToJS,
  withRouter,
)(NSC_PXK);
