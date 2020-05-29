import React from 'react';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import { Grid, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { orderNumberRenderer } from './Section1';
import style from './style';

// eslint-disable-next-line react/prefer-stateless-function
class Section4 extends React.PureComponent {
  columnDefs = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 80,
      cellRendererFramework: orderNumberRenderer,
    },
    {
      headerName: 'Loại Phiếu',
      field: 'type',
      tooltipField: 'type',
      width: 120,
    },
    {
      headerName: 'Mã Phiếu',
      field: 'code',
      tooltipField: 'code',
      width: 120,
      valueGetter: rowData => (
        <div>
          {rowData.data.check === 1 && (
            <Link
              to={`/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot?form=3&id=${
                rowData.data.id
              }`}
              style={{
                textDecoration: 'none',
              }}
            >
              {rowData.data.code}
            </Link>
          )}
          {rowData.data.check === 3 && (
            <Link
              to={`/danh-sach-phieu-xuat-kho-khay-sot/xem-phieu-xuat-kho-khay-sot?form=3&id=${
                rowData.data.id
              }`}
              style={{
                textDecoration: 'none',
              }}
            >
              {rowData.data.code}
            </Link>
          )}
          {rowData.data.check === 2 && (
            <Link
              to={`/danh-sach-phieu-yeu-cau-huy/xem-phieu-yeu-cau-huy/${
                rowData.data.id
              }?isBasket=true`}
              style={{
                textDecoration: 'none',
              }}
            >
              {rowData.data.code}
            </Link>
          )}
        </div>
      ),
    },
    {
      headerName: 'Trạng Thái',
      field: 'statusName',
      tooltipField: 'statusName',
      cellStyle: context => ({
        color: context.data.status === 0 ? 'red' : '',
        fontWeight: context.data.status === 0 ? 'bold' : '',
      }),
    },
  ];

  render() {
    const { classes, formik } = this.props;
    const arrNotice = [];
    formik.values.documents.forEach(item => {
      if (item.check === 2 && item.status === 0) {
        arrNotice.push(item);
      }
    });
    return (
      <div className={classes.actions}>
        <Expansion
          title="IV.Danh Sách Phiếu"
          content={
            <Grid>
              {arrNotice.length > 0 && (
                <p
                  style={{
                    color: 'red',
                    marginBottom: 10,
                    marginTop: -14,
                  }}
                >
                  PYCH cần phải thực hiện xuất hủy để hoàn thành xử lý sau kiểm
                  kê của BBKK
                </p>
              )}
              <FormData
                idGrid="grid-section4"
                name="listDocument"
                columnDefs={this.columnDefs}
                gridStyle={{ height: 'auto' }}
                rowData={formik.values.documents}
                gridProps={{
                  context: this,
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  domLayout: 'autoHeight',
                }}
              />
            </Grid>
          }
        />
      </div>
    );
  }
}

Section4.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
};

export default compose(withStyles(style))(Section4);
