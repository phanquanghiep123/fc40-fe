import has from 'lodash/has';

import { getIn } from 'formik';

/**
 * Kiểm tra trước khi setter cho các column đặc biệt
 *
 * @param {object} params from Ag-grid
 * @param {array}  columns
 *
 * @requires {boolean}
 */
export function validateSetterColumns(params, columns) {
  if (params && columns && columns.length > 0) {
    for (let i = 0, len = columns.length; i < len; i += 1) {
      const colField = columns[i];

      if (colField === params.colDef.field) {
        if (params.newValue) {
          return true;
        }
        return false;
      }
    }
  }
  return true;
}

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

export const updateTouched = formik => updater => {
  if (formik && formik.touched) {
    formik.setTouched({ ...formik.touched, ...updater });
  }
};

export const updateFieldArrayTouched = formik => (
  field,
  index,
  updater,
  shouldValidate = true,
) => {
  if (formik && formik.touched) {
    const touched = getIn(formik.touched, field, []);
    const nextTouched = touched.slice();

    if (!nextTouched[index]) {
      nextTouched[index] = {};
    }

    nextTouched[index] = {
      ...nextTouched[index],
      ...updater,
    };

    formik.setFieldTouched(field, nextTouched, shouldValidate);
  }
};

export const formikPropsHelpers = formik => ({
  // for update values
  updateValues: updateValues(formik),
  updateFieldValue: updateFieldValue(formik),
  updateFieldArrayValue: updateFieldArrayValue(formik),

  // for update touched
  updateTouched: updateTouched(formik),
  updateFieldArrayTouched: updateFieldArrayTouched(formik),
});
