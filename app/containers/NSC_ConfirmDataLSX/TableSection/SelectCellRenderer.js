import React from 'react';
import * as PropTypes from 'prop-types';
import { Select, MenuItem, withStyles } from '@material-ui/core';

const style = () => ({
  select: {
    width: '100%',
  },
});

export const targetFields = {
  productVersion: 'productVersion',
};

class SelectCellRenderer extends React.Component {
  handleChange = event => {
    const {
      tableData,
      // tableOriginalData,
      rowData,
      targetField,
      onUpdateTableData,
    } = this.props;

    const updatedRow = { ...rowData };
    const updatedTableData = [...tableData];

    updatedRow[targetField] = event.target.value;
    updatedTableData[rowData.tableData.id] = updatedRow;

    // dispatch changes
    onUpdateTableData(updatedTableData);
  };

  render() {
    const { classes, rowData, options, targetField } = this.props;

    if (typeof options === 'undefined') {
      return null;
    }

    return (
      <Select
        className={classes.select}
        name={targetField}
        value={rowData[targetField] || ''}
        onChange={this.handleChange}
        disabled={options.length <= 1 || rowData.isConfirmed}
        style={{
          ...(options.length === 0 ? { borderBottom: '1px solid red' } : {}),
        }}
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
  rowData: PropTypes.object.isRequired, // current row data
  options: PropTypes.array, // options of the selectBox
  targetField: PropTypes.string, // selected value will be stored into rowData[targetField]
  onUpdateTableData: PropTypes.func, // action to update redux store
};

export default withStyles(style())(SelectCellRenderer);
