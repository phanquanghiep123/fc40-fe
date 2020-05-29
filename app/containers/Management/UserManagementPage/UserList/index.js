import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ConfirmationDialog from 'components/ConfirmationDialog';

import { showWarning } from 'containers/App/actions';

import {
  getRoleAuto,
  assignForUser,
  resetPassword,
  changeLockStatus,
} from '../actions';
import {
  makeSelectData,
  makeSelectLoading,
  makeSelectPagination,
} from '../selectors';
import { rolesRoutine, usersRoutine } from '../routines';

import UserSearch from './UserSearch';
import RolesTable from './RolesTable';
import UsersTable from './UsersTable';

export const styles = theme => ({
  main: {
    position: 'relative',
    width: '100%',
  },
  title: {
    fontWeight: '500',
    paddingBottom: theme.spacing.unit * 4,
  },
});

export class UserList extends React.Component {
  confirmRef = null;

  componentDidMount() {
    this.setRef(this);
    this.reloadUsers(true);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.onRef) {
      this.props.onRef(ref);
    }
  }

  reloadUsers(force = false) {
    this.props.onGetUsers(this.props.usersPagination, force);
  }

  handleShowConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  handleRowSelected = userData => {
    if (userData && userData.id !== this.props.userId) {
      this.props.onGetRoles(userData.id, userData.userName);
    }
  };

  render() {
    const {
      classes,
      userId,
      userName,
      usersData,
      rolesData,
      usersLoading,
      rolesLoading,
      usersPagination,
      onRoleSave,
      onCreateUser,
      onUpdateUser,
      onResetPassword,
      onLockStatusChange,
      onGetRoleAutocomplete,
    } = this.props;

    return (
      <React.Fragment>
        <section className={classes.main}>
          <Typography variant="h5" className={classes.title}>
            Quản Lý Người Dùng
          </Typography>
          <UserSearch
            pagination={usersPagination}
            onGetUsers={this.props.onGetUsers}
          />
          <UsersTable
            datas={usersData}
            loading={usersLoading}
            pagination={usersPagination}
            showConfirm={this.handleShowConfirm}
            showWarning={this.props.showWarning}
            onGetUsers={this.props.onGetUsers}
            onCreateUser={onCreateUser}
            onUpdateUser={onUpdateUser}
            onRowSelected={this.handleRowSelected}
            onResetPassword={onResetPassword}
            onLockStatusChange={onLockStatusChange}
          />
          <RolesTable
            userId={userId}
            userName={userName}
            datas={rolesData}
            loading={rolesLoading}
            onSave={onRoleSave}
            showConfirm={this.handleShowConfirm}
            showWarning={this.props.showWarning}
            onGetRoleAutocomplete={onGetRoleAutocomplete}
          />
        </section>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

UserList.propTypes = {
  onRef: PropTypes.func,
  classes: PropTypes.object.isRequired,
  userId: PropTypes.any,
  userName: PropTypes.string,
  usersData: PropTypes.array,
  rolesData: PropTypes.array,
  usersLoading: PropTypes.bool,
  rolesLoading: PropTypes.bool,
  usersPagination: PropTypes.object,
  onGetRoles: PropTypes.func,
  onGetUsers: PropTypes.func,
  onRoleSave: PropTypes.func,
  showWarning: PropTypes.func,
  onCreateUser: PropTypes.func,
  onUpdateUser: PropTypes.func,
  onResetPassword: PropTypes.func,
  onLockStatusChange: PropTypes.func,
  onGetRoleAutocomplete: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  onGetRoles: (userId, userName) =>
    dispatch(rolesRoutine.request({ userId, userName })),
  onGetUsers: (params, force) =>
    dispatch(usersRoutine.request({ force, params })),
  onRoleSave: (userId, roleIds) => dispatch(assignForUser(userId, roleIds)),
  showWarning: message => dispatch(showWarning(message)),
  onResetPassword: updater => dispatch(resetPassword(updater)),
  onLockStatusChange: userIds => dispatch(changeLockStatus(userIds)),
  onGetRoleAutocomplete: (inputText, callback) =>
    dispatch(getRoleAuto(inputText, callback)),
});

const mapStateToProps = createStructuredSelector({
  userId: makeSelectData('roles', 'userId'),
  userName: makeSelectData('roles', 'userName'),
  usersData: makeSelectData('users'),
  rolesData: makeSelectData('roles'),
  usersLoading: makeSelectLoading('users'),
  rolesLoading: makeSelectLoading('roles'),
  usersPagination: makeSelectPagination('users'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(
  withImmutablePropsToJS(withStyles(styles)(UserList)),
);
