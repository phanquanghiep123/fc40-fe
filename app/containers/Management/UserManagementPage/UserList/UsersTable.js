import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import MuiTable, { MuiTableBody, MuiTableHeader } from 'components/MuiTable';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { TYPE_LOCKED } from '../constants';

export const styles = theme => ({
  root: {
    boxShadow: theme.shade.light,
    marginBottom: theme.spacing.unit * 3,
  },
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  button: {
    color: theme.palette.primary.main,
    minWidth: 36,
    boxShadow: theme.shade.grey,
    backgroundColor: '#ffffff',
  },
});

export class UsersTable extends React.Component {
  state = {
    datas: [],
    rowIndex: -1,
    typeLocked: TYPE_LOCKED.NONE,
  };

  columns = [
    {
      title: 'Họ Tên',
      render: this.renderFullName,
      width: 200,
      headerStyle: {
        minWidth: 120,
      },
      sorting: false,
    },
    {
      title: 'Tên Đăng Nhập',
      field: 'userName',
      width: '18vw',
    },
    {
      title: 'Email',
      field: 'email',
      width: '18vw',
    },
    {
      title: 'Ldap',
      field: 'authenType',
      width: 100,
      render: this.renderLdapStatus,
    },
    {
      title: 'Trạng Thái',
      field: 'isActive',
      width: 150,
      render: this.renderActiveStatus,
    },
    {
      title: 'Trạng Thái Khóa',
      field: 'locked',
      width: 150,
      render: this.renderLockStatus,
    },
    {
      title: 'Ngày Tạo',
      field: 'createdAt',
      width: 100,
      render: this.renderDateCreated,
    },
    {
      title: 'Ngày Hết Hạn',
      field: 'dateExpried',
      width: 120,
      render: this.renderDateExpried,
    },
    {
      title: 'Hành Động',
      width: 85,
      render: rowData => this.renderActionButtons(rowData),
      sorting: false,
      disableClick: true,
    },
  ];

  selectedRows = [];

  componentWillReceiveProps(nextProps) {
    if (this.isDifference(this.props.datas, nextProps.datas)) {
      this.selectedRows = [];

      this.setState({
        datas: this.getData(nextProps.datas),
        typeLocked: TYPE_LOCKED.NONE,
      });
      this.changeRowIndex(0, nextProps.datas);
    }
  }

  getData(datas) {
    if (datas && datas.length > 0) {
      return datas.slice();
    }
    return [];
  }

  isDifference(array, other) {
    const results = [];

    for (let i = 0, len = array.length; i < len; i += 1) {
      const { tableData, ...value } = array[i];
      results[i] = value;
    }

    if (JSON.stringify(results) !== JSON.stringify(other)) {
      return true;
    }
    return false;
  }

  getUserIds() {
    const results = [];

    for (let i = 0, len = this.selectedRows.length; i < len; i += 1) {
      const data = this.selectedRows[i];

      if (data && data.id) {
        results.push(data.id);
      }
    }

    return results;
  }

  getRowByIndex(rowIndex = this.state.rowIndex, datas = this.props.datas) {
    if (datas && datas.length > 0) {
      return datas[rowIndex];
    }
    return null;
  }

  validateLdapUser() {
    // Cảnh báo khi chọn user ldap
    // const found = this.selectedRows.find(data => data && data.authenType === 1);

    // if (found) {
    //   this.props.showWarning(
    //     'Không được phép thực hiện hành động này với tài khoản Ldap',
    //   );
    //   return false;
    // }
    return true;
  }

  validateBulkEditing() {
    return new Promise(resolve => {
      // Cảnh báo khi chọn nhiều user
      if (this.selectedRows.length > 1) {
        const onCancel = () => {
          resolve(false);
        };
        const onAgree = () => {
          resolve(true);
        };

        this.props.showConfirm({
          title: 'Cảnh báo',
          message: 'Xác nhận thực hiện hành động này trên nhiều tài khoản.',
          actions: [
            { text: 'Hủy', onClick: onCancel },
            { text: 'Đồng ý', color: 'primary', onClick: onAgree },
          ],
        });
      } else {
        resolve(true);
      }
    });
  }

  validateBeforeLock() {
    if (this.validateLdapUser()) {
      // eslint-disable-next-line prefer-const
      let isLocking = this.selectedRows[0].locked;
      let isLockConflict = false;

      for (let i = 1, len = this.selectedRows.length; i < len; i += 1) {
        const rowData = this.selectedRows[i];
        if (rowData.locked !== isLocking) {
          isLockConflict = true;
          break;
        }
      }

      if (isLockConflict) {
        this.props.showWarning(
          `Không thể thực hiện ${
            this.state.typeLocked === TYPE_LOCKED.LOCKED
              ? 'Mở khóa tài khoản'
              : 'Khóa tài khoản'
          } do xung đột Trạng thái khóa`,
        );
        return false;
      }

      return this.validateBulkEditing();
    }
    return false;
  }

  validateBeforeReset() {
    if (this.validateLdapUser()) {
      return this.validateBulkEditing();
    }
    return false;
  }

  changeRowIndex(rowIndex, datas) {
    const rowData = this.getRowByIndex(rowIndex, datas);

    if (this.props.onRowSelected) {
      this.props.onRowSelected(rowData);
    }

    this.setState({ rowIndex });
  }

  handleRowClick = (e, rowData) => {
    if (rowData && rowData.tableData.id >= 0) {
      const rowIndex = rowData.tableData.id;

      if (this.state.rowIndex !== rowIndex) {
        this.changeRowIndex(rowIndex);
      }
    }
  };

  handleRowSelected = (rowIndex, isChecked) => {
    let typeLocked = TYPE_LOCKED.NONE;
    const rowData = this.getRowByIndex(rowIndex);

    if (isChecked) {
      // Add into stack
      this.selectedRows.push(rowData);

      if (rowData && rowData.locked) {
        typeLocked = TYPE_LOCKED.LOCKED;
      } else {
        typeLocked = TYPE_LOCKED.UNLOCKED;
      }
    } else {
      // Remove from stack
      const foundIndex = this.selectedRows.findIndex(
        data => data && rowData && data.id === rowData.id,
      );
      this.selectedRows.splice(foundIndex, 1);

      if (this.selectedRows.length > 0) {
        const lastData = this.selectedRows[this.selectedRows.length - 1];

        if (lastData && lastData.locked) {
          typeLocked = TYPE_LOCKED.LOCKED;
        } else {
          typeLocked = TYPE_LOCKED.UNLOCKED;
        }
      }
    }

    this.setState({ typeLocked });
  };

  handleAllSelected = isChecked => {
    let typeLocked = TYPE_LOCKED.NONE;
    const rowDatas = this.props.datas.slice();

    if (isChecked) {
      if (rowDatas.length > 0) {
        const lastData = rowDatas[rowDatas.length - 1];

        this.selectedRows = rowDatas;

        if (lastData && lastData.locked) {
          typeLocked = TYPE_LOCKED.LOCKED;
        } else {
          typeLocked = TYPE_LOCKED.UNLOCKED;
        }
      }
    } else {
      this.selectedRows = [];
    }

    this.setState({ typeLocked });
  };

  handleLockClick = async () => {
    const isVaild = await this.validateBeforeLock();
    if (isVaild) {
      this.props.onLockStatusChange(this.getUserIds());
    }
  };

  handleResetClick = async () => {
    const isVaild = await this.validateBeforeReset();
    if (isVaild) {
      this.props.onResetPassword(this.getUserIds());
    }
  };

  onChangePage = pageIndex => {
    const params = {
      ...this.props.pagination,
      pageIndex,
    };
    this.props.onGetUsers(params);
  };

  onOrderChange = (orderBy, orderDirection) => {
    const column = this.columns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      const params = {
        ...this.props.pagination,
        sort: sortOrder,
        pageIndex: 0,
      };
      this.props.onGetUsers(params);
    }
  };

  onChangeRowsPerPage = pageSize => {
    const params = {
      ...this.props.pagination,
      pageIndex: 0,
      pageSize,
    };
    this.props.onGetUsers(params);
  };

  renderFullName(rowData) {
    if (rowData) {
      let fullName = '';

      if (rowData.lastName) {
        fullName += rowData.lastName;
      }
      if (rowData.firstName) {
        fullName += ` ${rowData.firstName}`;
      }

      return fullName;
    }
    return '';
  }

  renderLdapStatus(rowData) {
    if (rowData.authenType === 1) return 'Có';
    return 'Không';
  }

  renderLockStatus(rowData) {
    if (rowData.locked) return 'Có';
    return 'Không';
  }

  renderActiveStatus(rowData) {
    if (rowData.isActive) return 'Hoạt động';
    return 'Không hoạt động';
  }

  renderDateCreated(rowData) {
    if (rowData.createdAt) {
      return dateFns.format(new Date(rowData.createdAt), 'dd/MM/yyyy');
    }
    return '';
  }

  renderDateExpried(rowData) {
    if (rowData.dateExpried) {
      return dateFns.format(new Date(rowData.dateExpried), 'dd/MM/yyyy');
    }
    return '';
  }

  renderActionButtons(rowData) {
    return (
      <Can do={CODE.suaUser} on={SCREEN_CODE.QLND}>
        <Grid container wrap="nowrap" justify="center">
          <Tooltip title="Cập nhật">
            <IconButton onClick={() => this.props.onUpdateUser(rowData)}>
              <Icon fontSize="small">edit</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      </Can>
    );
  }

  render() {
    const { datas, rowIndex, typeLocked } = this.state;
    const { theme, classes, loading, pagination } = this.props;
    const { pageSize, pageIndex, totalCount, searchText } = pagination;

    const rowStyles = rowData => ({
      backgroundColor:
        rowData && rowData.tableData.id === rowIndex
          ? fade(theme.palette.primary.main, 0.1)
          : undefined,
    });

    return (
      <Card className={classes.root}>
        <CardHeader
          title="Danh Sách Người Dùng"
          subheader={searchText ? `Tìm kiếm "${searchText}"` : ''}
          titleTypographyProps={{
            variant: 'h6',
          }}
          subheaderTypographyProps={{
            variant: 'caption',
          }}
          className={classes.header}
        />
        <Can do={[CODE.taoUser, CODE.suaUser]} on={SCREEN_CODE.QLND}>
          <CardContent>
            <Grid
              container
              wrap="nowrap"
              spacing={8}
              justify="space-between"
              direction="row-reverse"
            >
              <Can do={CODE.taoUser} on={SCREEN_CODE.QLND}>
                <Grid item>
                  <Tooltip title="Thêm mới">
                    <Button
                      color="primary"
                      className={classes.button}
                      onClick={this.props.onCreateUser}
                    >
                      Thêm mới
                    </Button>
                  </Tooltip>
                </Grid>
              </Can>
              {typeLocked !== TYPE_LOCKED.NONE && (
                <Can do={CODE.suaUser} on={SCREEN_CODE.QLND}>
                  <Grid item>
                    <Grid container spacing={8}>
                      <Grid item>
                        <Tooltip title="Đặt lại mật khẩu">
                          <Button
                            color="primary"
                            className={classes.button}
                            onClick={this.handleResetClick}
                          >
                            Đặt lại mật khẩu
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title={
                            typeLocked === TYPE_LOCKED.LOCKED
                              ? 'Mở khóa tài khoản'
                              : 'Khóa tài khoản'
                          }
                        >
                          <Button
                            color="primary"
                            className={classes.button}
                            onClick={this.handleLockClick}
                          >
                            {typeLocked === TYPE_LOCKED.LOCKED
                              ? 'Mở khóa tài khoản'
                              : 'Khóa tài khoản'}
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Can>
              )}
            </Grid>
          </CardContent>
        </Can>
        <MuiTable
          data={datas}
          columns={this.columns}
          options={{
            pageSize,
            sorting: datas.length > 0,
            rowStyle: rowStyles,
            toolbar: false,
            selection: true,
          }}
          components={{
            Body: props => {
              const onRowSelected = (event, path) => {
                props.onRowSelected(event, path);
                this.handleRowSelected(path[0], event.target.checked);
              };

              return (
                <MuiTableBody
                  {...props}
                  renderData={datas}
                  currentPage={0}
                  onRowSelected={onRowSelected}
                />
              );
            },
            Header: props => {
              const onAllSelected = checked => {
                props.onAllSelected(checked);
                this.handleAllSelected(checked);
              };

              return (
                <MuiTableHeader {...props} onAllSelected={onAllSelected} />
              );
            },
          }}
          isLoading={loading}
          totalCount={totalCount}
          initialPage={pageIndex}
          onRowClick={this.handleRowClick}
          onChangePage={this.onChangePage}
          onOrderChange={this.onOrderChange}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
      </Card>
    );
  }
}

UsersTable.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  datas: PropTypes.array,
  pagination: PropTypes.object,
  showWarning: PropTypes.func,
  showConfirm: PropTypes.func,
  onGetUsers: PropTypes.func,
  onCreateUser: PropTypes.func,
  onUpdateUser: PropTypes.func,
  onRowSelected: PropTypes.func,
  onResetPassword: PropTypes.func,
  onLockStatusChange: PropTypes.func,
};

UsersTable.defaultProps = {
  loading: false,
  datas: [],
  pagination: {},
};

export default withStyles(styles, { withTheme: true })(UsersTable);
