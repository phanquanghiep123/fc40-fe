/* eslint-disable indent */
import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field } from 'formik/dist/index';
import {
  MenuItem,
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Typography,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import NumberFormatter from 'components/NumberFormatter';
import { withRouter } from 'react-router-dom';
import MuiInput from 'components/MuiInput';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import appTheme from '../../../App/theme';
import * as makeSelect from '../selectors';
import ConfirmDialog from './ConfirmDialog';
import Expansion from '../../../../components/Expansion';
import * as actions from '../actions';
import PickerControl from '../../../../components/PickersControl';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { getNested, getUrlParams, updateUrlFilters } from '../../../App/utils';
import {
  ASSET_TABLE,
  ASSET_TABLE_PINNED,
  BASKET_INFO_TABLE,
  BASKET_INUSE_TABLE,
  BASKET_INUSE_TABLE_PINNED,
  GENERAL_INFO_SECTION,
  PRODUCT_TABLE,
  statusCode,
  originSource,
} from '../constants';

const style = (theme = appTheme) => ({
  approverLevel: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1.5,
    right: 0,
    background: theme.palette.background.default,
    padding: '.25rem 0.5rem',
    color: theme.palette.primary.main,
  },
  rightActions: {
    '& button:not(last-child)': {
      marginRight: '1rem',
    },
  },
});

const theme = createMuiTheme({
  ...appTheme,
});

const boldInputValue = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiInputBase: {
      input: {
        fontWeight: 'bold',
      },
    },
  },
});

class FormSection extends Component {
  state = {
    openOrgChangeDialog: false,
    openReasonChangeDialog: false,
    changeEvent: null,
    isSameTypeReason: null,
  };

  componentDidUpdate(prevProps) {
    const { formik, onCheckIsDraftSelected } = this.props;

    if (formik.values.status !== prevProps.formik.values.status) {
      onCheckIsDraftSelected(formik.values.status === statusCode.draft);
    }
  }

  closeOrgChangeDialog = () => {
    this.setState({
      openOrgChangeDialog: false,
      changeEvent: null,
    });
  };

  /**
   * Open dialog on change org
   * @param e - change event
   */
  openOrgChangeDialog = e => {
    const { formik } = this.props;
    const { values } = formik;
    const needConfirmation =
      (values[PRODUCT_TABLE] && values[PRODUCT_TABLE].length) ||
      (values[ASSET_TABLE] && values[ASSET_TABLE].length) ||
      (values[BASKET_INUSE_TABLE] && values[BASKET_INUSE_TABLE].length);

    if (needConfirmation) {
      this.setState({
        openOrgChangeDialog: true,
        changeEvent: e,
      });
    } else {
      this.setState({ changeEvent: e }, () => this.handleOrgDialogConfirm());
    }
  };

  closeReasonChangeDialog = () => {
    this.setState({
      openReasonChangeDialog: false,
      changeEvent: null,
      isSameTypeReason: null,
    });
  };

  /**
   *
   * @param e
   * @param isSameType
   */
  openReasonChangeDialog = (e, isSameType) => {
    this.setState({
      openReasonChangeDialog: true,
      changeEvent: e,
      isSameTypeReason: isSameType,
    });
  };

  /**
   * When click confirm button in the dialog confirm Org change
   */
  handleOrgDialogConfirm = () => {
    const { formik, onFetchBasketLocator } = this.props;
    const { changeEvent: e } = this.state;
    // formik.handleChange(e);
    // formik.setFieldValue('org', e);
    const formValues = {
      ...formik.values,
      // [e.target.name]: e.target.value,
      org: e,
      estValue: 0,
      totalCancelValue: 0,
      totalCurrentCancelValue: 0,
      [PRODUCT_TABLE]: [],
      [ASSET_TABLE]: [],
      [ASSET_TABLE_PINNED]: [],
      [BASKET_INUSE_TABLE]: [],
      [BASKET_INUSE_TABLE_PINNED]: [],
      [BASKET_INFO_TABLE]: [],
    };
    formik.setValues(formValues);
    // update accumulatedValue
    this.props.onFetchAccumulatedValue(
      this.props.pageType,
      formValues,
      accumulatedValue =>
        formik.setFieldValue(
          'accumulatedValue',
          formatToCurrency(accumulatedValue),
        ),
    );

    // re-fetch basketLocatorCode - danh sách kho nguồn theo đơn vị
    onFetchBasketLocator(formValues);

    this.closeOrgChangeDialog();
  };

  /**
   * Update accumulated value of product
   * @param e - event of reason change
   */
  updateProductAccumulatedValue = e => {
    const { formik } = this.props;

    const formValues = {
      ...formik.values,
      [e.target.name]: e.target.value,
    };
    this.props.onFetchAccumulatedValue(
      this.props.pageType,
      formValues,
      accumulatedValue =>
        formik.setFieldValue(
          'accumulatedValue',
          formatToCurrency(accumulatedValue),
        ),
    );
  };

  /**
   * Handle Reason Change
   * @param e - event
   */
  onReasonChange = e => {
    const {
      formik,
      selectBoxData,
      history,
      onFetchCauseAsset,
      generalSectionDefaultValues,
      onFetchStatusData,
      pageType,
      match,
    } = this.props;
    const prevReasonCode = parseFloat(formik.values.reason);
    const selectedReasonCode = parseFloat(e.target.value);
    const prevReason = selectBoxData.reason.filter(
      item => item && item.value === prevReasonCode,
    );
    const selectedReason = selectBoxData.reason.filter(
      item => item && item.value === selectedReasonCode,
    );

    if (!selectedReason.length || !prevReason.length) return;

    const receiptId = getNested(match, 'params', 'id');
    const isBasket = selectedReason.length && selectedReason[0].isBasket;
    const isSameType = isBasket === prevReason[0].isBasket;

    /**
     * Trường hợp cần mở confirm dialog
     * 1. chuyển reason khác loại + data đã có ít nhất 1 dòng => clear data loại cũ
     * 2. chuyển reason cùng loại + loại là khay sọt + data đã có ít nhất 1 dòng => clear nguyên nhân huỷ đã nhập
     */
    if (
      (!isSameType &&
        ((isBasket &&
          formik.values[PRODUCT_TABLE] &&
          formik.values[PRODUCT_TABLE].length) ||
          (!isBasket &&
            ((formik.values[ASSET_TABLE] &&
              formik.values[ASSET_TABLE].length) ||
              (formik.values[BASKET_INUSE_TABLE] &&
                formik.values[BASKET_INUSE_TABLE].length))))) ||
      (isSameType &&
        isBasket &&
        formik.values[ASSET_TABLE] &&
        formik.values[ASSET_TABLE].length)
    ) {
      this.openReasonChangeDialog(e, isSameType);
    } else {
      formik.handleChange(e);
      updateUrlFilters(history, { isBasket });
      if (isBasket) {
        onFetchStatusData(pageType, receiptId, isBasket);
        onFetchCauseAsset(e.target.value, causes => {
          if (isSameType) this.onUpdateDefaultCauseAssetTable(causes);
        });
      } else {
        this.updateProductAccumulatedValue(e);
        formik.setFieldValue('status', generalSectionDefaultValues.status);
      }
    }
  };

  /**
   * Render reason dialog content
   * @return {*}
   */
  reasonDialogContent = () => {
    const { isSameTypeReason } = this.state;

    return isSameTypeReason ? (
      <Typography variant="body1">
        <b>Nguyên nhân huỷ sẽ được cập nhật</b> sau khi bạn thay đổi lý do huỷ.
        Bạn có chắc chắn thay đổi không?
      </Typography>
    ) : (
      <Typography variant="body1">
        Các thông tin yêu cầu huỷ đã nhập sẽ bị mất sau khi thay đổi lý do huỷ.
        Bạn có chắc chắn thay đổi không?
      </Typography>
    );
  };

  /**
   * when click confirm on reason dialog
   */
  handleReasonDialogConfirm = () => {
    const { changeEvent: e, isSameTypeReason } = this.state;
    const {
      formik,
      onFetchCauseAsset,
      history,
      selectBoxData,
      generalSectionDefaultValues,
      onFetchStatusData,
      pageType,
      match,
    } = this.props;
    const selectedReason = selectBoxData.reason.filter(
      item => item && item.value === parseFloat(e.target.value),
    );
    const receiptId = getNested(match, 'params', 'id');
    const isBasket = selectedReason.length && selectedReason[0].isBasket;

    formik.handleChange(e);
    updateUrlFilters(history, { isBasket });
    if (isBasket) {
      onFetchStatusData(pageType, receiptId, isBasket);
      onFetchCauseAsset(e.target.value, causes => {
        if (isSameTypeReason) this.onUpdateDefaultCauseAssetTable(causes);
      });
    } else {
      this.updateProductAccumulatedValue(e);
      formik.setFieldValue('status', generalSectionDefaultValues.status);
    }

    // clear data if switch between different reason types
    if (!isSameTypeReason) {
      formik.setValues({
        ...formik.values,
        [e.target.name]: e.target.value,
        estValue: 0,
        totalCancelValue: 0,
        totalCurrentCancelValue: 0,
        [PRODUCT_TABLE]: [],
        [ASSET_TABLE]: [],
        [ASSET_TABLE_PINNED]: [],
        [BASKET_INUSE_TABLE]: [],
        [BASKET_INUSE_TABLE_PINNED]: [],
        [BASKET_INFO_TABLE]: [],
      });
    }
  };

  /**
   * Reset/reselect selected causes in ASSET_TABLE - xoá/update những nguyên nhân huỷ đã chọn
   * @param {Array} causesData - causes data belong to selected reason
   */
  onUpdateDefaultCauseAssetTable = causesData => {
    const { formik } = this.props;
    const [defaultCause] = causesData.filter(item => item && item.isDefault);

    const updatedAssetsTable = formik.values[ASSET_TABLE].filter(
      item => !item || !!item.assetCode,
    ).map(rowData => ({
      ...rowData,
      causeCode: getNested(defaultCause, 'value'),
      cause: getNested(defaultCause, 'label'),
    }));
    formik.setFieldValue(ASSET_TABLE, updatedAssetsTable);
  };

  /**
   * Attributes to render form fields. Spread into <Field ... />
   */
  makeFormAttr = () => {
    const {
      pageType,
      formik: pr,
      receiptData,
      selectBoxData,
      onFetchRequester,
      onFetchApprover,
      history,
      isDraftSelected,
    } = this.props;
    let autoCompleteTimer;
    const { isBasket } = getUrlParams(history);
    return {
      receiptCode: {
        name: 'receiptCode',
        label: 'Mã PYCH',
        value: pr.values.receiptCode,
        onChange: pr.handleChange,
        component: InputControl,
        disabled: true,
        style: {
          ...(pageType.create ? { display: 'none' } : {}),
        },
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        value: pr.values.status,
        onChange: pr.handleChange,
        component: SelectControl,
        children: receiptData.statusData
          ? receiptData.statusData.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))
          : selectBoxData.status.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            )),
        disabled:
          !pageType.reApprove &&
          !(pageType.create && isBasket) &&
          !(pageType.edit && receiptData.isStatusEditable),
      },
      createdAt: {
        name: 'createdAt',
        label: 'Thời Gian Tạo Phiếu',
        required: true,
        value: pr.values.createdAt,
        onChange: pr.handleChange,
        component: PickerControl,
        disabled: true,
        format: 'dd/MM/yyyy HH:mm:ss',
      },
      org: {
        name: 'org',
        label: 'Đơn Vị',
        value: pr.values.org,
        component: SelectAutocomplete,
        options: selectBoxData.org,
        placeholder: 'Lựa Chọn Đơn Vị',
        disabled: !pageType.create,
        onChangeSelectAutoComplete: this.openOrgChangeDialog,
        isClearable: false,
      },
      // org: {
      //   name: 'org',
      //   label: 'Đơn Vị',
      //   required: true,
      //   value: pr.values.org,
      //   onChange: this.openOrgChangeDialog,
      //   component: SelectControl,
      //   children: selectBoxData.org.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      //   disabled: !pageType.create,
      // },
      reason: {
        name: 'reason',
        label: 'Lý Do',
        required: true,
        value: pr.values.reason,
        onChange: this.onReasonChange,
        component: SelectControl,
        children: selectBoxData.reason.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
        disabled:
          !pageType.create &&
          !(
            pageType.edit &&
            receiptData.isReasonEditable &&
            receiptData.originSource !== originSource.DifferenceExportBorrow &&
            receiptData.originSource !== originSource.DifferenceExportPay
          ),
      },
      accumulatedValue: {
        name: 'accumulatedValue',
        label: 'Lũy Kế Giá Trị Hàng Hủy Trong Tháng (không gồm phiếu này)',
        value: pr.values.accumulatedValue,
        onChange: pr.handleChange,
        component: InputControl,
        disabled: true,
      },
      estValue: {
        name: 'estValue',
        label: 'Tổng Ước Tính Giá Trị Lần Này',
        value: pr.values.estValue,
        onChange: pr.handleChange,
        component: InputControl,
        disabled: true,
      },
      totalCancelValue: {
        name: 'totalCancelValue',
        label: 'Tổng Giá trị thanh lý/huỷ (tạm tính)',
        value: pr.values.totalCancelValue,
        onChange: pr.handleChange,
        component: MuiInput,
        disabled: true,
      },
      totalCurrentCancelValue: {
        name: 'totalCurrentCancelValue',
        label: 'Tổng Giá trị thanh lý/huỷ (hiện tại)',
        value: pr.values.totalCurrentCancelValue,
        onChange: pr.handleChange,
        component: MuiInput,
        disabled: true,
      },
      requester: {
        name: 'requester',
        label: 'Người Yêu Cầu',
        required: true,
        value: pr.values.requester,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchRequester(inputValue, callback);
          }, 500);
        },
        disabled: true,
      },
      approver1: {
        name: 'approver1',
        label: 'Người Phê Duyệt 1',
        required: !isDraftSelected,
        value: pr.values.approver1,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchApprover(inputValue, isBasket, callback);
          }, 500);
        },
        disabled: !pageType.create && !pageType.edit && !pageType.reApprove,
      },
      approver2: {
        name: 'approver2',
        label: 'Người Phê Duyệt 2',
        value: pr.values.approver2,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchApprover(inputValue, isBasket, callback);
          }, 500);
        },
        disabled: !pageType.create && !pageType.edit && !pageType.reApprove,
      },
      approver3: {
        name: 'approver3',
        label: 'Người Phê Duyệt 3',
        value: pr.values.approver3,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchApprover(inputValue, isBasket, callback);
          }, 500);
        },
        disabled: !pageType.create && !pageType.edit && !pageType.reApprove,
      },
      note: {
        name: 'note',
        label: 'Ghi Chú',
        value: pr.values.note,
        onChange: pr.handleChange,
        component: InputControl,
        multiline: true,
        rows: 1,
        rowsMax: 4,
        disabled: !pageType.create && !pageType.edit && !pageType.reApprove,
      },
    };
  };

  render() {
    const { classes, pageType, receiptData, history } = this.props;
    const { isBasket } = getUrlParams(history);

    // confirm when change org
    const changeOrgConfirmDialog = (
      <ConfirmDialog
        open={this.state.openOrgChangeDialog}
        onClose={this.closeOrgChangeDialog}
        onConfirm={this.handleOrgDialogConfirm}
        content={
          <Typography variant="body1">
            Các thông tin yêu cầu huỷ đã nhập sẽ bị mất sau khi thay đổi đơn vị.
            Bạn có chắc chắn muốn thay đổi không?
          </Typography>
        }
      />
    );

    // confirm when change reason
    const changeReasonConfirmDialog = (
      <ConfirmDialog
        open={this.state.openReasonChangeDialog}
        onClose={this.closeReasonChangeDialog}
        onConfirm={this.handleReasonDialogConfirm}
        content={<>{this.reasonDialogContent()}</>}
      />
    );

    const formAttr = this.makeFormAttr();

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ marginBottom: '1rem' }}>
          <Expansion
            title="I. THÔNG TIN YÊU CẦU"
            content={
              <Grid container spacing={32} style={{ marginBottom: '-0.5rem' }}>
                <Grid item xs={3}>
                  <Field {...formAttr.receiptCode} />
                  <div style={{ position: 'relative' }}>
                    <Field {...formAttr.status} />
                    {pageType.approve ? (
                      <div className={classes.approverLevel}>
                        {receiptData[GENERAL_INFO_SECTION] &&
                        typeof receiptData[GENERAL_INFO_SECTION].level !==
                          'undefined'
                          ? `Cấp ${receiptData[GENERAL_INFO_SECTION].level}`
                          : null}
                      </div>
                    ) : null}
                  </div>

                  <Field {...formAttr.createdAt} />
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={32}>
                    <Grid item xs={6} style={{ paddingBottom: 0 }}>
                      <Field {...formAttr.org} />
                      {isBasket && (
                        <Field
                          {...formAttr.totalCancelValue}
                          InputProps={{
                            inputComponent: NumberFormatter,
                          }}
                        />
                      )}
                      {isBasket &&
                        (pageType.edit || pageType.reApprove) && (
                          <Field
                            {...formAttr.totalCurrentCancelValue}
                            InputProps={{
                              inputComponent: NumberFormatter,
                            }}
                          />
                        )}
                    </Grid>
                    <Grid item xs={6} style={{ paddingBottom: 0 }}>
                      <Field {...formAttr.reason} />
                      {isBasket && <Field {...formAttr.requester} />}
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: 0 }}>
                      {!isBasket && (
                        <MuiThemeProvider theme={boldInputValue}>
                          <Field {...formAttr.accumulatedValue} />
                          <Field {...formAttr.estValue} />
                        </MuiThemeProvider>
                      )}

                      {isBasket && <Field {...formAttr.note} />}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  {!isBasket && <Field {...formAttr.requester} />}
                  <Field {...formAttr.approver1} />
                  <Field {...formAttr.approver2} />
                  {isBasket && <Field {...formAttr.approver3} />}
                </Grid>
              </Grid>
            }
          />
        </div>
        {changeOrgConfirmDialog}
        {changeReasonConfirmDialog}
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  pageType: PropTypes.object,
  formik: PropTypes.object,
  receiptData: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  generalSectionDefaultValues: PropTypes.object,
  isDraftSelected: PropTypes.bool,

  // withConnect
  selectBoxData: PropTypes.object,
  onFetchRequester: PropTypes.func,
  onFetchApprover: PropTypes.func,
  onFetchAccumulatedValue: PropTypes.func,
  onUpdateFormValues: PropTypes.func,
  onFetchCauseAsset: PropTypes.func,
  onFetchBasketLocator: PropTypes.func,
  onFetchStatusData: PropTypes.func,
  onCheckIsDraftSelected: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectBoxData: makeSelect.selectBoxData(),
  receiptData: makeSelect.receiptData(),
  generalSectionDefaultValues: makeSelect.generalInfoDefaultValues(),
  isDraftSelected: makeSelect.isDraftSelected(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchRequester: (keyword, callback) =>
      dispatch(actions.fetchRequester(keyword, callback)),
    onFetchApprover: (keyword, isBasket, callback) =>
      dispatch(actions.fetchApprover(keyword, isBasket, callback)),
    onFetchAccumulatedValue: (pageType, formValues, callback) =>
      dispatch(actions.fetchAccumulatedValue(pageType, formValues, callback)),
    onUpdateFormValues: (fieldName, value) =>
      dispatch(actions.updateFormValues(fieldName, value)),
    onFetchCauseAsset: (reasonCode, callback) =>
      dispatch(actions.fetchCauseAsset(reasonCode, callback)),
    onFetchBasketLocator: filters =>
      dispatch(actions.fetchBasketLocators(filters)),
    onFetchStatusData: (pageType, receiptId, isBasket) =>
      dispatch(actions.fetchStatusData(pageType, receiptId, isBasket)),
    onCheckIsDraftSelected: bool =>
      dispatch(actions.checkIsDraftSelected(bool)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withRouter,
  withStyles(style()),
)(FormSection);
