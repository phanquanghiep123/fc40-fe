import { debounce } from 'lodash';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import AsyncSelect from 'react-select/lib/Async';

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}
function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}
/* eslint-disable react/prefer-stateless-function */
export default class AsyncSelectField extends React.Component {
  handleOnChange = (option, actionMeta) => {
    const {
      onInputChange,
      form,
      field: { name },
    } = this.props;

    onInputChange(option, actionMeta);
    if (option) {
      form.setFieldValue(
        name,
        option.showLabel ? option.showLabel : option.label,
      );
    }
  };

  render() {
    const {
      classes,
      onInputChange,
      form,
      theme,
      field: { name, value },
      placeholder,
      onBlur,
      disabled,
      promiseOptions,
      components,
      ...props
    } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        padding: 0,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      clearIndicator: base => ({
        ...base,
        cursor: 'pointer',
      }),
    };

    const customComponents = components || {};

    return value !== placeholder ? (
      <AsyncSelect
        id={name}
        name={name}
        {...props}
        components={{ Control, ...customComponents }}
        styles={selectStyles}
        classes={classes}
        onChange={this.handleOnChange}
        placeholder={placeholder}
        loadOptions={debounce(promiseOptions, 500)}
        isDisabled={disabled}
        noOptionsMessage={() => 'Không có kết quả'}
        loadingMessage={() => 'Đang tìm kiếm...'}
        onBlur={onBlur}
      />
    ) : (
      <AsyncSelect
        id={name}
        name={name}
        {...props}
        components={{ Control, ...customComponents }}
        styles={selectStyles}
        classes={classes}
        onChange={this.handleOnChange}
        placeholder={placeholder}
        value={value}
        loadOptions={debounce(promiseOptions, 500)}
        isDisabled={disabled}
        noOptionsMessage={() => 'Không có kết quả'}
        loadingMessage={() => 'Đang tìm kiếm...'}
        onBlur={onBlur}
      />
    );
  }
}
