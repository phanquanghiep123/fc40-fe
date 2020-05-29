import moment from 'moment';
import { constSchema } from '../TableSection1/schema';

export const initialSchema = {
  DateFrom: moment().add(1, 'days'),
  DateTo: moment(),
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
  totalItemBS: 0,
  orgStocktaking: [0],
  basketCode: [],
  status: ['0'],
  stocktakingType: ['0'],
  afterStocktaking: ['0'],
  sort: [
    constSchema.stocktakingRound,
    constSchema.basketCode,
    constSchema.diffferenceQuantity,
  ],
};
