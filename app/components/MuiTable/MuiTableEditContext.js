import React from 'react';
import PropTypes from 'prop-types';

export const MuiTableEditContext = React.createContext();

export const MuiTableEditConsumer = MuiTableEditContext.Consumer;

export const withMuiTableEdit = Component => props => (
  <MuiTableEditConsumer>
    {({ onFieldChange }) => {
      const onChange = value => {
        props.onChange(value);
        onFieldChange(props.columnDef, value, props.value);
      };

      return <Component {...props} onChange={onChange} />;
    }}
  </MuiTableEditConsumer>
);

export class MuiTableEditProvider extends React.Component {
  onFieldChange = (columnDef, newValue, oldValue) => {
    if (this.props.onFieldChange) {
      this.props.onFieldChange(columnDef, newValue, oldValue);
    }
  };

  render() {
    return (
      <MuiTableEditContext.Provider
        value={{ onFieldChange: this.onFieldChange }}
      >
        {this.props.children}
      </MuiTableEditContext.Provider>
    );
  }
}

MuiTableEditProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onFieldChange: PropTypes.func,
};
