import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';

import { withTheme } from '@material-ui/core/styles';

import { TYPE_BASE_UNIT } from 'utils/constants';

import MuiTable from 'components/MuiTable';

import Input from './Input';

export class Section2 extends React.Component {
  columns = [
    {
      title: 'Mã Sản Phẩm',
      field: 'productCode',
    },
    {
      title: 'Tên Sản Phẩm',
      field: 'productName',
    },
    {
      title: 'Đơn Vị Tính',
      field: 'uom',
    },
    {
      title: 'SL Xuất Thực Tế',
      field: 'deliveryQuantity',
    },
    {
      title: 'SL Chia Chọn',
      field: 'pickingQuantity',
    },
    {
      title: 'SL Chêch Lệch',
      field: 'differentQuantity',
    },
    {
      title: 'Tỷ Lệ Chênh Lệch',
      field: 'differentRatioString',
    },
    {
      title: 'Batch',
      field: 'batch',
    },
    {
      title: 'Lệnh Sản Xuất',
      field: 'farmProductionOrder',
    },
    // {
    //   title: 'Tỷ Lệ Phân Bổ',
    //   field: 'ratio',
    // },
    {
      title: 'SL Nhập Bù Lớn Nhất',
      field: 'quantityOffset',
    },
    {
      title: 'SL Điều Chỉnh',
      field: 'differenceModify',
      render: rowData => this.renderDifferenceModify(rowData),
    },
    {
      title: 'Kho Nhập',
      field: 'locatorName',
    },
  ];

  getFieldError(index, field) {
    const { errors } = this.props.formik;
    if (
      errors &&
      errors.modificationDetails &&
      errors.modificationDetails[index] &&
      errors.modificationDetails[index][field]
    ) {
      return true;
    }
    return false;
  }

  setFieldValue(index, field, value) {
    const { formik } = this.props;
    const { modificationDetails } = formik.values;

    const nextModificationDetails = modificationDetails.slice();

    nextModificationDetails[index] = {
      ...nextModificationDetails[index],
      [field]: value,
    };

    formik.updateValues({ modificationDetails: nextModificationDetails });
  }

  renderDifferenceModify(rowData) {
    if (rowData) {
      const {
        tableData: { id: rowIndex },
        baseUoM, // Đơn vị tính cơ bản
        quantityOffset, // SL nhập bù lớn nhất
        differenceModify, // SL điều chỉnh
        farmProductionOrder, // LSX SC
      } = rowData;

      const isError = this.getFieldError(rowIndex, 'differenceModify');

      return (
        <Input
          error={isError}
          value={differenceModify}
          isInteger={baseUoM !== TYPE_BASE_UNIT.KG}
          maxNumber={farmProductionOrder ? quantityOffset : Infinity}
          onChangeValue={value =>
            this.setFieldValue(rowIndex, 'differenceModify', value)
          }
        />
      );
    }
    return null;
  }

  render() {
    const { theme, formik } = this.props;
    const { modificationDetails } = formik.values;

    return (
      <MuiTable
        data={modificationDetails}
        columns={this.columns}
        options={{
          paging: false,
          search: false,
          toolbar: false,
          sorting: false,
          cellStyle: {
            borderBottom: 'none',
          },
          rowStyle: rowData => ({
            borderBottom:
              rowData && rowData.isLastRow ? theme.shade.border : 'none',
          }),
        }}
      />
    );
  }
}

Section2.propTypes = {
  theme: PropTypes.object.isRequired,
  formik: PropTypes.object,
};

export default compose(withTheme())(Section2);
