import { TYPE_BBGH } from './constants';

/*
Logic cho phép sửa khay sọt tại vùng thông tin hàng hoá đối với
- Từ Farm tới plant khác (khác địa điểm) và phiếu xuất khay sọt tương ứng chưa hoàn thành
- Từ Farm tới plant khác (cùng địa điểm) và phiếu xuất khay sọt tương ứng chưa hoàn thành
* */

export const editableBasketLogic = data =>
  [TYPE_BBGH.FARM_TO_PLANT_CODE_1, TYPE_BBGH.FARM_TO_PLANT_CODE_2].includes(
    data.doType,
  ) && !data.isLockBasketEdited; // isLockBasketEdited = true <=> thông tin khay sọt được phép chỉnh sửa

/*
* Logic hiển thị thông tin khay sọt của biên bản giao hàng theo thông tin phiéu xuất khay sọt
*
* */

export const viewBasketLogic = (doType, createMode) =>
  [
    TYPE_BBGH.FARM_TO_PLANT_CODE_1,
    TYPE_BBGH.FARM_TO_PLANT_CODE_2,
    TYPE_BBGH.PLANT_TO_PLANT_CODE_4,
  ].includes(doType) && !createMode;

/*
* Thứ tự đề mục sẽ thay đổi phụ thuộc vào loại bbgh
* hàm này dùng để xác định ẩn/hiện phần khay sọt
* */
export const viewBasketSection = doType =>
  ![
    TYPE_BBGH.NCC_TO_NSC,
    TYPE_BBGH.BASKET_DELIVERY_ORDER,
    TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN,
  ].includes(doType);
