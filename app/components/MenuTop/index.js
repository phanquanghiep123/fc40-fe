import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Popper,
  Fade,
  Paper,
  Tabs,
  Tab,
  ListItem,
  ListItemText,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import appTheme from '../../containers/App/theme';

const styles = (theme = appTheme) => ({
  root: {
    flexGrow: 1,
  },
  rootMenuList: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  popperWrapper: {
    display: 'flex',
    maxWidth: '100%',
    minHeight: '250px',
    maxHeight: 'inherit',
    minWidth: '600px',
    [theme.breakpoints.up('md')]: {
      minWidth: '700px',
    },
  },
  paper: { opacity: '1 !important' },
  menuLv1: {
    color: '#fff',
    borderBottom: `3px solid transparent`,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit / 2}px`,
  },
  menuLv1Open: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderBottom: `3px solid ${theme.palette.common.light}`,
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.5)',
    },
  },
  menuLv1Active: {
    borderBottom: `3px solid ${theme.palette.common.light}`,
  },
  menuLv1Disabled: {
    cursor: 'unset',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  menuLv3: {
    maxHeight: 600,
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
  },
  popper: {
    zIndex: 1300, // higher than top appBar
    maxHeight: '80vh',
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiTabs: {
        flexContainer: {
          flexDirection: 'column',
          color: theme.palette.text.primary,
          height: '100%',
          // width: '250px',
        },
        indicator: {
          display: 'none',
        },
      },
      MuiTab: {
        root: {
          textAlign: 'left',
          '&$selected': {
            background: theme.palette.background.default,
          },
        },
      },
      MuiButtonBase: {
        root: {
          '&:hover': {
            background: '#eee',
          },
        },
      },
      MuiListItemText: {
        primary: {
          transition: 'margin 300ms ease',
          '&:hover': {
            fontWeight: 'bold',
          },
          '&:active': {
            color: theme.palette.action.disabled,
            marginLeft: theme.spacing.unit,
          },
        },
      },
    },
  });

function TabContainer(props) {
  return <div style={props.style}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
};

function ListItemLink({ to, style, text, isActive }) {
  return (
    <ListItem component={Link} to={to} style={style}>
      <ListItemText
        primary={
          isActive ? (
            <Typography
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {text}
            </Typography>
          ) : (
            text
          )
        }
      />
    </ListItem>
  );
}

ListItemLink.propTypes = {
  to: PropTypes.object,
  text: PropTypes.string,
  style: PropTypes.object,
  isActive: PropTypes.bool,
};

class MenuTop extends React.Component {
  state = {
    matchedMenuLv1: null, // matched menu level 1 ID
    matchedMenuLv2: null, // matched menu level 2 INDEX
    matchedMenuLv3: null, // matched menu level 3 ID

    /**
     * Handle menu level 2 status
     */
    activeMenuLv2: 0, // handle menu level 2 active status
    prioritizedFocus: true, // force focus onto matchedMenu level 2 instead of the first one
  };

  constructor(props) {
    super(props);
    this.menuListRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { matchedPath, menu } = nextProps;

    if (matchedPath && matchedPath.length === 3) {
      const matchedMenuLv1Id = matchedPath[2];
      const matchedMenuLv2Id = matchedPath[1];
      const matchedMenuLv3Id = matchedPath[0];

      const matchedMenuLv1 = menu.filter(
        item => item.id === matchedMenuLv1Id,
      )[0];

      let matchedMenuLv2Index = null;
      if (matchedMenuLv1.children && matchedMenuLv1.children.length) {
        const menuLv2Ids = matchedMenuLv1.children.map(item => item.id);
        matchedMenuLv2Index = menuLv2Ids.indexOf(matchedMenuLv2Id);
      }

      this.setState({
        matchedMenuLv1: matchedMenuLv1Id,
        matchedMenuLv2: matchedMenuLv2Index,
        matchedMenuLv3: matchedMenuLv3Id,
      });
    }
  }

  /**
   * Handle menu items level 2 - update State.menuLv2
   * @param event
   * @param activeMenuLv2
   */
  handleMenuLv2Change = (event, activeMenuLv2) => {
    this.setState({ activeMenuLv2 });
  };

  /**
   * Handle Click Away when menu popup is opened
   * @param popupState
   */
  clickAwayHandler = popupState => {
    popupState.close();
    this.setState({ activeMenuLv2: 0, prioritizedFocus: true }); // reset default to the first tab and prioritizedFocus
  };

  /**
   * Remove matched path focus
   * @param isMatched - if menu level 1 matches the matchedPath
   */
  removePrioritizedFocus = isMatched => {
    if (!isMatched) return;
    this.setState({ prioritizedFocus: false });
  };

  /**
   * Render Menu
   * @return {ReactDOM}
   */
  renderMenu = () => {
    const { classes } = this.props;
    return (
      <MenuList ref={this.menuListRef} className={classes.rootMenuList}>
        {this.renderMenuLv1()}
      </MenuList>
    );
  };

  /**
   * Render Menu Level 1
   * @return {*|ReactDOM}
   */
  renderMenuLv1 = () => {
    const { classes, menu } = this.props;
    const { matchedMenuLv1 } = this.state;

    if (!menu) {
      return null;
    }

    // Calculate popper width
    let paperWidth = null;
    if (this.menuListRef.current) {
      paperWidth =
        window.innerWidth - 2 * this.menuListRef.current.listRef.offsetLeft;
    }

    // the target anchor for popper
    const selection = document.getElementById('menuAnchor');
    const getBoundingClientRect = () => selection.getBoundingClientRect();
    return menu.map(item => (
      <PopupState key={item.id} variant="popper" popupId="main-popover">
        {popupState => {
          const isMatched = popupState.isOpen && item.id === matchedMenuLv1;
          return (
            <div>
              <MenuItem
                className={classNames(
                  classes.menuLv1,
                  popupState.isOpen ? classes.menuLv1Open : null, // when popup opened
                  matchedMenuLv1 === item.id ? classes.menuLv1Active : null, // when active
                  !item.children || !item.children[0]
                    ? classes.menuLv1Disabled
                    : null,
                )}
                {...(item.children && item.children[0]
                  ? bindToggle(popupState)
                  : {})}
              >
                {item.label}
              </MenuItem>
              {popupState.isOpen ? (
                <Popper
                  id="mypopper"
                  {...bindPopper(popupState)}
                  className={classes.popper}
                  anchorEl={{
                    clientWidth: getBoundingClientRect().width,
                    clientHeight: getBoundingClientRect().height,
                    getBoundingClientRect,
                  }}
                  modifiers={{
                    flip: {
                      enabled: true,
                    },
                    arrow: {
                      enabled: true,
                    },
                  }}
                >
                  {({ TransitionProps }) => (
                    <ClickAwayListener
                      onClickAway={() => this.clickAwayHandler(popupState)}
                    >
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper className={classes.paper}>
                          <div
                            className={this.props.classes.popperWrapper}
                            style={{ width: `${paperWidth}px` }}
                          >
                            {this.renderMenuLv2(
                              popupState,
                              item.children,
                              isMatched,
                            )}
                          </div>
                        </Paper>
                      </Fade>
                    </ClickAwayListener>
                  )}
                </Popper>
              ) : null}
            </div>
          );
        }}
      </PopupState>
    ));
  };

  /**
   * Render menu level 2
   *
   * @param popupState - manage popup state
   * @param subMenu - children of current menu item level 1
   * @param isMatched - if menu level 1 matches the matchedPath
   * @return {null|ReactDOM}
   */
  renderMenuLv2 = (popupState, subMenu, isMatched) => {
    const { matchedMenuLv2, prioritizedFocus } = this.state;
    let { activeMenuLv2 } = this.state;

    if (isMatched && prioritizedFocus) {
      activeMenuLv2 = matchedMenuLv2;
    }

    const tabs = subMenu.map(item => (
      <Tab
        key={item.id}
        label={item.label}
        onClick={() => this.removePrioritizedFocus(isMatched)}
      />
    ));

    let key = 0;
    const tabContainers = subMenu.map(item => {
      const returnValue = activeMenuLv2 === key && (
        <TabContainer
          key={item.id}
          style={{
            padding: appTheme.spacing.unit * 3,
            width: '100%',
            borderLeft: `2px solid ${appTheme.palette.background.default}`,
          }}
        >
          {this.renderMenuLv3(item.children)}
        </TabContainer>
      );
      key += 1;
      return returnValue;
    });

    return (
      <React.Fragment>
        <Tabs
          value={activeMenuLv2}
          onChange={this.handleMenuLv2Change}
          style={{ minWidth: 220 }}
        >
          {tabs}
        </Tabs>
        {tabContainers}
      </React.Fragment>
    );
  };

  /**
   * Render Menu Level 3
   *
   * @param subMenu - children of current menu item level 2
   * @return {*|ReactDOM}
   */
  renderMenuLv3 = subMenu => {
    const { classes } = this.props;
    const { matchedMenuLv3 } = this.state;

    return (
      <div className={classes.menuLv3}>
        {subMenu.map(item => (
          <ListItemLink
            key={item.id}
            to={{
              pathname: item.link,
              state: {
                isFromMenu: true,
              },
            }}
            text={item.label}
            style={{
              padding: `${appTheme.spacing.unit / 2}px ${appTheme.spacing.unit *
                2}px`,
              with: 'auto',
              maxWidth: 300,
              ...(matchedMenuLv3 === item.id
                ? { background: appTheme.palette.background.default }
                : {}),
            }}
            isActive={matchedMenuLv3 === item.id}
          />
        ))}
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={classes.root}>{this.renderMenu()}</div>
      </MuiThemeProvider>
    );
  }
}

MenuTop.propTypes = {
  classes: PropTypes.object.isRequired,
  menu: PropTypes.array,
  location: PropTypes.object,
  matchedPath: PropTypes.array,
};

MenuTop.defaultProps = {};

export default withStyles(styles())(MenuTop);
