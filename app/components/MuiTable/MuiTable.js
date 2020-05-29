import React from 'react';
import PropTypes from 'prop-types';
import getIn from 'lodash/get';
import merge from 'lodash/merge';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import TablePagination from '@material-ui/core/TablePagination';
import MaterialTable from 'material-table';
import MuiTableCell from './MuiTableCell';
import MuiTableBody from './MuiTableBody';
import MuiTableBodyRow from './MuiTableBodyRow';
import MuiTableAction from './MuiTableAction';
import MuiTableActions from './MuiTableActions';
import MuiTableEditRow from './MuiTableEditRow';
import MuiTableEditField from './MuiTableEditField';
import MuiTableHeader from './MuiTableHeader';
import MuiTableToolbar from './MuiTableToolbar';
export const muiTheme = (theme, otipons = {}) =>
  createMuiTheme({
    ...theme,
    palette: {
      ...theme.palette,
      background: {
        ...theme.palette.background,
        head: theme.palette.background.head || '#f4f5f7',
      },
    },
    overrides: {
      ...theme.overrides,
      MuiCheckbox: {
        colorSecondary: {
          '&$checked': {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiTableRow: {
        root: {
          height: 36,
          ...getIn(theme.overrides, ['MuiTableRow', 'root'], {}),
        },
        head: {
          height: 36,
          '&:first-child': {
            borderTop: !otipons.border
              ? '1px solid rgba(224, 224, 224, 1)'
              : undefined,
          },
          ...getIn(theme.overrides, ['MuiTableRow', 'head'], {}),
        },
      },
      MuiTableCell: {
        root: {
          border: otipons.border
            ? '1px solid rgba(224, 224, 224, 1)'
            : undefined,
          padding: '0 8px',

          '&:last-child': {
            paddingRight: 8,
            ...otipons.cellLastStyle,
          },
        },
      },
    },
  });

/* eslint-disable no-param-reassign */
export class MuiTable extends React.PureComponent {
  tableRef = null;

  getProps(props) {
    const options = {
      ...MuiTable.defaultProps.options,
      ...props.options,
      cellStyle: {
        ...MuiTable.defaultProps.options.cellStyle,
        ...props.options.cellStyle,
      },
      headerStyle: {
        ...MuiTable.defaultProps.options.headerStyle,
        ...props.options.headerStyle,
      },
    };

    const actions = this.getActions(props.actions);
    const columns = this.getColumns(props.columns, options);

    const components = {
      ...MuiTable.defaultProps.components,
      ...props.components,
    };

    const localization = merge(
      MuiTable.defaultProps.localization,
      props.localization,
    );

    const newProps = {
      ...props,
      actions,
      columns,
      options,
      components,
      localization,
    };
    return newProps;
  }

  getActions(actions) {
    if (actions && actions.length > 0) {
      return actions.map(action => {
        if (!action.icon) {
          action.icon = '';
        }
        if (!action.onClick) {
          action.onClick = () => {};
        }
        return action;
      });
    }
    return undefined;
  }

  getColumns(columns, options) {
    if (columns && columns.length > 0) {
      return columns.map(({ width, editable, ...column }) => {
        if (width !== undefined) {
          if (!column.headerStyle) {
            column.headerStyle = {};
          }
          column.headerStyle = { ...column.headerStyle, width };
        }

        if (editable === undefined) {
          column.editable = true;
        }

        if (options && options.cellStyle) {
          if (typeof column.cellStyle !== 'function') {
            if (!column.cellStyle) {
              column.cellStyle = {};
            }
            column.cellStyle = {
              ...options.cellStyle,
              ...column.cellStyle,
            };
          }
        }

        return column;
      });
    }
    return undefined;
  }

  getDataCount(props) {
    if (
      this.tableRef &&
      this.props.options &&
      this.props.options.isRowSelectable
    ) {
      const filteredData = this.tableRef.state.data.filter(row => {
        if (this.getIsSelectable(row)) return true;
        return false;
      });
      return filteredData.length;
    }
    return props.dataCount;
  }

  getRenderData() {
    if (this.tableRef) {
      return this.tableRef.state.renderData;
    }
    return [];
  }

  getIsSelectable(rowData) {
    if (this.props.options && this.props.options.isRowSelectable) {
      if (!this.props.options.isRowSelectable(rowData)) {
        return false;
      }
    }
    return true;
  }

  showAddRow(show = false) {
    this.tableRef.dataManager.changeRowEditing();
    this.tableRef.setState(state => {
      this.changeRowEditing('add', show || !state.showAddRow);
      return {
        ...this.tableRef.dataManager.getRenderState(),
        showAddRow: show || !state.showAddRow,
      };
    });
  }

  showUpdateRow(rowData) {
    this.changeRowEditing('update', true);
    this.tableRef.dataManager.changeRowEditing(rowData, 'update');
    this.tableRef.setState({
      ...this.tableRef.dataManager.getRenderState(),
      showAddRow: false,
    });
  }

  showDeleteRow(rowData) {
    this.changeRowEditing('delete', true);
    this.tableRef.dataManager.changeRowEditing(rowData, 'delete');
    this.tableRef.setState({
      ...this.tableRef.dataManager.getRenderState(),
      showAddRow: false,
    });
  }

  hideAddRow() {
    this.changeRowEditing('add', false);
    this.tableRef.setState({ showAddRow: false });
  }

  hideEditingRow(rowData) {
    this.changeRowEditing('update', false);
    this.tableRef.dataManager.changeRowEditing(rowData);
    this.tableRef.setState(this.tableRef.dataManager.getRenderState());
  }

  changeSearchText = (searchText, callback) => {
    this.tableRef.dataManager.changeSearchText(searchText);
    this.tableRef.setState(
      this.tableRef.dataManager.getRenderState(),
      callback,
    );
  };

  changeCurrentPage = pageIndex => {
    this.tableRef.dataManager.changeCurrentPage(pageIndex);
    this.tableRef.setState(this.tableRef.dataManager.getRenderState());
  };

  changeRowEditing = (mode, isEditing) => {
    if (this.props.onRowEditing) {
      this.props.onRowEditing(mode, isEditing);
    }
  };

  changeAllSelected = checked => {
    let selectedCount = 0;

    this.tableRef.dataManager.searchedData.map(row => {
      if (this.getIsSelectable(row)) {
        row.tableData.checked = checked;
        selectedCount += 1;
      }
      return row;
    });
    this.tableRef.dataManager.selectedCount = checked ? selectedCount : 0;

    this.tableRef.setState(this.tableRef.dataManager.getRenderState(), () => {
      this.tableRef.onSelectionChange();
    });
  };

  handleTableReady = ref => {
    this.tableRef = ref;

    if (this.props.tableRef) {
      if (typeof this.props.tableRef === 'function') {
        this.props.tableRef(ref);
      } else if (typeof this.props.tableRef === 'object') {
        this.props.tableRef.current = ref;
      }
    }
  };

  handleSearchChange = searchText => {
    let callback;

    if (typeof this.props.onSearchChange === 'function') {
      callback = this.props.onSearchChange(searchText);
    } else {
      callback = this.tableRef.onSearchChange;
    }

    this.tableRef.setState({ searchText }, callback);
  };

  render() {
    const {
      icons,
      components,
      totalCount,
      initialPage,
      ...tableProps
    } = this.getProps(this.props);
    const {
      border,
      pageSize,
      pagingRemote,
      cellLastStyle,
      ...tableOptions
    } = tableProps.options;
    const themeOptions = { border, cellLastStyle };

    return (
      <MuiThemeProvider theme={theme => muiTheme(theme, themeOptions)}>
        <MaterialTable
          {...tableProps}
          tableRef={this.handleTableReady}
          icons={{
            Check: props => <Icon {...props}>save</Icon>,
            ...icons,
          }}
          options={tableOptions}
          components={{
            ...components,
            Toolbar: props => (
              <components.Toolbar
                {...props}
                onSearchChanged={this.handleSearchChange}
              />
            ),

            Header: props => (
              <components.Header
                {...props}
                dataCount={this.getDataCount(props)}
                onAllSelected={this.changeAllSelected}
              />
            ),
            Body: props => {
              const onEditingCanceled = (mode, rowData) => {
                this.changeRowEditing(mode, false);
                props.onEditingCanceled(mode, rowData);
              };

              return (
                <components.Body
                  {...props}
                  onEditingCanceled={onEditingCanceled}
                />
              );
            },
            Row: props => (
              <components.Row
                {...props}
                onDoubleClick={event => {
                  if (this.props.onRowDoubleClick) {
                    this.props.onRowDoubleClick(event, props.data);
                  }
                }}
              />
            ),
            Pagination: props => {
              const changePage = (event, page) => {
                if (pagingRemote && this.props.onChangePage) {
                  this.props.onChangePage(page);
                } else {
                  props.onChangePage(event, page);
                }
              };
              const onChangePage = (event, page) => {
                if (this.props.beforeChangePage) {
                  if (this.props.beforeChangePage(page)) {
                    changePage(event, page);
                  }
                } else {
                  changePage(event, page);
                }
              };
              const onChangeRowsPerPage = event => {
                if (this.props.beforeChangeRowsPerPage) {
                  if (this.props.beforeChangeRowsPerPage(event.target.value)) {
                    props.onChangeRowsPerPage(event);
                  }
                } else {
                  props.onChangeRowsPerPage(event);
                }
              };

              return (
                <components.Pagination
                  {...props}
                  page={initialPage >= 0 ? initialPage : props.page}
                  count={totalCount >= 0 ? totalCount : props.count}
                  rowsPerPage={pageSize >= 0 ? pageSize : props.rowsPerPage}
                  onChangePage={onChangePage}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                />
              );
            },
          }}
        />
      </MuiThemeProvider>
    );
  }
}

MuiTable.propTypes = {
  /**
   * All options of table
   */
  options: PropTypes.shape({
    /**
     * Show table borders
     */
    border: PropTypes.bool,
    /**
     * Style to be applied cells
     */
    cellStyle: PropTypes.object,
    /**
     * Style to be applied last cell
     */
    cellLastStyle: PropTypes.object,
    /**
     * Flag for paging remote
     */
    pagingRemote: PropTypes.bool,
    /**
     * Filter rows can be selected
     */
    isRowSelectable: PropTypes.func,
  }),
  /**
   * Component customization
   */
  components: PropTypes.object,
  /**
   * Total records
   */
  totalCount: PropTypes.number,
  /**
   * Initial page number
   */
  initialPage: PropTypes.number,
  /**
   * All text for localization
   */
  localization: PropTypes.object,
  /**
   * To handle when editing row
   */
  onRowEditing: PropTypes.func,
  /**
   * To handle search changes
   */
  onSearchChange: PropTypes.func,
  /**
   * To handle row double click (event, rowData)
   */
  onRowDoubleClick: PropTypes.func,
  /**
   * Validate before change page
   */
  beforeChangePage: PropTypes.func,
  /**
   * Validate before change rows Per page
   */
  beforeChangeRowsPerPage: PropTypes.func,

  onOrderChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
};

MuiTable.defaultProps = {
  options: {
    cellStyle: {},
    headerStyle: {
      fontWeight: 'bold',
    },
    pagingRemote: false,
    actionsColumnIndex: -1,
    emptyRowsWhenPaging: false,
  },
  components: {
    Toolbar: MuiTableToolbar,
    Header: MuiTableHeader,
    Body: MuiTableBody,
    Row: MuiTableBodyRow,
    Cell: MuiTableCell,
    Action: MuiTableAction,
    Actions: MuiTableActions,
    EditRow: MuiTableEditRow,
    EditField: MuiTableEditField,
    Pagination: TablePagination,
  },
  localization: {
    body: {
      emptyDataSourceMessage: 'Không có bản ghi',
      filterRow: {
        filterTooltip: 'Bộ lọc',
      },
      editRow: {
        saveTooltip: 'Lưu',
        cancelTooltip: 'Hủy',
        deleteText: 'Bạn muốn xóa hàng này không?',
      },
      addTooltip: 'Thêm',
      deleteTooltip: 'Xóa',
      editTooltip: 'Sửa',
    },
    header: {
      actions: 'Hành động',
    },
    grouping: {
      groupedBy: 'Nhóm theo:',
      placeholder: 'Kéo thả các tiêu đề ở đây để nhóm theo',
    },
    pagination: {
      firstTooltip: 'Trang đầu',
      previousTooltip: 'Trang trước',
      nextTooltip: 'Trang tiếp',
      labelDisplayedRows: '{from}-{to} trên {count}',
      labelRowsPerPage: 'Số hàng trên mỗi trang:',
      lastTooltip: 'Trang cuối',
      labelRowsSelect: 'bản ghi/trang',
    },
    toolbar: {
      addRemoveColumns: 'Thêm hoặc xóa cột',
      nRowsSelected: '{0} hàng được chọn',
      showColumnsTitle: 'Hiển thị cột',
      showColumnsAriaLabel: 'Hiển thị cột',
      exportTitle: 'Xuất',
      exportAriaLabel: 'Xuất',
      exportName: 'Xuất CSV',
      searchTooltip: 'Tìm kiếm',
      searchPlaceholder: 'Tìm kiếm...',
    },
  },
};

export default MuiTable;
