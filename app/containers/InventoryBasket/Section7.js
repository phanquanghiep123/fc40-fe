import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import PropTypes from 'prop-types';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import { Link } from 'react-router-dom';
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
    width: 50,
    cellRendererFramework: orderNumberRenderer,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Mã Phiếu',
    field: 'basketDocumentCode',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketDocumentCode',
    valueGetter: params => {
      // Phiếu nhập
      if (params.data.documentType && params.data.documentType === 1) {
        return (
          <Link
            to={`/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot?form=3&id=${
              params.data.id
            }`}
            style={{ textDecoration: 'none' }}
          >
            {params.data.basketDocumentCode}
          </Link>
        );
      }

      // Phiếu xuất
      if (params.data.documentType && params.data.documentType === 2) {
        return (
          <Link
            to={`/danh-sach-phieu-xuat-kho-khay-sot/xem-phieu-xuat-kho-khay-sot?form=3&id=${
              params.data.id
            }&isCancelReceipt=false`}
            style={{ textDecoration: 'none' }}
          >
            {params.data.basketDocumentCode}
          </Link>
        );
      }

      // Phiếu thanh lý hủy
      return (
        <Link
          to={`/danh-sach-phieu-yeu-cau-huy/xem-phieu-yeu-cau-huy/${
            params.data.id
          }?isBasket=true`}
          style={{ textDecoration: 'none' }}
        >
          {params.data.basketDocumentCode}
        </Link>
      );
    },
  },
  {
    headerName: 'Loại Phiếu',
    field: 'basketDocumentTypeName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'basketDocumentTypeName',
  },
  {
    headerName: 'Trạng Thái',
    field: 'statusName',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'statusName',
    cellStyle: context => ({
      color: context.data.status === 0 ? 'red' : '',
      fontWeight: context.data.status === 0 ? 'bold' : '',
    }),
  },
  {
    headerName: 'Ngày Điều Chỉnh',
    field: 'date',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'date',
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
    headerName: 'Số Lượng',
    field: 'quantity',
    headerClass: 'ag-numeric-header',
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    tooltipField: 'quantity',
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
];

class Section7 extends React.PureComponent {
  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  render() {
    const { formik, section7, form } = this.props;

    const totalBottom = () => {
      let quantity = 0;
      section7.forEach(item => {
        quantity += item.quantity || 0;
      });
      return [
        {
          totalCol: true,
          basketName: 'Tổng',
          quantity,
        },
      ];
    };
    const arrNotice = [];
    section7.forEach(item => {
      if (!item.subType && item.status === 0) {
        arrNotice.push(item);
      }
    });
    return (
      <div>
        {form === TYPE_FORM.VIEW && (
          <React.Fragment>
            <Grid item xs={12}>
              <Expansion
                title="VII. Xử Lý Sau Kiểm Kê"
                content={
                  <React.Fragment>
                    {arrNotice.length > 0 && (
                      <p
                        style={{
                          color: 'red',
                          marginBottom: 10,
                          marginTop: -14,
                        }}
                      >
                        PYCH cần phải thực hiện xuất hủy để hoàn thành xử lý sau
                        kiểm kê của BBKK
                      </p>
                    )}

                    <FormData
                      name="handleAfterStocktaking"
                      idGrid="section7"
                      rowData={section7}
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
                  </React.Fragment>
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

Section7.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  section7: PropTypes.array,
};
export default Section7;
