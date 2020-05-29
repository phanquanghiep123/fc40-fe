import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles, Paper, Typography } from '@material-ui/core';
import * as selectors from '../selectors';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import MuiTable from '../../../../components/MuiTable/MuiTable';
import MuiTableBody from '../../../../components/MuiTable/MuiTableBody';
import MTablePagingCustomized from '../../../../components/MuiTable/MTablePagingCustomized';
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

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  render() {
    const {
      classes,
      tableData,
      onFetchTableData,
      formSubmittedValues,
    } = this.props;

    const columnDefs = makeColumnDefs();
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Báo Cáo Sản Xuất</Typography>
        </div>
        <div className={classes.topToolbarPart} />
      </div>
    );

    return (
      <Paper className={classes.paper}>
        {topToolbar}
        <MuiTable
          columns={columnDefs}
          data={tableData}
          components={{
            Body: props => (
              <MuiTableBody {...props} renderData={tableData} currentPage={0} />
            ),
            Pagination: props => (
              <MTablePagingCustomized
                {...props}
                onSubmit={onFetchTableData}
                formValues={formSubmittedValues}
              />
            ),
          }}
          options={{
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
          }}
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  formSubmittedValues: PropTypes.object,
  onFetchTableData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
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
