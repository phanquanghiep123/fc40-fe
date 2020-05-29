import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { alertInvalidWhenSubmit } from 'containers/App/actions';
import UserModal from './UserModal';
import saga from './saga';
import reducer from './reducer';
import { makeSelectUserInitialSchema } from './selectors';
import {
  verifyUsername,
  submitUser,
  getUserById,
  initCreateUserForm,
} from './actions';

import UserList from './UserList';

class UserManagement extends React.Component {
  dialog = React.createRef();

  userRef = null;

  state = {
    userId: null,
    showDialog: false,
  };

  createUser = () => {
    this.setState({
      showDialog: true,
      userId: null,
    });
    this.props.onInitCreateUserForm();
  };

  updateUser = rowData => {
    const userId = rowData.id;
    this.setState({
      showDialog: true,
      userId,
    });
    this.props.onGetUserById(userId);
  };

  closeDialog = () => {
    this.dialog.current.formik.resetForm();
    this.setState({
      showDialog: false,
      userId: null,
    });
  };

  submitSuccess = () => {
    if (this.userRef) {
      this.userRef.reloadUsers();
    }
  };

  innerRef = node => {
    this.dialog = node;
  };

  render() {
    const {
      ui,
      onVerifyUsername,
      onAlertInvalidWhenSubmit,
      onSubmitUser,
      userInitialSchema,
    } = this.props;
    const { userId, showDialog } = this.state;
    const trueValue = true;
    return (
      <React.Fragment>
        <UserList
          onRef={ref => {
            this.userRef = ref;
          }}
          onCreateUser={this.createUser}
          onUpdateUser={this.updateUser}
        />
        <ui.Dialog
          {...ui.props}
          title={userId !== null ? 'Cập Nhật Tài Khoản' : 'Tạo Tài Khoản'}
          content={
            <UserModal
              onAlertInvalid={onAlertInvalidWhenSubmit}
              verifyUsername={onVerifyUsername}
              onSubmitUser={onSubmitUser}
              userId={userId}
              userInitialSchema={userInitialSchema}
              onCloseDialog={this.closeDialog}
              createUserSuccess={this.submitSuccess}
              innerRef={this.dialog}
            />
          }
          openDl={showDialog}
          isModal
          customActionDialog={trueValue}
        />
      </React.Fragment>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onInitCreateUserForm: () => dispatch(initCreateUserForm()),
    onVerifyUsername: (username, callback) =>
      dispatch(verifyUsername(username, callback)),
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
    onSubmitUser: (user, path, formik, callback) =>
      dispatch(submitUser(user, path, formik, callback)),
    onGetUserById: userId => dispatch(getUserById(userId)),
  };
}

const mapStateToProps = createStructuredSelector({
  userInitialSchema: makeSelectUserInitialSchema(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'userManagement', saga });
const withReducer = injectReducer({ key: 'userManagement', reducer });

export default compose(
  withConnect,
  withSaga,
  withReducer,
)(withImmutablePropsToJS(UserManagement));
