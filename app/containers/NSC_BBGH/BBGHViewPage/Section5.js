import PropTypes from 'prop-types';
import Section5 from '../BBGHCreatePage/Section5';

export class ShippingPartyInformation extends Section5 {
  isCreate = () => false;
}

ShippingPartyInformation.propTypes = {
  formik: PropTypes.object,
};

export default ShippingPartyInformation;
