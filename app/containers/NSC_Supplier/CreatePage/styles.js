export const styles = theme => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 0px',
    '& > *': {
      padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  container: {
    justifyContent: 'space-around',
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  section: {
    marginTop: theme.spacing.unit,
  },
  groupButton: {
    marginBottom: theme.spacing.unit * 3,
  },
  double: {
    maxWidth: '47%',
  },
  cancel: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  space: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
    padding: `${theme.spacing.unit}px`,
    width: '10%',
  },
  clearOutline: {
    outline: 0,
  },
});
