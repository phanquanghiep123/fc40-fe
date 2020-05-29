import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Button,
  Typography,
  TablePagination,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import DialogUploadFile from '../../DiaLogs/DialogUploadFile';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
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

const muiThemeOptions = {
  border: false,
};

const muiTheme = (theme = appTheme, options = muiThemeOptions) =>
  createMuiTheme({
    overrides: {
      MuiCheckbox: {
        colorSecondary: {
          '&$checked': {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiTableRow: {
        head: {
          height: theme.spacing.unit * 6,
          '&:first-child': {
            borderTop: !options.border
              ? '1px solid rgba(224, 224, 224, 1)'
              : undefined,
          },
        },
      },
      MuiTableCell: {
        root: {
          // minWidth: '48px',
          border: options.border
            ? '1px solid rgba(224, 224, 224, 1)'
            : undefined,
          padding: `0 ${theme.spacing.unit * 1}px`,
          '&:first-child': {
            minWidth: theme.spacing.unit * 1.5,
          },
          '&:last-child': {
            paddingRight: theme.spacing.unit * 1.5,
          },
        },
      },
      MuiTableHead: {
        root: {
          background: theme.palette.background.head,
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: 'none',
        },
      },
      MuiToolbar: {
        root: {
          minHeight: '0 !important',
        },
      },
      MuiTypography: {
        h6: {
          display: 'none',
        },
      },
    },
  });

class TableSection extends Component {
  state = {
    openDlImport: false,
  };

  importHandler = () => {
    this.setState({ openDlImport: true });
  };

  closeImportDl = () => {
    this.setState({ openDlImport: false });
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onSubmitForm, submittedValues } = this.props;
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues);
  };

  onChangePage = (event, pageIndex) => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onSubmitForm, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { formData, submittedValues } = this.props;
    const tableColumns = makeTableColumns(formData);

    const column = tableColumns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      this.props.onChangeOrder(submittedValues, sortOrder);
    }
  };

  onExportExcel = () => {
    const { submittedValues, onExportExcel } = this.props;
    onExportExcel(submittedValues);
  };

  render() {
    const {
      classes,
      formData,
      tableData,
      submittedValues,
      ui,
      onSubmitFile,
      onSubmitFileSignalr,
      onSubmitForm,
      onDownloadSampleFile,
    } = this.props;
    const tableColumns = makeTableColumns(formData);
    const { org } = formData;
    const dialogUploadFile = this.state.openDlImport && (
      <DialogUploadFile
        ui={ui}
        openDl={this.state.openDlImport}
        onClose={this.closeImportDl}
        Regions={formData.RegionConsumeCode}
        onSubmitFile={onSubmitFile}
        onSubmitFileSignalr={onSubmitFileSignalr}
        onSubmitSuccess={onSubmitForm}
        submittedvalues={submittedValues}
        onDownloadSampleFile={onDownloadSampleFile}
        plans={org}
      />
    );
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Giá Phê Duyệt</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoGDPD} on={SCREEN_CODE.DSGDPD}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => this.importHandler()}
              className={classes.topButton}
            >
              Import
            </Button>
          </Can>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={isEmpty(tableData)}
            className={classes.topButton}
            onClick={() => this.onExportExcel()}
          >
            Xuất excel
          </Button>
        </div>
      </div>
    );

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            columns={tableColumns}
            data={tableData}
            components={{
              Row: MTableBodyRowCustomized,
              Body: props => (
                <MuiTableBody
                  {...props}
                  renderData={tableData}
                  currentPage={0}
                />
              ),
              Pagination: props => (
                <TablePagination
                  {...props}
                  page={submittedValues.pageIndex}
                  count={submittedValues.totalItem}
                  rowsPerPage={submittedValues.pageSize}
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
              ),
            }}
            initialPage={submittedValues.pageIndex}
            options={{
              headerStyle: {
                background: appTheme.palette.background.head,
              },
              toolbar: false,
              showTitle: false,
              search: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              pageSize: submittedValues.pageSize,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
            totalCount={submittedValues.totalItem}
            onOrderChange={this.onOrderChange}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            localization={{
              toolbar: {
                nRowsSelected: '{0} dòng được chọn',
              },
              pagination: {
                labelRowsSelect: 'dòng',
                labelDisplayedRows: '{from}-{to} trên {count}',
              },
              body: {
                emptyDataSourceMessage:
                  'Không tìm thấy kết quả nào để hiển thị',
              },
            }}
          />
        </MuiThemeProvider>
        {dialogUploadFile}
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  submittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onExportExcel: PropTypes.func,
  onSubmitFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onsignalRProcessing: PropTypes.func,
  onDownloadSampleFile: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  submittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    onExportExcel: formValues => dispatch(actions.exportExcel(formValues)),
    onSubmitFile: form => dispatch(actions.onSubmitFile(form)),
    onSubmitFileSignalr: (res, callback) =>
      dispatch(actions.submitFileSignalr(res, callback)),
    onsignalRProcessing: res => dispatch(actions.signalRProcessing(res)),
    onDownloadSampleFile: data => dispatch(actions.downloadSampleFile(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
