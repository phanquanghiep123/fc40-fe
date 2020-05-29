import * as Yup from 'yup';
import React from 'react';
import CheckboxCell from '@material-ui/core/Checkbox';

import { formatToDecimal, formatToCurrency } from 'utils/numberUtils';
export const validSchema = Yup.object().shape({});

export const constKeyTable = {
  CL01: {
    key: 'productionOrder',
    label: 'Lệnh sản xuất',
    render(row) {
      return row[this.key] ? row[this.key] : '';
    },
    value: '',
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL02: {
    key: 'finishProductCode',
    label: 'Mã sản phẩm',
    render(row) {
      return row[this.key] ? row[this.key] : '';
    },
    value: '',
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL03: {
    key: 'finishProductName',
    label: 'Tên sản phẩm',
    render(row) {
      return row[this.key] ? row[this.key] : '';
    },
    value: '',
    cellStyle: {
      boderBottom: 'none',
      maxWidth: '150px',
    },
  },
  CL04: {
    key: 'rawOutput',
    label: 'Sản lượng gợi ý',
    render(row) {
      return row[this.key] ? formatToDecimal(row[this.key]) : '';
    },
    value: 0,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL06: {
    key: 'recoveryRate',
    label: 'Tỉ lệ thu hồi',
    render(row) {
      return row[this.key] ? `${formatToCurrency(row[this.key] * 100)}%` : '';
    },
    value: 0,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL07: {
    key: 'quantityType1',
    label: 'Sản lượng L1',
    render(row) {
      return row[this.key] ? formatToDecimal(row[this.key]) : '';
    },
    value: 0,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL08: {
    key: 'allocationRateQuantityType1',
    label: 'Tỷ lệ phân bổ SL Loại 1 /LSX',
    render(row) {
      return row[this.key] ? `${formatToCurrency(row[this.key] * 100)}%` : '';
    },
    value: 0,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL09: {
    key: 'isOutOfPlan',
    label: 'Ngoài kế hoạch',
    render(row) {
      const { key } = this;
      const ischeck = row[key] ? row[key] : false;
      return <CheckboxCell checked={ischeck} rowdata={row} />;
    },
    value: false,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL10: {
    key: 'planningDivideQuantity',
    label: 'SL chia dự kiến',
    render(row) {
      return row[this.key] ? formatToDecimal(row[this.key]) : '';
    },
    value: 0,
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL11: {
    key: 'planningCodes',
    label: 'Mã kế hoạch',
    render(row) {
      return row[this.key] ? row[this.key] : '';
    },
    value: '',
    cellStyle: {
      boderBottom: 'none',
    },
  },

  CL12: {
    key: 'planningName',
    label: 'Tên kế hoạch',
    render(row) {
      return row[this.key] ? row[this.key] : '';
    },
    value: '',
    cellStyle: {
      boderBottom: 'none',
    },
  },
  CL13: {
    key: 'farmHarvestPlantSuggestion',
    hidden: true,
    value: [],
  },
  CL14: {
    key: 'planningCode',
    hidden: true,
    value: '',
  },
};
export const initialSchema = Object.keys(constKeyTable).reduce(
  (result, key) => {
    // eslint-disable-next-line no-param-reassign
    result[constKeyTable[key].key] = constKeyTable[key].value;
    return result;
  },
  {},
);
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

  randomIntFromInterval = (min, max) => {
    const value = Math.floor(Math.random() * (max - min + 1) + min);
    return value;
  };

  boolean = () => {
    const key = this.randomIntFromInterval(0, 1);
    const value = [false, true];
    return value[key];
  };

  dataEXST = ($sm = initialSchema, $length = 10) => {
    const data = [];
    for (let i = 0; i <= $length; i += 1) {
      const item = {};
      Object.keys($sm).forEach($key => {
        if ($sm[$key] instanceof Date) {
          item[$key] = new Date().toISOString();
        } else if (typeof $sm[$key] === 'boolean') {
          item[$key] = this.boolean();
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
export const constructorListTable = {
  dto: constKeyTable,
  numcl: Object.keys(constKeyTable).length,
  item: [initialSchema],
  list: [[initialSchema]],
  numberitem: 20,
  createExData() {
    const eXdata = new EXdata();
    const { item } = this;
    const numberLook = eXdata.randomIntFromInterval(5, 20);
    const dataReturn = [];
    for (let i = 0; i < numberLook; i += 1) {
      const numberLookByRow = eXdata.randomIntFromInterval(1, 6);
      const row = eXdata.dataEXST(item[0], numberLookByRow);
      dataReturn.push(row);
    }
    return dataReturn;
  },
  converDataToGrid(datas) {
    const result = [];
    const { dto } = this;
    const { CL01, CL11, CL13, CL14, CL10, CL12 } = dto;
    let lengthList = 0;
    datas.forEach(items => {
      const list = items[CL13.key];
      lengthList = list.length;
      list.forEach((item, index) => {
        const cloneItem = item;
        if (index === 0) {
          cloneItem[CL11.key] = items[CL14.key];
        } else {
          cloneItem[CL11.key] = '';
          cloneItem[CL10.key] = '';
          cloneItem[CL12.key] = '';
        }
        cloneItem.isAfter = index + 1 === lengthList;
        cloneItem.key = `/${item[CL01.key]}/${item[CL14.key]}/`;
        result.push(cloneItem);
      });
    });
    return result;
  },
};
export const initSubmitValues = {
  isSubmit: false,
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  deliveryDateTime: new Date().toISOString(),
  planCode: '',
  planName: '',
  prodOrderCode: '',
  receiverCode: '',
  deliverCode: '',
  deliveryName: '',
  sort: [constructorListTable.dto.CL01.key],
  pageSizeTrue: 5,
  isUpdate: 0,
};
