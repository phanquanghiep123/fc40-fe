import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';

import NotAuthPage from 'containers/NotAuthPage/Loadable';

import { getUnitFromString } from 'utils/weightUnitUtils';
import { connectSocket } from 'utils/socketUtils';
import injectReducer from 'utils/injectReducer';
import { socketUrl } from 'utils/request';
import MasterLayout from './MasterLayout';
import {
  makeSelectDialog,
  makeSelectAuth,
  makeSelectStatusDevice,
  makeSelectedWeight,
} from './selectors';
import reducer from './reducer';
import { closeDialog, openDialog, connectDevice, reciveData } from './actions';
import AlertDialog from '../../components/AlertDialog';
import routes from './routes';

function StyledBreadcrumb(props) {
  const { classes, ...rest } = props;
  return <Chip className={classes.chip} {...rest} />;
}

const styles = theme => ({
  paper: {
    padding: `0 ${theme.spacing.unit}px`,
    // marginBottom: theme.spacing.unit,
  },
  chip: {
    backgroundColor: theme.palette.grey[100],
    height: 24,
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing.unit * 4,
  },
  home: {
    background: 'none',
    marginRight: -theme.spacing.unit * 1.5,
  },
});

const IconBreadCrumb = props => {
  switch (props.index) {
    case 0:
      return <HomeIcon />;
    default:
      return null;
  }
};

/* eslint-disable no-nested-ternary */
class PrivateRoute extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { breadcrumbNameMap: [], convertPath: [] };
    this.drawBreadCrumbs = this.drawBreadCrumbs.bind(this);
  }

  componentDidMount() {
    // websocket
    connectSocket(socketUrl, this, this.props.statusDevice);
  }

  componentWillMount() {
    const convertRoute = {};
    routes.forEach(route => {
      convertRoute[
        `${route.path
          .split('/')
          .filter(param => ![':id', ':pid'].includes(param))
          .join('/')}`
      ] = route.title;
    });

    /**
     * @description
     * spit pathname to array that it can map to breadcrumbNameMap
     * @eg
     * input: /danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/1/tiep-nhan-bien-ban/12
     * output:
     * [
     *    '/danh-sach-bien-ban-giao-hang',
     *    '/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/1',
     *    '/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/tiep-nhan-bien-ban/12'
     * ]
     */
    const pathnames = this.props.location.pathname.split('/').filter(x => x);

    let id = -1;
    const convertPath = [];
    const indexIds = pathnames.filter(
      path => !Number.isNaN(parseInt(path, 10)),
    );
    pathnames.forEach((path, index) => {
      const isNotNumber = Number.isNaN(parseInt(path, 10));
      // is id
      if (!isNotNumber) {
        const subPath = pathnames.slice(0, index);
        if (indexIds.length >= 1 && index !== pathnames.length - 1) {
          subPath.push(path);
        }
        if (id !== -1) subPath.splice(id, 1);
        convertPath[index - 1] = subPath.join('/');
        id = index;
        return;
      }

      convertPath[index] = path;
    });

    // insert home is the first element
    convertPath.unshift('');

    this.setState({ breadcrumbNameMap: convertRoute, convertPath });
  }

  /**
   *
   * @param {convertPath: array} paths is splited and converted
   * @param {breadcrumbNameMap: array} mapping rule, title
   * @param {classes: object} object style
   */
  drawBreadCrumbs(convertPath, breadcrumbNameMap, classes) {
    return convertPath.map((value, index) => {
      const last = index === convertPath.length - 1;
      const to = `/${value}`;
      let toId = null;
      if (!breadcrumbNameMap[to]) {
        const paths = to.split('/');
        toId = paths.slice(0, paths.length - 1).join('/');
      }

      const first = index === 0 ? classes.home : classes.avatar;

      return last ? (
        <StyledBreadcrumb
          classes={classes}
          color="default"
          key={to}
          component="span"
          to={to}
          label={breadcrumbNameMap[to]}
          avatar={
            <Avatar className={first}>
              <IconBreadCrumb index={index} />
            </Avatar>
          }
        />
      ) : (
        <StyledBreadcrumb
          classes={classes}
          key={to}
          component={Link}
          to={to}
          style={{ cursor: 'pointer' }}
          label={breadcrumbNameMap[to] || breadcrumbNameMap[toId]}
          avatar={
            <Avatar className={first}>
              <IconBreadCrumb index={index} />
            </Avatar>
          }
        />
      );
    });
  }

  render() {
    const {
      isAuth: isAuthenticated,
      component: Component,
      title,
      isCan,
      openDl,
      onOpenDialog,
      onCloseDialog,
      classes,
      location,
      history,
      weightAuto,
      ...rest
    } = this.props;
    const { breadcrumbNameMap, convertPath } = this.state;

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            isCan ? (
              <MasterLayout>
                <Helmet>
                  <title>{title}</title>
                </Helmet>
                <div className={classes.paper}>
                  <Breadcrumbs maxItems={3} arial-label="Breadcrumb">
                    {this.drawBreadCrumbs(
                      convertPath,
                      breadcrumbNameMap,
                      classes,
                    )}
                  </Breadcrumbs>
                </div>
                <Component
                  {...props}
                  weightAuto={weightAuto}
                  ui={{
                    Dialog: AlertDialog,
                    props: {
                      openDl,
                      onOpenDialog,
                      onCloseDialog,
                    },
                  }}
                />
              </MasterLayout>
            ) : (
              <NotAuthPage />
            )
          ) : (
            <Redirect
              to={{
                pathname: '/dang-nhap',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

PrivateRoute.propTypes = {
  /**
   * @ui
   */
  isCan: PropTypes.bool,
  openDl: PropTypes.bool,
  onCloseDialog: PropTypes.func,
  onOpenDialog: PropTypes.func,
  onConnectDevice: PropTypes.func,
  statusDevice: PropTypes.number,
  onReciveData: PropTypes.func,
  weightAuto: PropTypes.array,
};

PrivateRoute.defaultProps = {
  isCan: true,
};

const mapStateToProps = createStructuredSelector({
  openDl: makeSelectDialog(),
  isAuth: makeSelectAuth(),
  statusDevice: makeSelectStatusDevice(),
  weightAuto: makeSelectedWeight(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onCloseDialog: () => dispatch(closeDialog()),
    onOpenDialog: () => dispatch(openDialog()),
    onReciveData: data => {
      if (data && typeof data === 'string') {
        // convert object
        // format: 100:kg
        const hashData = data.split(':');
        // incorrect format ignore
        if (hashData.length === 2 && hashData[0] > 0) {
          dispatch(
            reciveData({
              weight: parseFloat(hashData[0]),
              unit: getUnitFromString(hashData[1]) || -1, // NOT FOUND
              unitString: hashData[1],
            }),
          );
        }
      }
    },
    onConnectDevice: status => dispatch(connectDevice(status)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'global', reducer });

export default compose(
  withReducer,
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(PrivateRoute);
