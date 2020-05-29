import React, { Component } from 'react';
import { get, isEmpty } from 'lodash';
import { withStyles, Button } from '@material-ui/core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import * as PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import FormDataFree from 'components/FormikUI/FormDataFree';
import { linksTo } from '../FormSection/linksTo';
import * as selectors from '../selectors';
import * as actions from '../actions';
import appTheme from '../../../../App/theme';
import { makeTableColumns } from './tableColumns';
import { Can } from '../../../../../authorize/ability-context';
import { CODE, SCREEN_CODE } from '../../../../../authorize/groupAuthorize';
import PinnedRowRenderer from '../../../../../components/FormikUI/PinnedRowRenderer';
import { constSchema } from './schema';
import { defaultColDef } from '../../../../KS_Report/KS_BCKSDD/TableSection';

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
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues, formData);
  };

  onChangePage = pageIndex => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    if (pageIndex !== submittedValues.pageIndex) {
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues, formData);
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
    const columns = get(this.props, 'columnsData', []);
    const lastColumns = [
      {
        headerName: 'Dự kiến đến',
        field: constSchema.expectedToCome,
        // headerClass: 'ag-header-group-cell-no-group',
        headerClass: 'ag-border-left ',
        cellClass: 'ag-border-left',
        cellStyle: {
          textAlign: 'right',
          padding: 0,
          height: 60,
        },
        width: 132,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
      {
        headerName: 'Tổng',
        field: constSchema.totalQuanty,
        headerClass: 'ag-border-left-right',
        cellClass: 'ag-border-left-right',
        cellStyle: {
          textAlign: 'right',
        },
        width: 132,
        resizable: false,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      },
    ];
    const tableColumn = makeTableColumns(columns);
    const tableColumns = [...tableColumn, ...lastColumns];
    const topToolbar = (
      <div className={classes.topToolbar} style={{ paddingRight: 0 }}>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.xemDSLSBCTKKS} on={SCREEN_CODE.DSLSBCTKKS}>
            <Link
              style={{ textDecoration: 'none', padding: 0 }}
              to={`${linksTo.runReport}?screen=3`}
            >
              <Button
                type="button"
                color="primary"
                className={classes.topButton}
              >
                Chạy báo cáo
              </Button>
            </Link>
          </Can>
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
            onClick={() => this.printHandler(submittedValues, formData)}
          >
            In báo cáo
          </Button>
        </div>
      </div>
    );
    return (
      <Expansion
        title="II. Báo Cáo Tồn Vật Lý Khay Sọt"
        rightActions={topToolbar}
        // numberHeight={529}
        content={
          <FormDataFree
            columnDefs={tableColumns}
            rowData={tableData}
            suppressRowTransform
            gridStyle={{ height: 385 }}
            customizePagination
            defaultColDef={defaultColDef}
            remotePagination
            totalCount={submittedValues.totalItem || 0}
            pageIndex={submittedValues.pageIndex || 0}
            onOrderChange={this.onOrderChange}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            pageSize={submittedValues.pageSize}
            gridProps={{
              headerHeight: 35,
              // suppressScrollOnNewData: true,
              // suppressHorizontalScroll: true,
              pinnedBottomRowData: totalRowData,
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
  columnsData: selectors.columnsData(),
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
