import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';

import { MTableBodyRow } from 'material-table';

export default class MuiTableBodyRow extends MTableBodyRow {
  getIsSelectable() {
    if (this.props.options && this.props.options.isRowSelectable) {
      if (!this.props.options.isRowSelectable(this.props.data)) {
        return false;
      }
    }
    return true;
  }

  renderColumns() {
    const mapArr = this.props.columns
      .filter(
        columnDef =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1),
      )
      .map(columnDef => {
        const value = this.props.getFieldValue(this.props.data, columnDef);
        return (
          <this.props.components.Cell
            icons={this.props.icons}
            columnDef={columnDef}
            value={value}
            key={columnDef.tableData.id}
            rowData={this.props.data}
            rowIndex={this.props.index}
          />
        );
      });
    return mapArr;
  }

  renderSelectionColumn() {
    if (this.getIsSelectable()) {
      return super.renderSelectionColumn();
    }
    return this.renderUnselectionColumn();
  }

  renderUnselectionColumn() {
    return (
      <TableCell
        key="key-selection-column"
        style={{
          width: 48 + 12 * (this.props.treeDataMaxLevel - 1),
        }}
        padding="none"
      >
        <Checkbox
          style={{
            paddingLeft: 12 + this.props.level * 12,
          }}
          disabled
        />
      </TableCell>
    );
  }
}
