import React from 'react';
import PropTypes from 'prop-types';

import { AgGridReact } from 'ag-grid-react';

import { MIN_ROW_HEIGHT } from './constants';

const styles = {
  container: {
    width: '100%',
    height: MIN_ROW_HEIGHT,
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export default function FormDataPinned(props) {
  return (
    <div
      style={{
        ...styles.container,
        ...props.gridStyle,
      }}
      className="ag-theme-material ag-no-border"
    >
      <AgGridReact
        rowData={props.rowData}
        rowHeight={MIN_ROW_HEIGHT}
        headerHeight={0}
        groupHeaderHeight={0}
        columnDefs={props.columnDefs}
        defaultColDef={props.defaultColDef}
        {...props.gridProps}
      />
    </div>
  );
}

FormDataPinned.propTypes = {
  gridStyle: PropTypes.object,
  gridProps: PropTypes.object,
  rowData: PropTypes.array,
  columnDefs: PropTypes.array,
  defaultColDef: PropTypes.object,
};
