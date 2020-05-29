import * as Yup from 'yup';

import { localstoreUtilites } from 'utils/persistenceData';
import { TYPE_PXK } from './constants';
import pxkFarmTransSchema from '../PXK_FarmTransition/Schema';
import pxkDestroySchema from '../PXK_Destroy/Schema';
import pxkSellSchema from '../PXK_Sell/Schema';

const auth = localstoreUtilites.getAuthFromLocalStorage();

export const SchemaProduct = Yup.object().shape({
  exportedQuantity: Yup.number()
    .required('Cần nhập giá trị cho Mã Sản Phẩm')
    .nullable()
    .default(null),
  locatorNameFrom: Yup.string()
    .nullable()
    .default(null),
  productCode: Yup.string()
    .required('Cần nhập giá trị')
    .nullable()
    .default(''),
  slotCode: Yup.string()
    .nullable()
    .default(''),
  locatorNameTo: Yup.string()
    .required('Kho đích không được bỏ trống')
    .nullable()
    .notOneOf(
      [Yup.ref('locatorNameFrom')],
      'Kho đích không được trùng kho nguồn',
    )
    .default(null),
  // binding
  productName: Yup.string()
    .nullable()
    .default(''),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  uom: Yup.string()
    .nullable()
    .default(''),
});

export const plantSchema = Yup.object().shape({
  exportedQuantity: Yup.number()
    .required('Cần nhập giá trị')
    .nullable()
    .default(null),
  locatorNameFrom: Yup.string()
    .nullable()
    .default(null),
  productCode: Yup.string()
    .required('Cần nhập giá trị')
    .nullable()
    .default(''),
  slotCode: Yup.string()
    .nullable()
    .default(''),
  // binding
  productName: Yup.string()
    .nullable()
    .default(''),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  uom: Yup.string()
    .nullable()
    .default(''),
});

// Validate cho các case cập nhật phiếu xuất kho hoặc tạo phiếu xuất kho mà không thay đổi loại xuất kho
export default Yup.object().shape({
  receiverCode: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XDC_FARM) {
        return schema
          .notOneOf(
            [Yup.ref('deliverCode'), -1],
            'Đơn vị nhận không được trùng đơn vị giao',
          )
          .required('Trường không được bỏ trống');
      }

      return schema;
    })
    .nullable(),
  customerName: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required('Trường không được bỏ trống');
    }
    return schema;
  }),
  customerBasketName: Yup.string()
    .when(['subType', 'basketsTrays'], (subType, basketsTrays, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN && basketsTrays.length > 0) {
        // return schema.required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  orderTypeCode: Yup.string()
    .nullable()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        return schema.required('Trường không được bỏ trống');
      }
      return schema;
    }),
  channel: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        // return schema.required('Trường không được bỏ trống');
        return schema;
      }
      return schema;
    })
    .nullable(),
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  exporterName: Yup.string().required('Trường không được bỏ trống'),
  supervisorName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  // table
  detailsCommands: Yup.array()
    .transform(values => {
      const results = [];

      for (let i = 0, len = values.length; i < len; i += 1) {
        const value = values[i];

        if (value !== undefined) {
          results[i] = value;
        } else {
          results[i] = SchemaProduct.cast({
            inventoryQuantity: 1,
            exportedQuantity: 0,
            slotCode: 1,
            processingTypeName: 'Sơ Chế',
            productCode: 'productCode',
            locatorNameTo: 'locatorNameTo',
          });
        }
      }

      return results;
    })
    .when(
      ['subType', 'isCompleteAction'],
      (subType, isCompleteAction, schema) => {
        const exportedQuantitySchema = Yup.object({
          exportedQuantity: Yup.number()
            .max(
              Yup.ref('inventoryQuantity'),
              'Số lượng xuất không được lớn hơn số lượng tồn',
            )
            .required('Cần nhập giá trị')
            .nullable()
            .default(null),
        });

        if (subType === TYPE_PXK.PXK_XDC_FARM) {
          if (isCompleteAction)
            return schema.of(pxkFarmTransSchema.concat(exportedQuantitySchema));
          return schema.of(pxkFarmTransSchema); // schema điều chuyển farm
        }
        if (subType === TYPE_PXK.PXK_XUAT_HUY) {
          return schema.of(pxkDestroySchema);
        }
        if (subType === TYPE_PXK.PXK_XUAT_BAN) {
          if (isCompleteAction)
            return schema.of(pxkSellSchema.concat(exportedQuantitySchema));
          return schema.of(pxkSellSchema);
        }
        if (isCompleteAction)
          return schema.of(pxkSellSchema.concat(exportedQuantitySchema));
        return schema.of(SchemaProduct); // mặc định là phiếu xuất chuyển nội bộ
      },
    )
    // .of(SchemaProduct)
    .ensure(),
});

// nội bộ và điều chuyển (case tạo mới chuyển từ loại xuất kho khác trở lại)
export const validationInternal = Yup.object().shape({
  receiverCode: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XDC_FARM) {
        return schema
          .notOneOf(
            [Yup.ref('deliverCode'), -1],
            'Đơn vị nhận không được trùng đơn vị giao',
          )
          .required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  customerName: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required('Trường không được bỏ trống');
    }
    return schema;
  }),
  customerBasketName: Yup.string()
    .when(['subType', 'basketsTrays'], (subType, basketsTrays, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN && basketsTrays.length > 0) {
        // return schema.required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  orderTypeCode: Yup.string()
    .nullable()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        return schema.required('Trường không được bỏ trống');
      }
      return schema;
    }),
  channel: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        // return schema.required('Trường không được bỏ trống');
        return schema;
      }
      return schema;
    })
    .nullable(),
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  exporterName: Yup.string().required('Trường không được bỏ trống'),
  supervisorName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  // table
  detailsCommands: Yup.array()
    .transform(values => {
      const results = [];

      for (let i = 0, len = values.length; i < len; i += 1) {
        const value = values[i];

        if (value !== undefined) {
          results[i] = value;
        } else {
          results[i] = SchemaProduct.cast({
            inventoryQuantity: 1,
            exportedQuantity: 0,
            slotCode: 1,
            processingTypeName: 'Sơ Chế',
            productCode: 'productCode',
            locatorNameTo: 'locatorNameTo',
          });
        }
      }

      return results;
    })
    .when(
      ['subType', 'isCompleteAction'],
      (subType, isCompleteAction, schema) => {
        const exportedQuantitySchema = Yup.object({
          exportedQuantity: Yup.number()
            .max(
              Yup.ref('inventoryQuantity'),
              'Số lượng xuất không được lớn hơn số lượng tồn',
            )
            .required('Cần nhập giá trị')
            .nullable()
            .default(null),
        });
        if (isCompleteAction)
          return schema.of(SchemaProduct.concat(exportedQuantitySchema));
        return schema.of(SchemaProduct); // mặc định là phiếu xuất chuyển nội bộ
      },
    )
    // .of(SchemaProduct)
    .ensure(),
});

// Điều chuyển
export const validationPlant = Yup.object().shape({
  receiverCode: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XDC_FARM) {
        return schema
          .notOneOf(
            [Yup.ref('deliverCode'), -1],
            'Đơn vị nhận không được trùng đơn vị giao',
          )
          .required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  customerName: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required('Trường không được bỏ trống');
    }
    return schema;
  }),
  customerBasketName: Yup.string()
    .when(['subType', 'basketsTrays'], (subType, basketsTrays, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN && basketsTrays.length > 0) {
        // return schema.required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  orderTypeCode: Yup.string()
    .nullable()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        return schema.required('Trường không được bỏ trống');
      }
      return schema;
    }),
  channel: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        // return schema.required('Trường không được bỏ trống');
        return schema;
      }
      return schema;
    })
    .nullable(),
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  exporterName: Yup.string().required('Trường không được bỏ trống'),
  supervisorName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  // table
  detailsCommands: Yup.array()
    .transform(values => {
      const results = [];

      for (let i = 0, len = values.length; i < len; i += 1) {
        const value = values[i];

        if (value !== undefined) {
          results[i] = value;
        } else {
          results[i] = SchemaProduct.cast({
            inventoryQuantity: 1,
            exportedQuantity: 0,
            slotCode: 1,
            processingTypeName: 'Sơ Chế',
            productCode: 'productCode',
            locatorNameTo: 'locatorNameTo',
          });
        }
      }

      return results;
    })
    .when(
      ['subType', 'isCompleteAction'],
      (subType, isCompleteAction, schema) => {
        const exportedQuantitySchema = Yup.object({
          exportedQuantity: Yup.number()
            .max(
              Yup.ref('inventoryQuantity'),
              'Số lượng xuất không được lớn hơn số lượng tồn',
            )
            .required('Cần nhập giá trị')
            .nullable()
            .default(null),
        });
        if (isCompleteAction)
          return schema.of(plantSchema.concat(exportedQuantitySchema));
        return schema.of(plantSchema); // mặc định là phiếu xuất chuyển nội bộ
      },
    )
    .ensure(),
});

// xuất hủy (case tạo mới chuyển từ loại xuất kho khác)
export const validationDestroy = Yup.object().shape({
  receiverCode: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XDC_FARM) {
        return schema
          .notOneOf(
            [Yup.ref('deliverCode'), -1],
            'Đơn vị nhận không được trùng đơn vị giao',
          )
          .required('Trường không được bỏ trống');
      }

      return schema;
    })
    .nullable(),
  customerName: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required('Trường không được bỏ trống');
    }
    return schema;
  }),
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  receiptCode: Yup.string().required('Trường không được bỏ trống'),
  exporterName: Yup.string().required('Trường không được bỏ trống'),
  supervisorName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  // table
  detailsCommands: Yup.array()
    .transform(values => {
      const results = [];

      for (let i = 0, len = values.length; i < len; i += 1) {
        const value = values[i];

        if (value !== undefined) {
          results[i] = value;
        } else {
          results[i] = SchemaProduct.cast({
            inventoryQuantity: 1,
            exportedQuantity: 0,
            slotCode: 1,
            processingTypeName: 'Sơ Chế',
            productCode: 'productCode',
            locatorNameTo: 'locatorNameTo',
          });
        }
      }

      return results;
    })
    .when('isCompleteAction', (isCompleteAction, schema) => {
      const exportedQuantitySchema = Yup.object({
        exportedQuantity: Yup.number()
          .max(
            Yup.ref('inventoryQuantity'),
            'Số lượng xuất không được lớn hơn số lượng tồn',
          )
          .required('Cần nhập giá trị')
          .nullable()
          .default(null),
      });
      if (isCompleteAction)
        return schema.of(pxkDestroySchema.concat(exportedQuantitySchema));
      return schema.of(pxkDestroySchema);
    })
    .ensure(),
});

export const validationSell = Yup.object().shape({
  receiverCode: Yup.string()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XDC_FARM) {
        return schema
          .notOneOf(
            [Yup.ref('deliverCode'), -1],
            'Đơn vị nhận không được trùng đơn vị giao',
          )
          .required('Trường không được bỏ trống');
      }

      return schema;
    })
    .nullable(),
  fullName: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required('Trường không được bỏ trống');
    }
    return schema;
  }),
  customerBasketName: Yup.string()
    .when(['subType', 'basketsTrays'], (subType, basketsTrays, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN && basketsTrays.length > 0) {
        // return schema.required('Trường không được bỏ trống');
      }
      return schema;
    })
    .nullable(),
  orderTypeCode: Yup.string()
    .nullable()
    .when('subType', (subType, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN) {
        return schema.required('Trường không được bỏ trống');
      }
      return schema;
    }),
  channel: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  exporterName: Yup.string().required('Trường không được bỏ trống'),
  supervisorName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  // table
  detailsCommands: Yup.array()
    .transform(values => {
      const results = [];

      for (let i = 0, len = values.length; i < len; i += 1) {
        const value = values[i];

        if (value !== undefined) {
          results[i] = value;
        } else {
          results[i] = SchemaProduct.cast({
            inventoryQuantity: 1,
            exportedQuantity: 0,
            slotCode: 1,
            processingTypeName: 'Sơ Chế',
            productCode: 'productCode',
            locatorNameTo: 'locatorNameTo',
          });
        }
      }

      return results;
    })
    .when('isCompleteAction', (isCompleteAction, schema) => {
      const exportedQuantitySchema = Yup.object({
        exportedQuantity: Yup.number()
          .max(
            Yup.ref('inventoryQuantity'),
            'Số lượng xuất không được lớn hơn số lượng tồn',
          )
          .required('Cần nhập giá trị')
          .nullable()
          .default(null),
      });
      if (isCompleteAction)
        return schema.of(pxkSellSchema.concat(exportedQuantitySchema));
      return schema.of(pxkSellSchema);
    })
    .ensure(),
});

export const initSchema = {
  id: 0, // id trả về khi lưu biên bản thành công
  deliverCode: -1, // Đơn vị xuất hàng - (pxk nội bộ)
  deliverName: '',
  subType: 53, // Loại xuất kho - (pxk nội bộ)
  subTypeNames: 'init',
  receiverCode: '', // Đơn vị nhận hàng
  receiverName: '', // Đơn vị nhận hàng
  note: '', // Ghi chú - (pxk nội bộ)
  date: new Date().toISOString(), // Thời gian lập phiếu - (pxk nội bộ)
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng - (pxk nội bộ)
  exporterName: `${auth.meta.fullName}`,
  exporterPhone: `${auth.meta.phoneNumber}`, // Điện thoại - (pxk nội bộ)
  exporterEmail: `${auth.meta.email}`, // Email - (pxk nội bộ)
  supervisorID: `${auth.meta.userId}`, // Nhân viên giám sát - (pxk nội bộ)
  supervisorName: `${auth.meta.fullName}`,
  documentCode: '', // mã phiếu xuất kho
  statusName: '', // tên trạng thái
  status: 1,
  detailsCommands: [],
  basketsTrays: [],
  isCompleteAction: false,
};

export const initSchemaInternal = {
  id: 0, // id trả về khi lưu biên bản thành công
  deliverCode: '', // Đơn vị xuất hàng - (pxk nội bộ)
  deliverName: '',
  subType: TYPE_PXK.PXK_NOI_BO, // Loại xuất kho - (pxk nội bộ)
  subTypeNames: 'Noi bo',
  receiverCode: '', // Đơn vị nhận hàng
  receiverName: '', // Đơn vị nhận hàng
  note: '', // Ghi chú - (pxk nội bộ)
  date: new Date().toISOString(), // Thời gian lập phiếu - (pxk nội bộ)
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng - (pxk nội bộ)
  exporterName: `${auth.meta.fullName}`,
  exporterPhone: `${auth.meta.phoneNumber}`, // Điện thoại - (pxk nội bộ)
  exporterEmail: `${auth.meta.email}`, // Email - (pxk nội bộ)
  supervisorID: `${auth.meta.userId}`, // Nhân viên giám sát - (pxk nội bộ)
  supervisorName: `${auth.meta.fullName}`,
  documentCode: '', // mã phiếu xuất kho
  statusName: '', // tên trạng thái
  status: 1,
  detailsCommands: [],
  isCompleteAction: false,
};

export const initSchemaPlant = {
  id: 0, // id trả về khi lưu biên bản thành công
  deliverCode: '', // Đơn vị xuất hàng - (pxk nội bộ)
  deliverName: '',
  subType: TYPE_PXK.PXK_XDC_FARM, // Loại xuất kho - (pxk nội bộ)
  subTypeName: 'Plant',
  receiverCode: '', // Đơn vị nhận hàng
  receiverName: '', // Đơn vị nhận hàng
  note: '', // Ghi chú - (pxk nội bộ)
  date: new Date().toISOString(), // Thời gian lập phiếu - (pxk nội bộ)
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng - (pxk nội bộ)
  exporterName: `${auth.meta.fullName}`,
  exporterPhone: `${auth.meta.phoneNumber}`, // Điện thoại - (pxk nội bộ)
  exporterEmail: `${auth.meta.email}`, // Email - (pxk nội bộ)
  supervisorID: `${auth.meta.userId}`, // Nhân viên giám sát - (pxk nội bộ)
  supervisorName: `${auth.meta.fullName}`,
  documentCode: '', // mã phiếu xuất kho
  statusName: '', // tên trạng thái
  status: 1,
  detailsCommands: [],
  isCompleteAction: false,
};

export const initSchemaDestroy = {
  id: 0, // id trả về khi lưu biên bản thành công
  deliverCode: '', // Đơn vị xuất hàng - (pxk nội bộ)
  deliverName: '',
  subType: TYPE_PXK.PXK_XUAT_HUY, // Loại xuất kho - (pxk nội bộ)
  subTypeNames: 'Huy',
  receiverCode: '', // Đơn vị nhận hàng
  receiverName: '', // Đơn vị nhận hàng
  note: '', // Ghi chú - (pxk nội bộ)
  date: new Date().toISOString(), // Thời gian lập phiếu - (pxk nội bộ)
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng - (pxk nội bộ)
  exporterName: `${auth.meta.fullName}`,
  exporterPhone: `${auth.meta.phoneNumber}`, // Điện thoại - (pxk nội bộ)
  exporterEmail: `${auth.meta.email}`, // Email - (pxk nội bộ)
  supervisorID: `${auth.meta.userId}`, // Nhân viên giám sát - (pxk nội bộ)
  supervisorName: `${auth.meta.fullName}`,
  documentCode: '', // mã phiếu xuất kho
  statusName: '', // tên trạng thái
  status: 1,
  total: '',
  reasonDescription: '',
  receiptCode: '',
  detailsCommands: [],
  isCompleteAction: false,
};

export const initSchemaSell = {
  id: 0, // id trả về khi lưu biên bản thành công
  subType: TYPE_PXK.PXK_XUAT_BAN,
  subTypeNames: 'Ban',
  deliverCode: '', // Đơn vị xuất hàng - (pxk nội bộ)
  deliverName: '',
  receiverCode: '', // Đơn vị nhận hàng
  receiverName: '', // Đơn vị nhận hàng
  note: '', // Ghi chú - (pxk nội bộ)
  date: new Date().toISOString(), // Thời gian lập phiếu - (pxk nội bộ)
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng - (pxk nội bộ)
  exporterName: `${auth.meta.fullName}`,
  exporterPhone: `${auth.meta.phoneNumber}`, // Điện thoại - (pxk nội bộ)
  exporterEmail: `${auth.meta.email}`, // Email - (pxk nội bộ)
  supervisorID: `${auth.meta.userId}`, // Nhân viên giám sát - (pxk nội bộ)
  supervisorName: `${auth.meta.fullName}`,
  documentCode: '', // mã phiếu xuất kho
  statusName: '', // tên trạng thái
  status: 1,
  customerBasketName: '',
  customerBasketCode: '',
  customerBasketType: '',
  customerName: '',
  customerGroup: '',
  isDelivery: false,
  channel: '',
  orderTypeCode: '',
  transporterCode: '',
  basketsTrays: [],
  detailsCommands: [],
  isCompleteAction: false,
  deliBasketsTrays: [],
};

/**
 * @description
 * object binding when change source warehouse
 */
export const productEmpty = {
  productCode: '',
  productName: '',
  slotCode: '',
  locatorNameTo: '',
  locatorIdTo: '',
  inventoryQuantity: null,
  uom: '',
  isNotSaved: true,
  isEnterQuantity: true, // số lượng xuất
};
