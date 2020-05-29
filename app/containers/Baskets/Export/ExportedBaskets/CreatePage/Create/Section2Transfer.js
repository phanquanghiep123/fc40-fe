import React from 'react';
import PropTypes from 'prop-types';
import FormData from 'components/FormikUI/FormData';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import { getRowStyle } from 'utils/index';
import { defaultColDefDo } from '../Config';

const bottomRowData = data => [
  {
    totalCol: true,
    basketName: 'Tổng',
    doQuantity: sumBy(data, 'doQuantity'),
    quantity: sumBy(data, 'quantity'),
    deliveryQuantity: sumBy(data, 'deliveryQuantity'),
    diffQuantity: sumBy(data, 'diffQuantity'),
  },
];

export const basketDetails = basketDocumentDetails => {
  if (basketDocumentDetails) {
    return basketDocumentDetails.filter(item => item && item.basketCode);
  }
  return basketDocumentDetails;
};
export function Section2Transfer(props) {
  const data = [];
  const keys = [];
  const sumResult = {};
  const uniqBasketDocumentDetails = [];
  const { formik, config, setDataSection2 } = props;

  if (formik.values.doBasketDetails) {
    // Những thông tin khay sọt hiện tại được đưa hết lên bảng so sánh
    // lấy thông tin từ BBGH
    formik.values.doBasketDetails.forEach(item => {
      data.push(item);
      keys.push(item.basketCode);
    });

    // lấy thông tin khay sọt của phiếu,  tạo unique khay sọt, những khay sọt trùng mã thì được gom nhóm
    formik.values.basketDocumentDetails.forEach(item => {
      if (!sumResult[item.basketCode]) {
        sumResult[item.basketCode] = item.deliveryQuantity;
        uniqBasketDocumentDetails.push(item);
      } else {
        sumResult[item.basketCode] += item.deliveryQuantity;
      }
    });
    // chỉnh sửa thông tin so sánh hoặc bổ sung thông tin so sánh mới
    uniqBasketDocumentDetails.forEach(item => {
      const index = keys.indexOf(item.basketCode);
      if (index > -1) {
        //   cập nhật vào theo index
        data[index] = {
          ...data[index],
          deliveryQuantity: sumResult[item.basketCode],
        };
      } else if (item.basketCode) {
        //  thêm mới vào mảng data
        data.push({
          ...item,
          deliveryQuantity: sumResult[item.basketCode],
          quantity: 0,
          doQuantity: 0,
        });
      }
    });
    setDataSection2(data);
  } else if (
    !formik.values.doBasketDetails &&
    formik.values.basketDocumentDetails &&
    basketDetails(formik.values.basketDocumentDetails).length > 0
  ) {
    formik.values.basketDocumentDetails.forEach(item => {
      if (!sumResult[item.basketCode]) {
        sumResult[item.basketCode] = item.deliveryQuantity;
        uniqBasketDocumentDetails.push(item);
      } else {
        sumResult[item.basketCode] += item.deliveryQuantity;
      }
    });
    // chỉnh sửa thông tin so sánh hoặc bổ sung thông tin so sánh mới
    uniqBasketDocumentDetails.forEach(item => {
      const index = keys.indexOf(item.basketCode);
      if (index > -1) {
        //   cập nhật vào theo index
        data[index] = {
          ...data[index],
          deliveryQuantity: sumResult[item.basketCode],
        };
      } else if (item.basketCode) {
        //  thêm mới vào mảng data
        data.push({
          ...item,
          deliveryQuantity: sumResult[item.basketCode],
          quantity: 0,
          doQuantity: 0,
        });
        keys.push(item.basketCode);
      }
    });
    setDataSection2(data);
  }

  return (
    <FormData
      name="doBasketDetails"
      rowData={data}
      gridStyle={{ height: 250 }}
      defaultColDef={defaultColDefDo}
      gridProps={{
        suppressScrollOnNewData: true,
        suppressHorizontalScroll: true,
        pinnedBottomRowData: bottomRowData(data),
        frameworkComponents: {
          customPinnedRowRenderer: PinnedRowRenderer,
        },
        getRowStyle,
        onNewColumnsLoaded: props.onNewColumnsLoaded,
      }}
      columnDefs={config.section2ColumnDefs}
      onGridReady={props.onGridReady}
    />
  );
}

Section2Transfer.propTypes = {
  config: PropTypes.object,
  formik: PropTypes.object,
  onGridReady: PropTypes.func,
  onNewColumnsLoaded: PropTypes.func,
  setDataSection2: PropTypes.func,
};
