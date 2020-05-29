import React from 'react';
import Autosuggest from 'react-autosuggest';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { find } from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.75rem',
  },
});

class InputSuggestControl extends React.Component {
  state = {
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.props.promiseOptions(value, options =>
      this.setState({ suggestions: options }),
    );
  };

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  getSuggestionValue = suggestion => suggestion.label;

  autosuggestProps = {
    renderInputComponent,
    onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
    getSuggestionValue: this.getSuggestionValue,
    renderSuggestion,
  };

  // 1. Nếu là select thì trả về object full properties
  // 2. Nếu là input thì trả về object có duy nhất 1 property khớp với name
  onChange = (_, { newValue }) => {
    const { name } = this.props.field;
    const objPattern = {};
    objPattern[name] = newValue;
    const option = find(this.state.suggestions, objPattern) || objPattern;
    this.props.onInputChange(option);
  };

  render() {
    const { required, label, field, classes, style, disabled } = this.props;
    const { value, name } = field;
    return (
      <FormControl
        margin="normal"
        style={{ ...style, ...{ marginTop: 0 } }}
        fullWidth
      >
        <Autosuggest
          {...this.autosuggestProps}
          suggestions={this.state.suggestions}
          inputProps={{
            label,
            value: value || '',
            onChange: this.onChange,
            required,
            disabled,
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
        <ErrorMessage name={name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}

InputSuggestControl.propTypes = {
  required: PropTypes.bool,
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.bool,
  options: PropTypes.array,
  onInputChange: PropTypes.func,
  outlined: PropTypes.bool,
  onBlur: PropTypes.func,
};
InputSuggestControl.defaultProps = {
  required: false,
  disabled: false,
};
export default withStyles(styles)(InputSuggestControl);
