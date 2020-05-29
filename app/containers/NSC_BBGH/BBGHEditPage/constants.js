import { TYPE_BBGH } from '../BBGHCreatePage/constants';

export const UPDATE_BBGH = 'fc40/BBGHEditPage/UPDATE_BBGH';
export const GET_INIT_BBGH = 'fc40/BBGHEditPage/GET_INIT_BBGH';
export const GET_INIT_BBGH_SUCCESS = 'fc40/BBGHEditPage/GET_INIT_BBGH_SUCCESS';
export const GET_USERS_AUTO = 'fc40/BBGHEditPage/GET_USERS_AUTO';
export const GET_SHIPPER_AUTO = 'fc40/BBGHEditPage/GET_SHIPPER_AUTO';
export const UPDATE_BBGH_SUCCESS = 'fc40/BBGHEditPage/UPDATE_BBGH_SUCCESS';

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

/**
 * @description:
 * status: tiếp nhận BBGH (tất cả các xe)
 * receivingOrderFlag: từng xe
 */
export const ORDER_FLAG = {
  RECIVING: 0, // Đang chờ tiếp nhận
  RECIVED: 1, // Đã tiếp nhận
};
