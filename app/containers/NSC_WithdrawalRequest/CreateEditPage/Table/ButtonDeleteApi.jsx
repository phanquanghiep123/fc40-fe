import React from 'react';
// import PropTypes from 'prop-types';

import { withStyles, Tooltip, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { stylesDeleteButton } from './ButtonDeleteRow';

/* eslint-disable react/prop-types */
function ButtonDeleteRow({ classes, data, context, rowIndex }) {
  const title = 'Xóa';
  // const {
  //   props: { isViewPage },
  // } = context;

  function deleteRow() {
    context.showConfirmationDeletingRecord(data.id, rowIndex);
  }

  if (data) {
    return (
      <Tooltip title={title}>
        <IconButton onClick={deleteRow} className={classes.root}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
}

export default withStyles(stylesDeleteButton)(ButtonDeleteRow);
