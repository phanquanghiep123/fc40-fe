import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import { MuiTablePagination } from 'components/MuiTable';

export const styles = {
  paginationRoot: {
    width: '100%',
  },
  paginationToolbar: {
    padding: 0,
    width: '100%',
  },
  paginationSelectRoot: {
    margin: 0,
  },
};

export class FormPagination extends React.PureComponent {
  getLabelDisplayedRows = row => `${row.from}-${row.to} của ${row.count}`;

  renderSelectDisplayed = value => (
    <div style={{ padding: '0px 5px' }}>{`${value} bản ghi/trang`}</div>
  );

  render() {
    const { classes, ...props } = this.props;

    return (
      <Table>
        <TableFooter style={{ display: 'grid' }}>
          <TableRow>
            <MuiTablePagination
              classes={{
                root: classes.paginationRoot,
                toolbar: classes.paginationToolbar,
                selectRoot: classes.paginationSelectRoot,
              }}
              style={{
                float: 'right',
                overflowX: 'auto',
              }}
              colSpan={3}
              SelectProps={{
                renderValue: this.renderSelectDisplayed,
              }}
              labelDisplayedRows={this.getLabelDisplayedRows}
              {...props}
            />
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

FormPagination.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormPagination);
