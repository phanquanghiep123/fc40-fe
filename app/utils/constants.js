export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const STATUS_APP = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

export const EVENT_KEY = {
  TAB: 'Tab',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  ARROWUP: 'ArrowUp',
  ARROWDOWN: 'ArrowDown',
};

export const EVENT_KEY_CODE = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  DELETE: 46,
  BACKSPACE: 8,
  ARROWUP: 38,
  ARROWDOWN: 40,
};

// Đơn vị tính cơ bản
export const TYPE_BASE_UNIT = {
  KG: 'KG',
};

// Số lượng trên trang
export const PAGE_SIZE = 5;

// Số chữ số sau dấu thập phân
export const NUM_DIGITS = 3;

// Số lượng dòng khi khởi tạo
export const NUM_INIT_PER_PAGE = 10;

// Số lượng dòng mặc định khi thêm
export const NUM_ADDED_PER_PAGE = 5;

// timeout nút submit
export const SUBMIT_TIMEOUT = 500;

export const SEARCH_DEBOUNCE_DELAY = 1000;
