import io from 'socket.io-client';

import { socketPath } from 'utils/request';

import ReconnectingWebSocket from 'ReconnectingWebSocket';

/**
 * @description
 * Trạng thái của thiết bị ngoại vi
 */
export const DEVICE_EXTERNAL = {
  NOT_CONNECT_YET: 0,
  CONNECTED: 1,
  DISCONNECT: 2,
};

export const connectSocket = (url, context, status) => {
  let socket = null;

  // not connected yet, connect to websocket
  if (status === DEVICE_EXTERNAL.NOT_CONNECT_YET) {
    socket = new ReconnectingWebSocket(`${url}${socketPath}`, null, {
      // Thời gian delay trước khi kết nối lại
      // reconnectInterval: 1000,

      // Thời gian delay tối đa khi kết nối lại
      // maxReconnectInterval: 30000,

      // Thời gian chờ kết nối thành công tối đa trước khi đóng kết nối và thử lại
      // timeoutInterval: 200,

      // Số lần thử kết nối tối đa trước khi dừng kết nối
      maxReconnectAttempts: 10,
    });

    window.socketClient = socket;

    socket.onopen = () => {
      context.props.onConnectDevice(DEVICE_EXTERNAL.CONNECTED);
    };

    socket.onmessage = event => {
      if (document.hasFocus()) {
        context.props.onReciveData(event.data);
      }
    };

    socket.onclose = () => {
      context.props.onConnectDevice(DEVICE_EXTERNAL.DISCONNECT);
    };
  }

  return socket;
};

export const connectSocketIO = (url, context, status) => {
  let socket = null;

  // not connected yet, connect to websocket
  if (status === DEVICE_EXTERNAL.NOT_CONNECT_YET) {
    socket = io(url, {
      path: socketPath,
      reconnection: false,
      transports: ['websocket'],
    });

    window.socketClient = socket;

    socket.on('connect', () => {
      context.props.onConnectDevice(DEVICE_EXTERNAL.CONNECTED);
    });

    socket.on('scale', context.props.onReciveData);

    socket.on('disconnect', () => {
      context.props.onConnectDevice(DEVICE_EXTERNAL.DISCONNECT);
    });
  }

  return socket;
};
