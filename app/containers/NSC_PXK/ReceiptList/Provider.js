import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import { closeDialog } from 'containers/App/actions';

import { Provider } from './connect';

import {
  masterRoutine,
  productRoutine,
  productsRoutine,
  receiptsRoutine,
  importedRoutine,
} from './routines';
import { makeSelectData } from './selectors';
import { openWeightPopup, setInitWeightPopup } from './actions';

import WeightSchema from './WeightPopup/Schema';
import { SearchParamsSchema } from './Schema';

export class StateProvider extends React.Component {
  state = {};

  componentDidMount() {
    this.props.onGetInitMaster(() => {
      this.onPlantInit();
    });
  }

  getContext = () => ({
    ...this.state,
    onScaleClick: this.onScaleClick,
    onPlantChange: this.onPlantChange,
    onImportStock: this.onImportStock,
    onWeightPopupOpen: this.onWeightPopupOpen,
    setInitWeightPopup: this.setInitWeightPopup,
    onGetProductTurnScales: this.onGetProductTurnScales,
  });

  getSearchParams() {
    const { search } = this.props.history.location;

    if (search) {
      const searchParams = SearchParamsSchema.cast();
      const urlSearchParams = new URLSearchParams(search);

      return Object.keys(searchParams).reduce(
        (params, searchKey) => ({
          ...params,
          [searchKey]: urlSearchParams.get(searchKey),
        }),
        {},
      );
    }
    return null;
  }

  onPlantInit() {
    const params = this.getSearchParams();
    let plantCode = this.getPlantCode();

    if (params && params.deliverCode) {
      plantCode = params.deliverCode;
    }

    if (plantCode) {
      this.setPlantValue('');
      this.selectPlantById(plantCode);
    } else {
      this.selectPlantByIndex(0);
    }
  }

  onReceiptInit() {
    const params = this.getSearchParams();
    let receiptId = this.getReceiptId();

    if (params && params.documentId) {
      receiptId = params.documentId * 1;
    }

    if (receiptId) {
      this.setReceiptValue(null);
      this.selectReceiptById(receiptId);
    } else {
      this.selectReceiptByIndex(0);
    }

    this.onProductInit();
  }

  onProductInit() {
    const params = this.getSearchParams();

    if (params && params.documentId && params.documentDetailId) {
      const receiptId = params.documentId * 1;
      const productId = params.documentDetailId * 1;

      const receipt = this.props.receipts.find(
        item => item && item.id === receiptId,
      );
      const recentlyReceipt = this.props.recentlyReceipts.find(
        item => item && item.id === receiptId,
      );
      const nextReceipt = recentlyReceipt || receipt;

      if (nextReceipt) {
        this.onWeightPopupOpen({
          ...nextReceipt,
          detailId: productId,
        });
      }
    }
  }

  getPlants(valueDef = []) {
    return getIn(this.props.formik.values, 'plants', valueDef);
  }

  getPlantCode(valueDef) {
    return getIn(this.props.formik.values, 'plantCode', valueDef);
  }

  getReceiptId(valueDef) {
    return getIn(this.props.formik.values, 'receiptId', valueDef);
  }

  setPlants(plants) {
    this.props.formik.setFieldValue('plants', plants);
  }

  setPlantValue(plantCode) {
    this.props.formik.setFieldValue('plantCode', plantCode);
  }

  setReceiptValue(receiptId) {
    this.props.formik.setFieldValue('receiptId', receiptId);
  }

  selectPlantById(plantCode) {
    const foundValue = this.findPlantById(plantCode);
    if (foundValue) {
      this.fetchReceiptsWeighing(foundValue);
    }
  }

  selectPlantByIndex(plantIndex) {
    const foundValue = this.findPlantByIndex(plantIndex);
    if (foundValue) {
      this.fetchReceiptsWeighing(foundValue);
    }
  }

  selectReceiptById(receiptId) {
    const foundValue = this.findReceiptById(receiptId);
    if (foundValue) {
      this.setReceiptValue(foundValue);
    }
  }

  selectReceiptByIndex(receiptIndex) {
    const foundValue = this.findReceiptByIndex(receiptIndex);
    if (foundValue) {
      this.setReceiptValue(foundValue);
    }
  }

  selectProductById(productId, receipt) {
    const foundValue = this.findProductById(productId);
    if (foundValue) {
      this.fetchProductWeighing(foundValue, receipt);
    }
  }

  selectProductByIndex(productIndex, receipt) {
    const foundValue = this.findProductByIndex(productIndex);
    if (foundValue) {
      this.fetchProductWeighing(foundValue, receipt);
    }
  }

  findPlantById(plantCode, organizations = this.props.organizations) {
    if (organizations && organizations.length > 0) {
      const plant = organizations.find(
        item => item && item.value === plantCode,
      );
      if (plant && plant.value) {
        return plant.value;
      }
    }
    return '';
  }

  findPlantByIndex(plantIndex, organizations = this.props.organizations) {
    if (organizations && organizations[plantIndex]) {
      const plant = organizations[plantIndex];
      if (plant && plant.value) {
        return plant.value;
      }
    }
    return '';
  }

  findReceiptById(receiptId, receipts = this.props.receipts) {
    if (receipts && receipts.length > 0) {
      const receipt = receipts.find(item => item && item.id === receiptId);
      if (receipt && receipt.id) {
        return receipt.id;
      }
    }
    return null;
  }

  findReceiptByIndex(receiptIndex, receipts = this.props.receipts) {
    if (receipts && receipts[receiptIndex]) {
      const receipt = receipts[receiptIndex];
      if (receipt && receipt.id) {
        return receipt.id;
      }
    }
    return '';
  }

  findProductById(productId, products = this.props.products) {
    if (products && products.length > 0) {
      const product = products.find(item => item && item.id === productId);
      if (product && product.id) {
        return product.id;
      }
    }
    return null;
  }

  findProductByIndex(productIndex, products = this.props.products) {
    if (products && products[productIndex]) {
      const product = products[productIndex];
      if (product && product.id) {
        return product.id;
      }
    }
    return '';
  }

  fetchProductWeighing(productId, receipt) {
    const foundData = this.props.products.find(
      item => item && item.id === productId,
    );

    if (foundData) {
      const nextData = {
        ...receipt,
        ...foundData,
        documentId: receipt.id,
        documentDetailId: productId,
        baseUoM: foundData.uom,
        basketPallet: {},
        turnToScales: [],
      };

      this.setInitWeightPopup(
        WeightSchema.cast(nextData, {
          stripUnknown: true,
        }),
      );
      this.onGetProductTurnScales(productId);
    }
  }

  fetchReceiptsWeighing(plantCode, callback) {
    if (plantCode) {
      this.setPlantValue(plantCode);

      this.props.onGetReceiptsWeighing(plantCode, () => {
        if (callback) {
          callback(plantCode);
        } else {
          this.onReceiptInit();
        }
      });
    }
  }

  onScaleClick = () => {
    const receiptId = this.getReceiptId();
    const receipt = this.props.receipts.find(
      item => item && item.id === receiptId,
    );
    const recentlyReceipt = this.props.recentlyReceipts.find(
      item => item && item.id === receiptId,
    );
    this.onWeightPopupOpen(recentlyReceipt || receipt);
  };

  setInitWeightPopup = weightData => {
    this.props.setInitWeightPopup(weightData);
  };

  onPlantChange = plantCode => {
    this.fetchReceiptsWeighing(plantCode, () => {
      this.selectReceiptByIndex(0);
    });
  };

  onImportStock = values => {
    this.props.onImportStock(values, () => {
      this.onImportStockSuccess(values);
    });
  };

  onImportStockSuccess = ({ isComplete }) => {
    const plantCode = this.getPlantCode();

    this.fetchReceiptsWeighing(plantCode, () => {
      if (isComplete) {
        const { documentId, subType } = this.props.product;
        const params = {
          documentId,
          subType,
        };

        this.props.onGetProductsWeighing(params, () => {
          if (this.props.products && this.props.products.length > 0) {
            const receipt = this.props.receipts.find(
              item => item && item.id === documentId,
            );
            const recentlyReceipt = this.props.recentlyReceipts.find(
              item => item && item.id === documentId,
            );
            const nextReceipt = recentlyReceipt || receipt;
            this.selectProductByIndex(0, { ...nextReceipt, documentId });
          } else {
            this.props.closeDialog();
          }
        });
      }
    });
  };

  onWeightPopupOpen = weightData => {
    const nextWeightData = {
      ...weightData,
      documentId: weightData.id,
    };

    this.props.openWeightPopup(nextWeightData, () => {
      if (nextWeightData.detailId) {
        const productValue = this.findProductById(nextWeightData.detailId);
        if (productValue) {
          this.fetchProductWeighing(productValue, nextWeightData);
        } else {
          this.selectProductByIndex(0, nextWeightData);
        }
      } else {
        this.selectProductByIndex(0, nextWeightData);
      }
    });
  };

  onGetProductTurnScales = productId => {
    const params = {
      documentDetailId: productId,
    };
    this.props.onGetProductTurnScales(params);
  };

  render() {
    const context = this.getContext();

    return (
      <Provider value={context}>
        {this.props.children ? this.props.children : null}
      </Provider>
    );
  }
}

StateProvider.propTypes = {
  formik: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  children: PropTypes.node,
  product: PropTypes.object,
  products: PropTypes.array,
  receipts: PropTypes.array,
  organizations: PropTypes.array,
  recentlyReceipts: PropTypes.array,
  closeDialog: PropTypes.func,
  setInitWeightPopup: PropTypes.func,
  onImportStock: PropTypes.func,
  openWeightPopup: PropTypes.func,
  onGetInitMaster: PropTypes.func,
  onGetReceiptsWeighing: PropTypes.func,
  onGetProductsWeighing: PropTypes.func,
  onGetProductTurnScales: PropTypes.func,
};

StateProvider.defaultProps = {
  product: {},
  products: [],
  receipts: [],
  organizations: [],
  recentlyReceipts: [],
};

const mapStateToProps = createStructuredSelector({
  product: makeSelectData('product'),
  products: makeSelectData('products'),
  receipts: makeSelectData('receipts'),
  organizations: makeSelectData('master', 'organizations'),
  recentlyReceipts: makeSelectData('receipts', 'recently'),
});

export const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  setInitWeightPopup: (weightData, callback) =>
    dispatch(setInitWeightPopup(weightData, callback)),
  onImportStock: (data, callback) =>
    dispatch(importedRoutine.request({ data, callback })),
  openWeightPopup: (weightData, callback) =>
    dispatch(openWeightPopup(weightData, callback)),
  onGetInitMaster: callback => dispatch(masterRoutine.request({ callback })),
  onGetReceiptsWeighing: (plantCode, callback) =>
    dispatch(receiptsRoutine.request({ plantCode, callback })),
  onGetProductsWeighing: (params, callback) =>
    dispatch(productsRoutine.request({ params, callback })),
  onGetProductTurnScales: params =>
    dispatch(productRoutine.request({ params })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  withImmutablePropsToJS,
)(StateProvider);
