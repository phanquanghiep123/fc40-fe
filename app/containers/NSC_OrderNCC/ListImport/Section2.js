import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';
import { getIn } from 'formik';

import { withRouter } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import IconButton from '@material-ui/core/IconButton';

import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import MuiTable from 'components/MuiTable';

import { connectContext } from './context';
import { makeSelectData } from './selectors';

export class Section2 extends React.Component {
  columns = [
    {
      title: 'STT',
      width: 50,
      sorting: false,
      render: (rowData, _, rowIndex) =>
        this.renderNumberOrder(rowData, rowIndex),
    },
    {
      title: 'Tên File',
      field: 'fileName',
    },
    {
      title: 'Version',
      field: 'version',
    },
    {
      title: 'Vùng Sản Xuất',
      field: 'productionRegionName',
    },
    {
      title: 'Vùng Tiêu Thụ',
      field: 'consumeRegionName',
    },
    {
      title: 'Loại Đặt Hàng',
      field: 'importType',
    },
    {
      title: 'Ngày Đặt Hàng (Từ)',
      field: 'dateFrom',
      render: this.renderDate,
    },
    {
      title: 'Ngày Đặt Hàng (Đến)',
      field: 'dateTo',
      render: this.renderDate,
    },
    {
      title: 'Người Thực Hiện',
      field: 'userName',
    },
    {
      title: 'Thời Điểm Import',
      field: 'importDate',
      render: this.renderDateTime,
    },
    {
      title: 'Mail Đã Gửi',
      field: 'result',
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

  onGoMailSent(rowData) {
    if (rowData && rowData.id) {
      this.props.history.push(
        `/danh-sach-file-import-dat-hang-ncc/lich-su-gui-mail/${rowData.id}`,
      );
    }
  }

  onChangePage = pageIndex => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex,
    };
    this.props.context.onGetImportFiles(nextValues);
  };

  onChangeRowsPerPage = pageSize => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex: 0,
      pageSize,
    };
    this.props.context.onGetImportFiles(nextValues);
  };

  renderNumberOrder(rowData, rowIndex) {
    if (rowData) {
      const pageSize = this.getPageSize();
      const pageIndex = this.getPageIndex();
      return pageIndex * pageSize + rowIndex + 1;
    }
    return '';
  }

  renderDate(rowData) {
    if (rowData && rowData[this.field]) {
      return dateFns.format(new Date(rowData[this.field]), 'dd/MM/yyyy');
    }
    return '';
  }

  renderDateTime(rowData) {
    if (rowData && rowData[this.field]) {
      return dateFns.format(new Date(rowData[this.field]), 'dd/MM HH:mm:ss');
    }
    return '';
  }

  renderActions(rowData) {
    if (rowData && rowData.isSent) {
      return (
        <Can do={CODE.suaMailNCC} on={SCREEN_CODE.DHNCC}>
          <Tooltip title="Gửi email">
            <IconButton onClick={() => this.onGoMailSent(rowData)}>
              <Icon fontSize="small">mail</Icon>
            </IconButton>
          </Tooltip>
        </Can>
      );
    }
    return null;
  }

  render() {
    const { formik, initialData } = this.props;
    const { pageSize, pageIndex, totalCount } = formik.values;

    return (
      <MuiTable
        data={initialData}
        columns={this.columns}
        options={{
          search: false,
          toolbar: false,
          sorting: true,
          pageSize,
          pagingRemote: true,
        }}
        totalCount={totalCount}
        initialPage={pageIndex}
        onChangePage={this.onChangePage}
        onChangeRowsPerPage={this.onChangeRowsPerPage}
      />
    );
  }
}

Section2.propTypes = {
  history: PropTypes.object.isRequired,
  context: PropTypes.shape({
    onGetImportFiles: PropTypes.func,
  }),
  formik: PropTypes.object,
  initialData: PropTypes.array,
};

Section2.defaultProps = {
  initialData: [],
};

export const mapStateToProps = createStructuredSelector({
  initialData: makeSelectData('importFiles'),
});

const withConnect = connect(mapStateToProps);

export default compose(
  connectContext,
  withConnect,
  withRouter,
  withImmutablePropsToJS,
)(Section2);
