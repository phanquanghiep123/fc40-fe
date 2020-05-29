import React from 'react';
import PropTypes from 'prop-types';
import FormData from 'components/FormikUI/FormData';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Expansion from 'components/Expansion';
import ConfirmationDialog from 'components/ConfirmationDialog';
import appTheme from 'containers/App/theme';
import { formatToNumber, formatToDecimal, sumBy } from 'utils/numberUtils';
import { getIn } from 'formik';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import Button from '../Button';
import { columnDefs, defaultColDef } from './ColumnDefs';
import { ScaleSchema } from '../Schema';
import { makeSelectData } from '../selectors';

class TableSection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.onRef(this);
    setTimeout(() => this.addRecords(10));
  }

  addRecordsHandler = () => {
    this.addRecords();
  };

  addRecords = (rows = 5) => {
    const records = [];
    for (let i = 0; i < rows; i += 1) {
      records.push({});
    }

    this.props.formik.setFieldValue('turnToScale', [
      ...this.props.formik.values.turnToScale,
      ...records,
    ]);
  };

  getTurnToScales() {
    return getIn(this.props.formik.values, 'turnToScale');
  }

  getTotalRecords = () => this.props.formik.values.turnToScale.length;

  defaultTurnScales = () => {
    const totalRecords = this.getTotalRecords();
    if (totalRecords > 0) {
      const basketPallets = this.props.formik.values.basketPallet;

      if (
        basketPallets
        // &&
        // (basketPallets.palletBasketCode || basketPallets.palletCode)
      ) {
        const turnToScales = this.getTurnToScales();
        const nextTurnToScales = [];
        for (let i = 0; i < totalRecords; i += 1) {
          const turnScale = turnToScales[i];
          if (turnScale && turnScale.scalesWeight > 0) {
            nextTurnToScales[i] = { ...turnScale };
          } else {
            nextTurnToScales[i] = ScaleSchema.cast(basketPallets);
          }
        }
        this.props.formik.setFieldValue('turnToScale', nextTurnToScales);
      }
    }
  };

  calculateQuantity = turnToScales => {
    if (turnToScales && turnToScales.length > 0) {
      // Khối lượng thực tế = Tổng * Khối lượng thực
      let totalQuantity = 0;
      for (let i = 0, len = turnToScales.length; i < len; i += 1) {
        const turnScale = turnToScales[i];

        if (turnScale && turnScale.scalesWeight > 0) {
          totalQuantity += formatToNumber(turnScale.realWeight);
        }
      }

      return formatToDecimal(totalQuantity);
    }
    return 0;
  };

  onCellValueChanged = () => {
    const turnToScales = this.getTurnToScales();
    const nextQuantity = this.calculateQuantity(turnToScales);
    const ratePercen = nextQuantity ? '100%' : '';
    const rate = `${nextQuantity}  ${ratePercen}`;
    this.props.formik.setFieldValue('stockTakingQuantity', nextQuantity);
    this.props.formik.setFieldValue('rateDifference', rate);
    this.props.formik.setFieldValue('weightDifference', nextQuantity);
    const stockTaking = [];
    turnToScales.map(item => {
      if (item.scalesWeight) {
        const stockTurnToScale = {
          id: item.id || 0,
          palletBasketCode: item.palletBasketCode,
          palletBasketName: item.palletBasketName,
          palletBasketQuantity: item.palletBasketQuantity,
          palletCode: item.palletCode,
          palletName: item.palletName,
          palletQuantity: item.palletQuantity,
          scalesWeight: item.scalesWeight,
          realWeight: item.realWeight,
        };
        stockTaking.push(stockTurnToScale);
      }
      return stockTaking;
    });
    this.props.formik.setFieldValue(
      'stockTakingTurnToScaleDetails',
      stockTaking,
    );
  };

  removeRecord(rowData, rowIndex) {
    const turnToScales = this.getTurnToScales();
    if (turnToScales[rowIndex]) {
      const nextTurnToScales = turnToScales.slice();
      nextTurnToScales.splice(rowIndex, 1);
      const nextQuantity = this.calculateQuantity(nextTurnToScales);
      this.props.formik.setFieldValue('stockTakingQuantity', nextQuantity);
      this.props.formik.setFieldValue('turnToScale', nextTurnToScales);
      const stockTaking = [];
      nextTurnToScales.map(item => {
        if (item.scalesWeight) {
          const stockTurnToScale = {
            id: item.id || 0,
            palletBasketCode: item.palletBasketCode,
            palletBasketName: item.palletBasketName,
            palletBasketQuantity: item.palletBasketQuantity,
            palletCode: item.palletCode,
            palletName: item.palletName,
            palletQuantity: item.palletQuantity,
            scalesWeight: item.scalesWeight,
            realWeight: item.realWeight,
          };
          stockTaking.push(stockTurnToScale);
        }
        return stockTaking;
      });
      this.props.formik.setFieldValue(
        'stockTakingTurnToScaleDetails',
        stockTaking,
      );
      const ratePercen = nextQuantity ? '100%' : '';
      const rate = `${nextQuantity}  ${ratePercen}`;
      this.props.formik.setFieldValue('rateDifference', rate);
      this.props.formik.setFieldValue('weightDifference', nextQuantity);
    }
  }

  confirmRemoveRecord(rowData, rowIndex) {
    this.showConfirm({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.removeRecord(rowData, rowIndex),
        },
      ],
    });
  }

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  bottomRowData = () => {
    const totalStockTaking = this.props.formik.values
      .stockTakingTurnToScaleDetails;
    return [
      {
        edited: true,
        totalCol: true,
        palletBasketName: 'Tổng',
        palletBasketQuantity:
          sumBy(totalStockTaking, 'palletBasketQuantity') || undefined,
        palletQuantity: sumBy(totalStockTaking, 'palletQuantity') || undefined,
        scalesWeight: sumBy(totalStockTaking, 'scalesWeight') || undefined,
        realWeight: sumBy(totalStockTaking, 'realWeight') || undefined,
      },
    ];
  };

  // eslint-disable-next-line consistent-return
  getRowStyle = function(params) {
    if (params.data.totalCol) {
      return { backgroundColor: appTheme.palette.background.default };
    }
  };

  render() {
    const { formik } = this.props;
    return (
      <Expansion
        title="III. Thông Tin Cân"
        headLeftStyle={{ width: '70%' }}
        headRightStyle={{ width: '30%' }}
        rightActions={
          <Button icon="note_add" outline onClick={this.addRecordsHandler} />
        }
        content={
          <React.Fragment>
            <FormData
              idGrid="grid-weight"
              gridStyle={{ height: 450 }}
              rowData={formik.values.turnToScale}
              columnDefs={this.props.columnDefs}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
              updateFieldArrayValue={formik.updateFieldArrayValue}
              defaultColDef={this.props.defaultColDef}
              gridProps={{
                context: this,
                pinnedBottomRowData: this.bottomRowData(),
                frameworkComponents: {
                  customPinnedRowRenderer: PinnedRowRenderer,
                },
                getRowStyle: this.getRowStyle,
                onCellValueChanged: this.onCellValueChanged,
                suppressHorizontalScroll: true,
              }}
              onGridReady={this.onGridReady}
            />
            <ConfirmationDialog
              ref={ref => {
                this.confirmRef = ref;
              }}
            />
          </React.Fragment>
        }
      />
    );
  }
}
TableSection.propTypes = {
  /**
   * Formik
   */
  formik: PropTypes.object,
  onRef: PropTypes.func,
  // data: PropTypes.object,
  // values: PropTypes.any,
  // errors: PropTypes.any,
  // touched: PropTypes.any,
  // submitCount: PropTypes.number,
  // setFieldValue: PropTypes.func,
  // setFieldTouched: PropTypes.func,
  // updateFieldArrayValue: PropTypes.func,
  /**
   * Ag-Grid
   */
  columnDefs: PropTypes.array,
  defaultColDef: PropTypes.object,
};
TableSection.defaultProps = {
  columnDefs,
  defaultColDef,
};
const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);
export default withConnect(withImmutablePropsToJS(TableSection));
