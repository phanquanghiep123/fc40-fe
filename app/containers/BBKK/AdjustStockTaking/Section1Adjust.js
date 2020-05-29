import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { getRowStyle } from 'utils/index';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiInputEditor from 'components/MuiInput/Editor';
import style from './style';
import MuiSelectInputEditor from '../../../components/MuiSelect/InputEditor';
import ImagePopupAdjust from './ImagePopupAdjust';
import ImageUploadCellRendererAdjust from './ImageUploadCellRendererAdjust';
import { numberCurrency } from '../../NSC_CancelRequest/DetailPage/SelectAssetsPopup/columnDefs';

export const orderNumberRenderer = ({ data, rowIndex }) =>
  data.totalCol ? '' : rowIndex + 1;

export const colorStyle = data => {
  if (data.quantityAdjusted > 0) {
    return 'blue';
  }
  if (data.quantityAdjusted === 0) {
    return 'black';
  }
  return 'red';
};

const bottomRowData = data => [
  {
    totalCol: true,
    uoM: 'Tổng',
    inventoryQuantity: sumBy(data, 'inventoryQuantity'),
    stocktakingQuantity: sumBy(data, 'stocktakingQuantity'),
    quantityAdjusted: sumBy(data, 'quantityAdjusted'),
  },
];

const bottomRowDataAsset = data => [
  {
    totalCol: true,
    palletBasketName: 'Tổng',
    price: sumBy(data, 'price'),
    cancelQuantity: sumBy(data, 'cancelQuantity'),
  },
];

export const defaultColDef = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.onUpdateBasketCancelDetails({
      index: params.node.rowIndex,
      data: updaterData,
      table: 'cancelBasketAdjusteds',
    });
    return true;
  },
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class Section1 extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openImagePopup: false,
    };
  }

  dataRecord = {};

  columnDefs = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 80,
      cellRendererFramework: orderNumberRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Kho',
      field: 'locator',
      width: 250,
      tooltipField: 'locator',
    },
    {
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
      tooltipField: 'basketCode',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      tooltipField: 'basketName',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uoM',
      width: 150,
      tooltipField: 'uoM',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Số Tồn Sổ Sách',
      field: 'inventoryQuantity',
      width: 150,
      valueFormatter: numberCurrency,
      tooltipField: 'inventoryQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'Số Lượng Kiểm Kê',
      field: 'stocktakingQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      tooltipField: 'stocktakingQuantity',
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'Số Lượng Đã Điều Chỉnh',
      field: 'quantityAdjusted',
      width: 200,
      tooltipField: 'quantityAdjusted',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
      cellStyle: ({ data }) => ({
        color: colorStyle(data),
        fontWeight: 'bold',
      }),
    },
    {
      headerName: 'Nguyên Nhân Hủy',
      field: 'reasonName',
      resizable: false,
      suppressSizeToFit: true,
      width: 120,
      tooltipField: 'reasonName',
      headerClass: 'ag-header-required',
      editable: false,
      cellRendererFramework: CellRenderer,
      cellEditorFramework: MuiSelectInputEditor,
      valueSetter: () => false,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',

      cellEditorParams: ({ context, rowIndex, data }) => ({
        valueKey: 'value',
        labelKey: 'label',
        sublabelKey: 'value',
        isClearable: true,
        isSearchable: true,
        options: context.props.formOptions.reasonCancel,
        onChange: selected => {
          const newData = {
            ...data,
            cause: selected.label,
            reasonCode: selected.value,
          };
          context.props.onUpdateBasketCancelDetails({
            data: newData,
            index: rowIndex,
          });
        },
      }),
    },

    {
      headerName: 'Tình Trạng Trước Khi Hủy',
      field: 'state',
      tooltipField: 'state',
      headerClass: 'ag-header-required',
      editable: false,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Ngày Điều Chỉnh',
      field: 'adjustmentDate',
      width: 150,
      tooltipField: 'adjustmentDate',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Người Điều Chỉnh',
      field: 'adjustmentUser',
      width: 150,
      tooltipField: 'adjustmentUser',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Hình Ảnh',
      field: 'images',
      cellRendererFramework: ImageUploadCellRendererAdjust,
      cellRendererParams: ({ context }) => ({
        formik: context.props.formik,
        onOpenImagePopup: this.onOpenImagePopup,
        dispatch: this.props.dispatch,
        form: this.props.form,
      }),
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      editable: false,
      width: 120,
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
  ];

  columnDefsAsset = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 80,
      cellRendererFramework: orderNumberRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã Tài Sản',
      field: 'assetCode',
      // width: 120,
      tooltipField: 'assetCode',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Sở Hữu',
      field: 'ownerName',
      tooltipField: 'ownerName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'palletBasketName',
      tooltipField: 'palletBasketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Giá Trị Hủy',
      field: 'price',
      tooltipField: 'price',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      valueFormatter: numberCurrency,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'SL Hủy',
      field: 'cancelQuantity',
      valueFormatter: numberCurrency,
      tooltipField: 'cancelQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uoM',
      tooltipField: 'uoM',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Nguyên Nhân Hủy',
      field: 'reasonName',
      tooltipField: 'reasonName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
  ];

  setDataRecord = data => {
    this.dataRecord = data;
  };

  onOpenImagePopup = (rowIndex, imgIndex, deleteImageFunc) => {
    this.setState({
      openImagePopup: true,
      rowIndex,
      imgIndex,
      deleteImageFunc,
    });
  };

  // Close confirm dialog
  closeImagePopup = () => {
    this.setState({
      openImagePopup: false,
      rowIndex: null,
      imgIndex: null,
      deleteImageFunc: undefined,
    });
  };

  render() {
    const checkValues =
      this.props.formik.values.cancelBasketAdjusteds.length > 0
        ? 'true'
        : 'false';
    const { classes, formik, onFetchBigImageBasket, form } = this.props;

    return (
      <div className={classes.actions}>
        <Expansion
          expand={checkValues}
          title={`${form === '2' ? 'I' : 'II'}. Thông Tin Khay Sọt Hủy${
            form === '1' ? ': Đã Điều Chỉnh' : ''
          }`}
          content={
            <Grid>
              <FormData
                idGrid="grid-section5"
                name="cancelBasketAdjusteds"
                gridStyle={{ height: 'auto' }}
                columnDefs={this.columnDefs}
                defaultColDef={defaultColDef}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                rowData={formik.values.cancelBasketAdjusteds}
                gridProps={{
                  context: this,
                  domLayout: 'autoHeight',
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  pinnedBottomRowData: bottomRowData(
                    formik.values.cancelBasketAdjusteds,
                  ),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle,
                }}
              />
              <div className={classes.tableAsset}>
                <FormData
                  name="assetCancelAdjusteds"
                  columnDefs={this.columnDefsAsset}
                  rowData={formik.values.assetCancelAdjusteds}
                  gridStyle={{ height: 'auto' }}
                  gridProps={{
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    domLayout: 'autoHeight',
                    pinnedBottomRowData: bottomRowDataAsset(
                      formik.values.assetCancelAdjusteds,
                    ),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    getRowStyle,
                  }}
                />
              </div>
            </Grid>
          }
        />
        <ImagePopupAdjust
          open={this.state.openImagePopup}
          onClose={this.closeImagePopup}
          rowIndex={this.state.rowIndex}
          imgIndex={this.state.imgIndex}
          deleteImage={this.state.deleteImageFunc}
          formik={formik}
          // pageType={pageType}
          onFetchBigImageBasket={onFetchBigImageBasket}
        />
      </div>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object,
  // ui: PropTypes.object,
  // history: PropTypes.object,
  // match: PropTypes.object,
  formik: PropTypes.object,
  onFetchBigImageBasket: PropTypes.func,
  dispatch: PropTypes.func,
  form: PropTypes.string,
};

export default compose(withStyles(style))(Section1);
