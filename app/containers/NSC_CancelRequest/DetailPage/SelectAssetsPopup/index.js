/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import { Grid, withStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { debounce, isEqual } from 'lodash';
import find from 'lodash/find';
import NumberFormatter from 'components/NumberFormatter';
import MuiInput from 'components/MuiInput';
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import MuiButton from '../../../../components/MuiButton';
import FormData from '../../../../components/FormikUI/FormData';
import Expansion from '../../../../components/Expansion';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { setLoading } from '../../../App/actions';
import {
  ASSET_TABLE,
  BASKET_INUSE_TABLE,
  SELECT_BASKET_TABLE,
  SELECT_BASKET_TABLE_PINNED,
} from '../constants';
import { popupSelectBasketsFormikSchema } from '../Schemas';
import { getNested, isNumberString } from '../../../App/utils';
import { assetsTableFields, basketsInUseFields } from '../tableFields';
import {
  onUpdateBasketsInfoTableData,
  onUpdateAssetPinnedData,
  onUpdateBasketsInUsePinnedData,
} from '../utils';
import NotifyOnSubmit from '../../../../components/NotifyOnSubmit';

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

class SelectBasketsPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultColDef: makeDefaultColDef(),
      initialValues: this.getInitValues(),
    };

    this.popupFormik = React.createRef();
  }

  getInitValues = () => {
    const {
      formik,
      selectBoxData,
      receiptData,
      // onFetchPopupTableData,
      // dataPalletBasket,
    } = this.props;

    // get default cause - nguyên nhân huỷ
    const causes = getNested(selectBoxData, 'causeAsset');
    const defaultCause = causes && causes.length ? causes[0] : null;

    // get default basket locator - kho nguồn
    const defaultBasketLocatorCode =
      selectBoxData.basketLocatorCode && selectBoxData.basketLocatorCode.length
        ? selectBoxData.basketLocatorCode[0]
        : null;

    // get default basket
    let defaultPalletBasket = null;
    let inStock = '';
    if (receiptData.isAutoReceipt) {
      defaultPalletBasket =
        selectBoxData.popupBasket && selectBoxData.popupBasket.length
          ? selectBoxData.popupBasket[0]
          : null;

      inStock = this.calculateRemainingInStock(defaultPalletBasket, {
        basketLocatorCode: defaultBasketLocatorCode,
      });
    }

    return {
      basketLocatorCode: defaultBasketLocatorCode,
      org: formik.values.org,
      ...(defaultPalletBasket
        ? {
            palletBasket: defaultPalletBasket,
            palletBasketCode: defaultPalletBasket.palletBasketCode,
            palletBasketName: defaultPalletBasket.palletBasketName,
            uom: defaultPalletBasket.uom,
            inStock,
            inStockOriginal: defaultPalletBasket.inStockOriginal,
          }
        : {
            palletBasket: null,
            palletBasketCode: '',
            palletBasketName: '',
            uom: '',
            inStock: '',
            inStockOriginal: '',
          }),

      cancelValue: '0',
      cancelQuantity: '',
      cause: defaultCause,
      isSubmit: false, // true => when click buttons select baskets
      [SELECT_BASKET_TABLE]: [],
      isFirstClick: true,
    };
  };

  componentDidUpdate(prevProps) {
    const { selectBoxData, receiptData, isEdit, data } = this.props;
    if (
      (isEdit &&
        !isEqual(
          prevProps.selectBoxData.popupBasket,
          selectBoxData.popupBasket,
        )) ||
      !isEqual(prevProps.selectBoxData.causeAsset, selectBoxData.causeAsset)
    ) {
      if (receiptData.isAutoReceipt) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(prevState => ({
          ...prevState,
          initialValues: {
            ...prevState.initialValues,
            basketLocatorCode: {
              value: data.basketLocatorCode,
              label: data.basketLocatorName,
            },
            palletBasket: {
              value: data.palletBasketCode,
              label: data.palletBasketName,
            },
            palletBasketCode: data.palletBasketCode,
            palletBasketName: data.palletBasketName,
            uom: data.uom,
            inStock: data.maxCancelQuantity,
            // cause: defaultCause,
            inStockOriginal: data.inStockQuantity,
            cancelQuantity: data.cancelQuantity,
            cancelRequestBasketDetailCode: data.cancelRequestBasketDetailCode,
            isEdit,
            id: data.id,
            assetStatus: data.assetStatus || null,
            images: data.images,
            note: data.note,
            cause: { value: data.causeCode, label: data.cause },
          },
        }));
        this.popupFormik.current.setFieldValue('isFirstClick', true);
        // console.log();
        setTimeout(this.popupFormik.current.handleSubmit, 100);
        return;
      }
      const palletBasket = find(selectBoxData.popupBasket, {
        palletBasketCode: data.palletBasketCode,
      });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(prevState => ({
        ...prevState,
        initialValues: {
          ...prevState.initialValues,
          basketLocatorCode: {
            value: data.basketLocatorCode,
            label: data.basketLocatorName,
          },
          palletBasket: {
            value: palletBasket.value,
            label: palletBasket.label,
          },
          palletBasketCode: palletBasket.palletBasketCode,
          palletBasketName: palletBasket.palletBasketName,
          uom: palletBasket.uom,
          inStock: palletBasket.inStock,
          // cause: defaultCause,
          inStockOriginal: palletBasket.inStockOriginal,
          cancelQuantity: data.cancelQuantity,
          cancelRequestBasketDetailCode: data.cancelRequestBasketDetailCode,
          isEdit,
          id: data.id,
          assetStatus: data.assetStatus || null,
          images: data.images,
          note: data.note,
          cause: { value: data.causeCode, label: data.cause },
        },
      }));
      this.popupFormik.current.setFieldValue('isFirstClick', true);
      setTimeout(this.popupFormik.current.handleSubmit, 100);
      return;
    }

    /**
     * Set default palletBasket on open popup for autoReceipt
     */
    if (
      (receiptData.isAutoReceipt &&
        !isEqual(
          prevProps.selectBoxData.popupBasket,
          selectBoxData.popupBasket,
        )) ||
      !isEqual(prevProps.selectBoxData.causeAsset, selectBoxData.causeAsset)
    ) {
      let defaultPalletBasket =
        selectBoxData.popupBasket && selectBoxData.popupBasket.length
          ? selectBoxData.popupBasket[0]
          : null;
      if (!defaultPalletBasket) return;

      let inStock = '';
      if (receiptData.isAutoReceipt) {
        const popupFormik = {
          ...this.popupFormik.current,
          values: this.popupFormik.current.state.values,
        };
        const filteredBasketsData = this.filterBasketsData(popupFormik);
        if (filteredBasketsData.length) {
          [defaultPalletBasket] = filteredBasketsData;
        } else {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState(prevState => ({
            ...prevState,
            initialValues: {
              ...prevState.initialValues,
              palletBasket: null,
              palletBasketCode: null,
              palletBasketName: '',
              uom: '',
              inStock: '',
              inStockOriginal: '',
            },
          }));

          return;
        }

        inStock = this.calculateRemainingInStock(
          defaultPalletBasket,
          this.state.initialValues,
        );
      }

      let defaultCause = null;
      if (selectBoxData.causeAsset && selectBoxData.causeAsset.length) {
        [defaultCause] = selectBoxData.causeAsset;
      }

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(prevState => ({
        ...prevState,
        initialValues: {
          ...prevState.initialValues,
          palletBasket: defaultPalletBasket,
          palletBasketCode: defaultPalletBasket.palletBasketCode,
          palletBasketName: defaultPalletBasket.palletBasketName,
          uom: defaultPalletBasket.uom,
          inStock,
          cause: defaultCause,
          inStockOriginal: defaultPalletBasket.inStockOriginal,
        },
      }));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(actions.fetchPopupBasketSuccess([]));
  }

  /**
   * Tính toán sản lượng huỷ tối đa còn lại
   * @param {Object|null} selectedBasket - khay sọt được chọn
   * @param popupFormikValues
   * @return {*}
   */
  calculateRemainingInStock = (selectedBasket, popupFormikValues) => {
    const { formik, receiptData } = this.props;
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');

    let inStock = '';
    if (selectedBasket) {
      // eslint-disable-next-line prefer-destructuring
      inStock = selectedBasket.inStock;

      // Calculate remaining inStock
      const basketsInUseTable = formik.values[BASKET_INUSE_TABLE];
      const remainingQuantity = {};
      if (isAutoReceipt && basketsInUseTable && basketsInUseTable.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const basket of basketsInUseTable) {
          // eslint-disable-next-line no-continue
          if (!basket) continue;
          const id = `${basket.basketLocatorCode}.${basket.palletBasketCode}`;
          remainingQuantity[id] =
            (remainingQuantity[id] || 0) +
            (basket.maxCancelQuantity - basket.cancelQuantity);
        }

        const selectedBasketLocatorCode = getNested(
          popupFormikValues.basketLocatorCode,
          'value',
        );

        inStock =
          remainingQuantity[
            `${selectedBasketLocatorCode}.${selectedBasket.palletBasketCode}`
          ];
      }
    }

    return inStock;
  };

  /**
   * Filter out records with remaining stock <= 0
   * @param basketsInUseData - table data of thông tin khay sọt sử dụng
   * @return {*[]|*} - filtered table data
   */
  filterOutEmptyRemainingStockRecords = basketsInUseData => {
    if (!basketsInUseData) return [];
    const t = basketsInUseFields;

    return basketsInUseData.filter(
      row =>
        row &&
        isNumberString(row[t.maxCancelQuantity]) &&
        isNumberString(row[t.cancelQuantity]) &&
        parseFloat(row[t.maxCancelQuantity]) -
          parseFloat(row[t.cancelQuantity]) >
          0,
    );
  };

  /**
   * Filter danh sách kho nguồn
   * @return {[]|*[]}
   */
  filterBasketLocatorsData = () => {
    const { selectBoxData, formik, pageType, receiptData } = this.props;

    const t = basketsInUseFields;
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');
    let basketsInUseData = getNested(formik.values, BASKET_INUSE_TABLE);
    let locatorsData = selectBoxData.basketLocatorCode || [];

    /**
     * Filter locators and baskets if is page update and is auto receipt
     */
    if (pageType.edit && isAutoReceipt && basketsInUseData) {
      basketsInUseData = this.filterOutEmptyRemainingStockRecords(
        basketsInUseData,
      );

      // danh sách unique kho nguồn
      const filteredLocators = new Set(
        basketsInUseData.map(item => item[t.basketLocatorCode]),
      );

      locatorsData = selectBoxData.basketLocatorCode
        ? selectBoxData.basketLocatorCode.filter(
            item => item && filteredLocators.has(item.value),
          )
        : [];
    }

    return locatorsData;
  };

  /**
   * Filter danh sách khay sọt
   * @param popupFormik
   * @return {[]|*[]}
   */
  filterBasketsData = popupFormik => {
    const { selectBoxData, formik, pageType, receiptData } = this.props;

    const t = basketsInUseFields;
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');
    let basketsInUseData = getNested(formik.values, BASKET_INUSE_TABLE);
    let basketsData = selectBoxData.popupBasket || [];
    /**
     * Filter locators and baskets if is page update and is auto receipt
     */
    if (pageType.edit && isAutoReceipt && basketsInUseData) {
      basketsInUseData = this.filterOutEmptyRemainingStockRecords(
        basketsInUseData,
      );
      const selectedBasketLocatorCode = getNested(
        popupFormik.values,
        'basketLocatorCode',
      );

      // danh sách unique khay sọt có kho nguồn = kho nguồn đang được chọn
      const filteredBasketsObj = {};
      basketsInUseData
        .filter(
          item =>
            item &&
            selectedBasketLocatorCode &&
            item[t.basketLocatorCode] === selectedBasketLocatorCode.value,
        )
        .forEach(item => {
          const id = item[t.palletBasketCode];
          filteredBasketsObj[id] = filteredBasketsObj[id] || {
            value: id,
            label: `${item[t.palletBasketCode]} ${
              item[t.palletBasketShortName]
            }`,
            palletBasketCode: item[t.palletBasketCode],
            palletBasketName: item[t.palletBasketName],
            uom: item[t.uom],
          };
        });

      basketsData = Object.values(filteredBasketsObj);
    }
    return basketsData;
  };

  /**
   * Attributes to render form fields. Spread into <Field ... />
   * @param popupFormik - popup formik
   */
  makeFormAttr = popupFormik => {
    const {
      selectBoxData,
      onFetchPopupBasket,
      onFetchCauseAssetAC,
      receiptData,
      formik,
      isEdit,
    } = this.props;
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');
    const locatorsData = this.filterBasketLocatorsData();
    const basketsData = this.filterBasketsData(popupFormik);

    /**
     * Handle Basket Change
     * @param selected
     * @param customFormikValues
     */
    const onBasketChange = (selected, customFormikValues = undefined) => {
      const formikValues = customFormikValues || popupFormik.values;

      if (!selected) {
        popupFormik.setValues({
          ...formikValues,
          palletBasket: null,
          palletBasketCode: null,
          palletBasketName: '',
          uom: '',
          inStock: '',
          inStockOriginal: '',
        });

        return;
      }

      const inStock = this.calculateRemainingInStock(selected, formikValues);
      popupFormik.setValues({
        ...formikValues,
        palletBasket: selected,
        palletBasketCode: selected ? selected.palletBasketCode : '',
        palletBasketName: selected ? selected.palletBasketName : '',
        uom: selected ? selected.uom : '',
        inStock,
        inStockOriginal: selected ? selected.inStockOriginal : '',
      });
    };

    return {
      basketLocatorCode: {
        name: 'basketLocatorCode',
        label: 'Kho nguồn',
        required: true,
        value: popupFormik.values.basketLocatorCode,
        component: SelectAutocomplete,
        options: locatorsData,
        afterHandleChange: selected => {
          if (!selected) return;

          if (isAutoReceipt) {
            const currentBasket = popupFormik.values.palletBasket;
            const nextBasketsData = this.filterBasketsData({
              ...popupFormik,
              values: {
                ...popupFormik.values,
                basketLocatorCode: selected,
              },
            });

            let nextBasket = null;
            if (currentBasket && nextBasketsData && nextBasketsData.length) {
              [nextBasket] = nextBasketsData.filter(
                item =>
                  item && currentBasket && item.value === currentBasket.value,
              );
            }

            onBasketChange(nextBasket, {
              ...popupFormik.values,
              basketLocatorCode: selected,
            });
          } else {
            onFetchPopupBasket(formik, selected, null, null, basketData => {
              const currentBasket = popupFormik.values.palletBasket;
              let nextBasket = null;
              if (currentBasket && basketData && basketData.length) {
                [nextBasket] = basketData.filter(
                  item => item && item.value === currentBasket.value,
                );
              }

              onBasketChange(nextBasket, {
                ...popupFormik.values,
                basketLocatorCode: selected,
              });
            });
          }
        },
        placeholder: 'Tìm và chọn kho nguồn',
        isClearable: false,
        disabled: isEdit,
      },
      // org: {
      //   name: 'org',
      //   label: 'Đơn Vị Huỷ',
      //   required: true,
      //   value: popupFormik.values.org,
      //   component: SelectControl,
      //   children: selectBoxData.org.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      //   disabled: true,
      // },
      org: {
        name: 'org',
        label: 'Đơn Vị Huỷ',
        value: popupFormik.values.org,
        component: SelectAutocomplete,
        options: selectBoxData.org,
        placeholder: 'Tất Cả',
        disabled: true,
      },
      palletBasket: {
        name: 'palletBasket',
        label: 'Mã Khay Sọt',
        required: true,
        value: popupFormik.values.palletBasket,
        component: SelectAutocomplete,
        options: basketsData,
        afterHandleChange: onBasketChange,
        placeholder: 'Tìm và chọn khay sọt',
        isClearable: false,
        disabled: isEdit,
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
        name: 'uom',
        label: 'Đơn Vị Tính',
        value: popupFormik.values.uom,
        onChange: popupFormik.handleChange,
        component: MuiInput,
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
      inStock: {
        name: 'inStock',
        label: isAutoReceipt ? 'SL Huỷ Tối Đa' : 'SL Tồn',
        value: popupFormik.values.inStock,
        onChange: popupFormik.handleChange,
        component: InputControl,
        disabled: true,
      },
      cancelQuantity: {
        name: 'cancelQuantity',
        label: 'SL Thanh Lý/Huỷ',
        required: true,
        value: popupFormik.values.cancelQuantity,
        onChange: e => {
          if (
            popupFormik.values.inStock &&
            popupFormik.values.inStock < parseFloat(e.target.value)
          ) {
            popupFormik.setFieldValue(
              'cancelQuantity',
              popupFormik.values.inStock,
            );
          } else {
            popupFormik.handleChange(e);
          }
          setTimeout(() => this.onReValidateTableData(e, popupFormik));
        },
        component: InputControl,
      },
      cause: {
        name: 'cause',
        label: 'Nguyên nhân huỷ',
        value: popupFormik.values.cause,
        required: true,
        component: SelectAutocomplete,
        isAsync: true,
        defaultOptions: true,
        loadOptionsFunc: (_, callback) => {
          const data = selectBoxData.causeAsset;
          if (!data) {
            onFetchCauseAssetAC(formik.values.reason, callback);
            return;
          }
          callback(data);
        },
      },
    };
  };

  /**
   * Merge popup table to main asset table
   * @param popupFormik
   */
  mergeAssetsTable = popupFormik => {
    const { formik, isEdit } = this.props;
    const t = assetsTableFields;
    // const a =
    let data = [];
    if (isEdit) {
      let index = formik.values[ASSET_TABLE].findIndex(
        item =>
          item.cancelRequestBasketDetailCode ===
          popupFormik.values.cancelRequestBasketDetailCode,
      );
      data = formik.values[ASSET_TABLE].filter(
        item =>
          item.cancelRequestBasketDetailCode !==
          popupFormik.values.cancelRequestBasketDetailCode,
      );
      const newData = popupFormik.values[SELECT_BASKET_TABLE].filter(
        row =>
          row &&
          isNumberString(row[t.cancelQuantity]) &&
          parseFloat(row[t.cancelQuantity]) > 0, // filter out rows which have quantity = 0
      ).map(row => ({
        ...row,
        [t.causeCode]: getNested(popupFormik.values, 'cause', 'value'),
        [t.cause]: getNested(popupFormik.values, 'cause', 'label'),
        [t.palletBasketCode]: popupFormik.values.palletBasketOld
          ? popupFormik.values.palletBasketOld.value
          : null,
        [t.palletBasketName]: popupFormik.values.palletBasketOld
          ? popupFormik.values.palletBasketOld.label
          : null,
        [t.uom]: popupFormik.values.uom,
        [t.cancelRequestBasketDetailCode]: getNested(
          popupFormik.values,
          'cancelRequestBasketDetailCode',
        ),
      }));
      newData.forEach(item => {
        data.splice(index, 0, item);
        index += 1;
      });
    } else {
      const link = formik.values.indexLink;
      data = [
        ...formik.values[ASSET_TABLE],
        ...popupFormik.values[SELECT_BASKET_TABLE].filter(
          row =>
            row &&
            isNumberString(row[t.cancelQuantity]) &&
            parseFloat(row[t.cancelQuantity]) > 0, // filter out rows which have quantity = 0
        ).map(row => ({
          ...row,
          [t.causeCode]: getNested(popupFormik.values, 'cause', 'value'),
          [t.cause]: getNested(popupFormik.values, 'cause', 'label'),
          [t.palletBasketCode]: popupFormik.values.palletBasketOld
            ? popupFormik.values.palletBasketOld.palletBasketCode
            : null,
          [t.palletBasketName]: popupFormik.values.palletBasketOld
            ? popupFormik.values.palletBasketOld.palletBasketName
            : null,
          [t.uom]: popupFormik.values.palletBasketOld
            ? popupFormik.values.palletBasketOld.uom
            : null,
          [t.cancelRequestBasketDetailCode]: `${
            popupFormik.values.palletBasketOld.palletBasketCode
          }${link}`,
        })),
      ];
    }

    // const combinedObj = {};
    const dataAsset = data.map(rowData => {
      // if (!rowData) return;
      const cancelQuantity = parseFloat(rowData[t.cancelQuantity] || 0);
      const cancelValue =
        (cancelQuantity * parseFloat(rowData[t.depreciationRemaining])) /
        parseFloat(rowData[t.inventoryQuantity]);
      const currentCancelValue =
        (cancelQuantity * parseFloat(rowData[t.depreciationRemaining])) /
        parseFloat(rowData[t.inventoryQuantity]);
      return {
        ...rowData,
        [t.cancelQuantity]: cancelQuantity,
        [t.currentCancelValue]: currentCancelValue,
        [t.cancelValue]: cancelValue,
      };
    });
    // const updatedAssets = Object.keys(combinedObj).map(key => combinedObj[key]);
    formik.setFieldValue(ASSET_TABLE, dataAsset);
    onUpdateAssetPinnedData(formik, dataAsset);
    onUpdateBasketsInfoTableData(formik, dataAsset);
  };

  /**
   * Merge popup table to basketsInUse table
   * @param popupFormik
   */
  mergeBasketsInUseTable = popupFormik => {
    const { onFetchPopupBasket, receiptData, formik, isEdit } = this.props;
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');
    const t3 = basketsInUseFields;
    let data = [];
    if (isEdit) {
      data = formik.values[BASKET_INUSE_TABLE].map(item => {
        if (
          item.cancelRequestBasketDetailCode ===
          popupFormik.values.cancelRequestBasketDetailCode
        ) {
          // eslint-disable-next-line no-param-reassign
          item = {
            [t3.basketLocatorCode]: getNested(
              popupFormik.values.basketLocatorCode,
              'value',
            ),
            [t3.basketLocatorName]: getNested(
              popupFormik.values.basketLocatorCode,
              'label',
            ),
            [t3.palletBasketCode]: popupFormik.values.palletBasketOld
              ? popupFormik.values.palletBasketOld.value
              : null,
            [t3.palletBasketName]: popupFormik.values.palletBasketOld
              ? popupFormik.values.palletBasketOld.label
              : null,
            [t3.inStockQuantity]: popupFormik.values.inStockOriginal,
            [t3.maxCancelQuantity]: popupFormik.values.inStock,
            [t3.cancelQuantity]:
              popupFormik.values[SELECT_BASKET_TABLE_PINNED] &&
              popupFormik.values[SELECT_BASKET_TABLE_PINNED].length
                ? popupFormik.values[SELECT_BASKET_TABLE_PINNED][0]
                    .cancelQuantity
                : 0,
            [t3.uom]: popupFormik.values.uom,
            [t3.causeCode]: getNested(popupFormik.values, 'cause', 'value'),
            [t3.cause]: getNested(popupFormik.values, 'cause', 'label'),
            [t3.cancelRequestBasketDetailCode]: getNested(
              popupFormik.values,
              'cancelRequestBasketDetailCode',
            ),
            [t3.assetStatus]: popupFormik.values.assetStatus,
            [t3.images]: popupFormik.values.images,
            [t3.id]: popupFormik.values.id,
            [t3.note]: popupFormik.values.note,
          };
        }
        return item;
      });
    } else {
      const link = formik.values.indexLink;
      const newData = [
        {
          [t3.basketLocatorCode]: getNested(
            popupFormik.values.basketLocatorCode,
            'value',
          ),
          [t3.basketLocatorName]: getNested(
            popupFormik.values.basketLocatorCode,
            'label',
          ),
          [t3.palletBasketCode]: popupFormik.values.palletBasketOld
            ? popupFormik.values.palletBasketOld.palletBasketCode
            : null,
          [t3.palletBasketName]: popupFormik.values.palletBasketOld
            ? popupFormik.values.palletBasketOld.palletBasketName
            : null,
          [t3.inStockQuantity]: popupFormik.values.inStockOriginal,
          [t3.maxCancelQuantity]: popupFormik.values.inStock,
          [t3.cancelQuantity]:
            popupFormik.values[SELECT_BASKET_TABLE_PINNED] &&
            popupFormik.values[SELECT_BASKET_TABLE_PINNED].length
              ? popupFormik.values[SELECT_BASKET_TABLE_PINNED][0].cancelQuantity
              : 0,
          [t3.uom]: popupFormik.values.uom,
          [t3.causeCode]: getNested(popupFormik.values, 'cause', 'value'),
          [t3.cause]: getNested(popupFormik.values, 'cause', 'label'),
          [t3.assetStatus]: popupFormik.values.assetStatus,
          [t3.note]: popupFormik.values.note,
          [t3.cancelRequestBasketDetailCode]: `${
            popupFormik.values.palletBasketOld.palletBasketCode
          }${link}`,
        },
      ];
      formik.setFieldValue('indexLink', link + 1);
      data = [...formik.values[BASKET_INUSE_TABLE], ...newData];
    }
    const updatedBasketsInUseTable = data.map(rowData => {
      let inStockQuantityMaxDiff = 0;
      const inStockQuantityDiff =
        parseFloat(rowData[t3.inStockQuantity] || '0') -
        rowData[t3.cancelQuantity];
      if (isAutoReceipt) {
        inStockQuantityMaxDiff =
          parseFloat(rowData[t3.maxCancelQuantity] || '0') -
          rowData[t3.cancelQuantity];
      }
      return {
        ...rowData,
        [t3.inStockQuantityDiff]: inStockQuantityDiff,
        [t3.maxCancelQuantityDiff]: inStockQuantityMaxDiff,
      };
    });
    formik.setFieldValue(BASKET_INUSE_TABLE, updatedBasketsInUseTable);
    onUpdateBasketsInUsePinnedData(formik, updatedBasketsInUseTable);
    onUpdateBasketsInfoTableData(formik, undefined, updatedBasketsInUseTable);

    /**
     * If keep popup opened
     */
    if (popupFormik.values.keepPopupOpened) {
      if (isAutoReceipt) {
        const updatedPopupValues = {
          ...popupFormik.values,
          palletBasket: null,
          palletBasketName: '',
          uom: '',
          inStock: '',
          cancelQuantity: '',
          cancelValue: '',
          causeCode: '',
          cause: '',

          [SELECT_BASKET_TABLE]: [],
          [SELECT_BASKET_TABLE_PINNED]: [],
        };

        popupFormik.setValues(updatedPopupValues);
      } else {
        popupFormik.setValues(this.state.initialValues);

        // reload popup data with updated baskets table data
        const updatedMainFormik = { ...formik };
        updatedMainFormik.values[BASKET_INUSE_TABLE] = updatedBasketsInUseTable;
        onFetchPopupBasket(
          updatedMainFormik,
          popupFormik.values.basketLocatorCode,
        );
      }
      popupFormik.setTouched({});
    }
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

  /**
   * Update cancelValue and table pinned data
   * @param popupFormik
   */
  onUpdateTablePinnedData = popupFormik => {
    const { values } = popupFormik;
    const baskets = values[SELECT_BASKET_TABLE];
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
            isNumberString(item[key])
              ? (item[key] * parseFloat(item.depreciationRemaining)) /
                parseFloat(item.inventoryQuantity)
              : '0',
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
      palletBasketOld: popupFormik.values.palletBasket,
      cancelValue: totalRow.cancelValue.toFixed(3),
      [SELECT_BASKET_TABLE_PINNED]: [totalRow],
    };

    popupFormik.validateForm(updatedValues).then(errors => {
      popupFormik.setErrors(errors);
      popupFormik.setValues(updatedValues);
    });
  };

  onReValidateTableData = (e, popupFormik) => {
    const { values } = popupFormik;
    const baskets = values[SELECT_BASKET_TABLE];
    if (!baskets || !baskets.length) return;

    const totalRow = {
      ownQuantity: 0,
      cancelQuantity: 0,
      difference: 0,
    };
    baskets.forEach(item => {
      if (!item) return;
      Object.keys(totalRow).forEach(key => {
        totalRow[key] += parseFloat(
          isNumberString(item[key]) ? item[key] : '0',
        );
      });
    });

    totalRow.expectedCancelQuantity = isNumberString(e.target.value)
      ? parseFloat(e.target.value)
      : undefined;

    const updatedValues = {
      ...popupFormik.values,
      cancelQuantity: parseFloat(e.target.value),
      [SELECT_BASKET_TABLE_PINNED]: [totalRow],
    };

    popupFormik.validateForm(updatedValues).then(errors => {
      popupFormik.setErrors(errors);
      popupFormik.setValues(updatedValues);
    });
  };

  onClose = () => {
    this.props.onClose();
    this.props.onResetEdit();
  };

  render() {
    const {
      classes,
      formik,
      onClose,
      onFetchPopupTableData,
      dispatch,
      onResetEdit,
      onLoading,
      isEdit,
    } = this.props;
    return (
      <div>
        <Formik
          ref={this.popupFormik}
          enableReinitialize
          validateOnChange
          validateOnBlur
          onSubmit={(values, formikActions) => {
            if (values.preventSubmit) {
              formikActions.setSubmitting(false);
              return;
            }

            if (values.isSubmit) {
              this.mergeAssetsTable({ values, ...formikActions });
              this.mergeBasketsInUseTable({ values, ...formikActions });
              formikActions.setFieldValue('cancelQuantity', 0);
              if (!values.keepPopupOpened) {
                onClose();
              }
              onResetEdit();
              onLoading(false);
            } else {
              onFetchPopupTableData(
                values,
                formik.values[ASSET_TABLE],
                returnedValues => {
                  const updatedValues = {
                    ...values,
                    ...returnedValues,
                  };
                  formikActions.setValues(updatedValues);
                  this.onUpdateTablePinnedData({
                    ...formikActions,
                    values: updatedValues,
                  });
                },
              );
            }
            formikActions.setSubmitting(false);
          }}
          initialValues={this.state.initialValues}
          validationSchema={popupSelectBasketsFormikSchema}
          render={popupFormik => {
            const formAttr = this.makeFormAttr(popupFormik);

            const rightActions = (
              <div className={classes.causeFieldContainer}>
                <Field {...formAttr.cause} />
              </div>
            );

            let isSubmittable =
              !popupFormik.isSubmitting &&
              popupFormik.values[SELECT_BASKET_TABLE] &&
              popupFormik.values[SELECT_BASKET_TABLE].length &&
              popupFormik.values[SELECT_BASKET_TABLE_PINNED] &&
              popupFormik.values[SELECT_BASKET_TABLE_PINNED].length;

            if (isSubmittable) {
              // eslint-disable-next-line no-restricted-syntax
              for (const row of popupFormik.values[SELECT_BASKET_TABLE]) {
                if (
                  isNumberString(row.difference) &&
                  parseFloat(row.difference) < 0
                ) {
                  isSubmittable = false;
                }
              }
            }

            return (
              <>
                <DialogTitle>
                  Chọn Mã Tài Sản Khay Sọt Để Thanh Lý/Huỷ
                </DialogTitle>

                <Form>
                  <NotifyOnSubmit formik={popupFormik} dispatch={dispatch} />
                  <DialogContent>
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
                                <Field {...formAttr.inStock} />
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

                            <div
                              className={classes.btnContainer}
                              style={{ marginBottom: 0 }}
                            >
                              <MuiButton
                                onClick={() => {
                                  popupFormik.setFieldValue('isSubmit', false);
                                  popupFormik.setFieldValue(
                                    'isFirstClick',
                                    false,
                                  );
                                  setTimeout(popupFormik.handleSubmit, 100);
                                }}
                              >
                                Tìm kiếm
                              </MuiButton>
                            </div>
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
                            name={SELECT_BASKET_TABLE}
                            idGrid={SELECT_BASKET_TABLE}
                            gridStyle={{ height: 'auto' }}
                            gridProps={{
                              context: {
                                formik: popupFormik,
                                pinnedTableKey: SELECT_BASKET_TABLE_PINNED,
                              },
                              domLayout: 'autoHeight',
                              onCellValueChanged: e =>
                                this.onCellValueChanged(e, popupFormik),
                              pinnedBottomRowData:
                                popupFormik.values[SELECT_BASKET_TABLE_PINNED],
                            }}
                            rowData={popupFormik.values[SELECT_BASKET_TABLE]}
                            columnDefs={makeColumnDefs()}
                            defaultColDef={this.state.defaultColDef}
                            {...popupFormik} // pass popup formik props into agGrid
                          />
                        }
                      />
                    </div>

                    <div className={classes.btnContainer}>
                      <MuiButton outline onClick={this.onClose}>
                        Đóng
                      </MuiButton>
                      <MuiButton
                        onClick={debounce(() => {
                          onLoading();
                          popupFormik.setFieldValue('isSubmit', true);
                          popupFormik.setFieldValue('keepPopupOpened', false);
                          setTimeout(popupFormik.handleSubmit, 50);
                        }, 200)}
                        disabled={!isSubmittable}
                      >
                        Chọn và Đóng
                      </MuiButton>
                      <MuiButton
                        onClick={debounce(() => {
                          onLoading();
                          popupFormik.setFieldValue('isSubmit', true);
                          popupFormik.setFieldValue('keepPopupOpened', true);
                          setTimeout(popupFormik.handleSubmit, 50);
                        }, 500)}
                        disabled={!isSubmittable || isEdit}
                      >
                        Chọn và Tiếp tục
                      </MuiButton>
                    </div>
                  </DialogContent>
                </Form>
              </>
            );
          }}
        />
      </div>
    );
  }
}

SelectBasketsPopup.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  pageType: PropTypes.object,
  selectBoxData: PropTypes.object,
  receiptData: PropTypes.object,
  onClose: PropTypes.func,
  onResetEdit: PropTypes.func,
  onFetchPopupTableData: PropTypes.func,
  onFetchPopupBasket: PropTypes.func,
  onFetchCauseAssetAC: PropTypes.func,
  dispatch: PropTypes.func,
  isEdit: PropTypes.bool,
  data: PropTypes.object,
  dataPalletBasket: PropTypes.object,
  onLoading: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectBoxData: makeSelect.selectBoxData(),
  receiptData: makeSelect.receiptData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchPopupTableData: (filters, assetsTable, callback) =>
      dispatch(actions.fetchPopupTableData(filters, assetsTable, callback)),
    onFetchPopupBasket: (formik, basketLocatorCode, isEdit, data, callback) =>
      dispatch(
        actions.fetchPopupBasket(
          formik,
          basketLocatorCode,
          isEdit,
          data,
          callback,
        ),
      ),
    onFetchCauseAssetAC: (reasonCode, callback) =>
      dispatch(actions.fetchCauseAsset(reasonCode, callback)),
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
