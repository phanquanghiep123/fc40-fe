export default theme => ({
  spaceGroup: {
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  secondary: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  spaceTop: {
    marginTop: theme.spacing.unit * 2,
  },
  spaceBottom: {
    marginBottom: theme.spacing.unit * 5,
  },
  add: {
    margin: 0,
  },
  clearOutline: {
    outline: 0,
  },
  highlight: {
    fontWeight: 'bold',
  },
  buttonSpace: { marginRight: theme.spacing.unit * 2 },
});
