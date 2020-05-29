import * as Yup from 'yup';
import { addDays } from 'date-fns';
import { isArray } from 'lodash';

export const validSchema = Yup.object().shape({
  date: Yup.mixed().required('Trường này không được bỏ trống'),
  supplyRegion: Yup.string()
    .required('Trường này không được bỏ trống')
    .nullable(),
  name: Yup.string()
    .required('Cần chọn tài liệu định dạng xlsx để tải lên')
    .when(['date', 'supplyRegion'], (date, supplyRegion, schema) => {
      /**
       * @description:
       * convert date object on UI to yyyyMMdd format
       * e.g: today: Tue May 28 2019 17:22:46 GMT+0700 (Indochina Time)
       * to: 20190528
       */
      const dateConvert = date
        .toLocaleDateString('zh-Hans-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(new RegExp('/', 'g'), '');

      return schema.test(
        'is-format',
        `Tài liệu đã chọn không đúng định dạng (CanTong_${supplyRegion}_${dateConvert}_phienban.xlsx)`,
        value => {
          if (!supplyRegion) return true;
          if (!value) return false;
          const fileNames = value.split('_');
          if (!isArray(fileNames) || fileNames.length !== 4) {
            return false;
          }

          return value.indexOf(`CanTong_${supplyRegion}_${dateConvert}`) === 0;
        },
      );
    }),
});

export const initialSchema = {
  date: addDays(new Date(), 1), // Ngày sơ chế
  name: '',
  supplyRegion: '',
  uploadingFile: null, // Upload file
  isCreateDoForProcessor: false, // Có chọn vào Tạo BBGH cho NCC
  isSupplementImportForProcessor: false, // Có chọn vào Import bổ xung NCC
  isImport: true,
};
