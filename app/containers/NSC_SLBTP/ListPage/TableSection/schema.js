export const constSchema = {
  id: 'id',
  regionName: 'regionName',
  plantCode: 'plantCode',
  plantName: 'plantName',
  productionOrderCode: 'productionOrderCode',
  productCode: 'productCode',
  productName: 'productName',
  planningCode: 'planningCode',
  planningName: 'planningName',
  version: 'version',
  lastUpdateDateTime: 'lastUpdateDateTime',
  finishDate: 'finishDate',
  plannedQuantity: 'plannedQuantity',
  orderQuantity: 'targetQuantity',
  baseUnit: 'uom',
  ListSemiFinishedProducts: 'actualOutputReportDateDtos',
  semiFinishedProducts: {
    KHSL: 'planningQuantily',
    DBSL: 'forecastQuantily',
    BTP: 'semiFinishedProductQuantily',
    BTPX: 'semiFinishedProductRetailQuantily',
    L1: 'productType1Quantily',
    L2: 'productType2Quantily',
  },
};
export const initialSchema = {
  [constSchema.id]: 0,
  [constSchema.regionName]: '',
  [constSchema.plantCode]: '',
  [constSchema.plantName]: '',
  [constSchema.productionOrderCode]: '',
  [constSchema.productCode]: '',
  [constSchema.productName]: '',
  [constSchema.planningCode]: '',
  [constSchema.planningName]: '',
  [constSchema.version]: '',
  [constSchema.lastUpdateDateTime]: new Date(),
  [constSchema.finishDate]: new Date(),
  [constSchema.plannedQuantity]: 0,
  [constSchema.orderQuantity]: 0,
  [constSchema.baseUnit]: '',
  [constSchema.ListSemiFinishedProducts]: [
    {
      [constSchema.semiFinishedProducts.KHSL]: 0,
      [constSchema.semiFinishedProducts.DBSL]: 0,
      [constSchema.semiFinishedProducts.BTP]: 0,
      [constSchema.semiFinishedProducts.BTPX]: 0,
      [constSchema.semiFinishedProducts.L1]: 0,
      [constSchema.semiFinishedProducts.L2]: 0,
    },
  ],
};
export const fields = [
  {
    name: 'KHSL',
    field: '01',
    key: [constSchema.semiFinishedProducts.KHSL],
  },
  {
    name: 'DBSL',
    field: '02',
    key: [constSchema.semiFinishedProducts.DBSL],
  },
  {
    name: 'BTP',
    field: '03',
    key: [constSchema.semiFinishedProducts.BTP],
  },
  {
    name: 'BTP xá ',
    field: '04',
    key: [constSchema.semiFinishedProducts.BTPX],
  },
  {
    name: 'L1 ',
    field: '05',
    key: [constSchema.semiFinishedProducts.L1],
  },
  {
    name: 'L2',
    field: '06',
    key: [constSchema.semiFinishedProducts.L2],
  },
];
export class EXdata {
  number = length => {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return Number(result);
  };

  string = length => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  dataEXST = ($sm = initialSchema, $length = 10) => {
    const data = [];
    for (let i = 0; i <= $length; i += 1) {
      const item = {};
      Object.keys($sm).forEach($key => {
        if ($sm[$key] instanceof Date) {
          item[$key] = new Date().toISOString();
        } else if (typeof $sm[$key] === 'string') {
          item[$key] = this.string(10);
        } else if (typeof $sm[$key] === 'number') {
          item[$key] = this.number(2);
        } else {
          item[$key] = $sm[$key];
        }
      });
      if ($length === 1) return item;
      data.push(item);
    }
    return data;
  };
}
