import React, { Component } from 'react';
// import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './agGridCustomStyle.css';
import { agAutosizeHeaders } from './agGridUtils';

const style = () => ({
  agContainer: {
    height: '500px',
    width: '100%',
  },
});

class TableSection extends Component {
  state = {
    columnDefs: [
      {
        headerName: 'STT',
        field: 'stt',
      },
      {
        headerName: 'Mã sản phẩm (*)',
        field: 'maSP',
      },
    ],
    rowData: [
      {
        stt: 1,
        maSP: '',
      },
    ],
  };

  componentDidMount() {
    //
  }

  render() {
    return (
      <div
        className="ag-theme-material"
        style={{
          height: '500px',
          width: '600px',
        }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          onGridReady={event => {
            event.api.sizeColumnsToFit();
            agAutosizeHeaders(event);
          }}
          onGridSizeChanged={event => {
            event.api.sizeColumnsToFit();
            agAutosizeHeaders(event);
          }}
        />
      </div>
    );
  }
}

TableSection.propTypes = {
  // classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  //
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(TableSection);
