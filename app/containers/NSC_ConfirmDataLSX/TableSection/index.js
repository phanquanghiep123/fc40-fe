import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import MaterialTable from 'material-table';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Typography,
  Paper,
  Grid,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MuiButton from 'components/MuiButton';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { makeColumnDefs } from './columnDefs';
import * as selectors from '../selectors';
import * as actions from '../actions';
import appTheme from '../../App/theme';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  toolbar: {
    padding: theme.spacing.unit * 2,
  },
  footer: {
    padding: theme.spacing.unit * 2,
  },
  tableContainer: {
    marginBottom: '1rem',
  },
  btn: {
    width: 140,
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
          borderBottom: 'none',
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
        // h6: {
        //   display: 'none',
        // },
      },
      MuiButton: {
        root: {
          minWidth: 120,
        },
      },
    },
  });

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  render() {
    const {
      classes,
      history,
      tableData,
      formSubmittedValues,
      onUpdateTableData,
      onSubmitTableData,
      onExportExcel,
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <MuiThemeProvider theme={muiTheme}>
          <Grid className={classes.toolbar} container justify="space-between">
            <Grid item>
              <Typography variant="h6">III. Thông Tin Lệnh Sản Xuất</Typography>
            </Grid>
            <Grid item>
              <Grid container justify="flex-end">
                <Grid item>
                  <MuiButton
                    outline
                    className={classes.btn}
                    onClick={() => onExportExcel(formSubmittedValues)}
                    disabled={tableData.length < 1}
                  >
                    Tải Xuống
                  </MuiButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className={classes.tableContainer}>
            <MaterialTable
              columns={makeColumnDefs(tableData, onUpdateTableData)}
              data={tableData}
              localization={{
                body: {
                  emptyDataSourceMessage: 'Không có dữ liệu để hiển thị',
                },
              }}
              options={{
                search: false,
                paging: false,
                sorting: false,
                actionsColumnIndex: -1,
                toolbar: false,
                headerStyle: {
                  background: appTheme.palette.background.head,
                },
                rowStyle: rowData => ({
                  // border bottom for the last row of each type only
                  borderBottom: rowData.isLastRow
                    ? '1px solid rgba(224, 224, 224, 1)'
                    : 'none',
                }),
              }}
            />
          </div>
          <Grid
            container
            justify="flex-end"
            className={classes.footer}
            spacing={24}
          >
            <Grid item>
              <MuiButton
                className={classes.btn}
                outline
                onClick={history.goBack}
              >
                Hủy
              </MuiButton>
            </Grid>
            <Grid item>
              <MuiButton
                onClick={debounce(
                  () => onSubmitTableData(tableData, formSubmittedValues),
                  SUBMIT_TIMEOUT,
                )}
                className={classes.btn}
              >
                Xác Nhận
              </MuiButton>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  tableData: PropTypes.array,
  formSubmittedValues: PropTypes.object,
  onUpdateTableData: PropTypes.func,
  onSubmitTableData: PropTypes.func,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onSubmitTableData: (tableData, formValues) =>
      dispatch(actions.submitTableData(tableData, formValues)),
    onExportExcel: formSubmittedValues =>
      dispatch(actions.exportExcel(formSubmittedValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withRouter,
  withStyles(style()),
)(TableSection);
