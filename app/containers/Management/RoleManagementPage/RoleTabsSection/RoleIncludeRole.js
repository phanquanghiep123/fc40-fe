import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import RoleTabContent from './RoleTabContent';

export default class RoleIncludeRole extends React.Component {
  tableRef = null;

  tableEditRef = null;

  mapPropsToData(roleIncludes, rolesData) {
    const results = [];

    if (
      rolesData &&
      roleIncludes &&
      rolesData.length > 0 &&
      roleIncludes.length > 0
    ) {
      for (let i = 0, len = roleIncludes.length; i < len; i += 1) {
        const role = roleIncludes[i];
        const newRole = this.findRoleById(rolesData, role.masterRoleId);

        if (newRole) {
          results.push(this.fromData(newRole));
        }
      }
    }

    return results;
  }

  mapPropsToColumns(rolesData) {
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
            options={rolesData}
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
        width: '38vw',
        render: rowData => rowData.name,
      },
      {
        title: 'Diễn Giải',
        width: '38vw',
        render: rowData => rowData.description,
      },
    ];
  }

  getRole(data) {
    const result = {};

    result.masterRoleId = data.roleId;

    return result;
  }

  fromData(data) {
    return {
      roleId: data && data.roleId ? data.roleId : 0,
      value: data && data.value ? data.value : '',
      name: data && data.name ? data.name : '',
      description: data && data.description ? data.description : '',
    };
  }

  findRoleById(roles, roleId) {
    if (roles && roles.length > 0) {
      return roles.find(data => data.roleId === roleId);
    }
    return null;
  }

  getMasterRoles(datas, roleId) {
    let results = [];

    if (datas && datas.length > 0) {
      results = datas.filter(role => role.roleId !== roleId && role.isMaster);
    }

    return results;
  }

  validBeforeChange = rowData => {
    const { role } = this.props;
    const { roleIncludes } = role;

    const foundData = roleIncludes.find(
      item => item.masterRoleId === rowData.roleId,
    );

    if (foundData) {
      this.props.showWarning('Đã tồn tại trong danh sách');
      return false;
    }
    return true;
  };

  handleRowAdd = rowData => {
    const { role } = this.props;
    const { roleIncludes } = role;

    roleIncludes.unshift(this.getRole(rowData));

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, roleIncludes });
    }
  };

  handleRowUpdate = (rowData, oldData) => {
    const { role } = this.props;
    const { roleIncludes } = role;

    const rowIndex = roleIncludes.findIndex(
      item => item.masterRoleId === oldData.roleId,
    );
    if (rowIndex !== -1) {
      roleIncludes.splice(rowIndex, 1, this.getRole(rowData));

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, roleIncludes });
      }
    }
  };

  handleRowDelete = rowData => {
    const { role } = this.props;
    const { roleIncludes } = role;

    const rowIndex = roleIncludes.findIndex(
      item => item.masterRoleId === rowData.roleId,
    );
    if (rowIndex !== -1) {
      roleIncludes.splice(rowIndex, 1);

      if (this.props.onRoleChange) {
        this.props.onRoleChange({ ...role, roleIncludes });
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

  render() {
    const { role, rolesLoading, rolesData } = this.props;

    const filteredRoles = this.getMasterRoles(rolesData, role.roleId);

    return (
      <RoleTabContent
        tableRef={ref => {
          this.tableRef = ref;
        }}
        tableEditRef={ref => {
          this.tableEditRef = ref;
        }}
        data={this.mapPropsToData(role.roleIncludes, filteredRoles)}
        columns={this.mapPropsToColumns(filteredRoles)}
        isLoading={rolesLoading}
        initialFormData={this.fromData()}
        onRowAdd={this.handleRowAdd}
        onRowUpdate={this.handleRowUpdate}
        onRowDelete={this.handleRowDelete}
        showConfirm={this.props.showConfirm}
      />
    );
  }
}

RoleIncludeRole.propTypes = {
  role: PropTypes.object,
  rolesLoading: PropTypes.bool,
  rolesData: PropTypes.array,
  onRoleChange: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

RoleIncludeRole.defaultProps = {
  role: {
    roleIncludes: [],
  },
  rolesLoading: false,
  rolesData: [],
};
