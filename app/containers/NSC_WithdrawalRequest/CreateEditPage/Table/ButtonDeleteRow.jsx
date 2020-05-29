import React from 'react';
// import PropTypes from 'prop-types';

import { withStyles, Tooltip, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { isObjectWithValidProperty } from 'utils/validation';

export const stylesDeleteButton = () => ({
  root: {
    margin: 0,
    padding: 5,
    fontSize: 12,
  },
});

/* eslint-disable react/prop-types */
function ButtonDeleteRow({ classes, data, context, rowIndex }) {
  const title = 'Xóa dòng';
  // const {
  //   props: { isCreatePage, isEditPage },
  // } = context;

  function removeRow() {
    context.showConfirmationRemovingRecord(data, rowIndex);
  }

  // only show if is creating new request and have at least 1 input filled
  if (data && !data.isSaved && isObjectWithValidProperty(data)) {
    return (
      <Tooltip title={title}>
        <IconButton onClick={removeRow} className={classes.root}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
}

export default withStyles(stylesDeleteButton)(ButtonDeleteRow);
