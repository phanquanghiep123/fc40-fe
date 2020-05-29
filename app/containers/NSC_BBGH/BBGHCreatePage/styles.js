export default theme => ({
  // section 6
  tabs: {
    padding: 16,
  },
  tab: {
    minWidth: 100,
    minHeight: 36,
    textTransform: 'capitalize',
  },
  tabLabel: {
    [theme.breakpoints.up('md')]: {
      padding: '6px 12px',
    },
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
  indicatorColor: {
    backgroundColor: 'rgba(71, 111, 144, 0.2)',
  },
  //
  titleBBGH: {
    marginTop: theme.spacing.unit * 3,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  unitLeft: {
    paddingRight: theme.spacing.unit * 2,
  },
  unitRight: {
    paddingLeft: theme.spacing.unit * 2,
  },
  submit: {
    marginTop: theme.spacing.unit,
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
  // IV
  fab: {
    height: 36,
    minWidth: 42,
    padding: 0,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.common.white,
  },
  // Section 4
  actions: {
    padding: 0,
    paddingTop: theme.spacing.unit,
    justifyContent: 'flex-end',
  },
  add: {
    margin: 0,
  },
});
