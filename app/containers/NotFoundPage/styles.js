export default theme => ({
  main: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    fontSize: '14em',
  },
  subTitle: {
    fontSize: '2rem',
    marginBottom: theme.spacing.unit * 2,
  },
  description: {
    color: theme.palette.color1,
  },
});
