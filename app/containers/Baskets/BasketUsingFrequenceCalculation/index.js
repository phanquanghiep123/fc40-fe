/**
 *
 * BasketUsingFrequenceCalculation
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import Expansion from 'components/Expansion';
import {
  Paper,
  withStyles,
  Button,
  Grid,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import MaterialTable from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import { MuiTableBody } from 'components/MuiTable';
import appTheme from 'containers/App/theme';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Typography from '@material-ui/core/Typography';
import ConfirmationDialog from 'components/ConfirmationDialog';
import * as selectors from './selectors';
import MonthYearPicker from '../../../components/MonthYearPicker';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import { convertDateTimeString } from '../../App/utils';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import {
  MAIN_PAGE,
  CONFIRM_RUN_REPORT,
  DISAGREE,
  AGREE,
  TITLE_SECTION2,
  EMPTY_DATA,
  DISPLAY_ROW,
  ROW,
  ROW_SELECTED,
  TITLE_SECTION1,
  TITLE_PAGE,
} from './constants';

const muiThemeOptions = {
  border: false,
};

export const styles = theme => ({
  titleText: {
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 20,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& > *': {
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

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

const tableColumns = () => [
  {
    title: 'STT',
    field: 'indexOfAll',
    width: 60,
    render: params => {
      if (params.total) {
        return '';
      }
      return params.tableData.id + 1;
    },
    sort: false,
  },
  {
    title: 'Mã Đơn Vị',
    field: 'plantCode',
    sort: false,
  },
  {
    title: 'Tên Đơn Vị',
    field: 'plantName',
    sort: false,
  },
  {
    title: 'Tháng',
    field: 'date',
    sort: false,
  },
  {
    title: 'Người Chạy Báo Cáo',
    field: 'fullName',
    sort: false,
  },
  {
    title: 'Thời Gian Chạy',
    field: 'processDate',
    sort: false,
    render: rowData => convertDateTimeString(rowData.processDate),
  },
];

class BasketUsingFrequenceCalculation extends Component {
  formik = null;

  componentDidMount() {
    this.props.onFetchFormData();
  }

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  makeFormAttr = pr => ({
    // plantCode: {
    //   name: 'plantCode',
    //   label: 'Đơn Vị Quản Lý',
    //   value: pr.values.plantCode,
    //   component: SelectAutocomplete,
    //   placeholder: 'Tất Cả',
    //   searchable: true,
    //   options: formData.listPlant,
    //   isMulti: true,
    //   isMultiline: true,
    // },
    date: {
      name: 'date',
      label: 'Tháng',
      component: MonthYearPicker,
      value: pr.values.date,
      clearable: false,
    },
  });

  onFormSubmit = () => {
    this.props.handleSearchPopup({
      ...this.formik.values,
      pageIndex: 0,
    });
  };

  onChangePage = (event, pageIndex) => {
    const { handleSearchPopup, paramsSearchPopup } = this.props;
    if (pageIndex !== paramsSearchPopup.pageIndex) {
      paramsSearchPopup.pageIndex = pageIndex;
      handleSearchPopup(paramsSearchPopup);
    }
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { handleSearchPopup, paramsSearchPopup } = this.props;
    paramsSearchPopup.pageSize = pageSize;
    handleSearchPopup(paramsSearchPopup);
  };

  onRunReport = () => {
    this.props.confirmRunReport(
      {
        ...this.formik.values,
      },
      data => {
        if (data.length > 0) {
          this.showConfirm({
            title: CONFIRM_RUN_REPORT,
            message: data,
            actions: [
              {
                text: DISAGREE,
              },
              {
                text: AGREE,
                color: 'primary',
                onClick: () => {
                  this.props.handleRunReport(
                    {
                      ...this.formik.values,
                    },
                    () => {
                      this.props.history.push(MAIN_PAGE);
                    },
                  );
                },
              },
            ],
          });
        } else {
          this.props.handleRunReport(
            {
              ...this.formik.values,
            },
            () => {
              this.props.history.push(MAIN_PAGE);
            },
          );
        }
      },
    );
  };

  resetPopup = () => {
    this.props.handleSearchPopup({
      plantCode: [],
      date: new Date(),
      pageSize: 10,
      pageIndex: 0,
    });
  };

  render() {
    const { classes, paramsSearchPopup, formData, tablePopup } = this.props;
    const getColumnDefs = tableColumns();
    return (
      <div>
        <React.Fragment>
          <Grid item>
            <Typography variant="h5" className={classes.titleText}>
              {TITLE_PAGE}
            </Typography>
          </Grid>
          <Expansion
            title={TITLE_SECTION1}
            content={
              <Formik
                enableReinitialize
                initialValues={paramsSearchPopup}
                onSubmit={this.onFormSubmit}
                render={formik => {
                  const formAttr = this.makeFormAttr(formik, formData);
                  this.formik = formik;
                  return (
                    <div>
                      <Form>
                        <Grid
                          container
                          spacing={24}
                          style={{ marginBottom: '-0.5rem' }}
                        >
                          {/* <Grid item lg={6} md={6} sm={12} xs={12} xl={6}> */}
                          {/*  <Grid container> */}
                          {/*    <Grid */}
                          {/*      item */}
                          {/*      xl={12} */}
                          {/*      lg={12} */}
                          {/*      md={12} */}
                          {/*      sm={12} */}
                          {/*      xs={12} */}
                          {/*    > */}
                          {/*      <Field {...formAttr.plantCode} /> */}
                          {/*    </Grid> */}
                          {/*  </Grid> */}
                          {/* </Grid> */}

                          <Grid item lg={4} md={4} sm={12} xs={12} xl={4}>
                            <Grid container>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.date} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <div className={classes.btnContainer}>
                          <Button
                            type="button"
                            variant="contained"
                            className={classes.resetBtn}
                            onClick={() => {
                              formik.handleReset();
                              this.resetPopup();
                            }}
                          >
                            Bỏ lọc
                          </Button>
                          <Button
                            className={classes.btn}
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            Tìm kiếm
                          </Button>
                          <Button
                            className={classes.btn}
                            style={{ marginLeft: 14 }}
                            variant="contained"
                            color="primary"
                            onClick={this.onRunReport}
                          >
                            chạy báo cáo
                          </Button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              />
            }
          />

          <Paper style={{ marginTop: 20, marginBottom: 20 }}>
            <Expansion
              title={TITLE_SECTION2}
              content={
                <MuiThemeProvider theme={muiTheme}>
                  <MaterialTable
                    columns={getColumnDefs}
                    data={tablePopup}
                    components={{
                      Row: MTableBodyRowCustomized,
                      Body: props => (
                        <MuiTableBody
                          {...props}
                          renderData={tablePopup}
                          currentPage={0}
                        />
                      ),
                      Pagination: props => (
                        <TablePagination
                          {...props}
                          page={paramsSearchPopup.pageIndex || 0}
                          rowsPerPage={paramsSearchPopup.pageSize || 10}
                          totalcount={paramsSearchPopup.totalItem || 0}
                          count={paramsSearchPopup.totalItem || 0}
                          onChangePage={this.onChangePage}
                          onChangeRowsPerPage={this.onChangeRowsPerPage}
                        />
                      ),
                    }}
                    initialPage={paramsSearchPopup.pageIndex}
                    options={{
                      headerStyle: {
                        position: 'sticky',
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
                      pageSize: paramsSearchPopup.pageSize || 0,
                      addRowPosition: 'last',
                      emptyRowsWhenPaging: false,
                      maxBodyHeight: 555,
                    }}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    localization={{
                      toolbar: {
                        nRowsSelected: ROW_SELECTED,
                      },
                      pagination: {
                        labelRowsSelect: ROW,
                        labelDisplayedRows: DISPLAY_ROW,
                      },
                      body: {
                        emptyDataSourceMessage: EMPTY_DATA,
                      },
                    }}
                  />
                </MuiThemeProvider>
              }
            />
          </Paper>
          <ConfirmationDialog
            ref={ref => {
              this.confirmRef = ref;
            }}
          />
        </React.Fragment>
      </div>
    );
  }
}

BasketUsingFrequenceCalculation.propTypes = {
  classes: PropTypes.object.isRequired,
  paramsSearchPopup: PropTypes.object,
  formData: PropTypes.object,
  tablePopup: PropTypes.array,
  handleSearchPopup: PropTypes.func,
  handleRunReport: PropTypes.func,
  history: PropTypes.object,
  onFetchFormData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  paramsSearchPopup: selectors.paramsSearchPopupSelect(),
  formData: selectors.listData('formData'),
  tablePopup: selectors.tableDataPopup(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: payload => dispatch(actions.fetchForm(payload)),
    handleSearchPopup: data => dispatch(actions.onSearchPopup(data)),
    confirmRunReport: (data, callback) =>
      dispatch(actions.confirmRunReport(data, callback)),
    handleRunReport: (data, callback) =>
      dispatch(actions.runReport(data, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({
  key: 'basketUsingFrequenceCalculation',
  reducer,
});
const withSaga = injectSaga({ key: 'basketUsingFrequenceCalculation', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
)(BasketUsingFrequenceCalculation);
