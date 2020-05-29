import { SYNCHRONIZE, SYNCHRONIZE_TRANSACTION } from './constants';

export function synchronize(path) {
  return { type: SYNCHRONIZE, path };
}

export function synchronizeTransaction() {
  return { type: SYNCHRONIZE_TRANSACTION };
}
