import { all, call, put, takeLatest } from 'redux-saga/effects';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import { setLoading, loadingError, showSuccess } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';

const APIs = {
  getEmailTemplate: `${
    PATH_GATEWAY.BFF_SPA_API
  }/setting-email/get-template-setting-email-by-type?type=1`,
  getEmailType: `${
    PATH_GATEWAY.BFF_SPA_API
  }/setting-email/get-autocomplete-email`,
  postEmailTemplate: `${
    PATH_GATEWAY.BFF_SPA_API
  }/setting-email/update-setting-email`,
};

export function* fetchFormDataSaga() {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [emailRes] = yield all([
      call(request, APIs.getEmailTemplate, GETOption),
    ]);
    if (emailRes.statusCode !== responseCode.ok || !emailRes.data) {
      throw Object({
        message: emailRes.message || 'Không lấy được nội dung Email.',
      });
    }
    if (emailRes.data.length < 1) {
      throw Object({
        message: 'Không lấy được nội dung Email.',
      });
    }
    const carbonCopies = emailRes.data.carbonCopies.map((item, index) => ({
      value: `${index}`,
      code: item.regionCode,
      label: item.regionName,
      emails: item.emails.map(email => ({
        email,
      })),
    }));

    const emailTemplate = {
      settingEmailName: !emailRes.data.settingEmailName
        ? null
        : emailRes.data.settingEmailName,
      settingEmailType: !`${emailRes.data.settingEmailType}`
        ? null
        : `${emailRes.data.settingEmailType}`,
      subject: !emailRes.data.subject ? null : emailRes.data.subject,
      header: !emailRes.data.header ? null : emailRes.data.header,
      body: !emailRes.data.body ? null : emailRes.data.body,
      footer: !emailRes.data.footer ? null : emailRes.data.footer,
      isActive: !emailRes.data.isActive ? null : emailRes.data.isActive,
      carbonCopies,
    };

    yield put(actions.formDataFetched(emailTemplate));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());

    const carbonCopies = action.values.carbonCopies.map(item => ({
      regionCode: item.code,
      regionName: item.label,
      emails: item.emails.map(obj => obj.email),
    }));

    const requestBody = {
      settingEmailType: action.values.settingEmailType,
      settingEmailName: action.values.settingEmailName,
      subject: action.values.subject,
      header: action.values.header,
      body: action.values.body,
      footer: action.values.footer,
      isActive: action.values.isActive,
      carbonCopies,
    };

    const res = yield call(
      request,
      APIs.postEmailTemplate,
      optionReq({
        method: 'POST',
        body: requestBody,
        authReq: true,
      }),
    );

    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Có lỗi xảy ra khi cập nhật Email',
      });
    }

    yield put(showSuccess(res.message || 'Cập nhật Email thành công'));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getEmailAuto(action) {
  try {
    const { data: keyword, callback } = action;

    const emailRes = yield call(
      request,
      `${APIs.getEmailType}?key=${keyword}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (emailRes.statusCode !== responseCode.ok || !emailRes.data) {
      throw Object({
        message: emailRes.message || 'Không lấy được danh sách Email.',
      });
    }

    if (callback) {
      callback(emailRes.data);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/* Input Search Email */
export function* inputFormSaga(action) {
  try {
    yield put(setLoading());
    const queryParams = {
      regionCode: !action.values ? null : action.values.regionCode,
      key: !action.values ? null : action.values.inputValue,
    };
    const queryStr = Object.keys(queryParams)
      .filter(
        key =>
          typeof queryParams[key] !== 'undefined' &&
          queryParams[key] !== null &&
          queryParams[key] !== '',
      )
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const emailRes = yield call(
      request,
      `${APIs.getEmailType}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (emailRes.statusCode !== responseCode.ok || !emailRes.data) {
      throw Object({
        message: emailRes.message || 'Không lấy được nội dung Email.',
      });
    }

    const suggestList = emailRes.data.map(item => ({
      value: item.id,
      label: item.email,
    }));

    yield put(actions.inputFormSuccess(suggestList));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* sagaWatcher() {
  yield takeLatest(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLatest(constants.INPUT_FORM, inputFormSaga);
  yield takeLatest(constants.GET_EMAIL_AUTO, getEmailAuto);
}
