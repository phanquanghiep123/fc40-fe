import React from 'react';

import { MTableEditField } from 'material-table';

import { withMuiTableEdit } from './MuiTableEditContext';

export class MuiTableEditField extends MTableEditField {
  getProps() {
    const { columnDef, ...props } = this.props;

    if (columnDef.autoFocus) {
      props.autoFocus = columnDef.autoFocus;
    }
    if (columnDef.type !== 'boolean') {
      props.fullWidth = true;
    }
    if (columnDef.lookup) {
      props.MenuProps = {
        PaperProps: {
          style: {
            maxHeight: 50 * 4.5,
          },
        },
      };
    }

    return props;
  }

  renderBooleanField() {
    return React.cloneElement(super.renderBooleanField(), {
      value: String(this.props.value),
    });
  }

  renderTextField() {
    return React.cloneElement(super.renderTextField(), {
      value: typeof this.props.value === 'string' ? this.props.value : '',
    });
  }
}

export default withMuiTableEdit(MuiTableEditField);
