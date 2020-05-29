import React from 'react';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { getColumnDefs } from 'utils/transformUtils';
import { NUM_ADDED_PER_PAGE } from 'utils/constants';
import { getIn } from 'formik';
import FormData from 'components/FormikUI/FormData';
import { groupBy } from 'lodash';
import { getRowStyle } from 'utils/index';
import { formatToCurrency, sumBy } from 'utils/numberUtils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { columns, defaultColDef } from './header';
import { productSchema } from './schema';
import { basketGroup } from './basketTrayUtils';
import '../PXK/styles.css';
export default class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.createInitRecords(props.form === TYPE_FORM.CREATE ? 5 : 0),
    };
    this.rowClassRules = {
      'highlight-duplicate': params => {
        const { locatorId, productCode, slotCode } = params.data;
        const grouped = groupBy(
          this.props.formik.values.detailsCommands,
          i =>
            i
              ? `${i.locatorId}_${i.productCode ||
                  Math.random()}_${i.slotCode || Math.random()}`
              : 'undefined',
        );
        const keyStr = `${locatorId}_${productCode}_${slotCode}`;
        if (grouped[keyStr]) {
          return grouped[keyStr].length > 1;
        }
        return false;
      },
    };
  }

  createInitRecords = (
    numRecords = NUM_ADDED_PER_PAGE,
    init = { isNotSaved: true },
  ) => {
    const records = [];

    if (numRecords > 0) {
      for (let i = 0; i < numRecords; i += 1) {
        records.push(productSchema.cast(init));
      }
    }

    return records;
  };

  onDeleteRow = (rowData, rowIndex) => {
    const { form, onDeleteRow } = this.props;

    if (form === TYPE_FORM.VIEW) {
      onDeleteRow({ id: rowData.id }, () =>
        this.removeRecord(rowData, rowIndex),
      );
    } else {
      this.removeRecord(rowData, rowIndex);
    }
  };

  confirmRemoveRecord(rowData, rowIndex) {
    const { onShowWarning } = this.props;
    onShowWarning({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.onDeleteRow(rowData, rowIndex),
        },
      ],
    });
  }

  clearRetailRequestCode = () => {
    const { formik } = this.props;
    formik.setValues({
      ...formik.values,
      retailRequestCode: null,
      customerCode: '',
      customerName: '',
      retailCustomerPhoneNumber: '',
      retailCustomerName: '',
      retailCustomerAddress: '',
      detailsCommands: [],
    });
  };

  getExportProducts() {
    return getIn(this.props.values, 'detailsCommands');
  }

  componentDidUpdate(prevProps) {
    const { values } = this.props.formik;
    const prevValues = prevProps.formik.values;
    const prevDetailsCommands = prevValues.detailsCommands;

    const isUpdatingDetailsCommands =
      !prevDetailsCommands ||
      prevDetailsCommands.length !== values.detailsCommands.length;

    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }

    if (
      (prevProps.formik.values.documentCode !== values.documentCode ||
        isUpdatingDetailsCommands ||
        prevValues.retailRequestCode !== values.retailRequestCode) &&
      values.detailsCommands
    ) {
      this.refreshTotal(values.detailsCommands);
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onViewportChanged = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  mergeRowData = (datas, nextDatas) => {
    const { form } = this.props;
    const results = [];
    if (form === TYPE_FORM.CREATE) {
      for (let i = 0, len = datas.length; i < len; i += 1) {
        if (nextDatas[i]) {
          results[i] = nextDatas[i];
        } else {
          results[i] = datas[i];
        }
      }
      return results;
    }

    // view
    if (form === TYPE_FORM.VIEW) {
      return nextDatas;
    }

    /**
     * @description
     * remove dublicate record when handler saved form
     *
     * @input [{isNotSaved: true}, {isNotSaved: true}]
     * @output [{isNotSaved: true}]
     */
    const aggregate = nextDatas.concat(datas);
    return aggregate;
  };

  removeRecord(rowData, rowIndex) {
    const { datas } = this.state;
    const detailsCommands = this.getExportProducts();

    const newDatas = datas.slice();
    newDatas.splice(rowIndex, 1);

    if (detailsCommands[rowIndex]) {
      const nextExportProducts = detailsCommands.slice();
      nextExportProducts.splice(rowIndex, 1);
      this.props.setFieldValue('detailsCommands', nextExportProducts);
      this.refreshPalletBasket(nextExportProducts);
      this.refreshTotal(nextExportProducts);

      if (nextExportProducts.length === 0) {
        this.clearRetailRequestCode();
      }
    }

    this.setState({ datas: newDatas });
  }

  componentDidMount() {
    setTimeout(() => {
      this.onCellValueChanged();
    }, 1500);
  }

  addRecord(numRecords = 5) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas });
  }

  onCellValueChanged = () => {
    this.refreshPalletBasket(this.props.formik.values.detailsCommands);
    this.refreshTotal(this.props.formik.values.detailsCommands);
  };

  refreshTotal = stockList => {
    const { formik } = this.props;
    let mainTotal = 0;
    stockList.forEach(item => {
      if (item.unitPrice && item.exportedQuantity) {
        mainTotal += Number(item.unitPrice) * Number(item.exportedQuantity);
      }
    });
    formik.setFieldValue('mainTotal', mainTotal.toFixed());
    formik.setFieldValue(
      'exportedQuantityTotal',
      sumBy(stockList, 'exportedQuantity'),
    );
  };

  refreshPalletBasket(stockList) {
    const { formik } = this.props;
    const newBasketsTrays = basketGroup(stockList, formik);
    formik.setFieldValue('basketsTrays', newBasketsTrays);
  }

  getTotal = formik => {
    const result = [];
    if (formik.values.detailsCommands.length > 0) {
      result.push({
        totalCol: true,
        slotCode: 'Tổng',
        exportedQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'exportedQuantity'),
        ),
        inventoryQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'inventoryQuantity'),
        ),
        total: formatToCurrency(formik.values.mainTotal),
      });
    }
    return result;
  };

  render() {
    const { datas } = this.state;
    const { formik } = this.props;
    return (
      <FormData
        key={formik.values.retailRequestCode}
        name="detailsCommands"
        gridStyle={{ height: 'auto' }}
        idGrid="grid-farm-transition"
        columnDefs={getColumnDefs(columns(formik))}
        rowData={this.mergeRowData(
          datas,
          getIn(formik.values, 'detailsCommands'),
        )}
        ignoreSuppressColumns={[
          'slotCode',
          'locatorName',
          'productCode',
          'processingTypeName',
          'basketName1',
          'basketName2',
          'basketName3',
        ]}
        defaultColDef={defaultColDef}
        onGridReady={this.onGridReady}
        gridProps={{
          context: this,
          rowClassRules: this.rowClassRules,
          onViewportChanged: this.onViewportChanged,
          suppressScrollOnNewData: true,
          suppressHorizontalScroll: true,
          onCellValueChanged: this.onCellValueChanged,
          domLayout: 'autoHeight',
          pinnedBottomRowData: this.getTotal(formik),
          frameworkComponents: {
            customPinnedRowRenderer: PinnedRowRenderer,
          },
          getRowStyle,
        }}
        {...formik}
      />
    );
  }
}
ProductTable.propTypes = {};
