import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
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
import { constSchema } from '../TableSection1/schema';

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
        width: 135,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinned: 'left',
        tooltipField: 'basketStockTakingCode',
      },
      {
        headerName: 'Mã khay sọt',
        field: constSchema.basketCode,
        width: 105,
        pinned: 'left',
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        tooltipField: 'basketCode',
      },
      {
        headerName: 'Tên khay sọt',
        field: constSchema.basketName,
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        width: 140,
        pinned: 'left',
        tooltipField: 'basketName',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: {
          style: { fontWeight: 'bold' },
        },
      },
      {
        headerName: 'SL tồn sổ sách',
        field: constSchema.documentQuantity,
        tooltipField: 'documentQuantity',
        cellClass: 'ag-border-left',
        headerClass: 'ag-border-left',
        width: 120,
        cellStyle: params => cellStyle(params),
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'SL đi đường',
        field: constSchema.quantityByWay,
        tooltipField: 'quantityByWay',
        width: 120,
        cellStyle: params => cellStyle(params),
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Tổng SL quản lý theo sổ sách',
        field: constSchema.totalDocumentQuantity,
        tooltipField: 'totalDocumentQuantity',
        width: 180,
        cellStyle: params => cellStyle(params),
        headerClass: 'ag-border-left',
        cellClass: 'ag-border-left',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'SL kiểm kê',
        field: constSchema.stockTakingQuantity,
        cellStyle: params => cellStyle(params),
        tooltipField: 'stockTakingQuantity',
        width: 120,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'SL thực xuất',
        field: constSchema.actualQuantityExported,
        cellStyle: params => cellStyle(params),
        tooltipField: 'actualQuantityExported',
        width: 125,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Tổng kiểm kê thực tế',
        field: constSchema.actualStockTakingQuantity,
        cellStyle: params => cellStyle(params),
        tooltipField: 'actualStockTakingQuantity',
        width: 140,
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Chênh lệch',
        field: constSchema.difference,
        tooltipField: 'difference',
        width: 125,
        cellStyle: params => cellStyle(params),
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Chênh lệch kiểm kê vật lý',
        field: constSchema.diffferenceQuantity,
        tooltipField: 'diffferenceQuantity',
        width: 160,
        cellStyle: params => cellStyle(params),
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Chênh lệch kiểm kê đi đường',
        field: constSchema.stockTakingDifferenceByWay,
        tooltipField: 'stockTakingDifferenceByWay',
        width: 180,
        cellStyle: params => cellStyle(params),
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Abs chênh lệch',
        field: constSchema.absDifference,
        tooltipField: 'absDifference',
        width: 125,
        cellStyle: params => cellStyle(params),
        cellClass: 'ag-border-left-right',
        headerClass: 'ag-border-left-right',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
    ];
  };

  onChangeRowsPerPage = pageSize => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    const submit = { ...submittedValues };
    if (submit.totalItemBS < (pageSize - 1) * submit.pageIndex) {
      submit.pageIndex = Math.ceil(submit.totalItemBS / pageSize) - 1;
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

  render() {
    const { tableData, submittedValues, totalRowData } = this.props;
    const summit = { ...submittedValues };
    return (
      <Expansion
        title="III. Kết Quả Kiểm Kê Theo Mã Khay Sọt"
        content={
          <FormDataFree
            columnDefs={this.columnDefs(summit)}
            rowData={tableData}
            suppressRowTransform
            gridStyle={{ height: 385 }}
            customizePagination
            defaultColDef={defaultColDef}
            remotePagination
            totalCount={summit.totalItemBS || 0}
            pageIndex={summit.pageIndex || 0}
            onOrderChange={this.onOrderChange}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            pageSize={summit.pageSize}
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
  submittedValues: PropTypes.object,
  tableData: PropTypes.array,
  onSubmitForm: PropTypes.func,
  formData: PropTypes.object,
  totalRowData: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableBasketData(),
  submittedValues: selectors.formSubmittedValuesBasket(),
  formData: selectors.formData(),
  formValues: selectors.formValuesBasket(),
  totalRowData: selectors.totalRowBasketData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (formValuesBasket, formData) =>
      dispatch(actions.submitFormBasket(formValuesBasket, formData)),
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
