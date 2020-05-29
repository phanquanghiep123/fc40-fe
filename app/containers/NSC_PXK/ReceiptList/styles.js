export default theme => ({
  main: {
    position: 'relative',
    marginBottom: theme.spacing.unit * 2,
  },
  heading: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  titleText: {
    fontWeight: 500,
  },
  content: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,

    '&:last-child': {
      paddingBottom: theme.spacing.unit,
    },
  },
  section: {
    boxShadow: theme.shade.light,
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  cardContent: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,

    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
});
