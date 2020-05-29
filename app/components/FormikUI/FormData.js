import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { AgGridReact } from 'ag-grid-react';
import { PAGE_SIZE } from 'utils/constants';
import PopupEditor from './PopupEditor';
import CellRenderer from './CellRenderer';
import FormPagination from './FormPagination';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {
  MIN_ROW_HEIGHT,
  MIN_GRID_HEIGHT,
  MIN_HEADER_HEIGHT,
  GROUP_HEADER_HEIGHT,
} from './constants';

import './styles.css';

const styles = {
  container: {
    width: '100%',
    height: MIN_GRID_HEIGHT,
  },
};

const keyList = ['Escape', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter'];

export default class FormData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // for pagination
      pageSize: props.pageSize,
      pageIndex: props.pageIndex,
      totalCount: props.totalCount,

      // for configure ag-grid
      defaultColDef: {
        cellEditorFramework: props.popupEditor || PopupEditor,
        cellRendererFramework: props.cellRenderer || CellRenderer,
        cellRendererParams: params => {
          const { rowIndex, colDef } = params;

          const fieldName = `${this.props.name}[${rowIndex}]${colDef.field}`;
          const error = this.getError(fieldName);
          const touched = this.getTouched(fieldName);

          return { fieldName, error, touched };
        },
        // ag-grid must use formik to set values
        valueSetter: params => {
          this.props.setFieldValue(
            `${this.props.name}[${params.node.rowIndex}]${params.colDef.field}`,
            params.newValue,
            true,
          );
          return true; // must return false to let Formik update value?
        },
        suppressKeyboardEvent: event => {
          const column = event.colDef.field;
          const ignores = props.ignoreSuppressColumns || [];
          if (keyList.includes(event.event.key) && !ignores.includes(column))
            return false;
          if (event.editing) return true;
          return false;
        },
      },

      // for configure localization
      localeText: {
        // for filter panel
        page: 'Trang',
        more: 'Nhiều hơn',
        to: '-',
        of: 'của',
        next: 'Tiếp',
        last: 'Trang cuối',
        first: 'Trang đầu',
        previous: 'Trước',
        loadingOoo: 'Đang tải...',

        // other
        noRowsToShow: 'Không có dữ liệu để hiển thị',
      },
    };

    this.gridApi = null;
    this.gridColumnApi = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remotePagination) {
      const updaterState = {};

      if (nextProps.pageSize !== this.state.pageSize) {
        updaterState.pageSize = nextProps.pageSize;
      }
      if (nextProps.pageIndex !== this.state.pageIndex) {
        updaterState.pageIndex = nextProps.pageIndex;
      }
      if (nextProps.totalCount !== this.state.totalCount) {
        updaterState.totalCount = nextProps.totalCount;
      }

      this.setState(updaterState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.formikDidUpdate(prevProps, prevState);
    this.domLayoutDidUpdate(prevProps, prevState);
  }

  formikDidUpdate(prevProps) {
    const { name, values, errors, touched } = this.props;
    const {
      name: prevName,
      values: prevValues,
      errors: prevErrors,
      touched: prevTouched,
    } = prevProps;

    if (
      getIn(prevValues, prevName) !== getIn(values, name) ||
      getIn(prevErrors, prevName) !== getIn(errors, name) ||
      getIn(prevTouched, prevName) !== getIn(touched, name)
    ) {
      if (this.gridApi) this.gridApi.refreshCells({ force: true });
    }
  }

  domLayoutDidUpdate(prevProps) {
    const rowData = this.props.rowData
      ? this.props.rowData
      : this.props.values[this.props.name];
    const prevRowData = prevProps.rowData
      ? prevProps.rowData
      : prevProps.values[prevProps.name];
    if (prevRowData) {
      if (this.gridApi && this.props.autoLayout) {
        if (prevRowData.length <= 10 && rowData.length > 10) {
          this.setFixedHeight();
        }
        if (prevRowData.length > 10 && rowData.length <= 10) {
          this.setAutoHeight();
        }
      }
    }
  }

  getError = fieldName => getIn(this.props.errors, fieldName);

  getTouched = fieldName =>
    getIn(this.props.touched, fieldName) || this.props.submitCount > 0;

  getRowHeight = params => {
    const rowNode = params.node;
    const minHeight = MIN_ROW_HEIGHT;

    if (this.gridApi && this.gridApi.gridOptionsWrapper) {
      const autoHeight = this.gridApi.gridOptionsWrapper.autoHeightCalculator.getPreferredHeightForRow(
        rowNode,
      );
      return Math.max(autoHeight, minHeight);
    }
    return minHeight;
  };

  setAutoHeight = () => {
    this.gridApi.setDomLayout('autoHeight');
    document.getElementById(this.props.idGrid).style.height = '';
  };

  setFixedHeight = () => {
    this.gridApi.setDomLayout('normal');
    document.getElementById(this.props.idGrid).style.height = '450px';
  };

  resizeHeaders = async () => {
    await this.gridApi.setHeaderHeight(0);

    let minHeight = MIN_HEADER_HEIGHT;

    const headerCells = document.querySelectorAll(
      `#${this.props.idGrid} .ag-header-cell-label`,
    );
    headerCells.forEach(cell => {
      minHeight = Math.max(minHeight, cell.scrollHeight);
    });

    await this.gridApi.setHeaderHeight(minHeight + 16);
  };

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();

    if (this.props.onRef) {
      this.props.onRef(this);
    }

    if (this.props.autoLayout) {
      if (this.gridApi.getDisplayedRowCount() > 10) {
        this.setFixedHeight();
      } else {
        this.setAutoHeight();
      }
    }

    if (this.props.onGridReady) {
      this.props.onGridReady(params);
    }
  };

  onGridSizeChanged = async () => {
    await this.resizeHeaders();
    this.gridApi.sizeColumnsToFit();
  };

  onColumnResized = () => {
    this.gridApi.resetRowHeights();
  };

  onCellEditingStopped = e => {
    this.props.setFieldTouched(
      `${this.props.name}[${e.rowIndex}]${e.colDef.field}`,
      true, // touched
      false, // shouldValidate
    );
  };

  onChangePage = (event, pageIndex) => {
    this.gridApi.paginationGoToPage(pageIndex);
    if (this.props.onChangePage) this.props.onChangePage(pageIndex);
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value * 1;

    this.gridApi.paginationSetPageSize(pageSize);
    if (this.props.onChangeRowsPerPage)
      this.props.onChangeRowsPerPage(pageSize);
  };

  onPaginationChanged = () => {
    if (this.gridApi) {
      const pageSize = this.gridApi.paginationGetPageSize();
      const pageIndex = this.gridApi.paginationGetCurrentPage();
      const totalCount = this.gridApi.paginationGetRowCount();

      this.setState({ pageSize, pageIndex, totalCount });
    }
  };

  render() {
    const rowData = this.props.rowData
      ? this.props.rowData
      : this.props.values[this.props.name];

    const gridProps = this.props.customizePagination && {
      pagination: true,
      paginationPageSize: this.state.pageSize,
      onPaginationChanged:
        !this.props.remotePagination && this.onPaginationChanged,
      suppressPaginationPanel: true,
    };

    return (
      <div
        id={this.props.idGrid}
        style={{
          ...styles.container,
          ...this.props.gridStyle,
        }}
        className="ag-theme-material"
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={this.props.columnDefs}
          defaultColDef={{
            ...this.state.defaultColDef,
            ...this.props.defaultColDef,
          }}
          localeText={this.state.localeText}
          getRowHeight={this.getRowHeight}
          groupHeaderHeight={GROUP_HEADER_HEIGHT}
          singleClickEdit
          enableBrowserTooltips
          suppressScrollOnNewData
          suppressFocusAfterRefresh
          stopEditingWhenGridLosesFocus
          onGridReady={this.onGridReady}
          onColumnResized={this.onColumnResized}
          onGridSizeChanged={this.onGridSizeChanged}
          onCellEditingStopped={this.onCellEditingStopped}
          {...gridProps}
          {...this.props.gridProps}
        />
        {this.props.customizePagination && (
          <FormPagination
            page={this.state.pageIndex}
            count={this.state.totalCount}
            rowsPerPage={this.state.pageSize}
            rowsPerPageOptions={this.props.pageSizeOptions}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
        )}
      </div>
    );
  }
}

FormData.propTypes = {
  onRef: PropTypes.func,
  idGrid: PropTypes.string,
  name: PropTypes.string,
  rowData: PropTypes.array,
  columnDefs: PropTypes.array,
  defaultColDef: PropTypes.object,
  values: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.any,
  submitCount: PropTypes.number,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  pageSize: PropTypes.number,
  pageIndex: PropTypes.number,
  totalCount: PropTypes.number,
  gridStyle: PropTypes.object,
  gridProps: PropTypes.object,
  autoLayout: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  remotePagination: PropTypes.bool,
  customizePagination: PropTypes.bool,
  onGridReady: PropTypes.func,
};

FormData.defaultProps = {
  submitCount: 0,
  pageSize: PAGE_SIZE,
  pageIndex: 0,
  totalCount: 0,
  autoLayout: false,
  pageSizeOptions: [5, 10, 20],
  remotePagination: false,
  customizePagination: false,
};
