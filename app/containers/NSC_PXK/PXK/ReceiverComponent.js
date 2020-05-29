import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import SelectControl from 'components/SelectControl';

function ReceiverComponent({ formik, disabled, receiverUnits }) {
  return (
    <Field
      name="receiverCode"
      label="Đơn Vị Nhận Hàng"
      component={SelectControl}
      onChange={e => {
        formik.handleChange(e);
        formik.setFieldValue('receiverName', e.currentTarget.innerText);
      }}
      disabled={disabled}
    >
      {receiverUnits.map(type => (
        <MenuItem value={type.id} key={type.id}>
          {type.name}
        </MenuItem>
      ))}
    </Field>
  );
}

ReceiverComponent.propTypes = {
  formik: PropTypes.object,
  disabled: PropTypes.object,
  receiverUnits: PropTypes.array,
};

export default ReceiverComponent;
