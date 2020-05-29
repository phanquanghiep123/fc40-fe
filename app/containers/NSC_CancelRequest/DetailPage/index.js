/* eslint-disable indent */
import React from 'react';
// import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Form } from 'formik';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import ConfirmationDialog from 'components/ConfirmationDialog';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import GeneralInfo from './GeneralInfo';
import ProductsTable from './ProductsTable';
import AssetsTable from './AssetsTable';
import BasketsInUseTable from './BasketsInUseTable';
import ApprovalInfo from './ApprovalInfo';
import * as makeSelect from './selectors';
import * as actions from './actions';
import { makeGeneralSchema } from './Schemas';
import FormWrapper from '../../../components/FormikUI/FormWrapper';
import formikPropsHelpers from '../../../utils/formikUtils';
import { linksTo } from './linksTo';
import MuiButton from '../../../components/MuiButton';
import { TYPE_PXK } from '../../NSC_PXK/PXK/constants';
import {
  getNested,
  getUrlParams,
  openPrintWindow,
  serializeQueryParams,
} from '../../App/utils';
import {
  APPROVAL_TABLE,
  ASSET_TABLE,
  ASSET_TABLE_PINNED,
  BASKET_INFO_TABLE,
  BASKET_INUSE_TABLE,
  BASKET_INUSE_TABLE_PINNED,
  GENERAL_INFO_SECTION,
  PRODUCT_TABLE,
} from './constants';
import { assetsTableFields, basketsInUseFields } from './tableFields';
import Popup from '../../../components/MuiPopup';
import ability from '../../../authorize/ability';
import { CODE, SCREEN_CODE } from '../../../authorize/groupAuthorize';
import { TYPE_FORM } from '../../Baskets/Export/ExportedBaskets/CreatePage/constants';
import NotifyOnSubmit from '../../../components/NotifyOnSubmit';

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
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      marginBottom: '1rem',
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class ImportStockListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageInfo: this.makePageInfo(),
      openSubmitEditConfirmPopup: false, // popup confirm khi update phiếu
      onConfirmSubmitEdit: undefined, // function to run when confirm
      createdAt: new Date(),
      openConfirmPrintPopup: false, // popup confirm khi in phiếu
    };
  }

  /**
   * @param onConfirm - callback to execute when confirm
   */
  onOpenSubmitEditConfirmPopup = onConfirm => {
    this.setState({
      openSubmitEditConfirmPopup: true,
      onConfirmSubmitEdit: onConfirm,
    });
  };

  onCloseSubmitEditConfirmPopup = () => {
    this.setState({
      openSubmitEditConfirmPopup: false,
      onConfirmSubmitEdit: undefined,
    });
  };

  onOpenConfirmPrintPopup = () => {
    this.setState({ openConfirmPrintPopup: true });
  };

  onCloseConfirmPrintPopup = () => {
    this.setState({ openConfirmPrintPopup: false });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { match, history, onFetchFormData, onFetchReceiptData } = this.props;
    const { pageInfo } = this.state;
    const receiptId = getNested(match, 'params', 'id');
    const { isBasket } = getUrlParams(history);
    // fetch form data
    onFetchFormData(pageInfo.pageType, history, match);

    // fetch receipt data
    if (receiptId) {
      onFetchReceiptData(receiptId, pageInfo.pageType, isBasket);
    }
  }

  componentWillUnmount() {
    const { onFetchReceiptDataSuccess } = this.props;

    // clear receipt data
    onFetchReceiptDataSuccess({});
  }

  /**
   * Go to export cancellation page
   */
  goToExportCancellationPage = () => {
    const { history, receiptData } = this.props;
    const { isBasket } = getUrlParams(history);
    const cancelReceiptId = receiptData.basketDocumentExportCancellationId;
    if (isBasket) {
      const queryParams = {
        ...(cancelReceiptId
          ? { id: cancelReceiptId }
          : { cancelRequestId: receiptData[GENERAL_INFO_SECTION].id || '' }),
        form: cancelReceiptId ? TYPE_FORM.VIEW : TYPE_FORM.CREATE,
        isCancelReceipt: true,
      };
      history.push(`${linksTo.PXKS}?${serializeQueryParams(queryParams)}`);
    } else if (receiptData.exportCancellationReceiptId) {
      history.push(
        `${linksTo.xemPXK}/${receiptData.exportCancellationReceiptId}?type=${
          TYPE_PXK.PXK_XUAT_HUY
        }&plantId=${receiptData.org.value}&form=3`,
      );
      // history.push(
      //   `${linksTo.taoPXK}?type=${TYPE_PXK.PXK_XUAT_HUY}&receiptCode=${
      //     receiptData[GENERAL_INFO_SECTION].receiptCode
      //   }&form=1&plantId=2001`,
      // );
    } else {
      history.push(
        `${linksTo.taoPXK}?type=${TYPE_PXK.PXK_XUAT_HUY}&receiptCode=${
          receiptData[GENERAL_INFO_SECTION].receiptCode
        }&form=1&plantId=${receiptData.org.value}`,
      );
    }
  };

  /**
   * Make page info to identify page type
   * @returns {{pageType: {view: boolean}, title: string}|{pageType: {approve: boolean}, title: string}|{pageType: {edit: boolean}, title: string}|{pageType: {create: boolean}, title: string}|{pageType: {reApprove: boolean}, title: string}}
   */
  makePageInfo = () => {
    const {
      match: { path },
    } = this.props;

    const regex = {
      create: /(\/danh-sach-phieu-yeu-cau-huy)?\/tao-moi-phieu-yeu-cau-huy/,
      edit: /(\/danh-sach-phieu-yeu-cau-huy)?\/chinh-sua-phieu-yeu-cau-huy\/:id/,
      approve: /(\/danh-sach-phieu-yeu-cau-huy)?\/phe-duyet-phieu-yeu-cau-huy\/:id/,
      reApprove: /(\/danh-sach-phieu-yeu-cau-huy)?\/phe-duyet-lai-phieu-yeu-cau-huy\/:id/,
      view: /(\/danh-sach-phieu-yeu-cau-huy)?\/xem-phieu-yeu-cau-huy\/:id/,
    };

    if (regex.create.test(path)) {
      return {
        title: 'Tạo Mới Phiếu Yêu Cầu Thanh Lý/Hủy',
        pageType: { create: true },
      };
    }

    if (regex.edit.test(path)) {
      return {
        title: 'Chỉnh Sửa Phiếu Yêu Cầu Thanh Lý/Hủy',
        pageType: { edit: true },
      };
    }

    if (regex.approve.test(path)) {
      return {
        title: 'Phê Duyệt Phiếu Yêu Cầu Thanh Lý/Hủy',
        pageType: { approve: true },
      };
    }

    if (regex.reApprove.test(path)) {
      return {
        title: 'Phê Duyệt Lại Phiếu Yêu Cầu Thanh Lý/Hủy',
        pageType: { reApprove: true },
      };
    }

    return {
      title: 'Xem Phiếu Yêu Cầu Thanh Lý/Hủy',
      pageType: { view: true },
    };
  };

  /**
   * Huỷ phiếu
   */
  onDiscardReceipt = () => {
    const { match, onDiscardReceipt } = this.props;
    const receiptId = getNested(match, 'params', 'id');

    if (receiptId) {
      this.showConfirm({
        title: 'Xác nhận hủy',
        message:
          'Khi hủy phiếu yêu cầu thanh lý, hủy khay sọt sẽ thực hiện chuyển khay sọt từ kho chờ hủy về kho nguồn ban đầu. Bạn có chắc chắn muốn hủy?',
        actions: [
          {
            text: 'Hủy',
            color: 'primary',
          },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => {
              onDiscardReceipt(receiptId);
            },
          },
        ],
      });
    }
  };

  /**
   * Handle submit update receipt
   * @param id
   * @param values
   * @param isBasket
   */
  handleSubmitEditReceipt(id, values, isBasket) {
    const { onSubmitEditReceipt } = this.props;
    const t = assetsTableFields;
    const assetsTable = values[ASSET_TABLE];

    let needConfirmation = false;
    if (assetsTable && assetsTable.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const row of assetsTable) {
        if (
          row &&
          parseFloat(row[t.cancelValue]).toFixed(3) !==
            parseFloat(row[t.currentCancelValue]).toFixed(3)
        ) {
          needConfirmation = true;
          break;
        }
      }
    }

    if (needConfirmation) {
      this.onOpenSubmitEditConfirmPopup(() =>
        onSubmitEditReceipt(id, values, isBasket, () => {}),
      );

      return;
    }

    onSubmitEditReceipt(id, values, isBasket, () => {});
  }

  /**
   * Submit-Edit Confirm Popup Content
   */
  renderSubmitEditConfirmPopupContent = () => (
    <React.Fragment>
      <DialogTitle>Cảnh Báo</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Hệ thống sẽ cập nhật lại giá trị hủy (tạm tính) theo giá trị hủy (hiện
          tại).
        </Typography>
      </DialogContent>
      <DialogActions>
        <MuiButton outline onClick={this.onCloseSubmitEditConfirmPopup}>
          Không
        </MuiButton>
        <MuiButton
          onClick={() => {
            this.state.onConfirmSubmitEdit();
            this.onCloseSubmitEditConfirmPopup();
          }}
        >
          Có
        </MuiButton>
      </DialogActions>
    </React.Fragment>
  );

  /**
   * Submit-Edit Confirm Popup Content
   */
  renderPrintConfirmPopupContent = () => {
    const { match, onPrintReceipt, receiptData } = this.props;
    const receiptId = getNested(match, 'params', 'id');
    const printNumber = getNested(receiptData, 'printNumber');
    const isRePrint = printNumber > 0;
    const canRePrint = ability.can(CODE.inLai, SCREEN_CODE.PRINTABLE);

    return isRePrint && canRePrint ? (
      <React.Fragment>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Có phải bạn muốn in lại từ đầu không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton
            outline
            onClick={() => {
              onPrintReceipt(receiptId, false, false, openPrintWindow);
              this.onCloseConfirmPrintPopup();
            }}
          >
            Sai
          </MuiButton>
          <MuiButton
            onClick={() => {
              onPrintReceipt(receiptId, false, isRePrint, openPrintWindow);
              this.onCloseConfirmPrintPopup();
            }}
          >
            Đúng
          </MuiButton>
        </DialogActions>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <DialogTitle>Cảnh Báo</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn in không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton outline onClick={this.onCloseConfirmPrintPopup}>
            Không
          </MuiButton>
          <MuiButton
            onClick={() => {
              onPrintReceipt(receiptId, false, false, openPrintWindow);
              this.onCloseConfirmPrintPopup();
            }}
          >
            Có
          </MuiButton>
        </DialogActions>
      </React.Fragment>
    );
  };

  /**
   * Sanitize Receipt Data before submit
   */
  sanitizeDataBeforeSubmit = values => {
    const t1 = assetsTableFields;
    const t2 = basketsInUseFields;
    let assetsTable = [...values[ASSET_TABLE]];
    if (assetsTable && assetsTable.length) {
      assetsTable = assetsTable.filter(row => row && row[t1.assetCode]);
    }

    let basketsInUseTable = [...values[BASKET_INUSE_TABLE]];
    if (basketsInUseTable && basketsInUseTable.length) {
      basketsInUseTable = basketsInUseTable.filter(
        row => row && row[t2.basketLocatorCode],
      );
    }

    let productsTable = [...values[PRODUCT_TABLE]];
    if (productsTable && productsTable.length) {
      productsTable = productsTable.filter(row => row && row.productCode);
    }

    return {
      ...values,
      [ASSET_TABLE]: assetsTable,
      [BASKET_INUSE_TABLE]: basketsInUseTable,
      [PRODUCT_TABLE]: productsTable,
    };
  };

  // in phiếu
  onPrintReceipt = () => {
    this.onOpenConfirmPrintPopup();
  };

  // xem trước phiếu in
  onPreviewPrintReceipt = () => {
    const { match, onPrintReceipt } = this.props;
    const receiptId = getNested(match, 'params', 'id');

    onPrintReceipt(receiptId, true, false, printData =>
      openPrintWindow(printData, true),
    );
  };

  // handleNotification = formik => {
  //   if (this.state.isSubmitting !== formik.isSubmitting) {
  //     this.setState({ isSubmitting: formik.isSubmitting });
  //     if (this.state.isSubmitting) {
  //       notifyIfFormIsInvalid(formik, this.props.dispatch);
  //     }
  //   }
  // };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  render() {
    const {
      classes,
      match,
      history,
      generalSectionDefaultValues,
      receiptData,
      selectBoxData,
      onSubmitCreateReceipt,
      // onSubmitEditReceipt,
      onSubmitApproveReceipt,
      onSubmitReApproveReceipt,
      isDraftSelected,
      dispatch,
    } = this.props;

    const { pageInfo } = this.state;
    const { title, pageType } = pageInfo;
    const { isBasket } = getUrlParams(history);
    const isAutoReceipt = getNested(receiptData, 'isAutoReceipt');

    // Schema for all sections
    const GeneralSchema = makeGeneralSchema(
      pageType,
      isBasket,
      isAutoReceipt,
      isDraftSelected,
    );

    let initGeneralSection = {
      ...generalSectionDefaultValues,
      createdAt: this.state.createdAt,
    };
    if (!pageType.create && receiptData[GENERAL_INFO_SECTION]) {
      initGeneralSection = receiptData[GENERAL_INFO_SECTION];

      if (pageType.reApprove) {
        initGeneralSection.status =
          selectBoxData.status && selectBoxData.status.length
            ? selectBoxData.status[0].value
            : '';
      }
    }

    const rightActions = (
      <div className={classes.rightActions}>
        {pageType.view && isBasket ? (
          <>
            <MuiButton onClick={this.onPreviewPrintReceipt}>
              Xem Trước Phiếu In
            </MuiButton>
            <MuiButton onClick={this.onPrintReceipt}>In PYCH</MuiButton>
          </>
        ) : null}

        {pageType.view && receiptData.isShowExportCancellationButton ? (
          <Button
            variant="contained"
            color="primary"
            onClick={this.goToExportCancellationPage}
          >
            Xuất Hủy
          </Button>
        ) : null}
      </div>
    );

    return (
      <React.Fragment>
        <div className={classes.headerContainer}>
          <Typography variant="h5" color="textPrimary" gutterBottom>
            {title}
          </Typography>

          {rightActions}
        </div>
        <FormWrapper
          enableReinitialize
          initialValues={GeneralSchema.cast({
            // General Info Section
            ...initGeneralSection,

            // section 2
            [PRODUCT_TABLE]:
              !pageType.create && receiptData[PRODUCT_TABLE]
                ? receiptData[PRODUCT_TABLE]
                : [],

            // section 2 baskets
            [ASSET_TABLE]:
              !pageType.create && receiptData[ASSET_TABLE]
                ? receiptData[ASSET_TABLE]
                : [],
            [ASSET_TABLE_PINNED]: [],

            // IV. THÔNG TIN KHAY SỌT SỬ DỤNG THANH LÝ/HỦY
            [BASKET_INUSE_TABLE]:
              !pageType.create && receiptData[BASKET_INUSE_TABLE]
                ? receiptData[BASKET_INUSE_TABLE]
                : [],
            [BASKET_INUSE_TABLE_PINNED]: [],

            // section 3 baskets table
            [BASKET_INFO_TABLE]:
              !pageType.create && receiptData[BASKET_INFO_TABLE]
                ? receiptData[BASKET_INFO_TABLE]
                : [],

            // section 3 (setion 4 on type basket)
            [APPROVAL_TABLE]: receiptData[APPROVAL_TABLE] || [],
          })}
          validationSchema={GeneralSchema}
          onSubmit={(values, formikActions) => {
            const id = getNested(match, 'params', 'id');

            const sanitizedValues = this.sanitizeDataBeforeSubmit(values);
            if (pageType.create) {
              onSubmitCreateReceipt(sanitizedValues, isBasket, () => {});
            }

            if (pageType.edit) {
              this.handleSubmitEditReceipt(id, sanitizedValues, isBasket);
            }

            if (pageType.approve) {
              onSubmitApproveReceipt(id, sanitizedValues, isBasket, () => {});
            }

            if (pageType.reApprove) {
              onSubmitReApproveReceipt(id, sanitizedValues, isBasket, () => {});
            }

            formikActions.setSubmitting(false);
          }}
          render={formik => (
            <Form>
              <NotifyOnSubmit formik={formik} dispatch={dispatch} />
              <GeneralInfo
                {...pageInfo}
                isAutoReceipt={isAutoReceipt}
                formik={formik}
                match={match}
              />

              {isBasket ? (
                <>
                  {/* bỏ bảng sử dụng- sở hữu */}
                  {/* <BasketInfoTable */}
                  {/*  {...pageInfo} */}
                  {/*  formik={{ ...formik, ...formikPropsHelpers(formik) }} */}
                  {/* /> */}
                  <BasketsInUseTable
                    {...pageInfo}
                    formik={{ ...formik, ...formikPropsHelpers(formik) }}
                    match={match}
                  />
                  <AssetsTable
                    {...pageInfo}
                    formik={{ ...formik, ...formikPropsHelpers(formik) }}
                    match={match}
                  />
                </>
              ) : (
                <ProductsTable
                  {...pageInfo}
                  formik={{ ...formik, ...formikPropsHelpers(formik) }}
                  match={match}
                />
              )}

              {!pageType.create ? (
                <ApprovalInfo {...pageInfo} formik={formik} match={match} />
              ) : null}

              <div className={classes.btnContainer}>
                <MuiButton outline onClick={history.goBack}>
                  Quay lại
                </MuiButton>
                {!pageType.view && (
                  <MuiButton
                    onClick={() => setTimeout(formik.handleSubmit, 500)}
                  >
                    Lưu
                  </MuiButton>
                )}
                {pageType.view && isBasket && receiptData.isShowCancelButton ? (
                  <MuiButton onClick={this.onDiscardReceipt}>
                    Huỷ Phiếu
                  </MuiButton>
                ) : null}
              </div>
            </Form>
          )}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
        {/* Popup xác nhận submit update phiếu */}
        <Popup
          content={this.renderSubmitEditConfirmPopupContent()}
          onClose={this.onCloseSubmitEditConfirmPopup}
          open={this.state.openSubmitEditConfirmPopup}
          dialogProps={{ maxWidth: 'sm' }}
        />
        {/* Popup xác nhận in phiếu */}
        <Popup
          content={this.renderPrintConfirmPopupContent()}
          onClose={this.onCloseConfirmPrintPopup}
          open={this.state.openConfirmPrintPopup}
          dialogProps={{ maxWidth: 'sm' }}
        />
      </React.Fragment>
    );
  }
}

ImportStockListPage.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  generalSectionDefaultValues: PropTypes.object,
  selectBoxData: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onFetchReceiptData: PropTypes.func,
  onFetchReceiptDataSuccess: PropTypes.func,
  receiptData: PropTypes.object,
  isDraftSelected: PropTypes.bool,
  onSubmitCreateReceipt: PropTypes.func,
  onSubmitEditReceipt: PropTypes.func,
  onSubmitApproveReceipt: PropTypes.func,
  onSubmitReApproveReceipt: PropTypes.func,
  onDiscardReceipt: PropTypes.func,
  onPrintReceipt: PropTypes.func,
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  generalSectionDefaultValues: makeSelect.generalInfoDefaultValues(),
  receiptData: makeSelect.receiptData(),
  selectBoxData: makeSelect.selectBoxData(),
  isDraftSelected: makeSelect.isDraftSelected(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: (pageType, history, match) =>
      dispatch(actions.fetchFormData(pageType, history, match)),
    onFetchReceiptData: (id, pageType, isBasket) =>
      dispatch(actions.fetchReceiptData(id, pageType, isBasket)),
    onFetchReceiptDataSuccess: receiptData =>
      dispatch(actions.fetchReceiptDataSuccess(receiptData)),
    onSubmitCreateReceipt: (data, isBasket, callback) =>
      dispatch(actions.submitCreateReceipt(data, isBasket, callback)),
    onSubmitEditReceipt: (id, data, isBasket, callback) =>
      dispatch(actions.submitEditReceipt(id, data, isBasket, callback)),
    onSubmitApproveReceipt: (id, data, isBasket, callback) =>
      dispatch(actions.submitApproveReceipt(id, data, isBasket, callback)),
    onSubmitReApproveReceipt: (id, data, isBasket, callback) =>
      dispatch(actions.submitReApproveReceipt(id, data, isBasket, callback)),
    onDiscardReceipt: id => dispatch(actions.discardReceipt(id)),
    onPrintReceipt: (id, isPreview, isRePrint, callback) =>
      dispatch(actions.printReceipt(id, isPreview, isRePrint, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'CancelRequestDetailPage', reducer });
const withSaga = injectSaga({ key: 'CancelRequestDetailPage', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
  withRouter,
  withImmutablePropsToJs,
  withStyles(style()),
)(ImportStockListPage);
