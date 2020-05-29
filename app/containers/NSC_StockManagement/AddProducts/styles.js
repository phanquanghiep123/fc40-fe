export default theme => ({
  main: {
    position: 'relative',
    width: '100%',
    // height: '100vh',
    marginTop: theme.spacing.unit * 2,
  },
  section: {
    overflow: 'visible',
    padding: theme.spacing.unit,
    boxShadow: theme.shade.light,
  },
  shrink: {
    height: '100%',
  },
  header: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  content: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,

    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
});
