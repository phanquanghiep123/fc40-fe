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
    headerName: 'Mã PXKS',
    field: 'basketDocumentCodeExport',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketDocumentCodeExport',
  },
  {
    headerName: 'Đơn Vị Nhận',
    field: 'receiverName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'receiverName',
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
    headerName: 'SL Đi Đường',
    field: 'quantityByWay',
    tooltipField: 'quantityByWay',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
];

const columnDefsView = [
  {
    headerName: 'STT',
    field: 'index',
    width: 70,
    cellRendererFramework: orderNumberRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Mã BBGH',
    field: 'deliveryOrderCode',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'deliveryOrderCode',
  },
  {
    headerName: 'Mã PXKS',
    field: 'basketDocumentCodeExport',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketDocumentCodeExport',
  },
  {
    headerName: 'Đơn Vị Nhận',
    field: 'receiverName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'receiverName',
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
    headerName: 'SL Đi Đường',
    field: 'quantityByWay',
    tooltipField: 'quantityByWay',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'SL Thực Xuất',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    field: 'quantityActual',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'quantityActual',
  },
  {
    headerName: 'Chênh Lệch',
    field: 'quantityDifference',
    headerClass: 'ag-numeric-header',
    tooltipField: 'quantityDifference',
    cellStyle: params => {
      if (params.data.quantityDifference < 0) {
        return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
      }
      if (params.data.quantityDifference > 0) {
        return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
      }
      return { textAlign: 'right' };
    },
    valueGetter: params =>
      (params.data.quantityActual || 0) - (params.data.quantityByWay || 0),
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Trạng Thái',
    field: 'statusName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'statusName',
  },
];

class Section5 extends React.PureComponent {
  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  render() {
    const { formik, section5, form } = this.props;
    const totalBottom = () => {
      let quantityDifference = 0;
      let quantityActual = 0;
      let quantityByWay = 0;

      section5.forEach(item => {
        quantityDifference += item.quantityDifference || 0;
        quantityActual += item.quantityActual || 0;
        quantityByWay += item.quantityByWay || 0;
      });
      return [
        {
          totalCol: true,
          basketName: 'Tổng',
          quantityDifference,
          quantityActual,
          quantityByWay,
        },
      ];
    };

    return (
      <div>
        <Grid item xs={12}>
          <Expansion
            title="V. Thông Tin Khay Sọt Đi Đường"
            content={
              <FormData
                name="infoBasketByWayStocktaking"
                idGrid="section5"
                rowData={section5}
                gridStyle={{ height: 'auto' }}
                columnDefs={
                  form === TYPE_FORM.VIEW ? columnDefsView : columnDefs
                }
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
      </div>
    );
  }
}

Section5.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  section5: PropTypes.array,
};
export default Section5;
