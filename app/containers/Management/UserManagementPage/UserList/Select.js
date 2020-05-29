import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import AsyncSelect from 'react-select/lib/Async';
import { components } from 'react-select';

import ListItemText from '@material-ui/core/ListItemText';

export default class Select extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getRenderState(props.value),
    };
  }

  getRenderState(value) {
    return {
      value: {
        label: value || '',
      },
    };
  }

  changeValue = option => {
    this.setState({ value: option }, () => {
      if (this.props.onAutocompleteChange) {
        this.props.onAutocompleteChange(option ? option.value : null);
      }
    });
  };

  handleChange = (option, { action }) => {
    if (this.props.validBeforeChange && action !== 'clear') {
      if (this.props.validBeforeChange(option.value)) {
        this.changeValue(option);
      }
    } else {
      this.changeValue(option);
    }
  };

  render() {
    const { value } = this.state;
    const { promiseOptions } = this.props;

    const noOptionsMessage = () => 'Không có kết quả';

    return (
      <AsyncSelect
        value={value}
        autoFocus
        placeholder=""
        loadOptions={debounce(promiseOptions, 500)}
        maxMenuHeight={200}
        noOptionsMessage={noOptionsMessage}
        components={{
          Option: props => {
            const { label, sublabel } = props.data;

            return (
              <components.Option {...props}>
                <ListItemText primary={label} secondary={sublabel} />
              </components.Option>
            );
          },
        }}
        onChange={this.handleChange}
      />
    );
  }
}

Select.propTypes = {
  value: PropTypes.any,
  promiseOptions: PropTypes.func.isRequired,
  validBeforeChange: PropTypes.func,
  onAutocompleteChange: PropTypes.func,
};
