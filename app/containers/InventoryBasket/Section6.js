import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import PropTypes from 'prop-types';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import { TYPE_FORM } from './constants';
import { numberCurrency } from './Section4';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

export const defaultColDef = {
  suppressMovable: true,
};

const columnDefs = [
  {
    headerName: 'STT',
    field: 'index',
    width: 70,
    cellRendererFramework: orderNumberRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Mã Khay Sọt',
    field: 'basketCode',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketCode',
  },
  {
    headerName: 'Tên Khay Sọt',
    field: 'basketName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketName',
  },
  {
    headerName: 'SL Tồn Sổ Sách (1)',
    field: 'documentQuantity',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'documentQuantity',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'SL Đi Đường (2)',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    field: 'quantityByWay',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'quantityByWay',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Tổng SL Quản Lý Theo Sổ Sách (3) = (2) + (1)',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    field: 'totalDocumentQuantity',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'totalDocumentQuantity',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'SL KK (4)',
    field: 'stocktakingQuantity',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'stocktakingQuantity',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'SL Thực Xuất (5)',
    field: 'quantityActual',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'quantityActual',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Tổng KK Thực Tế (6) = (5) + (4)',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    field: 'totalQuantityStocktalkingReality',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'totalQuantityStocktalkingReality',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Chênh Lệch (7) = (6) - (3)',
    headerClass: 'ag-numeric-header',
    cellStyle: params => {
      if (params.data.quantityDifferenceReality < 0) {
        return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
      }
      if (params.data.quantityDifferenceReality > 0) {
        return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
      }
      return { textAlign: 'right' };
    },
    field: 'quantityDifferenceReality',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'quantityDifferenceReality',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Chênh KK Vật Lý (8) = (4) - (1)',
    headerClass: 'ag-numeric-header',
    cellStyle: params => {
      if (params.data.differenceStocktaking < 0) {
        return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
      }
      if (params.data.differenceStocktaking > 0) {
        return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
      }
      return { textAlign: 'right' };
    },
    field: 'differenceStocktaking',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'differenceStocktaking',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Chênh Lệch KK Đi Đường (9) = (5) - (2)',
    headerClass: 'ag-numeric-header',
    cellStyle: params => {
      if (params.data.differenceStocktakingByWay < 0) {
        return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
      }
      if (params.data.differenceStocktakingByWay > 0) {
        return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
      }
      return { textAlign: 'right' };
    },
    field: 'differenceStocktakingByWay',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'differenceStocktakingByWay',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
];

class Section6 extends React.PureComponent {
  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  render() {
    const { formik, section6, form } = this.props;

    const totalBottom = () => {
      let differenceStocktaking = 0;
      let quantityDifferenceReality = 0;
      let totalQuantityStocktalkingReality = 0;
      let quantityActual = 0;
      let stocktakingQuantity = 0;
      let totalDocumentQuantity = 0;
      let differenceStocktakingByWay = 0;
      let quantityByWay = 0;
      let documentQuantity = 0;

      section6.forEach(item => {
        differenceStocktaking += item.differenceStocktaking || 0;
        totalQuantityStocktalkingReality +=
          item.totalQuantityStocktalkingReality || 0;
        quantityActual += item.quantityActual || 0;
        stocktakingQuantity += item.stocktakingQuantity || 0;
        totalDocumentQuantity += item.totalDocumentQuantity || 0;
        quantityByWay += item.quantityByWay || 0;
        quantityDifferenceReality += item.quantityDifferenceReality || 0;
        differenceStocktakingByWay += item.differenceStocktakingByWay || 0;
        documentQuantity += item.documentQuantity || 0;
      });
      return [
        {
          totalCol: true,
          basketName: 'Tổng',
          differenceStocktaking,
          differenceStocktakingByWay,
          totalQuantityStocktalkingReality,
          quantityDifferenceReality,
          quantityActual,
          stocktakingQuantity,
          totalDocumentQuantity,
          quantityByWay,
          documentQuantity,
        },
      ];
    };

    return (
      <div>
        {form === TYPE_FORM.VIEW && (
          <React.Fragment>
            <Grid item xs={12}>
              <Expansion
                title="VI. Kết Quả Kiểm Kê Theo Mã Khay Sọt"
                content={
                  <FormData
                    name="resultStocktakingByBasket"
                    idGrid="section6"
                    rowData={section6}
                    gridStyle={{ height: 'auto' }}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    setFieldValue={formik.setFieldValue}
                    setFieldTouched={formik.setFieldTouched}
                    errors={formik.errors}
                    touched={formik.touched}
                    autoLayout
                    gridProps={{
                      context: this,
                      suppressScrollOnNewData: true,
                      suppressHorizontalScroll: true,
                      pinnedBottomRowData: totalBottom(),
                      frameworkComponents: {
                        customPinnedRowRenderer: PinnedRowRenderer,
                      },
                      domLayout: 'autoHeight',
                      onNewColumnsLoaded: this.onNewColumnsLoaded,
                      getRowStyle,
                    }}
                    {...formik}
                    onGridReady={this.onGridReady}
                  />
                }
              />
            </Grid>
            <StyledSpacingTop />
          </React.Fragment>
        )}
      </div>
    );
  }
}

Section6.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  section6: PropTypes.array,
};
export default Section6;
