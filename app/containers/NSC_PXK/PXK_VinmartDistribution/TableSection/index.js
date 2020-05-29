/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import Grid from '@material-ui/core/Grid';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { makeColumnDefs } from './columnDefs';
import appTheme from '../../../App/theme';
import MuiButton from '../../../../components/MuiButton';
import Expansion from '../../../../components/Expansion';
import ConfirmDialog from './confirmDialog';
import { showInfomation } from '../../../App/actions';

// eslint-disable-next-line no-unused-vars
const style = (theme = appTheme) => ({
  //
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
        },
      },
      MuiTableHead: {
        root: {
          background: '#000 !important',
        },
      },
      MuiPaper: {
        root: {
          '&>div': {
            overflowX: 'visible !important',
          },
          '&>div>div>div': {
            overflowY: 'visible !important',
          },
        },
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
  state = {
    openConfirmDialog: false,
  };

  closeConfirmDialog = () => {
    this.setState({ openConfirmDialog: false });
  };

  openConfirmDialog = () => {
    this.setState({ openConfirmDialog: true });
  };

  handleCreatingReceipt = () => {
    const { formik, onSubmitCreateExportReceipt } = this.props;
    onSubmitCreateExportReceipt(formik.values);
  };

  proceedCreatingReceipt = () => {};

  render() {
    const {
      formik,
      tableData,
      onFetchSoldToVinmartAutocomplete,
      formIsSubmitted,
      formSubmittedValues,
      dispatch,
      onExportExcel,
    } = this.props;

    const rightActions = (
      <Grid container justify="flex-end" spacing={24}>
        <Grid item>
          <MuiButton
            outline
            onClick={() => {
              const { values } = formik;
              const submitted = formSubmittedValues;

              formik
                .validateForm({ ...values, isCreatingReceipt: true })
                .then(res => {
                  if (Object.keys(res).length) {
                    formik.setFieldValue('isCreatingReceipt', true);

                    const touched = {};
                    Object.keys(res).forEach(key => {
                      touched[key] = true;
                    });
                    formik.setTouched(touched);
                  } else if (
                    formIsSubmitted &&
                    submitted &&
                    (submitted.org !== values.org ||
                      submitted.date !== values.date ||
                      submitted.customer.value !== values.customer.value)
                  ) {
                    dispatch(
                      showInfomation(
                        'Điều kiện tìm kiếm đã thay đổi. Vui lòng nhấn lại "TÌM KIẾM"',
                      ),
                    );
                  } else {
                    this.openConfirmDialog();
                  }
                });
            }}
            disabled={
              !tableData ||
              tableData.length < 2 ||
              (tableData[0].requireVM && !formik.values.soldToVinmart) ||
              (tableData[0].requireVMP && !formik.values.soldToVinmartPlus)
            }
          >
            Tạo phiếu xuất bán
          </MuiButton>
        </Grid>
        <Grid item>
          <MuiButton
            disabled={isEmpty(formSubmittedValues)}
            onClick={onExportExcel}
          >
            Xuất Excel
          </MuiButton>
        </Grid>
      </Grid>
    );

    const confirmDialog = (
      <ConfirmDialog
        open={this.state.openConfirmDialog}
        onClose={this.closeConfirmDialog}
        onConfirm={this.handleCreatingReceipt}
        formik={formik}
      />
    );

    const columnDefs = makeColumnDefs(formik, onFetchSoldToVinmartAutocomplete);

    return (
      <React.Fragment>
        <div style={{ minHeight: 430 }}>
          <Expansion
            title="II. THÔNG TIN HÀNG HÓA"
            rightActions={rightActions}
            noPadding
            content={
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
                    paging: false,
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
            }
          />
        </div>

        {confirmDialog}
      </React.Fragment>
    );
  }
}

TableSection.propTypes = {
  // classes: PropTypes.object,
  formik: PropTypes.object,
  tableData: PropTypes.array,
  // onUpdateTableData: PropTypes.func,
  onFetchSoldToVinmartAutocomplete: PropTypes.func,
  onSubmitCreateExportReceipt: PropTypes.func,
  formSubmittedValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  dispatch: PropTypes.func,
  onExportExcel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  tableData: selectors.tableData(),
  tableOriginalData: selectors.tableOriginalData(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onFetchSoldToVinmartAutocomplete: (inputValue, callback) =>
      dispatch(actions.fetchSoldToVinmartAutocomplete(inputValue, callback)),
    onSubmitCreateExportReceipt: formValues =>
      dispatch(actions.submitCreateExportReceipt(formValues)),
    onExportExcel: () => dispatch(actions.exportExcel()),
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
