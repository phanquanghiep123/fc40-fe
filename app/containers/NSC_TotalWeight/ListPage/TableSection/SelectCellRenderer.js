/**
 * Select Box Component inside Material Table
 * will update tableData on change
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Select, MenuItem, withStyles } from '@material-ui/core';

const style = () => ({
  select: {
    width: '100%',
  },
});

export const targetFields = {
  productCode: 'productCode',
  productName: 'productName',
  gradeCode: 'gradeCode',
  gradeName: 'gradeName',
  baseUoM: 'baseUoM',
  deliverCode: 'deliverCode',
  semiFinishedProductCode: 'semiFinishedProductCode',
  semiFinishedProductSlotCode: 'semiFinishedProductSlotCode',
};

class SelectCellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  handleChange = event => {
    const {
      tableData,
      // tableOriginalData,
      rowData,
      targetField,
      onUpdateTableData,
    } = this.props;

    const updatedRow = { ...rowData };

    // store the selected value to targetField
    updatedRow[targetField] = event.target.value;

    // when changing product code
    if (targetField === targetFields.productCode) {
      const selectedProducts = rowData.products.filter(
        product => product.value === event.target.value,
      );

      // update product Name
      if (selectedProducts.length > 0) {
        updatedRow[targetFields.productName] =
          selectedProducts[0].productName || '';
        updatedRow[targetFields.gradeCode] =
          selectedProducts[0].gradeCode || '';
        updatedRow[targetFields.gradeName] =
          selectedProducts[0].gradeName || '';
        updatedRow[targetFields.baseUoM] = selectedProducts[0].baseUoM || '';
      } else {
        updatedRow[targetFields.productName] = '';
        updatedRow[targetFields.gradeCode] = '';
        updatedRow[targetFields.gradeName] = '';
        updatedRow[targetFields.baseUoM] = '';
      }
    }

    const updatedTableData = [...tableData];
    updatedTableData[rowData.tableData.id] = updatedRow;

    // dispatch changes
    onUpdateTableData(updatedTableData);
  };

  render() {
    const { classes, rowData, options, targetField } = this.props;

    return (
      <Select
        ref={this.selectRef}
        className={classes.select}
        name={targetField}
        value={rowData[targetField]}
        onChange={this.handleChange}
        disabled={rowData.productSelectDisabled}
      >
        {options.map(item => (
          <MenuItem value={item.value} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

SelectCellRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired, // data used to render the table, can be modified
  // tableOriginalData: PropTypes.array.isRequired, // original data, will NOT be modified
  rowData: PropTypes.object.isRequired, // current row data
  options: PropTypes.array, // options of the selectBox
  targetField: PropTypes.string, // selected value will be stored into rowData[targetField]
  onUpdateTableData: PropTypes.func, // action to update redux store
};

export default withStyles(style())(SelectCellRenderer);
