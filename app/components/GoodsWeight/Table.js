import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import { formatToNumber, formatToDecimal } from 'utils/numberUtils';
import { NUM_INIT_PER_PAGE, NUM_ADDED_PER_PAGE } from 'utils/constants';

import FormData from 'components/FormikUI/FormData';
import ConfirmationDialog from 'components/ConfirmationDialog';

import { MIN_ROW_HEIGHT, MIN_GRID_HEIGHT } from 'components/FormikUI/constants';

import { ScaleSchema } from './Schema';

import { columnDefs, defaultColDef } from './header';

import { getTotalQuantity, calculateRealQuantity } from './utils';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export const MAX_TABLE_HEIGHT = 450;

export default class GoodsWeightTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: this.createInitRecords(),
    };

    this.gridApi = null;
    this.confirmationDialog = null;
  }

  componentDidMount() {
    document.body.addEventListener('mouseup', this.onCellMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mouseup', this.onCellMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    const turnToScales = this.getTurnToScales(nextProps.values);

    if (turnToScales && turnToScales.length > 0) {
      if (turnToScales.length > this.state.datas.length) {
        this.setState({ datas: this.createInitRecords(turnToScales.length) });
      }
    }
  }

  onCellMouseUp = event => {
    const gridDiv = document.querySelector('#grid-weight');
    if (this.gridApi && !gridDiv.contains(event.target)) {
      this.gridApi.clearFocusedCell();
    }
  };

  getRowDatas() {
    const { datas } = this.state;
    const turnToScales = this.getTurnToScales();
    return this.mergeRowData(datas, turnToScales);
  }

  getBaskets() {
    return this.props.baskets;
  }

  getPallets() {
    return this.props.pallets;
  }

  getTotalRecords() {
    return this.state.datas.length;
  }

  getQuantity(values = this.props.values) {
    return getIn(values, this.props.quantityKey);
  }

  getTurnToScales(values = this.props.values) {
    return getIn(values, this.props.turnScalesKey);
  }

  getDefaultOption(values = this.props.values) {
    return getIn(values, 'basketPallet');
  }

  setQuantity(value) {
    this.props.setFieldValue(this.props.quantityKey, value);
  }

  setTurnToScales(value) {
    this.props.setFieldValue(this.props.turnScalesKey, value);
  }

  getFocusedCell() {
    if (this.gridApi && this.gridApi.getFocusedCell) {
      return this.gridApi.getFocusedCell();
    }
    return null;
  }

  clearFocusedCell() {
    if (this.gridApi && this.gridApi.clearFocusedCell) {
      this.gridApi.clearFocusedCell();
    }
  }

  updateTurnToScales(rowIndex, value) {
    this.props.updateFieldArrayValue(
      this.props.turnScalesKey,
      rowIndex,
      value,
      false,
    );
  }

  setRealQuantityTouched(rowIndex) {
    this.props.setFieldTouched(
      `${this.props.turnScalesKey}[${rowIndex}]realQuantity`,
      true,
      false,
    );
  }

  getFocusIndex() {
    const focused = this.getFocusedCell();
    if (focused && focused.rowIndex >= 0) {
      return focused.rowIndex;
    }
    return -1;
  }

  getNextIndex(datas) {
    if (datas && datas.length > 0) {
      return datas.findIndex(item => {
        if (item && !(item.quantity > 0)) {
          return true;
        }
        return false;
      });
    }
    return -1;
  }

  getLengthIndex(datas) {
    if (datas && datas.length > 0) {
      return datas.length;
    }
    return -1;
  }

  refreshRecords() {
    this.setState({ datas: this.createInitRecords() });
  }

  scrollToIndex(rowIndex) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(rowIndex);

      const gridElement = document.querySelector('#grid-weight');
      const dialogElement = gridElement.closest('#dialog-content');

      dialogElement.scrollTop =
        gridElement.offsetTop + rowNode.rowTop - dialogElement.offsetTop;
    }
  }

  scrollToBottom() {
    if (this.gridApi) {
      const gridElement = document.querySelector('#grid-weight');
      const dialogElement = gridElement.closest('#dialog-content');

      dialogElement.scrollTop = gridElement.scrollHeight;
    }
  }

  setNextWeightAuto(nextWeight) {
    let rowIndex = -1;
    let isScrollIndex = true;

    const rowDatas = this.getRowDatas();

    const focusIndex = this.getFocusIndex();
    const nextIndex = this.getNextIndex(rowDatas);
    const lengthIndex = this.getLengthIndex(rowDatas);

    if (focusIndex !== -1) {
      rowIndex = focusIndex;
    } else if (nextIndex !== -1) {
      rowIndex = nextIndex;
    } else if (lengthIndex !== -1) {
      rowIndex = lengthIndex;
      isScrollIndex = false;
    }

    if (rowIndex !== -1) {
      const oldData = rowDatas[rowIndex] || {};
      const oldQuantity = formatToDecimal(oldData.realQuantity);

      const rowData = {
        ...oldData,
        quantity: formatToDecimal(nextWeight),
      };
      const updaterData = {
        ...rowData,
        realQuantity: calculateRealQuantity(this, rowData),
      };

      const quantity = this.getQuantity();
      const nextQuantity = formatToDecimal(
        formatToNumber(quantity) + updaterData.realQuantity - oldQuantity,
      );

      if (isScrollIndex) {
        this.scrollToIndex(rowIndex);
      } else {
        this.scrollToBottom();
      }

      this.clearFocusedCell();

      this.setQuantity(nextQuantity);
      this.setRealQuantityTouched(rowIndex);
      this.updateTurnToScales(rowIndex, updaterData);
    }
  }

  createInitRecords(numRecords = NUM_INIT_PER_PAGE, initSchema = {}) {
    const records = [];

    if (numRecords > 0) {
      for (let i = 0; i < numRecords; i += 1) {
        records.push(ScaleSchema.cast(initSchema));
      }
    }

    return records;
  }

  addRecords(numRecords = NUM_ADDED_PER_PAGE) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas }, this.defaultTurnScales);
  }

  removeRecord(rowData, rowIndex) {
    const { datas } = this.state;
    const turnToScales = this.getTurnToScales();

    const newDatas = datas.slice();
    newDatas.splice(rowIndex, 1);

    if (turnToScales[rowIndex]) {
      const nextTurnToScales = turnToScales.slice();
      nextTurnToScales.splice(rowIndex, 1);

      const nextQuantity = getTotalQuantity(nextTurnToScales);

      this.setQuantity(nextQuantity);
      this.setTurnToScales(nextTurnToScales);
    }

    this.setState({ datas: newDatas });
  }

  confirmRemoveRecord(rowData, rowIndex) {
    this.showDialogConfirm({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.removeRecord(rowData, rowIndex),
        },
      ],
    });
  }

  showDialogConfirm = options => {
    if (this.confirmationDialog) {
      this.confirmationDialog.showConfirm(options);
    }
  };

  mergeRowData = (datas, nextDatas) => {
    const results = [];

    for (let i = 0, len = datas.length; i < len; i += 1) {
      if (nextDatas[i]) {
        results[i] = nextDatas[i];
      } else {
        results[i] = datas[i];
      }
    }

    return results;
  };

  defaultTurnScales = () => {
    const totalRecords = this.getTotalRecords();

    if (totalRecords > 0) {
      const defaultOption = this.getDefaultOption();

      if (
        defaultOption &&
        (defaultOption.basketCode || defaultOption.palletCode)
      ) {
        const turnToScales = this.getTurnToScales();
        const nextTurnToScales = [];

        for (let i = 0; i < totalRecords; i += 1) {
          const turnScale = turnToScales[i];

          if (turnScale && turnScale.quantity > 0) {
            nextTurnToScales[i] = { ...turnScale };
          } else {
            nextTurnToScales[i] = ScaleSchema.cast(defaultOption);
          }
        }

        this.setTurnToScales(nextTurnToScales);
      }
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onViewportChanged = params => {
    if (params && params.api) {
      params.api.sizeColumnsToFit();
    }
  };

  onCellValueChanged = () => {
    const turnToScales = this.getTurnToScales();
    const nextQuantity = getTotalQuantity(turnToScales);
    this.setQuantity(nextQuantity);
  };

  render() {
    const {
      isPopup,
      values,
      errors,
      touched,
      submitCount,
      turnScalesKey,
      setFieldValue,
      setFieldTouched,
      updateFieldArrayValue,
    } = this.props;

    const gridProps = {
      context: this,
      onViewportChanged: this.onViewportChanged,
      onCellValueChanged: this.onCellValueChanged,
    };

    const rowDatas = this.getRowDatas();
    const totalRecords = this.getTotalRecords();

    const gridStyle = {
      // eslint-disable-next-line no-nested-ternary
      height: isPopup
        ? totalRecords > 0
          ? MIN_ROW_HEIGHT * totalRecords + MIN_GRID_HEIGHT
          : MIN_GRID_HEIGHT * 2
        : MAX_TABLE_HEIGHT,
    };

    return (
      <React.Fragment>
        <FormData
          name={turnScalesKey}
          idGrid="grid-weight"
          gridStyle={gridStyle}
          /**
           * Props Formik
           */
          values={values}
          errors={errors}
          touched={touched}
          submitCount={submitCount}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          updateFieldArrayValue={updateFieldArrayValue}
          /**
           * Props Ag-Grid
           */
          gridProps={gridProps}
          rowData={rowDatas}
          columnDefs={this.props.columnDefs}
          defaultColDef={this.props.defaultColDef}
          onGridReady={this.onGridReady}
          ignoreSuppressColumns={[
            'basketCode',
            'palletCode',
            'customerName',
            'locatorName',
          ]}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmationDialog = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

GoodsWeightTable.propTypes = {
  isPopup: PropTypes.bool,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  quantityKey: PropTypes.string,
  turnScalesKey: PropTypes.string,
  /**
   * Formik
   */
  values: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.any,
  submitCount: PropTypes.number,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  updateFieldArrayValue: PropTypes.func,
  /**
   * Ag-Grid
   */
  columnDefs: PropTypes.array,
  defaultColDef: PropTypes.object,
};

GoodsWeightTable.defaultProps = {
  isPopup: false,

  baskets: [],
  pallets: [],

  quantityKey: 'quantity',
  turnScalesKey: 'turnToScales',

  columnDefs,
  defaultColDef,
};
