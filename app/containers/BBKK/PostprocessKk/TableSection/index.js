import React from 'react';
import FormData from 'components/FormikUI/FormData';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core';
import Expansion from 'components/Expansion';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';
import { sumBy } from 'utils/numberUtils';
import { commonColumns } from '../Config';
import { selectArr } from '../selectors';
import appTheme from '../../../App/theme';

export const styles = theme => ({
  table: {
    marginTop: theme.spacing.unit * 4,
  },
});

export const defaultColDef = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    if (params.colDef.field === 'deliveryQuantity') {
      const table = params.context.props.tableData;
      table[params.node.rowIndex] = updaterData;
      const grouped = groupBy(
        params.context.props.tableData,
        value => `${value.basketCode}`,
      );
      const mainData = [];
      let { newValue } = params;
      newValue = sumBy(grouped[params.data.basketCode], 'deliveryQuantity');
      grouped[params.data.basketCode].forEach((item, i) => {
        if (item.basketLocatorReceiverId) {
          if (newValue <= item.expectAdjustReceiverQuantity) {
            if (i !== 0) {
              if (newValue < 0) {
                newValue = 0;
              }
            }
            const subData = {
              ...item,
              receiverQuantity: newValue >= 0 ? newValue : '',
            };
            mainData.push(subData);
            newValue -= item.expectAdjustReceiverQuantity;
          } else {
            if (newValue < 0) {
              newValue = 0;
            }
            const subData = {
              ...item,
              receiverQuantity:
                newValue - (newValue - item.expectAdjustReceiverQuantity) >= 0
                  ? newValue - (newValue - item.expectAdjustReceiverQuantity)
                  : '',
            };
            mainData.push(subData);
            newValue -= item.expectAdjustReceiverQuantity;
          }
        } else {
          mainData.push(item);
        }
      });
      let sumDeliverQuantity = 0;
      let sumReceiverQuantity = 0;
      let maxAdjustQuantity = 0;
      const tableData = [];
      params.context.props.tableData.forEach(item => {
        if (item.basketCode === params.data.basketCode) {
          tableData.push(item);
          if (item.expectAdjustDeliverQuantity) {
            sumDeliverQuantity += item.expectAdjustDeliverQuantity;
          }
          if (item.expectAdjustReceiverQuantity) {
            sumReceiverQuantity += item.expectAdjustReceiverQuantity;
          }
        }
      });
      if (Math.abs(sumDeliverQuantity) > Math.abs(sumReceiverQuantity)) {
        maxAdjustQuantity = Math.abs(sumReceiverQuantity);
      } else {
        maxAdjustQuantity = Math.abs(sumDeliverQuantity);
      }
      sumDeliverQuantity = Math.abs(sumDeliverQuantity);
      sumReceiverQuantity = Math.abs(sumReceiverQuantity);
      if (
        params.newValue > sumReceiverQuantity ||
        params.newValue > Math.abs(params.data.expectAdjustDeliverQuantity) ||
        params.newValue > maxAdjustQuantity ||
        sumBy(grouped[params.data.basketCode], 'deliveryQuantity') >
          maxAdjustQuantity
      ) {
        return false;
      }
      params.context.props.handleQuantity(mainData);
    } else if (params.colDef.field === 'receiverQuantity') {
      let deliverQuantity = 0;
      let receiverQuantity = 0;
      let maxAdjustQuantity = 0;
      params.context.props.tableData.forEach(item => {
        if (item.basketCode === params.data.basketCode) {
          if (item.expectAdjustDeliverQuantity) {
            deliverQuantity += item.expectAdjustDeliverQuantity;
          }
          if (item.expectAdjustReceiverQuantity) {
            receiverQuantity += item.expectAdjustReceiverQuantity;
          }
        }
      });
      if (Math.abs(deliverQuantity) > Math.abs(receiverQuantity)) {
        maxAdjustQuantity = Math.abs(receiverQuantity);
      } else {
        maxAdjustQuantity = Math.abs(deliverQuantity);
      }

      if (
        params.newValue > params.data.expectAdjustReceiverQuantity &&
        params.newValue > maxAdjustQuantity
      ) {
        params.context.props.onShowWarning(
          'SL Nhập Điều Chỉnh phải nhỏ hơn hoặc bằng Số Lượng Cần Điều Chỉnh',
        );
        return false;
      }
      params.context.props.onUpdateDetailsCommand({
        field: 'tableData',
        index: params.node.rowIndex,
        data: updaterData,
      });
    } else {
      params.context.props.onUpdateDetailsCommand({
        field: 'tableData',
        index: params.node.rowIndex,
        data: updaterData,
      });
    }

    return true;
  },
  suppressMovable: true,
};

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends React.PureComponent {
  render() {
    const { tableData, formik } = this.props;
    return (
      <Expansion
        title="IV. Thông Tin Xử Lý"
        content={
          <FormData
            name="tableData"
            idGrid="tableData"
            defaultColDef={defaultColDef}
            gridStyle={{ height: 'auto' }}
            columnDefs={commonColumns}
            rowData={tableData}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
            errors={formik.errors}
            touched={formik.touched}
            autoLayout
            gridProps={{
              context: this,
              suppressScrollOnNewData: true,
              suppressHorizontalScroll: true,
              domLayout: 'autoHeight',
              getRowStyle: params => {
                if (!params.data.isLastRow && params.data.isMergeRow) {
                  return { border: 'none' };
                }
                return { border: 'none', borderBottom: appTheme.shade.border };
              },
            }}
          />
        }
      />
    );
  }
}
TableSection.propTypes = {
  tableData: PropTypes.array,
  formik: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  tableData: selectArr(['formData', 'tableData']),
});

const withConnect = connect(
  mapStateToProps,
  null,
);
export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(TableSection)),
);
