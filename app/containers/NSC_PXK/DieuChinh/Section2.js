import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { buildRequestId } from 'utils/notificationUtils';

import MuiButton from 'components/MuiButton';
import MuiTable, { MuiTableBody } from 'components/MuiTable';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import {
  openPopup,
  checkBlock,
  modifyAuto,
  signalRProcessing,
  getDeliData,
} from './actions';
import { makeSelectData, makeSelectFormSearch } from './selectors';
import { receiptsRoutine } from './routines';

import { TYPE_PXK } from '../PXK/constants';

import baseStyles from './styles';
import { EXPORT_EXCEL } from './constants';
export const styles = theme => ({
  ...baseStyles(theme),
  cardContent: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
  },
});

export const muiThemeTable = theme =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiPaper: {
        elevation2: {
          boxShadow: 'none',
        },
      },
      MuiTableRow: {
        head: {
          height: 0,
        },
      },
    },
  });

export class Section2 extends React.Component {
  columns = [
    {
      title: 'STT',
      width: 50,
      render: rowData => this.renderNumberOrder(rowData),
    },
    {
      title: 'Mã Kế Hoạch',
      field: 'planningCode',
      width: 100,
    },
    {
      title: 'Mã Bán Hàng',
      field: 'productCode',
      width: 100,
    },
    {
      title: 'Tên Sản Phẩm',
      field: 'productName',
      width: '15vw',
    },
    {
      title: 'Mã Farm/NCC',
      field: 'receiverCode',
      width: 100,
    },
    {
      title: 'Tên Farm/NCC',
      field: 'receiverName',
      width: '10vw',
    },
    {
      title: 'Đơn Vị Tính',
      field: 'uom',
    },
    {
      title: 'SL Xuất Thực Tế',
      field: 'deliveryQuantity',
    },
    {
      title: 'SL Chia Chọn',
      field: 'pickingQuantity',
    },
    {
      title: 'SL Chêch Lệch',
      field: 'differentQuantity',
    },
    {
      title: 'Tỷ Lệ Chêch Lệch',
      field: 'differentRatioString',
      render: this.renderDifferentRatio,
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

  requestId = buildRequestId();

  componentDidMount() {
    window.signalR.on('MessageNotification', this.onSignalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.onSignalRProcessing);
  }

  getPageSize() {
    return getIn(this.props.formik.values, 'pageSize', 0);
  }

  getPageIndex() {
    return getIn(this.props.formik.values, 'pageIndex', 0);
  }

  onPopupOpen = rowData => {
    const { plantCode, plantName, processDate } = this.props.formik.values;
    const { productCode, receiverCode, receiverName } = rowData;

    this.props.onPopupOpen({
      plantCode,
      plantName,
      productCode,
      receiverCode,
      receiverName,
      processDate,
    });
  };

  onCreatePXK = () => {
    const { plantCode } = this.props.formik.values;

    this.props.history.push(
      `/tao-phieu-xuat-kho?form=1&type=${
        TYPE_PXK.PXK_XUAT_BAN
      }&plantId=${plantCode}`,
    );
  };

  onCheckBlock = () => {
    if (this.props.formik.isValid) {
      const params = {
        ...this.props.formik.values,
        requestId: this.requestId,
      };
      this.props.onCheckBlock(params);
    }
  };

  onModifyAuto = () => {
    if (this.props.formik.isValid) {
      this.props.onModifyAuto(this.props.formik.values, () => {
        this.onGetReceipts();
      });
    }
  };

  onChangePage = pageIndex => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex,
    };
    this.onGetReceipts(nextValues);
  };

  onChangeRowsPerPage = pageSize => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex: 0,
      pageSize,
    };
    this.onGetReceipts(nextValues);
  };

  onGetReceipts = (values = this.props.formik.values) => {
    this.props.onGetReceipts(values);
  };

  onSignalRProcessing = response => {
    this.props.onSignalRProcessing(this.requestId, response);
  };

  renderNumberOrder(rowData) {
    if (rowData && !rowData.isTotal && rowData.tableData) {
      const pageSize = this.getPageSize();
      const pageIndex = this.getPageIndex();
      return pageIndex * pageSize + rowData.tableData.id + 1;
    }
    return null;
  }

  renderDifferentRatio(rowData) {
    if (rowData) {
      return (
        <span style={rowData.isModify ? { color: '#f00000' } : {}}>
          {rowData[this.field]}
        </span>
      );
    }
    return null;
  }

  renderActions(rowData) {
    if (rowData && rowData.isModify) {
      return (
        <Can do={CODE.suaDLDCCCTT} on={SCREEN_CODE.DLDCCCTT}>
          <IconButton
            title="Điều chỉnh"
            onClick={() => this.onPopupOpen(rowData)}
            disabled={!this.props.isAllowModify}
          >
            <Icon fontSize="small">build</Icon>
          </IconButton>
        </Can>
      );
    }
    return null;
  }

  /**
   * Lấy dữ liệu Deli
   */
  onGetDeliData = () => {
    const { formSearch, onGetDeliData } = this.props;
    onGetDeliData(formSearch);
  };

  render() {
    const {
      classes,
      formik,
      totalData,
      initialData,
      isAllowModify,
      onExportExcel,
    } = this.props;
    const { pageSize, pageIndex, totalCount } = formik.values;

    return (
      <Card className={classes.section}>
        <CardHeader
          title={
            <Grid container justify="space-between">
              <Grid item>Thông Tin Dữ Liệu Điều Chỉnh</Grid>
              <Grid item>
                <Grid container spacing={8}>
                  <Grid item>
                    <MuiButton outline onClick={onExportExcel}>
                      Xuất Excel
                    </MuiButton>
                  </Grid>
                  <Can do={CODE.suaDLDCCCTT} on={SCREEN_CODE.DLDCCCTT}>
                    <Grid item>
                      <MuiButton outline onClick={this.onCheckBlock}>
                        Check Kênh, Giá Bán
                      </MuiButton>
                    </Grid>
                    <Grid item>
                      <MuiButton
                        outline
                        onClick={this.onModifyAuto}
                        disabled={!isAllowModify}
                      >
                        Điều Chỉnh Chênh Lệch Tự Động
                      </MuiButton>
                    </Grid>
                    <Grid item>
                      <MuiButton outline onClick={this.onCreatePXK}>
                        Tạo Phiếu Xuất Kho
                      </MuiButton>
                    </Grid>
                    <Grid item>
                      <MuiButton outline onClick={this.onGetDeliData}>
                        Lấy Dữ Liệu Deli
                      </MuiButton>
                    </Grid>
                  </Can>
                </Grid>
              </Grid>
            </Grid>
          }
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <MuiThemeProvider theme={muiThemeTable}>
            <MuiTable
              data={[
                {
                  isTotal: true,
                  uom: 'Tổng',
                  ...totalData,
                },
              ]}
              columns={this.columns}
              options={{
                search: false,
                paging: false,
                toolbar: false,
                sorting: false,
                cellStyle: {
                  borderBottom: 'none',
                },
                headerStyle: {
                  visibility: 'hidden',
                  borderBottom: 'none',
                },
              }}
            />
          </MuiThemeProvider>
          <MuiTable
            data={initialData}
            columns={this.columns}
            options={{
              search: false,
              toolbar: false,
              sorting: false,
              pageSize,
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
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    );
  }
}

Section2.propTypes = {
  history: PropTypes.object.isRequired,
  totalData: PropTypes.object,
  initialData: PropTypes.array,
  formSearch: PropTypes.object,
  onPopupOpen: PropTypes.func,
  onCheckBlock: PropTypes.func,
  onModifyAuto: PropTypes.func,
  onGetReceipts: PropTypes.func,
  onSignalRProcessing: PropTypes.func,
  onGetDeliData: PropTypes.func,
  isAllowModify: PropTypes.bool,
  onExportExcel: PropTypes.func,
};

Section2.defaultProps = {
  totalData: {},
  initialData: [],
};

export const mapStateToProps = createStructuredSelector({
  totalData: makeSelectData('receipts', 'total'),
  initialData: makeSelectData('receipts'),
  isAllowModify: makeSelectData('receipts', 'isAllowModify'),
  formSearch: makeSelectFormSearch(),
});

export const mapDispatchToProps = dispatch => ({
  onPopupOpen: params => dispatch(openPopup(params)),
  onGetReceipts: params => dispatch(receiptsRoutine.request({ params })),
  onCheckBlock: params => dispatch(checkBlock(params)),
  onModifyAuto: (params, callback) => dispatch(modifyAuto(params, callback)),
  onSignalRProcessing: (requestId, response) =>
    dispatch(signalRProcessing(requestId, response)),
  onGetDeliData: formValues => dispatch(getDeliData(formValues)),
  onExportExcel: payload => dispatch({ type: EXPORT_EXCEL, payload }),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withRouter,
  withConnect,
  withImmutablePropsToJS,
)(Section2);
