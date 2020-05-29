import React from 'react';
import PropTypes from 'prop-types';

import { MTableAction } from 'material-table';

import { Button, Tooltip } from '@material-ui/core';

class MuiTableAction extends React.Component {
  renderButton(action, data) {
    return (
      <span>
        <Button
          size="small"
          variant="contained"
          {...action.buttonProps}
          disabled={action.disabled}
          onClick={event => {
            if (action.onClick) {
              action.onClick(event, data);
            }
          }}
        >
          {action.text}
        </Button>
      </span>
    );
  }

  renderTooltip(button, tooltip) {
    return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
  }

  render() {
    const { data, action } = this.props;

    if (action && typeof action.render === 'function') {
      const button = action.render(data, action);
      return this.renderTooltip(button, action.tooltip);
    }

    if (action && action.render && React.isValidElement(action.render)) {
      return this.renderTooltip(action.render, action.tooltip);
    }

    if (action && action.text && typeof action.text === 'string') {
      const button = this.renderButton(action, data);
      return this.renderTooltip(button, action.tooltip);
    }

    return <MTableAction {...this.props} />;
  }
}

MuiTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export default MuiTableAction;
