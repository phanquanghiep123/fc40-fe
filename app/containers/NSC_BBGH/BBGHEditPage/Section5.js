import PropTypes from 'prop-types';
import Section5 from '../BBGHCreatePage/Section5';
export class Section5Edit extends Section5 {
  isCreate = () => false;
}

Section5Edit.propTypes = {
  formik: PropTypes.object,
};

export default Section5Edit;
