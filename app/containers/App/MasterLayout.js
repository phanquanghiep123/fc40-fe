import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { localstoreUtilites } from 'utils/persistenceData';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { HubConnectionBuilder } from '@aspnet/signalr/dist/browser/signalr';
import { Link as RouterLink } from 'react-router-dom';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsInputHdmi from '@material-ui/icons/SettingsInputHdmi';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';

import MainMenu from 'components/Menu/MainMenu';
import Footer from 'components/Footer';

import { DEVICE_EXTERNAL } from 'utils/socketUtils';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { logout, signalRUrl } from 'utils/request';
import {
  makeSelectLoading,
  makeSelectStatus,
  makeSelectMenu,
  makeSelectHeader,
  makeSelectFullName,
  makeSelectLocation,
  makeSelectStatusDevice,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import SnackbarWrapper from '../../components/Snackbars';

import { renderMenuHeader } from './MenuItem';
import styles, { images } from './styles';
import { closeSnackBar, getMenu } from './actions';
import message from './messageGlobal';
import MenuTop from '../../components/MenuTop';

class Dashboard extends React.PureComponent {
  state = {
    open: false,
    anchorEl: null,
    matchedPath: [],
  };

  handleDrawerToggle = () => {
    const { matchedPath } = this.state;
    if (!matchedPath || matchedPath.length < 2) {
      this.setState({ open: false });
      return;
    }
    this.setState(state => ({ open: !state.open }));
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  componentWillMount() {
    this.props.onGetMenu();
    this.regSignalR();
  }

  regSignalR = () => {
    if (!window.signalR) {
      window.signalR = new HubConnectionBuilder()
        .withUrl(`${signalRUrl}notificationhub`, {
          accessTokenFactory: () =>
            localstoreUtilites.getAuthFromLocalStorage().meta.accessToken,
          logger: {
            logLevel: 6, // don't log to console
          },
        })
        .build();
    }
    if (window.signalR.connectionState !== 1) {
      // if signalR not connected -> reconnect
      window.signalR.start().catch(err => console.log(err));
    }
    async function start() {
      try {
        if (window.signalR.connectionState !== 1) {
          await window.signalR.start().catch(err => console.log(err));
        }
      } catch (err) {
        setTimeout(() => start(), 5000);
      }
    }

    window.signalR.onclose(async () => {
      await start();
    });
  };

  /**
   * Find Path of current matched menu item
   *
   * @param pageLink
   * @param menuItem
   * @return {Array|null} - Array of parents id [1,5]. The last one is item lv1
   */
  findPath(pageLink, menuItem) {
    if (!menuItem) {
      return null;
    }

    // final return on matching
    if (menuItem.link === pageLink) {
      const path = [];
      if (menuItem.id) {
        path.push(menuItem.id);
      }
      return path;
    }

    // find path recursively
    if (menuItem.children && menuItem.children.length > 0) {
      for (let i = 0; i < menuItem.children.length; i += 1) {
        const result = this.findPath(pageLink, menuItem.children[i]);
        if (result) {
          if (menuItem.id) {
            result.push(menuItem.id);
          }
          return result;
        }
      }
    }

    return null;
  }

  componentWillReceiveProps(nextProps) {
    const { menu, location } = nextProps;
    if (!menu || !location) {
      return;
    }

    const matchedPath = this.findPath(location.pathname, {
      children: menu,
    });

    if (matchedPath && matchedPath.length >= 1) {
      this.setState({ matchedPath });
    }
  }

  componentWillUnmount() {
    // reset paging infor here
    // this.props.resetPagingGlobal();
  }

  getFirstLetter(str) {
    if (typeof str === 'string') {
      return str
        .trim()
        .charAt(0)
        .toUpperCase();
    }
    return '';
  }

  showSnackBar = () => {
    const { status, onCloseSnackBar } = this.props;
    let snack = null;
    if (status) {
      snack = (
        <SnackbarWrapper
          open
          variant={status.type}
          message={status.message}
          onClose={onCloseSnackBar}
        />
      );
    }
    return snack;
  };

  renderHeaderMenu() {
    const { classes, menuHeader } = this.props;

    if (menuHeader && menuHeader.length > 0) {
      return menuHeader.map((menu, i) => (
        <PopupState
          key={String(i)}
          variant="popover"
          popupId={`header-menu-${i}`}
        >
          {popupState => (
            <React.Fragment>
              <ListItem
                button
                className={classes.rounded}
                {...bindTrigger(popupState)}
              >
                <Typography variant="inherit" noWrap>
                  {menu.label}
                </Typography>
                <ExpandMoreIcon fontSize="small" />
              </ListItem>
              {menu.children.length > 0 && (
                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  disableAutoFocusItem
                >
                  {menu.children.map((item, j) => (
                    <MenuItem
                      key={String(j)}
                      to={item.link}
                      component={item.link ? RouterLink : null}
                      onClick={popupState.close}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </React.Fragment>
          )}
        </PopupState>
      ));
    }

    return null;
  }

  render() {
    const {
      classes,
      children,
      loading,
      menu,
      fullName,
      location,
      connectedDevice,
    } = this.props;
    const { open, anchorEl, matchedPath } = this.state;
    const isMenuOpen = Boolean(anchorEl);

    const firstLetter = this.getFirstLetter(fullName);
    const avatar =
      firstLetter !== '' ? (
        <Avatar className={classNames(classes.avatar, classes.avatarLight)}>
          {firstLetter}
        </Avatar>
      ) : (
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
      );

    return (
      <div className={classes.root}>
        <CssBaseline />
        {renderMenuHeader(avatar, fullName, anchorEl, isMenuOpen, {
          onHandleMenuClose: this.handleProfileMenuClose,
          onSignOut: () => logout(),
        })}
        <AppBar position="fixed" className={classes.appBar} color="secondary">
          <Toolbar disableGutters className={classes.toolbar}>
            <div className={classes.toolbarLeft}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={
                  !matchedPath || matchedPath.length < 2
                    ? classes.menuButtonDisabled
                    : classes.menuButton
                }
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                <img alt="logo" src={images.logo} className={classes.logo} />
              </Typography>

              <MenuTop
                menu={menu}
                location={location}
                matchedPath={this.state.matchedPath}
              />
            </div>

            <div className={classes.toolbarRight}>
              {connectedDevice === DEVICE_EXTERNAL.CONNECTED ? (
                <Tooltip title={message.CONNECTED_DEVICE} aria-label="usb">
                  <ListItemAvatar>
                    <Avatar className={classes.deviceConnect}>
                      <SettingsInputHdmi fontSize="default" />
                    </Avatar>
                  </ListItemAvatar>
                </Tooltip>
              ) : null}

              {this.renderHeaderMenu()}
              <ListItem
                button
                className={classes.rounded}
                onClick={this.handleProfileMenuOpen}
              >
                <ListItemAvatar>{avatar}</ListItemAvatar>
                <ExpandMoreIcon fontSize="small" />
              </ListItem>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.menuAnchor} id="menuAnchor" />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <MainMenu menu={menu} location={location} />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div>
            <div className={classes.appBarSpacer} />
            {loading ? (
              <div className={classes.loading}>
                <div className={classes.loadingCircular}>
                  <CircularProgress variant="indeterminate" />
                  <Typography variant="body2" className={classes.textIndicator}>
                    Đang xử lý, vui lòng chờ trong giây lát...
                  </Typography>
                </div>
              </div>
            ) : null}
            {children}
            {this.showSnackBar()}
          </div>

          <Footer />
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  /**
   * @system
   */
  loading: PropTypes.bool,
  status: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  fullName: PropTypes.string,
  menu: PropTypes.array,
  menuHeader: PropTypes.array,
  location: PropTypes.object,
  onCloseSnackBar: PropTypes.func,
  connectedDevice: PropTypes.number,
  /**
   * @ui
   */
  classes: PropTypes.object.isRequired,
  /**
   * @child (html, string, components)
   *
   * @return child page
   */
  children: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  status: makeSelectStatus(),
  menu: makeSelectMenu(),
  menuHeader: makeSelectHeader(),
  fullName: makeSelectFullName(),
  location: makeSelectLocation(),
  connectedDevice: makeSelectStatusDevice(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCloseSnackBar: () => dispatch(closeSnackBar()),
    onGetMenu: () => dispatch(getMenu()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withSaga,
  withReducer,
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles()),
)(Dashboard);
