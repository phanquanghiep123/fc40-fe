import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { formatToCurrency } from 'utils/numberUtils';
import FormDataFree from 'components/FormikUI/FormDataFree';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { Paper, withStyles, Typography, Grid } from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Formik, Form, Field } from 'formik';
import SelectControl from 'components/SelectControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputControl from 'components/InputControl';
import { localstoreUtilites } from 'utils/persistenceData';
import PaperPanel from 'components/PaperPanel';
import appTheme from 'containers/App/theme';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { showWarning } from 'containers/App/actions';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import ImagePopup from './ImagePopup';
import CommonAction from './CommonAction';
import * as constants from '../constants';
import { getStyle, getStyle2 } from './tableColumns';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import {
  convertDateString,
  convertDateTimeStringNoSecond,
} from '../../../App/utils';
import ImageCellRenderer from './ImageCellRenderer';
import { schema } from './Schema';
import './mycss.css';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  noteWrapper: {
    padding: 12,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
export const numberCurrency = params => formatToCurrency(params.value) || '';

class TableSection extends Component {
  state = {
    assessObj: null,
    imgIndex: 0,
    rowIndex: 0,
  };

  componentDidMount() {
    this.props.getInitSizeFile();
  }

  onChangeRowsPerPage = pageSize => {
    const { onSubmitForm, submittedValues } = this.props;
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues);
  };

  onChangePage = pageIndex => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onSubmitForm, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { submittedValues } = this.props;
    const column = this.columnDefs[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      this.props.onChangeOrder(submittedValues, sortOrder);
    }
  };

  onExportExcel = () => {
    const { submittedValues, onExportExcel } = this.props;
    onExportExcel(submittedValues);
  };

  assess = (params, rowIndex) => {
    const assessObj = params;
    assessObj.rowIndex = rowIndex;
    assessObj.purposeStorage =
      params.purposeStorage || constants.DEFAULT_PURPOSE_STORAGE;
    assessObj.warningType =
      (params.warningType ? params.warningType : params.warningClass) ||
      constants.DEFAULT_WARNING_TYPE;
    assessObj.oldImageIds =
      params.images instanceof Array ? params.images.map(item => item.id) : [];
    this.setState({
      assessObj,
    });
  };

  closeAssess = () => this.setState({ assessObj: null });

  submitAssess = formik => {
    const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
    const {
      warningType,
      purposeStorage,
      inventoryId,
      note,
      imageFiles,
      oldImageIds,
      rowIndex,
      productStatusDescription,
    } = formik;
    const data = {
      warningType,
      productStatusDescription,
      purposeStorage,
      inventoryId,
      imageFiles,
      note,
      oldImageIds,
      rowIndex,
      assessorCode: userId,
      evaluationDate: new Date(),
    };
    this.props.submitAssess(data, this.closeAssess);
  };

  // eslint-disable-next-line consistent-return
  getRowStyle = function(params) {
    if (params.data.totalCol) {
      return { backgroundColor: appTheme.palette.background.default };
    }
  };

  columnDefs = [
    {
      headerName: 'STT',
      field: 'indexOfAll',
      width: 50,
      pinned: 'left',
      lockPosition: true,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      valueFormatter: params => this.renderNumberOrder(params),
    },
    {
      headerName: 'Mã Đơn vị',
      field: 'plantCode',
      width: 60,
      resizable: true,
      lockPosition: true,
      pinned: 'left',
    },
    {
      headerName: 'Kho Tồn',
      field: 'locatorName',
      tooltipField: 'locatorName',
      width: 100,
      resizable: true,
      lockPosition: true,
      pinned: 'left',
    },
    {
      headerName: 'Tên Farm/NCC',
      field: 'originName',
      resizable: true,
      lockPosition: true,
      pinned: 'left',
    },
    {
      headerName: 'Mã Sản Phẩm',
      field: 'productCode',
      width: 80,
      resizable: true,
      lockPosition: true,
      pinned: 'left',
    },
    {
      headerName: 'Tên Sản Phẩm',
      field: 'productName',
      resizable: true,
      lockPosition: true,
    },
    {
      headerName: 'Batch',
      field: 'slotCode',
      width: 90,
      resizable: true,
      lockPosition: true,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Số Lượng',
      field: 'quantity',
      width: 150,
      resizable: true,
      lockPosition: true,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
        style: { fontWeight: 'bold', textAlign: 'right' },
      },
      cellStyle: {
        textAlign: 'right',
      },
      headerClass: 'header-right',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uoM',
      resizable: true,
      lockPosition: true,
      width: 80,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Ngày Hết Hạn',
      field: 'expirationDate',
      width: 100,
      resizable: true,
      lockPosition: true,
      valueFormatter: params => convertDateString(params.data.expirationDate),
    },
    {
      headerName: 'Số Ngày Còn Hạn',
      field: 'dateRemain',
      resizable: true,
      lockPosition: true,
      width: 80,
    },
    {
      headerName: 'Phân Loại Cảnh Báo',
      field: 'warningClassName',
      resizable: true,
      lockPosition: true,
      width: 130,
      cellStyle: params => getStyle(params.data, 'warningClass'),
    },
    {
      headerName: 'Mục Đích Lưu Kho',
      field: 'purposeStorageName',
      resizeable: true,
      width: 90,
      cellStyle: params => getStyle2(params.data),
    },
    {
      headerName: 'Đánh Giá Thực Tế',
      field: 'warningName',
      width: 120,
      resizable: true,
      lockPosition: true,
      cellStyle: params => getStyle(params.data, 'warningType'),
    },
    {
      headerName: 'Mô Tả Tình Trạng SP',
      field: 'productStatusDescription',
      width: 160,
      resizable: true,
      lockPosition: true,
    },
    {
      headerName: 'Thời Gian Đánh Giá Thực Tế',
      field: 'evaluationDate',
      resizable: true,
      lockPosition: true,
      width: 140,
      valueFormatter: params =>
        convertDateTimeStringNoSecond(params.data.evaluationDate),
    },
    {
      headerName: 'Người Đánh Giá',
      field: 'assessorName',
      resizable: true,
      lockPosition: true,
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      resizable: true,
      lockPosition: true,
    },
    {
      headerName: 'Hình Ảnh',
      field: 'image',
      cellRendererFramework: ImageCellRenderer,
      cellRendererParams: params => ({
        data: params.data,
        openImagePopup: imgIndex => {
          this.setState({ rowIndex: params.rowIndex, imgIndex });
          params.context.openImagePopup(params.rowIndex, imgIndex);
        },
      }),
    },
    { headerName: 'Người Kiểm Kê', field: 'stocktakerName', resizable: true },
    {
      headerName: 'Thời Gian Kiểm Kê',
      field: 'stocktakingDate',
      resizable: true,
      lockPosition: true,
      valueFormatter: params =>
        convertDateTimeStringNoSecond(params.data.stocktakingDate),
    },
    {
      headerName: 'Thao tác',
      field: 'action',
      width: 80,
      resizable: true,
      lockPosition: true,
      pinned: 'right',
      cellClassRules: {
        'my-class': '1===1',
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      cellRendererFramework: CommonAction,
      cellRendererParams: params => ({
        inventory: () => {
          const { plantCode, locatorCode, productCode, slotCode } = params.data;
          // go to kiem ke
          this.props.history.push(
            `/quan-ly-kho/kiem-ke-kho?plantCode=${plantCode}&inventory=${plantCode}${locatorCode}&productCode=${productCode}&batch=${slotCode}`,
          );
        },
        assess: () => {
          this.assess(params.data, params.rowIndex);
        },
      }),
    },
  ];

  renderNumberOrder(params) {
    if (params.data.index) {
      const pageSizeData = this.props.submittedValues.pageSize;
      const pageIndexData = this.props.submittedValues.pageIndex;
      return pageIndexData * pageSizeData + params.data.index;
    }
    return null;
  }

  openImagePopup = () => {
    const openViewImage = true;
    this.setState({ openViewImage });
  };

  closeImagePopup = () => {
    const openViewImage = false;
    this.setState({ openViewImage });
  };

  uploadHandler = (event, formik) => {
    const { files } = event.target;
    if (files[0].size > this.props.size) {
      this.props.showWarning(
        `Size ảnh không được vượt quá ${Number.parseInt(this.props.size, 0) /
          1024 /
          1024} MB`,
      );
      return false;
    }
    const imageFiles = [];
    const { length } = files;
    let count = 0;
    Array.from(files).forEach(item => {
      const reader = new FileReader();
      reader.onload = () => {
        imageFiles.push({ fileName: item.name, file: reader.result });
        count += 1;
        if (count === length) {
          formik.setFieldValue('imageFiles', imageFiles);
        }
      };
      reader.readAsDataURL(item);
    });
    return true;
  };

  bottomRowData = () =>
    this.props.totalTable.map(item => {
      if (item.uoM === null) {
        return {
          totalCol: true,
          slotCode: 'Tổng',
          quantity: item.totalQuantity,
        };
      }
      return {
        totalCol: true,
        quantity: item.totalQuantity,
        uoM: item.uoM,
      };
    });

  onAddProduct = () => {
    this.props.history.push('/quan-ly-kho/them-san-pham');
  };

  render() {
    const {
      classes,
      tableData,
      submittedValues,
      ui,
      formData,
      onFetchBigImage,
      onDeleteImage,
      history,
    } = this.props;
    const { assessObj } = this.state;
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Kho</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoPXCM} on={SCREEN_CODE.PXCM}>
            <MuiButton
              outline
              onClick={() =>
                history.push(
                  'quan-ly-kho/tao-phieu-xuat-chuyen-ma-hang-hoa?form=1',
                )
              }
            >
              Chuyển mã
            </MuiButton>
          </Can>

          <Can do={CODE.themSP} on={SCREEN_CODE.QLK}>
            <MuiButton outline onClick={this.onAddProduct}>
              Thêm Sản Phẩm
            </MuiButton>
          </Can>
          <MuiButton
            outline
            color="primary"
            disabled={isEmpty(tableData)}
            onClick={this.onExportExcel}
          >
            Xuất excel
          </MuiButton>
        </div>
      </div>
    );
    return (
      <Paper className={classes.paper}>
        {topToolbar}
        {!!assessObj && (
          <ui.Dialog
            maxWidth="sm"
            title="Đánh Giá"
            openDl={!!assessObj}
            fullWidth
            isDialog={false}
            content={
              <Formik
                enableReinitialize
                initialValues={assessObj}
                onSubmit={this.submitAssess}
                validationSchema={schema}
                render={formik => (
                  <Form>
                    <PaperPanel>
                      <Grid container>
                        <Grid item md={12}>
                          <Field
                            label="Mục Đích Lưu Kho"
                            component={SelectControl}
                            name="purposeStorage"
                            onChange={formik.handleChange}
                          >
                            {formData.purposeStorage.map(type => (
                              <MenuItem value={type.value} key={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item md={12}>
                          <Field
                            label="Đánh Giá Thực Tế"
                            component={SelectControl}
                            name="warningType"
                            onChange={formik.handleChange}
                          >
                            {formData.warningTypes.map(type => (
                              <MenuItem value={type.value} key={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item md={12}>
                          <Field
                            name="productStatusDescription"
                            label="Mô Tả Tình Trạng Sản Phẩm"
                            onChange={formik.handleChange}
                            component={InputControl}
                          />
                        </Grid>
                        <Grid item md={12}>
                          <Field
                            name="note"
                            label="Ghi Chú"
                            onChange={formik.handleChange}
                            component={InputControl}
                            multiline
                          />
                        </Grid>
                        <Grid item md={12}>
                          <Grid container alignItems="center">
                            <Grid item md={3}>
                              <MuiButton component="label">
                                <input
                                  accept=".png, .jpg, .jpeg"
                                  multiple
                                  onChange={e => this.uploadHandler(e, formik)}
                                  type="file"
                                  style={{ display: 'none' }}
                                  id="images"
                                />
                                Tải Ảnh
                              </MuiButton>
                            </Grid>
                            {formik.values.imageFiles && (
                              <Grid
                                item
                                md={9}
                                style={{ borderLeft: '2px solid green' }}
                              >
                                {formik.values.imageFiles.map(item => (
                                  <div
                                    className={classes.noteWrapper}
                                    key={item.fileName}
                                  >
                                    {item.fileName}
                                  </div>
                                ))}
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </PaperPanel>
                    <Grid container justify="flex-end" spacing={24}>
                      <Grid item>
                        <MuiButton outline onClick={this.closeAssess}>
                          Hủy
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton onClick={formik.submitForm}>
                          Đồng ý
                        </MuiButton>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              />
            }
            customActionDialog
          />
        )}
        {this.state.openViewImage && (
          <ImagePopup
            open={this.state.openViewImage}
            tableData={tableData}
            onFetchBigImage={onFetchBigImage}
            rowIndex={this.state.rowIndex}
            imgIndex={this.state.imgIndex}
            deleteImage={onDeleteImage}
            onClose={this.closeImagePopup}
          />
        )}
        <FormDataFree
          gridStyle={{ height: 500 }}
          gridOptions={{
            rowHeight: 150,
            headerHeight: 250,
          }}
          gridProps={{
            context: this,
            pinnedBottomRowData: this.bottomRowData(),
            frameworkComponents: {
              customPinnedRowRenderer: PinnedRowRenderer,
            },
            getRowStyle: this.getRowStyle,
          }}
          columnDefs={this.columnDefs}
          rowData={tableData}
          customizePagination
          remotePagination
          totalCount={submittedValues.totalItem}
          pageIndex={submittedValues.pageIndex}
          onOrderChange={this.onOrderChange}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          pageSize={submittedValues.pageSize}
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  history: PropTypes.object,
  onChangeOrder: PropTypes.func,
  onDeleteImage: PropTypes.func,
  onExportExcel: PropTypes.func,
  onFetchBigImage: PropTypes.func,
  onSubmitForm: PropTypes.func,
  submitAssess: PropTypes.any,
  submittedValues: PropTypes.object,
  tableData: PropTypes.array,
  ui: PropTypes.any,
  showWarning: PropTypes.func,
  totalTable: PropTypes.array,
  getInitSizeFile: PropTypes.func,
  size: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  submittedValues: makeSelect.formSubmittedValues(),
  totalTable: makeSelect.totalTable(),
  size: makeSelect.sizeFile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    onExportExcel: formValues => dispatch(actions.exportExcel(formValues)),
    submitAssess: (data, callback) =>
      dispatch(actions.submitAssess(data, callback)),
    onFetchBigImage: payload =>
      dispatch({ type: constants.FETCH_BIG_IMAGE, payload }),
    onDeleteImage: payload =>
      dispatch({ type: constants.DELETE_IMAGE, payload }),
    showWarning: message => dispatch(showWarning(message)),
    getInitSizeFile: () => dispatch(actions.getSizeFile()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
