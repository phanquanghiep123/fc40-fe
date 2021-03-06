export const danhSachPhieu = [
  {
    documentCode: '5000000001',
    documentStatus: 'Đang cân',
    documentSubType: 'Nhập điều chuyển',
    deliver: 'VinEco Quảng Ninh',
    receiver: 'NSC Sài Đồng',
    date: '12/12/2018',
    listDetails: [
      {
        productCode: '41000138',
        batch: '200119625',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Sơ chế',
        deliveryQuantity: 100,
        receiveQuantity: 140,
        differenceStatus: 2,
        differenceStatusName: 'Đã điều chỉnh',
      },
      {
        productCode: '41000138',
        batch: '200119626',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Sơ chế',
        deliveryQuantity: 80,
        receiveQuantity: 20,
        differenceStatus: 1,
        differenceStatusName: 'Chưa điều chỉnh',
      },
      {
        productCode: '41000138',
        batch: '200119626',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Lưu kho',
        deliveryQuantity: 285,
        receiveQuantity: 300,
        differenceStatus: 1,
        differenceStatusName: 'Chưa điều chỉnh',
      },
    ],
  },
  {
    documentCode: '5000000002',
    documentStatus: 'Hoàn thành',
    documentSubType: 'Nhập điều chuyển',
    deliver: 'VinEco Hải Phòng',
    receiver: 'NSC Sài Đồng',
    date: '12/12/2018',
    listDetails: [
      {
        productCode: '41000138',
        batch: '200119625',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Lưu kho',
        deliveryQuantity: 285,
        receiveQuantity: 286,
        differenceStatus: 2,
        differenceStatusName: 'Đã điều chỉnh',
      },
    ],
  },
  {
    documentCode: '5000000003',
    documentStatus: 'Đang cân',
    documentSubType: 'Nhập điều chuyển',
    deliver: 'VinEco Quảng Ninh',
    receiver: 'NSC Sài Đồng',
    date: '12/12/2018',
    listDetails: [
      {
        productCode: '41000138',
        batch: '200119625',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Sơ chế',
        deliveryQuantity: 100,
        receiveQuantity: 40,
        differenceStatus: 2,
        differenceStatusName: 'Đã điều chỉnh',
      },
      {
        productCode: '41000138',
        batch: '200119626',
        productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
        processingTypeName: 'Sơ chế',
        deliveryQuantity: 80,
        receiveQuantity: 20,
        differenceStatus: 1,
        differenceStatusName: 'Chưa điều chỉnh',
      },
    ],
  },
];

export const danhSachSanPham = [
  {
    productCode: '41000138',
    batch: '200119625',
    productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
    processingTypeName: 'Sơ chế',
    deliveryQuantity: 100,
    receiveQuantity: 140,
    differenceStatus: 2,
    differenceStatusName: 'Đã điều chỉnh',
    farmProductionOrderDtos: [
      {
        farmProductionOrder: '100000669',
        quantity: 80,
        locatorIdModified: '2001',
        locatorIds: ['2001'],
        quantityModify: 30,
      },
      {
        farmProductionOrder: '100000670',
        quantity: 20,
        locatorIdModified: '2001',
        locatorIds: ['2001'],
        quantityModify: 10,
      },
    ],
  },
  {
    productCode: '41000138',
    batch: '200119626',
    productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
    processingTypeName: 'Sơ chế',
    deliveryQuantity: 80,
    receiveQuantity: 20,
    differenceStatus: 1,
    differenceStatusName: 'Chưa điều chỉnh',
    farmProductionOrderDtos: [
      {
        farmProductionOrder: '',
        quantity: 80,
        locatorIdModified: '2001',
        locatorIds: ['2000', '2001', '2002'],
        quantityModify: null,
      },
    ],
  },
  {
    productCode: '41000138',
    batch: '200119626',
    productName: 'BTP-Cà chua cherry đỏ DL NM/NK GT VE',
    processingTypeName: 'Sơ chế',
    deliveryQuantity: 285,
    receiveQuantity: 300,
    differenceStatus: 1,
    differenceStatusName: 'Chưa điều chỉnh',
    farmProductionOrderDtos: [
      {
        farmProductionOrder: '100000669',
        quantity: 200,
        locatorIdModified: '2001',
        locatorIds: ['2001'],
        quantityModify: null,
      },
      {
        farmProductionOrder: '100000670',
        quantity: 20,
        locatorIdModified: '2001',
        locatorIds: ['2001'],
        quantityModify: null,
      },
    ],
  },
];

export const trangThaiDieuChinh = [
  { id: 0, name: 'Tất cả' },
  { id: 1, name: 'Chưa điều chỉnh' },
  { id: 2, name: 'Đã điều chỉnh' },
];
