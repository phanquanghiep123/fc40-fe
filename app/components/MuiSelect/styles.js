import { emphasize } from '@material-ui/core/styles/colorManipulator';

export default theme => ({
  button: {
    paddingLeft: theme.spacing.unit * 1.5,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  groupHeading: {
    padding: `11px ${theme.spacing.unit * 2}px`,
    fontSize: 16,
  },
  groupOption: {
    paddingLeft: theme.spacing.unit * 4,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  pointer: {
    cursor: 'pointer',
  },
  option: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  valueContainerMulti: {
    flexWrap: 'wrap',
  },
  singleValue: {
    fontSize: 16,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
});
