import React from 'react';
import * as PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';

class ConfirmCellRenderer extends React.PureComponent {
  handleChange = () => {
    const { rowData, tableData, onUpdateTableData } = this.props;
    const updatedRow = { ...rowData };
    updatedRow.status = !updatedRow.status;

    const updatedTable = [...tableData];
    updatedTable[updatedRow.tableData.id] = updatedRow;

    // dispatch change
    onUpdateTableData(updatedTable);
  };

  render() {
    const { rowData } = this.props;

    return (
      <Checkbox
        disabled={
          !rowData.isMainRow ||
          rowData.productVersionOptions.length === 0 ||
          rowData.isConfirmed
        }
        style={{ visibility: rowData.isMainRow ? 'visible' : 'hidden' }}
        checked={rowData.status}
        value={rowData.status ? '1' : '0'}
        onChange={this.handleChange}
      />
    );
  }
}

ConfirmCellRenderer.propTypes = {
  rowData: PropTypes.object,
  tableData: PropTypes.array,
  onUpdateTableData: PropTypes.func,
};

export default ConfirmCellRenderer;
