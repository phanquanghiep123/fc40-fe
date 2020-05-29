const loginBackground = require('../../images/background_login.svg');
const logo = require('../../images/logo-login.png');
export const logoLogin = logo;

export default theme => ({
  link: {
    textDecoration: 'none',
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  infoSection: {
    margin: `${theme.spacing.unit * 5}px 0px`,
  },
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundImage: `url(${loginBackground})`,
    backgroundSize: 'cover' /* <------ */,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom' /* optional, center the image */,
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 7}px`,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: '65%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    margin: 'auto',
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 3,
  },
  submit: {
    height: theme.spacing.unit * 5,
    marginTop: theme.spacing.unit,
    color: theme.palette.common.white,
  },
  spaceControl: {
    marginTop: theme.spacing.unit * 4,
  },
  spaceControlSmall: {
    marginTop: theme.spacing.unit * 2,
  },
  submitGroup: {
    marginTop: theme.spacing.unit * 6,
  },
  logo: {
    borderRadius: 0,
    width: theme.spacing.unit * 9,
    height: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
  },
  footer: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});
