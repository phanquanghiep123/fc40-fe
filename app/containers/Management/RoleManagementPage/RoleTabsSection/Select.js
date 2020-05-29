import React from 'react';
import PropTypes from 'prop-types';

import toLower from 'lodash/toLower';

import { components } from 'react-select';
import AsyncPaginate from 'react-select-async-paginate';

import ListItemText from '@material-ui/core/ListItemText';

export const loadOptions = (options, includeKeys) => async (
  searchText,
  prevOptions,
) => {
  let filteredOptions;

  if (searchText) {
    const searchLower = toLower(searchText);

    filteredOptions = options.filter(option => {
      for (let i = 0, len = includeKeys.length; i < len; i += 1) {
        const key = includeKeys[i];
        if (key in option && toLower(option[key]).includes(searchLower)) {
          return true;
        }
      }
      return false;
    });
  } else {
    filteredOptions = options;
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10;
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10,
  );

  return {
    options: slicedOptions,
    hasMore,
  };
};

export default class Select extends React.Component {
  onChange = option => {
    if (this.props.validBeforeChange) {
      if (this.props.validBeforeChange(option)) {
        this.onChangeValue(option);
      }
    } else {
      this.onChangeValue(option);
    }
  };

  onChangeValue = option => {
    this.props.onChange(option.value);

    if (this.props.onSelectChange) {
      this.props.onSelectChange(option);
    }
  };

  render() {
    const {
      value,
      options,
      valueKey,
      labelKey,
      sublabelKey,
      includeKeys,
    } = this.props;

    // Filtered with loadOptions
    const filterOption = () => true;

    const getOptionLabel = option => option[valueKey];
    const getOptionValue = option => option[valueKey];

    const noOptionsMessage = () => 'Không có kết quả';

    return (
      <AsyncPaginate
        value={{ [valueKey]: value }}
        loadOptions={loadOptions(options, includeKeys)}
        components={{
          Option: props => (
            <components.Option {...props}>
              <ListItemText
                primary={props.data[labelKey]}
                secondary={sublabelKey ? props.data[sublabelKey] : ''}
              />
            </components.Option>
          ),
        }}
        placeholder=""
        maxMenuHeight={200}
        debounceTimeout={300}
        filterOption={filterOption}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        noOptionsMessage={noOptionsMessage}
        onChange={this.onChange}
      />
    );
  }
}

Select.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  valueKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  includeKeys: PropTypes.array.isRequired,
  sublabelKey: PropTypes.string,
  onChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  validBeforeChange: PropTypes.func,
};
