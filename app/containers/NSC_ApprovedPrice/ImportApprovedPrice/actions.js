import * as Constants from '../constants';

export function getInitMaster(callback) {
  return {
    type: Constants.FETCH_MASTER_DATA_REQUEST,
    callback,
  };
}

export function uploadFile(data) {
  return {
    type: Constants.UPLOAD_FILE_APPROVED_PRICE,
    data,
  };
}

export function submitFileSignalr(res, callback) {
  return { type: Constants.SUBMIT_FILE_SIGNALR, res, callback };
}

export function signalRProcessing(res) {
  return { type: Constants.SIGNALR_PROCESSING, res };
}

export function downloadSampleFile(res) {
  return { type: Constants.DOWNLOAD_SAMPLE_FILE, res };
}
