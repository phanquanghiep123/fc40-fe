import * as constants from './constants';

/**
 * On form values change
 * @returns {{type: string}}
 */
export function formValuesChange() {
  return {
    type: constants.FORM_VALUES_CHANGE,
  };
}

/**
 * @param formValues
 * @returns {{formValues: *, type: string}}
 */
export function submitFile(formValues) {
  return {
    type: constants.SUBMIT_FILE,
    formValues,
  };
}

/**
 * @param fileInfo
 * @returns {{fileInfo: *, type: string}}
 */
export function submitFileSuccess(fileInfo) {
  return {
    type: constants.SUBMIT_FILE_SUCCESS,
    fileInfo,
  };
}

/**
 *
 * @param id
 * @param fileType
 * @returns {{id: *, type: string, fileType: *}}
 */
export function downloadFile(id, fileType) {
  return {
    type: constants.DOWNLOAD_FILE,
    id,
    fileType,
  };
}
