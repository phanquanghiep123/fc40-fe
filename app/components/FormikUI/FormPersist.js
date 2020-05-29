import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { connect } from 'formik';

/**
 * @see https://github.com/jaredpalmer/formik-persist
 */
export class FormPersist extends React.Component {
  componentDidMount() {
    const formikState = sessionStorage.getItem(this.props.name);
    if (formikState !== null) {
      this.props.formik.setFormikState(JSON.parse(formikState));
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik);
    }
  }

  saveForm = debounce(data => {
    sessionStorage.setItem(this.props.name, JSON.stringify(data));
  }, this.props.debounce);

  render() {
    return null;
  }
}

FormPersist.propTypes = {
  name: PropTypes.string,
  formik: PropTypes.object,
  debounce: PropTypes.number,
};

FormPersist.defaultProps = {
  debounce: 300,
};

export default connect(FormPersist);
