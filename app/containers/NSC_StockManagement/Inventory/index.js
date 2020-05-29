/*
page: Kiem ke kho
url: quan-ly-kho/kiem-ke-kho
* */
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form } from 'formik';
import * as PropTypes from 'prop-types';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import FormWrapper from 'components/FormikUI/FormWrapper';
import Grid from '@material-ui/core/Grid';
import formikPropsHelpers from 'utils/formikUtils';
import CompleteButton from 'components/Button/ButtonComplete';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { showWarning } from 'containers/App/actions';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import reducer from './reducer';
import saga from './saga';
import Heading from './Heading';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import * as actions from './actions';
import { getDataMaster, makeSelectData } from './selectors';
import Button from './Button';
import { BTN_CANCEL, BTN_COMPLETE, BTN_DELETE, BTN_SAVE } from './messages';

export const styles = theme => ({
  actions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  completeButton: {
    backgroundColor: theme.palette.orange[800],
    color: theme.palette.getContrastText(theme.palette.orange[800]),
    '&:hover': {
      backgroundColor: theme.palette.orange[900],
      color: theme.palette.getContrastText(theme.palette.orange[900]),
    },
  },
  deleteButton: {
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: '#e41e1e',
    },
  },
});

class Inventory extends Component {
  formik = null;

  state = {
    urlWarehouse: null,
  };

  handleScale = data => {
    const arrBasket = [];
    this.props.dataMaster.baskets.forEach(item => {
      arrBasket[item.palletBasketCode] = [
        item.palletBasketName,
        item.basketWeight,
      ];
    });
    const arrPallet = [];
    this.props.dataMaster.pallets.forEach(item => {
      arrPallet[item.palletCode] = [item.palletName, item.palletWeight];
    });
    const newValue = [];
    if (data.stockTakingTurnToScaleDetails.length > 0) {
      data.stockTakingTurnToScaleDetails.forEach(item => {
        const stock = {
          id: item.id,
          palletBasketCode: item.palletBasketCode,
          palletBasketName: arrBasket[item.palletBasketCode]
            ? arrBasket[item.palletBasketCode][0]
            : null,
          basketQuantity: item.palletBasketQuantity || 0,
          palletCode: item.palletCode,
          basketWeight: arrBasket[item.palletBasketCode]
            ? arrBasket[item.palletBasketCode][1]
            : 0,
          palletWeight: arrPallet[item.palletCode]
            ? arrPallet[item.palletCode][1]
            : 0,
          palletName: arrPallet[item.palletCode]
            ? arrPallet[item.palletCode][0]
            : null,
          palletQuantity: item.palletQuantity || 0,
          realWeight: item.realWeight,
          scalesWeight: item.scalesWeight,
        };
        newValue.push(stock);
      });
      if (data.stockTakingTurnToScaleDetails.length < 10) {
        const row = 10 - data.stockTakingTurnToScaleDetails.length;
        for (let i = 0; i < row; i += 1) {
          const defaultData = {
            id: 0,
            palletBasketCode: '',
            palletBasketName: '',
            basketQuantity: 0,
            basketWeight: 0,
            palletCode: '',
            palletName: '',
            palletQuantity: 0,
            palletWeight: 0,
            scalesWeight: '',
            realWeight: '',
          };
          newValue.push(defaultData);
        }
      }
      this.formik.setFieldValue('turnToScales', newValue);
    }
  };

  onFillProductDetail = params => {
    this.props.fillProductDetail(params, productDetail => {
      const subProduct = {
        batch: productDetail.batch,
        date: new Date(),
        id: productDetail.id,
        inventoryQuantity: productDetail.inventoryQuantity,
        locatorId: productDetail.locatorId,
        locatorName: productDetail.locatorName,
        plantCode: productDetail.plantCode,
        productCode: productDetail.productCode,
        productName: productDetail.productName,
        rateDifference: productDetail.rateDifference,
        reasonDifference: productDetail.reasonDifference,
        stockTakerId: productDetail.stockTakerId,
        stockTakingQuantity: productDetail.stockTakingQuantity,
        uom: productDetail.uom,
        weightDifference: productDetail.weightDifference,
        differentRatio: `${productDetail.weightDifference}         ${
          productDetail.rateDifference
        }%`,
        stockTakingTurnToScaleDetails:
          productDetail.stockTakingTurnToScaleDetails,
      };
      this.formik.setFieldValue('product', subProduct);
      if (productDetail.stockTakingTurnToScaleDetails) {
        this.handleScale(productDetail);
      }
    });
  };

  componentDidMount() {
    const {
      onFetchFormData,
      onGetListProduct,
      onGetWarehouses,
      location,
    } = this.props;

    const urlParams = new URLSearchParams(location.search);
    const plantId = urlParams.get('plantCode');
    const locatorId = urlParams.get('inventory');
    const productCode = urlParams.get('productCode');
    const batch = urlParams.get('batch');
    if (!plantId || !locatorId || !productCode || !batch) {
      // get basket, pallet, plant
      onFetchFormData(data => {
        this.formik.setFieldValue(['plantCode'], data.organizations[0].value);
        onGetWarehouses(data.organizations[0].value, dataWarehouse => {
          this.formik.setFieldValue('warehouse', dataWarehouse.id);
          onGetListProduct(
            dataWarehouse.id,
            data.organizations[0].value,
            product => {
              if (product) {
                this.formik.setFieldValue(
                  'productId',
                  `${product.productCode} - ${product.batch}`,
                );
                const params = {
                  plantCode: this.formik.values.plantCode,
                  locatorId: this.formik.values.warehouse,
                  productCode: product.productCode,
                  batch: product.batch,
                };
                this.onFillProductDetail(params);
              } else {
                this.formik.setFieldValue('productId', '');
                this.formik.setFieldValue('product', '');
                this.formik.setFieldValue(
                  'product[locatorName]',
                  dataWarehouse.description,
                );
              }
            },
          );
        });
      });
      this.setState({ urlWarehouse: null });
    } else {
      this.setState({ urlWarehouse: locatorId });
      // get basket, pallet, plant
      this.fillProductDetailUrl();
      // get warehouse
      onGetWarehouses(plantId);
    }
  }

  fillProductDetailUrl = () => {
    const { onFetchFormData, onGetListProduct, location } = this.props;
    const urlParams = new URLSearchParams(location.search);
    const plantId = urlParams.get('plantCode');
    const locatorId = urlParams.get('inventory');
    const productCode = urlParams.get('productCode');
    const batch = urlParams.get('batch');
    onFetchFormData(() => {
      this.formik.setFieldValue(['plantCode'], plantId);
      this.formik.setFieldValue(['warehouse'], locatorId);
      const id = `${productCode} - ${batch}`;
      onGetListProduct(locatorId, plantId, () => {
        const params = {
          locatorId,
          productCode,
          batch,
          plantCode: plantId,
        };
        this.onFillProductDetail(params);
        const arrProducts = [];
        this.props.dataMaster.products.forEach(item => {
          arrProducts.push(item.id);
        });
        this.formik.setFieldValue(['productId'], id);
      });
      return true;
    });
  };

  sectionRef = null;

  onDefaultTurnScales = () => {
    this.sectionRef.defaultTurnScales();
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onCancel = () => this.props.history.goBack();

  saveHandle = () => {
    const { values } = this.formik;
    if (!values.product.productCode) {
      this.props.showWarning('Chưa có sản phẩm nào được chọn');
      return false;
    }
    if (
      !values.product.reasonDifference &&
      values.product.weightDifference !== 0
    ) {
      this.props.showWarning(`Lý do chênh lệch không được để trống`);
      return false;
    }
    const stockTakingTurnToScaleDetails = [];
    values.turnToScales.forEach(item => {
      if (item.realWeight > 0) {
        const subItem = {
          id: item.id || 0,
          palletBasketCode: item.palletBasketCode || null,
          palletBasketName: item.palletBasketName || null,
          palletBasketQuantity: item.basketQuantity,
          palletCode: item.palletCode || null,
          palletName: item.palletName || null,
          palletQuantity: item.palletQuantity,
          scalesWeight: item.scalesWeight,
          realWeight: item.realWeight,
        };
        stockTakingTurnToScaleDetails.push(subItem);
      }
    });

    const user = JSON.parse(sessionStorage.getItem('FC40_LOGIN'));
    const data = {
      plantCode: values.plantCode,
      locatorId: values.warehouse,
      originCode: '0000',
      date: new Date(),
      productCode: values.product.productCode,
      productName: values.product.productName,
      inventoryQuantity: values.product.inventoryQuantity,
      stockTakingQuantity: values.product.stockTakingQuantity,
      stockTakerId: user.meta.userId,
      batch: values.product.batch,
      uom: values.product.uom,
      weightDifference: values.product.weightDifference,
      rateDifference: values.product.rateDifference,
      reasonDifference: values.product.reasonDifference,
      stockTakingTurnToScaleDetails,
    };
    if (stockTakingTurnToScaleDetails.length > 0) {
      this.props.onSave(data, responSave => {
        const locatorId = values.warehouse;
        const plantId = values.plantCode;
        const { productCode, batch } = values.product;

        this.props.onGetListProduct(locatorId, plantId, () => {
          this.formik.setFieldValue('productId', `${productCode} - ${batch}`);
        });
        this.handleScale(responSave.data);
      });
    } else {
      this.props.showWarning('Kiểm kê kho cần ít nhất 1 lần cân');
    }

    return true;
  };

  completeHandle = () => {
    const { values } = this.formik;
    if (!values.product.productCode) {
      this.props.showWarning('Chưa có sản phẩm nào được chọn');
      return false;
    }
    if (
      !values.product.reasonDifference &&
      values.product.weightDifference !== 0
    ) {
      this.props.showWarning(`Lý do chênh lệch không được để trống`);
      return false;
    }
    const stockTakingTurnToScaleDetails = [];
    values.turnToScales.forEach(item => {
      if (item.realWeight > 0) {
        const subItem = {
          id: item.id || 0,
          palletBasketCode: item.palletBasketCode,
          palletBasketName: item.palletBasketName,
          palletBasketQuantity: item.basketQuantity,
          palletCode: item.palletCode,
          palletName: item.palletName,
          palletQuantity: item.palletQuantity,
          scalesWeight: item.scalesWeight,
          realWeight: item.realWeight,
        };
        stockTakingTurnToScaleDetails.push(subItem);
      }
    });
    const user = JSON.parse(sessionStorage.getItem('FC40_LOGIN'));
    const data = {
      id: values.product.id || 0,
      plantCode: values.plantCode,
      originCode: '0000',
      locatorId: values.warehouse,
      date: new Date(),
      productCode: values.product.productCode,
      productName: values.product.productName,
      inventoryQuantity: values.product.inventoryQuantity,
      stockTakingQuantity: values.product.stockTakingQuantity,
      stockTakerId: user.meta.userId,
      batch: values.product.batch,
      uom: values.product.uom,
      weightDifference: values.product.weightDifference,
      rateDifference: values.product.rateDifference,
      reasonDifference: values.product.reasonDifference,
      stockTakingTurnToScaleDetails,
    };

    if (stockTakingTurnToScaleDetails.length > 0) {
      let mess = '';
      if (
        values.product.inventoryQuantity > values.product.stockTakingQuantity
      ) {
        mess =
          'Bạn có chắc chắn muốn hoàn thành cân cho sản phẩm này? Sau khi hoàn thành có thể sẽ tạo phiếu yêu cầu hủy cho phần chênh lệch trong kho và thực tế nếu không tìm được LSX tương ứng. Hoặc tạo phiếu nhập điều chỉnh giảm phân bổ theo LSX và trừ tồn trong kho?';
      }
      if (
        values.product.inventoryQuantity < values.product.stockTakingQuantity
      ) {
        mess =
          'Bạn có chắc chắn muốn hoàn thành cân cho sản phẩm này? Sau khi hoàn thành sẽ tạo phiếu nhập điều chỉnh thêm phần chênh lệch vào kho và tăng tồn cho sản phẩm trong kho tương ứng?';
      }
      if (
        values.product.inventoryQuantity === values.product.stockTakingQuantity
      ) {
        mess = 'Bạn có muốn hoàn thành cân cho sản phẩm này?';
      }
      this.onConfirmShow({
        title: 'Cảnh báo',
        message: mess,
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              this.props.onComplete(data, () => {
                this.props.onGetListProduct(
                  values.warehouse,
                  values.plantCode,
                  product => {
                    if (product) {
                      this.formik.setFieldValue(
                        'productId',
                        `${product.productCode} - ${product.batch}`,
                      );
                      const ArrScale = [];
                      const itemScale = {
                        id: 0,
                        palletBasketCode: '',
                        palletBasketName: '',
                        basketQuantity: 0,
                        basketWeight: 0,
                        palletCode: '',
                        palletName: '',
                        palletQuantity: 0,
                        palletWeight: 0,
                        scalesWeight: '',
                        realWeight: '',
                      };
                      for (let i = 0; i < values.turnToScales.length; i += 1) {
                        ArrScale.push(itemScale);
                      }
                      this.formik.setFieldValue('turnToScales', ArrScale);
                      const params = {
                        plantCode: values.plantCode,
                        locatorId: values.warehouse,
                        productCode: product.productCode,
                        batch: product.batch,
                      };
                      this.props.fillProductDetail(params, productDetail => {
                        this.formik.setFieldValue('product', productDetail);
                        if (productDetail.stockTakingTurnToScaleDetails) {
                          this.handleScale(productDetail);
                        }
                      });
                    } else {
                      setTimeout(this.props.history.goBack, 1000);
                    }
                  },
                );
              });
            },
          },
        ],
      });
    } else {
      this.props.showWarning('Kiểm kê kho cần ít nhất 1 lần cân');
    }
    return true;
  };

  onDelete = () => {
    const { onGetListProduct, deleteProduct } = this.props;
    const { values } = this.formik;
    this.onConfirmShow({
      title: 'Cảnh báo',
      message: 'Bạn có chắc chắn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            deleteProduct(
              {
                locatorId: values.warehouse,
                productCode: values.product.productCode,
                slotCode: values.product.batch,
                plantCode: values.plantCode,
              },
              () => {
                onGetListProduct(
                  values.warehouse,
                  values.plantCode,
                  product => {
                    if (product) {
                      this.formik.setFieldValue(
                        'productId',
                        `${product.productCode} - ${product.batch}`,
                      );
                      const params = {
                        plantCode: values.plantCode,
                        locatorId: values.warehouse,
                        productCode: product.productCode,
                        batch: product.batch,
                      };
                      this.onFillProductDetail(params);
                    } else {
                      this.formik.setFieldValue('productId', '');
                      this.formik.setFieldValue('product', '');
                      const newValue = [];
                      for (let i = 0; i < 10; i += 1) {
                        const defaultData = {
                          id: 0,
                          palletBasketCode: '',
                          palletBasketName: '',
                          basketQuantity: 0,
                          basketWeight: 0,
                          palletCode: '',
                          palletName: '',
                          palletQuantity: 0,
                          palletWeight: 0,
                          scalesWeight: '',
                          realWeight: '',
                        };
                        newValue.push(defaultData);
                      }
                      this.formik.setFieldValue('turnToScales', newValue);
                    }
                  },
                );
              },
            );
          },
        },
      ],
    });
  };

  render() {
    const { initValue, classes, dataMaster } = this.props;
    const savedInventoryItem = dataMaster.products
      .filter(item => !item.extend)
      .map(item => item.id);
    return (
      <React.Fragment>
        <section>
          <FormWrapper
            enableReinitialize
            initialValues={initValue}
            render={formik => {
              this.formik = { ...formik, ...formikPropsHelpers(formik) };
              return (
                <Form>
                  <Heading
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                    handleScale={data => this.handleScale(data)}
                    fillProductDetailUrl={this.fillProductDetailUrl}
                    urlWarehouse={this.state.urlWarehouse}
                  />
                  <section>
                    <Grid container spacing={24}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Section1 formik={formik} />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Section2
                          formik={{
                            ...formik,
                            ...formikPropsHelpers(formik),
                          }}
                          onDefaultClick={this.onDefaultTurnScales}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Section3
                          onRef={ref => {
                            this.sectionRef = ref;
                          }}
                          formik={{
                            ...formik,
                            ...formikPropsHelpers(formik),
                          }}
                          showWarning={this.props.showWarning}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={16}
                      justify="flex-end"
                      className={classes.actions}
                    >
                      <Grid item>
                        <Button
                          text={BTN_CANCEL}
                          outline
                          onClick={this.onCancel}
                        />
                      </Grid>
                      {savedInventoryItem.includes(formik.values.productId) && (
                        <Grid item>
                          <Button
                            className={classes.deleteButton}
                            text={BTN_DELETE}
                            onClick={this.onDelete}
                          />
                        </Grid>
                      )}
                      <Grid item>
                        <Button text={BTN_SAVE} onClick={this.saveHandle} />
                      </Grid>
                      <Grid item>
                        <CompleteButton
                          text={BTN_COMPLETE}
                          onClick={this.completeHandle}
                        />
                      </Grid>
                    </Grid>
                  </section>
                </Form>
              );
            }}
          />
        </section>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}
Inventory.propTypes = {
  history: PropTypes.object,
  onFetchFormData: PropTypes.func,
  initValue: PropTypes.object,
  onGetListProduct: PropTypes.func,
  onGetWarehouses: PropTypes.func,
  location: PropTypes.object,
  onSave: PropTypes.func,
  onComplete: PropTypes.func,
  showWarning: PropTypes.func,
  classes: PropTypes.object.isRequired,
  fillProductDetail: PropTypes.func,
  dataMaster: PropTypes.object,
  deleteProduct: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  initValue: makeSelectData(),
  dataMaster: getDataMaster(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: callback => dispatch(actions.fetchFormData(callback)),
    onGetListProduct: (locatorId, plantId, callback) =>
      dispatch(actions.getListProduct(locatorId, plantId, callback)),
    onGetWarehouses: (plantId, callback) =>
      dispatch(actions.getWarehouses(plantId, callback)),
    onSave: (values, callback) => dispatch(actions.save(values, callback)),
    onComplete: (values, callback) =>
      dispatch(actions.complete(values, callback)),
    showWarning: message => dispatch(showWarning(message)),
    fillProductDetail: (params, callback) =>
      dispatch(actions.fillProduct(params, callback)),
    deleteProduct: (params, callback) =>
      dispatch(actions.deleteProductAction(params, callback)),
  };
}

const withReducer = injectReducer({ key: 'Inventory', reducer });
const withSaga = injectSaga({ key: 'Inventory', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
Inventory.defaultProps = {};

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(Inventory)));
