import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';

export default class PopupEditor extends Component {
  componentDidMount = () => this.focus();

  input = React.createRef();

  state = { value: this.props.charPress || this.props.value || '' };

  getValue = () => this.state.value;

  isPopup = () => true;

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  focus = () =>
    setTimeout(
      () => this.input && this.input.current && this.input.current.focus(),
    );

  render() {
    const editorWidth = this.props.eGridCell.clientWidth;
    const editorHeight = this.props.eGridCell.clientHeight;
    const style = {
      boxSizing: 'border-box',
      width: `${editorWidth}px`,
      height: `${editorHeight}px`,
      textAlign: 'center',
    };

    return (
      <input
        ref={this.input}
        value={this.state.value}
        onChange={this.onChange}
        style={style}
      />
    );
  }
}

PopupEditor.propTypes = {
  eGridCell: PropTypes.object,
  charPress: PropTypes.any,
  value: PropTypes.any,
};
