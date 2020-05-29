import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

import MuiTableUltimatePaginationInner from './MuiTableUltimatePaginationInner';

export const styles = {
  root: {},
  toolbar: {},
  caption: {
    display: 'inline-block',
    marginLeft: 5,
    marginRight: 5,
  },
  selectRoot: {},
};

export class MuiTablePagination extends React.Component {
  handlePageChange = newPage => {
    this.props.onChangePage(null, newPage - 1);
  };

  renderActionsComponent = ({ count, page, rowsPerPage }) => {
    const totalPages = Math.ceil(count / rowsPerPage) || 0;
    const currentPage = totalPages > page + 1 ? page + 1 : totalPages;

    return (
      <MuiTableUltimatePaginationInner
        totalPages={totalPages}
        currentPage={currentPage}
        siblingPagesRange={1}
        boundaryPagesRange={1}
        hideFirstAndLastPageLinks
        hidePreviousAndNextPageLinks={false}
        onChange={this.handlePageChange}
      />
    );
  };

  render() {
    return (
      <TablePagination
        {...this.props}
        labelRowsPerPage={null}
        ActionsComponent={this.renderActionsComponent}
      />
    );
  }
}

MuiTablePagination.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangePage: PropTypes.func,
};

export default withStyles(styles)(MuiTablePagination);
