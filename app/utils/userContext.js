import { localstoreUtilites } from 'utils/persistenceData';

export const getUserId = () =>
  localstoreUtilites.getAuthFromLocalStorage().meta.userId || null;
