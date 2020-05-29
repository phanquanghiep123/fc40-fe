import { BasketSchema, PalletSchema } from './Schema';

export function fetchBasketAuto() {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = [
        BasketSchema.cast({
          basketCode: '10000010',
          basketName: 'Xanh 10',
          basketWeight: 1.0,
        }),
        BasketSchema.cast({
          basketCode: '10000011',
          basketName: 'Xanh 11',
          basketWeight: 1.1,
        }),
        BasketSchema.cast({
          basketCode: '10000012',
          basketName: 'Xanh 12',
          basketWeight: 1.2,
        }),
      ];
      const response = {
        statusCode: 200,
        data: results,
      };

      resolve(response);
    }, 500);
  });
}

export function fetchPalletAuto() {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = [
        PalletSchema.cast({
          palletCode: '10000010',
          palletName: 'Xanh 10',
          palletWeight: 1.0,
        }),
        PalletSchema.cast({
          palletCode: '10000011',
          palletName: 'Xanh 11',
          palletWeight: 1.1,
        }),
        PalletSchema.cast({
          palletCode: '10000012',
          palletName: 'Xanh 12',
          palletWeight: 1.2,
        }),
      ];
      const response = {
        statusCode: 200,
        data: results,
      };

      resolve(response);
    }, 500);
  });
}
