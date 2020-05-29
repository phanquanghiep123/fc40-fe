import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import {
  Button,
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import Expansion from 'components/Expansion';
import DeleteConfirm from './ConfirmDeletionDialog';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import { linksTo } from './linksTo';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { CREATE_NEW_IMPORT_BASKET_DOCUMENT } from '../constants';

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
      MuiTableCell: {
        root: {
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
      MuiButtonBase: {
        root: {
          padding: '.25rem !important',
        },
      },
    },
  });

class TableSection extends Component {
  state = {
    openDialog: false,
    doIdForDeletion: null,
    filterCol: {
      sortKey: null,
      sortType: 'asc',
    },
  };

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, doIdForDeletion: doId });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, doIdForDeletion: null });
  };

  /**
   * Export Excel with submittedValues by calling export API
   *
   * @param formSubmittedValues
   * @param filterColumn
   */
  exportExcelHandler = (formSubmittedValues, filterColumn) => {
    this.props.onExportExcel(formSubmittedValues, filterColumn);
  };

  /**
   * Print selected records
   */
  printHandler = selectedRows => {
    this.props.onPrintSelected(selectedRows, data => {
      const win = window.open('', 'win', 'width="100%",height="100%"'); // a window object
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

  /**
   * Weighing Handler
   * @param id
   */
  weighingHandler = id => {
    this.props.onRequestAutoCreate(id);
  };

  render() {
    const {
      classes,
      formData,
      tableData,
      formSubmittedValues,
      selectedRows,
      onDeleteRecord,
      onSelectionChange,
      onUpdateTableData,
    } = this.props;

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoBBGH} on={SCREEN_CODE.BBGH}>
            <Link
              to={linksTo.createDeliveryOrder}
              style={{ textDecoration: 'none' }}
            >
              <Button className={classes.topButton} color="primary">
                Tạo mới
              </Button>
            </Link>
          </Can>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => this.printHandler(selectedRows)}
          >
            In BBGH
          </Button>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() =>
              this.exportExcelHandler(formSubmittedValues, this.state.filterCol)
            }
            disabled={tableData.length === 0}
          >
            Tải Xuống
          </Button>
        </div>
      </div>
    );

    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        proceedDeletion={onDeleteRecord}
        doId={this.state.doIdForDeletion}
      />
    );

    const tableColumns = makeTableColumns(
      formData,
      this.handleDialogOpen,
      this.weighingHandler,
      this.props.onCreateNewImportBasketDocument,
      this.props.history,
      tableData,
    );

    return (
      <div>
        <Expansion
          title="II.Thông Tin Danh Sách"
          noPadding
          rightActions={topToolbar}
          content={
            <MuiThemeProvider theme={muiTheme}>
              <MaterialTable
                columns={tableColumns}
                data={tableData}
                components={{
                  Row: MTableBodyRowCustomized,
                }}
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
                  // toolbar: false,
                  showTitle: false,
                  search: false,
                  columnsButton: false,
                  exportButton: false,
                  selection: true,
                  pageSize: 5,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                }}
                onSelectionChange={data => {
                  onSelectionChange(data);
                }}
                onOrderChange={(orderBy, orderDirection) => {
                  const filteredCol = tableColumns[orderBy];
                  if (filteredCol) {
                    this.setState({
                      filterCol: {
                        sortKey: filteredCol.field,
                        sortType: orderDirection,
                      },
                    });
                  }
                }}
                onChangePage={() => {
                  onSelectionChange([]); // reset selected row collection
                  const updatedTableData = tableData.map(row => {
                    const newRow = { ...row };
                    newRow.tableData.checked = false;
                    return newRow;
                  });

                  onUpdateTableData(updatedTableData);
                }}
                // this is customized as double click, NOT single click as usual
                onRowClick={(event, rowData) => {
                  this.props.history.push(
                    `${linksTo.viewDeliveryOrder}${
                      rowData.doId ? rowData.doId : ''
                    }`,
                  );
                }}
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
                      'Không tìm thấy biên bản nào để hiển thị',
                  },
                }}
              />
            </MuiThemeProvider>
          }
        />
        {deleteDialog}
      </div>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  history: PropTypes.object,
  onCreateNewImportBasketDocument: PropTypes.func,
  onDeleteRecord: PropTypes.func,
  onExportExcel: PropTypes.func,
  onPrintSelected: PropTypes.func,
  onRequestAutoCreate: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  selectedRows: PropTypes.array,
  tableData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  tableData: selectors.tableData(),
  selectedRows: selectors.tableSelectedRows(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    onDeleteRecord: id => dispatch(actions.deleteRecord(id)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onPrintSelected: (selectedRows, callback) =>
      dispatch(actions.printSelected(selectedRows, callback)),
    onExportExcel: (formSubmittedValues, filterColumn) =>
      dispatch(actions.exportExcel(formSubmittedValues, filterColumn)),
    onRequestAutoCreate: id => dispatch(actions.requestAutoCreate(id)),
    onCreateNewImportBasketDocument: payload =>
      dispatch({ type: CREATE_NEW_IMPORT_BASKET_DOCUMENT, payload }),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
