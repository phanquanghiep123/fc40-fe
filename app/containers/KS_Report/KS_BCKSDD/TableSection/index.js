import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Can } from 'authorize/ability-context';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  withStyles,
  Paper,
  Typography,
  Button,
  createMuiTheme,
} from '@material-ui/core';
import FormDataFree from 'components/FormikUI/FormDataFree';
import { buildRequestId } from 'utils/notificationUtils';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';
import MuiButton from '../../../../components/MuiButton';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import SyncPopup from '../SyncPopup';
import Popup from '../../../../components/MuiPopup';

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

const popupTheme = createMuiTheme({
  ...appTheme,
  overrides: {
    ...appTheme.overrides,
    MuiDialog: {
      paper: {
        backgroundColor: appTheme.palette.background.default,
      },
    },
    MuiDialogTitle: {
      root: {
        padding: `${appTheme.spacing.unit * 2}px ${appTheme.spacing.unit *
          3}px ${appTheme.spacing.unit}px`,
      },
    },
    MuiDialogContent: {
      root: {
        padding: `${appTheme.spacing.unit}px ${appTheme.spacing.unit * 3}px`,
        '&:first-child': {
          paddingTop: appTheme.spacing.unit,
        },
      },
    },
  },
});

export const defaultColDef = {
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  componentDidMount() {
    window.signalR.on('MessageNotification', this.onSignalRProcessing);
  }

  state = {
    openWarning: false,
  };

  requestId = buildRequestId();

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.onSignalRProcessing);
  }

  syncReport = values => {
    const { onSyncReport } = this.props;
    let params = {};
    if (!values.plantCode) {
      params = {
        ...values,
        requestId: this.requestId,
        plantCode: this.props.formData.currentOrgs,
      };
    } else {
      params = {
        ...values,
        requestId: this.requestId,
      };
    }
    onSyncReport(params);
  };

  onSignalRProcessing = response => {
    const { formSubmittedValues } = this.props;
    this.props.onSignalRProcessing(
      this.requestId,
      response,
      formSubmittedValues,
    );
  };

  onChangePage = pageIndex => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onFetchReportData, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onFetchReportData(submittedValues);
    }
  };

  onChangeRowsPerPage = pageSize => {
    const { onFetchReportData, submittedValues } = this.props;
    if (submittedValues.totalItem < pageSize * submittedValues.pageIndex) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onFetchReportData(submittedValues);
    this.isRun = false;
  };

  printReport = () => {
    const { onPrintReport, submittedValues } = this.props;
    onPrintReport(submittedValues, data => {
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

  exportReport = () => {
    const { onExportReport, submittedValues } = this.props;
    onExportReport(submittedValues);
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { submittedValues, onChangeOrder } = this.props;
    const columnDefs = makeColumnDefs();
    const column = columnDefs[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      onChangeOrder(submittedValues, sortOrder);
    }
  };

  warning = () => {
    this.setState({ openWarning: true });
  };

  closeWarning = () => {
    this.setState({ openWarning: false });
  };

  render() {
    const { openWarning } = this.state;
    const {
      classes,
      tableData,
      totalRow,
      submittedValues,
      formData,
    } = this.props;
    const columnDefs = makeColumnDefs();
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Khay Sọt Đi Đường</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.chayBCKSDD} on={SCREEN_CODE.BCKSDD}>
            <MuiButton
              outline
              className={classes.topButton}
              color="primary"
              onClick={this.warning}
            >
              Chạy Báo Cáo
            </MuiButton>
          </Can>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={this.printReport}
            disabled={!tableData || tableData.length === 0}
          >
            In báo cáo
          </Button>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={this.exportReport}
            disabled={!tableData || tableData.length === 0}
          >
            Xuất excel
          </Button>
        </div>
      </div>
    );
    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <FormDataFree
          columnDefs={columnDefs}
          rowData={tableData}
          suppressRowTransform
          gridStyle={{ height: 450 }}
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
            pinnedBottomRowData: [totalRow],
            frameworkComponents: {
              customPinnedRowRenderer: PinnedRowRenderer,
            },
            getRowStyle: params => {
              if (params.data.totalCol) {
                return { backgroundColor: appTheme.palette.background.default };
              }
              if (!params.data.isLastRow) {
                return { border: 'none' };
              }
              return { border: 'none', borderBottom: appTheme.shade.border };
            },
          }}
        />
        <Popup
          open={openWarning}
          onClose={this.closeWarning}
          content={
            <SyncPopup
              onSyncReportData={this.syncReport}
              onClose={this.closeWarning}
              plants={formData.currentOrgs}
            />
          }
          dialogProps={{ maxWidth: 'sm', keepMounted: false }}
          theme={popupTheme}
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  tableData: PropTypes.array,
  totalRow: PropTypes.object,
  submittedValues: PropTypes.object,
  onExportReport: PropTypes.func,
  onPrintReport: PropTypes.func,
  onFetchReportData: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onSyncReport: PropTypes.func,
  onSignalRProcessing: PropTypes.func,
  formSubmittedValues: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  formData: selectors.formData(),
  totalRow: selectors.totalRow(),
  submittedValues: selectors.submittedValues(),
  formSubmittedValues: selectors.submittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchReportData: formData => dispatch(actions.fetchReportData(formData)),
    onExportReport: formData => dispatch(actions.exportReport(formData)),
    onPrintReport: (formData, callback) =>
      dispatch(actions.printReport(formData, callback)),
    onChangeOrder: (formData, sort) =>
      dispatch(actions.orderChange(formData, sort)),
    onSyncReport: values => dispatch(actions.syncReport(values)),
    onSignalRProcessing: (requestId, response, submittedValues) =>
      dispatch(
        actions.signalIrProcessing(requestId, response, submittedValues),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  withImmutablePropsToJS,
  withStyles(style),
)(TableSection);
