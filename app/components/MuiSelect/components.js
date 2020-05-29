import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Icon from '@material-ui/core/Icon';

import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { components } from 'react-select';

/* eslint-disable no-underscore-dangle */
export function Control(props) {
  return (
    <TextField
      margin="normal"
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classNames(
            props.selectProps.classes.input,
            !props.selectProps.isSearchable &&
              props.selectProps.classes.pointer,
          ),
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
        style: {
          borderRadius: 4,
        },
        ...props.selectProps.InputProps,
      }}
      InputLabelProps={{
        ...props.selectProps.InputLabelProps,
      }}
      disabled={props.isDisabled}
      {...props.selectProps.TextFieldProps}
    />
  );
}

export function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

export function ClearIndicator(props) {
  return (
    <components.ClearIndicator {...props}>
      <Icon
        color={props.isDisabled ? 'inherit' : 'secondary'}
        style={{ fontSize: 16 }}
      >
        clear
      </Icon>
    </components.ClearIndicator>
  );
}

export function DropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <Icon
        color={props.isDisabled ? 'inherit' : 'secondary'}
        style={{ fontSize: 21 }}
      >
        arrow_drop_down
      </Icon>
    </components.DropdownIndicator>
  );
}

export function IndicatorSeparator() {
  return null;
}

export function GroupHeading(props) {
  return (
    <Typography
      className={props.selectProps.classes.groupHeading}
      variant="caption"
    >
      {props.children}
    </Typography>
  );
}

GroupHeading.propTypes = {
  children: PropTypes.any,
  selectProps: PropTypes.any,
};

export function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      className={props.selectProps.classes.option}
      {...props.innerProps}
    >
      {props.data && props.data.__isNew__ ? props.data.label : props.children}
    </MenuItem>
  );
}

export function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

export function ValueContainer(props) {
  return (
    <div
      className={classNames(props.selectProps.classes.valueContainer, {
        [props.selectProps.classes.valueContainerMulti]:
          props.selectProps.isMulti,
      })}
    >
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.any,
  selectProps: PropTypes.any,
};

export function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

export function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<Icon {...props.removeProps}>cancel</Icon>}
    />
  );
}

export function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}
