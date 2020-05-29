import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Checkbox from '@material-ui/core/Checkbox';

export const styles = {
  root: {
    padding: 0,
  },
};

export class CheckboxRenderer extends React.Component {
  onChange = event => {
    const isChecked = event.target.checked;
    if (this.props.onChange) {
      this.props.onChange(isChecked);
    }
  };

  render() {
    const { classes, value, disabled } = this.props;
    const cb = value !== undefined;
    const isChecked = this.props.formatValue(value);

    return (
      <>
        {cb && (
          <Checkbox
            color="primary"
            checked={isChecked}
            disabled={disabled}
            className={classes.root}
            onChange={this.onChange}
          />
        )}
        {!cb && <div className={classes.root} />}
      </>
    );
  }
}

CheckboxRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  formatValue: PropTypes.func,
  onChange: PropTypes.func,
};

CheckboxRenderer.defaultProps = {
  disabled: false,
};

export default withStyles(styles)(CheckboxRenderer);
