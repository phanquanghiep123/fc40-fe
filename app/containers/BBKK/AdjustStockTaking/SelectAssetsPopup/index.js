/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import { Grid, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FormData from 'components/FormikUI/FormData';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import NumberFormatter from 'components/NumberFormatter';
import MuiInput from 'components/MuiInput';
import { getRowStyle } from 'utils/index';
import { debounce } from 'lodash';
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import MuiButton from '../../../../components/MuiButton';
import Expansion from '../../../../components/Expansion';
import { loadingError, setLoading } from '../../../App/actions';
import {
  makeColumnDefs,
  // makeDefaultColDef,
  // numberCurrency,
} from './columnDefs';
import { getNested, isNumberString } from '../../../App/utils';
import * as actions from '../actions';
import { popupSelectBasketsFormikSchema } from '../Schema';
import NotifyOnSubmit from '../../../../components/NotifyOnSubmit';
import { sumBy } from '../../../../utils/numberUtils';

const style = () => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& > *': {
      minWidth: 120,
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
  causeFieldContainer: {
    display: 'flex',
    width: 300,
    marginRight: '1rem',
    '& > div': {
      marginBottom: '0 !important',
    },
  },
});

const bottomRowData = data => [
  {
    totalCol: true,
    currentUnitPrice: 'Tổng',
    ownQuantity: sumBy(data, 'ownQuantity'),
    cancelQuantity: sumBy(data, 'cancelQuantity'),
    difference: sumBy(data, 'difference'),
  },
];

class SelectBasketsPopup extends React.Component {
  constructor(props) {
    super(props);
    this.popupFormik = React.createRef();
  }

  submitCount = 0;

  makeFormAttr = popupFormik => {
    const { formOptions } = this.props;
    return {
      basketLocatorCode: {
        name: 'basketLocatorCode',
        label: 'Kho nguồn',
        required: true,
        value: popupFormik.values.basketLocatorCode,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn kho nguồn',
        isClearable: false,
        disabled: true,
      },
      org: {
        name: 'org',
        label: 'Đơn Vị Huỷ',
        required: true,
        value: popupFormik.values.org,
        component: SelectAutocomplete,
        disabled: true,
      },
      palletBasket: {
        name: 'palletBasket',
        label: 'Mã Khay Sọt',
        required: true,
        value: popupFormik.values.palletBasket,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn khay sọt',
        isClearable: false,
        disabled: true,
      },
      palletBasketName: {
        name: 'palletBasketName',
        label: 'Tên Khay Sọt',
        value: popupFormik.values.palletBasketName,
        onChange: popupFormik.handleChange,
        component: InputControl,
        disabled: true,
      },
      uom: {
        name: 'uoM',
        label: 'Đơn Vị Tính',
        value: popupFormik.values.uom,
        onChange: popupFormik.handleChange,
        component: InputControl,
        disabled: true,
      },
      cancelValue: {
        name: 'cancelValue',
        label: 'Giá Trị Huỷ',
        value: popupFormik.values.cancelValue,
        onChange: popupFormik.handleChange,
        component: MuiInput,
        disabled: true,
      },
      inventoryQuantity: {
        name: 'inventoryQuantity',
        label: 'SL Tồn',
        onChange: popupFormik.handleChange,
        component: InputControl,
        disabled: true,
      },
      cancelQuantity: {
        name: 'cancelQuantity',
        label: 'SL Thanh Lý/Huỷ',
        required: true,
        value: popupFormik.values.cancelQuantity,
        component: InputControl,
        disabled: true,
      },
      cause: {
        name: 'cause',
        label: 'Nguyên nhân huỷ',
        value: formOptions.reasonCancel[1],
        required: true,
        component: SelectAutocomplete,
        // isAsync: true,
        defaultOptions: true,
        disabled: true,
        options: formOptions.reasonCancel,
      },
    };
  };

  /**
   * On Cell Value Change
   * @param e
   * @param popupFormik
   */
  onCellValueChanged = (e, popupFormik) => {
    const fieldName = e.colDef.field;
    switch (fieldName) {
      case 'cancelQuantity':
        this.onUpdateTablePinnedData(popupFormik);
        break;

      default:
    }
  };

  onUpdateTablePinnedData = popupFormik => {
    const { values } = popupFormik;
    const baskets = this.props.formik.values.assetInfo;
    if (!baskets || !baskets.length) return;
    const totalRow = {
      ownQuantity: 0,
      cancelQuantity: 0,
      difference: 0,
      cancelValue: 0,
    };
    baskets.forEach(item => {
      if (!item) return;
      Object.keys(totalRow).forEach(key => {
        if (key === 'cancelQuantity') {
          totalRow.cancelValue += parseFloat(
            isNumberString(item[key]) ? item[key] * item.currentUnitPrice : '0',
          );
        }
        totalRow[key] += parseFloat(
          isNumberString(item[key]) ? item[key] : '0',
        );
      });
    });
    totalRow.expectedCancelQuantity = isNumberString(values.cancelQuantity)
      ? parseFloat(values.cancelQuantity)
      : undefined;
    const updatedValues = {
      ...popupFormik.values,
      // palletBasketOld: popupFormik.values.palletBasket,
      cancelValue: totalRow.cancelValue,
      selectBaskets_pinned: [totalRow],
    };
    popupFormik.validateForm(updatedValues).then(errors => {
      popupFormik.setErrors(errors);
      popupFormik.setValues(updatedValues);
      popupFormik.setFieldValue('assetInfo', baskets);
    });
  };

  mergeAssetsTable = popupFormik => {
    const { formik, data, onMergeAssetTable } = this.props;
    const assetTable = formik.values.assetCancels.filter(item => {
      if (item.basketStocktakingDetailId !== data.id) {
        return item;
      }
      return null;
    });
    const dataTable = [
      ...assetTable,
      ...formik.values.assetInfo
        .filter(
          row =>
            row &&
            isNumberString(row.cancelQuantity) &&
            parseFloat(row.cancelQuantity) > 0, // filter out rows which have quantity = 0
        )
        .map(row => ({
          ...row,
          reasonCode: getNested(popupFormik.values, 'cause', 'value'),
          reasonName: getNested(popupFormik.values, 'cause', 'label'),
          palletBasketCode: popupFormik.values.palletBasket.value,
          palletBasketName: popupFormik.values.palletBasketName,
          uoM: popupFormik.values.uoM,
          basketStocktakingDetailId: data.id,
          seqFC: row.seqFC,
          seqSAP: row.seqSAP,
          ownerName: row.ownerName,
        })),
    ];
    const dataAsset = dataTable.map(rowData => {
      // if (!rowData) return;
      const cancelQuantity = parseFloat(rowData.cancelQuantity || 0);
      const cancelValue =
        (cancelQuantity * parseFloat(rowData.depreciationRemaining)) /
        parseFloat(rowData.inventoryQuantity);
      const currentCancelValue =
        cancelQuantity * parseFloat(rowData.currentUnitPrice);
      return {
        ...rowData,
        cancelQuantity,
        currentCancelValue,
        price: rowData.price ? rowData.price : cancelValue,
      };
    });
    dataAsset.sort(
      // (a, b) => (a.palletBasketCode > b.palletBasketCode ? 1 : -1),
      (a, b) =>
        a.assetCode > b.assetCode || a.palletBasketCode > b.palletBasketCode
          ? 1
          : -1,
    );
    onMergeAssetTable({ data: dataAsset });
  };

  render() {
    const {
      classes,
      onClose,
      ui,
      open,
      formik,
      dispatch,
      onLoadingError,
      onLoading,
    } = this.props;
    const columnDefs = makeColumnDefs();
    return (
      <ui.Dialog
        {...ui.props}
        title="Chọn Tài Sản Khay Sọt Để Thanh Lý Hủy"
        content={
          <div>
            <Formik
              ref={this.popupFormik}
              enableReinitialize
              validateOnChange
              validateOnBlur
              onSubmit={(values, formikActions) => {
                if (
                  values.selectBaskets_pinned &&
                  values.selectBaskets_pinned[0].cancelQuantity !==
                    values.selectBaskets_pinned[0].expectedCancelQuantity
                ) {
                  onLoadingError('Tổng SL Hủy phải bằng SL Thanh Lý/Huỷ ');
                } else {
                  this.submitCount = 1;
                  this.mergeAssetsTable({ values, ...formikActions });
                  onClose();
                  onLoading(false);
                  this.submitCount = 0;
                }
              }}
              initialValues={formik.values.initAssetTable}
              validationSchema={popupSelectBasketsFormikSchema}
              render={popupFormik => {
                const formAttr = this.makeFormAttr(popupFormik);

                const rightActions = (
                  <div className={classes.causeFieldContainer}>
                    <Field {...formAttr.cause} />
                  </div>
                );

                return (
                  <>
                    <NotifyOnSubmit formik={popupFormik} dispatch={dispatch} />
                    <div style={{ marginBottom: '1rem' }}>
                      <Expansion
                        title="I. THÔNG TIN CHUNG"
                        content={
                          <>
                            <Grid container spacing={32}>
                              <Grid
                                item
                                xs={4}
                                style={{ paddingTop: 0, paddingBottom: 0 }}
                              >
                                <Field {...formAttr.basketLocatorCode} />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                style={{ paddingTop: 0, paddingBottom: 0 }}
                              >
                                <Field {...formAttr.org} />
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              spacing={32}
                              style={{ paddingBottom: '1rem' }}
                            >
                              <Grid item xs={4}>
                                <Field {...formAttr.palletBasket} />
                                <Field {...formAttr.inventoryQuantity} />
                              </Grid>
                              <Grid item xs={4}>
                                <Field {...formAttr.palletBasketName} />
                                <Field {...formAttr.cancelQuantity} />
                              </Grid>
                              <Grid item xs={4}>
                                <Field {...formAttr.uom} />
                                <Field
                                  {...formAttr.cancelValue}
                                  InputProps={{
                                    inputComponent: NumberFormatter,
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </>
                        }
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <Expansion
                        title="II. THÔNG TIN TÀI SẢN"
                        rightActions={rightActions}
                        content={
                          <FormData
                            name="assetInfo"
                            columnDefs={columnDefs}
                            idGrid="grid-id"
                            gridStyle={{ height: 'auto' }}
                            setFieldValue={popupFormik.setFieldValue}
                            setFieldTouched={popupFormik.setFieldTouched}
                            gridProps={{
                              context: this,
                              suppressScrollOnNewData: true,
                              suppressHorizontalScroll: true,
                              domLayout: 'autoHeight',
                              frameworkComponents: {
                                customPinnedRowRenderer: PinnedRowRenderer,
                              },
                              onCellValueChanged: e =>
                                this.onCellValueChanged(e, popupFormik),
                              pinnedBottomRowData: bottomRowData(
                                popupFormik.values.assetInfo,
                              ),
                              getRowStyle,
                            }}
                            rowData={formik.values.assetInfo}
                            {...popupFormik} // pass popup formik props into agGrid
                          />
                        }
                      />
                    </div>

                    <div className={classes.btnContainer}>
                      <MuiButton outline onClick={onClose}>
                        Đóng
                      </MuiButton>
                      <MuiButton
                        disabled={
                          !popupFormik.values.inventoryQuantity ||
                          this.submitCount === 1
                        }
                        onClick={debounce(() => {
                          onLoading();
                          popupFormik.setFieldValue('isSubmit', true);
                          // popupFormik.setFieldValue('keepPopupOpened', false);
                          setTimeout(popupFormik.handleSubmit, 50);
                        }, 500)}
                      >
                        Chọn và Đóng
                      </MuiButton>
                    </div>
                  </>
                );
              }}
            />
          </div>
        }
        openDl={open}
        fullWidth
        maxWidth="lg"
        isDialog={false}
        customActionDialog
        onClose={onClose}
      />
    );
  }
}

SelectBasketsPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  onMergeAssetTable: PropTypes.func,
  dispatch: PropTypes.func,
  onLoadingError: PropTypes.func,
  onLoading: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    //   onFetchPopupBasket: (formik, basketLocatorCode, callback) =>
    //     dispatch(actions.fetchPopupBasket(formik, basketLocatorCode, callback)),
    //   onFetchCauseAssetAC: (reasonCode, callback) =>
    //     dispatch(actions.fetchCauseAsset(reasonCode, callback)),
    onMergeAssetTable: payload => dispatch(actions.mergeAssetTable(payload)),
    onLoadingError: message => dispatch(loadingError(message)),
    onLoading: isLoading => dispatch(setLoading(isLoading)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(SelectBasketsPopup);
