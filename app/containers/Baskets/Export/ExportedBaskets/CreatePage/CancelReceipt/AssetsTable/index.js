import React from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Grid } from '@material-ui/core';
import FormData from '../../../../../../../components/FormikUI/FormData';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import Expansion from '../../../../../../../components/Expansion';
import { ASSETS_TABLE, ASSETS_TABLE_PINNED } from '../constants';
// import * as selectors from '../../../../../../ExportBaskets/selectors'

class AssetsTable extends React.Component {
  render() {
    const { formik } = this.props;
    const columnDefs = makeColumnDefs();
    const rowData = formik.values[ASSETS_TABLE] || [];
    const pinnedRowData = formik.values[ASSETS_TABLE_PINNED] || [];

    return (
      <Grid item xs={12}>
        <Expansion
          title="III. THÔNG TIN TÀI SẢN SỞ HỮU THANH LÝ/HỦY"
          content={
            <FormData
              name={ASSETS_TABLE}
              idGrid={ASSETS_TABLE}
              gridStyle={{ height: 'auto' }}
              columnDefs={columnDefs}
              rowData={rowData}
              ignoreSuppressColumns={[]}
              defaultColDef={makeDefaultColDef()}
              onGridReady={this.onGridReady}
              gridProps={{
                context: this,
                onViewportChanged: this.onViewportChanged,
                pinnedBottomRowData: pinnedRowData,
                suppressScrollOnNewData: true,
                suppressHorizontalScroll: true,
                domLayout: 'autoHeight',
              }}
              {...formik}
            />
          }
        />
      </Grid>
    );
  }
}

AssetsTable.propTypes = {
  formik: PropTypes.object,
  pageType: PropTypes.object,
  // cancelReceiptData: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
const mapStateToProps = createStructuredSelector({
  // cancelReceiptData: selectors.makeSelectCancelReceiptData(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
)(AssetsTable);
