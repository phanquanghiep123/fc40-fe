export const makeColumnDefs = () => [
  {
    title: 'Mã PNK.PXK',
    field: 'documentCode',
  },
  {
    title: 'Kho Nguồn',
    field: 'locatorName',
  },
  {
    title: 'Mã Sản Phẩm',
    field: 'productCode',
  },
  {
    title: 'KL Cân Hàng Hóa',
    // title: 'SL Cân',
    field: 'exportedQuantity',
  },
  {
    title: 'Khay Sọt',
    field: 'basketsTrays',
    hidden: true,
    headerStyle: {
      textAlign: 'center',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  {
    title: 'Mã Sọt',
    parentField: 'basketsTrays',
    field: 'basketCode',
    headerStyle: {
      textAlign: 'center',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  {
    title: 'Tên Sọt',
    parentField: 'basketsTrays',
    field: 'basketName',
    headerStyle: {
      textAlign: 'center',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
    },
  },
  {
    title: 'Số sọt',
    parentField: 'basketsTrays',
    field: 'basketQuantity',
    headerStyle: {
      textAlign: 'center',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
    },
  },
];
