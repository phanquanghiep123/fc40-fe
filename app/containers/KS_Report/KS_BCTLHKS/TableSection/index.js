/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  withStyles,
  Paper,
  Typography,
  Button,
  Grid,
  createMuiTheme,
} from '@material-ui/core';
import FormDataFree from 'components/FormikUI/FormDataFree';
import { Can } from 'authorize/ability-context';
import { buildRequestId } from 'utils/notificationUtils';
import { getRowStyle } from 'utils/index';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { makeColumnDefs, makeColumnDefsSmall } from './columnDefs';
import appTheme from '../../../App/theme';
import Popup from '../../../../components/MuiPopup';
import MuiTable from '../../../../components/MuiTable/MuiTable';
import MuiButton from '../../../../components/MuiButton';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer';
import '../../../../../node_modules/react-vis/dist/style.css';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';
import ChartPopup from '../ChartPopup';
import * as selectors from '../selectors';
import * as actions from '../actions';
import SyncPopup from '../SyncPopup';

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
  fontBold: {
    fontWeight: 'bold',
  },
  centerAlign: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 13,
  },
  squareBorder: {
    display: 'flex',
    marginLeft: 20,
  },
  square: {
    height: 20,
    width: 20,
  },
  gridMargin: {
    marginTop: 0,
  },
  toolTipChart: {
    width: 200,
    padding: 3,
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: appTheme.palette.background.default,
    opacity: 0.7,
    borderRadius: 10,
  },
  tableWitdh: {
    width: 100,
  },
  chartNote: {
    display: 'flex',
    justifyContent: 'left',
    fontSize: 13,
  },
  chartNoteSquare: {
    paddingTop: 10,
  },
});

const selectBasketsPopupTheme = createMuiTheme({
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

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  state = {
    openWarning: false,
    handle: false,
  };

  requestId = buildRequestId();

  componentDidMount() {
    window.signalR.on('MessageNotification', this.onSignalRProcessing);
  }

  componentWillUnmount() {
    window.signalR.off('MessageNotification', this.onSignalRProcessing);
  }

  warning = () => {
    this.setState({ openWarning: true });
  };

  closeWarning = () => {
    this.setState({ openWarning: false });
  };

  warned = () => {
    this.setState({ handle: true });
  };

  close = () => {
    this.setState({ handle: false });
  };

  onChangePage = pageIndex => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onFetchMainTableData, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onFetchMainTableData(submittedValues);
    }
  };

  onChangeRowsPerPage = pageSize => {
    const { onFetchMainTableData, submittedValues } = this.props;
    if (submittedValues.totalItem < pageSize * submittedValues.pageIndex) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onFetchMainTableData(submittedValues);
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

  syncReport = values => {
    const { onSyncReport } = this.props;
    const params = {
      ...values,
      requestId: this.requestId,
    };
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

  render() {
    const {
      classes,
      mainTableData,
      totalRow,
      totalTableData,
      chartData,
      submittedValues,
    } = this.props;
    const { openWarning, handle } = this.state;
    const columnDefs = makeColumnDefs();
    const columnDefsSmall = makeColumnDefsSmall();
    const CustomTooltipPrice = ({ active, payload }) => {
      if (active && payload.length > 0) {
        return (
          <div className={classes.toolTipChart}>
            <table>
              <tbody>
                <tr>
                  <td className={classes.tableWitdh}>Đơn vị:</td>
                  <td>{payload[0].payload.name}</td>
                </tr>
                <tr>
                  <td className={classes.tableWitdh}>Tỉ lệ:</td>
                  <td>{payload[0].payload.subLabel}</td>
                </tr>
                <tr>
                  <td className={classes.tableWitdh}>Giá trị hủy:</td>
                  <td>{payload[0].payload.label}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      return null;
    };

    const CustomTooltipQuantity = ({ active, payload }) => {
      if (active && payload.length > 0) {
        return (
          <div className={classes.toolTipChart}>
            <table>
              <tbody>
                <tr>
                  <td className={classes.tableWitdh}>Đơn vị:</td>
                  <td>{payload[0].payload.name}</td>
                </tr>
                <tr>
                  <td className={classes.tableWitdh}>Tỉ lệ:</td>
                  <td>{payload[0].payload.subLabel}</td>
                </tr>
                <tr>
                  <td className={classes.tableWitdh}>Số lượng hủy:</td>
                  <td>{payload[0].payload.label}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      return null;
    };

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">
            II. Thông Tin Xuất Thanh Lý, Xuất Hủy Khay Sọt
          </Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.chayBCXTLXHKS} on={SCREEN_CODE.BCXTLXHKS}>
            <MuiButton
              outline
              className={classes.topButton}
              onClick={this.warned}
            >
              Chạy Báo Cáo
            </MuiButton>
          </Can>
          <Button
            className={classes.topButton}
            onClick={this.exportReport}
            color="primary"
            disabled={!totalTableData || totalTableData.length === 1}
          >
            Xuất Excel
          </Button>
          <Button
            className={classes.topButton}
            onClick={this.printReport}
            disabled={!totalTableData || totalTableData.length === 1}
            color="primary"
          >
            In Báo Cáo
          </Button>
          <Button
            className={classes.topButton}
            onClick={this.warning}
            color="primary"
            disabled={totalTableData.length === 1}
          >
            Xem biểu đồ số lượng hủy/tổng tồn
          </Button>
        </div>
      </div>
    );

    const renderCustomizedLabel = ({
      cx,
      cy,
      value,
      color,
      midAngle,
      innerRadius,
      outerRadius,
    }) => {
      const RADIAN = Math.PI / 180;
      // eslint-disable-next-line
      const radius = 25 + innerRadius + (outerRadius - innerRadius);
      // eslint-disable-next-line
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      // eslint-disable-next-line
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill={color}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {value}%
        </text>
      );
    };

    chartData.circleChartPrice =
      chartData.circleChartPrice.length === 0 ||
      chartData.circleChartPrice[0].angle === 0
        ? []
        : chartData.circleChartPrice;
    chartData.circleChartQuantity =
      chartData.circleChartQuantity.length === 0 ||
      chartData.circleChartQuantity[0].angle === 0
        ? []
        : chartData.circleChartQuantity;

    return (
      <div>
        <Paper className={classes.paper}>
          {topToolbar}
          <Grid container spacing={24} className={classes.gridMargin}>
            <Grid item xs={12} md={6}>
              <MuiTable
                columns={columnDefsSmall}
                data={totalTableData.filter(
                  (_, i) => i !== totalTableData.length - 1,
                )}
                options={{
                  headerStyle: {
                    background: appTheme.palette.background.head,
                    position: 'sticky',
                    top: -1,
                  },
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  sorting: false,
                  columnsButton: false,
                  exportButton: false,
                  selection: false,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                  paging: false,
                  maxBodyHeight: 400,
                }}
              />
              <MuiTable
                columns={columnDefsSmall}
                data={totalTableData.filter(
                  (_, i) => i === totalTableData.length - 1,
                )}
                options={{
                  rowStyle: {
                    paddingTop: appTheme.spacing.unit / 2,
                    paddingBottom: appTheme.spacing.unit / 2,
                  },
                  // header: false,
                  headerStyle: {
                    visibility: 'hidden',
                  },
                  toolbar: false,
                  showTitle: false,
                  search: false,
                  sorting: false,
                  columnsButton: false,
                  exportButton: false,
                  selection: false,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                  paging: false,
                  maxBodyHeight: 400,
                }}
              />
            </Grid>
            {/* Đầu */}
            <Grid item container xs={12} md={6}>
              <Grid item xs={6} md={6}>
                <Grid item xs={12} md={12}>
                  <Typography className={classes.fontBold} align="center">
                    Biểu đồ so sánh giá trị hủy
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} className={classes.centerAlign}>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={chartData.circleChartPrice}
                          cx={155}
                          cy={120}
                          outerRadius={90}
                          fill="#8884d8"
                          label={renderCustomizedLabel}
                          isAnimationActive={false}
                          legendType="circle"
                          paddingAngle={2}
                          minAngle={2}
                        >
                          {chartData.circleChartPrice.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltipPrice />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={6} md={6}>
                <Grid item xs={12} md={12}>
                  <Typography className={classes.fontBold} align="center">
                    Biểu đồ so sánh số lượng hủy
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} className={classes.centerAlign}>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={chartData.circleChartQuantity}
                          cx={155}
                          cy={120}
                          outerRadius={90}
                          fill="#8884d8"
                          label={renderCustomizedLabel}
                          isAnimationActive={false}
                          legendType="circle"
                          paddingAngle={2}
                          minAngle={2}
                        >
                          {chartData.circleChartQuantity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltipQuantity />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Grid>
              </Grid>
              <Grid container className={classes.chartNote}>
                {chartData.circleChartPrice
                  .filter(x => x.angle !== 0)
                  .map((element, index) => (
                    <Grid
                      item
                      key={`${element.name} ${index}`}
                      xs={3}
                      md={3}
                      className={classes.chartNoteSquare}
                    >
                      <div className={classes.squareBorder}>
                        <div
                          className={classes.square}
                          style={{ backgroundColor: element.color }}
                        />
                        <span style={{ marginLeft: 10 }}>{element.name}</span>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </Grid>

            {/* Cuối */}
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <FormDataFree
            columnDefs={columnDefs}
            rowData={mainTableData}
            gridStyle={{ height: 415 }}
            customizePagination
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
              getRowStyle,
            }}
          />
        </Paper>
        <Popup
          open={openWarning}
          onClose={this.closeWarning}
          content={
            <ChartPopup
              data={chartData.barChart ? chartData.barChart : []}
              onClose={this.closeWarning}
            />
          }
          dialogProps={{ maxWidth: 'md', keepMounted: false }}
          theme={selectBasketsPopupTheme}
        />
        <Popup
          open={handle}
          onClose={this.close}
          content={
            <SyncPopup
              onSyncReportData={this.syncReport}
              onClose={this.close}
            />
          }
          dialogProps={{ maxWidth: 'sm', keepMounted: false }}
          theme={popupTheme}
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  // formData: PropTypes.object,
  classes: PropTypes.object,
  mainTableData: PropTypes.array,
  totalRow: PropTypes.object,
  totalTableData: PropTypes.array,
  chartData: PropTypes.object,
  submittedValues: PropTypes.object,
  onFetchMainTableData: PropTypes.func,
  onExportReport: PropTypes.func,
  onPrintReport: PropTypes.func,
  onChangeOrder: PropTypes.func,
  onSyncReport: PropTypes.func,
  onSignalRProcessing: PropTypes.func,
  formSubmittedValues: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  // formData: selectors.formData(),
  mainTableData: selectors.mainTableData(),
  totalRow: selectors.totalRow(),
  totalTableData: selectors.totalTableData(),
  chartData: selectors.chartData(),
  submittedValues: selectors.submittedValues(),
  formSubmittedValues: selectors.submittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchMainTableData: formData =>
      dispatch(actions.fetchMainTableData(formData)),
    onExportReport: formData => dispatch(actions.exportReport(formData)),
    onPrintReport: (formData, callback) =>
      dispatch(actions.printReport(formData, callback)),
    onChangeOrder: (formData, sort) =>
      dispatch(actions.orderChange(formData, sort)),
    onSyncReport: values => dispatch(actions.syncReport(values)),
    onSignalRProcessing: (requestId, response, formData) =>
      dispatch(actions.signalIrProcessing(requestId, response, formData)),
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
