export default theme => ({
  shrink: {
    height: '100%',
  },
  section: {
    overflow: 'visible',
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
      paddingBottom: theme.spacing.unit,
    },
  },
});
