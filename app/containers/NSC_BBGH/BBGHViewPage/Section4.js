import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import saga from '../BBGHCreatePage/saga';
import reducer from '../BBGHCreatePage/reducer';

import { Section4, withConnect } from '../BBGHCreatePage/Section4';

import GoodsTable from './GoodsTable';

export class BBGHViewSection4 extends Section4 {
  isEditing = () => false;

  isCreate = () => false;

  renderButtonAdd() {
    return null;
  }

  renderGoodsTable() {
    return GoodsTable;
  }
}

const withSaga = injectSaga({ key: 'bbghCreate', saga });
const withReducer = injectReducer({ key: 'bbghCreate', reducer });

export default compose(
  withSaga,
  withReducer,
  withConnect,
)(withImmutablePropsToJS(BBGHViewSection4));
