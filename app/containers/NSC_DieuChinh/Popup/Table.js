import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';

import { withTheme } from '@material-ui/core/styles';

import MuiInput from 'components/MuiInput';
import MuiTable from 'components/MuiTable';

import Input from './Input';

import { TYPE_DIEUCHINH } from '../constants';

export class PopupTable extends React.Component {
  columns = [
    {
      title: 'STT',
      field: 'rowIndex',
      width: 60,
      render: this.renderNumberOrder,
    },
    {
      title: 'Mã Đi Hàng',
      field: 'productCode',
    },
    {
      title: 'Tên Sản Phẩm',
      field: 'productName',
    },
    {
      title: 'Batch',
      field: 'batch',
    },
    {
      title: 'Phân Loại Xử Lý',
      field: 'processingTypeName',
    },
    {
      title: 'Khối Lượng Giao',
      field: 'deliveryQuantity',
    },
    {
      title: 'Khối Lượng Nhận',
      field: 'receiveQuantity',
    },
    {
      title: 'Khối Lượng Chênh Lệch',
      field: 'differentQuantity',
    },
    {
      title: 'Tỷ Lệ Chênh Lệch',
      field: 'differentRatio',
    },
    {
      title: 'LSX',
      field: 'farmProductionOrder',
    },
    {
      title: 'Khối lượng',
      field: 'quantity',
    },
    {
      title: 'Kho',
      field: 'locatorIdModified',
      render: rowData => this.renderLocator(rowData),
    },
    {
      title: 'Khối Lượng Điều Chỉnh',
      field: 'quantityModify',
      render: rowData => this.renderQuantityModify(rowData),
    },
  ];

  getFieldError(index, field) {
    const { errors } = this.props.formik;
    if (errors && errors[index] && errors[index][field]) {
      return true;
    }
    return false;
  }

  setFieldValue(index, field, value) {
    const { formik } = this.props;
    const nextValues = formik.values.slice();

    nextValues[index] = {
      ...nextValues[index],
      [field]: value,
    };

    formik.setValues(nextValues);
  }

  editableInput = rowData => {
    const {
      differenceStatus, // Trạng thái điều chỉnh
    } = rowData;

    // Trạng thái chưa điều chỉnh
    if (differenceStatus === TYPE_DIEUCHINH.NOT_ADJUSTED) {
      return true;
    }
    return false;
  };

  onLocatorChange = (rowIndex, nextValue) => {
    this.setFieldValue(rowIndex, 'locatorIdModified', nextValue);
  };

  onQuantityChange = (rowIndex, nextValue) => {
    this.setFieldValue(rowIndex, 'quantityModify', nextValue);
  };

  renderNumberOrder(rowData) {
    if (rowData.isMainRow) {
      return rowData.rowIndex;
    }
    return '';
  }

  renderLocator(rowData) {
    if (rowData) {
      const {
        tableData: { id: rowIndex },
        locatorIds, // Danh sách kho
        locatorIdModified, // Kho
      } = rowData;
      const isEditable = this.editableInput(rowData);

      return (
        <MuiInput
          select
          value={locatorIdModified}
          options={locatorIds}
          disabled={!isEditable}
          valueKey="locatorId"
          labelKey="locatorCode"
          onChange={event => this.onLocatorChange(rowIndex, event.target.value)}
        />
      );
    }
    return '';
  }

  renderQuantityModify(rowData) {
    if (rowData) {
      const {
        tableData: { id: rowIndex },
        quantityModify, // Khối lượng điều chỉnh
      } = rowData;

      const isError = this.getFieldError(rowIndex, 'quantityModify');
      const isEditable = this.editableInput(rowData);

      if (isEditable) {
        return (
          <Input
            error={isError}
            value={quantityModify}
            onChangeValue={value => this.onQuantityChange(rowIndex, value)}
          />
        );
      }

      return quantityModify;
    }
    return '';
  }

  render() {
    const { theme, formik } = this.props;

    return (
      <MuiTable
        data={formik.values}
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

PopupTable.propTypes = {
  theme: PropTypes.object.isRequired,
  formik: PropTypes.object,
};

export default compose(withTheme())(PopupTable);
