import React from 'react';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import { getRowStyle } from 'utils/index';
import PropTypes from 'prop-types';
import { sumBy } from 'utils/numberUtils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import CheckboxControl from './CheckboxRenderer';
import { colorStyle, orderNumberRenderer } from './Section1';
import style from './style';
import { numberCurrency } from '../../NSC_CancelRequest/DetailPage/SelectAssetsPopup/columnDefs';
import appTheme from '../../App/theme';

const bottomRowData = data => [
  {
    totalCol: true,
    uoM: 'Tổng',
    inventoryQuantity: sumBy(data, 'inventoryQuantity'),
    stocktakingQuantity: sumBy(data, 'stocktakingQuantity'),
    expectAdjustQuantity: sumBy(data, 'expectAdjustQuantity'),
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
      table: 'waitingCancelBaskets',
      data: updaterData,
    });
    return true;
  },
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class Section3 extends React.PureComponent {
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
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
      cellClass: 'ag-numeric-cell',
      tooltipField: 'inventoryQuantity',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Số Lượng Kiểm Kê',
      field: 'stocktakingQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      valueFormatter: numberCurrency,
      tooltipField: 'stocktakingQuantity',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Số Lượng Cần Điều Chỉnh',
      field: 'expectAdjustQuantity',
      tooltipField: 'expectAdjustQuantity',
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      cellStyle: ({ data }) => ({
        color: colorStyle(data),
        fontWeight: 'bold',
      }),
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      cellStyle: ({ context }) => ({
        background:
          context.props.form === '1'
            ? appTheme.palette.background.default
            : 'inherit',
      }),
      editable: ({ context, ...params }) => {
        const { form } = context.props;
        if (params.data.totalCol || form === '2') {
          return false;
        }
        return true;
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    {
      field: 'isAdjusted',
      headerName: 'Đã Điều Chỉnh',
      cellRendererFramework: CheckboxControl,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      cellRendererParams: ({ context, data }) => ({
        data,
        onUpdateBasketCancelDetails: context.props.onUpdateBasketCancelDetails,
        table: 'waitingCancelBaskets',
        form: context.props.form,
      }),
    },
  ];

  render() {
    const { classes, formik, form } = this.props;
    return (
      <div className={classes.actions}>
        <Expansion
          title={`${form === '2' ? 'III' : 'V'}.Thông Tin Khay Sọt Kho Chờ Hủy`}
          content={
            <Grid>
              <FormData
                idGrid="grid-section3"
                name="waitingCancelBaskets"
                gridStyle={{ height: 'auto' }}
                columnDefs={this.columnDefs}
                defaultColDef={defaultColDef}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                rowData={formik.values.waitingCancelBaskets}
                gridProps={{
                  context: this,
                  domLayout: 'autoHeight',
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  pinnedBottomRowData: bottomRowData(
                    formik.values.waitingCancelBaskets,
                  ),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle,
                }}
                {...formik}
              />
            </Grid>
          }
        />
      </div>
    );
  }
}

Section3.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  form: PropTypes.string,
};

export default compose(withStyles(style))(Section3);
