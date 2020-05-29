import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import React from 'react';
import { getRowStyle } from 'utils/index';
import PropTypes from 'prop-types';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { getColumnDefs } from 'utils/transformUtils';
import { NUM_ADDED_PER_PAGE } from 'utils/constants';
import { getIn } from 'formik';
import { groupBy, sumBy } from 'lodash';
import FormData from 'components/FormikUI/FormData';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { formatToCurrency } from 'utils/numberUtils';
import { columns, defaultColDef } from './header';
import { productSchema } from './Schema';
import { basketGroup } from './basketTrayUtils';
export default class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.createInitRecords(props.form === TYPE_FORM.CREATE ? 5 : 0),
    };
    this.rowClassRules = {
      'highlight-duplicate': params => {
        const { locatorId, productCode, batch } = params.data;
        const grouped = groupBy(
          this.props.formik.values.detailsCommands,
          i =>
            i
              ? `${i.locatorId}_${i.productCode || Math.random()}_${i.batch ||
                  Math.random()}`
              : 'undefined',
        );
        const keyStr = `${locatorId}_${productCode}_${batch}`;
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

  mergeRowData = (stateData, formikData) => {
    if (this.props.form === TYPE_FORM.VIEW) {
      return formikData || [];
    }

    if (formikData && formikData.length > stateData.length) {
      return formikData;
    }
    const results = [];
    stateData.forEach((_, index) => {
      results[index] = formikData[index] || stateData[index];
    });
    return results;
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.formik.values.detailsCommands.length > this.state.datas.length
    ) {
      this.setState({
        datas: this.createInitRecords(
          nextProps.formik.values.detailsCommands.length,
        ),
      });
    }
    if (nextProps.formik.values.detailsCommands.length === 0) {
      this.setState({
        datas: this.createInitRecords(5),
      });
    }
  }

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
    }

    this.setState({ datas: newDatas });
  }

  componentDidMount() {
    if (
      this.props.formik.values.detailsCommands.length > this.state.datas.length
    ) {
      this.setState({
        datas: this.createInitRecords(
          this.props.formik.values.detailsCommands.length,
        ),
      });
    }
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
  };

  refreshPalletBasket(stockList) {
    const { formik } = this.props;
    const newBasketsTrays = basketGroup(
      stockList,
      formik.values.deliBasketsTrays,
    );
    formik.setFieldValue('basketsTrays', newBasketsTrays);
  }

  getTotal = formik => {
    const result = [];
    if (formik.values.detailsCommands.length > 0) {
      result.push({
        totalCol: true,
        batch: 'Tổng',
        inventoryQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'inventoryQuantity'),
        ),
        exportedQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'exportedQuantity'),
        ),
      });
    }
    return result;
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
          'batch',
          'locatorName',
          'productCode',
          'processingTypeName',
          'basketName1',
          'basketName2',
          'basketName3',
        ]}
        defaultColDef={defaultColDef}
        // gridStyle={rowHeight}
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
ProductTable.propTypes = {
  classes: PropTypes.object,
  onShowWarning: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
