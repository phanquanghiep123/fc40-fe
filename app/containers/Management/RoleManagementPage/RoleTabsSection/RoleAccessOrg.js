import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import RoleTabContent from './RoleTabContent';

const ALL = 'ALL';

export default class RoleAccessOrg extends React.Component {
  tableRef = null;

  tableEditRef = null;

  isSelectedALL = false;

  mapPropsToData(accessRegionOrgs, regionOrgsData) {
    let results = [];

    if (
      regionOrgsData &&
      accessRegionOrgs &&
      regionOrgsData.length > 0 &&
      accessRegionOrgs.length > 0
    ) {
      for (let i = 0, len = accessRegionOrgs.length; i < len; i += 1) {
        const data = accessRegionOrgs[i];
        const newData = this.findDataById(regionOrgsData, data);

        if (newData) {
          newData.allowed = data.allowed;
          results.push(this.fromData(newData));
        }
      }
    }

    if (
      regionOrgsData &&
      regionOrgsData.length > 0 &&
      results.length === regionOrgsData.length
    ) {
      results = [
        {
          regionId: 0,
          organizationId: 0,
          value: ALL,
          name: 'Toàn bộ',
          allowed: true,
        },
      ];
      this.isSelectedALL = true;
    } else {
      this.isSelectedALL = false;
    }

    return results;
  }

  mapPropsToColumns(regionsData, organizationsData) {
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
            options={[
              {
                regionId: 0,
                organizationId: 0,
                value: ALL,
                name: 'Toàn bộ',
                allowed: true,
              },
              ...regionsData,
              ...organizationsData,
            ]}
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

  getFull(regionOrgsData) {
    const results = [];

    if (regionOrgsData && regionOrgsData.length > 0) {
      for (let i = 0; i < regionOrgsData.length; i += 1) {
        const regionOrg = regionOrgsData[i];

        regionOrg.allowed = true;

        if (regionOrg.organizationId) {
          results.push(this.getOrganization(regionOrg));
        } else if (regionOrg.regionId) {
          results.push(this.getRegion(regionOrg));
        }
      }
    }

    return results;
  }

  getRegion(data) {
    const result = {};

    result.regionId = data.regionId;
    result.allowed = data.allowed;

    return result;
  }

  getOrganization(data) {
    const result = {};

    result.organizationId = data.organizationId;
    result.allowed = data.allowed;

    return result;
  }

  fromData(data) {
    return {
      regionId: data && data.regionId ? data.regionId : 0,
      organizationId: data && data.organizationId ? data.organizationId : 0,
      value: data && data.value ? data.value : '',
      name: data && data.name ? data.name : '',
      allowed: data ? data.allowed : true,
    };
  }

  findDataById(datas, data) {
    if (datas && datas.length > 0) {
      if (data.organizationId) {
        return datas.find(item => item.organizationId === data.organizationId);
      }
      if (data.regionId) {
        return datas.find(item => item.regionId === data.regionId);
      }
    }
    return null;
  }

  validBeforeChange = rowData => {
    const { role } = this.props;
    const { roleAccessRegionOrgs } = role;

    let foundData = null;

    if (rowData.organizationId) {
      foundData = roleAccessRegionOrgs.find(
        data => data.organizationId === rowData.organizationId,
      );
    } else if (rowData.regionId) {
      foundData = roleAccessRegionOrgs.find(
        data => data.regionId === rowData.regionId,
      );
    }

    if (foundData) {
      if (this.isSelectedALL) {
        this.props.showWarning('Không thể thêm mới khi ALL đã lựa chọn');
      } else {
        this.props.showWarning('Đã tồn tại trong danh sách');
      }
      return false;
    }
    return true;
  };

  handleRowAdd = rowData => {
    const { role, regionsData, organizationsData } = this.props;
    let { roleAccessRegionOrgs } = role;

    if (rowData.value === ALL) {
      roleAccessRegionOrgs = this.getFull([
        ...regionsData,
        ...organizationsData,
      ]);
    } else if (rowData.organizationId) {
      roleAccessRegionOrgs.unshift(this.getOrganization(rowData));
    } else if (rowData.regionId) {
      roleAccessRegionOrgs.unshift(this.getRegion(rowData));
    }

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, roleAccessRegionOrgs });
    }
  };

  handleRowUpdate = (rowData, oldData) => {
    const { role, regionsData, organizationsData } = this.props;
    let { roleAccessRegionOrgs } = role;

    if (oldData.value === ALL) {
      if (rowData.organizationId) {
        roleAccessRegionOrgs = [this.getOrganization(rowData)];
      } else if (rowData.regionId) {
        roleAccessRegionOrgs = [this.getRegion(rowData)];
      }
    } else if (rowData.value === ALL) {
      roleAccessRegionOrgs = this.getFull([
        ...regionsData,
        ...organizationsData,
      ]);
    } else {
      const rowIndex = roleAccessRegionOrgs.findIndex(item => {
        if (oldData.organizationId) {
          return item.organizationId === oldData.organizationId;
        }
        if (oldData.regionId) {
          return item.regionId === oldData.regionId;
        }
        return false;
      });

      if (rowIndex !== -1) {
        if (rowData.organizationId) {
          roleAccessRegionOrgs.splice(
            rowIndex,
            1,
            this.getOrganization(rowData),
          );
        } else if (rowData.regionId) {
          roleAccessRegionOrgs.splice(rowIndex, 1, this.getRegion(rowData));
        }
      }
    }

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, roleAccessRegionOrgs });
    }
  };

  handleRowDelete = rowData => {
    const { role } = this.props;
    let { roleAccessRegionOrgs } = role;

    if (rowData.value === ALL) {
      roleAccessRegionOrgs = [];
    } else {
      const rowIndex = roleAccessRegionOrgs.findIndex(item => {
        if (rowData.organizationId) {
          return item.organizationId === rowData.organizationId;
        }
        if (rowData.regionId) {
          return item.regionId === rowData.regionId;
        }
        return false;
      });

      if (rowIndex !== -1) {
        roleAccessRegionOrgs.splice(rowIndex, 1);
      }
    }

    if (this.props.onRoleChange) {
      this.props.onRoleChange({ ...role, roleAccessRegionOrgs });
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
    const {
      role,
      regionOrgsLoading,
      regionsData,
      organizationsData,
    } = this.props;

    return (
      <RoleTabContent
        tableRef={ref => {
          this.tableRef = ref;
        }}
        tableEditRef={ref => {
          this.tableEditRef = ref;
        }}
        data={this.mapPropsToData(role.roleAccessRegionOrgs, [
          ...regionsData,
          ...organizationsData,
        ])}
        columns={this.mapPropsToColumns(regionsData, organizationsData)}
        isLoading={regionOrgsLoading}
        initialFormData={this.fromData()}
        onRowAdd={this.handleRowAdd}
        onRowUpdate={this.handleRowUpdate}
        onRowDelete={this.handleRowDelete}
        showConfirm={this.props.showConfirm}
      />
    );
  }
}

RoleAccessOrg.propTypes = {
  role: PropTypes.object,
  regionOrgsLoading: PropTypes.bool,
  regionsData: PropTypes.array,
  organizationsData: PropTypes.array,
  onRoleChange: PropTypes.func,
  showConfirm: PropTypes.func,
  showWarning: PropTypes.func,
};

RoleAccessOrg.defaultProps = {
  role: {
    roleAccessRegions: [],
    roleAccessOrgs: [],
    roleAccessRegionOrgs: [],
  },
  regionOrgsLoading: false,
  regionsData: [],
  organizationsData: [],
};
