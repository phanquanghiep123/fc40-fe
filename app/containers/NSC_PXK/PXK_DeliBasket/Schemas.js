import * as Yup from 'yup';

// Schema for table row
export const TableRowSchema = Yup.object().shape({
  storeCode: Yup.string(),
  storeName: Yup.string(),
  route: Yup.string(),
  basketName1: Yup.string()
    .nullable()
    .test('duplicate khay sot', 'Khay sọt đã chọn', function(value) {
      const { basketName2, basketName3 } = this.parent;
      if (!value || (!basketName2 && !basketName3)) return true;
      return !(value === basketName2 || value === basketName3);
    }),
  quantity1: Yup.number()
    .nullable()
    .when('basketName1', {
      is: val => !!val,
      then: Yup.number()
        .typeError('Phải là số nguyên dương')
        .integer('Phải là số nguyên dương')
        .min(0, 'Phải là số nguyên dương')
        .required('Trường bắt buộc'),
    }),
  basketName2: Yup.string()
    .nullable()
    .test('duplicate khay sot', 'Khay sọt đã chọn', function(value) {
      const { basketName1, basketName3 } = this.parent;
      if (!value || (!basketName1 && !basketName3)) return true;
      return !(value === basketName1 || value === basketName3);
    }),
  quantity2: Yup.number()
    .nullable()
    .when('basketName2', {
      is: val => !!val,
      then: Yup.number()
        .typeError('Phải là số nguyên dương')
        .integer('Phải là số nguyên dương')
        .min(0, 'Phải là số nguyên dương')
        .required('Trường bắt buộc'),
    }),
  basketName3: Yup.string()
    .nullable()
    .test('duplicate khay sot', 'Khay sọt đã chọn', function(value) {
      const { basketName1, basketName2 } = this.parent;
      if (!value || (!basketName1 && !basketName2)) return true;
      return !(value === basketName1 || value === basketName2);
    }),
  quantity3: Yup.number()
    .nullable()
    .when('basketName3', {
      is: val => !!val,
      then: Yup.number()
        .typeError('Phải là số nguyên dương')
        .integer('Phải là số nguyên dương')
        .min(0, 'Phải là số nguyên dương')
        .required('Trường bắt buộc'),
    }),
});

// Schema for the whole formik
export const FormikGeneralSchema = Yup.object().shape({
  org: Yup.string(),
  pickingDate: Yup.date(),
  routeFrom: Yup.object().nullable(),
  routeTo: Yup.object().nullable(),
  storeName: Yup.string(),
  defaultBasket: Yup.object().nullable(),

  // table
  tableData: Yup.array()
    .transform(value => {
      const results = [];
      Array(value.length)
        .fill(null)
        .forEach((_, index) => {
          results[index] = value[index] || TableRowSchema.cast({});
        });

      return results;
    })
    .of(TableRowSchema)
    .default([]),
});
