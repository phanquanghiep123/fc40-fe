import * as Yup from 'yup';

export const makeFormSchema = tableData =>
  Yup.object().shape({
    org: Yup.object()
      .required('Trường bắt buộc')
      .nullable(),
    date: Yup.string()
      .required('Trường bắt buộc')
      .nullable(),
    customer: Yup.object()
      .required('Trường bắt buộc')
      .nullable(),
    isCreatingReceipt: Yup.bool(), // true => khi click button tạo phiếu xuất bán
    soldToVinmart: Yup.object()
      .nullable()
      .when('isCreatingReceipt', (isCreatingReceipt, schema) => {
        if (isCreatingReceipt && tableData[0] && tableData[0].requireVM) {
          return schema.required('Trường bắt buộc khi tạo phiếu');
        }
        return schema;
      })
      .test('check duplicate', 'Trùng giá trị', function(value) {
        const { isCreatingReceipt, soldToVinmartPlus } = this.parent;
        if (!isCreatingReceipt || !value || !soldToVinmartPlus) return true;
        return value.value !== soldToVinmartPlus.value;
      }),
    soldToVinmartPlus: Yup.object()
      .nullable()
      .when('isCreatingReceipt', (isCreatingReceipt, schema) => {
        if (isCreatingReceipt && tableData[0] && tableData[0].requireVMP) {
          return schema.required('Trường bắt buộc khi tạo phiếu');
        }
        return schema;
      })
      .test('check duplicate', 'Trùng giá trị', function(value) {
        const { isCreatingReceipt, soldToVinmart } = this.parent;
        if (!isCreatingReceipt || !value || !soldToVinmart) return true;
        return value.value !== soldToVinmart.value;
      }),
  });
