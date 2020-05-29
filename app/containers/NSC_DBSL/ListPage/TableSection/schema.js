export const constSchema = {
  id: 'id',
  regionName: 'regionName',
  regionCode: 'regionCode',
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
  baseUnit: 'baseUnit',
  lastUpdateTime: 'lastUpdateTime',
  lastUpdateByUser: 'lastUpdateByUser',
  isActive: 'isActive',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedBy: 'updatedBy',
  updatedAt: 'updatedAt',
  plannedFrom: 'plannedFrom',
  plannedTo: 'plannedTo',
  forcastingQuantity: 'forcastingQuantity',
  forcastingQuantityItem: {
    plannedDate: 'plannedDate',
    plannedQuantity: 'plannedQuantity',
    color: 'color',
    lastUpdatedByUser: 'lastUpdatedByUser',
    basicUnit: 'basicUnit',
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
  [constSchema.lastUpdateTime]: '',
  [constSchema.lastUpdateByUser]: '',
  [constSchema.isActive]: true,
  [constSchema.createdBy]: '',
  [constSchema.createdAt]: new Date(),
  [constSchema.updatedBy]: '',
  [constSchema.updatedAt]: new Date(),
  [constSchema.plannedFrom]: new Date(),
  [constSchema.plannedTo]: new Date(),
  [constSchema.forcastingQuantity]: [
    {
      [constSchema.forcastingQuantityItem.plannedDate]: new Date(),
      [constSchema.forcastingQuantityItem.plannedQuantity]: 0,
      [constSchema.forcastingQuantityItem.color]: '',
      [constSchema.forcastingQuantityItem.lastUpdatedByUser]: '',
    },
  ],
};

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

  date = () => new Date();

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
