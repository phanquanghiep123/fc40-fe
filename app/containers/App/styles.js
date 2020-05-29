import appTheme from './theme';
const logo = require('../../images/logo.png');
const avatar = require('../../images/avata.png');
export const images = {
  logo,
  avatar,
};
const drawerWidth = 300;

export default (theme = appTheme) => ({
  ripple: {
    textDecoration: 'none',
    color: '#fff',
    width: 12,
    height: 12,
    backgroundColor: '#00E7FF',
    margin: '0 auto',
    borderRadius: 100,
    '-webkit-animation': 'ripple .7s linear',
  },
  deviceConnect: {
    backgroundColor: theme.palette.secondary.main,
    border: '1px solid #ffffff',
    color: '#fff',
    animationName: 'fadeInOut',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: '10', // infinite
    animationDuration: '1.5s',
    animationDirection: 'alternate',
  },
  '@keyframes fadeInOut ': {
    '0%': {
      transform: 'scale(0.85)',
    },
    '20%': {
      transform: 'scale(1)',
    },
    '40%': {
      transform: 'scale(0.85)',
    },
    '60%': {
      transform: 'scale(1)',
    },
    '80%': {
      transform: 'scale(0.85)',
    },
    '100%': {
      transform: 'scale(0.85)',
    },
  },
  root: {
    display: 'flex',
    position: 'relative',
  },
  toolbar: {
    padding: '4px 24px 0 0', // keep right padding when drawer closed
    minHeight: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  toolbarRight: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: 'none',
    overflow: 'auto',
  },
  menuAnchor: {
    position: 'fixed',
    width: '100%',
    height: 1,
    top: 60,
    visibility: 'hidden',
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  menuButtonHidden: {
    display: 'none',
  },
  menuButtonDisabled: {
    cursor: 'unset',
    opacity: 0.3,
  },
  title: {
    flexGrow: 1,
    marginRight: theme.spacing.unit * 4,
  },
  drawer: {
    background: theme.palette.background.default,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    background: theme.palette.background.default,
    border: 'none',
    // boxShadow: `0 2px 4px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.1)`,
  },
  appBarSpacer: { marginTop: theme.spacing.unit * 6 },
  logoHeader: {
    // width: theme.spacing.unit * 10,
  },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px 0px`,
    minHeight: '100vh',
    // overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  rounded: {
    width: 'auto',
    maxWidth: '15em',
    borderRadius: 999,
  },
  avatar: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
    fontSize: '1em',
    marginRight: 15,
  },
  avatarLight: {
    backgroundColor: theme.palette.primary.main,
  },
  userText: {
    fontWeight: '500',
  },
  selectHeader: {
    color: theme.palette.common.white,
  },
  loading: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    display: 'block',
    opacity: 0.5,
    backgroundColor: '#000',
    zIndex: 99999,
    textAlign: 'center',
  },
  loadingCircular: {
    position: 'absolute',
    zIndex: 100000,
    top: '50%',
    left: 'calc(50% - 120px)',
  },
  textIndicator: {
    color: theme.palette.common.white,
  },
});
