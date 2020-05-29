import { UPLOAD_FILE } from './constans';

export function uploadFile(data) {
  return {
    type: UPLOAD_FILE,
    data,
  };
}
