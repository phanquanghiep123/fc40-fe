import React from 'react';
import * as PropTypes from 'prop-types';
import { loadingError } from '../../containers/App/actions';

/**
 * Handle notification on Formik submit
 * If there are any errors, it will show message
 */
class NotifyOnSubmit extends React.Component {
  componentDidUpdate(prevProps) {
    const { formik, dispatch } = this.props;

    if (prevProps.formik.isSubmitting !== formik.isSubmitting) {
      if (prevProps.formik.isSubmitting) {
        this.notifyIfFormIsInvalid(formik, dispatch);
      }
    }
  }

  /**
   * Check && show message if invalid
   * @param formik
   * @param dispatch
   */
  notifyIfFormIsInvalid = (formik, dispatch) => {
    const { message, isIgnored } = this.props;

    if (!isIgnored && Object.keys(formik.errors).length) {
      dispatch(loadingError(message));
    }
  };

  render() {
    return null; // render nothing
  }
}

NotifyOnSubmit.propTypes = {
  formik: PropTypes.object.isRequired, // formik props provided inside Formik render
  dispatch: PropTypes.func.isRequired, // redux dispatch
  message: PropTypes.string,
  isIgnored: PropTypes.bool, // if true => will not show message even when invalid
};

NotifyOnSubmit.defaultProps = {
  message: 'Dữ liệu nhập chưa đủ hoặc không chính xác. Vui lòng kiểm tra lại.',
  isIgnored: false,
};

export default NotifyOnSubmit;
