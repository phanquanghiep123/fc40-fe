import React from 'react';
import FormData from 'components/FormikUI/FormData';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import Expansion from 'components/Expansion';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { orderNumberRenderer, getRowStyle } from 'utils/index';
import '../PXK/styles.css';
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
        autoHeight: true,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Số Lượng',
        field: 'quantity',
        type: 'numericColumn',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
      {
        headerName: 'Đơn Vị Tính',
        field: 'unit',
        width: 100,
        pinnedRowCellRenderer: 'customPinnedRowRenderer',
      },
    ],
  };

  getTotal = formik => {
    const result = [];
    if (formik.values.basketsTrays.length > 0) {
      result.push({
        totalCol: true,
        basketName: 'Tổng Số Lượng Khay Sọt',
        quantity: sumBy(formik.values.basketsTrays, 'quantity'),
        unit: formik.values.basketsTrays[0].uoM,
      });
    }
    return result;
  };

  render() {
    const { formik } = this.props;
    return (
      <Expansion
        title="III. Thông Tin Khay Sọt"
        content={
          <FormData
            idGrid="grid-section5"
            name="basketsTrays"
            columnDefs={this.state.columnDefs}
            gridStyle={{ height: 'auto' }}
            {...formik}
            gridProps={{
              pinnedBottomRowData: this.getTotal(formik),
              frameworkComponents: {
                customPinnedRowRenderer: PinnedRowRenderer,
              },
              domLayout: 'autoHeight',
              getRowStyle,
            }}
          />
        }
      />
    );
  }
}
