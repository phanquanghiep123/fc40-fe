import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import RoleTabContent from './RoleTabContent';

export default class RoleAccessPrivilege extends React.Component {
  tableRef = null;

  tableEditRef = null;

  mapPropsToData(accessPrivileges, privilegesData) {
    const results = [];

    if (
      privilegesData &&
      accessPrivileges &&
      privilegesData.length > 0 &&
      accessPrivileges.length > 0
    ) {
      for (let i = 0, len = accessPrivileges.length; i < len; i += 1) {
        const privilege = accessPrivileges[i];
        const newPrivilege = this.findPrivilegeById(
          privilegesData,
          privilege.privilegeId,
        );

        if (newPrivilege) {
          newPrivilege.allowed = privilege.allowed;
          results.push(this.fromData(newPrivilege));
        }
      }
    }

    return results;
  }

  mapPropsToColumns(privilegesData) {
    return [
      {
        title: 'Mã',
        field: 'value',
        headerStyle: {
          minWidth: 200,
        },
        editComponent: props => (
          <Select
            {...props}
            options={privilegesData}
            valueKey="value"
            labelKey="value"
            sublabelKey="name"
            includeKeys={['value', 'name']}
            onSelectChange={this.handleSelectChange}
            validBeforeChange={this.validBeforeChange}
          />
        ),
      },
      {
        title: 'Tên',
        width: '70.8vw',
        render: rowData => rowData.name,
      },
      {
        title: 'Cho Phép',
        field: 'allowed',
        type: 'boolean',
        width: 100,
        render: this.renderAllowStatus,
      },
    ];
  }

  getPrivilege(data) {
    const result = {};

    result.privilegeId = data.privilegeId;
    result.allowed = data.allowed;

    return result;
  }

  fromData(data) {
    return {
      privilegeId: data && data.privilegeId ? data.privilegeId : 0,
      value: data && data.value ? data.value : '',
      name: data && data.name ? data.name : '',
      allowed: data ? data.allowed : true,
    };
  }

  findPrivilegeById(privileges, privilegeId) {
    if (privileges && privileges.length > 0) {
      return privileges.find(data => data.privilegeId === privilegeId);
    }
    return null;
  }

  validBeforeChange = rowData => {
    const { role } = this.props;
    const { roleAccessPrivileges } = role;

    const foundData = roleAccessPrivileges.find(
      item => item.privilegeId === rowData.privilegeId,
    );

    if (foundData) {
      this.props.showWarning('Đã tồn tại trong danh sách');
      return false;
    }
    return true;
  };

  handleRowAdd = rowData => {
    const { role } = this.props;
    const { roleAccessPrivileges } = role;

    roleAccessPrivileges.unshift(this.getPrivilege(rowData));

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, roleAccessPrivileges });
    }
  };

  handleRowUpdate = (rowData, oldData) => {
    const { role } = this.props;
    const { roleAccessPrivileges } = role;

    const rowIndex = roleAccessPrivileges.findIndex(
      item => item.privilegeId === oldData.privilegeId,
    );
    if (rowIndex !== -1) {
      roleAccessPrivileges.splice(rowIndex, 1, this.getPrivilege(rowData));

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, roleAccessPrivileges });
      }
    }
  };

  handleRowDelete = rowData => {
    const { role } = this.props;
    const { roleAccessPrivileges } = role;

    const rowIndex = roleAccessPrivileges.findIndex(
      item => item.privilegeId === rowData.privilegeId,
    );
    if (rowIndex !== -1) {
      roleAccessPrivileges.splice(rowIndex, 1);

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, roleAccessPrivileges });
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
          allowed: true,
        },
      }));
    }
  };

  renderAllowStatus(rowData) {
    if (rowData.allowed) return 'Có';
    return 'Không';
  }

  render() {
    const { role, privilegesLoading, privilegesData } = this.props;

    return (
      <RoleTabContent
        tableRef={ref => {
          this.tableRef = ref;
        }}
        tableEditRef={ref => {
          this.tableEditRef = ref;
        }}
        data={this.mapPropsToData(role.roleAccessPrivileges, privilegesData)}
        columns={this.mapPropsToColumns(privilegesData)}
        isLoading={privilegesLoading}
        initialFormData={this.fromData()}
        onRowAdd={this.handleRowAdd}
        onRowUpdate={this.handleRowUpdate}
        onRowDelete={this.handleRowDelete}
        showConfirm={this.props.showConfirm}
      />
    );
  }
}

RoleAccessPrivilege.propTypes = {
  role: PropTypes.object,
  privilegesLoading: PropTypes.bool,
  privilegesData: PropTypes.array,
  onRoleChange: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

RoleAccessPrivilege.defaultProps = {
  role: {
    roleAccessPrivileges: [],
  },
  privilegesLoading: false,
  privilegesData: [],
};
