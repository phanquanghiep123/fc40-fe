import PropTypes from 'prop-types';

import merge from 'lodash/merge';

import GoodsTable from '../BBGHCreatePage/GoodsTable';
import { columns, defaultColDef } from '../BBGHCreatePage/GoodsTable/header';

import ActionsRenderer from './ActionsRenderer';

import { TYPE_BBGH } from '../BBGHCreatePage/constants';
import { STATUS_BBGH, TYPE_USER_EDIT } from './constants';
// import { editableBasketLogic } from '../BBGHCreatePage/basketLogicFunction';

export const columnsExtra = merge({}, columns, {
  productionOrder: {
    editable: ({ context, ...params }) => {
      const typeUser = context.getTypeUser();

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (params.data.isInScale) {
          return false;
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm, không phụ thuộc vào Mã đi hàng

      return true;
    },
  },
  doConnectingId: {
    editable: ({ context, ...params }) => {
      const isQLNH = context.isQLNH();
      const doType = context.getDoType();
      const typeUser = context.getTypeUser();

      // [Plant tới Plant] Không được sửa
      if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
        return false;
      }

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (isQLNH) {
          // Bên nhận hàng
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }

          if (params.data.isInScale) {
            return false;
          }
          return true;
        }

        if (params.data.isInScale) {
          return false;
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm, mặc định cho phép nhập

      return true;
    },
  },
  processingType: {
    editable: ({ context, ...params }) => {
      const isQLNH = context.isQLNH();
      const doType = context.getDoType();
      const typeUser = context.getTypeUser();

      // [Plant tới Plant] Không được sửa
      if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
        return false;
      }

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (isQLNH) {
          // bên nhận hàng
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }

          if (params.data.isInScale) {
            return false;
          }
          return true;
        }

        if (params.data.isInScale) {
          return false;
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
      if (params.data && params.data.productionOrder !== undefined) {
        return true;
      }

      return false;
    },
  },
  plannedTotalQuatity: {
    editable: ({ context, ...params }) => {
      const isQLNH = context.isQLNH();
      const doType = context.getDoType();
      const typeUser = context.getTypeUser();

      // [Plant tới Plant] Không được sửa
      if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
        return false;
      }

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (isQLNH) {
          // Bên nhận hàng
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }

          if (params.data.isInScale) {
            return false;
          }
          return true;
        }

        if (params.data.isInScale) {
          return false;
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
      if (params.data && params.data.productionOrder !== undefined) {
        return true;
      }

      return false;
    },
  },
  palletBaskets: {
    group: {
      basketShortName1: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();
          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }

          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }
          // if (!editableBasketLogic(context.props.values)) {
          //   return false;
          // }

          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
      deliverQuantity1: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();

          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }
          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }

          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }
          // if (this) {
          // if (this.props.values.isLockBasketEdited) {
          //   return false;
          //  }
          // }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }

            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
      basketShortName2: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();
          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }
          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }

          // if (!editableBasketLogic(context.props.values)) {
          //   return false;
          // }

          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }

            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
      deliverQuantity2: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();
          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }
          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }

          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }

            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
      basketShortName3: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();

          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }
          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }

          // if (!editableBasketLogic(context.props.values)) {
          //   return false;
          // }
          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }

            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
      deliverQuantity3: {
        editable: ({ context, ...params }) => {
          const isQLNH = context.isQLNH();
          const doType = context.getDoType();
          const typeUser = context.getTypeUser();
          const isLockBasketEdited = context.isLockBasketEdited();
          const isActiveEditeBasket = context.isActiveEditeBasket();

          // Mặc định, QLNH không được phép nhập
          if (isQLNH) {
            return false;
          }
          if (isActiveEditeBasket) {
            return true;
          }
          // [Plant tới Plant] được sửa
          if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
            return true;
          }
          // PXKS đã hoàn thành -> Không được sửa
          if (isLockBasketEdited) {
            return false;
          }

          // Thay đổi sản phẩm
          if (params.data && params.data.deliveryOrderId >= 0) {
            if (params.data.isInScale) {
              return false;
            }

            if (typeUser === TYPE_USER_EDIT.DELIVER) {
              return true;
            }
            if (typeUser === TYPE_USER_EDIT.RECIVER) {
              return false;
            }
            if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
              return true;
            }
          }

          // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
          if (params.data && params.data.productionOrder !== undefined) {
            return true;
          }

          return false;
        },
      },
    },
  },
  farmQcRecoveryRate: {
    editable: ({ context, ...params }) => {
      const doType = context.getDoType();
      const typeUser = context.getTypeUser();

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        // [Plant tới Plant] Bên nhận hàng được phép sửa
        if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
          if (typeUser === TYPE_USER_EDIT.DELIVER) {
            return true;
          }
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }
          if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
            return true;
          }
        }

        if (params.data.isInScale) {
          if (typeUser === TYPE_USER_EDIT.DELIVER) {
            return true;
          }
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }
          if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
            return true;
          }
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
      if (params.data && params.data.productionOrder !== undefined) {
        return true;
      }

      return false;
    },
  },
  processorQcRecoveryRate: {
    editable: ({ context, ...params }) => {
      const isQLNH = context.isQLNH();
      const doType = context.getDoType();
      const typeUser = context.getTypeUser();

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (isQLNH) {
          return false;
        }

        // [Plant tới Plant] Bên nhận hàng được phép sửa
        if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
          if (typeUser === TYPE_USER_EDIT.DELIVER) {
            return false;
          }
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return true;
          }
          if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
            return true;
          }
        }

        if (params.data.isInScale) {
          if (typeUser === TYPE_USER_EDIT.DELIVER) {
            return false;
          }
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return true;
          }
          if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
            return true;
          }
        }

        if (typeUser === TYPE_USER_EDIT.DELIVER) {
          return false;
        }
        if (typeUser === TYPE_USER_EDIT.RECIVER) {
          return true;
        }
        if (typeUser === TYPE_USER_EDIT.DELIVER_AND_RECIVER) {
          return true;
        }
      }

      // Thêm mới sản phẩm

      // Mặc định, không cho phép nhập khi tạo BBGH
      return false;
    },
  },
  notes: {
    editable: ({ context, ...params }) => {
      const isQLNH = context.isQLNH();

      // Thay đổi sản phẩm
      if (params.data && params.data.deliveryOrderId >= 0) {
        if (isQLNH) {
          return false;
        }
      }

      // Thêm mới sản phẩm, phụ thuộc Mã đi hàng
      if (params.data && params.data.productionOrder !== undefined) {
        return true;
      }

      return false;
    },
  },
  actions: {
    cellRendererFramework: ActionsRenderer,
  },
});

export default class GoodsTableEdit extends GoodsTable {
  state = {
    datas: [],
  };

  componentWillReceiveProps(nextProps) {
    const { stockList } = nextProps.values;
    if (stockList.length > this.state.datas.length) {
      this.setState({ datas: this.createInitRecords(stockList.length) });
    }
  }

  isCreate = () => false;

  isEditing = () => true;

  isReceived = () => this.props.values.status === STATUS_BBGH.RECEIVED;

  getTypeUser = () => this.props.values.deliverOrReceiver;

  isLockBasketEdited = () => this.props.values.isLockBasketEdited;

  isActiveEditeBasket = () => this.props.values.isActiveEditeBasket;
}

GoodsTableEdit.propTypes = {
  values: PropTypes.any,
};

GoodsTableEdit.defaultProps = {
  columns: columnsExtra,
  defaultColDef,
};
