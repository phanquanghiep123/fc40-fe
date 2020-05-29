import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';

import Select from './Select';
import RoleTabContent from './RoleTabContent';

export default class UserAssignRole extends React.Component {
  tableRef = null;

  tableEditRef = null;

  mapPropsToData(usersAssigned, usersData) {
    const results = [];

    if (
      usersData &&
      usersAssigned &&
      usersData.length > 0 &&
      usersAssigned.length > 0
    ) {
      for (let i = 0, len = usersAssigned.length; i < len; i += 1) {
        const user = usersAssigned[i];
        const newUser = this.findUserById(usersData, user.userId);

        if (newUser) {
          results.push(this.fromData(newUser));
        }
      }
    }

    return results;
  }

  mapPropsToColumns(usersData) {
    return [
      {
        title: 'Tên Đăng Nhập',
        field: 'userName',
        width: 180,
        headerStyle: {
          minWidth: 150,
        },
        editComponent: props => (
          <Select
            {...props}
            options={usersData}
            valueKey="userName"
            labelKey="userName"
            includeKeys={['userName', 'email', 'phoneNumber']}
            onSelectChange={this.handleSelectChange}
            validBeforeChange={this.validBeforeChange}
          />
        ),
      },
      {
        title: 'Họ Tên',
        render: this.renderFullName,
        headerStyle: {
          minWidth: 180,
        },
      },
      {
        title: 'Email',
        width: '30vw',
        render: rowData => rowData.email,
      },
      {
        title: 'Trạng Thái Khóa',
        width: 150,
        render: this.renderLockStatus,
      },
      {
        title: 'Trạng Thái',
        width: 125,
        render: this.renderActiveStatus,
      },
      {
        title: 'Kiểu Đăng Nhập',
        width: 150,
        render: this.renderAuthenType,
      },
      {
        title: 'Ngày Hết Hạn',
        width: 140,
        render: this.renderDateExpried,
      },
    ];
  }

  getUser(data) {
    const result = {};

    result.userId = data.id;

    return result;
  }

  fromData(data) {
    return {
      id: data && data.id ? data.id : '',
      userName: data && data.userName ? data.userName : '',
      lastName: data && data.lastName ? data.lastName : '',
      firstName: data && data.firstName ? data.firstName : '',
      email: data && data.email ? data.email : '',
      locked: data && data.locked ? data.locked : false,
      isActive: data && data.isActive ? data.isActive : false,
      authenType: data && data.authenType ? data.authenType : 0,
      dateExpried: data && data.dateExpried ? data.dateExpried : '',
    };
  }

  findUserById(users, userId) {
    if (users && users.length > 0) {
      return users.find(item => item.id === userId);
    }
    return null;
  }

  validBeforeChange = rowData => {
    const { role } = this.props;
    const { userAssignRoles } = role;

    const foundData = userAssignRoles.find(item => item.userId === rowData.id);

    if (foundData) {
      this.props.showWarning('Đã tồn tại trong danh sách');
      return false;
    }
    return true;
  };

  handleRowAdd = rowData => {
    const { role } = this.props;
    const { userAssignRoles } = role;

    userAssignRoles.unshift(this.getUser(rowData));

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, userAssignRoles });
    }
  };

  handleRowUpdate = (rowData, oldData) => {
    const { role } = this.props;
    const { userAssignRoles } = role;

    const rowIndex = userAssignRoles.findIndex(
      item => item.userId === oldData.id,
    );
    if (rowIndex !== -1) {
      userAssignRoles.splice(rowIndex, 1, this.getUser(rowData));

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, userAssignRoles });
      }
    }
  };

  handleRowDelete = rowData => {
    const { role } = this.props;
    const { userAssignRoles } = role;

    const rowIndex = userAssignRoles.findIndex(
      item => item.userId === rowData.id,
    );
    if (rowIndex !== -1) {
      userAssignRoles.splice(rowIndex, 1);

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, userAssignRoles });
      }
    }
  };

  handleSelectChange = rowData => {
    if (this.tableEditRef) {
      this.tableRef.setIsChanging(true);
      this.tableEditRef.setState(state => ({
        data: {
          ...state.data,
          ...this.fromData(rowData),
        },
      }));
    }
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

  renderLockStatus(rowData) {
    if (rowData.locked) return 'Có';
    return 'Không';
  }

  renderActiveStatus(rowData) {
    if (rowData.isActive) return 'Hoạt động';
    return 'Không hoạt động';
  }

  renderAuthenType(rowData) {
    return rowData.authenType ? 'AD' : 'DB';
  }

  renderDateExpried(rowData) {
    if (rowData.dateExpried) {
      return dateFns.format(new Date(rowData.dateExpried), 'dd/MM/yyyy');
    }
    return '';
  }

  render() {
    const { role, usersLoading, usersData } = this.props;

    return (
      <RoleTabContent
        tableRef={ref => {
          this.tableRef = ref;
        }}
        tableEditRef={ref => {
          this.tableEditRef = ref;
        }}
        data={this.mapPropsToData(role.userAssignRoles, usersData)}
        columns={this.mapPropsToColumns(usersData)}
        isLoading={usersLoading}
        initialFormData={this.fromData()}
        onRowAdd={this.handleRowAdd}
        onRowUpdate={this.handleRowUpdate}
        onRowDelete={this.handleRowDelete}
        showConfirm={this.props.showConfirm}
      />
    );
  }
}

UserAssignRole.propTypes = {
  role: PropTypes.object,
  usersLoading: PropTypes.bool,
  usersData: PropTypes.array,
  onRoleChange: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

UserAssignRole.defaultProps = {
  role: {
    userAssignRoles: [],
  },
  usersLoading: false,
  usersData: [],
};
