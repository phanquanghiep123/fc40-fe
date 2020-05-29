import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getIn, Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import MuiSelectInput from 'components/MuiSelect/Input';
import { getFlattenValue } from 'components/MuiSelect/utils';

import { makeSelectData } from './selectors';

import { productRoutine, receiptsRoutine } from './routines';

import { SearchParamsSchema } from './Schema';

import Button from './Button';

import {
  TYPE_USER,
  TYPE_IMPORT,
  TYPE_PROCESSING,
  PRODUCT_STATUS,
  DOCUMENT_DETAIL_STATUS,
} from './constants';

export const styles = theme => ({
  heading: {},
  section: {},
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
    width: 140,
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
});

export const parseNumber = value => {
  if (Number.isNaN(value * 1)) {
    return 0;
  }
  return value * 1;
};

export const parseString = value => {
  if (typeof value === 'string') {
    if (value === 'null' || value === 'undefined') {
      return '';
    }
    return value.trim();
  }
  return '';
};

/* eslint-disable indent */
/* eslint-disable prefer-const */
export class Heading extends React.Component {
  state = {
    plant: {},
    receipt: {},
    product: {},
  };

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

  onInitPage = () => {
    const params = this.getSearchParams();

    if (params && params.plantCode) {
      this.selectPlantById(params.plantCode);
    } else {
      this.selectPlantByIndex(0);
    }
  };

  onInitProductPage = () => {
    const params = this.getSearchParams();

    if (params && params.documentId) {
      this.selectProductById(
        params.documentId,
        params.productCode,
        params.processingType,
        params.slotCode,
        params.finshedProductCode,
      );
    } else {
      this.selectProductByIndex(0, 0);
    }
  };

  onRefreshPage = () => {};

  onImportedSuccess = () => {
    const { receipt, product } = this.state;
    this.fetchWeighedProduct(receipt, product, true);
  };

  getTypeUser() {
    return getIn(this.props.formik.values, 'isSupplier');
  }

  getProductStatus() {
    return getIn(this.props.formik.values, 'documentDetailStatus');
  }

  getSearchParams() {
    const { search } = this.props.location;

    if (search) {
      const searchParams = SearchParamsSchema.cast({ plantCode: '' });
      const urlSearchParams = new URLSearchParams(search);

      const nextParams = Object.keys(searchParams).reduce(
        (params, searchKey) => ({
          ...params,
          [searchKey]: urlSearchParams.get(searchKey),
        }),
        {},
      );

      return nextParams;
    }

    return null;
  }

  makeSearchParams(search, params) {
    let comma = '';
    let searchURL = '';
    let searchParams = SearchParamsSchema.cast();

    if (params && params.documentId) {
      const urlSearchParams = new URLSearchParams(search);

      if (params.plantCode) {
        urlSearchParams.set('plantCode', params.plantCode);
      }

      Object.keys(searchParams)
        .reverse()
        .forEach(searchKey => {
          if (searchKey in params) {
            urlSearchParams.set(searchKey, params[searchKey] || '');
          }
        });

      urlSearchParams.forEach((searchValue, searchKey) => {
        searchURL += `${comma}${searchKey}=${searchValue}`;
        comma = '&';
      });
    }

    return searchURL;
  }

  importTypeVisible = () => {
    const request = get(this.props, 'initialSchema', 0);
    if (request.documentDetailStatus === DOCUMENT_DETAIL_STATUS.WEIGHT) {
      if (request.importType === TYPE_IMPORT.IMPORT_RIGHT) return true;
    } else return false;

    const { receipts } = this.props;
    if (!receipts || !receipts.length) {
      return false;
    }

    const typeUser = this.getTypeUser();
    const productStatus = this.getProductStatus();
    if (typeUser === TYPE_USER.NCC) {
      if (productStatus === PRODUCT_STATUS.WEIGHT) {
        return false;
      }
      if (productStatus === PRODUCT_STATUS.COMPLETED) {
        return false;
      }
      return true;
    }
    return false;
  };

  watchReceiptVisible = () => {
    const { receipt } = this.state;
    const { receipts } = this.props;

    if (!receipt || !receipt.id) {
      return false;
    }
    if (!receipts || !receipts.length) {
      return false;
    }
    return true;
  };

  createReceiptVisible = () => {
    const { organizations } = this.props;

    if (!organizations || !organizations.length) {
      return false;
    }
    return true;
  };

  weighingProductVisible = () => {
    const { organizations } = this.props;

    if (!organizations || !organizations.length) {
      return false;
    }
    return true;
  };

  selectPlantById(plantCode) {
    const foundData = this.findPlantById(plantCode);
    if (foundData && foundData.plant) {
      this.fetchWeighedReceipts(foundData.plant);
    }
  }

  selectPlantByIndex(plantIndex) {
    const foundData = this.findPlantByIndex(plantIndex);
    if (foundData && foundData.plant) {
      this.fetchWeighedReceipts(foundData.plant);
    }
  }

  selectProductById(
    receiptId,
    productCode,
    processingType,
    slotCode,
    finshedProductCode,
  ) {
    const foundData = this.findProductById(
      receiptId,
      productCode,
      processingType,
      slotCode,
      finshedProductCode,
    );
    if (foundData && foundData.receipt && foundData.product) {
      this.fetchWeighedProduct(foundData.receipt, foundData.product);
    }
  }

  selectProductByIndex(receiptIndex, productIndex) {
    const foundData = this.findProductByIndex(receiptIndex, productIndex);
    if (foundData && foundData.receipt && foundData.product) {
      this.fetchWeighedProduct(foundData.receipt, foundData.product);
    }
  }

  findPlantById(plantCode) {
    const { organizations } = this.props;

    if (organizations && organizations.length > 0) {
      const plant = organizations.find(
        item => item && item.value === plantCode,
      );

      if (plant && plant.value) {
        return { plant };
      }
    }

    return null;
  }

  findPlantByIndex(plantIndex) {
    const { organizations } = this.props;

    if (organizations && organizations[plantIndex]) {
      const plant = organizations[plantIndex];

      if (plant && plant.value) {
        return { plant };
      }
    }

    return null;
  }

  findProductById(
    receiptId,
    productCode,
    processingType,
    slotCode,
    finshedProductCode,
  ) {
    const { receipts } = this.props;

    if (receipts && receipts.length > 0) {
      const receipt = receipts.find(
        item => item && parseNumber(item.id) === parseNumber(receiptId),
      );

      if (receipt && receipt.options.length > 0) {
        if (productCode) {
          const product = receipt.options.find(
            item =>
              item &&
              parseString(productCode) === parseString(item.productCode) &&
              parseNumber(processingType) ===
                parseNumber(item.processingType) &&
              parseString(slotCode) === parseString(item.slotCode) &&
              parseString(finshedProductCode) ===
                parseString(item.finshedProductCode),
          );
          if (product && product.documentId) {
            return { receipt, product };
          }
        }

        const product = receipt.options[0];
        if (product && product.documentId) {
          return { receipt, product };
        }
      }
    }

    return null;
  }

  findProductByIndex(receiptIndex, productIndex) {
    const { receipts } = this.props;

    if (receipts && receipts[receiptIndex]) {
      const receipt = receipts[receiptIndex];

      if (receipt && receipt.options[productIndex]) {
        const product = receipt.options[productIndex];

        if (product && product.documentId) {
          return { receipt, product };
        }
      }
    }

    return null;
  }

  focusReceiptCreated(plantCode, callback) {
    if (this.state.plant && this.state.plant.value) {
      if (this.state.plant.value !== plantCode) {
        const { plant } = this.findPlantById(plantCode);

        if (plant && plant.value) {
          this.props.onGetWeighedReceipts(plant.value, () => {
            this.setState({ plant, receipt: {}, product: {} }, callback);
          });
        }
      } else {
        this.props.onGetWeighedReceipts(plantCode, callback);
      }
    }
  }

  fetchWeighedProduct(receipt, product, isSaved = false) {
    if (receipt && product && receipt.id && product.productCode) {
      const params = {
        documentId: receipt.id,
        productCode: product.productCode,
        processingType: product.processingType,
        slotCode: product.slotCode,
        finshedProductCode: product.finshedProductCode,
        listIds: product.listIds,
        deliveryName: receipt.deliveryName,
        processingTypeName: product.processingTypeName,
      };

      this.props.onGetWeighedProduct(
        params,
        isSaved, // Không reset thông tin cân,
        () => {
          this.setState({ receipt, product });
        },
      );
    }
  }

  fetchWeighedReceipts(plant, callback) {
    if (plant && plant.value) {
      this.props.onGetWeighedReceipts(plant.value, () => {
        this.setState(
          { plant, receipt: {}, product: {} },
          callback ||
            (() => {
              this.onInitProductPage();
            }),
        );
      });
    }
  }

  onReceiptWatch = () => {
    if (this.props.onReceiptWatch) {
      const { plant, receipt } = this.state;
      this.props.onReceiptWatch(plant.value, receipt.id);
    }
  };

  onReceiptCreate = () => {
    const onAgree = () => {
      this.props.onReceiptCreate();
    };

    this.props.onConfirmShow({
      title: 'Cảnh báo',
      message: 'Vui lòng thực hiện Lưu kho trước khi tạo mới Phiếu nhập kho.',
      actions: [
        { text: 'Bỏ qua' },
        { text: 'Đồng ý', color: 'primary', onClick: onAgree },
      ],
    });
  };

  onWeightingPlantChange = (option = {}) => {
    this.fetchWeighedReceipts(option, () => {
      this.selectProductByIndex(0, 0);
    });
  };

  onWeighingProductChange = (option = {}) => {
    this.selectProductById(
      option.documentId,
      option.productCode,
      option.processingType,
      option.slotCode,
      option.finshedProductCode,
    );
  };

  onImportedTypeChange = option => {
    const typeUser = this.getTypeUser();
    const importType = option.id;

    const defaultProcessingType = getIn(
      this.props.formik.values,
      'defaultProcessingType',
    );

    // [Cân hàng của NCC] và [Nhập xuất thẳng] => [Sơ chế]
    if (typeUser === TYPE_USER.NCC && importType === TYPE_IMPORT.IMPORT_RIGHT) {
      this.props.formik.setFieldValue('processingType', TYPE_PROCESSING.SO_CHE);
    } else {
      // Ngược lại, sử dụng [Giá trị mặc định]
      this.props.formik.setFieldValue('processingType', defaultProcessingType);
    }

    this.props.formik.setFieldValue('importType', importType);
  };

  render() {
    const { plant, receipt, product } = this.state;
    const { classes, receipts, importedType, organizations } = this.props;

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
                    Cân Nhập Kho
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
            <Grid item>
              <Grid container spacing={16}>
                <Grid item>
                  <Button
                    text="Tạo Mới"
                    outline
                    onClick={this.onReceiptCreate}
                    disabled={!this.createReceiptVisible()}
                  />
                </Grid>
                <Grid item>
                  <Button
                    text="Xem Phiếu Nhập Kho"
                    onClick={this.onReceiptWatch}
                    disabled={!this.watchReceiptVisible()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </section>
        <section className={classNames(classes.section, classes.toolbar)}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
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
                  <MuiSelectInput
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    value={getFlattenValue(organizations, plant.value)}
                    options={organizations}
                    labelKey="name"
                    valueKey="value"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onWeightingPlantChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={16} alignItems="center">
                <Grid item>
                  <Typography
                    variant="h6"
                    className={classNames(
                      classes.titleText,
                      classes.toolbarText,
                    )}
                  >
                    Mã Hàng Đang Cân
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7} lg={5}>
                  <MuiSelectInput
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    value={getFlattenValue(receipts, product.value)}
                    options={receipts}
                    isGrouped
                    isDisabled={!this.weighingProductVisible()}
                    labelKey="displayName"
                    groupLabelKey="displayName"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onWeighingProductChange}
                  />
                </Grid>
                <Grid item className={classes.medium}>
                  <Field
                    isTest
                    name="importType"
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    component={MuiSelectInput}
                    options={importedType}
                    labelKey="name"
                    valueKey="id"
                    isDisabled={!this.importTypeVisible()}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                    onChange={this.onImportedTypeChange}
                  />
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
  location: PropTypes.object.isRequired,
  onRef: PropTypes.func,
  formik: PropTypes.object,
  receipts: PropTypes.array,
  importedType: PropTypes.array,
  organizations: PropTypes.array,
  onConfirmShow: PropTypes.func,
  onReceiptWatch: PropTypes.func,
  onReceiptCreate: PropTypes.func,
  onGetWeighedProduct: PropTypes.func,
  onGetWeighedReceipts: PropTypes.func,
};

Heading.defaultProps = {
  receipts: [],
  importedType: [],
  organizations: [],
};

export const mapDispatchToProps = dispatch => ({
  onGetWeighedProduct: (params, isSaved, callback) =>
    dispatch(productRoutine.request({ params, isSaved, callback })),
  onGetWeighedReceipts: (plantCode, callback) =>
    dispatch(receiptsRoutine.request({ plantCode, callback })),
});

const mapStateToProps = createStructuredSelector({
  receipts: makeSelectData('receipts', 'data'),
  importedType: makeSelectData('master', 'importedType'),
  organizations: makeSelectData('master', 'organizations'),
  initialSchema: makeSelectData('product'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(withStyles(styles)(withImmutablePropsToJS(Heading)));
