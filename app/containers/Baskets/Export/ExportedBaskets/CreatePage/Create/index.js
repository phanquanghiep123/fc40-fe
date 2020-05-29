import React from 'react';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import { Field, Form } from 'formik';
import ConfirmationDialog from 'components/ConfirmationDialog';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle } from 'utils/index';
import { sumBy } from 'utils/numberUtils';
import FormData from 'components/FormikUI/FormData';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import Typography from '@material-ui/core/Typography';
import PrintPreview from 'components/PrintPreview';
import DialogWrapper from '../Dialog';
import { defaultColDef } from '../Config';
import { makeFormAttr } from './FormFieldDefine';
import CustomButtom from '../Button';
import { Section2Transfer } from './Section2Transfer';
import { getNested, openPrintWindow } from '../../../../../App/utils';
import { TYPE_PXKS } from '../constants';
import PXKSCancelReceipt from '../CancelReceipt';
import QuickPopup from '../../../../../../components/MuiPopup/QuickPopup';
import MuiButton from '../../../../../../components/MuiButton';
import ability from '../../../../../../authorize/ability';
import { generalSectionFields } from '../CancelReceipt/constants';

export default class CreatePage extends React.PureComponent {
  state = {
    openDialog: false,
    printPreview: false,
    printPreviewContent: '',
  };

  constructor() {
    super();
    this.quickPopupRef = React.createRef();
  }

  isCreate = () => true;

  isEdit = () => false;

  isView = () => false;

  isConfirm = () => false;

  isMgsConfirm = () => {
    const { dataValues } = this.props;
    const checkBasket = dataValues.basketDocumentDetails.filter(item => {
      if (Number.parseInt(item.deliveryQuantity - item.quantityActual, 0)) {
        return item;
      }
      return null;
    });
    if (
      this.props.config.renderMsgConfirm &&
      this.isConfirm() &&
      checkBasket.length > 0
    ) {
      return true;
    }
    return false;
  };

  closePrintPreview = () => {
    this.setState({
      printPreview: false,
      printPreviewContent: '',
    });
  };

  isMsgBBGH = () => {
    const { dataValues } = this.props;
    if (
      this.isCreate() &&
      this.props.config.renderMsgBBGH &&
      !dataValues.deliveryOrderCode
    ) {
      return true;
    }
    return false;
  };

  isDateApprove = () => {
    if (this.isView() && this.props.config.renderDateApprove) {
      return true;
    }
    return false;
  };

  isMsgCheckboxPayback = () => {
    if (
      (this.isCreate() || this.isEdit()) &&
      this.props.config.renderMsgCheckboxPayback
    ) {
      return true;
    }
    return false;
  };

  isMsgCheckboxLoan = () => {
    if (
      (this.isCreate() || this.isEdit()) &&
      this.props.config.renderMsgCheckboxLoan
    ) {
      return true;
    }
    return false;
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  onGridReadySection3 = params => {
    this.gridApiSection3 = params.api;
  };

  onNewColumnsLoadedSection3 = () => {
    if (this.gridApiSection3) {
      this.gridApiSection3.sizeColumnsToFit();
    }
  };

  exportPdfHandler = () => {
    const { onPrint, dataValues } = this.props;
    onPrint(dataValues);
  };

  rePrintHandler = () => {
    const { onRePrint, dataValues } = this.props;
    onRePrint(dataValues);
  };

  bottomRowData = () => {
    const basketDetails = this.props.formik.values.basketDocumentDetails;
    return [
      {
        totalCol: true,
        basketName: 'Tổng',
        inventoryQuantity: sumBy(basketDetails, 'inventoryQuantity'),
        deliveryQuantity: sumBy(basketDetails, 'deliveryQuantity'),
        quantityActual: sumBy(basketDetails, 'quantityActual'),
        quantityBorrowByVendo: sumBy(basketDetails, 'quantityBorrowByVendo'),
      },
    ];
  };

  handleDialogOpen = () => {
    this.setState({ openDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  confirmRemoveRecord(rowIndex) {
    const { onDeleteRowServer, dataValues, onDeleteRow } = this.props;
    this.showConfirm({
      message:
        'Thông tin phiếu xuất bị xóa không thể khôi phục! Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            if (dataValues.basketDocumentDetails[rowIndex].id) {
              onDeleteRowServer(
                dataValues.id,
                dataValues.basketDocumentDetails[rowIndex].id,
                rowIndex,
              );
            } else onDeleteRow(rowIndex);
          },
        },
      ],
    });
  }

  // Xác nhận khi thay đổi đơn vị
  onConfirmChangePlant = onConfirm => {
    const popup = this.quickPopupRef.current;
    if (!popup) return;

    popup.open({
      title: 'Cảnh báo',
      message:
        'Thông tin phiếu xuất khay sọt sẽ bị mất sau khi thay đổi đơn vị. Bạn có chắc chắn thực hiện không?',
      actions: [
        { text: 'Không', outlined: true },
        { text: 'Có', onClick: onConfirm },
      ],
    });
  };

  /**
   * Handle print/reprint/preview cancel receipt
   */
  printCancelReceiptHandler = isPreview => {
    const { formik, onPrintCancelReceipt } = this.props;
    const f = generalSectionFields;
    const popup = this.quickPopupRef.current;

    if (isPreview && popup) {
      onPrintCancelReceipt(formik, true, false, printData => {
        this.setState({ printPreview: true, printPreviewContent: printData });
      });
    } else {
      const printTimes = getNested(formik.values, f.printTimes);
      const isReprint = printTimes > 0;
      const canReprint = ability.can(CODE.inLai, SCREEN_CODE.PRINTABLE);

      const onPrint = printData => {
        openPrintWindow(printData, true);
        formik.setFieldValue(
          f.printTimes,
          parseFloat(getNested(formik.values, f.printTimes) || 0) + 1,
        );
      };

      if (isReprint && canReprint && popup) {
        popup.open({
          title: 'Xác nhận',
          message: 'Có phải bạn muốn in lại từ đầu không?',
          actions: [
            {
              text: 'Sai',
              outlined: true,
              onClick: () =>
                onPrintCancelReceipt(formik, false, false, onPrint),
            },
            {
              text: 'Đúng',
              outlined: false,
              onClick: () => onPrintCancelReceipt(formik, false, true, onPrint),
            },
          ],
        });
      } else {
        popup.open({
          title: 'Cảnh báo',
          message: 'Bạn có chắc chắn muốn in không?',
          actions: [
            {
              text: 'Không',
              outlined: true,
            },
            {
              text: 'Có',
              outlined: false,
              onClick: () =>
                onPrintCancelReceipt(formik, false, false, onPrint),
            },
          ],
        });
      }
    }
  };

  render() {
    const {
      formik,
      onAddRows,
      ui,
      match,
      history,
      config,
      onPreview,
      setDataSection2,
      classes,
    } = this.props;
    let column;
    if (this.isConfirm()) {
      column = config.columnDefsConfirm;
    } else if (this.isView()) {
      column = config.columnDefsView;
    } else {
      column = config.columnDefs;
    }
    const formAttr = makeFormAttr(this, this.onConfirmChangePlant);

    // Check trường hợp loại xuất kho là phiếu xuất huỷ
    const isCancelReceipt =
      getNested(formik.values, 'subType', 'value') === TYPE_PXKS.PXKS_HUY;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Expansion
            title={
              <Grid container spacing={24} alignItems="center">
                <Grid item>I. Thông Tin Chung</Grid>
                {this.isMsgCheckboxPayback() && (
                  <Grid item>
                    <Typography className={classes.confirm}>
                      {`Chọn [Xuất Trả Trực Tiếp] , hệ thống sẽ tự động cập nhật
                      [SL xác nhận] của bên nhận = SL xuất khi ấn Hoàn thành.`}
                    </Typography>
                  </Grid>
                )}
                {this.isMsgCheckboxLoan() && (
                  <Grid item>
                    <Typography className={classes.confirm}>
                      {`Chọn [Xuất Mượn Trực Tiếp] , hệ thống sẽ tự động cập nhật
                      [SL xác nhận] của bên nhận = SL xuất khi ấn Hoàn thành.`}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            }
            headLeftStyle={{ width: this.isView() ? '40%' : '80%' }}
            headRightStyle={{ width: this.isView() ? '60%' : '20%' }}
            rightActions={
              this.isView() && (
                <>
                  {isCancelReceipt ? (
                    <div style={{ display: 'flex' }}>
                      <MuiButton
                        style={{ marginRight: '1rem' }}
                        onClick={() => this.printCancelReceiptHandler(true)}
                      >
                        Xem Trước Phiếu In
                      </MuiButton>
                      <MuiButton
                        onClick={() => this.printCancelReceiptHandler(false)}
                      >
                        In Phiếu
                      </MuiButton>
                    </div>
                  ) : (
                    <Grid container spacing={24} justify="flex-end">
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onPreview}
                        >
                          Xem trước phiếu in
                        </Button>
                      </Grid>
                      <Grid item>
                        <Can not do={CODE.inLai} on={SCREEN_CODE.PRINTABLE}>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={this.exportPdfHandler}
                          >
                            In Phiếu
                          </Button>
                        </Can>
                        <Can do={CODE.inLai} on={SCREEN_CODE.PRINTABLE}>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={this.rePrintHandler}
                          >
                            In Phiếu
                          </Button>
                        </Can>
                      </Grid>
                    </Grid>
                  )}
                </>
              )
            }
            content={
              <Form>
                <Grid container spacing={24}>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                    <Grid container>
                      {!this.isCreate() && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.basketDocumentCode} />
                        </Grid>
                      )}
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.subType} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.date} />
                      </Grid>
                      {formAttr.deliveryOrderCode && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.deliveryOrderCode} />
                        </Grid>
                      )}
                      {formAttr.cancelRequest && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.cancelRequest} />
                        </Grid>
                      )}
                      {this.isDateApprove() && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.dateApproved} />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                    <Grid container>
                      {formAttr.deliver && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.deliver} />
                        </Grid>
                      )}
                      {formAttr.receiver && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.receiver} />
                        </Grid>
                      )}
                      {formAttr.total && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.total} />
                        </Grid>
                      )}
                      {formAttr.pxbCode && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.pxbCode} />
                        </Grid>
                      )}
                      {config.renderDirectPayback && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.directPayback} />
                        </Grid>
                      )}
                      {formAttr.directLoan && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.directLoan} />
                        </Grid>
                      )}
                      {formAttr.reason && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.reason} />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.user} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.phone} />
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.email} />
                      </Grid>
                      {this.isView() && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.statusName} />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                    <Grid container>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.supervisor} />
                      </Grid>
                      {formAttr.guarantor && (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.guarantor} />
                        </Grid>
                      )}
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Field {...formAttr.note} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <ConfirmationDialog
                  ref={ref => {
                    this.confirmRef = ref;
                  }}
                />
              </Form>
            }
          />
        </Grid>

        {/* vùng 2 */}
        {config.renderSection2(this, formik) && (
          <Grid item xs={12} hidden={isCancelReceipt}>
            <Expansion
              title={config.titleSection2()}
              content={
                <Section2Transfer
                  formik={formik}
                  config={config}
                  onGridReady={this.onGridReady}
                  onNewColumnsLoaded={this.onNewColumnsLoaded}
                  setDataSection2={setDataSection2}
                />
              }
            />
          </Grid>
        )}
        {/* vùng 3 */}
        <Grid item xs={12} hidden={isCancelReceipt}>
          <Expansion
            title={
              <Grid container spacing={24} alignItems="center">
                <Grid item>{config.titleSection3(this, formik)}</Grid>
                {this.isMgsConfirm() && (
                  <Grid item>
                    <Typography className={classes.confirm}>
                      [SL xác nhận] khác [SL xuất], hãy kiểm tra lại giá trị của
                      [SL xác nhận] trước khi ấn [Hoàn thành]
                    </Typography>
                  </Grid>
                )}
                {this.isMsgBBGH() && (
                  <Grid item>
                    <Typography className={classes.notice}>
                      Mã BBGH là trắng nên hệ thống sẽ tạo BBGH dành cho khay
                      sọt khi ấn Lưu hoặc Hoàn thành
                    </Typography>
                  </Grid>
                )}
              </Grid>
            }
            headLeftStyle={{ width: '70%' }}
            headRightStyle={{ width: '30%' }}
            rightActions={
              <div>
                {config.renderSuggest && (
                  <CustomButtom
                    text="Gợi ý KS đang mượn"
                    outline
                    // className={classes.actions}
                    onClick={this.handleDialogOpen}
                  />
                )}
                {config.addRow(this.isView(), this.isConfirm()) && (
                  <CustomButtom
                    icon="note_add"
                    outline
                    onClick={onAddRows}
                    // className={classes.actions}
                  />
                )}
              </div>
            }
            content={
              <React.Fragment>
                <FormData
                  name="basketDocumentDetails"
                  idGrid="grid-basket"
                  gridStyle={{ height: 250 }}
                  gridOptions={{
                    rowHeight: 150,
                    headerHeight: 250,
                  }}
                  rowData={formik.values.basketDocumentDetails}
                  columnDefs={column}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  errors={formik.errors}
                  touched={formik.touched}
                  defaultColDef={defaultColDef}
                  gridProps={{
                    context: this,
                    pinnedBottomRowData: this.bottomRowData(),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    // getRowStyle: this.getRowStyle,
                    // onCellValueChanged: this.onCellValueChanged,
                    onNewColumnsLoaded: this.onNewColumnsLoadedSection3,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    getRowStyle,
                  }}
                  onGridReady={this.onGridReadySection3}
                  {...formik}
                />
                <ConfirmationDialog
                  ref={ref => {
                    this.confirmRef = ref;
                  }}
                />
                <DialogWrapper
                  // openDl={openDl}
                  open={this.state.openDialog}
                  onClose={this.handleDialogClose}
                  ui={ui}
                  history={history}
                  match={match}
                />

                <QuickPopup ref={this.quickPopupRef} />
                <PrintPreview
                  content={this.state.printPreviewContent}
                  open={this.state.printPreview}
                  close={this.closePrintPreview}
                />
              </React.Fragment>
            }
          />
        </Grid>

        {isCancelReceipt && <PXKSCancelReceipt formik={formik} />}
      </Grid>
    );
  }
}
