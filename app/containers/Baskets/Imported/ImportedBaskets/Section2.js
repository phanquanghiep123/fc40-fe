import React from 'react';
import FormData from 'components/FormikUI/FormData';
import PropTypes from 'prop-types';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle } from 'utils/index';
import * as constants from './constants';
import { defaultColDefSection2 } from './Config';

export default function Section2(props) {
  let data = [];
  const keys = [];
  const sumResult = {};
  const uniqBasketDocumentDetails = [];
  if (props.section2) {
    props.section2.forEach(item => {
      data.push(item);
      keys.push(item.basketCode);
    });
  }
  if (props.section3) {
    props.section3.forEach(item => {
      if (!sumResult[item.basketCode]) {
        sumResult[item.basketCode] = item.receiverQuantity;
        uniqBasketDocumentDetails.push(item);
      } else {
        sumResult[item.basketCode] += item.receiverQuantity || 0;
      }
    });
  }
  // tạo unique khay sọt, những khay sọt trùng mã thì được gom nhóm
  uniqBasketDocumentDetails.forEach(item => {
    const index = keys.indexOf(item.basketCode);
    if (index > -1) {
      //   cập nhật vào theo index
      data[index] = {
        ...data[index],
        receiverQuantity: sumResult[item.basketCode],
      };
      props.setBasketDetails(data);
    } else if (item.basketCode && item.receiverQuantity >= 0) {
      //  thêm mới vào mảng data
      data.push({
        ...item,
        receiverQuantity: sumResult[item.basketCode],
        deliveryQuantity: 0,
        loanQuantity: 0,
      });
      const arrBasketCode = [];
      data.forEach(subItem => {
        arrBasketCode.push(subItem.basketCode);
      });
      const arrSection2 = [];
      arrBasketCode.sort().forEach(subData => {
        data.forEach(subItem => {
          if (subItem.basketCode === subData) {
            arrSection2.push(subItem);
          }
        });
      });
      data = arrSection2;
      props.setBasketDetails(data);
    }
  });
  const bottomDoBasket = () => {
    // Nhap dieu chuyen
    if (data) {
      if (
        props.formik.values.importSubType.value ===
        constants.TYPE_PNKS.PNKS_DIEU_CHUYEN
      ) {
        let receiverQuantity = 0;
        let importReceiptQuantity = 0;
        let deliveryQuantity = 0;
        if (data.length > 0) {
          data.forEach(item => {
            receiverQuantity += item.receiverQuantity || 0;
            importReceiptQuantity += item.importReceiptQuantity || 0;
            deliveryQuantity += item.deliveryQuantity || 0;
          });
        }
        return [
          {
            totalCol: true,
            basketName: 'Tổng',
            receiverQuantity,
            importReceiptQuantity,
            deliveryQuantity,
          },
        ];
      }
      if (
        props.formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_TRA
      ) {
        let receiverQuantity = 0;
        let loanQuantity = 0;
        if (data.length > 0) {
          data.forEach(item => {
            receiverQuantity += item.receiverQuantity || 0;
            loanQuantity += item.loanQuantity || 0;
          });
        }
        return [
          {
            totalCol: true,
            basketName: 'Tổng',
            receiverQuantity,
            loanQuantity,
          },
        ];
      }
    }
    return [];
  };

  const { formik, columnSection2, onGridReady, onNewColumnsLoaded } = props;
  return (
    <FormData
      name="section2"
      gridStyle={{ height: 'auto' }}
      rowData={data}
      columnDefs={columnSection2}
      defaultColDef={defaultColDefSection2}
      setFieldValue={formik.setFieldValue}
      setFieldTouched={formik.setFieldTouched}
      idGrid="imported-section2"
      autoLayout
      gridProps={{
        suppressScrollOnNewData: true,
        suppressHorizontalScroll: true,
        pinnedBottomRowData: bottomDoBasket(),
        frameworkComponents: {
          customPinnedRowRenderer: PinnedRowRenderer,
        },
        domLayout: 'autoHeight',
        onNewColumnsLoaded,
        getRowStyle,
      }}
      onGridReady={onGridReady}
      {...formik}
    />
  );
}
Section2.propTypes = {
  formik: PropTypes.object,
  columnSection2: PropTypes.func,
  setBasketDetails: PropTypes.func,
  onNewColumnsLoaded: PropTypes.func,
  onGridReady: PropTypes.func,
};
