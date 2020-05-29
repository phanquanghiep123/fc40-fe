/* eslint-disable indent */
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import React from 'react';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import PropTypes from 'prop-types';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { getColumnDefs } from 'utils/transformUtils';
import { NUM_ADDED_PER_PAGE } from 'utils/constants';
import { getIn } from 'formik';
import { groupBy } from 'lodash';
import FormData from 'components/FormikUI/FormData';
import { formatToCurrency, sumBy } from 'utils/numberUtils';
import { getRowStyle } from 'utils/index';
import { columns, defaultColDef } from './header';
import { productSchema } from './Schema';
import { basketGroup } from './basketTrayUtils';
import { STATUS_PXK } from '../PXK/constants';
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.createInitRecords(props.form === TYPE_FORM.CREATE ? 5 : 0),
    };
    this.rowClassRules =
      this.props.formik.values.status !== STATUS_PXK.COMPLETE
        ? {
            'highlight-duplicate': params => {
              const {
                locatorId,
                productCode,
                slotCode,
                processingType,
              } = params.data;
              const grouped = groupBy(
                this.props.formik.values.detailsCommands,
                i =>
                  i
                    ? `${i.locatorId}_${i.productCode ||
                        Math.random()}_${i.slotCode || Math.random()}_${
                        i.processingType
                      }`
                    : 'undefined',
              );
              const keyStr = `${locatorId}_${productCode}_${slotCode}_${processingType}`;
              if (grouped[keyStr]) {
                return grouped[keyStr].length > 1;
              }
              return false;
            },
          }
        : {};
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

  getExportProducts() {
    return getIn(this.props.values, 'detailsCommands');
  }

  componentDidUpdate() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
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
    }

    this.setState({ datas: newDatas });
  }

  componentDidMount() {
    this.onCellValueChanged();
  }

  addRecord(numRecords = 5) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas });
  }

  // tổng phiếu xuất điều chuyển
  getTotal = formik => {
    const result = [];
    if (formik.values.detailsCommands.length > 0) {
      result.push({
        totalCol: true,
        exportedQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'exportedQuantity'),
        ),
        inventoryQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'inventoryQuantity'),
        ),
        processingTypeName: 'Tổng',
      });
    }
    return result;
  };

  refreshPalletBasket(stockList) {
    const { formik } = this.props;
    const newBasketsTrays = basketGroup(stockList, formik);
    formik.setFieldValue('basketsTrays', newBasketsTrays);
  }

  onCellValueChanged = () => {
    this.refreshPalletBasket(this.props.formik.values.detailsCommands);
  };

  render() {
    const { formik } = this.props;
    const { datas } = this.state;
    return (
      <FormData
        name="detailsCommands"
        gridStyle={{ height: 'auto' }}
        idGrid="grid-farm-transition"
        columnDefs={getColumnDefs(columns(formik))}
        rowData={this.mergeRowData(
          datas,
          getIn(formik.values, 'detailsCommands'),
        )}
        ignoreSuppressColumns={[
          'productCode',
          'locatorName',
          'processingTypeName',
          'basketShortName1',
          'basketShortName2',
          'basketShortName3',
        ]}
        defaultColDef={defaultColDef}
        // gridStyle={rowHeight}
        onGridReady={this.onGridReady}
        gridProps={{
          context: this,
          rowClassRules: this.rowClassRules,
          onViewportChanged: this.onViewportChanged,
          onCellValueChanged: this.onCellValueChanged,
          suppressScrollOnNewData: true,
          suppressHorizontalScroll: true,
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
Table.propTypes = {
  classes: PropTypes.object,
  onShowWarning: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
