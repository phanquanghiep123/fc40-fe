import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

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
import * as selectors from '../selectors';
import * as actions from '../actions';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import MuiTable from '../../../../components/MuiTable/MuiTable';

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
    // overrides: {
    //   ...theme.overrides,
    // },
  });

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  exportExcelHandler = formSubmittedValues => {
    this.props.onExportExcel(formSubmittedValues);
  };

  render() {
    const {
      classes,
      tableData,
      submittedValues,
      onSelectionChange,
      onUpdateTableData,
    } = this.props;
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">
            II. Thông Tin Báo Cáo Đáp Ứng Sản Lượng Đặt Hàng
          </Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Button
            className={classes.topButton}
            color="primary"
            onClick={() => this.exportExcelHandler(submittedValues)}
            disabled={!tableData || tableData.length === 0}
          >
            Tải Xuống
          </Button>
        </div>
      </div>
    );

    const columnDefs = makeColumnDefs(this.handleDialogOpen);

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiThemeProvider theme={muiTheme}>
          <MuiTable
            columns={columnDefs}
            data={tableData}
            components={{
              Row: MTableBodyRowCustomized,
            }}
            options={{
              toolbar: false,
              showTitle: false,
              search: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              // pageSize: 5,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
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
          />
        </MuiThemeProvider>
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  submittedValues: PropTypes.object,
  onSelectionChange: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  submittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
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
  withRouter,
  withImmutablePropsToJS,
  withStyles(style()),
)(TableSection);
