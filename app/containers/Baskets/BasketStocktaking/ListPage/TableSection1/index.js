import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { withStyles, Button } from '@material-ui/core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import * as PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import FormDataFree from 'components/FormikUI/FormDataFree';
import * as selectors from '../selectors';
import * as actions from '../actions';
import appTheme from '../../../../App/theme';
import PinnedRowRenderer from '../../../../../components/FormikUI/PinnedRowRenderer';
import { defaultColDef } from '../../../../KS_Report/KS_BCKSDD/TableSection';
import { constSchema } from './schema';

const style = (theme = appTheme) => ({
  topToolbar: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  topButton: {
    color: theme.palette.primary.main,
    background: '#fff',
    boxShadow: `0 1px 3px #aaa`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
});

class TableSection extends Component {
  columnDefs = values => {
    const { pageIndex, pageSize } = values;
    const startIndex = pageIndex * pageSize;
    const cellStyle = params => {
      // eslint-disable-next-line radix
      if (parseInt(params.value) < 0) {
        return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
      }
      return { textAlign: 'right' };
    };
    return [
      {
        headerName: 'STT',
        field: 'indexOfAll',
        width: 50,
        pinned: 'left',
        lockPosition: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        startIndex: { startIndex },
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
        valueGetter(params) {
          const { totalCol } = params.data;
          const { rowIndex } = params.node;
          if (totalCol !== true) {
            return rowIndex + 1 + startIndex;
          }
          return null;
        },
      },
      {
        headerName: 'Mã biên bản kiểm kê',
        field: constSchema.basketStockTakingCode,
        width: 140,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinned: 'left',
        tooltipField: 'basketStockTakingCode',
      },
      {
        headerName: 'Trạng thái',
        field: constSchema.statusName,
        width: 100,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        tooltipField: 'statusName',
      },
      {
        headerName: 'Xử lý sau kiểm kê',
        field: constSchema.afterStatusName,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 140,
        tooltipField: 'afterStatusName',
      },
      {
        headerName: 'Ngày kiểm kê',
        field: constSchema.date,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 155,
        tooltipField: 'date',
      },
      {
        headerName: 'Mã khay sọt',
        field: constSchema.basketCode,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 130,
        tooltipField: 'basketCode',
      },
      {
        headerName: 'Tên khay sọt',
        field: constSchema.basketName,
        tooltipField: 'basketName',
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        width: 155,
      },
      {
        headerName: 'Đơn vị kiểm kê',
        field: constSchema.plantName,
        tooltipField: 'plantName',
        width: 140,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
      },
      {
        headerName: 'Kho',
        field: constSchema.basketLocatorCode,
        tooltipField: 'basketLocatorCode',
        width: 150,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'SL tồn kho sổ sách',
        field: constSchema.documentQuantity,
        cellStyle: params => cellStyle(params),
        tooltipField: 'documentQuantity',
        width: 135,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'SL kiểm kê',
        field: constSchema.stockTakingQuantity,
        cellStyle: params => cellStyle(params),
        tooltipField: 'stockTakingQuantity',
        width: 130,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Chênh lệch kiểm kê vật lý',
        field: constSchema.diffferenceQuantity,
        cellStyle: params => cellStyle(params),
        tooltipField: 'diffferenceQuantity',
        width: 160,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Loại kiểm kê',
        field: constSchema.stocktakingTypeName,
        tooltipField: 'stocktakingTypeName',
        width: 120,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
      },
      {
        headerName: 'Đợt kiểm kê',
        field: constSchema.stocktakingRound,
        tooltipField: 'stocktakingRound',
        width: 120,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
      },
    ];
  };

  onExportExcel = () => {
    const { submittedValues, formData, onExportExcel } = this.props;
    onExportExcel(submittedValues, formData);
  };

  printHandler = (formValues, formData) => {
    this.props.onPrint(formValues, formData, data => {
      const win = window.open('', 'win', 'width="100%",height="100%"');
      if (win === null)
        throw Object({
          message:
            'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
        });
      win.document.open('text/html', 'replace');
      win.document.write(data);
      win.document.close();
    });
  };

  onChangeRowsPerPage = pageSize => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    const submit = { ...submittedValues };
    if (submit.totalItem < (pageSize - 1) * submit.pageIndex) {
      submit.pageIndex = Math.ceil(submit.totalItem / pageSize) - 1;
    }
    submit.pageSize = pageSize;
    onSubmitForm(submit, formData);
  };

  onChangePage = pageIndex => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    const submit = { ...submittedValues };
    if (pageIndex !== submit.pageIndex) {
      submit.pageIndex = pageIndex;
      onSubmitForm(submit, formData);
    }
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  render() {
    const {
      classes,
      tableData,
      submittedValues,
      formData,
      totalRowData,
    } = this.props;
    const submittedvalues = { ...submittedValues };
    const topToolbar = (
      <div className={classes.topToolbar} style={{ paddingRight: 0 }}>
        <div className={classes.topToolbarPart}>
          <Button
            type="button"
            color="primary"
            className={classes.topButton}
            disabled={isEmpty(tableData)}
            onClick={this.onExportExcel}
          >
            Xuất excel
          </Button>
          <Button
            type="button"
            color="primary"
            className={classes.topButton}
            disabled={isEmpty(tableData)}
            onClick={() => this.printHandler(submittedvalues, formData)}
          >
            In báo cáo
          </Button>
        </div>
      </div>
    );
    return (
      <Expansion
        title="II. Thông Tin Khay Sọt Kiểm Kê"
        rightActions={topToolbar}
        content={
          <FormDataFree
            columnDefs={this.columnDefs(submittedvalues)}
            rowData={tableData}
            suppressRowTransform
            gridStyle={{ height: 385 }}
            customizePagination
            defaultColDef={defaultColDef}
            remotePagination
            totalCount={submittedvalues.totalItem || 0}
            pageIndex={submittedvalues.pageIndex || 0}
            onOrderChange={this.onOrderChange}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            pageSize={submittedvalues.pageSize}
            gridProps={{
              headerHeight: 35,
              pinnedBottomRowData: [totalRowData],
              frameworkComponents: {
                customPinnedRowRenderer: PinnedRowRenderer,
              },
              getRowStyle: params => {
                if (params.data.totalCol) {
                  return {
                    backgroundColor: appTheme.palette.background.default,
                  };
                }
                return { border: 'none', borderBottom: appTheme.shade.border };
              },
            }}
          />
        }
      />
    );
  }
}
TableSection.propTypes = {
  classes: PropTypes.object,
  onPrint: PropTypes.func,
  onExportExcel: PropTypes.func,
  submittedValues: PropTypes.object,
  tableData: PropTypes.array,
  onSubmitForm: PropTypes.func,
  formData: PropTypes.object,
  totalRowData: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  submittedValues: selectors.formSubmittedValues(),
  formData: selectors.formData(),
  formValues: selectors.formValues(),
  totalRowData: selectors.totalRowData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onPrint: (formValues, formData, callback) =>
      dispatch(actions.printSelected(formValues, formData, callback)),
    onExportExcel: (formValues, formData) =>
      dispatch(actions.exportExcel(formValues, formData)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(style()),
  withConnect,
  withImmutablePropsToJS,
)(TableSection);
