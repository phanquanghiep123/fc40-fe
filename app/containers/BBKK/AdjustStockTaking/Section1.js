import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle } from 'utils/index';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiInputEditor from 'components/MuiInput/Editor';
import ConfirmationDialog from 'components/ConfirmationDialog';
import style from './style';
import ActionsRenderer from './ActionRenderer';
import SelectAssetsPopup from './SelectAssetsPopup/index';
import CheckboxRenderer from './CheckboxRenderer';
import MuiSelectInputEditor from '../../../components/MuiSelect/InputEditor';
import ImagePopup from './ImagePopup';
import ImageUploadCellRenderer from './ImageUploadCellRenderer';
import appTheme from '../../App/theme';
import { isNumberString } from '../../App/utils';
import { formatToCurrency, sumBy } from '../../../utils/numberUtils';

export const orderNumberRenderer = ({ data, rowIndex }) =>
  data.totalCol ? '' : rowIndex + 1;

export const colorStyle = data => {
  if (data.expectAdjustQuantity > 0) {
    return 'blue';
  }
  if (data.expectAdjustQuantity === 0) {
    return 'black';
  }
  return 'red';
};

const bottomRowData = data => {
  const totalColumn = data.filter(item => item.isAdjusted);
  return [
    {
      totalCol: true,
      uoM: 'Tổng',
      inventoryQuantity: sumBy(totalColumn, 'inventoryQuantity'),
      stocktakingQuantity: sumBy(totalColumn, 'stocktakingQuantity'),
      expectAdjustQuantity: sumBy(totalColumn, 'expectAdjustQuantity'),
    },
  ];
};

const bottomRowDataAsset = data => [
  {
    totalCol: true,
    palletBasketName: 'Tổng',
    price: sumBy(data, 'price'),
    cancelQuantity: sumBy(data, 'cancelQuantity'),
  },
];

export const numberCurrency = params =>
  params.value && isNumberString(params.value)
    ? formatToCurrency(params.value)
    : params.value;

export const defaultColDef = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.onUpdateBasketCancelDetails({
      index: params.node.rowIndex,
      table: 'cancelBaskets',
      data: updaterData,
    });
    return true;
  },
  suppressMovable: true,
};

export const defaultColDefAsset = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.onUpdateBasketCancelDetails({
      index: params.node.rowIndex,
      table: 'assetCancels',
      data: updaterData,
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
      openSelectAssetsPopup: false,
      // openDialogDelete: false,
      // agProps: undefined, // store the agProps of the cell where delete button is clicked
      openImagePopup: false,
    };
  }

  dataRecord = {};

  columnDefs = [
    {
      headerName: 'Điều chỉnh',
      field: 'isAdjusted',
      cellRendererFramework: CheckboxRenderer,
      cellRendererParams: ({ context, data }) => ({
        data,
        onUpdateBasketCancelDetails: context.props.onUpdateBasketCancelDetails,
        table: 'cancelBaskets',
        form: context.props.form,
        onChangeField: context.props.onChangeField,
      }),
      width: 80,
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
      tooltipField: 'inventoryQuantity',
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
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
      valueFormatter: numberCurrency,
    },
    {
      headerName: 'Số Lượng Cần Điều Chỉnh',
      field: 'expectAdjustQuantity',
      width: 200,
      tooltipField: 'expectAdjustQuantity',
      valueFormatter: numberCurrency,
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
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
      tooltipField: 'reasonName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      width: 120,
      headerClass: 'ag-header-required',
      editable: ({ context, ...params }) => {
        const { form } = context.props;
        if (params.data.totalCol || form === '2') {
          return false;
        }
        return true;
      },
      cellRendererFramework: CellRenderer,
      cellEditorFramework: MuiSelectInputEditor,
      valueSetter: () => false,
      cellEditorParams: ({ context, rowIndex, data }) => ({
        valueKey: 'value',
        labelKey: 'label',
        sublabelKey: 'value',
        isClearable: true,
        isSearchable: true,
        options: context.props.formOptions.reasonCancel,
        onChange: selected => {
          const { formik } = context.props;
          const newData = {
            ...data,
            reasonName: selected.label,
            reasonCode: selected.value,
          };
          context.props.onUpdateBasketCancelDetails({
            data: newData,
            table: 'cancelBaskets',
            index: rowIndex,
          });
          let newValueAssetCancel = [];
          if (formik.values.assetCancels.length > 0) {
            newValueAssetCancel = formik.values.assetCancels.map(item => {
              if (item.basketStocktakingDetailId === data.id) {
                return {
                  ...item,
                  reasonName: selected.label,
                  reasonCode: selected.value,
                };
              }
              return item;
            });
          }
          context.props.onChangeReasonAsset({
            data: newValueAssetCancel,
            table: 'assetCancels',
          });
        },
      }),
      cellStyle: ({ context }) => ({
        background:
          context.props.form === '1'
            ? appTheme.palette.background.default
            : 'inherit',
      }),
    },

    {
      headerName: 'Tình Trạng Trước Khi Hủy',
      field: 'state',
      tooltipField: 'state',
      headerClass: 'ag-header-required',
      editable: ({ context, ...params }) => {
        const { form } = context.props;
        if (params.data.totalCol || form === '2') {
          return false;
        }
        return true;
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CellRenderer,
      cellStyle: ({ context }) => ({
        background:
          context.props.form === '1'
            ? appTheme.palette.background.default
            : 'inherit',
      }),
    },
    {
      headerName: 'Hình Ảnh',
      field: 'images',
      cellRendererFramework: ImageUploadCellRenderer,
      cellRendererParams: ({ context }) => ({
        formik: context.props.formik,
        onOpenImagePopup: this.onOpenImagePopup,
        dispatch: this.props.dispatch,
        context,
        form: this.props.form,
      }),
      editable: false,
      width: 200,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      cellStyle: ({ context }) => ({
        background:
          context.props.form === '1'
            ? appTheme.palette.background.default
            : 'inherit',
      }),
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      editable: ({ context, ...params }) => {
        const { form } = context.props;
        if (params.data.totalCol || form === '2') {
          return false;
        }
        return true;
      },
      cellStyle: ({ context }) => ({
        background:
          context.props.form === '1'
            ? appTheme.palette.background.default
            : 'inherit',
      }),
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: '',
      field: 'action',
      width: 50,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionsRenderer,
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
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      tooltipField: 'palletBasketName',
    },
    {
      headerName: 'Giá Trị Hủy',
      field: 'price',
      valueFormatter: numberCurrency,
      tooltipField: 'price',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
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
      editable: ({ context, ...params }) => {
        if (params.data.totalCol) {
          return false;
        }
        return true;
      },
      cellStyle: ({ context, ...params }) => ({
        background:
          context.props.form === '1' && !params.data.totalCol
            ? appTheme.palette.background.default
            : 'inherit',
      }),
    },
  ];

  onOpenSelectAssetsPopup = (isEdit, data) => {
    const { formik, onFetchPopupBasket } = this.props;
    onFetchPopupBasket(formik, data.locatorId, isEdit, data);
    this.setState({ openSelectAssetsPopup: true });
    this.dataRecord = data;
  };

  closeSelectAssetsPopup = () => {
    this.setState({ openSelectAssetsPopup: false });
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

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  render() {
    const {
      ui,
      match,
      history,
      classes,
      formik,
      onFetchBigImageBasket,
    } = this.props;
    return (
      <div className={classes.actions}>
        <Expansion
          expand={false}
          title="I. Thông Tin Khay Sọt Hủy: Chờ Điều Chỉnh"
          content={
            <Grid>
              <FormData
                idGrid="grid-section5"
                name="cancelBaskets"
                gridStyle={{ height: 'auto' }}
                columnDefs={this.columnDefs}
                defaultColDef={defaultColDef}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                rowData={formik.values.cancelBaskets}
                // errors={formik.errors}
                // touched={formik.touched}
                gridProps={{
                  context: this,
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  domLayout: 'autoHeight',
                  pinnedBottomRowData: bottomRowData(
                    formik.values.cancelBaskets,
                  ),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle,
                }}
                {...formik}
              />
              <div className={classes.tableAsset}>
                <FormData
                  // idGrid="grid-section5"
                  name="assetCancels"
                  gridStyle={{ height: 'auto' }}
                  columnDefs={this.columnDefsAsset}
                  defaultColDef={defaultColDefAsset}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  rowData={formik.values.assetCancels}
                  gridProps={{
                    context: this,
                    domLayout: 'autoHeight',
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    pinnedBottomRowData: bottomRowDataAsset(
                      formik.values.assetCancels,
                    ),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    getRowStyle,
                  }}
                  {...formik}
                />
              </div>
            </Grid>
          }
        />
        <ImagePopup
          open={this.state.openImagePopup}
          onClose={this.closeImagePopup}
          rowIndex={this.state.rowIndex}
          imgIndex={this.state.imgIndex}
          deleteImage={this.state.deleteImageFunc}
          formik={formik}
          // pageType={pageType}
          onFetchBigImageBasket={onFetchBigImageBasket}
        />
        <SelectAssetsPopup
          // openDl={openDl}
          open={this.state.openSelectAssetsPopup}
          onClose={this.closeSelectAssetsPopup}
          ui={ui}
          history={history}
          match={match}
          data={this.dataRecord}
          {...this.props}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </div>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  form: PropTypes.string,
};

export default compose(withStyles(style))(Section1);
