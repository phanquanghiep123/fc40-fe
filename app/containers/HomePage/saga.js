/**
 * Gets the repositories of the user from Github
 */

import { call, put, select } from 'redux-saga/effects';
// import { LOAD_USERS } from 'containers/App/constants';

import request from 'utils/request';
import { makeSelectUsername } from 'containers/HomePage/selectors';

import { loadingError } from '../App/actions';
/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(makeSelectUsername());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    console.log(repos);
    // yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLeading` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  // yield takeLeading(LOAD_USERS, getRepos);
}
