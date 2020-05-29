import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { showWarning } from 'containers/App/actions';

import ConfirmationDialog from 'components/ConfirmationDialog';

import saga from './saga';
import reducer from './reducer';
import { makeSelectLoading, makeSelectData } from './selectors';
import {
  createRole,
  cloneRole,
  updateRole,
  deleteRole,
  saveRole,
} from './actions';
import {
  roleRoutine,
  rolesRoutine,
  usersRoutine,
  regionOrgsRoutine,
  privilegesRoutine,
} from './routines';

import RoleTableSection from './RoleTableSection';
import RoleTabsSection from './RoleTabsSection';

export const styles = theme => ({
  main: {
    position: 'relative',
    width: '100%',
    // height: '100%',
  },
  pageTitle: {
    fontWeight: '500',
    paddingBottom: theme.spacing.unit * 4,
  },
});

export class RoleManagementPage extends React.Component {
  isEditing = false;

  confirmRef = null;

  componentDidMount() {
    this.props.fetchRoles();
  }

  isExistUsers() {
    const { usersData } = this.props;
    if (usersData && usersData.length > 0) {
      return false;
    }
    return true;
  }

  isExistPrivileges() {
    const { privilegesData } = this.props;
    if (privilegesData && privilegesData.length > 0) {
      return false;
    }
    return true;
  }

  isExistRegionOrgs() {
    const { regionsData, organizationsData } = this.props;
    if (
      (regionsData && regionsData.length > 0) ||
      (organizationsData && organizationsData.length > 0)
    ) {
      return false;
    }
    return true;
  }

  onShowConfirm = options => {
    if (this.confirmRef) this.confirmRef.showConfirm(options);
  };

  handleRowEditing = isEditing => {
    this.isEditing = isEditing;
  };

  handleTabSelected = tabData => {
    if (tabData && tabData.key) {
      switch (tabData.key) {
        case 'users': {
          if (this.isExistUsers()) {
            this.props.fetchUsers();
          }
          break;
        }
        case 'privileges': {
          if (this.isExistPrivileges()) {
            this.props.fetchPrivileges();
          }
          break;
        }
        case 'regionOrgs': {
          if (this.isExistRegionOrgs()) {
            this.props.fetchRegionOrgs();
          }
          break;
        }
        default:
          break;
      }
    }
  };

  handleRowSelected = (roleId, force = false) => {
    if (
      this.props.roleData &&
      (this.props.roleData.roleId !== roleId || force)
    ) {
      this.props.fetchRole(roleId);
    }
  };

  render() {
    const {
      classes,
      roleLoading,
      roleData,
      rolesLoading,
      rolesData,
      usersLoading,
      usersData,
      privilegesLoading,
      privilegesData,
      regionOrgsLoading,
      regionsData,
      organizationsData,
    } = this.props;

    return (
      <section className={classes.main}>
        <Typography variant="h5" className={classes.pageTitle}>
          Quản Lý Phân Quyền
        </Typography>
        <RoleTableSection
          loading={rolesLoading}
          data={rolesData}
          clearRole={this.props.onRoleClear}
          onRowAdd={this.props.onRoleAdd}
          onRowClone={this.props.onRoleClone}
          onRowUpdate={this.props.onRoleUpdate}
          onRowDelete={this.props.onRoleDelete}
          onRowEditing={this.handleRowEditing}
          onRowSelected={this.handleRowSelected}
          showConfirm={this.onShowConfirm}
          showWarning={this.props.showWarning}
        />
        <RoleTabsSection
          loading={roleLoading}
          data={roleData}
          usersLoading={usersLoading}
          usersData={usersData}
          rolesLoading={rolesLoading}
          rolesData={rolesData}
          privilegesLoading={privilegesLoading}
          privilegesData={privilegesData}
          regionOrgsLoading={regionOrgsLoading}
          regionsData={regionsData}
          organizationsData={organizationsData}
          onSave={this.props.onRoleSave}
          onTabSelected={this.handleTabSelected}
          showConfirm={this.onShowConfirm}
          showWarning={this.props.showWarning}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </section>
    );
  }
}

RoleManagementPage.propTypes = {
  classes: PropTypes.object.isRequired,
  roleLoading: PropTypes.bool,
  roleData: PropTypes.object,
  rolesLoading: PropTypes.bool,
  rolesData: PropTypes.array,
  usersLoading: PropTypes.bool,
  usersData: PropTypes.array,
  privilegesLoading: PropTypes.bool,
  privilegesData: PropTypes.array,
  regionOrgsLoading: PropTypes.bool,
  regionsData: PropTypes.array,
  organizationsData: PropTypes.array,
  fetchRole: PropTypes.func,
  fetchRoles: PropTypes.func,
  fetchUsers: PropTypes.func,
  fetchRegionOrgs: PropTypes.func,
  fetchPrivileges: PropTypes.func,
  onRoleAdd: PropTypes.func,
  onRoleClear: PropTypes.func,
  onRoleClone: PropTypes.func,
  onRoleUpdate: PropTypes.func,
  onRoleDelete: PropTypes.func,
  onRoleSave: PropTypes.func,
  showWarning: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  fetchRole: roleId => dispatch(roleRoutine.request(roleId)),
  fetchRoles: () => dispatch(rolesRoutine.request()),
  fetchUsers: () => dispatch(usersRoutine.request()),
  fetchRegionOrgs: () => dispatch(regionOrgsRoutine.request()),
  fetchPrivileges: () => dispatch(privilegesRoutine.request()),
  onRoleAdd: (roleData, callback) => dispatch(createRole(roleData, callback)),
  onRoleClear: () => dispatch(roleRoutine.success({ data: {} })),
  onRoleClone: (roleData, callback) => dispatch(cloneRole(roleData, callback)),
  onRoleUpdate: roleData => dispatch(updateRole(roleData)),
  onRoleDelete: (roleData, callback) =>
    dispatch(deleteRole(roleData.roleId, callback)),
  onRoleSave: roleData => dispatch(saveRole(roleData)),
  showWarning: message => dispatch(showWarning(message)),
});

const mapStateToProps = createStructuredSelector({
  roleLoading: makeSelectLoading('role'),
  roleData: makeSelectData('role'),
  rolesLoading: makeSelectLoading('roles'),
  rolesData: makeSelectData('roles'),
  usersLoading: makeSelectLoading('users'),
  usersData: makeSelectData('users'),
  privilegesLoading: makeSelectLoading('privileges'),
  privilegesData: makeSelectData('privileges'),
  regionOrgsLoading: makeSelectLoading('regionorgs'),
  regionsData: makeSelectData('regionorgs', 'regions'),
  organizationsData: makeSelectData('regionorgs', 'organizations'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'roleManagement', reducer });
const withSaga = injectSaga({ key: 'roleManagement', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withImmutablePropsToJS(withStyles(styles)(RoleManagementPage)));
