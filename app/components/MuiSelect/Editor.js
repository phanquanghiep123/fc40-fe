/*
* Ag grid component bất đồng bộ
* */

import React from 'react';
import PropTypes from 'prop-types';
import MuiSelectAsync from './Async';
import MuiSelectInputEditor, { styles } from './InputEditor';

export default class MuiSelectEditor extends MuiSelectInputEditor {
  componentWillUnmount() {
    const { rowIndex, colDef, api, focusAfterSelect: focus } = this.props;

    /**
     * Focus after select
     * If Array => [rowIndex, colName, floating]
     * If String => colName (of current row)
     */
    setTimeout(() => {
      if (focus) {
        if (typeof focus === 'string') {
          api.setFocusedCell(rowIndex, focus, null);
        } else if (Array.isArray(focus)) {
          api.setFocusedCell(focus[0], focus[1], focus[2] || null);
        }
      } else {
        api.setFocusedCell(rowIndex, colDef.field, null);
      }
    });
  }

  render() {
    const {
      SelectProps,
      valueKey,
      labelKey,
      sublabelKey,
      menuIsOpen,
      isClearable,
      isMultiline,
      isSearchable,
      defaultOptions,
      promiseOptions,
      onInputChange,
      validBeforeChange,
      timeout,
    } = this.props;
    const { value } = this.state;

    const selectStyles = {
      menuPortal: base => ({
        ...base,
        left: 'auto',
        width: 200,
      }),
      ...this.props.styles,
    };

    const TextFieldProps = {
      style: styles.textField,
    };

    return (
      <div style={styles.container}>
        <MuiSelectAsync
          onRef={ref => {
            this.selectRef = ref;
          }}
          styles={selectStyles}
          value={value}
          valueKey={valueKey}
          labelKey={labelKey}
          sublabelKey={sublabelKey}
          menuIsOpen={menuIsOpen}
          isMultiline={isMultiline}
          isClearable={isClearable}
          isSearchable={isSearchable}
          maxMenuHeight={150}
          defaultOptions={defaultOptions}
          promiseOptions={promiseOptions}
          validBeforeChange={validBeforeChange}
          TextFieldProps={TextFieldProps}
          onChange={this.onChange}
          onInputChange={onInputChange}
          timeout={timeout}
          {...SelectProps}
        />
      </div>
    );
  }
}

MuiSelectEditor.propTypes = {
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  sublabelKey: PropTypes.string,
  menuIsOpen: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMultiline: PropTypes.bool,
  defaultOptions: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  promiseOptions: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  validBeforeChange: PropTypes.func,
  /**
   * Focus after select.
   * If Array => [rowIndex, colName, floating]
   * If String => colName (of current row)
   */
  focusAfterSelect: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  timeout: PropTypes.number,
};

MuiSelectEditor.defaultProps = {
  valueKey: 'value',
  labelKey: 'label',
  sublabelKey: 'value',
  menuIsOpen: true,
  isClearable: false,
  isSearchable: true,
  isMultiline: true,
  defaultOptions: true,
  timeout: 500,
};
