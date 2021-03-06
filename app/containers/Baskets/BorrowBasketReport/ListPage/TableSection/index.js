import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { withStyles } from '@material-ui/core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import * as PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import { getRowStyle } from 'utils/index';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import FormData from 'components/FormikUI/FormData';
import { linksTo } from '../FormSection/linksTo';
import * as selectors from '../selectors';
import * as actions from '../actions';
import appTheme from '../../../../App/theme';
import { makeTableColumns } from './tableColumns';
import { Can } from '../../../../../authorize/ability-context';
import { CODE, SCREEN_CODE } from '../../../../../authorize/groupAuthorize';
import PinnedRowRenderer from '../../../../../components/FormikUI/PinnedRowRenderer';
import MuiButton from '../../../../../components/MuiButton';

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

class TableSection extends Component {
  onExportExcel = () => {
    const { submittedValues, formData, onExportExcel } = this.props;
    onExportExcel(submittedValues, formData);
  };

  printHandler = (formValues, formData) => {
    this.props.onPrint(formValues, formData, data => {
      const win = window.open('', 'win', 'width="100%",height="100%"');
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

  onChangeRowsPerPage = pageSize => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmitForm(submittedValues, formData);
  };

  onChangePage = pageIndex => {
    const { onSubmitForm, submittedValues, formData } = this.props;
    if (pageIndex !== submittedValues.pageIndex) {
      submittedValues.pageIndex = pageIndex;
      onSubmitForm(submittedValues, formData);
    }
  };

  render() {
    const {
      classes,
      tableData,
      submittedValues,
      formData,
      totalRowData,
    } = this.props;
    const tableColumns = makeTableColumns(formData);
    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.xemCBCSLKSMCM} on={SCREEN_CODE.CBCSLKSMCM}>
            <Link
              style={{ textDecoration: 'none', padding: 0 }}
              to={`${linksTo.runReport}?screen=2`}
            >
              <MuiButton outline onClick={this.changeType}>
                Chạy báo cáo
              </MuiButton>
            </Link>
          </Can>
          <MuiButton
            outline
            disabled={isEmpty(tableData)}
            onClick={this.onExportExcel}
          >
            Xuất excel
          </MuiButton>
          <MuiButton
            outline
            disabled={isEmpty(tableData)}
            onClick={() => this.printHandler(submittedValues, formData)}
          >
            In báo cáo
          </MuiButton>
        </div>
      </div>
    );
    return (
      <div className={classes.expansion}>
        <Expansion
          title="II. Báo Cáo Số Lượng Khay Sọt Mượn/ Cho Mượn"
          rightActions={topToolbar}
          numberHeight={505}
          content={
            <FormData
              columnDefs={tableColumns}
              rowData={tableData}
              gridStyle={{ height: 381 }}
              customizePagination
              remotePagination
              totalCount={submittedValues.totalItem}
              pageIndex={submittedValues.pageIndex}
              onChangePage={this.onChangePage}
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              pageSize={submittedValues.pageSize}
              gridProps={{
                suppressMovable: true,
                suppressScrollOnNewData: true,
                suppressHorizontalScroll: true,
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
  classes: PropTypes.object,
  onPrint: PropTypes.func,
  onExportExcel: PropTypes.func,
  submittedValues: PropTypes.object,
  tableData: PropTypes.array,
  onSubmitForm: PropTypes.func,
  formData: PropTypes.object,
  totalRowData: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  submittedValues: selectors.formSubmittedValues(),
  formData: selectors.formData(),
  formValues: selectors.formValues(),
  totalRowData: selectors.totalRowData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onPrint: (formValues, formData, callback) =>
      dispatch(actions.printSelected(formValues, formData, callback)),
    onExportExcel: (formValues, formData) =>
      dispatch(actions.exportExcel(formValues, formData)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(style()),
  withConnect,
  withImmutablePropsToJS,
)(TableSection);
