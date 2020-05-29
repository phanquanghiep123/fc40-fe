import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import AsyncSelect from 'react-select/lib/Async';
import AsyncCreatable from 'react-select/lib/AsyncCreatable';

import MuiSelectInput from './Input';

export default function MuiSelectAsync({
  isCreatable,
  isSearchable = true,
  promiseOptions,
  timeout,
  ...props
}) {
  return (
    <MuiSelectInput
      {...props}
      Component={isCreatable ? AsyncCreatable : AsyncSelect}
      loadOptions={debounce(promiseOptions, timeout)}
      isCreatable={isCreatable}
      isSearchable={isSearchable}
    />
  );
}

MuiSelectAsync.propTypes = {
  promiseOptions: PropTypes.func.isRequired,
  timeout: PropTypes.number,
};

MuiSelectAsync.defaultProps = {
  timeout: 500,
};
