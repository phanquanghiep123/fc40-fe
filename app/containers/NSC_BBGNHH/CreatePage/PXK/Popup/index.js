import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';
import { connect as connectFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';

import MuiTable, { MuiTableBody } from 'components/MuiTable';
import { difference } from 'components/MuiTable/utils';

import { closeDialog } from 'containers/App/actions';

import MuiButton from 'components/MuiButton';

import { makeSelectData } from '../../selectors';
import { exportReceiptsRoutine } from '../../routines';

import { transformExportReceiptCodes } from '../../utils';

import baseStyles from '../../styles';

export const styles = theme => ({
  ...baseStyles(theme),
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    width: 150,
  },
});

export class Popup extends React.Component {
  state = {
    initialData: this.getData(this.props.initialData),
  };

  columns = [
    {
      title: 'Mã PXK',
      field: 'stockExportReceiptCode',
    },
    {
      title: 'Mã Khách Hàng',
      field: 'customerCode',
    },
    {
      title: 'Khách Hàng',
      field: 'customerName',
    },
    {
      title: 'Ngày Xuất Hàng',
      field: 'deliveryDate',
      render: this.renderDate,
    },
    {
      title: 'Mã PXKS Cho Mượn',
      field: 'basketDocumentCode',
    },
  ];

  selectedData = [];

  componentWillReceiveProps(nextProps) {
    if (difference(this.props.initialData, nextProps.initialData)) {
      this.setState(
        { initialData: this.getData(nextProps.initialData) },
        () => {
          this.selectedData = [];
        },
      );
    }
  }

  getData(datas) {
    if (datas && datas.length > 0) {
      return datas.slice();
    }
    return [];
  }

  onEnteredDialog = () => {
    this.onGetExportReceipts();
  };

  onSelectionSuccess = () => {
    this.props.onCloseDialog();
    this.props.onSelectionSuccess(this.selectedData);
  };

  onChangePage = pageIndex => {
    const updaterValues = {
      pageIndex,
    };
    this.onGetExportReceipts(updaterValues);
  };

  onSelectionChange = selectedData => {
    this.selectedData = selectedData;
  };

  onChangeRowsPerPage = pageSize => {
    const updaterValues = {
      pageIndex: 0,
      pageSize,
    };
    this.onGetExportReceipts(updaterValues);
  };

  onGetExportReceipts = (updaterValues = {}) => {
    const { formik, pageSize, pageIndex, totalCount } = this.props;
    const {
      deliverCode,
      deliveryDate,
      deliveryReceiptStockExports,
    } = formik.values;

    const exceiptStockExportReceiptCodes = transformExportReceiptCodes(
      deliveryReceiptStockExports,
    );

    const nextValues = {
      pageSize,
      pageIndex,
      totalCount,
      deliverCode,
      deliveryDate,
      exceiptStockExportReceiptCodes,
      ...updaterValues,
    };
    this.props.onGetExportReceipts(nextValues);
  };

  renderDate(rowData) {
    if (rowData && rowData[this.field]) {
      return dateFns.format(new Date(rowData[this.field]), 'dd/MM/yyyy');
    }
    return '';
  }

  render() {
    const { initialData } = this.state;
    const { classes, ui, pageSize, pageIndex, totalCount } = this.props;

    return (
      <ui.Dialog
        {...ui.props}
        title="Danh Sách Phiếu Xuất Kho"
        content={
          <MuiTable
            data={initialData}
            columns={this.columns}
            options={{
              search: false,
              toolbar: false,
              sorting: false,
              pageSize,
              selection: true,
            }}
            totalCount={totalCount}
            initialPage={pageIndex}
            components={{
              Body: props => (
                <MuiTableBody
                  {...props}
                  renderData={initialData}
                  currentPage={0}
                />
              ),
            }}
            onChangePage={this.onChangePage}
            onSelectionChange={this.onSelectionChange}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
        }
        maxWidth="lg"
        fullWidth
        isDialog={false}
        keepMounted={false}
        suppressClose
        customActionDialog={
          <DialogActions className={classes.actionButtons}>
            <MuiButton
              outline
              className={classes.button}
              onClick={this.props.onCloseDialog}
            >
              Hủy Bỏ
            </MuiButton>
            <MuiButton
              className={classes.button}
              onClick={this.onSelectionSuccess}
            >
              Chọn PXK
            </MuiButton>
          </DialogActions>
        }
        onEnteredDialog={this.onEnteredDialog}
      />
    );
  }
}

Popup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  formik: PropTypes.object,
  pageSize: PropTypes.number,
  pageIndex: PropTypes.number,
  totalCount: PropTypes.number,
  initialData: PropTypes.array,
  onCloseDialog: PropTypes.func,
  onSelectionSuccess: PropTypes.func,
  onGetExportReceipts: PropTypes.func,
};

Popup.defaultProps = {
  pageSize: 0,
  pageIndex: 0,
  totalCount: 0,
  initialData: [],
};

const mapStateToProps = createStructuredSelector({
  pageSize: makeSelectData('exportReceipts', 'pageSize'),
  pageIndex: makeSelectData('exportReceipts', 'pageIndex'),
  totalCount: makeSelectData('exportReceipts', 'totalCount'),
  initialData: makeSelectData('exportReceipts'),
});

export const mapDispatchToProps = dispatch => ({
  onCloseDialog: () => dispatch(closeDialog()),
  onGetExportReceipts: params =>
    dispatch(exportReceiptsRoutine.request({ params })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  connectFormik,
  withImmutablePropsToJS,
)(Popup);
