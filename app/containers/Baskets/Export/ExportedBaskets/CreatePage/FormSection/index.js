import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect/lib/index';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as selectors from '../selectors';
import * as actions from '../actions';
import FormCreate from './FormCreate';
import FormEdit from './FormEdit';
import { TYPE_FORM } from '../constants';
import FormView from './FormView';

// eslint-disable-next-line react/prefer-stateless-function
export class FormSection extends React.PureComponent {
  render() {
    const { typeForm } = this.props;
    return (
      <React.Fragment>
        {typeForm === TYPE_FORM.CREATE && <FormCreate {...this.props} />}
        {typeForm === TYPE_FORM.EDIT && <FormEdit {...this.props} />}
        {typeForm === TYPE_FORM.VIEW && <FormView {...this.props} />}
      </React.Fragment>
    );
  }
}

FormSection.propTypes = {
  // classes: PropTypes.object.isRequired,
  // ui: PropTypes.object,
  onChangeType: PropTypes.func,
  formOption: PropTypes.object,
  isDisabled: PropTypes.bool,
  onChangeDelivery: PropTypes.func,
  onGetDeliveryOrder: PropTypes.func,
  onChangeUser: PropTypes.func,
  onGetPlants: PropTypes.func,
  config: PropTypes.object,
  dataValues: PropTypes.object,
  typeForm: PropTypes.string,
  typeExported: PropTypes.number,
  onExportPdf: PropTypes.func,
  onResetBasketsDetail: PropTypes.func,
  onResetDeliveryOrder: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  formOption: selectors.formOptions(),
  config: selectors.configData(),
  dataValues: selectors.dataValues(),
  typeExported: selectors.typeExported(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeType: payload => dispatch(actions.changeType(payload)),
    onGetPlants: (inputValue, typeExported, callback) =>
      dispatch(actions.getReceiverPlant(inputValue, typeExported, callback)),
    onChangeField: payload => dispatch(actions.changeField(payload)),
    onChangeDelivery: payload => dispatch(actions.changeDelivery(payload)),
    onChangeUser: payload => dispatch(actions.changeUser(payload)),
    onGetDeliveryOrder: (
      inputValue,
      receiverCode,
      deliveryCode,
      subType,
      callback,
    ) =>
      dispatch(
        actions.getDelivery(
          inputValue,
          receiverCode,
          deliveryCode,
          subType,
          callback,
        ),
      ),
    onExportPdf: formValues => dispatch(actions.exportPdf(formValues)),
    onResetBasketsDetail: () => dispatch(actions.resetBasketsDetail()),
    onResetDeliveryOrder: () => dispatch(actions.resetDeliveryOrder()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJs,
  // withStyles(style()),
)(FormSection);
