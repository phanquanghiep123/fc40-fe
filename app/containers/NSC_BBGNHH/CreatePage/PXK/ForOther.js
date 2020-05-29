import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { getIn, Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiSelectAsync from 'components/MuiSelect/Async';

import MuiInput from 'components/MuiInput';
import { getExportReceiptAuto } from '../actions';
import { leadtimeRoutine, deliveryStocksRoutine } from '../routines';

import WrapperBusiness from '../Business';

import { CODE_FORM } from '../constants';

export class ForOther extends React.Component {
  validateField = value => {
    let error;
    if (!value) {
      error = 'Không được bỏ trống';
    }
    return error;
  };

  getStockList() {
    const stockList = getIn(
      this.props.formik.values,
      'deliveryReceiptStocks',
      [],
    );
    return stockList.slice();
  }

  setStockList(value, basket) {
    this.props.formik.setFieldValue('deliveryReceiptStocks', value);
    this.props.formik.setFieldValue('deliveryReceiptBaskets', basket);
  }

  updateValues(updater) {
    this.props.formik.updateValues(updater);
  }

  updateTransportValues(updater) {
    this.props.formik.updateFieldArrayValue(
      'deliveryReceiptTransports',
      0,
      updater,
    );
  }

  onExportReceiptChange = option => {
    const updaterData = {
      deliveryReceiptStockExports: [
        {
          stockExportReceiptCode: option.stockExportReceiptCode,
          basketDocumentCode: option.basketDocumentCode,
        },
      ],
      customerCode: option.customerCode,
      customerName: option.customerName,
      basketDocumentCode: option.basketDocumentCode,
    };
    this.updateValues(updaterData);

    if (option.transporterCode) {
      const transportData = {
        transporterCode: option.transporterCode,
        transporter: option.transporter,
      };
      this.updateTransportValues(transportData);
    }

    this.onGetLeadtime(option.customerCode);
    this.onGetDeliveryStocks(option.stockExportReceiptCode);
  };

  onGetLeadtime = customerCode => {
    const { deliverCode } = this.props.formik.values;
    this.props.onGetLeadtime(deliverCode, customerCode);
  };

  onGetExportReceiptAuto = (inputText, callback) => {
    const { deliverCode, deliveryDate } = this.props.formik.values;
    this.props.onGetExportReceiptAuto(
      deliverCode,
      deliveryDate,
      inputText,
      callback,
    );
  };

  onGetDeliveryStocks = exportReceiptCodes => {
    this.props.onGetDeliveryStocks(exportReceiptCodes, deliveryStocks => {
      if (
        deliveryStocks.exportStockReceiptProductInfos &&
        deliveryStocks.exportStockReceiptProductInfos.length > 0
      ) {
        this.setStockList(
          deliveryStocks.exportStockReceiptProductInfos,
          deliveryStocks.deliveryReceiptBasketInfos || [],
        );
      }
    });
  };

  render() {
    const { formik } = this.props;

    return (
      <WrapperBusiness code={CODE_FORM.MA_PXK}>
        {({ disabled }) => (
          <Grid item xs={12} md={6} lg={3}>
            <Field
              name="deliveryReceiptStockExports[0].stockExportReceiptCode"
              component={MuiSelectAsync}
              validate={this.validateField}
              valueKey="stockExportReceiptCode"
              labelKey="stockExportReceiptCode"
              sublabelKey="customerName"
              showError
              isDisabled={disabled}
              isMultiline
              autoTouched={formik.submitCount > 0}
              promiseOptions={this.onGetExportReceiptAuto}
              InputLabelProps={{
                shrink: true,
              }}
              TextFieldProps={{
                label: 'Mã Phiếu Xuất Kho',
                margin: 'dense',
                required: true,
              }}
              onChange={this.onExportReceiptChange}
            />
            <Grid item xs={12}>
              <Field
                name="deliveryReceiptStockExports[0].basketDocumentCode"
                label="Mã PXKS"
                component={MuiInput}
                disabled
                showError={false}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        )}
      </WrapperBusiness>
    );
  }
}

ForOther.propTypes = {
  formik: PropTypes.object,
  onGetLeadtime: PropTypes.func,
  onGetDeliveryStocks: PropTypes.func,
  onGetExportReceiptAuto: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  onGetLeadtime: (deliverCode, customerCode) =>
    dispatch(leadtimeRoutine.request({ deliverCode, customerCode })),
  onGetExportReceiptAuto: (deliverCode, deliveryDate, inputText, callback) =>
    dispatch(
      getExportReceiptAuto(deliverCode, deliveryDate, inputText, callback),
    ),
  onGetDeliveryStocks: (exportReceiptCodes, callback) =>
    dispatch(deliveryStocksRoutine.request({ exportReceiptCodes, callback })),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(ForOther);
