import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import FormData from 'components/FormikUI/FormData';
import CellRenderer from 'components/FormikUI/CellRenderer';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { getColumnDefs } from 'utils/transformUtils';
import { formatToNumber } from 'utils/numberUtils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import HiddenCellData from 'components/FormikUI/HiddenCellData';
import { getRowStyle } from 'utils/index';
import Schema from '../section4Schema';
import { basketGroup, basketInforGroup } from '../section4Utils';

import { columns, defaultColDef } from './header';
import { getTotalStocks } from './utils';

import {
  NUM_PER_PAGE,
  TYPE_BBGH,
  TYPE_PROCESSING,
  BTP_L2_GRADE,
  BTP_L2_MATERIAL,
} from '../constants';
import { viewBasketLogic } from '../basketLogicFunction';

export default class GoodsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      datas: this.createInitRecords(),
    };

    this.gridApi = null;
    this.confirmRef = null;

    this.gridOptions = { alignedGrids: [] };
    this.totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };
    this.prevStockList = [];
  }

  isCreate = () => true;

  componentDidMount() {
    this.gridOptions.alignedGrids.push(this.totalOptions);
    this.totalOptions.alignedGrids.push(this.gridOptions);
  }

  componentDidUpdate(prevProps) {
    this.prevStockList = prevProps.values.stockList;
    const doType = getIn(this.props.values, 'doType');
    const prevDoType = getIn(prevProps.values, 'doType');

    if (this.gridApi && prevDoType !== doType) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  createInitRecords = (numRecords = NUM_PER_PAGE) => {
    const records = [];

    for (let i = 0; i < numRecords; i += 1) {
      const row = new Schema();
      records.push(row);
    }
    return records;
  };

  isQLNH = () => this.props.values.doType === TYPE_BBGH.NCC_TO_NSC;

  getDoType = () => this.props.values.doType;

  getExtraColumns = () => {
    if (this.isQLNH()) {
      return {
        productionOrder: { hide: true },
        finishProductCode: { hide: false },
        farmQcRecoveryRate: { hide: true },
      };
    }

    if (
      [
        TYPE_BBGH.FARM_POST_HARVEST,
        TYPE_BBGH.FARM_TO_PLANT_CODE_1,
        TYPE_BBGH.FARM_TO_PLANT_CODE_2,
      ].includes(this.getDoType())
    ) {
      return {
        isTranscoding: { hide: false },
      };
    }

    if ([TYPE_BBGH.PLANT_TO_PLANT_CODE_4].includes(this.getDoType())) {
      return {
        productionOrder: { hide: true },
        slotCode: { hide: false },
      };
    }

    return {};
  };

  getTotalColumns = () => {
    const extraColumns = this.getExtraColumns();

    return {
      ...extraColumns,
      isTranscoding: {
        ...extraColumns.isTranscoding,
        cellRendererFramework: CellRenderer,
      },
      processingType: { cellRendererFramework: CellRenderer },
    };
  };

  getDefaultProcessType = (grade, materialType) => {
    const { processTypes } = this.props;

    // [Mặc định]: Sơ chế
    let defaultProcessType = TYPE_PROCESSING.SO_CHE;

    // [BTP L2]: Lưu kho
    if (+grade === BTP_L2_GRADE && BTP_L2_MATERIAL.includes(materialType)) {
      defaultProcessType = TYPE_PROCESSING.LUU_KHO;
    }

    let processType = processTypes.find(
      item => item && item.value === defaultProcessType,
    );
    if (!processType) {
      [processType] = processTypes;
    }

    return processType;
  };

  scale = this.props.onClickButtonCan;

  addRecord(numRecords = 5) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas });
  }

  addRecordByRows(rows) {
    const { stockList } = this.props.values;
    const selectedIds = rows.map(obj => obj.key);
    const addedIds = [];

    let result = stockList.filter(obj => {
      if (!obj.ispending) return true;
      addedIds.push(obj.key);
      return selectedIds.includes(obj.key);
    });

    const needToAdd = rows.filter(obj => !addedIds.includes(obj.key));
    result = [...result, ...needToAdd];
    result = result.map(item => {
      const cloItem = item;
      const processingType = this.getDefaultProcessType(
        item.grade,
        item.materialTypeCode,
      );
      cloItem.processingType = processingType.value;
      cloItem.processingTypeName = processingType.label;
      cloItem.originalCode = cloItem.doConnectingId;
      cloItem.originalDescription = cloItem.materialDescription;
      cloItem.originalType = processingType.value;
      cloItem.originalTypeName = cloItem.productTypeName;
      return cloItem;
    });
    this.props.setFieldValue('stockList', result);
    this.props.setFieldValue('basketsTrays', basketGroup(result));

    const { datas } = this.state;
    if (result.length - datas.length > 0) {
      const cell = result.length - datas.length;
      this.addRecord(cell);
    }
  }

  removeRecord(rowData, rowIndex) {
    const { datas } = this.state;
    const { stockList } = this.props.values;

    const newDatas = datas.slice();
    newDatas.splice(rowIndex, 1);

    if (stockList[rowIndex]) {
      const newStockList = stockList.slice();
      newStockList.splice(rowIndex, 1);

      this.props.setFieldValue('stockList', newStockList);
      this.props.setFieldValue('basketsTrays', basketGroup(newStockList));
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

  updateWeightReceived = (rowIndex, plannedTotal, palletBaskets) => {
    const { stockList } = this.props.values;
    const nextStockList = stockList.slice();

    const rowData = nextStockList[rowIndex];

    const nextData = {
      plannedTotalQuatity:
        formatToNumber(rowData.plannedTotalQuatity) + plannedTotal,
      ...this.updatePalletBasket(rowData, palletBaskets),
    };
    nextStockList[rowIndex] = nextData;

    this.refreshPalletBasket(nextStockList, this.prevStockList);
    this.props.updateFieldArrayValue('stockList', rowIndex, nextData);
  };

  updatePalletBasket = (rowData, newPalletBaskets) => {
    const nextData = {};

    const palletBaskets = this.transformPalletBasket(rowData);
    const nextPalletBaskets = this.mergePalletBasket(
      palletBaskets,
      newPalletBaskets,
    );
    const nextBasketCodes = Object.keys(nextPalletBaskets);

    for (let i = 0; i < 3; i += 1) {
      const basketCode = nextBasketCodes[i];

      if (basketCode) {
        const palletBasket = nextPalletBaskets[basketCode];

        nextData[`basketCode${i + 1}`] = basketCode;
        nextData[`basketShortName${i + 1}`] = palletBasket.name;
        nextData[`deliverQuantity${i + 1}`] = palletBasket.quantity;
        nextData[`basketUoM${i + 1}`] = palletBasket.basketUom;
      } else {
        nextData[`basketCode${i + 1}`] = 0;
        nextData[`basketShortName${i + 1}`] = '';
        nextData[`deliverQuantity${i + 1}`] = null;
      }
    }

    return nextData;
  };

  transformPalletBasket = rowData => {
    const results = {};

    for (let i = 1; i <= 3; i += 1) {
      const basketCode = rowData[`basketCode${i}`];
      const basketName = rowData[`basketShortName${i}`];
      const basketQuantity = rowData[`deliverQuantity${i}`] * 1;
      const basketUom = rowData[`basketUoM${i}`];

      if (basketCode)
        results[basketCode] = {
          name: basketName,
          quantity: basketQuantity,
          basketUom,
        };
    }

    return results;
  };

  mergePalletBasket = (palletBaskets, nextPalletBaskets) => {
    const results = {};

    const basketCodes = Object.keys(palletBaskets);
    const nextBasketCodes = Object.keys(nextPalletBaskets);

    for (let i = 0; i < 3; i += 1) {
      const basketCode = basketCodes[i];

      if (basketCode) {
        const currBasket = palletBaskets[basketCode];
        const indexFound = nextBasketCodes.indexOf(basketCode);

        if (indexFound !== -1) {
          const nextBasket = nextPalletBaskets[basketCode];
          nextBasket.quantity += currBasket.quantity;

          results[basketCode] = nextBasket;

          nextBasketCodes.splice(indexFound, 1);
        } else {
          results[basketCode] = currBasket;
        }
      } else {
        const nextBasketCode = nextBasketCodes.shift();
        if (nextBasketCode) {
          results[nextBasketCode] = nextPalletBaskets[nextBasketCode];
        }
      }
    }

    return results;
  };

  mergeRowData = (datas, newDatas) => {
    const results = [];

    for (let i = 0, len = datas.length; i < len; i += 1) {
      if (newDatas[i]) {
        results[i] = newDatas[i];
      } else {
        results[i] = datas[i];
      }
    }

    return results;
  };

  isSuppressEditing = () => {
    if (this.isQLNH()) {
      return false;
    }

    const deliverCode = getIn(this.props.values, 'deliverCode');
    const receiverCode = getIn(this.props.values, 'receiverCode');

    return !deliverCode || !receiverCode;
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onViewportChanged = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  onCellValueChanged = () => {
    this.refreshPalletBasket(this.props.values.stockList, this.prevStockList);
  };

  refreshPalletBasket(stockList, prevStockList) {
    if (!viewBasketLogic(this.props.values.doType, this.isCreate())) {
      this.props.setFieldValue('basketsTrays', basketGroup(stockList));
      this.props.setFieldValue('basketsInfor', basketInforGroup(stockList));
    } else {
      let basketInfo = [...this.props.values.basketsInfor];
      const basketInfoFromStock = [...basketInforGroup(stockList)];
      const prevBasketInfo = [...basketInforGroup(prevStockList)];
      if (basketInfoFromStock.length === 0) {
        this.props.setFieldValue('basketsInfor', []);
      } else {
        basketInfoFromStock.forEach(basket => {
          const foundIndex = basketInfo.findIndex(
            x => x.basketCode === basket.basketCode,
          );
          if (foundIndex !== -1) {
            // Find previous basketbasket
            const prevBasket = prevBasketInfo.find(
              x => x.basketCode === basket.basketCode,
            );
            // If previous basket exists, update new quantity
            if (prevBasket !== undefined) {
              // Caculate new quantity
              basketInfo[foundIndex].deliverQuantity =
                basketInfo[foundIndex].deliverQuantity -
                prevBasket.deliverQuantity +
                basket.deliverQuantity;
              prevBasketInfo.forEach(item => {
                const currentBasket = basketInfoFromStock.find(
                  x => x.basketCode === item.basketCode,
                );
                if (!currentBasket) {
                  basketInfo = basketInfo.filter(
                    i => i.basketCode !== item.basketCode,
                  );
                }
              });
            } else {
              basketInfo[foundIndex].deliverQuantity += basket.deliverQuantity;
              // basketInfo.splice(foundIndex, 1);
            }
          } else {
            // Add new basket to basketsInfo List
            basketInfo.push(basket);
          }
        });
        this.props.setFieldValue('basketsInfor', basketInfo);
      }
    }
  }

  render() {
    const {
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
    } = this.props;

    const { datas } = this.state;
    const { stockList } = values;

    const totalStocks = getTotalStocks(stockList);

    const gridProps = {
      context: this,
      suppressClickEdit: this.isSuppressEditing(),
      onViewportChanged: this.onViewportChanged,
      onCellValueChanged: this.onCellValueChanged,
    };

    return (
      <React.Fragment>
        <FormData
          name="stockList"
          idGrid="grid-section4"
          /**
           * Props Formik
           */
          values={values}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          /**
           * Props Ag-Grid
           */
          rowData={this.mergeRowData(datas, stockList)}
          autoLayout
          columnDefs={getColumnDefs(this.props.columns, this.getExtraColumns())}
          defaultColDef={this.props.defaultColDef}
          gridProps={{
            ...gridProps,
            gridOptions: this.gridOptions,
            pinnedBottomRowData: [
              {
                totalCol: true,
                processingType: 'Tổng',
                processingTypeName: 'Tổng',
                ...totalStocks,
              },
            ],
            frameworkComponents: {
              customPinnedRowRenderer: PinnedRowRenderer,
              customHiddenCellData: HiddenCellData,
            },
            getRowStyle,
          }}
          onGridReady={this.onGridReady}
          ignoreSuppressColumns={[
            'productionOrder',
            'doConnectingId',
            'basketShortName1',
            'basketShortName2',
            'basketShortName3',
          ]}
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

GoodsTable.propTypes = {
  processTypes: PropTypes.array,
  /**
   * Ag-Grid
   */
  columns: PropTypes.object,
  defaultColDef: PropTypes.object,
  /**
   * Formik
   */
  values: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.any,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  updateFieldArrayValue: PropTypes.func,
  onClickButtonCan: PropTypes.func,
};

GoodsTable.defaultProps = {
  columns,
  defaultColDef,
  processTypes: [],
};
