import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import MuiSelectInput from 'components/MuiSelect/Input';
import DatePickerControl from 'components/PickersControl';
import { getDataMaster } from './selectors';
import * as actions from './actions';

export const styles = theme => ({
  heading: {
    marginTop: 30,
  },
  titleText: {
    fontWeight: 500,
  },
  label: {
    backgroundColor: theme.palette.action.selected,
  },
  labelText: {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
  toolbar: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  toolbarText: {
    fontSize: 16,
  },
  medium: {
    width: 250,
  },
  select: {
    paddingLeft: theme.spacing.unit * 1.5,
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
  },
  product: {
    marginTop: 5,
  },
});

/* eslint-disable indent */
/* eslint-disable prefer-const */
export class Heading extends React.Component {
  state = {};

  componentDidMount() {
    this.setRef(this);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.onRef) {
      this.props.onRef(ref);
    }
  }

  selectProduct = product => {
    if (product) {
      this.props.formik.setFieldValue(
        'productId',
        `${product.productCode} - ${product.batch}`,
      );
      const params = {
        plantCode: this.props.formik.values.plantCode,
        locatorId: this.props.formik.values.warehouse,
        productCode: product.productCode,
        batch: product.batch,
      };
      this.props.fillProductDetail(params, productDetail => {
        const subProduct = {
          batch: productDetail.batch,
          date: new Date(),
          id: productDetail.id,
          inventoryQuantity: productDetail.inventoryQuantity || '0',
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
        this.props.formik.setFieldValue('product', subProduct);
        if (productDetail.stockTakingTurnToScaleDetails) {
          this.props.handleScale(productDetail);
        }
      });
    } else {
      this.props.formik.setFieldValue('productId', '');
      this.props.formik.setFieldValue('product', '');
      this.props.formik.setFieldValue('product[locatorName]', '');
    }
  };

  // thay đổi đơn vị
  onChangeOrganization = selected => {
    this.props.formik.setFieldValue('plantCode', selected.value);
    this.props.onGetWarehouses(selected.value, data => {
      this.onChangeWarehouses(data);
      // this.props.formik.setFieldValue('warehouse', data.id);
      // this.selectProduct(data, selected.value);
    });
  };

  onSetTurnToScales = () => {
    const valueTable = [];
    const data = {
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
    this.props.formik.values.turnToScales.forEach(() => {
      valueTable.push(data);
    });
    this.props.formik.setFieldValue('turnToScales', valueTable);
  };

  // thay đổi kho
  onChangeWarehouses = selected => {
    this.props.formik.setFieldValue('warehouse', selected.id);
    if (selected.id !== this.props.urlWarehouse) {
      this.props.onGetListProduct(
        selected.id,
        this.props.formik.values.plantCode,
        this.selectProduct,
      );
    } else {
      this.props.fillProductDetailUrl();
    }
    this.onSetTurnToScales();
  };

  onChangeProduct = selected => {
    this.props.formik.setFieldValue('productId', selected.id);

    const params = {
      plantCode: this.props.formik.values.plantCode,
      locatorId: this.props.formik.values.warehouse,
      productCode: selected.productCode,
      batch: selected.batch,
    };
    this.props.fillProductDetail(params, data => {
      const subProduct = {
        batch: data.batch,
        date: new Date(),
        id: data.id,
        inventoryQuantity: data.inventoryQuantity || '0',
        locatorId: data.locatorId,
        locatorName: data.locatorName,
        plantCode: data.plantCode,
        productCode: data.productCode,
        productName: data.productName,
        rateDifference: data.rateDifference,
        reasonDifference: data.reasonDifference,
        stockTakerId: data.stockTakerId,
        stockTakingQuantity: data.stockTakingQuantity,
        weightDifference: data.weightDifference,
        uom: data.uom,
        differentRatio: `${data.weightDifference}         ${
          data.rateDifference
        }%`,
        stockTakingTurnToScaleDetails: data.stockTakingTurnToScaleDetails,
      };
      this.props.formik.setFieldValue('product', subProduct);

      if (data.stockTakingTurnToScaleDetails) {
        this.props.handleScale(data);
      }
    });
    this.onSetTurnToScales();
  };

  render() {
    const { receipt } = this.state;
    const { classes, dataMaster } = this.props;
    return (
      <section className={classes.heading}>
        <section className={classes.section}>
          <Grid
            container
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Grid container spacing={16}>
                <Grid item>
                  <Typography variant="h5" className={classes.titleText}>
                    Kiểm Kê Kho
                  </Typography>
                </Grid>
                {receipt &&
                  receipt.displayName && (
                    <Grid item>
                      <Chip
                        label={receipt.displayName}
                        classes={{
                          root: classes.label,
                          label: classNames(
                            classes.titleText,
                            classes.labelText,
                          ),
                        }}
                      />
                    </Grid>
                  )}
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section className={classNames(classes.section, classes.toolbar)}>
          <Grid container spacing={16}>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Grid container spacing={16} alignItems="center">
                <Grid item>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.titleText,
                      classes.toolbarText,
                    )}
                  >
                    Đơn vị
                  </Typography>
                </Grid>
                <Grid item className={classes.medium}>
                  <Field
                    name="plantCode"
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    component={MuiSelectInput}
                    options={dataMaster.organizations}
                    labelKey="name"
                    valueKey="value"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onChangeOrganization}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Grid container spacing={16} alignItems="center">
                <Grid item>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.titleText,
                      classes.toolbarText,
                    )}
                  >
                    Kho
                  </Typography>
                </Grid>
                <Grid item className={classes.medium}>
                  <Field
                    name="warehouse"
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    component={MuiSelectInput}
                    options={dataMaster.warehouses}
                    labelKey="description"
                    valueKey="id"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onChangeWarehouses}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <Grid container spacing={16}>
                <Grid item md={2}>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.titleText,
                      classes.toolbarText,
                      classes.product,
                    )}
                  >
                    Sản phẩm
                  </Typography>
                </Grid>
                <Grid item md={10} className={classes.medium}>
                  <Field
                    name="productId"
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    options={dataMaster.products}
                    component={MuiSelectInput}
                    labelKey="productName"
                    valueKey="id"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onChangeProduct}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Grid
                container
                spacing={16}
                alignItems="center"
                justify="flex-start"
              >
                <Grid item md={6}>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.titleText,
                      classes.toolbarText,
                    )}
                  >
                    Ngày xử lý giao dịch
                  </Typography>
                </Grid>
                <Grid item md={4} className={classes.medium}>
                  <Field name="date" component={DatePickerControl} disabled />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
      </section>
    );
  }
}

Heading.propTypes = {
  classes: PropTypes.object.isRequired,
  dataMaster: PropTypes.object,
  fillProductDetail: PropTypes.func,
  fillProductDetailUrl: PropTypes.func,
  formik: PropTypes.object,
  handleScale: PropTypes.func,
  onGetListProduct: PropTypes.func,
  onGetWarehouses: PropTypes.func,
  onRef: PropTypes.func,
  urlWarehouse: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    onGetWarehouses: (plantId, callback) =>
      dispatch(actions.getWarehouses(plantId, callback)),

    onGetListProduct: (inventory, plantId, callback) =>
      dispatch(actions.getListProduct(inventory, plantId, callback)),

    fillProductDetail: (params, callback) =>
      dispatch(actions.fillProduct(params, callback)),
  };
}
const mapStateToProps = createStructuredSelector({
  dataMaster: getDataMaster(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(withStyles(styles)(withImmutablePropsToJS(Heading)));
