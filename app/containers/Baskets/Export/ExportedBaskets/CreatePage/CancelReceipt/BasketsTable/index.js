import React from 'react';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Grid, Typography } from '@material-ui/core';
import FormData from '../../../../../../../components/FormikUI/FormData';
import { makeColumnDefs, makeDefaultColDef } from './columnDefs';
import Expansion from '../../../../../../../components/Expansion';
import {
  BASKETS_TABLE,
  BASKETS_TABLE_PINNED,
  basketsTableFields,
  generalSectionFields,
  basketDocumentStatus,
} from '../constants';
import ImagePopup from './ImagePopup';
import * as actions from '../../actions';
import { getNested } from '../../../../../../App/utils';
// import * as selectors from '../../../../../../ExportBaskets/selectors';

class BasketsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openImagePopup: false, // image popup state
    };
  }

  // Open image popup
  onOpenImagePopup = (rowIndex, imgIndex) => {
    this.setState({
      openImagePopup: true,
      rowIndex,
      imgIndex,
    });
  };

  // Close image popup
  closeImagePopup = () => {
    this.setState({
      openImagePopup: false,
      rowIndex: null,
      imgIndex: null,
    });
  };

  render() {
    const { formik, onFetchBigImageBasket } = this.props;
    const columnDefs = makeColumnDefs(this.onOpenImagePopup, formik);
    const rowData = formik.values[BASKETS_TABLE] || [];
    const pinnedRowData = formik.values[BASKETS_TABLE_PINNED] || [];
    const f = generalSectionFields;
    const t = basketsTableFields;
    const isAutoReceipt = getNested(formik.values, f.isAutoReceipt);

    let hasDiffMoreThanZero = false;
    const basketsData = formik.values[BASKETS_TABLE];
    if (isAutoReceipt && basketsData) {
      // eslint-disable-next-line no-restricted-syntax
      for (const row of basketsData) {
        if (row && row[t.difference] > 0) {
          hasDiffMoreThanZero = true;
          break;
        }
      }
    }
    const status = getNested(formik.values, f.status);
    const showMessage =
      isAutoReceipt &&
      hasDiffMoreThanZero &&
      status !== basketDocumentStatus.Completed;

    return (
      <>
        <Grid item xs={12}>
          <Expansion
            title="II. THÔNG TIN KHAY SỌT SỬ DỤNG THANH LÝ/HỦY"
            content={
              <>
                {showMessage && (
                  <Typography
                    variant="body2"
                    color="error"
                    style={{ marginBottom: '0.5rem', marginTop: '-1rem' }}
                  >
                    Phần chênh lệch = SL hủy tối đa - SL hủy sẽ được xử lí
                    chuyển về kho nguồn khi Xuất hủy.
                  </Typography>
                )}

                <FormData
                  name={BASKETS_TABLE}
                  idGrid={BASKETS_TABLE}
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
              </>
            }
          />
        </Grid>

        <ImagePopup
          open={this.state.openImagePopup}
          onClose={this.closeImagePopup}
          rowIndex={this.state.rowIndex}
          imgIndex={this.state.imgIndex}
          deleteImage={this.state.deleteImageFunc}
          formik={formik}
          onFetchBigImageBasket={onFetchBigImageBasket}
        />
      </>
    );
  }
}

BasketsTable.propTypes = {
  formik: PropTypes.object,
  pageType: PropTypes.object,
  onFetchBigImageBasket: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchBigImageBasket: (id, callback) =>
      dispatch(actions.fetchBigImageBasket(id, callback)),
  };
}
const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
)(BasketsTable);
