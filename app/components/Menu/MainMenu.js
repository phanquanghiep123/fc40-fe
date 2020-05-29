import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { isEqual } from 'lodash';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Collapse from '@material-ui/core/Collapse';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import Spacing from 'components/Spacing';

import MuiMenuItem from './MenuItem';

export const styles = {
  sidebar: {
    padding: '40px 0px 0px 0px',
  },
};

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getRenderState(props.location, props.menu),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.location, this.props.location)) {
      const { root, path } = this.getRenderState(
        nextProps.location,
        nextProps.menu,
      );

      // originalPath - this will not be modified
      this.setState({ root, path, originalPath: path });
    }
  }

  getRenderState(location, menu) {
    let root = 0;
    let path = [];

    if (location && location.pathname) {
      const result = this.findPath(location.pathname, { children: menu });
      if (result && result.path) {
        root = result.root ? result.root : 0;
        path = result.path.length > 0 ? result.path : [];
      }
    }

    return { root, path };
  }

  findPath(link, tree) {
    if (!tree) {
      return null;
    }
    if (tree.link === link) {
      const path = [];
      if (tree.id) {
        // add itemId into path
        path.unshift(tree.id);
      }
      return { path };
    }
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i += 1) {
        const child = tree.children[i];
        const result = this.findPath(link, child);
        if (result) {
          if (tree.id) {
            // add parentId into path
            result.path.unshift(tree.id);
          }
          // set root index
          result.root = i;
          return result;
        }
      }
    }
    return null;
  }

  getItemSelected(items, i) {
    return items[i];
  }

  handleItemClick = (item, i) => this.setState({ root: i });

  handleItemExpand = (itemId, level = 0) => {
    const { path, originalPath } = this.state;
    const isExist = path && path.includes(itemId);

    // set length of path by level
    const updatedPath = [...path];
    updatedPath.length = level;

    // add item if not exist
    if (!isExist) {
      updatedPath.push(itemId);

      const isInOriginalPath = originalPath && originalPath.includes(itemId);
      if (isInOriginalPath) {
        const childIndex = originalPath.indexOf(itemId) + 1;
        if (originalPath[childIndex]) {
          updatedPath.push(originalPath[childIndex]);
        }
      }
    }

    this.setState({ path: updatedPath });
  };

  renderMenu(items, level = 0) {
    return (
      <List component="nav">
        {items &&
          items.length > 0 &&
          items.map(item => this.renderItem(item, level))}
      </List>
    );
  }

  renderItem(item, level = 0) {
    const { path } = this.state;

    const count = path.length;

    const isActive = path.indexOf(item.id) !== -1;
    const hasChildren = item.children && item.children.length > 0;

    const hasLink = !hasChildren && item.link;

    return (
      <React.Fragment key={item.id}>
        <MuiMenuItem
          to={{
            pathname: item.link,
            state: {
              isFromMenu: true,
            },
          }}
          count={count}
          level={level}
          label={item.label}
          active={isActive}
          hasChildren={hasChildren}
          component={hasLink ? RouterLink : null}
          onClick={() => this.handleItemExpand(item.id, level)}
        />
        {hasChildren && (
          <Collapse in={isActive} unmountOnExit>
            {this.renderMenu(item.children, level + 1)}
          </Collapse>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { root } = this.state;
    const { classes, menu } = this.props;

    const itemSelected = this.getItemSelected(menu, root);

    return (
      <div className={classes.sidebar}>
        <PopupState variant="popover" popupId="main-popover">
          {popupState => {
            const popoverStyle = {
              paper: {
                width: popupState.isOpen
                  ? popupState.anchorEl.offsetWidth
                  : 'auto',
              },
            };
            const PopoverStyled = withStyles(popoverStyle)(Popover);

            return (
              <React.Fragment>
                <MuiMenuItem
                  level={0}
                  label={itemSelected ? itemSelected.label : 'Danh mục trống'}
                  disabled={!itemSelected}
                  hasChildren={Boolean(itemSelected)}
                  {...bindTrigger(popupState)}
                  style={{ display: 'none' }}
                />
                <PopoverStyled
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuList>
                    {menu.map((item, i) => (
                      <MenuItem
                        key={String(i)}
                        selected={root === i}
                        onClick={() => {
                          popupState.close();
                          this.handleItemClick(item, i);
                        }}
                      >
                        <Typography variant="inherit" noWrap>
                          {item.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </PopoverStyled>
              </React.Fragment>
            );
          }}
        </PopupState>
        <Spacing height={10} />
        {this.renderMenu(itemSelected ? itemSelected.children : [], 1)}
      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  menu: PropTypes.array,
  location: PropTypes.object,
};

MainMenu.defaultProps = {
  menu: [],
};

export default withStyles(styles)(MainMenu);
