import { SUBMIT, RESET_SUCCESS } from './constants';

export function submit(form) {
  return {
    type: SUBMIT,
    form,
  };
}

export function resetSuccess() {
  return {
    type: RESET_SUCCESS,
  };
}
