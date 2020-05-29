import React from 'react';
import * as PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';
import { remove } from 'lodash';

class CheckboxCell extends React.PureComponent {
  handleChange = event => {
    const { currentSelectedIds, onSelectionChange } = this.props;
    const { checked, value } = event.target;
    let ids = currentSelectedIds;
    // Thêm
    if (checked) {
      if (!currentSelectedIds.includes(value)) {
        ids = [...currentSelectedIds, value];
      }
    } else if (currentSelectedIds.includes(value)) {
      // bớt
      ids = [...currentSelectedIds];
      remove(ids, item => item === value);
    }
    onSelectionChange(ids);
  };

  render() {
    const { rowData, currentSelectedIds } = this.props;
    return (
      <Checkbox
        value={rowData.id}
        disabled={!rowData.purcharseStoppingCkbEnable}
        checked={
          rowData.id && currentSelectedIds.includes(rowData.id.toString())
        }
        onChange={this.handleChange}
      />
    );
  }
}

CheckboxCell.propTypes = {
  rowData: PropTypes.object,
  currentSelectedIds: PropTypes.array,
  onSelectionChange: PropTypes.func,
};

export default CheckboxCell;
