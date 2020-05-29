import { TYPE_BBGH } from '../BBGHCreatePage/constants';

export const GET_INIT_BBGH = 'fc40/BBGHViewPage/GET_INIT_BBGH';
export const GET_INIT_BBGH_SUCCESS = 'fc40/BBGHViewPage/GET_INIT_BBGH_SUCCESS';
export const PRINT_BBGH = 'fc40/BBGHViewPage/PRINT_BBGH';
export const EXPORT_EXCEL = 'fc40/BBGHViewPage/EXPORT_EXCEL';
export const DELETE_IMAGE = 'fc40/BBGHViewPage/DELETE_IMAGE';

/**
 * @description
 * Status of Delivery Order
 */
export const STATUS_BBGH = {
  WAITING: 1, // Chờ tiếp nhận
  RECEIVED: 2, // Đã tiếp nhận
};

/**
 * @description
 * constants check what login user has roles is?
 */
export const TYPE_USER_EDIT = {
  DELIVER: 1, // Bên giao hàng
  RECIVER: 2, // Bên nhận hàng
  DELIVER_AND_RECIVER: 3, // Cả 2 bên
};

/**
 * @description
 * type BBGH NCC to NSC
 */
export const TYPE_NCC_TO_NSC = {
  TYPE: TYPE_BBGH.NCC_TO_NSC,
};

/**
 * @description
 *
 * status of BBGH
 */
export const STATUS_RECIVE = {
  NOT_RECIVE: 1,
  RECIVE: 2,
};
