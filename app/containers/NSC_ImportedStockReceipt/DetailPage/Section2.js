import React from 'react';
import MuiTable from 'components/MuiTable';
import { FaBalanceScale } from 'react-icons/fa';
import Expansion from 'components/Expansion';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import {
  COMPLETED_WEIGHT_ITEM,
  GET_IMPORTED_STOCK_COMPLETE_STATUS,
} from './constants';
import { DELIVERY_ORDER_BUSSINES } from '../../App/constants';
import appTheme from '../../App/theme';
/* eslint-disable react/prefer-stateless-function */
export default class Section2 extends React.Component {
  redirect = rowData => {
    const { history, documentId, receiverCode, doType } = this.props;
    history.push(
      `/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${receiverCode
        .toString()
        .trim()}&documentId=${documentId}&productCode=${rowData.productCode ||
        ''}&finshedProductCode=${
        doType === DELIVERY_ORDER_BUSSINES
          ? rowData.finshedProductCode || ''
          : ''
      }&slotCode=${rowData.slotCode || ''}&processingType=${
        rowData.processingType !== 0 ? rowData.processingType || '' : 0
      }`,
    );
  };

  refreshWeight = rowData => {
    const { closeDialog, onRefreshWeight, doType } = this.props;
    closeDialog();
    const data = rowData;
    if (doType !== DELIVERY_ORDER_BUSSINES) data.finshedProductCode = '';
    onRefreshWeight(data);
  };

  render() {
    const { data, status, match, doType, formik } = this.props;
    const columns = [
      {
        title: 'STT',
        width: '15vw',
        render: rowData => rowData.index,
      },
      {
        title: `${
          // eslint-disable-next-line eqeqeq
          doType != DELIVERY_ORDER_BUSSINES ? 'Lệnh Sản Xuất' : 'Mã TP'
        }`,
        width: '25vw',
        render: rowData =>
          // eslint-disable-next-line eqeqeq
          doType != DELIVERY_ORDER_BUSSINES
            ? rowData.farmProductionOrder
            : rowData.finshedProductCode || '',
      },
      {
        title: 'Mã Đi Hàng',
        width: '20vw',
        render: rowData => rowData.productCode,
      },
      {
        title: 'Tên Sản Phẩm',
        width: '55vw',
        render: rowData => rowData.productName,
      },
      {
        title: 'Phân Loại xử lý',
        width: '25vw',
        render: rowData =>
          rowData.is_after === true ? (
            <strong>{rowData.processingTypeName}</strong>
          ) : (
            <span>{rowData.processingTypeName}</span>
          ),
      },
      {
        title: 'Tổng lượng dự kiến (kg)',
        width: '30vw',
        render: rowData =>
          rowData.is_after === true ? (
            <strong>{rowData.plannedTotalQuatity}</strong>
          ) : (
            <span>{rowData.plannedTotalQuatity}</span>
          ),
      },
      {
        title: 'Tổng lượng thực tế (kg)',
        width: '30vw',
        // sau khi trừ đi khấu trừ
        render: rowData =>
          rowData.is_after === true ? (
            <strong>{rowData.afterRecoveryQuantity}</strong>
          ) : (
            <span>{rowData.afterRecoveryQuantity}</span>
          ),
      },
      {
        title: 'Trạng Thái',
        width: '35vw',
        render: rowData => rowData.statusName,
      },
      {
        title: '',
        width: '15vw',
        render: rowData => {
          if (
            rowData.is_after !== true &&
            !formik.values.autoFlag &&
            rowData.status !== COMPLETED_WEIGHT_ITEM
          )
            return (
              <Can do={CODE.taoPCNK} on={SCREEN_CODE.IMPORT_STOCK}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Cân">
                    <IconButton
                      onClick={
                        match.path === '/danh-sach-phieu-can-nhap-kho'
                          ? () => this.redirect(rowData)
                          : () => this.refreshWeight(rowData)
                      }
                    >
                      <FaBalanceScale size={24} color="gray" />
                    </IconButton>
                  </Tooltip>
                </div>
              </Can>
            );
          return <div />;
        },
      },
    ];
    if (status === GET_IMPORTED_STOCK_COMPLETE_STATUS) {
      columns.pop();
    }
    return (
      <Expansion
        title="II. Thông Tin Cân Nhập Kho"
        noPadding
        content={
          <MuiTable
            data={data}
            columns={columns}
            options={{
              toolbar: false,
              rowStyle: row => ({
                backgroundColor: row.is_after
                  ? 'rgb(244, 245, 247)'
                  : appTheme.palette.white,
              }),
            }}
          />
        }
      />
    );
  }
}

Section2.propTypes = {
  data: PropTypes.array,
  status: PropTypes.number,
  documentId: PropTypes.number,
  doType: PropTypes.number,
  receiverCode: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object,
  formik: PropTypes.object,
  closeDialog: PropTypes.func,
  onRefreshWeight: PropTypes.func,
};
