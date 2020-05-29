import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  tableData: Yup.array().of(
    Yup.object().shape({
      productionOrderCode: Yup.string()
        .when('editting', (editting, schema) => {
          if (editting) {
            return schema.required('Cần nhập giá trị');
          }
          return schema;
        })
        .nullable(),
      quantityType1: Yup.number()
        .when('editting', (editting, schema) => {
          if (editting) {
            return schema
              .required('Cần nhập giá trị')
              .min(0.000001, 'Sản lượng L1 phải lớn hơn 0');
          }
          return schema;
        })
        .typeError('Sản Lượng L1 phải là số'),
      allocationRateQuantityType1: Yup.number()
        .when('editting', (editting, schema) => {
          if (editting) {
            return schema
              .required('Cần nhập giá trị')
              .min(0, 'Tỉ lệ phân bổ phải lớn hơn 0 và nhỏ hơn hoặc bằng 100')
              .max(
                1,
                'Tỉ lệ  phân bổ  phải lớn hơn 0 và nhỏ hơn hoặc bằng 100',
              );
          }
          return schema;
        })
        .typeError('Tỉ lệ phân bổ phải là số'),
      recoveryRate: Yup.number()
        .when('editting', (editting, schema) => {
          if (editting) {
            return schema
              .required('Cần nhập giá trị')
              .min(
                0.001,
                'Tỉ lệ thu hồi phải lớn hơn 0 và nhỏ hơn hoặc bằng 100',
              )
              .max(
                1.01,
                'Tỉ lệ thu hồi phải lớn hơn 0 và nhỏ hơn hoặc bằng 100',
              );
          }
          return schema;
        })
        .typeError('Tỉ lệ thu hồi phải là số')
        .nullable(),
    }),
  ),
});
