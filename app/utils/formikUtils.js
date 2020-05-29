import has from 'lodash/has';

import { getIn } from 'formik';

export const updateValues = formik => updater => {
  if (formik && formik.values) {
    formik.setValues({ ...formik.values, ...updater });
  }
};

export const updateFieldValue = formik => (
  field,
  updater,
  shouldValidate = true,
) => {
  if (formik && has(formik.values, field)) {
    const value = getIn(formik.values, field);

    if (Array.isArray(value)) {
      formik.setFieldValue(field, updater, shouldValidate);
    } else {
      const nextValue = {
        ...value,
        ...updater,
      };
      formik.setFieldValue(field, nextValue, shouldValidate);
    }
  }
};

export const updateFieldArrayValue = formik => (
  field,
  index,
  updater,
  shouldValidate = true,
) => {
  if (formik && has(formik.values, field)) {
    const value = getIn(formik.values, field);

    if (Array.isArray(value)) {
      const nextValue = value.slice();

      if (!nextValue[index]) {
        nextValue[index] = {};
      }

      nextValue[index] = {
        ...nextValue[index],
        ...updater,
      };

      formik.setFieldValue(field, nextValue, shouldValidate);
    }
  }
};

export default formik => ({
  updateValues: updateValues(formik),
  updateFieldValue: updateFieldValue(formik),
  updateFieldArrayValue: updateFieldArrayValue(formik),
});
