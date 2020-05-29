import React from 'react';
import PropTypes from 'prop-types';
import { getRowStyle } from 'utils/index';
import { getIn } from 'formik';
import Typography from '@material-ui/core/Typography';

import Expansion from 'components/Expansion';

import FormData from 'components/FormikUI/FormData';
import { Link } from 'react-router-dom';

import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { groupBy } from 'lodash';
import styled from 'styled-components';
import { getTotalBaskets } from './section4Utils';
import { viewBasketLogic } from './basketLogicFunction';
export const orderNumberRenderer = ({ data, rowIndex }) =>
  data.totalCol ? '' : rowIndex + 1;

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;
const listTitle = {
  marginTop: 30,
  marginBottom: 30,
};
export class ShippingPartyInformation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.columnDefs = [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        cellRendererFramework: orderNumberRenderer,
      },
      {
        headerName: 'Mã',
        field: 'code',
        width: 120,
      },
      {
        headerName: 'Tên',
        field: 'name',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng',
        field: 'amount',
        width: 120,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng Thực Tế',
        field: 'amountReal',
      },
      {
        headerName: 'Đơn Vị Tính',
        field: 'unit',
        width: 120,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ];

    this.columnDefsBasket = [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        cellRendererFramework: orderNumberRenderer,
      },
      {
        headerName: 'Mã',
        field: 'basketCode',
        width: 100,
      },
      {
        headerName: 'Tên',
        field: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'SL Giao',
        field: 'deliverQuantity',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'SL Thực Tế',
        width: 100,
        field: 'receiverQuantity',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Đơn Vị Tính',
        field: 'basketUom',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ];
    this.columnDefDetails = [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        cellRendererFramework: orderNumberRenderer,
      },
      {
        headerName: 'Loại Phiếu',
        field: 'basketDocumentTypeName',
      },
      {
        headerName: 'Mã Phiếu',
        field: 'basketDocumentCode',
        width: 150,
        valueGetter: rowData => {
          if (rowData.data.status === 1 && rowData.data.type === 1) {
            const link = `/danh-sach-phieu-nhap-khay-sot/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${
              rowData.data.id
            }`;
            return (
              <Link
                to={link}
                style={{
                  textDecoration: 'none',
                  // color: 'black',
                }}
              >
                {rowData.data.basketDocumentCode}
              </Link>
            );
          }
          if (rowData.data.status !== 1 && rowData.data.type === 1) {
            const link = `/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot?form=3&id=${
              rowData.data.id
            }`;
            return (
              <Link
                to={link}
                style={{
                  textDecoration: 'none',
                  // color: 'black',
                }}
              >
                {rowData.data.basketDocumentCode}
              </Link>
            );
          }
          if (rowData.data.status === 1 && rowData.data.type === 2) {
            const link = `/danh-sach-phieu-xuat-kho-khay-sot/chinh-sua-phieu-xuat-kho-khay-sot?id=${
              rowData.data.id
            }&form=2&isCancelReceipt=false
            `;
            return (
              <Link
                to={link}
                style={{
                  textDecoration: 'none',
                  // color: 'black',
                }}
              >
                {rowData.data.basketDocumentCode}
              </Link>
            );
          }
          if (rowData.data.status !== 1 && rowData.data.type === 2) {
            const link = `/danh-sach-phieu-xuat-kho-khay-sot/xem-phieu-xuat-kho-khay-sot?id=${
              rowData.data.id
            }&form=3&isCancelReceipt=false
            `;
            return (
              <Link
                to={link}
                style={{
                  textDecoration: 'none',
                  // color: 'black',
                }}
              >
                {rowData.data.basketDocumentCode}
              </Link>
            );
          }
          return rowData.data.basketDocumentCode;
        },
      },
    ];
    this.gridOptions = { alignedGrids: [] };
    this.totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };
  }

  data = [];

  componentDidMount() {
    this.gridOptions.alignedGrids.push(this.totalOptions);
    this.totalOptions.alignedGrids.push(this.gridOptions);
  }

  isCreate = () => true;

  totalBaskets = getTotalBaskets(
    getIn(this.props.formik.values, 'basketsTrays', []),
  );

  getTotalBasketsTrays = () => {
    const result = [];
    const grouped = groupBy(this.props.formik.values.basketsTrays, 'unit');
    if (Object.keys(grouped).length === 1) {
      result.push({
        totalCol: true,
        name: 'Tổng',
        amount: sumBy(this.props.formik.values.basketsTrays, 'amount'),
        unit: this.props.formik.values.basketsTrays[0].unit,
      });
      return result;
    }
    if (Object.keys(grouped).length > 1) {
      result.push({
        totalCol: true,
        name: 'Tổng',
        amount: sumBy(this.props.formik.values.basketsTrays, 'amount'),
      });
      Object.keys(grouped).forEach(item => {
        result.push({
          totalCol: true,
          amount: sumBy(grouped[item], 'amount'),
          unit: item,
        });
      });
    }
    return result;
  };

  getTotalBasketInfo = () => {
    const result = [];
    const grouped = groupBy(this.props.formik.values.basketsInfor, 'basketUom');

    if (Object.keys(grouped).length === 1) {
      result.push({
        totalCol: true,
        basketName: 'Tổng',
        deliverQuantity: sumBy(
          this.props.formik.values.basketsInfor,
          'deliverQuantity',
        ),
        receiverQuantity: sumBy(
          this.props.formik.values.basketsInfor,
          'receiverQuantity',
        ),
        basketUom:
          this.props.formik.values.basketsTrays[0] &&
          this.props.formik.values.basketsTrays[0].basketUom,
      });
      return result;
    }
    if (Object.keys(grouped).length > 1) {
      result.push({
        totalCol: true,
        basketName: 'Tổng',
        deliverQuantity: sumBy(
          this.props.formik.values.basketsInfor,
          'deliverQuantity',
        ),
        receiverQuantity: sumBy(
          this.props.formik.values.basketsInfor,
          'receiverQuantity',
        ),
      });
      Object.keys(grouped).forEach(item => {
        result.push({
          totalCol: true,
          deliverQuantity: sumBy(grouped[item], 'deliverQuantity'),
          receiverQuantity: sumBy(grouped[item], 'receiverQuantity'),
          basketUom: item,
        });
      });
    }
    return result;
  };

  render() {
    const defaultColDef = {
      suppressMovable: true,
    };
    const defaultColDefDetail = {
      suppressMovable: true,
    };
    const { formik } = this.props;
    const isViewBasketDetails = viewBasketLogic(
      formik.values.doType,
      this.isCreate(),
    );
    return (
      <Expansion
        title="V. Thông Tin Khay Sọt"
        content={
          <>
            <FormData
              idGrid="grid-section5"
              name={isViewBasketDetails ? `basketsInfor` : `basketsTrays`}
              defaultColDef={defaultColDef}
              gridProps={{
                gridOptions: this.gridOptions,
                pinnedBottomRowData: isViewBasketDetails
                  ? this.getTotalBasketInfo()
                  : this.getTotalBasketsTrays(),
                frameworkComponents: {
                  customPinnedRowRenderer: PinnedRowRenderer,
                },
                getRowStyle,
              }}
              autoLayout
              columnDefs={
                isViewBasketDetails ? this.columnDefsBasket : this.columnDefs
              }
              {...formik}
            />
            <StyledSpacingTop />
            {isViewBasketDetails && (
              <div style={listTitle}>
                <div>
                  <Typography variant="h6" gutterBottom>
                    Danh sách phiếu nhập/xuất khay sọt
                  </Typography>
                </div>
                <FormData
                  // idGrid="grid-section5"
                  name="basketDocumentList"
                  columnDefs={this.columnDefDetails}
                  defaultColDef={defaultColDefDetail}
                  {...formik}
                />
              </div>
            )}
          </>
        }
      />
    );
  }
}

ShippingPartyInformation.propTypes = {
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default ShippingPartyInformation;
