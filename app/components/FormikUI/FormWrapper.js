import React from 'react';
import PropTypes from 'prop-types';

import moize from 'moize';
import isEmpty from 'lodash/isEmpty';
import debounce from 'debounce-promise';

import { Formik, validateYupSchema, yupToFormErrors } from 'formik';

import FormPersist from './FormPersist';

const validateDebounceMs = 100;
const moizeOptions = {
  isPromise: true,
  isDeepEquals: true,
  maxAge: 60000,
};

// wrap Formik in order to:
//
// - debounce form validation call using debounce-promise
//
// - memoize validation call using moize
//
// - add events:
//
//    - onInvalidSubmission
//    - onSubmit (can return a promise)
//    - onReset
//
class FormWrapper extends React.Component {
  formikState = null;

  // execute yup validation schema, passing initial values and values as
  // context, and return as a resolved result
  handleValidate = values =>
    validateYupSchema(values, this.props.validationSchema, false, {
      initialValues: this.props.initialValues,
      values,
    })
      .then(() => ({}))
      .catch(yupToFormErrors);

  // memoize the promise returned by handleValidate
  moizeValidate = moize(this.handleValidate, moizeOptions);

  // formik wants a rejected promise, but moize doesn't cache rejected promises
  wedgeValidate = v =>
    new Promise((resolve, reject) => this.moizeValidate(v).then(reject));

  // slightly debounce the validation method call
  debounceValidate = debounce(this.wedgeValidate, validateDebounceMs);

  handleSubmit = (value, formik) => {
    // validation passed -- save item and then call setSubmitting(false) to
    // enable submit button
    if (this.props.onSubmit) {
      Promise.resolve(this.props.onSubmit(value, formik)).then(() => {
        formik.setSubmitting(false);
      });
    } else {
      formik.setSubmitting(false);
    }
  };

  // clear memoize cache
  clearMoize = () => this.moizeValidate.clear();

  componentDidMount = this.clearMoize;

  render() {
    return (
      <Formik
        ref={this.props.formikRef}
        isInitialValid={this.props.isInitialValid}
        enableReinitialize={this.props.enableReinitialize}
        onReset={this.props.onReset}
        onSubmit={this.handleSubmit}
        initialValues={this.props.initialValues}
        validate={this.debounceValidate}
        {...this.props.FormikProps}
        render={formik => {
          this.formikState = formik;
          const handleSubmitClick = () => {
            formik.submitForm().then(() => {
              if (!isEmpty(this.formikState.errors)) {
                if (this.props.onInvalidSubmission) {
                  this.props.onInvalidSubmission(this.formikState);
                }
              }
            });
          };

          const handleResetClick = () => {
            formik.resetForm();
            this.clearMoize();
            if (this.props.onReset) {
              this.props.onReset(formik.values, formik);
            }
          };

          return (
            <React.Fragment>
              {this.props.render({
                ...formik,
                handleResetClick,
                handleSubmitClick,
              })}
              {this.props.persist && <FormPersist name={this.props.persist} />}
            </React.Fragment>
          );
        }}
      />
    );
  }
}

FormWrapper.propTypes = {
  render: PropTypes.func.isRequired,
  formikRef: PropTypes.func,
  persist: PropTypes.string,
  FormikProps: PropTypes.object,
  onReset: PropTypes.func,
  onInvalidSubmission: PropTypes.func,
  onSubmit: PropTypes.func,
  validationSchema: PropTypes.object,
  initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableReinitialize: PropTypes.bool,
  isInitialValid: PropTypes.bool,
};

FormWrapper.defaultProps = {
  enableReinitialize: false,
  isInitialValid: false,
};

export default FormWrapper;
