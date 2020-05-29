export const constSchema = {
  id: 'id',
  processDate: 'processDate',
  importFromDate: 'importFromDate',
  importToDate: 'importToDate',
  userHandLing: 'createdBy',
  status: 'status',
  isDeleted: 'isDeleted',
  createdAt: 'createdAt',
  updatedBy: 'updatedBy',
  updatedAt: 'updatedAt',
};
export const initialSchema = {
  [constSchema.id]: 0,
  [constSchema.processDate]: new Date(),
  [constSchema.importToDate]: new Date(),
  [constSchema.importFromDate]: new Date(),
  [constSchema.userHandLing]: '',
  [constSchema.status]: 0,
  [constSchema.isDeleted]: 0,
  [constSchema.createdAt]: new Date(),
  [constSchema.updatedBy]: '',
  [constSchema.updatedAt]: new Date(),
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
