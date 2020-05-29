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
} from '@material-ui/core';

import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../../App/theme';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

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
  render() {
    const { classes, deliTableData, onDeliChangeSelection } = this.props;
    const columnDefs = makeColumnDefs();

    return (
      <Paper className={classes.paper}>
        <MuiThemeProvider theme={muiTheme}>
          <MaterialTable
            columns={columnDefs}
            data={deliTableData}
            onSelectionChange={selectedRows => {
              onDeliChangeSelection(selectedRows);
            }}
            options={{
              headerStyle: {
                background: appTheme.palette.background.head,
              },
              showTitle: false,
              search: false,
              sorting: false,
              columnsButton: false,
              exportButton: false,
              selection: true,
              paging: true,
              addRowPosition: 'last',
              // showSelectAllCheckbox: false,
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
  deliTableData: PropTypes.array,
  onDeliChangeSelection: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  deliTableData: selectors.deliTableData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDeliChangeSelection: selectedRows =>
      dispatch(actions.deliChangeSelection(selectedRows)),
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
