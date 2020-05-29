import React from 'react';

import { MenuItem, Menu, Divider } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToApp from '@material-ui/icons/ExitToApp';

export const renderMenuHeader = (
  avatar,
  fullName,
  anchorEl,
  isMenuOpen,
  handler,
) => {
  const { onHandleMenuClose, onSignOut } = handler;

  return (
    <Menu
      open={isMenuOpen}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableAutoFocusItem
      onClose={onHandleMenuClose}
    >
      <MenuItem>
        {avatar}
        {fullName}
      </MenuItem>
      <MenuItem disabled onClick={onHandleMenuClose}>
        Thông Tin Chung
      </MenuItem>
      <Divider />
      <MenuItem onClick={onSignOut}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        Đăng xuất
      </MenuItem>
    </Menu>
  );
};
