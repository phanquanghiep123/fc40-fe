import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import MuiTable, { MuiTableEditRow } from 'components/MuiTable';

import SearchInput from './SearchInput';

export const styles = theme => ({
  root: {
    boxShadow: theme.shade.light,
    marginBottom: theme.spacing.unit * 3,
  },
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  paper: {
    boxShadow: theme.shade.light,
  },
  button: {
    color: theme.palette.primary.main,
    boxShadow: theme.shade.grey,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#ffffff',
  },
});

export class RoleTableSection extends React.Component {
  state = {
    initialFormData: {
      value: '',
      name: '',
      description: '',
      isMaster: false,
      isActive: true,
    },
    rowIndex: -1,
    isEditing: false,
  };

  tableRef = null;

  columns = [
    {
      title: 'Mã',
      field: 'value',
      headerStyle: {
        minWidth: 200,
      },
      autoFocus: true,
    },
    {
      title: 'Tên',
      field: 'name',
      width: '35vw',
    },
    {
      title: 'Diễn Giải',
      field: 'description',
      width: '35vw',
    },
    {
      title: 'Nhóm Vai Trò',
      field: 'isMaster',
      type: 'boolean',
      width: 160,
      searchable: false,
      disableClick: true,
      render: rowData => this.renderMasterStatus(rowData),
    },
    {
      title: 'Trạng Thái',
      field: 'isActive',
      type: 'boolean',
      width: 110,
      searchable: false,
      disableClick: true,
      render: rowData => this.renderActiveStatus(rowData),
    },
    {
      title: 'Hành Động',
      width: 120,
      sorting: false,
      headerStyle: {
        minWidth: 120,
        textAlign: 'center',
      },
      searchable: false,
      disableClick: true,
      render: rowData => this.renderActions(rowData),
    },
  ];

  initialFormData = this.state.initialFormData;

  componentWillReceiveProps(nextProps) {
    if (this.state.rowIndex === -1 && nextProps.data.length > 0) {
      // Select first row when ready
      this.changeRowIndex(0, nextProps.data);
    }
  }

  isAllowed(callback) {
    if (!this.state.isEditing) {
      callback();
    }
  }

  getIndexById(roleId, data = this.props.data) {
    return data.findIndex(item => item && item.roleId === roleId);
  }

  getRowByIndex(rowIndex = this.state.rowIndex, data = this.props.data) {
    if (data && data.length > 0) {
      return data[rowIndex];
    }
    return null;
  }

  gotoFirstPage = () => {
    this.tableRef.changeCurrentPage(0);
  };

  validateData = rowData => {
    let error = false;

    if (!rowData.value) {
      error = true;
    }
    if (!rowData.name) {
      error = true;
    }

    if (error) {
      this.props.showWarning('Mã và Tên không đươc để trống');
      return false;
    }
    return true;
  };

  validateBeforeChange = () => {
    if (this.state.isEditing) {
      return false;
    }
    return true;
  };

  selectRowById(roleId) {
    const rowIndex = this.getIndexById(roleId);

    if (rowIndex !== -1) {
      if (this.props.onRowSelected) {
        this.props.onRowSelected(roleId);
      }

      this.setState({ rowIndex });
    }
  }

  changeRowIndex(rowIndex, data) {
    const rowData = this.getRowByIndex(rowIndex, data);

    if (rowData && rowData.roleId) {
      if (this.props.onRowSelected) {
        this.props.onRowSelected(rowData.roleId);
      }

      this.setState({ rowIndex });
    }
  }

  handleSearchChange = searchText => {
    this.tableRef.changeSearchText(searchText, () => {
      const rowData = this.getRowByIndex(0, this.tableRef.getRenderData());
      if (rowData && rowData.tableData) {
        this.changeRowIndex(rowData.tableData.id);
      } else {
        this.props.clearRole();
      }
    });
  };

  handleRowEditing = (mode, isEditing) => {
    this.setState({ isEditing });
  };

  handleMasterChange = rowData => event => {
    if (rowData && rowData.roleId) {
      const isMaster = event.target.checked;
      const nextData = {
        ...rowData,
        isMaster,
      };

      if (this.props.onRowUpdate) {
        this.props.onRowUpdate(nextData);
      }
    }
  };

  handleActiveChange = rowData => event => {
    if (rowData && rowData.roleId) {
      const isActive = event.target.checked;
      const nextData = {
        ...rowData,
        isActive,
      };

      if (this.props.onRowUpdate) {
        this.props.onRowUpdate(nextData);
      }
    }
  };

  handleRowClick = (e, rowData) => {
    this.isAllowed(() => {
      if (rowData && rowData.tableData.id >= 0) {
        const rowIndex = rowData.tableData.id;

        if (this.state.rowIndex !== rowIndex) {
          this.changeRowIndex(rowIndex);
        }
      }
    });
  };

  handleCloneClick = () => {
    this.isAllowed(() => {
      const rowData = JSON.parse(JSON.stringify(this.getRowByIndex()));

      rowData.value += '_BS';
      rowData.name += '-Bản sao';
      rowData.description = rowData.description
        ? `${rowData.description}-Bản sao`
        : '';

      rowData.isCloning = true;

      delete rowData.roleId;
      delete rowData.tableData;

      this.setState({ initialFormData: rowData }, () =>
        this.tableRef.showAddRow(),
      );
    });
  };

  handleAddClick = () => {
    this.isAllowed(() => {
      this.setState({ initialFormData: this.initialFormData }, () => {
        this.tableRef.showAddRow();
      });
    });
  };

  handleEditClick = rowData => () => {
    this.isAllowed(() => {
      this.tableRef.showUpdateRow(rowData);
    });
  };

  confirmDeleteClick = rowData => () => {
    this.isAllowed(() =>
      this.props.showConfirm({
        actions: [
          { text: 'Hủy', color: 'primary' },
          {
            text: 'Đồng ý',
            onClick: () => this.handleDeleteClick(rowData),
          },
        ],
      }),
    );
  };

  handleDeleteClick = rowData => {
    if (this.props.onRowDelete) {
      const oldIndex = this.getIndexById(rowData.roleId);
      const activeIndex = this.state.rowIndex;

      const activeData = this.getRowByIndex(activeIndex);

      this.props.onRowDelete(rowData, () => {
        if (oldIndex === activeIndex) {
          this.changeRowIndex(activeIndex);
        } else if (oldIndex < activeIndex) {
          this.selectRowById(activeData.roleId);
        }
      });
    }
  };

  handleEditingApproved = (mode, newData, oldData) => {
    if (mode === 'add') {
      if (this.validateData(newData)) {
        if (newData.isCloning) {
          const { isCloning, ...cloneData } = newData;

          if (this.props.onRowClone) {
            this.props.onRowClone(cloneData, roleId => {
              this.selectRowById(roleId);
            });
          }
        } else if (this.props.onRowAdd) {
          this.props.onRowAdd(newData, roleId => {
            this.gotoFirstPage();
            this.selectRowById(roleId);
          });
        }

        this.tableRef.hideAddRow();
      }
    } else if (mode === 'update') {
      if (this.validateData(newData)) {
        if (this.props.onRowUpdate) {
          this.props.onRowUpdate(newData);
        }
        this.tableRef.hideEditingRow(oldData);
      }
    }
  };

  renderMasterStatus(rowData) {
    return (
      <Checkbox
        checked={rowData.isMaster}
        style={{
          paddingTop: 0,
          paddingLeft: 0,
          paddingBottom: 0,
        }}
        onChange={this.handleMasterChange(rowData)}
      />
    );
  }

  renderActiveStatus(rowData) {
    return (
      <Checkbox
        checked={rowData.isActive}
        style={{
          paddingTop: 0,
          paddingLeft: 0,
          paddingBottom: 0,
        }}
        onChange={this.handleActiveChange(rowData)}
      />
    );
  }

  renderActions(rowData) {
    if (rowData && rowData.tableData && !rowData.tableData.editing) {
      return (
        <Grid container wrap="nowrap" justify="center">
          <Tooltip title="Sửa quyền">
            <IconButton onClick={this.handleEditClick(rowData)}>
              <Icon fontSize="small">edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa quyền">
            <IconButton onClick={this.confirmDeleteClick(rowData)}>
              <Icon fontSize="small">delete</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      );
    }
    return undefined;
  }

  render() {
    const { theme, classes, loading, data } = this.props;
    const { initialFormData, rowIndex, isEditing } = this.state;

    const isDisabled = !data || !data.length;

    const rowStyles = rowData => ({
      backgroundColor:
        rowData && rowData.tableData.id === rowIndex
          ? fade(theme.palette.primary.main, 0.1)
          : undefined,
    });

    return (
      <React.Fragment>
        <SearchInput
          disabled={isEditing}
          onSearchChange={this.handleSearchChange}
        />
        <Card className={classes.root}>
          <CardHeader
            title="Danh Sách Vai Trò"
            titleTypographyProps={{
              variant: 'h6',
            }}
            className={classes.header}
          />
          <CardContent>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <Tooltip title="Thêm mới quyền">
                  <Button
                    color="primary"
                    disabled={isEditing}
                    component="div"
                    className={classes.button}
                    onClick={() => this.handleAddClick()}
                  >
                    Thêm mới
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Nhân bản quyền">
                  <Button
                    color="primary"
                    disabled={isEditing || isDisabled}
                    component="div"
                    className={classes.button}
                    onClick={() => this.handleCloneClick()}
                  >
                    Nhân bản
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
          <MuiTable
            ref={ref => {
              this.tableRef = ref;
            }}
            data={data}
            columns={this.columns}
            icons={{
              Check: props => <Icon {...props}>save</Icon>,
            }}
            options={{
              search: false,
              toolbar: false,
              sorting: !isEditing && !isDisabled,
              rowStyle: rowStyles,
              cellLastStyle: {
                padding: 0,
                paddingRight: 0,
              },
              addRowPosition: 'first',
              actionsColumnIndex: this.columns.length - 1,
            }}
            components={{
              Container: props => (
                <Paper {...props} className={classes.paper} />
              ),
              EditRow: props => (
                <MuiTableEditRow
                  {...props}
                  onEditingApproved={this.handleEditingApproved}
                />
              ),
            }}
            isLoading={loading}
            initialFormData={initialFormData}
            onRowClick={this.handleRowClick}
            onRowEditing={this.handleRowEditing}
            beforeChangePage={this.validateBeforeChange}
          />
        </Card>
      </React.Fragment>
    );
  }
}

RoleTableSection.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.array,
  clearRole: PropTypes.func,
  onRowAdd: PropTypes.func,
  onRowClone: PropTypes.func,
  onRowUpdate: PropTypes.func,
  onRowDelete: PropTypes.func,
  onRowSelected: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

RoleTableSection.defaultProps = {
  loading: false,
  data: [],
};

export default withStyles(styles, { withTheme: true })(RoleTableSection);
