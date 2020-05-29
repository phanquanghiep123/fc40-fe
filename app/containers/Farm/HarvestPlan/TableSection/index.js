import React, { PureComponent } from 'react';
import FormDataFree from 'components/FormikUI/FormDataFree';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { Paper, Typography, withStyles } from '@material-ui/core';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import MuiButton from 'components/MuiButton';
import { connect } from 'react-redux';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import MuiInputEditor from 'components/MuiInput/Editor';
import { showWarning } from 'containers/App/actions';
import CellRenderer from 'components/FormikUI/CellRenderer';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import { Formik } from 'formik';
import { multiplyNumbers, divideNumbers } from 'utils/numberUtils';
import { findIndex, isEmpty } from 'lodash';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { NUM_DIGITS } from 'utils/constants';
import CheckboxRenderer from './CheckboxRenderer';
import * as constants from '../constants';
import * as selectors from '../selectors';
import rendererActions from './rendererActions';
import './style.css';
import { validationSchema } from './Schema';
import { convertDateString } from '../../../App/utils';
import appTheme from '../../../App/theme';
const styles = theme => ({
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
class TableSection extends PureComponent {
  isTruthy = value =>
    value !== false &&
    value !== '0' &&
    value !== '' &&
    value !== `` &&
    value !== 0 &&
    value !== '' &&
    value !== undefined &&
    value !== null;

  valueFormatter = ({ data, colDef }) =>
    Number.isNaN(Number.parseFloat(data[colDef.field]))
      ? ''
      : `${multiplyNumbers(data[colDef.field], 100)}%`;

  valueGetter = ({ data, colDef }) =>
    Number.isNaN(Number.parseFloat(data[colDef.field]))
      ? ''
      : multiplyNumbers(data[colDef.field], 100);

  checkProductionOrderCodeEditable = ({ data, context }) => {
    const { id, details } = context.props.tableData[data.currentIndex];
    return (
      data.editting &&
      (id === undefined ||
        (details[data.subIndex] && details[data.subIndex].id === undefined))
    );
  };

  getTotalDetails = data => console.log(data);

  columnDefs = [
    {
      headerName: 'STT',
      width: 50,
      field: 'viewIndex',
      editable: false,
      resizable: true,
      rowSpan: ({ data }) => data.rowSpan,
      // data.rowSpan,
      cellClassRules: {
        'show-cell-row-span-left': 'data.subIndex === data.lengthDetails ',
        'show-cell-stt': 'data.rowSpan !== undefined',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      valueFormatter: ({
        data,
        context: {
          props: { tableMeta },
        },
      }) => {
        if (data.viewIndex)
          return data.viewIndex + tableMeta.pageSize * tableMeta.pageIndex;
        return '';
      },
      pinned: 'left',
    },
    {
      headerName: 'Lệnh Sản Xuất',
      width: 120,
      resizable: true,
      editable: this.checkProductionOrderCodeEditable,
      cellStyle: params => {
        if (this.checkProductionOrderCodeEditable(params)) {
          return { backgroundColor: appTheme.palette.background.default };
        }
        return null;
      },
      field: 'productionOrderCode',
      cellEditorFramework: MuiSelectEditor,
      cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, data }) => ({
        valueKey: 'productionOrderCode',
        labelKey: 'productionOrderCode',
        isClearable: true,
        promiseOptions: (inputText, callback) => {
          const { planningCode } = context.props.tableData[data.currentIndex];
          context.props.onGetProductionOrdersByPlanningCode({
            inputText,
            planningCode: planningCode || '',
            callback,
          });
        },
        SelectProps: {
          menuPosition: 'fixed',
        },
        onChange: selected => {
          const {
            productCode,
            productName,
            planningName,
            plantCode,
            processDate,
            productionOrderCode,
          } = selected;
          const childUpdate = {
            productCode,
            productName,
            productionOrderCode,
            rawQuantity: 0,
          };
          const details = [
            ...context.props.tableData[data.currentIndex].details,
          ];
          details[data.subIndex] = childUpdate;
          context.props.onChangeProductionOrderCode({
            index: data.currentIndex,
            selected: {
              // ...data,
              plantCode,
              processDate,
              planningCode: selected.planningCode,
              planningName,
              details,
            },
          });
        },
      }),
      pinned: 'left',
    },
    {
      headerName: 'Mã Sản Phẩm',
      resizable: true,
      width: 100,
      field: 'productCode',
      pinned: 'left',
      editable: false,
    },
    {
      headerName: 'Tên Sản Phẩm',
      resizable: true,
      field: 'productName',
      pinned: 'left',
      editable: false,
    },
    {
      headerName: 'Sản Lượng Thô',
      width: 100,
      resizable: true,
      field: 'rawQuantity',
      editable: false,
      valueFormatter: ({ data }) => {
        if (
          data.editting &&
          this.isTruthy(data.quantityType1) &&
          this.isTruthy(data.recoveryRate) &&
          data.planningDivideQuantityDetail === 0
        ) {
          return divideNumbers(data.quantityType1, data.recoveryRate).toFixed(
            NUM_DIGITS,
          );
        }
        if (
          this.isTruthy(data.allocationRateQuantityType1) &&
          this.isTruthy(data.recoveryRate) &&
          data.planningDivideQuantityDetail > 0
        ) {
          return divideNumbers(
            multiplyNumbers(
              data.planningDivideQuantityDetail,
              data.allocationRateQuantityType1,
            ),
            data.recoveryRate,
          ).toFixed(NUM_DIGITS);
        }
        return data.rawQuantity;
      },
    },
    {
      headerName: 'Tỷ Lệ Thu Hồi',
      width: 120,
      field: 'recoveryRate',
      resizable: true,
      cellEditorFramework: MuiInputEditor,
      valueFormatter: this.valueFormatter,
      valueGetter: this.valueGetter,
      cellStyle: params => {
        if (params.data.editting) {
          return { backgroundColor: appTheme.palette.background.default };
        }
        return null;
      },
    },
    {
      headerName: 'Tỷ Lệ Phân Bổ SL Loại 1/LSX',
      width: 120,
      resizable: true,
      field: 'allocationRateQuantityType1',
      cellEditorFramework: MuiInputEditor,
      valueFormatter: this.valueFormatter,
      valueGetter: this.valueGetter,
      cellStyle: params => {
        if (params.data.editting) {
          return { backgroundColor: appTheme.palette.background.default };
        }
        return null;
      },
    },
    {
      editable: false,
      headerName: 'Tỷ Lệ Đáp Ứng SL So Với Order',
      width: 120,
      resizable: true,
      field: 'reponseRateQuantityByOrder',
      cellEditorFramework: MuiInputEditor,
      valueFormatter: ({ data, colDef, context }) => {
        if (
          data.editting &&
          this.isTruthy(data.planningDivideQuantity) &&
          this.isTruthy(data.quantityType1) &&
          this.isTruthy(data.allocationRateQuantityType1)
        ) {
          return context.valueFormatter({
            data: {
              reponseRateQuantityByOrder: divideNumbers(
                multiplyNumbers(
                  data.quantityType1,
                  data.allocationRateQuantityType1,
                ),
                data.planningDivideQuantity,
              ).toFixed(NUM_DIGITS),
            },
            colDef,
          });
        }
        return context.valueFormatter({ data, colDef });
      },
    },
    {
      headerName: 'Ngoài Kế Hoạch',
      width: 100,
      resizable: true,
      field: 'isOutOfPlan',
      editable: false,
      cellRendererFramework: CheckboxRenderer,
      cellRendererParams: ({ context }) => ({
        disabled: true,
        onConfirmShow: context.onConfirmShow,
        onDeletePlanning: this.props.onDeletePlanning,
      }),
    },
    {
      headerName: 'Sản Lượng L1',
      width: 100,
      resizable: true,
      field: 'quantityType1',
      cellEditorFramework: MuiInputEditor,
      editable: params => params.data.editting && params.data.isOutOfPlan,
      cellStyle: params => {
        if (params.data.editting && params.data.isOutOfPlan) {
          return { backgroundColor: appTheme.palette.background.default };
        }
        return null;
      },
    },
    {
      headerName: 'SL Chia Dự Kiến',
      width: 120,
      resizable: true,
      field: 'planningDivideQuantity',
      rowSpan: ({ data }) => data.rowSpan,
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      editable: false,
    },
    {
      headerName: 'Mã Kế Hoạch',
      width: 100,
      resizable: true,
      field: 'planningCode',
      rowSpan: ({ data }) => data.rowSpan,
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      editable: false,
    },
    {
      headerName: 'Tên Kế Hoạch',
      resizable: true,
      editable: false,
      field: 'planningName',
      rowSpan: ({ data }) => data.rowSpan,
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
    },
    {
      headerName: 'Farm',
      width: 100,
      resizable: true,
      field: 'plantCode',
      rowSpan: ({ data }) => data.rowSpan,
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      editable: false,
    },
    {
      headerName: 'Ngày Đi Hàng',
      rowSpan: ({ data }) => data.rowSpan,
      editable: false,
      resizable: true,
      field: 'processDate',
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      width: 120,
      valueFormatter: params => convertDateString(params.data.processDate),
    },
    {
      headerName: 'Hành Động',
      field: 'editMode',
      resizable: true,
      width: 100,
      pinned: 'right',
      rowSpan: ({ data }) => data.rowSpan,
      cellClassRules: {
        'show-cell': 'data.rowSpan !== undefined',
        'show-cell-row-span-right': 'data.subIndex === data.lengthDetails',
        'show-cell-1-row': 'data.rowSpan === 1',
      },
      cellRendererFramework: rendererActions,
      cellRendererParams: ({ data, context }) => ({
        //   editMode: data.editMode,
        addRow: () => {
          const editRowIndex = findIndex(context.props.tableData, {
            editMode: true,
          });
          if (editRowIndex > -1) {
            context.props.showWarning();
          } else {
            context.props.onAddRow({ rowindex: data.currentIndex, values: {} });
          }
        },
        cancel: () => {
          // cancel add

          // cancel edit
          context.props.onCancelEditRow({ rowindex: data.currentIndex });
        },
        save: () => {
          context.formik.submitForm().then(() => {
            if (!isEmpty(context.formik.errors)) {
              context.props.showWarning(
                'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
              );
            } else {
              context.props.onSaveRow({ rowindex: data.currentIndex });
            }
          });
        },
        update: () => {
          const editRowIndex = findIndex(context.props.tableData, {
            editMode: true,
          });
          if (editRowIndex > -1) {
            context.props.showWarning();
          } else {
            context.props.onUpdatePlan({
              rowindex: data.currentIndex,
              values: {},
            });
          }
        },
      }),
      editable: false,
    },
  ];

  defaultColDef = {
    editable: params => params.data.editting,
    valueSetter: ({ context, data, colDef, newValue }) => {
      context.props.onEditElement({
        index: data.currentIndex,
        subIndex: data.subIndex,
        field: colDef.field,
        newValue,
      });
    },
  };

  components = { rendererActions };

  toUIFormat = data =>
    data.reduce((accumulator, currentValue, currentIndex) => {
      const appender = { ...currentValue };
      delete appender.details;
      if (currentValue.details.length > 0) {
        return accumulator.concat([
          ...currentValue.details.map((item, subIndex) => {
            if (subIndex === 0) {
              return {
                ...item,
                ...appender,
                rowSpan: currentValue.details.length,
                currentIndex,
                subIndex,
                viewIndex: currentIndex + 1,
                subId: item.id,
                lengthDetails: currentValue.details.length - 1,
                planningDivideQuantityDetail:
                  currentValue.planningDivideQuantity,
              };
            }
            return {
              ...item,
              currentIndex,
              subIndex,
              subId: item.id,
              lengthDetails: currentValue.details.length - 1,
              planningDivideQuantityDetail: currentValue.planningDivideQuantity,
            };
          }),
        ]);
      }
      return accumulator.concat({
        rowSpan: 1,
        viewIndex: currentIndex + 1,
        currentIndex,
        ...appender,
      });
    }, []);

  onChangeRowsPerPage = pageSize => {
    const { onSubmit, submittedValues } = this.props;
    if (
      submittedValues.totalItem <
      (pageSize - 1) * submittedValues.pageIndex
    ) {
      submittedValues.pageIndex =
        Math.ceil(submittedValues.totalItem / pageSize) - 1;
    }
    submittedValues.pageSize = pageSize;
    onSubmit({ values: submittedValues });
  };

  onChangePage = pageIndex => {
    if (pageIndex !== this.props.submittedValues.pageIndex) {
      const { onSubmit, submittedValues } = this.props;
      submittedValues.pageIndex = pageIndex;
      onSubmit({ values: submittedValues });
    }
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  formik = null;

  tableRef = null;

  handleAddNewPlan = () => {
    this.props.onAddNewPlan();

    setTimeout(() => {
      this.tableRef.gridApi.ensureIndexVisible(
        this.props.tableData.length - 1,
        'top',
      );
      this.tableRef.gridApi.ensureColumnVisible('rawQuantity');
    }, 400);
    window.scrollTo(0, document.body.scrollHeight);
  };

  render() {
    const { classes, tableData, tableMeta } = this.props;
    const data = this.toUIFormat(tableData);
    const editRowIndex = findIndex(data, {
      editMode: true,
    });
    const editMode = editRowIndex > -1;
    return (
      <Paper>
        <div className={classes.topToolbar}>
          <div className={classes.topToolbarPart}>
            <Typography variant="h6">
              II. Thông Tin Kế Hoạch Thu Hoạch
            </Typography>
          </div>
          <div className={classes.topToolbarPart}>
            <Can do={CODE.taoKHTH} on={SCREEN_CODE.KHTH}>
              <MuiButton onClick={this.handleAddNewPlan} disabled={editMode}>
                Thêm Mới
              </MuiButton>
            </Can>
            <MuiButton onClick={this.props.onCheckNewPlan}>
              Cập Nhật Kế Hoạch
            </MuiButton>
            <MuiButton
              onClick={this.props.onExportExcel}
              disabled={data.length === 0 || editMode}
            >
              Xuất Excel
            </MuiButton>
          </div>
        </div>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
        <Formik
          initialValues={{ tableData: data }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={() => {}}
          render={formik => {
            this.formik = formik;
            return (
              <FormDataFree
                onRef={ref => {
                  this.tableRef = ref;
                }}
                name="tableData"
                gridStyle={{ height: 470 }}
                columnDefs={this.columnDefs}
                defaultColDef={this.defaultColDef}
                gridProps={{
                  context: this,
                  suppressRowTransform: true,
                  getRowStyle: this.getRowStyle,
                }}
                components={this.components}
                rowData={formik.values.tableData}
                minHeight={47}
                customizePagination
                remotePagination
                pageSize={tableMeta.pageSize}
                totalCount={tableMeta.count}
                pageIndex={tableMeta.pageIndex}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                onChangePage={this.onChangePage}
                ignoreSuppressColumns={['productionOrderCode']}
                {...formik}
              />
            );
          }}
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  onEditField: PropTypes.func,
  onExportExcel: PropTypes.func,
  tableData: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  tableData: selectors.tableData(),
  tableMeta: selectors.tableMeta(),
  submittedValues: selectors.submittedValues(),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onExportExcel: payload =>
    dispatch({ type: constants.EXPORT_EXCELL, payload }),
  onEditField: payload => dispatch({ type: constants.EDIT_FIELD, payload }),
  onAddRow: payload => dispatch({ type: constants.ADD_ROW, payload }),
  onCancelEditRow: payload =>
    dispatch({ type: constants.CANCEL_EDIT_ROW, payload }),
  showWarning: (
    mes = 'Vui lòng hoàn tất dòng đang được chỉnh sửa trước khi thêm dòng mới',
  ) => dispatch(showWarning(mes)),
  onSaveRow: payload => dispatch({ type: constants.SAVE_ROW, payload }),
  onSubmit: payload => dispatch({ type: constants.SUBMIT_FORM, payload }),
  onAddNewPlan: () => dispatch({ type: constants.ADD_NEW_PLAN }),
  onUpdatePlan: payload => dispatch({ type: constants.UPDATE_PLAN, payload }),
  onEditElement: payload => dispatch({ type: constants.EDIT_ELEMENT, payload }),
  onGetProductionOrdersByPlanningCode: payload =>
    dispatch({
      type: constants.GET_PRODUCTION_ORDERS_BY_PLANNING_CODE,
      payload,
    }),
  onCheckNewPlan: payload =>
    dispatch({ type: constants.CHECK_NEW_PLAN, payload }),
  onChangeProductionOrderCode: payload =>
    dispatch({ type: constants.CHANGE_PRODUCTION_ORDER_CODE, payload }),
  onDeletePlanning: payload =>
    dispatch({ type: constants.DELETE_PLANNING, payload }),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(styles),
)(TableSection);
