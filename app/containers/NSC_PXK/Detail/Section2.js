import React from 'react';
import PropTypes from 'prop-types';
import appTheme from 'containers/App/theme';
import { getIn } from 'formik';
import { sumBy, formatToCurrency } from 'utils/numberUtils';
import FormData from 'components/FormikUI/FormData';
import { getColumnDefs } from 'utils/transformUtils';
import { TYPE_PXK } from 'containers/NSC_PXK/PXK/constants';
import { getRowStyle } from 'utils/index';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { columns, defaultColDef } from './header';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Expansion from '../../../components/Expansion';
export default class Section2 extends React.Component {
  gridApi = null;

  componentDidUpdate(prevProps) {
    const subType = getIn(this.props.formik.values, 'subType');
    const prevSubType = getIn(prevProps.formik.values, 'subType');

    if (this.gridApi && prevSubType !== subType) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
  };

  // eslint-disable-next-line consistent-return
  getRowStyle = function(params) {
    if (params.data.totalCol) {
      return { backgroundColor: appTheme.palette.background.default };
    }
  };

  getTotal = formik => {
    const result = [];
    if (
      formik.values.documentDetails &&
      formik.values.documentDetails.length > 0
    ) {
      result.push({
        totalCol: true,
        locatorNameFrom: 'Tổng Số Lượng Xuất',
        exportedQuantity: formatToCurrency(
          sumBy(formik.values.documentDetails, 'exportedQuantity'),
        ),
      });
    }
    return result;
  };

  render() {
    const { formik } = this.props;
    const { values } = formik;

    const columnDefs = getColumnDefs(
      columns,
      values.subType === TYPE_PXK.PXK_NOI_BO
        ? { locatorNameTo: { hide: false } }
        : {},
    );

    return (
      <Expansion
        title="II. Thông Tin Sản Phẩm Xuất Kho"
        content={
          <FormData
            name="documentDetails"
            idGrid="grid-pxk-detail"
            gridStyle={{
              height: 400,
            }}
            gridProps={{
              pinnedBottomRowData: this.getTotal(formik),
              frameworkComponents: {
                customPinnedRowRenderer: PinnedRowRenderer,
              },
              getRowStyle,
            }}
            values={values}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={this.onGridReady}
          />
        }
      />
    );
  }
}

Section2.propTypes = {
  formik: PropTypes.object,
};
