import React from 'react';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { getRowStyle } from 'utils/index';
import { compose } from 'redux';
import { sumBy } from 'utils/numberUtils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { orderNumberRenderer } from './Section1';
import style from './style';
import { numberCurrency } from '../../NSC_CancelRequest/DetailPage/SelectAssetsPopup/columnDefs';
import { colorStyle } from './Section1Adjust';

const bottomRowData = data => [
  {
    totalCol: true,
    uoM: 'Tổng',
    inventoryQuantity: sumBy(data, 'inventoryQuantity'),
    stocktakingQuantity: sumBy(data, 'stocktakingQuantity'),
    quantityAdjusted: sumBy(data, 'quantityAdjusted'),
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
      table: 'newBasketAdjusteds',
    });
    return true;
  },
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class Section2 extends React.PureComponent {
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
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
      tooltipField: 'basketCode',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      tooltipField: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'uoM',
      tooltipField: 'uoM',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Số Tồn Sổ Sách',
      field: 'inventoryQuantity',
      tooltipField: 'inventoryQuantity',
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
      headerName: 'Số Lượng Kiểm Kê',
      field: 'stocktakingQuantity',
      tooltipField: 'stocktakingQuantity',
      headerClass: 'ag-numeric-header header-right',
      valueFormatter: numberCurrency,
      cellClass: 'ag-numeric-cell',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
    },
    {
      headerName: 'Số Lượng Đã Điều Chỉnh',
      field: 'quantityAdjusted',
      headerClass: 'ag-numeric-header header-right',
      tooltipField: 'quantityAdjusted',
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
      headerName: 'Ngày Điều Chỉnh',
      field: 'adjustmentDate',
      // width: 150,
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
      headerName: 'Lý Do',
      field: 'reason',
      tooltipField: 'reason',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
  ];

  checkValues = () =>
    this.props.formik.values.newBasketAdjusteds.length > 0 ? 'true' : 'false';

  render() {
    const { classes, formik, form } = this.props;
    return (
      <div className={classes.actions}>
        <Expansion
          expand={this.checkValues()}
          title={`${
            form === '2' ? 'II' : 'IV'
          }. Thông Tin Khay Sọt Đăng Ký Mới${
            form === '1' ? ': Đã Điều Chỉnh' : ''
          }`}
          content={
            <Grid>
              <FormData
                idGrid="grid-section2"
                name="newBasketAdjusteds"
                columnDefs={this.columnDefs}
                defaultColDef={defaultColDef}
                gridStyle={{ height: 'auto' }}
                gridProps={{
                  context: this,
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  domLayout: 'autoHeight',
                  pinnedBottomRowData: bottomRowData(
                    formik.values.newBasketAdjusteds,
                  ),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle,
                }}
                rowData={formik.values.newBasketAdjusteds}
              />
            </Grid>
          }
        />
      </div>
    );
  }
}
Section2.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  form: PropTypes.string,
};

export default compose(withStyles(style))(Section2);
