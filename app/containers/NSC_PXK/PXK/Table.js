/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { groupBy } from 'lodash';
import FormData from 'components/FormikUI/FormData';
import { getRowStyle } from 'utils/index';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { SchemaProduct } from './Schema';
import { columnDefs, defaultColDef } from './header';
import { TYPE_FORM } from './Business';
import './styles.css';

export default class Table extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      datas: this.createInitRecords(props.form === TYPE_FORM.CREATE ? 5 : 0),
    };
    this.rowClassRules = {
      'highlight-duplicate': params => {
        const {
          locatorIdFrom,
          productCode,
          slotCode,
          locatorIdTo,
        } = params.data;
        const grouped = groupBy(
          this.props.formik.values.detailsCommands,
          i =>
            i
              ? `${i.locatorIdFrom}_${i.productCode ||
                  Math.random()}_${i.slotCode || Math.random()}_${
                  i.locatorIdTo
                }`
              : 'undefined',
        );
        const keyStr = `${locatorIdFrom}_${productCode}_${slotCode}_${locatorIdTo}`;
        if (grouped[keyStr]) {
          return grouped[keyStr].length > 1;
        }
        return false;
      },
    };
  }

  getExportProducts() {
    return getIn(this.props.formik.values, 'detailsCommands');
  }

  getTotalRecords = () => this.state.datas.length;

  createInitRecords = (
    numRecords = 5,
    init = { isNotSaved: true, isEnterQuantity: true },
  ) => {
    const records = [];

    if (numRecords > 0) {
      for (let i = 0; i < numRecords; i += 1) {
        records.push(SchemaProduct.cast(init));
      }
    }

    return records;
  };

  addRecords(numRecords = 5) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas });
  }

  removeRecord(rowData, rowIndex) {
    const { formik } = this.props;
    const { datas } = this.state;
    const products = this.getExportProducts();

    const newDatas = datas.slice();
    newDatas.splice(rowIndex, 1);

    if (products[rowIndex]) {
      const nextProducts = products.slice();
      nextProducts.splice(rowIndex, 1);

      formik.setFieldValue('detailsCommands', nextProducts);
    }

    this.setState({ datas: newDatas });
  }

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

  mergeRowData = (datas, nextDatas) => {
    const { form } = this.props;
    const results = [];

    // create
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

  onViewportChanged = params => {
    if (params && params.api) {
      params.api.sizeColumnsToFit();
    }
  };

  render() {
    const {
      formik: {
        values,
        errors,
        touched,
        submitCount,
        setFieldValue,
        setFieldTouched,
      },
      formik,
    } = this.props;
    const { datas } = this.state;
    return (
      <FormData
        name="detailsCommands"
        idGrid="grid-pxk-create-internal"
        gridStyle={{ height: 'auto' }}
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
        rowData={this.mergeRowData(datas, this.getExportProducts())}
        columnDefs={columnDefs(formik)}
        defaultColDef={defaultColDef}
        gridProps={{
          context: this,
          rowClassRules: this.rowClassRules,
          suppressScrollOnNewData: true,
          suppressHorizontalScroll: true,
          onViewportChanged: this.onViewportChanged,
          domLayout: 'autoHeight',
          pinnedBottomRowData: this.props.pinnedBottomRowData,
          frameworkComponents: {
            customPinnedRowRenderer: PinnedRowRenderer,
          },
          getRowStyle,
        }}
        ignoreSuppressColumns={[
          'slotCode',
          'locatorNameFrom',
          'productCode',
          'locatorNameTo',
        ]}
      />
    );
  }
}

Table.propTypes = {
  formik: PropTypes.object,
  onShowWarning: PropTypes.func,
  onDeleteRow: PropTypes.func,
  form: PropTypes.string,
  pinnedBottomRowData: PropTypes.array,
};
