export const formDataSchema = {
  org: [],
  semiFinishedProducts: [],
  farms: [],
  batchSemiFinishedProducts: [],
};

// eslint-disable-next-line no-unused-vars
const tableDataResponseSchema = {
  statusCode: 0,
  message: 'string',
  developerMessage: 'string',
  data: {
    totalWeightMgtsDtos: [
      {
        originCode: 'string', // Mã Farm/NCC
        originName: 'string', // Tên Farm/NCC
        semiFinishedProductCode: 'string', // Mã BTP
        semiFinishedProductName: 'string', // Tên BTP
        slotCode: 'string', // Batch BTP
        semiFinishedProductQuantity: 0, // Khối lượng SP trước sơ chế
        productCode: 'string', // Mã SP - store selected value
        productName: 'string', // Tên SP - autofill from product selected
        productBatchCode: 'string', // Batch TP
        productQuantity: 0, // Khối lượng sản phẩm sau sơ chế
        parentId: null, // subrows have parentId !== null
        products: [
          {
            gradeCode: 'string', // Mã loại sp
            gradeName: 'string', // Tên loại sp
            productCode: 'string', // Mã sp
            productName: 'string', // Tên sp
          },
        ],
      },
    ],
    farms: [
      {
        value: 'string',
        label: 'string',
      },
    ],
    semiFinishedProducts: [
      {
        value: 'string',
        label: 'string',
      },
    ],
    batchSemiFinishedProducts: [
      {
        value: 'string',
        label: 'string',
      },
    ],
  },
  meta: {
    pageIndex: 0,
    pageSize: 0,
    count: 0,
    menu: {},
    accessToken: {},
    fullName: 'string',
    fileName: 'string',
  },
};
