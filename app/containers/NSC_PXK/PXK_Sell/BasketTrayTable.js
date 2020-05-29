import React from 'react';
import FormData from 'components/FormikUI/FormData';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { orderNumberRenderer, getRowStyle } from 'utils/index';
import { groupBy } from 'lodash';

export default class BasketTrayTable extends React.Component {
  state = {
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
        width: 50,
        cellRendererFramework: orderNumberRenderer,
      },
      {
        headerName: 'Mã',
        field: 'basketCode',
        width: 60,
      },
      {
        headerName: 'Tên',
        field: 'basketName',
        cellClass: 'cell-wrap-text',
        cellEditorFramework: MuiSelectEditor,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        autoHeight: true,
      },
      {
        headerName: 'Số Lượng',
        field: 'quantity',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 100,
      },
      {
        headerName: 'Đơn Vị Tính',
        field: 'basketUoM',
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
        width: 100,
      },
    ],
  };

  getTotal = formik => {
    const result = [];
    const grouped = groupBy(formik.values.basketsTrays, 'basketUoM');
    if (Object.keys(grouped).length === 1) {
      result.push({
        totalCol: true,
        basketName: 'Tổng',
        quantity: sumBy(formik.values.basketsTrays, 'quantity'),
        basketUoM: this.props.formik.values.basketsTrays[0].basketUoM,
      });
      return result;
    }
    if (Object.keys(grouped).length > 1) {
      result.push({
        totalCol: true,
        basketName: 'Tổng',
        quantity: sumBy(formik.values.basketsTrays, 'quantity'),
      });
      Object.keys(grouped).forEach(item => {
        result.push({
          totalCol: true,
          quantity: sumBy(grouped[item], 'quantity'),
          basketUoM: item,
        });
      });
    }
    return result;
  };

  render() {
    const { formik } = this.props;
    return (
      <FormData
        idGrid="grid-section5"
        name="basketsTrays"
        columnDefs={this.state.columnDefs}
        gridStyle={{ height: 200 }}
        {...formik}
        gridProps={{
          pinnedBottomRowData: this.getTotal(formik),
          frameworkComponents: {
            customPinnedRowRenderer: PinnedRowRenderer,
          },
          getRowStyle,
        }}
      />
    );
  }
}
// BasketTrayTable.propTypes = { classes: PropTypes.object.isRequired };
