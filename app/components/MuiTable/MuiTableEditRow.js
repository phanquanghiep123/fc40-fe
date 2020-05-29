import React from 'react';

import { MTableEditRow } from 'material-table';

import { MuiTableEditProvider } from './MuiTableEditContext';

export class MTableEditRowRenderer extends MTableEditRow {
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ data: this.getData(nextProps) });
    }
  }

  getData(props) {
    return props.data ? JSON.parse(JSON.stringify(props.data)) : {};
  }
}

export default class MuiTableEditRow extends React.Component {
  state = {
    data: this.getData(this.props),
  };

  getData(props) {
    return props.data ? JSON.parse(JSON.stringify(props.data)) : {};
  }

  handleFieldChange = (columnDef, value) => {
    if (columnDef && columnDef.field) {
      const { data } = this.state;
      data[columnDef.field] = value;
      this.setState({ data });
    }
  };

  handleEditingApproved = mode => {
    if (this.props.onEditingApproved) {
      this.props.onEditingApproved(mode, this.state.data, this.props.data);
    }
  };

  render() {
    return (
      <MuiTableEditProvider onFieldChange={this.handleFieldChange}>
        <MTableEditRowRenderer
          {...this.props}
          data={this.state.data}
          onEditingApproved={this.handleEditingApproved}
        />
      </MuiTableEditProvider>
    );
  }
}
