import React from 'react';
import * as PropTypes from 'prop-types';
import { TablePagination } from '@material-ui/core';

class MTablePagingCustomized extends React.Component {
  /**
   * Handle change page
   * @param pageIndex - the new page index
   */
  handleChangePage = pageIndex => {
    const { keys, formValues, onSubmit, onCleanUp } = this.props;
    onSubmit({ ...formValues, [keys.pageIndex]: pageIndex });

    if (onCleanUp) onCleanUp();
  };

  /**
   * Handle change rows per page
   * @param event
   */
  handleChangeRowPerPage = event => {
    const { keys, formValues, onSubmit, onCleanUp } = this.props;
    const pageSize = event.target.value;

    onSubmit({
      ...formValues,
      [keys.pageIndex]: 0,
      [keys.pageSize]: pageSize,
    });

    if (onCleanUp) onCleanUp();
  };

  render() {
    const { keys, formValues, onCleanUp, ...props } = this.props;

    return (
      <TablePagination
        {...props}
        rowsPerPageOptions={formValues[keys.pageSizeOptions] || [5, 10, 20]}
        rowsPerPage={formValues[keys.pageSize] || 5}
        page={formValues[keys.pageIndex] || 0}
        count={formValues[keys.count] || 0}
        onChangePage={(e, pageIndex) => this.handleChangePage(pageIndex)}
        onChangeRowsPerPage={this.handleChangeRowPerPage}
      />
    );
  }
}

MTablePagingCustomized.defaultProps = {
  keys: {
    pageSizeOptions: 'pageSizeOptions',
    pageSize: 'pageSize',
    pageIndex: 'pageIndex',
    count: 'count',
  },
};

MTablePagingCustomized.propTypes = {
  keys: PropTypes.object, // keys of paging props in formValues
  formValues: PropTypes.object.isRequired, // values used to submit
  onSubmit: PropTypes.func.isRequired, // submit function to fetch new table data
  onCleanUp: PropTypes.func, // clean up after submit (optional)
};

export default MTablePagingCustomized;
