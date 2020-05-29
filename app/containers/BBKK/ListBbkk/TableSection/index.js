import React, { PureComponent } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {
  Button,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Grid,
} from '@material-ui/core';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import MaterialTable from 'material-table';
import { MuiTableBody } from 'components/MuiTable';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import appTheme from 'containers/App/theme';
import Expansion from 'components/Expansion';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import { columnDefs } from './columnDef';
import * as makeSelect from '../selectors';
import DeleteConfirm from './ConfirmDeletionDialog';
import * as actions from '../actions';

const styles = theme => ({
  space: {
    marginTop: theme.spacing.unit * 4,
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
    // background: theme.palette.background.default,
    background: '#fff',
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 3}px`,
    boxShadow: `0 1px 3px #aaa`,
    '&:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
});

const muiThemeOptions = {
  border: false,
};

const muiTheme = (theme = appTheme, options = muiThemeOptions) =>
  createMuiTheme({
    ...theme,
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

class TableSection extends PureComponent {
  state = {
    openDialog: false,
    idForDeletion: null,
  };

  onCreate = () => {
    this.props.history.push(
      '/danh-sach-bien-ban-kiem-ke/tao-bien-ban-kiem-ke-khay-sot?form=1',
    );
  };

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, idForDeletion: doId });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, idForDeletion: null });
  };

  onSelectionChange = items => {
    const { submittedValues } = this.props;
    submittedValues.ids = items.map(item => item.id);
  };

  exportPdfHandler = () => {
    const { OnExportPdf, submittedValues } = this.props;
    OnExportPdf(submittedValues);
  };

  onExportExcel = () => {
    const { submittedValues, onExportExcel } = this.props;
    onExportExcel(submittedValues);
  };

  onDeleteRecord = id => {
    const { onDeleteRecord } = this.props;
    onDeleteRecord(id);
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onSubmitForm, submittedValues } = this.props;
    if (
      submittedValues.totalItem <=
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
    const tableColumns = columnDefs(formData);
    const column = tableColumns[orderBy];
    if (column && column.field) {
      if (column.field === 'statusName') {
        const sortOrder = `${orderDirection === 'asc' ? '' : '-'}status`;
        this.props.onChangeOrder(submittedValues, sortOrder);
      } else if (column.field === 'stocktakingTypeName') {
        const sortOrder = `${
          orderDirection === 'asc' ? '' : '-'
        }stocktakingType`;
        this.props.onChangeOrder(submittedValues, sortOrder);
      } else if (column.field === 'plantName') {
        const sortOrder = `${orderDirection === 'asc' ? '' : '-'}plantCode`;
        this.props.onChangeOrder(submittedValues, sortOrder);
      } else if (column.field === 'afterStatusName') {
        const sortOrder = `${orderDirection === 'asc' ? '' : '-'}afterStatus`;
        this.props.onChangeOrder(submittedValues, sortOrder);
      } else {
        const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
        this.props.onChangeOrder(submittedValues, sortOrder);
      }
    }
  };

  render() {
    const { classes, tableData, submittedValues } = this.props;
    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        onDeleteRecord={this.onDeleteRecord}
        idForDeletion={this.state.idForDeletion}
        // submittedValues={submittedValues}
      />
    );
    const tableColumn = columnDefs(this.handleDialogOpen);
    return (
      <Paper className={classes.space}>
        <Expansion
          title="II. Thông Tin Biên Bản Kiểm Kê"
          noPadding
          className={classes.topToolbar}
          rightActions={
            <Grid className={classes.topToolbarPart}>
              <Can do={CODE.taoDSBBKK} on={SCREEN_CODE.DSBBKK}>
                <Button
                  type="button"
                  color="primary"
                  className={classes.topButton}
                  onClick={this.onCreate}
                >
                  Tạo Mới
                </Button>
              </Can>
              <Button
                type="button"
                color="primary"
                className={classes.topButton}
                onClick={() => this.exportPdfHandler()}
                disabled={!tableData.length}
              >
                In BBKK
              </Button>
              <Button
                type="button"
                color="primary"
                className={classes.topButton}
                onClick={this.onExportExcel}
                disabled={!tableData.length}
              >
                Xuất Excel
              </Button>
            </Grid>
          }
          content={
            <MuiThemeProvider theme={muiTheme}>
              <MaterialTable
                columns={tableColumn}
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
                      rowsPerPage={submittedValues.pageSize}
                      count={submittedValues.totalItem}
                      onChangePage={this.onChangePage}
                      onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                  ),
                }}
                initialPage={submittedValues.pageIndex}
                options={{
                  headerStyle: {
                    background: appTheme.palette.background.head,
                    paddingTop: appTheme.spacing.unit,
                    paddingBottom: appTheme.spacing.unit,
                  },
                  rowStyle: {
                    paddingTop: appTheme.spacing.unit / 2,
                    paddingBottom: appTheme.spacing.unit / 2,
                  },
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  paging: true,
                  columnsButton: false,
                  exportButton: false,
                  pageSize: submittedValues.pageSize,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: true,
                  emptyRowsWhenPaging: false,
                  // doubleHorizontalScroll: true,
                  selection: true,
                }}
                onSelectionChange={this.onSelectionChange}
                onRowClick={(e, rowData) => {
                  this.props.history.push(
                    `/danh-sach-bien-ban-kiem-ke/xem-bien-ban-kiem-ke-khay-sot?form=3&id=${
                      rowData.id
                    }`,
                  );
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
          }
        />
        {deleteDialog}
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  tableData: PropTypes.array,
  submittedValues: PropTypes.object,
  OnExportPdf: PropTypes.func,
  onDeleteRecord: PropTypes.func,
  onExportExcel: PropTypes.func,
  onSubmitForm: PropTypes.func,
  onChangeOrder: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  // selectedRecords: makeSelect.tableSelectedRecords(),
  submittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    OnExportPdf: formValues => dispatch(actions.exportPdf(formValues)),
    onExportExcel: formValues => dispatch(actions.exportExcel(formValues)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onChangeOrder: (formValues, sort) =>
      dispatch(actions.onChangeOrder(formValues, sort)),
    onDeleteRecord: id => dispatch(actions.deleteRecord(id)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(styles),
)(TableSection);
