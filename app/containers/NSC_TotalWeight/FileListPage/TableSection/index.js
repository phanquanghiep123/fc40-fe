import { loadingError } from 'containers/App/actions';
import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {
  Button,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  withStyles,
  Typography,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import MuiButton from 'components/MuiButton';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import Warning from './Warning';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './tableColumns';
import * as selectors from '../selectors';
import * as actions from '../actions';
import TotalWeightImportFile from '../ImportFile';
const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px `,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
  topButton: {
    color: theme.palette.primary.main,
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
          border: options.border
            ? '1px solid rgba(224, 224, 224, 1)'
            : undefined,
          padding: `0 ${theme.spacing.unit * 1}px`,
          '&:first-child': {
            paddingLeft: theme.spacing.unit * 3,
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
    filterCol: {
      sortKey: null,
      sortType: 'asc',
    },
    openDl: false,
    openConfirm: false,
    openWarning: false,
    currentSelectedIds: [],
  };

  tableRef = null;

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
   * Import handler
   */
  importHandler = () => {
    this.setState({ openDl: true });
  };

  closeImportDl = () => {
    this.setState({ openDl: false });
  };

  importSuccess = () => {
    const { formSubmittedValues, onFormSubmit } = this.props;
    this.setState({ openDl: false });
    onFormSubmit(formSubmittedValues);
  };

  purchaseStopping = () => {
    const { currentSelectedIds } = this.state;
    if (currentSelectedIds.length === 0) {
      this.setState({ openConfirm: true });
      return;
    }
    const ids = currentSelectedIds.join(',');
    this.props.onPurchaseStopping({ ids }, () => {
      const { formSubmittedValues, onFormSubmit } = this.props;
      this.setState({ currentSelectedIds: [] });
      onFormSubmit(formSubmittedValues);
    });
  };

  warning = () => {
    this.setState({ openWarning: true });
  };

  closeWarning = () => {
    this.setState({ openWarning: false });
  };

  selectionChange = currentSelectedIds => {
    this.setState({ currentSelectedIds });
  };

  resetSelectedIds = () => {
    this.selectionChange([]);
  };

  closeConfirm = () => {
    this.setState({ openConfirm: false });
  };

  render() {
    const {
      classes,
      formSubmittedValues,
      formData,
      tableData,
      ui,
      onSubmitFile,
      onCheckWarning,
      onSendEmail,
      onDownloadWarningFile,
      onsignalRProcessing,
      onSubmitFileSignalr,
      onLoadingError,
    } = this.props;
    const { openDl, openConfirm, openWarning, currentSelectedIds } = this.state;

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">Thông Tin Cân Tổng Điều Phối</Typography>
        </div>

        <div className={classes.topToolbarPart}>
          <MuiButton
            outline
            onClick={debounce(this.purchaseStopping, SUBMIT_TIMEOUT)}
          >
            Dừng Thu Mua
          </MuiButton>
          <MuiButton outline onClick={this.warning}>
            Cảnh Báo
          </MuiButton>
          <Can do={CODE.taoCTDP} on={SCREEN_CODE.IMPORT_FILE_1}>
            <Button
              className={classes.topButton}
              color="primary"
              onClick={() => this.importHandler()}
            >
              Tải Lên
            </Button>
          </Can>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() =>
              this.exportExcelHandler(formSubmittedValues, this.state.filterCol)
            }
            disabled={tableData.length === 0}
          >
            Tải xuống
          </Button>
        </div>
      </div>
    );

    const tableColumns = makeTableColumns(
      currentSelectedIds,
      this.selectionChange,
    );

    return (
      <React.Fragment>
        {openDl && (
          <TotalWeightImportFile
            ui={ui}
            formData={formData}
            openDl={openDl}
            onSubmitFile={onSubmitFile}
            onSubmitFileSignalr={onSubmitFileSignalr}
            onClose={this.closeImportDl}
            onSubmitSuccess={this.importSuccess}
            onLoadingError={onLoadingError}
          />
        )}
        <ui.Dialog
          title="Cảnh báo"
          content="Không có sản phẩm nào được chọn, không thể dừng thu mua"
          isModal
          onConfirm={this.closeConfirm}
          maxWidth="lg"
          openDl={openConfirm}
          onCloseDialog={this.closeConfirm}
        />
        <ui.Dialog
          title="Cảnh Báo Sản Phẩm Chưa Extend, Cài Giá Bán, Giá Mua"
          isDialog={false}
          content={
            <Warning
              onCloseDialog={this.closeWarning}
              onCheckWarning={onCheckWarning}
              onSendEmail={onSendEmail}
              onDownloadWarningFile={onDownloadWarningFile}
              onsignalRProcessing={onsignalRProcessing}
            />
          }
          openDl={openWarning}
          customActionDialog={!false}
          maxWidth="lg"
        />
        <Paper className={classes.paper}>
          {topToolbar}
          <MuiThemeProvider theme={muiTheme}>
            <MaterialTable
              tableRef={ref => {
                this.tableRef = ref;
              }}
              columns={tableColumns}
              data={tableData}
              onChangePage={this.resetSelectedIds}
              onChangeRowsPerPage={this.resetSelectedIds}
              options={{
                headerStyle: {
                  background: appTheme.palette.background.head,
                },
                showTitle: false,
                search: false,
                columnsButton: false,
                exportButton: false,
                pageSize: 5,
                addRowPosition: 'last',
                selection: false,
                showSelectAllCheckbox: false,
                selectionProps: {
                  disabled: true,
                },
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
        </Paper>
      </React.Fragment>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  tableData: PropTypes.array,
  onExportExcel: PropTypes.func,
  onSubmitFile: PropTypes.func,
  onFormSubmit: PropTypes.func,
  onPurchaseStopping: PropTypes.func,
  onCheckWarning: PropTypes.func,
  onSendEmail: PropTypes.func,
  onDownloadWarningFile: PropTypes.func,
  onSubmitFileSignalr: PropTypes.func,
  onLoadingError: PropTypes.func,
  onsignalRProcessing: PropTypes.func,
  formData: PropTypes.object,
  ui: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  tableData: selectors.tableData(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onExportExcel: (formSubmittedValues, filterColumn) =>
      dispatch(actions.exportExcel(formSubmittedValues, filterColumn)),
    onSubmitFile: (form, callback) =>
      dispatch(actions.submitFile(form, callback)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onPurchaseStopping: (ids, callback) =>
      dispatch(actions.purchaseStopping(ids, callback)),
    onCheckWarning: form => dispatch(actions.checkWarning(form)),
    onSendEmail: date => dispatch(actions.sendEmail(date)),
    onDownloadWarningFile: date => dispatch(actions.downloadWarningFile(date)),
    onLoadingError: messages => dispatch(loadingError(messages)),
    onSubmitFileSignalr: (res, processingDate, callback) =>
      dispatch(actions.submitFileSignalr(res, processingDate, callback)),
    onsignalRProcessing: res => dispatch(actions.signalRProcessing(res)),
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
