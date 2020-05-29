import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import Table from './Table';

export default class Destroy extends React.Component {
  componentDidMount() {}

  render() {
    const { formik, form } = this.props;
    return (
      <Expansion
        title="II.Thông tin sản phẩm xuất kho"
        content={<Table formik={formik} form={form} />}
      />
    );
  }
}
Destroy.propTypes = {
  formik: PropTypes.object,
  form: PropTypes.string,
};
