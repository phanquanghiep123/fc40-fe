import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  Typography,
  Button,
} from '@material-ui/core';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import * as selectors from '../selectors';
import * as actions from '../actions';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import DeleteConfirm from './ConfirmDeletionDialog';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import { linksTo } from './linksTo';
import MuiTable from '../../../../components/MuiTable/MuiTable';
import MuiTableBody from '../../../../components/MuiTable/MuiTableBody';
import MTablePagingCustomized from '../../../../components/MuiTable/MTablePagingCustomized';

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

const muiTheme = (theme = appTheme) =>
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
          background: '#000 !important',
          // borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      MuiTableCell: {
        root: {
          padding: `0 ${theme.spacing.unit}px`,
          '&:first-child': {
            paddingLeft: theme.spacing.unit * 2,
          },
          '&:last-child': {
            paddingRight: theme.spacing.unit * 1.5,
          },
        },
      },
      MuiTableHead: {
        root: {
          background: '#000 !important',
          // background: theme.palette.background.head,
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

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  state = {
    openDialog: false,
    idForDeletion: undefined,
    isBasket: undefined,
  };

  handleDialogOpen = (receiptCode, isBasket) => {
    this.setState({
      openDialog: true,
      idForDeletion: receiptCode,
      isBasket,
    });
  };

  handleDialogClose = () => {
    this.setState({
      openDialog: false,
      idForDeletion: undefined,
      isBasket: undefined,
    });
  };

  printHandler = selectedRecords => {
    this.props.onPrintSelected(selectedRecords, data => {
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

  render() {
    const {
      onDeleteRecord,
      classes,
      tableData,
      selectedRecords,
      onSelectionChange,
      onUpdateTableData,
      onExportExcel,
      formSubmittedValues,
      onSubmitForm,
    } = this.props;

    // const tableData = demoData.demoTableData;
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">
            II. Thông Tin Phiếu Yêu Cầu Thanh Lý/Huỷ
          </Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={[CODE.taoYCH, CODE.taoYCHKS]} on={SCREEN_CODE.PYCH}>
            <Link
              to={linksTo.createCancelRequest}
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
            onClick={() => this.printHandler(selectedRecords)}
          >
            In PYCH
          </Button>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => onExportExcel(formSubmittedValues)}
          >
            Xuất Excel
          </Button>
        </div>
      </div>
    );

    const columnDefs = makeColumnDefs(this.handleDialogOpen);
    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        proceedDeletion={() =>
          onDeleteRecord(this.state.idForDeletion, this.state.isBasket)
        }
      />
    );

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MuiTable
            columns={columnDefs}
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
                <MTablePagingCustomized
                  {...props}
                  onSubmit={onSubmitForm}
                  formValues={formSubmittedValues}
                />
              ),
            }}
            onOrderChange={(colIndex, direction) => {
              const sortKey = columnDefs[colIndex]
                ? columnDefs[colIndex].field
                : '';

              onSubmitForm({
                ...formSubmittedValues,
                sortKey,
                sortType: direction,
              });
            }}
            options={{
              maxBodyHeight: 500,
              headerStyle: {
                background: appTheme.palette.background.head,
                paddingTop: appTheme.spacing.unit,
                paddingBottom: appTheme.spacing.unit,
                position: 'sticky',
                top: -1,
              },
              rowStyle: {
                paddingTop: appTheme.spacing.unit / 2,
                paddingBottom: appTheme.spacing.unit / 2,
              },
              toolbar: false,
              showTitle: false,
              search: false,
              columnsButton: false,
              exportButton: false,
              selection: true,
              addRowPosition: 'last',
              showSelectAllCheckbox: true,
              emptyRowsWhenPaging: false,
            }}
            onRowClick={(event, rowData) => {
              this.props.history.push(
                `${linksTo.viewCancelRequest}${rowData.id}?isBasket=${
                  rowData.isBasket ? 'true' : 'false'
                }`,
              );
            }}
            onSelectionChange={data => {
              onSelectionChange(data);
            }}
            onChangePage={() => {
              // reset selected row collection
              onSelectionChange([]);
              const updatedTableData = tableData.map(row => {
                const updatedRow = { ...row };
                updatedRow.tableData.checked = false; // uncheck
                return updatedRow;
              });
              onUpdateTableData(updatedTableData);
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
                  'Không tìm thấy kết quả nào để hiển thị',
              },
            }}
          />
        </MuiThemeProvider>
        {deleteDialog}
      </Paper>
    );
  }
}

TableSection.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object,
  tableData: PropTypes.array,
  onDeleteRecord: PropTypes.func,
  selectedRecords: PropTypes.array,
  onPrintSelected: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  onExportExcel: PropTypes.func,
  formSubmittedValues: PropTypes.object,
  onSubmitForm: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  formSubmittedValues: selectors.formSubmittedValues(),
  selectedRecords: selectors.tableSelectedRecords(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    onDeleteRecord: (id, isBasket) =>
      dispatch(actions.deleteRecord(id, isBasket)),
    onPrintSelected: (selectedRecords, callback) =>
      dispatch(actions.printSelectedRecords(selectedRecords, callback)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onExportExcel: filters => dispatch(actions.exportExcel(filters)),
    onSubmitForm: values => dispatch(actions.submitForm(values)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJS,
  withStyles(style()),
)(TableSection);
