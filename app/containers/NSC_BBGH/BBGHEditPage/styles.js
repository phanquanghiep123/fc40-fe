import createStyles from 'containers/NSC_BBGH/BBGHCreatePage/styles';

export default theme => ({
  ...createStyles(theme),
  section: {
    marginTop: theme.spacing.unit * 2,
  },
  space: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
    padding: `${theme.spacing.unit}px`,
    width: '10%',
  },
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  groupButton: {
    marginBottom: theme.spacing.unit * 3,
  },
  cancel: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
});
