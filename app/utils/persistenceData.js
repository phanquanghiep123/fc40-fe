/**
 * Utilites for using localStorage API
 * e.g: save. remove, get...token returned from remote api login.
 */
const FC40_LOGIN = 'FC40_LOGIN';

export const localstoreUtilites = {
  saveToLocalStorage: meta => {
    sessionStorage.setItem(
      FC40_LOGIN,
      JSON.stringify({
        meta,
        isAuthed: true,
      }),
    );
  },
  getAuthFromLocalStorage: () =>
    JSON.parse(sessionStorage.getItem(FC40_LOGIN)) || {
      meta: {
        leftMenu: [],
        topMenu: [],
        fullName: '',
      },
      isAuthed: false,
    },
  removeAuthFromLocalStorage: () => {
    sessionStorage.removeItem(FC40_LOGIN);
  },
  clearAllFromLocalStorage: () => sessionStorage.clear(),
};
