import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

export const styleSnackContent = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.notify.info,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  message: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    whiteSpace: 'pre-line',
  },
});
