import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  default: {
    minWidth: '7%',
    margin: `0 ${theme.spacing.unit}px`,
  },
});

class ButtonUI extends React.PureComponent {
  render() {
    const { classes, hidden, title, style, ...props } = this.props;
    return !hidden ? (
      <Button
        variant="contained"
        className={classNames(classes.default, style)}
        {...props}
      >
        {title}
      </Button>
    ) : null;
  }
}

ButtonUI.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.any,
  style: PropTypes.string,
  hidden: PropTypes.bool,
};

ButtonUI.defaultProps = {
  hidden: false,
};

export default withStyles(styles)(ButtonUI);
