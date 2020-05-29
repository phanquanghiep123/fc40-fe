import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Field, Form, Formik } from 'formik';
import appTheme from '../../../App/theme';
import { makeTableColumns } from './columnDefs';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { calcDateGap, convertDateString } from '../../../App/utils';
import MuiTable from '../../../../components/MuiTable/MuiTable';
import MuiPopup from '../../../../components/MuiPopup';
import MuiButton from '../../../../components/MuiButton';
import InputControl from '../../../../components/InputControl';
import { updateQuantitySchema } from '../Schema';
import MTablePagingCustomized from '../../../../components/MuiTable/MTablePagingCustomized';
import MuiTableBody from '../../../../components/MuiTable/MuiTableBody';
import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';
import { Can } from '../../../../authorize/ability-context';
import { formatToCurrency } from '../../../../utils/numberUtils';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
    overflowX: 'auto',
    width: 'inherit',
  },
  topToolbar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  topButton: {
    color: theme.palette.primary.main,
    background: '#fff',
    boxShadow: `0 1px 3px #aaa`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
  dateCell: {
    minWidth: '100%',
    minHeight: 36,
    paddingRight: 5,
    justifyContent: 'flex-end',
    cursor: 'pointer',
    borderRadius: 0,
    fontSize: 13,
    fontWeight: 'normal',
  },
  uploadInputContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  uploadBtn: {
    minWidth: '150px',
    marginTop: theme.spacing.unit * 2,
  },
});

class TableSection extends Component {
  state = {
    /* Update Popup */
    openUpdatePopup: false,
    currentRowData: {},
    currentColName: null,
    isEditable: false,

    /* Import Popup */
    openImportPopup: false,

    /* Confirm Import Popup */
    openConfirmImportPopup: false,
  };

  openUpdatePopup = (rowData, colName, isEditable) => {
    this.setState({
      openUpdatePopup: true,
      currentRowData: rowData,
      currentColName: colName,
      isEditable,
    });
  };

  closeUpdatePopup = () => {
    this.setState({ openUpdatePopup: false });
  };

  openImportPopup = () => {
    this.setState({ openImportPopup: true });
  };

  closeImportPopup = pr => {
    this.setState({ openImportPopup: false });

    // reset form values of import popup
    pr.setFieldValue('fileData', null);
    pr.setFieldValue('fileUpload', '');
    pr.setFieldValue('fileName', '');
  };

  openConfirmImportPopup = () => {
    this.setState({ openConfirmImportPopup: true });
  };

  closeConfirmImportPopup = () => {
    this.setState({ openConfirmImportPopup: false });
  };

  /**
   * Render popup update kế hoạch sản lượng
   * @returns {*}
   */
  renderUpdatePopupContent = () => {
    const { onUpdateQuantity, formSubmittedValues } = this.props;
    const { currentRowData, currentColName, isEditable } = this.state;
    if (!currentColName) return <div style={{ display: 'none' }} />;

    let currentCellData = currentRowData[currentColName];
    if (!currentCellData) {
      /**
       * Revert colName (format: date_dd/mm/yyyy) to Date Object
       * @param {string} colName
       * @return {Date}
       */
      const revertDateString = colName => {
        const [day, month, year] = colName.split('_')[1].split('/');
        return new Date(year, month - 1, day);
      };

      currentCellData = {
        planDate: revertDateString(currentColName).toISOString(),
      };
    }

    const { id, note, quantity, planDate } = currentCellData;
    const dateStr = convertDateString(planDate);

    const makeFieldAttr = pr => ({
      productionOrder: {
        name: 'productionOrder',
        label: 'LSX',
        component: InputControl,
        value: pr.values.productionOrder,
        onChange: pr.handleChange,
        disabled: true,
      },
      plantName: {
        name: 'plantName',
        label: 'Tên Farm',
        component: InputControl,
        value: pr.values.plantName,
        onChange: pr.handleChange,
        disabled: true,
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        component: InputControl,
        value: pr.values.productCode,
        onChange: pr.handleChange,
        disabled: true,
      },
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
        disabled: true,
      },
      quantity: {
        name: 'quantity',
        label: `Sản Lượng Ngày ${dateStr}` || 'Sản Lượng',
        component: InputControl,
        value: pr.values.quantity,
        onChange: pr.handleChange,
        disabled: !isEditable,
      },
      note: {
        name: 'note',
        label: 'Ghi Chú',
        component: InputControl,
        multiline: true,
        value: pr.values.note,
        onChange: pr.handleChange,
        disabled: !isEditable,
      },
    });

    return (
      <Formik
        enableReinitialize
        initialValues={{
          productionOrder: currentRowData.productionOrder || '',
          plantCode: currentRowData.plantCode,
          plantName: currentRowData.plantName || '',
          productCode: currentRowData.productCode || '',
          productName: currentRowData.productName || '',

          /* cell info */
          id,
          planDate,
          quantity: quantity || quantity === 0 ? quantity.toString() : '',
          note: note || '',
        }}
        validationSchema={updateQuantitySchema}
        onSubmit={(values, formikActions) => {
          onUpdateQuantity(values, formSubmittedValues);

          formikActions.setSubmitting(false);
          this.closeUpdatePopup();
        }}
        render={pr => {
          const fieldAttr = makeFieldAttr(pr);

          return (
            <Form>
              <DialogTitle>Kế Hoạch Sản Lượng</DialogTitle>
              <DialogContent>
                <Grid container spacing={40}>
                  <Grid item xs={6}>
                    <Field {...fieldAttr.productionOrder} />
                    <Field {...fieldAttr.plantName} />
                  </Grid>
                  <Grid item xs={6}>
                    <Field {...fieldAttr.productCode} />
                    <Field {...fieldAttr.productName} />
                  </Grid>
                </Grid>
                <Grid container spacing={40}>
                  <Grid item xs={6}>
                    <Field {...fieldAttr.quantity} />
                  </Grid>
                  <Grid item xs={6}>
                    <Field {...fieldAttr.note} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <MuiButton outline onClick={this.closeUpdatePopup}>
                  Đóng
                </MuiButton>
                <MuiButton onClick={pr.handleSubmit} disabled={!isEditable}>
                  Lưu
                </MuiButton>
              </DialogActions>
            </Form>
          );
        }}
      />
    );
  };

  /**
   * Render popup import kế hoạch sản lượng
   * @returns {*}
   */
  renderImportPopupContent = pr => {
    const { classes } = this.props;

    const fieldAttr = {
      fileName: {
        name: 'fileName',
        label: 'File Kế Hoạch Sản Lượng',
        value: pr.values.fileName,
        onChange: pr.handleChange,
        component: InputControl,
        disabled: true,
      },
      fileUpload: {
        name: 'fileUpload',
        type: 'file',
        accept: '.csv',
        value: pr.values.fileUpload,
        onChange: e => {
          pr.handleChange(e);
          if (e.currentTarget.files && e.currentTarget.files[0]) {
            pr.setFieldValue('fileData', e.currentTarget.files[0]);
            pr.setFieldValue('fileName', e.currentTarget.files[0].name);
          }
        },
        style: {
          display: 'none',
        },
      },
    };

    return (
      <Form>
        <DialogTitle>Tải Lên Kế Hoạch Sản Lượng</DialogTitle>
        <DialogContent>
          <Grid container spacing={40}>
            <Grid item xs={12}>
              <div className={classes.uploadInputContainer}>
                <Field {...fieldAttr.fileName} />
                <MuiButton
                  outline
                  component="label"
                  className={classes.uploadBtn}
                >
                  Chọn File
                  <input {...fieldAttr.fileUpload} />
                </MuiButton>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MuiButton outline onClick={() => this.closeImportPopup(pr)}>
            Đóng
          </MuiButton>
          <MuiButton
            onClick={this.openConfirmImportPopup}
            disabled={!pr.values.fileData}
          >
            Tải Lên
          </MuiButton>
        </DialogActions>

        {/* Confirm import */}
        <MuiPopup
          open={this.state.openConfirmImportPopup}
          onClose={this.closeConfirmImportPopup}
          content={this.renderConfirmImportDialogContent(pr)}
          dialogProps={{
            maxWidth: 'sm',
          }}
        />
      </Form>
    );
  };

  /**
   * @param pr - formik props
   * @returns {*}
   */
  renderConfirmImportDialogContent = pr => {
    const { fileName } = pr.values;

    return (
      <React.Fragment>
        <DialogTitle>Cảnh Báo</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn thực hiện tải lên file &quot;
            <strong>{fileName}</strong>
            &quot;
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton outline onClick={this.closeConfirmImportPopup}>
            Không
          </MuiButton>
          <MuiButton
            onClick={() => {
              pr.handleSubmit();
              this.closeConfirmImportPopup();
            }}
          >
            Có
          </MuiButton>
        </DialogActions>
      </React.Fragment>
    );
  };

  /**
   * Dynamically define date columns for table
   * @returns {[]}
   */
  defineDateColumns = () => {
    const { classes, formDefaultValues, formSubmittedValues } = this.props;
    // const currentDate = new Date();

    const dateColumnDefs = [];
    const { dateFrom, dateTo } = formSubmittedValues || formDefaultValues;
    const numOfDateColumns = calcDateGap(dateFrom, dateTo) + 1;

    if (numOfDateColumns) {
      const date = new Date(dateFrom);

      for (let i = 0; i < numOfDateColumns; i += 1) {
        /* #16781 Cho phép update ngày thu hoạch của cả quá khứ
        // const isEditable = calcDateGap(currentDate, date) > 0;
		*/
        const isEditable = true;

        const dateString = convertDateString(date);
        dateColumnDefs.push({
          title: dateString,
          field: `date_${dateString}.quantity`,
          headerStyle: {
            textAlign: 'right',
            paddingRight: 5,
          },
          cellStyle: {
            textAlign: 'right',
            padding: 0,
          },

          /* make the cell clickable to open the popup */
          render: rowData => (
            <Button
              variant="text"
              className={classes.dateCell}
              onClick={() =>
                this.openUpdatePopup(rowData, `date_${dateString}`, isEditable)
              }
              disabled={
                !rowData || (!rowData[`date_${dateString}`] && !isEditable)
              }
            >
              {rowData[`date_${dateString}`]
                ? formatToCurrency(rowData[`date_${dateString}`].quantity)
                : ''}
            </Button>
          ),

          sorting: false,
        });

        // Increase date by 1
        date.setDate(date.getDate() + 1);
      }
    }

    return dateColumnDefs;
  };

  /**
   * Export Excel with submitted form values
   */
  exportExcelHandler = () => {
    const { formSubmittedValues } = this.props;
    this.props.onExportExcel(formSubmittedValues);
  };

  render() {
    const {
      classes,
      tableData,
      formSubmittedValues,
      onFetchTableData,
      onImportCSV,
    } = this.props;
    const dateColumnDefs = this.defineDateColumns();
    const tableColumns = makeTableColumns(dateColumnDefs);

    const topToolbar = (
      <div className={classes.topToolbar}>
        <div className={classes.topToolbarPart}>
          <Typography variant="h6">II. Thông Tin Kế Hoạch Sản Lượng</Typography>
        </div>
        <div className={classes.topToolbarPart}>
          <Can do={CODE.taoDSKHSL} on={SCREEN_CODE.DSKHSL} passThrough>
            {can => (
              <MuiButton outline onClick={this.openImportPopup} disabled={!can}>
                Tải Lên Kế Hoạch Sản Lượng
              </MuiButton>
            )}
          </Can>

          <MuiButton
            outline
            onClick={this.exportExcelHandler}
            disabled={!tableData.length}
          >
            Xuất Excel
          </MuiButton>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          {topToolbar}
          <MuiTable
            data={tableData}
            columns={tableColumns}
            components={{
              Body: props => (
                <MuiTableBody
                  {...props}
                  renderData={tableData}
                  currentPage={0}
                />
              ),
              Pagination: props => (
                <MTablePagingCustomized
                  {...props}
                  formValues={formSubmittedValues}
                  onSubmit={onFetchTableData}
                />
              ),
            }}
            onOrderChange={(colIndex, direction) => {
              const sortKey = tableColumns[colIndex]
                ? tableColumns[colIndex].field
                : '';

              onFetchTableData({
                ...formSubmittedValues,
                sortKey,
                sortType: direction,
              });
            }}
            options={{
              toolbar: false,
              search: false,
              showTitle: false,
              columnsButton: false,
              exportButton: false,
              selection: false,
              addRowPosition: 'last',
              showSelectAllCheckbox: false,
              emptyRowsWhenPaging: false,
            }}
          />
        </Paper>

        {/* popup update kế hoạch sản lượng */}
        <MuiPopup
          open={this.state.openUpdatePopup}
          onClose={this.closeUpdatePopup}
          content={this.renderUpdatePopupContent()}
        />

        {/* popup import kế hoạch sản lượng */}
        <Formik
          enableReinitialize
          initialValues={{
            fileName: '',
            fileUpload: '',
          }}
          onSubmit={(values, formikActions) => {
            onImportCSV(values, formSubmittedValues);
            formikActions.setSubmitting(false);
            this.closeImportPopup(formikActions);
          }}
          render={pr => (
            <MuiPopup
              open={this.state.openImportPopup}
              onClose={() => this.closeImportPopup(pr)}
              content={this.renderImportPopupContent(pr)}
              dialogProps={{ maxWidth: 'sm' }}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  tableData: PropTypes.array,
  formSubmittedValues: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFetchTableData: PropTypes.func,
  onExportExcel: PropTypes.func,
  onImportCSV: PropTypes.func,
  onUpdateQuantity: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tableData: makeSelect.tableData(),
  selectedRecords: makeSelect.tableSelectedRecords(),
  formSubmittedValues: makeSelect.formSubmittedValues(),
  formDefaultValues: makeSelect.formDefaultValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchTableData: formValues =>
      dispatch(actions.fetchTableData(formValues)),
    onExportExcel: submittedValues =>
      dispatch(actions.exportExcel(submittedValues)),
    onImportCSV: (formValues, searchFormValues) =>
      dispatch(actions.importCSV(formValues, searchFormValues)),
    onUpdateQuantity: (rowData, cellData) =>
      dispatch(actions.updateQuantity(rowData, cellData)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(TableSection);
