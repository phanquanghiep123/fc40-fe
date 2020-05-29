import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { MTableHeader } from 'material-table/dist/m-table-header';

import { convert } from './utils';

export const styles = theme => ({
  header: {
    position: 'static',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.head,
  },
});

/* eslint-disable no-nested-ternary */
export class MuiTableHeader extends MTableHeader {
  isSortable = (column, sorting) =>
    sorting &&
    column.sort !== false &&
    column.hidden !== true &&
    column.sorting !== false;

  hideSortIcon = (column, orderBy) => column.tableData.id !== orderBy;

  getOrderDirection = (column, orderBy, orderDirection) =>
    column.tableData.id !== orderBy
      ? 'asc'
      : orderDirection === 'asc'
        ? 'desc'
        : 'asc';

  renderHeader() {
    const rows = convert(this.props.columns);
    const rowSpan = rows.length;

    if (this.props.hasSelection) {
      rows[0].splice(0, 0, this.renderSelectionHeader(rowSpan));
    }

    if (this.props.showActionsColumn) {
      if (this.props.actionsHeaderIndex >= 0) {
        let endPos = 0;
        if (this.props.hasSelection) {
          endPos = 1;
        }
        rows[0].splice(
          this.props.actionsHeaderIndex + endPos,
          0,
          this.renderActionsHeader(rowSpan),
        );
      } else if (this.props.actionsHeaderIndex === -1) {
        rows[0].push(this.renderActionsHeader(rowSpan));
      }
    }

    if (this.props.hasDetailPanel) {
      rows[0].splice(
        0,
        0,
        this.renderNoneHeader('key-detail-panel-column', rowSpan),
      );
    }

    if (this.props.isTreeData > 0) {
      rows[0].splice(
        0,
        0,
        this.renderNoneHeader('key-tree-data-header', rowSpan),
      );
    }

    const mapArr = rows.map((columns, i) => (
      <TableRow key={String(i)}>
        {columns.map(
          column =>
            React.isValidElement(column) ? column : this.renderCell(column),
        )}
      </TableRow>
    ));

    return mapArr;
  }

  renderNoneHeader(key, rowSpan) {
    return (
      <TableCell
        key={key}
        padding="none"
        rowSpan={rowSpan}
        className={this.props.classes.header}
        style={{ ...this.props.headerStyle }}
      />
    );
  }

  renderSelectionHeader(rowSpan) {
    return React.cloneElement(super.renderSelectionHeader(), {
      width: '1em',
      rowSpan,
    });
  }

  renderActionsHeader(rowSpan) {
    const localization = {
      ...MTableHeader.defaultProps.localization,
      ...this.props.localization,
    };
    return (
      <TableCell
        key="key-actions-column"
        padding="none"
        rowSpan={rowSpan}
        className={this.props.classes.header}
        style={{ ...this.props.headerStyle, textAlign: 'center' }}
      >
        {localization.actions}
      </TableCell>
    );
  }

  renderCell(column) {
    return (
      <TableCell
        key={column.tableData.id}
        className={this.props.classes.header}
        align={['numeric'].indexOf(column.type) !== -1 ? 'right' : 'left'}
        style={{ ...this.props.headerStyle, ...column.headerStyle }}
        {...column.cellProps}
      >
        {this.isSortable(column, this.props.sorting) ? (
          <TableSortLabel
            active={this.props.orderBy === column.tableData.id}
            direction={this.props.orderDirection || 'asc'}
            onClick={() => {
              const orderDirection = this.getOrderDirection(
                column,
                this.props.orderBy,
                this.props.orderDirection,
              );
              this.props.onOrderChange(column.tableData.id, orderDirection);
            }}
            hideSortIcon={this.hideSortIcon(column, this.props.orderBy)}
          >
            {column.title}
          </TableSortLabel>
        ) : (
          column.title
        )}
      </TableCell>
    );
  }

  render() {
    return <TableHead>{this.renderHeader()}</TableHead>;
  }
}

export default withStyles(styles)(MuiTableHeader);
