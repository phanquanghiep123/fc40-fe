import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import AssetsTable from './AssetsTable';
import BasketsTable from './BasketsTable';
import { TYPE_FORM } from '../constants';
import { getUrlParams } from '../../../../../App/utils';
import './agGridOverride.css';

class PXKSCancelReceipt extends React.Component {
  componentDidMount() {}

  render() {
    const { formik, history } = this.props;
    const { form } = getUrlParams(history);

    const pageType = {
      create: form === TYPE_FORM.CREATE,
      edit: form === TYPE_FORM.EDIT,
      view: form === TYPE_FORM.VIEW,
    };

    return (
      <>
        <BasketsTable formik={formik} pageType={pageType} />
        <AssetsTable formik={formik} pageType={pageType} />
      </>
    );
  }
}
PXKSCancelReceipt.propTypes = {
  formik: PropTypes.object,
  history: PropTypes.object,
};

export default compose(withRouter)(PXKSCancelReceipt);
