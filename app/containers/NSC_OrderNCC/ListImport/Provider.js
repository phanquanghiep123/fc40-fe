import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Provider } from './context';

import { masterRoutine, importFilesRoutine } from './routines';

export class StateProvider extends React.Component {
  componentDidMount() {
    this.setRef(this);

    const isReset =
      this.props.history.location.state &&
      this.props.history.location.state.isFromMenu;

    this.props.history.replace(this.props.history.location.pathname, {
      ...this.props.history.location.state,
      isFromMenu: false,
    });

    this.props.onGetInitMaster(isReset, () => {
      this.onGetImportFiles();
    });
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.onRef) {
      this.props.onRef(ref);
    }
  }

  getContext() {
    return {
      onGetImportFiles: this.onGetImportFiles,
    };
  }

  onGetImportFiles = (values = this.props.formik.values) => {
    this.props.onGetImportFiles(values);
  };

  render() {
    const context = this.getContext();

    return (
      <Provider value={context}>
        {this.props.children ? this.props.children : null}
      </Provider>
    );
  }
}

StateProvider.propTypes = {
  onRef: PropTypes.func,
  formik: PropTypes.object,
  history: PropTypes.object,
  children: PropTypes.node,
  onGetInitMaster: PropTypes.func,
  onGetImportFiles: PropTypes.func,
};

StateProvider.defaultProps = {};

export const mapStateToProps = null;

export const mapDispatchToProps = dispatch => ({
  onGetInitMaster: (isReset, callback) =>
    dispatch(masterRoutine.request({ isReset, callback })),
  onGetImportFiles: params => dispatch(importFilesRoutine.request({ params })),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(StateProvider);
