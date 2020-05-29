import React from 'react';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { getRowStyle } from 'utils/index';
import style from './style';
import CheckboxRenderer from './CheckboxRenderer';
import appTheme from '../../App/theme';
import { numberCurrency } from '../../NSC_CancelRequest/DetailPage/SelectAssetsPopup/columnDefs';
import { colorStyle } from './Section1';

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

export const defaultColDef = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.onUpdateBasketCancelDetails({
      index: params.node.rowIndex,
      table: 'newBaskets',
      data: updaterData,
    });
    return true;
  },
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class Section2 extends React.PureComponent {
  columnDefs = [
    {
      headerName: 'Điều chỉnh',
      field: 'isAdjusted',
      cellRendererFramework: CheckboxRenderer,
      cellRendererParams: ({ context, data }) => ({
        data,
        onUpdateBasketCancelDetails: context.props.onUpdateBasketCancelDetails,
        table: 'newBaskets',
        form: context.props.form,
      }),
      width: 80,
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
      cellClass: 'ag-numeric-cell',
      tooltipField: 'inventoryQuantity',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
      valueFormatter: numberCurrency,
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
      headerClass: 'ag-numeric-header',
      cellClass: 'ag-numeric-cell',
      tooltipField: 'expectAdjustQuantity',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: {
        style: { fontWeight: 'bold' },
        valueFormatter: numberCurrency,
      },
      valueFormatter: numberCurrency,
      cellStyle: ({ data }) => ({
        color: colorStyle(data),
        fontWeight: 'bold',
      }),
    },
    {
      headerName: 'Lý Do',
      field: 'reason',
      tooltipField: 'reason',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
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
    },
    {
      headerName: 'Ghi Chú',
      field: 'note',
      tooltipField: 'note',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
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
    },
  ];

  render() {
    const { classes, formik } = this.props;

    return (
      <div className={classes.actions}>
        <Expansion
          title="III.Thông Tin Khay Sọt Đăng Ký Mới: Chờ Điều Chỉnh"
          content={
            <Grid>
              <FormData
                idGrid="grid-section2"
                name="newBaskets"
                columnDefs={this.columnDefs}
                defaultColDef={defaultColDef}
                gridStyle={{ height: 'auto' }}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                gridProps={{
                  context: this,
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  domLayout: 'autoHeight',
                  pinnedBottomRowData: bottomRowData(formik.values.newBaskets),
                  frameworkComponents: {
                    customPinnedRowRenderer: PinnedRowRenderer,
                  },
                  getRowStyle,
                }}
                rowData={formik.values.newBaskets}
                {...formik}
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
  // form: PropTypes.string,
};

export default compose(withStyles(style))(Section2);
