/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core';
import FormDataFree from 'components/FormikUI/FormDataFree';
import Expansion from 'components/Expansion';
import { getRowStyle } from 'utils/index';
import * as selectors from '../selectors';
import { columnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import MuiButton from '../../../../components/MuiButton';
import * as actions from '../actions';
import { linksTo } from '../linksTo';
import { Can } from '../../../../authorize/ability-context';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';
import PinnedRowRenderer from '../../../../components/FormikUI/PinnedRowRenderer';
const style = (theme = appTheme) => ({
  expansion: {
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
  onChangeRowsPerPage = pageSize => {
    const { onFetchTableData, formSubmittedValues } = this.props;
    if (
      formSubmittedValues.count <
      (pageSize - 1) * formSubmittedValues.pageIndex
    ) {
      formSubmittedValues.pageIndex =
        Math.ceil(formSubmittedValues.count / pageSize) - 1;
    }
    formSubmittedValues.pageSize = pageSize;
    onFetchTableData(formSubmittedValues);
  };

  onChangePage = pageIndex => {
    if (pageIndex !== this.props.formSubmittedValues.pageIndex) {
      const { onFetchTableData, formSubmittedValues } = this.props;
      formSubmittedValues.pageIndex = pageIndex;
      onFetchTableData(formSubmittedValues);
    }
  };

  render() {
    const {
      classes,
      tableData,
      formSubmittedValues,
      onExportReport,
      history,
      totalRowData,
    } = this.props;
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoBCSX} on={SCREEN_CODE.TTBCSX} passThrough>
            {can => (
              <MuiButton
                outline
                onClick={() => history.push(linksTo.proceedReport)}
                disabled={!can}
              >
                Tính Toán BCSX
              </MuiButton>
            )}
          </Can>
          <MuiButton
            outline
            onClick={() => onExportReport(formSubmittedValues)}
            disabled={!tableData || tableData.length < 2}
          >
            Xuất Báo Cáo
          </MuiButton>
        </div>
      </div>
    );

    return (
      <div className={classes.expansion}>
        <Expansion
          title="II. Thông Tin Báo Cáo Sản Xuất"
          rightActions={topToolbar}
          content={
            <FormDataFree
              columnDefs={columnDefs}
              rowData={tableData}
              gridStyle={{ height: 450 }}
              customizePagination
              remotePagination
              totalCount={formSubmittedValues.count || 0}
              pageIndex={formSubmittedValues.pageIndex || 0}
              // onOrderChange={this.onOrderChange}
              onChangePage={this.onChangePage}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              pageSize={formSubmittedValues.pageSize}
              gridProps={{
                pinnedBottomRowData: [totalRowData],
                frameworkComponents: {
                  customPinnedRowRenderer: PinnedRowRenderer,
                },
                getRowStyle,
              }}
            />
          }
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  history: PropTypes.object,
  classes: PropTypes.object,
  totalRowData: PropTypes.object,
  tableData: PropTypes.array,
  formSubmittedValues: PropTypes.object,
  onFetchTableData: PropTypes.func,
  onExportReport: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  totalRowData: selectors.totalRowData(),
  formSubmittedValues: selectors.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
    onExportReport: formValues => dispatch(actions.exportReport(formValues)),
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
