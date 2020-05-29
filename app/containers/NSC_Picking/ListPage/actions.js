import * as constants from './constants';

/**
 * @param formValues
 * @returns {{formValues: *, type: string}}
 */
export function fetchFileList(formValues) {
  return {
    type: constants.FETCH_FILE_LIST,
    formValues,
  };
}

/**
 * @param tableData
 * @returns {{tableData: *, type: string}}
 */
export function fetchOrgListSuccess(tableData) {
  return {
    type: constants.FETCH_FILE_LIST_SUCCESS,
    tableData,
  };
}
/**
 * @param professingDate
 * @returns {{tableData: *, type: string}}
 */
export function fetchProcessingDate(professingDate) {
  return {
    type: constants.FETCH_PROCESSING_DATE,
    professingDate,
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
