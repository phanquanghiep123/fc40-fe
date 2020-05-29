import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import FormControl from '@material-ui/core/FormControl';
import appTheme from '../../containers/App/theme';
import commonStyles from '../StyleCommon/styles';

const styles = (theme = appTheme) => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-start',
    overflow: 'hidden',
    marginTop: '0.3rem',
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
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    top: theme.spacing.unit,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 100,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  indicatorContainer: {
    cursor: 'pointer',
  },
});

const muiTheme = (isDisabled, isMultiline) =>
  createMuiTheme({
    ...appTheme,
    overrides: {
      ...appTheme.overrides,
      MuiInput: {
        underline: {
          '&:before': {
            ...(isDisabled ? { borderBottomStyle: 'dotted' } : {}),
          },
        },
        formControl: {
          marginTop: '15px !important',
        },
      },
      MuiInputBase: {
        input: {
          ...(isMultiline ? { height: 'auto' } : { height: 33 }),
        },
      },
      MuiChip: {
        root: {
          ...(isMultiline ? { height: 'auto' } : {}),
        },
        deleteIcon: {
          ...(isMultiline ? { margin: '0 0 0 -8px' } : {}),
        },
      },
    },
  });

function NoOptionsMessage(props) {
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

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      title={props.children}
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
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

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      title={props.children}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  const { isMultiline } = props.selectProps;
  return (
    <div
      className={props.selectProps.classes.valueContainer}
      style={{ flexWrap: isMultiline ? 'wrap' : 'nowrap' }}
    >
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  selectProps: PropTypes.any,
  children: PropTypes.any,
};

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class SelectAutocompleteField extends React.Component {
  handleChange = selected => {
    if (this.props.onChangeSelectAutoComplete) {
      this.props.onChangeSelectAutoComplete(selected);
    } else {
      this.props.form.setFieldValue(this.props.field.name, selected);
    }
    if (this.props.afterHandleChange) {
      this.props.afterHandleChange(selected);
    }
  };

  autoCompleteTimer = null;

  /**
   * Load Options
   * @param inputValue
   * @param callback
   */
  loadOptions = (inputValue, callback) => {
    const { loadOptionsFunc, minInputLength, timeout } = this.props;

    if (inputValue.length < minInputLength) {
      callback(null);
      return;
    }

    clearTimeout(this.autoCompleteTimer); // clear previous timeout
    this.autoCompleteTimer = setTimeout(() => {
      loadOptionsFunc(inputValue, callback);
    }, timeout);
  };

  render() {
    const {
      classes,
      theme,
      field,
      form,
      placeholder,
      noOptionsMessage,
      isMulti,
      isAsync,
      loadOptions,
      cacheOptions,
      defaultOptions,
      onInputChange,
      style,
      minInputLength,
      required,
      isClearable,
      ...props
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
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

    const errorHtml = (
      <div style={commonStyles(appTheme).errorMessage}>
        {form.errors[field.name]}
      </div>
    );

    return (
      <NoSsr>
        <FormControl
          margin="normal"
          variant="standard"
          className={props.className}
          disabled={props.disabled}
          required={required}
          fullWidth
          style={{ ...style, ...{ marginTop: 0 } }}
        >
          <MuiThemeProvider theme={muiTheme(props.disabled, props.isMultiline)}>
            {isAsync ? (
              <AsyncSelect
                {...field}
                {...props}
                classes={classes}
                styles={selectStyles}
                textFieldProps={{
                  label: props.label,
                  InputLabelProps: {
                    shrink: true,
                  },
                  required,
                }}
                components={components}
                value={field.value}
                onChange={this.handleChange}
                isDisabled={props.disabled}
                isMulti={isMulti}
                isClearable={isClearable}
                placeholder={placeholder}
                noOptionsMessage={e => {
                  if (e.inputValue) {
                    if (
                      minInputLength &&
                      e.inputValue.length < minInputLength
                    ) {
                      return `Nhập tối thiểu ${minInputLength} ký tự`;
                    }
                    return noOptionsMessage;
                  }
                  return 'Nhập từ khóa để tìm';
                }}
                // for async only
                loadOptions={loadOptions || this.loadOptions}
                onInputChange={onInputChange}
                cacheOptions={cacheOptions}
                defaultOptions={defaultOptions}
              />
            ) : (
              <Select
                {...field}
                {...props}
                classes={classes}
                styles={selectStyles}
                textFieldProps={{
                  label: props.label,
                  InputLabelProps: {
                    shrink: true,
                  },
                  required,
                }}
                components={components}
                value={field.value}
                onChange={this.handleChange}
                disabled={props.disabled}
                isDisabled={props.disabled}
                isMulti={isMulti}
                isClearable={isClearable}
                placeholder={placeholder}
                noOptionsMessage={() => noOptionsMessage}
              />
            )}
          </MuiThemeProvider>
          {form.touched[field.name] && form.errors[field.name] && errorHtml}
        </FormControl>
      </NoSsr>
    );
  }
}

SelectAutocompleteField.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  field: PropTypes.any,
  form: PropTypes.any,
  props: PropTypes.any,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  noOptionsMessage: PropTypes.string,
  loadOptions: PropTypes.func,
  loadOptionsFunc: PropTypes.func, // action to fetch options, use this instead of loadOptions above
  timeout: PropTypes.number,
  onInputChange: PropTypes.func,
  afterHandleChange: PropTypes.func,
  isAsync: PropTypes.bool,
  isMulti: PropTypes.bool,
  isMultiline: PropTypes.bool,
  minInputLength: PropTypes.number,
  required: PropTypes.bool,
  isClearable: PropTypes.bool,
};

SelectAutocompleteField.defaultProps = {
  timeout: 500,
  noOptionsMessage: 'Không tìm thấy kết quả',
  isClearable: true,
};

export default withStyles(styles, { withTheme: true })(SelectAutocompleteField);
