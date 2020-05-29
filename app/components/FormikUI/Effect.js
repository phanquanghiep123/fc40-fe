import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'formik';

export class Effect extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { values, touched, errors, isSubmitting } = this.props.formik;
    const {
      values: nextValues,
      touched: nextTouched,
      errors: nextErrors,
      isSubmitting: nextIsSubmitting,
    } = nextProps.formik;

    if (nextProps.formik !== this.props.formik) {
      this.props.onChange(
        {
          values,
          touched,
          errors,
          isSubmitting,
        },
        {
          values: nextValues,
          touched: nextTouched,
          errors: nextErrors,
          isSubmitting: nextIsSubmitting,
        },
        nextProps.formik,
      );
    }
  }

  render() {
    return null;
  }
}

Effect.propTypes = {
  formik: PropTypes.object,
  onChange: PropTypes.func,
};

export default connect(Effect);
