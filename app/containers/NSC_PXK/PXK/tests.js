export const getProducts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        statusCode: 200,
        message: '',
        developerMessage: '',
        data: [
          {
            productCode: '41000143',
            productName: 'BTP-Cà chua đỏ ĐR/NL VE',
            slotCode: '2001190519',
            quantity: 100,
            uom: 'CÁI',
            locatorId: '122',
            locatorName: 'string',
            status: 1,
            statusName: 'Chưa cân',
          },
        ],
        meta: {},
      });
    }, 300);
  });
