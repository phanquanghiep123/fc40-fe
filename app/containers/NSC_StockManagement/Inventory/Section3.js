import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormData from 'components/FormikUI/FormData';
import Expansion from 'components/Expansion';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MuiButton from 'components/MuiButton';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { getColumnDefs } from 'utils/transformUtils';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import MuiInputEditor from 'components/MuiInput/Editor';
import PropTypes from 'prop-types';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import CellRenderer from 'components/FormikUI/CellRenderer';
import NumberFormatter from 'components/NumberFormatter';
import { withStyles } from '@material-ui/core';
import { validInteger, validDecimal } from 'components/NumberFormatter/utils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import appTheme from 'containers/App/theme';
import { BasketSchema, PalletSchema, ScaleSchema } from './Schema';
import { getDataMaster } from './selectors';
import ActionsRenderer from './ActionsRenderer';
import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  add: {
    margin: 0,
  },
  actions: {
    padding: 0,
    paddingTop: theme.spacing.unit,
    justifyContent: 'flex-end',
  },
});

export const orderNumberRenderer = ({ rowIndex }) => rowIndex + 1;

export const numericParser = params => formatToNumber(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numberFormatter = params => formatToNumber(params.value) || '';

class Section3 extends Component {
  componentDidMount() {
    this.props.onRef(this);
    setTimeout(() => this.addRecords(10));
  }

  columns = {
    stt: {
      headerName: 'Lần Cân',
      field: 'id',
      width: 60,
      editable: false,
      suppressSizeToFit: true,
      cellRendererFramework: orderNumberRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    baskets: {
      headerName: 'Khay Sọt',
      group: {
        palletBasketCode: {
          headerName: 'Mã Sọt',
          field: 'palletBasketCode',
          width: 80,
          editable: params => !params.data.totalCol,
          cellEditorFramework: MuiSelectInputEditor,
          suppressSizeToFit: true,
          cellEditorParams: ({ context, rowIndex }) => ({
            options: this.props.dataMaster.baskets,
            valueKey: 'palletBasketCode',
            labelKey: 'palletBasketCode',
            sublabelKey: 'palletBasketName',
            isClearable: true,
            isSearchable: true,
            onChange: option => {
              const updaterData = {
                ...BasketSchema.cast(option || undefined),
                basketQuantity: 0,
              };
              context.updateFieldArrayValue(
                'turnToScales',
                rowIndex,
                updaterData,
              );
            },
          }),
        },
        palletBasketName: {
          headerName: 'Tên Sọt',
          field: 'palletBasketName',
          tooltipField: 'palletBasketName',
          editable: false,
          pinnedRowCellRenderer: 'customPinnedRowRenderer',
          pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
        },

        basketQuantity: {
          headerName: 'Số Sọt',
          field: 'basketQuantity',
          width: 100,
          editable: params => !!params.data.palletBasketCode,
          headerClass: 'ag-border-right',
          valueParser: numericParser,
          valueFormatter: numberFormatter,
          cellEditorFramework: MuiInputEditor,
          cellRendererFramework: CellRenderer,
          cellEditorParams: {
            InputProps: {
              inputComponent: NumberFormatter,
              inputProps: {
                isAllowed: validInteger,
              },
            },
          },
          pinnedRowCellRenderer: 'customPinnedRowRenderer',
          pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
        },
      },
    },
    pallets: {
      headerName: 'Pallet',
      group: {
        palletCode: {
          headerName: 'Mã Pallet',
          field: 'palletCode',
          width: 80,
          cellEditorFramework: MuiSelectInputEditor,
          editable: params => !params.data.totalCol,
          suppressSizeToFit: true,
          cellEditorParams: ({ context, rowIndex }) => ({
            options: this.props.dataMaster.pallets,
            valueKey: 'palletCode',
            labelKey: 'palletCode',
            sublabelKey: 'palletName',
            isClearable: true,
            isSearchable: true,
            pinnedRowCellRenderer: 'customPinnedRowRenderer',
            onChange: option => {
              const updaterData = {
                ...PalletSchema.cast(option || undefined),
                palletQuantity: 0,
              };

              context.updateFieldArrayValue(
                'turnToScales',
                rowIndex,
                updaterData,
              );
            },
          }),
        },
        palletName: {
          headerName: 'Tên Pallet',
          field: 'palletName',
          tooltipField: 'palletName',
          editable: false,
        },
        palletQuantity: {
          headerName: 'Số Pallet',
          field: 'palletQuantity',
          width: 100,
          editable: params => !!params.data.palletCode,
          headerClass: 'ag-border-right',
          valueParser: numericParser,
          valueFormatter: numberFormatter,
          cellEditorFramework: MuiInputEditor,
          cellRendererFramework: CellRenderer,
          pinnedRowCellRenderer: 'customPinnedRowRenderer',
          pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
          cellEditorParams: {
            InputProps: {
              inputComponent: NumberFormatter,
              inputProps: {
                isAllowed: validInteger,
              },
            },
          },
        },
      },
    },
    scalesWeight: {
      headerName: 'Khối Lượng Cân (*)',
      field: 'scalesWeight',
      editable: params => !params.data.totalCol,
      valueParser: decimalParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    realWeight: {
      headerName: 'Khối Lượng Thực',
      field: 'realWeight',
      minWidth: 50,
      cellRendererFramework: CellRenderer,
      editable: false,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
    },
    actions: {
      headerName: '',
      field: 'actions',
      width: 30,
      cellClass: 'cell-action-butons',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      cellRendererFramework: ActionsRenderer,
      suppressNavigable: true,
      editable: false,
      suppressSizeToFit: true,
    },
  };

  customerColumn = {
    stt: this.columns.stt,
    baskets: this.columns.baskets,
    pallets: this.columns.pallets,
    scalesWeight: this.columns.scalesWeight,
    realWeight: this.columns.realWeight,
    actions: this.columns.actions,
  };

  columnDefs = getColumnDefs(this.customerColumn);

  addRecords = (row = 5) => {
    const records = [];
    const { formik } = this.props;
    const data = {
      id: formik.values.basket.id || 0,
      palletBasketCode: formik.values.basket.palletBasketCode,
      palletBasketName: formik.values.basket.palletBasketName,
      basketQuantity: 0,
      basketWeight: formik.values.basket.basketWeight,
      palletCode: formik.values.pallet.palletCode,
      palletName: formik.values.pallet.palletName,
      palletQuantity: formik.values.basket.palletQuantity || 0,
      palletWeight: formik.values.pallet.palletWeight,
      scalesWeight: '',
      realWeight: '',
    };
    for (let i = 0; i < row; i += 1) {
      records.push(data);
    }
    const valueNew = [];
    formik.values.turnToScales.forEach(item => {
      if (item.realWeight) {
        valueNew.push(item);
      } else {
        valueNew.push(data);
      }
      formik.setFieldValue('turnToScales', valueNew);
    });

    this.props.formik.setFieldValue('turnToScales', [...valueNew, ...records]);
  };

  addRecordsHandle = () => {
    this.addRecords();
  };

  defaultColDef = {
    editable: true,
    valueSetter: params => {
      let updaterData = {
        realWeight: undefined,
        [params.colDef.field]: params.newValue,
      };

      if (
        params.data.scalesWeight === undefined &&
        params.data.palletBasketCode === undefined &&
        params.data.palletCode === undefined
      ) {
        updaterData = {
          ...ScaleSchema.cast({
            scalesWeight: null,
            palletBasketCode: null,
            palletCode: null,
          }),
          ...updaterData,
        };
        if (params.colDef.field === 'scalesWeight') {
          updaterData = {
            ...updaterData,
            realWeight: formatToDecimal(updaterData.scalesWeight),
          };
        }
      }

      params.context.updateFieldArrayValue(
        'turnToScales',
        params.node.rowIndex,
        updaterData,
      );
      return true;
    },
  };

  defaultTurnScales = () => {
    const valueNew = [];
    const { formik } = this.props;
    formik.values.turnToScales.forEach(item => {
      if (item.realWeight) {
        valueNew.push(item);
      } else {
        const data = {
          id: formik.values.basket.id || 0,
          palletBasketCode: formik.values.basket.palletBasketCode,
          palletBasketName: formik.values.basket.palletBasketName,
          basketQuantity: 0,
          basketWeight: formik.values.basket.basketWeight,
          palletCode: formik.values.pallet.palletCode,
          palletName: formik.values.pallet.palletName,
          palletQuantity: formik.values.basket.palletQuantity || 0,
          palletWeight: formik.values.pallet.palletWeight,
          scalesWeight: '',
          realWeight: '',
        };
        valueNew.push(data);
      }
      formik.setFieldValue('turnToScales', valueNew);
    });
  };

  onCellValueChanged = event => {
    const { rowIndex, colDef, oldValue } = event;
    const rowItem = this.props.formik.values.turnToScales[rowIndex];
    const warningBasket = `Khối Lượng Thực không được âm, vui lòng thay đổi Khối Lượng Cân trước khi nhập lại Số Sọt`;
    const warningPallet = `Khối Lượng Thực không được âm, vui lòng thay đổi Khối Lượng Cân trước khi nhập lại Số Pallet`;
    const warningQuantity = `Khối Lượng Thực không được âm, vui lòng nhập lại Khối Lượng Cân`;
    if (this.props.formik.values.product.uom === 'KG') {
      if (rowItem.scalesWeight === 0 && colDef.field === 'scalesWeight') {
        if (!rowItem.basketCode && !rowItem.palletCode) {
          this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
            realWeight: 0,
          });
        }
      }
      if (rowItem.scalesWeight > 0) {
        let real =
          rowItem.scalesWeight -
          (rowItem.basketQuantity * (rowItem.basketWeight || 0) +
            rowItem.palletQuantity * (rowItem.palletWeight || 0));

        if (real < 0) {
          if (colDef.field === 'basketQuantity') {
            this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
              basketQuantity: oldValue,
            });
            real =
              rowItem.scalesWeight -
              (oldValue * rowItem.basketWeight +
                rowItem.palletQuantity * (rowItem.palletWeight || 0));
            this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
              realWeight: formatToDecimal(real, 2),
            });
            this.props.showWarning(warningBasket);
            return false;
          }
          if (colDef.field === 'palletQuantity') {
            this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
              palletQuantity: oldValue,
            });
            real =
              rowItem.scalesWeight -
              (rowItem.basketQuantity * (rowItem.basketWeight || 0) +
                oldValue * rowItem.palletWeight);
            this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
              realWeight: formatToDecimal(real, 2),
            });
            this.props.showWarning(warningPallet);
            return false;
          }
          if (colDef.field === 'scalesWeight') {
            real =
              oldValue -
              (rowItem.basketQuantity * (rowItem.basketWeight || 0) +
                rowItem.palletQuantity * (rowItem.palletWeight || 0));
            this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
              scalesWeight: oldValue,
            });
            if (real > 0) {
              this.props.formik.updateFieldArrayValue(
                'turnToScales',
                rowIndex,
                {
                  realWeight: formatToDecimal(real, 2),
                },
              );
            }
            this.props.showWarning(warningQuantity);
            return false;
          }
        }
        this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
          realWeight: formatToDecimal(real, 2),
        });
      }
    } else {
      this.props.formik.updateFieldArrayValue('turnToScales', rowIndex, {
        realWeight: rowItem.scalesWeight,
      });
    }
    let sum = 0;
    this.props.formik.values.turnToScales.forEach(item => {
      if (item.realWeight) {
        sum = item.realWeight + sum;
      }
    });
    this.props.formik.setFieldValue(
      'product[stockTakingQuantity]',
      formatToDecimal(sum, 2),
    );
    const weightDifference =
      sum - (this.props.formik.values.product.inventoryQuantity || 0);
    let rateDifference = 0;
    if (this.props.formik.values.product.inventoryQuantity === 0) {
      rateDifference = 100;
    } else {
      rateDifference =
        (weightDifference /
          this.props.formik.values.product.inventoryQuantity) *
        100;
    }

    const text = `${formatToDecimal(
      weightDifference,
      2,
    )}       ${formatToDecimal(rateDifference, 2)}%`;
    this.props.formik.setFieldValue('product[differentRatio]', text);
    this.props.formik.setFieldValue(
      'product[weightDifference]',
      weightDifference,
    );
    this.props.formik.setFieldValue('product[rateDifference]', rateDifference);
    return true;
  };

  getRowStyle = params => {
    if (params.data.totalCol) {
      return { backgroundColor: appTheme.palette.background.default };
    }
    return true;
  };

  bottomRowData = () => {
    let basketQuantity = 0;
    let palletQuantity = 0;
    let scalesWeight = 0;
    let realWeight = 0;

    this.props.formik.values.turnToScales.forEach(item => {
      if (item.scalesWeight) {
        basketQuantity += item.basketQuantity;
        palletQuantity += item.palletQuantity;
        scalesWeight += item.scalesWeight;
        realWeight += item.realWeight;
      }
    });
    return [
      {
        totalCol: true,
        palletBasketName: 'Tổng',
        basketQuantity,
        palletQuantity,
        scalesWeight: formatToDecimal(scalesWeight, 2),
        realWeight: formatToDecimal(realWeight, 2),
      },
    ];
  };

  render() {
    const { formik, classes } = this.props;
    return (
      <Expansion
        title="III. Thông Tin Cân"
        rightActions={
          <MuiButton
            icon="note_add"
            outline
            onClick={this.addRecordsHandle}
            className={classes.add}
          />
        }
        content={
          <FormData
            gridStyle={{ height: 420 }}
            name="model"
            columnDefs={this.columnDefs}
            defaultColDef={this.defaultColDef}
            rowData={formik.values.turnToScales}
            gridProps={{
              context: formik,
              onCellValueChanged: this.onCellValueChanged,
              pinnedBottomRowData: this.bottomRowData(),
              suppressHorizontalScroll: true,
              frameworkComponents: {
                customPinnedRowRenderer: PinnedRowRenderer,
              },
              getRowStyle: this.getRowStyle,
            }}
            values={formik.values}
            errors={formik.errors}
            touched={formik.touched}
            submitCount={formik.submitCount}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
          />
        }
      />
    );
  }
}

Section3.propTypes = {
  formik: PropTypes.object,
  onRef: PropTypes.func,
  dataMaster: PropTypes.object,
  classes: PropTypes.object.isRequired,
  showWarning: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  dataMaster: getDataMaster(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Section3);
