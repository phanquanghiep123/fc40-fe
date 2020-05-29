import React from 'react';
import FormData from 'components/FormikUI/FormData';
import { getRowStyle } from 'utils/index';
import { getIn } from 'formik';
import { getColumnDefs } from 'utils/transformUtils';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { columns, defaultColDef } from './header';
import { formatToCurrency, sumBy } from '../../../utils/numberUtils';
export default class Table extends React.Component {
  componentDidMount() {}

  getTotal = formik => {
    const result = [];
    if (formik.values.detailsCommands.length > 0) {
      result.push({
        totalCol: true,
        quantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'quantity'),
        ),
        unitPrice: '',
        total: formatToCurrency(sumBy(formik.values.detailsCommands, 'total')),
        locator: 'Tổng',
      });
    }
    return result;
  };

  render() {
    const { formik } = this.props;
    return (
      <FormData
        name="detailsCommands"
        gridStyle={{ height: 'auto' }}
        idGrid="grid-farm-transition"
        columnDefs={getColumnDefs(columns)}
        rowData={getIn(formik.values, 'detailsCommands')}
        ignoreSuppressColumns={[
          'productCode',
          'processingTypeName',
          'basketShortName1',
          'basketShortName2',
          'basketShortName3',
        ]}
        defaultColDef={defaultColDef}
        onGridReady={this.onGridReady}
        gridProps={{
          context: this,
          onViewportChanged: this.onViewportChanged,
          pinnedBottomRowData: this.getTotal(formik),
          frameworkComponents: {
            customPinnedRowRenderer: PinnedRowRenderer,
          },
          suppressScrollOnNewData: true,
          suppressHorizontalScroll: true,
          domLayout: 'autoHeight',
          getRowStyle,
        }}
        {...formik}
      />
    );
  }
}
Table.propTypes = {
  // classes: PropTypes.object.isRequired
};
