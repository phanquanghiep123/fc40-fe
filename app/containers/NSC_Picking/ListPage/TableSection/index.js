import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Paper,
  Typography,
} from '@material-ui/core';
import { convertDateString } from '../../../App/utils';
import * as selectors from '../selectors';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
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
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
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
  render() {
    const { classes, tableData, processingDate, onDownloadFile } = this.props;
    const columnDefs = makeColumnDefs(onDownloadFile);
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">
            Danh Sách File Chia Chọn Dự Kiến Cho Ngày:{' '}
            {convertDateString(processingDate.processingDate)}
          </Typography>
        </div>
      </div>
    );
    return (
      <Paper className={classes.paper}>
        {topToolbar}

        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            columns={columnDefs}
            data={tableData}
            options={{
              headerStyle: {
                background: appTheme.palette.background.head,
              },
              showTitle: false,
              search: false,
              sorting: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
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
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  processingDate: PropTypes.object,
  onDownloadFile: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  processingDate: selectors.processingDate(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDownloadFile: (id, fileType) =>
      dispatch(actions.downloadFile(id, fileType)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(style()),
)(TableSection);
