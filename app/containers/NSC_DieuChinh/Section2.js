import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { getIn } from 'formik';

import { withTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import MuiTable, { MuiTableBody } from 'components/MuiTable';

import { openPopup } from './actions';
import { connectContext } from './context';
import { makeSelectData } from './selectors';

import { TYPE_DIEUCHINH } from './constants';

export class Section2 extends React.Component {
  columns = [
    {
      title: 'STT',
      field: 'rowIndex',
      width: 50,
      render: rowData => this.renderNumberOrder(rowData),
    },
    {
      title: 'Mã PNK',
      field: 'documentCode',
    },
    {
      title: 'Trạng Thái',
      field: 'documentStatus',
    },
    {
      title: 'Loại Nhập Kho',
      field: 'documentSubType',
    },
    {
      title: 'Đơn Vị Giao Hàng',
      field: 'deliver',
    },
    {
      title: 'Đơn Vị Nhận Hàng',
      field: 'receiver',
    },
    {
      title: 'Ngày Nhập Kho',
      field: 'date',
      render: this.renderImportedDate,
    },
    {
      title: 'Mã Đi Hàng',
      field: 'productCode',
    },
    {
      title: 'Tên Sản Phẩm',
      field: 'productName',
    },
    {
      title: 'Batch',
      field: 'batch',
    },
    {
      title: 'Phân Loại Xử Lý',
      field: 'processingTypeName',
    },
    {
      title: 'Khối Lượng Giao',
      field: 'deliveryQuantity',
    },
    {
      title: 'Khối Lượng Nhận',
      field: 'receiveQuantity',
    },
    {
      title: 'Khối Lượng Chênh Lệch',
      field: 'differentQuantity',
    },
    {
      title: 'Tỷ Lệ Chênh Lệch',
      field: 'differentRatio',
    },
    {
      title: 'Trạng Thái Điều Chỉnh',
      field: 'differenceStatusName',
    },
    {
      title: '',
      width: 50,
      headerStyle: {
        padding: 0,
        textAlign: 'center',
      },
      cellStyle: {
        padding: 0,
        textAlign: 'center',
      },
      render: rowData => this.renderActions(rowData),
    },
  ];

  getPageSize() {
    return getIn(this.props.formik.values, 'pageSize', 0);
  }

  getPageIndex() {
    return getIn(this.props.formik.values, 'pageIndex', 0);
  }

  onPopupOpen = ({ documentCode }) => {
    this.props.onPopupOpen(documentCode);
  };

  onChangePage = pageIndex => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex,
    };
    this.props.context.onGetReceipts(nextValues);
  };

  onChangeRowsPerPage = pageSize => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex: 0,
      pageSize,
    };
    this.props.context.onGetReceipts(nextValues);
  };

  renderNumberOrder(rowData) {
    if (rowData.isMainRow) {
      const pageSize = this.getPageSize();
      const pageIndex = this.getPageIndex();

      const numberOrder = pageIndex * pageSize + rowData.rowIndex;
      return numberOrder;
    }
    return '';
  }

  renderImportedDate(rowData) {
    if (rowData.date) {
      return dateFns.format(new Date(rowData.date), 'dd/MM/yyyy');
    }
    return '';
  }

  renderActions(rowData) {
    if (rowData && rowData.receiptStatus === TYPE_DIEUCHINH.NOT_ADJUSTED) {
      return (
        <Tooltip title="Điều chỉnh">
          <IconButton onClick={() => this.onPopupOpen(rowData)}>
            <Icon fontSize="small">build</Icon>
          </IconButton>
        </Tooltip>
      );
    }
    return undefined;
  }

  render() {
    const { theme, formik, initialData } = this.props;
    const { pageSize, pageIndex, totalCount } = formik.values;

    return (
      <MuiTable
        data={initialData}
        columns={this.columns}
        options={{
          search: false,
          toolbar: false,
          sorting: false,
          pageSize,
          cellStyle: {
            borderBottom: 'none',
          },
          rowStyle: rowData => ({
            borderBottom:
              rowData && rowData.isLastRow ? theme.shade.border : 'none',
          }),
        }}
        totalCount={totalCount}
        initialPage={pageIndex}
        components={{
          Body: props => (
            <MuiTableBody {...props} renderData={initialData} currentPage={0} />
          ),
        }}
        onChangePage={this.onChangePage}
        onChangeRowsPerPage={this.onChangeRowsPerPage}
      />
    );
  }
}

Section2.propTypes = {
  theme: PropTypes.object.isRequired,
  formik: PropTypes.object,
  context: PropTypes.shape({
    onGetReceipts: PropTypes.func,
  }),
  initialData: PropTypes.array,
};

Section2.defaultProps = {
  initialData: [],
};

export const mapStateToProps = createStructuredSelector({
  initialData: makeSelectData('receipts'),
});

export const mapDispatchToProps = dispatch => ({
  onPopupOpen: documentId => dispatch(openPopup(documentId)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withTheme(),
  withConnect,
  withImmutablePropsToJS,
  connectContext,
)(Section2);
