import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import FormData from 'components/FormikUI/FormData';
import ConfirmationDialog from 'components/ConfirmationDialog';

import { calculateRealQuantity } from 'components/GoodsWeight/utils';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';

import { ScaleSchema } from './Schema';

import { columnDefs, defaultColDef } from './header';

import { NUM_PER_PAGE, PRODUCT_STATUS } from './constants';

export default class WeightTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      datas: this.createInitRecords(),
    };
    this.gridApi = null;
  }

  componentDidMount() {
    document.body.addEventListener('mouseup', this.onCellMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mouseup', this.onCellMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    const turnToScales = getIn(nextProps.values, 'turnToScales');

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

  isCompleted() {
    const productStatus = getIn(this.props.values, 'documentDetailStatus');

    if (productStatus === PRODUCT_STATUS.COMPLETED) {
      return true;
    }
    return false;
  }

  getRowDatas() {
    const { datas } = this.state;
    const turnToScales = this.getTurnToScales();

    return this.mergeRowData(datas, turnToScales);
  }

  getQuantity() {
    return getIn(this.props.values, 'quantity');
  }

  getTurnToScales() {
    return getIn(this.props.values, 'turnToScales');
  }

  getBasketPalletOption() {
    return getIn(this.props.values, 'basketPallet');
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

  getTotalRecords = () => this.state.datas.length;

  getFocusIndex = () => {
    const focused = this.getFocusedCell();
    if (focused && focused.rowIndex >= 0) {
      return focused.rowIndex;
    }
    return -1;
  };

  getNextIndex = datas => {
    if (datas && datas.length > 0) {
      return datas.findIndex(item => {
        if (item && !(item.quantity > 0)) {
          return true;
        }
        return false;
      });
    }
    return -1;
  };

  getLengthIndex = datas => {
    if (datas && datas.length > 0) {
      return datas.length;
    }
    return -1;
  };

  refreshRecords = () => {
    this.setState({ datas: this.createInitRecords() });
  };

  scrollToIndex(rowIndex) {
    if (this.gridApi) {
      const gridElement = document.querySelector('#grid-weight');
      gridElement.scrollIntoView();

      this.gridApi.gridPanel.ensureIndexVisible(rowIndex, 'bottom');
    }
  }

  scrollToBottom() {
    if (this.gridApi) {
      const gridElement = document.querySelector('#grid-weight');
      const gridBodyElement = gridElement.querySelector('.ag-body-viewport');

      // Delay before scroll
      setTimeout(() => {
        gridElement.scrollIntoView();
        gridBodyElement.scrollTop = gridBodyElement.scrollHeight;
      });
    }
  }

  setNextWeightAuto = nextWeight => {
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

      this.props.setFieldValue('quantity', nextQuantity);
      this.props.setFieldTouched(
        `turnToScales[${rowIndex}]realQuantity`,
        true,
        false,
      );
      this.props.updateFieldArrayValue(
        'turnToScales',
        rowIndex,
        updaterData,
        // true,
      );
    }
  };

  createInitRecords = (numRecords = NUM_PER_PAGE, init = {}) => {
    const records = [];

    if (numRecords > 0) {
      for (let i = 0; i < numRecords; i += 1) {
        records.push(ScaleSchema.cast(init));
      }
    }

    return records;
  };

  addRecords(numRecords = 5) {
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

      const nextQuantity = this.calculateQuantity(nextTurnToScales);

      this.props.setFieldValue('quantity', nextQuantity);
      this.props.setFieldValue('turnToScales', nextTurnToScales);
    }

    this.setState({ datas: newDatas });
  }

  confirmRemoveRecord(rowData, rowIndex) {
    this.showConfirm({
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

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
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

  calculateQuantity = turnToScales => {
    if (turnToScales && turnToScales.length > 0) {
      // Khối lượng thực tế = Tổng * Khối lượng thực
      let totalQuantity = 0;

      for (let i = 0, len = turnToScales.length; i < len; i += 1) {
        const turnScale = turnToScales[i];

        if (turnScale && turnScale.quantity > 0) {
          totalQuantity += formatToNumber(turnScale.realQuantity);
        }
      }

      return formatToDecimal(totalQuantity);
    }
    return 0;
  };

  defaultTurnScales = () => {
    const totalRecords = this.getTotalRecords();

    if (totalRecords > 0) {
      const basketPallet = this.getBasketPalletOption();

      if (
        basketPallet &&
        (basketPallet.basketCode || basketPallet.palletCode)
      ) {
        const turnToScales = this.getTurnToScales();
        const nextTurnToScales = [];

        for (let i = 0; i < totalRecords; i += 1) {
          const turnScale = turnToScales[i];

          if (turnScale && turnScale.quantity > 0) {
            nextTurnToScales[i] = { ...turnScale };
          } else {
            nextTurnToScales[i] = ScaleSchema.cast(basketPallet);
          }
        }

        this.props.setFieldValue('turnToScales', nextTurnToScales);
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
    const nextQuantity = this.calculateQuantity(turnToScales);
    this.props.setFieldValue('quantity', nextQuantity);
  };

  render() {
    const {
      values,
      errors,
      touched,
      submitCount,
      setFieldValue,
      setFieldTouched,
    } = this.props;

    const rowDatas = this.getRowDatas();

    return (
      <React.Fragment>
        <FormData
          name="turnToScales"
          idGrid="grid-weight"
          gridStyle={{ height: 450 }}
          /**
           * Props Formik
           */
          values={values}
          errors={errors}
          touched={touched}
          submitCount={submitCount}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          /**
           * Props Ag-Grid
           */
          rowData={rowDatas}
          columnDefs={this.props.columnDefs}
          defaultColDef={this.props.defaultColDef}
          gridProps={{
            context: this,
            onViewportChanged: this.onViewportChanged,
            onCellValueChanged: this.onCellValueChanged,
          }}
          onGridReady={this.onGridReady}
          ignoreSuppressColumns={['basketCode', 'palletCode', 'customerName']}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

WeightTable.propTypes = {
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

WeightTable.defaultProps = {
  columnDefs,
  defaultColDef,
};
