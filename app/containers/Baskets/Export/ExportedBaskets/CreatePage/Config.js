import { formatToNumber } from 'utils/numberUtils';
import { internalBasketConfig } from './configs/Internal';
import { transferBasketConfig } from './configs/Transfer';
import { destroyBasketConfig } from './configs/Destroy';
import { loanBasketConfig } from './configs/Loan';
import { paybackBasketConfig } from './configs/Payback';
import { correctBasketConfig } from './configs/Correct';
import { byWayBasketConfig } from './configs/ByWay';
export const numericParser = params =>
  formatToNumber(params.newValue) || undefined;
export const numberFormatter = params => formatToNumber(params.value) || '';
export const columnDefsOptions = [];
columnDefsOptions.push(destroyBasketConfig);
columnDefsOptions.push(loanBasketConfig);
columnDefsOptions.push(correctBasketConfig);
columnDefsOptions.push(byWayBasketConfig);
columnDefsOptions.push(paybackBasketConfig);
columnDefsOptions.push(internalBasketConfig);
columnDefsOptions.push(transferBasketConfig);
export const defaultColDef = {
  valueSetter: params => {
    if (params.colDef.field === 'locatorFrom') return false;
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };

    params.context.props.onUpdateBasketDocumentDetails({
      index: params.node.rowIndex,
      data: updaterData,
    });
    return true;
  },
  suppressMovable: true,
};
export const defaultColDefDo = {
  suppressMovable: true,
};
