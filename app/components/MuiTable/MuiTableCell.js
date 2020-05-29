import React from 'react';

import TableCell from '@material-ui/core/TableCell';

import { MTableCell } from 'material-table';

export default class MuiTableCell extends MTableCell {
  getRenderValue() {
    if (
      this.props.columnDef.emptyValue !== undefined &&
      (this.props.value === undefined || this.props.value === null)
    ) {
      return this.getEmptyValue(this.props.columnDef.emptyValue);
    }
    if (this.props.columnDef.render) {
      return this.props.columnDef.render(
        this.props.rowData,
        'row',
        this.props.rowIndex,
      );
    }
    return super.getRenderValue();
  }

  render() {
    const { icons, columnDef, rowData, rowIndex, ...cellProps } = this.props;

    return (
      <TableCell
        {...cellProps}
        style={this.getStyle()}
        align={
          ['numeric'].indexOf(this.props.columnDef.type) !== -1
            ? 'right'
            : 'left'
        }
        onClick={this.handleClickCell}
      >
        {this.props.children}
        {this.getRenderValue()}
      </TableCell>
    );
  }
}
