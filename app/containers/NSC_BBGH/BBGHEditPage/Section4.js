import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { getIn } from 'formik';

import saga from '../BBGHCreatePage/saga';
import reducer from '../BBGHCreatePage/reducer';

import { Section4, withConnect } from '../BBGHCreatePage/Section4';

import {
  TYPE_BBGH,
  TYPE_PLANT,
  TYPE_PROCESSING,
} from '../BBGHCreatePage/constants';
import { STATUS_BBGH, TYPE_USER_EDIT } from './constants';

import GoodsTable from './GoodsTable';

export class BBGHEditSection4 extends Section4 {
  isEditing = () => this.props.formik.values.isBasketNotDone;

  isCreate = () => false;

  isAddVisible() {
    const { formik } = this.props;

    const status = getIn(formik.values, 'status');
    const doType = getIn(formik.values, 'doType');
    const typeUser = getIn(formik.values, 'deliverOrReceiver');

    // Không hiển thị khi Bên nhận hàng chỉnh sửa
    if (doType === TYPE_BBGH.NCC_TO_NSC) {
      if (typeUser === TYPE_USER_EDIT.RECIVER) {
        return false;
      }
    }

    // Không hiển thị khi Loại BBGH là [Từ Plant tới Plant]
    if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
      return false;
    }

    // Không hiển thị khi BBGH đã tiếp nhận
    if (status !== STATUS_BBGH.RECEIVED) {
      return true;
    }
    return false;
  }

  getProcessingTypes() {
    const { formik, processTypes } = this.props;

    const doType = getIn(formik.values, 'doType');
    const plantType = getIn(formik.values, 'receiverType');

    if (
      plantType === TYPE_PLANT.Farm &&
      (doType === TYPE_BBGH.FARM_TO_PLANT_CODE_1 ||
        doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2)
    ) {
      return processTypes.filter(item => item.value === TYPE_PROCESSING.SO_CHE);
    }
    return processTypes;
  }

  renderButtonAdd() {
    const isVisible = this.isAddVisible();

    if (isVisible) {
      return super.renderButtonAdd();
    }
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
)(withImmutablePropsToJS(BBGHEditSection4));
