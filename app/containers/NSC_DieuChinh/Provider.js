import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { Provider } from './context';

import { masterRoutine, receiptsRoutine } from './routines';

export class StateProvider extends React.Component {
  componentDidMount() {
    this.setRef(this);
    this.props.onGetInitMaster(() => {
      this.onGetReceipts();
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

  getContext = () => ({
    onGetReceipts: this.onGetReceipts,
  });

  changePagination = pagination => {
    const updaterData = {
      ...pagination,
    };
    this.props.formik.updateValues(updaterData);
  };

  onGetReceipts = (values = this.props.formik.values) => {
    this.props.onGetReceipts(values, this.changePagination);
  };

  onExportReceipts = values => {
    this.props.onExportReceipts(values);
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
  formik: PropTypes.object,
  children: PropTypes.node,
  onRef: PropTypes.func,
  onGetInitMaster: PropTypes.func,
  onGetReceipts: PropTypes.func,
  onExportReceipts: PropTypes.func,
};

StateProvider.defaultProps = {};

export const mapStateToProps = null;

export const mapDispatchToProps = dispatch => ({
  onGetInitMaster: callback => dispatch(masterRoutine.request({ callback })),
  onGetReceipts: (params, callback) =>
    dispatch(receiptsRoutine.request({ params, callback })),
  onExportReceipts: (params, callback) =>
    dispatch(receiptsRoutine.editingRequest({ params, callback })),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StateProvider);
