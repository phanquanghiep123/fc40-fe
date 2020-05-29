import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSettingEmail = state => state.get('settingEmail', initialState);

export const tableData = () =>
  createSelector(selectSettingEmail, settingEmail =>
    settingEmail.getIn(['table', 'data']),
  );

export const formData = () =>
  createSelector(selectSettingEmail, settingEmail =>
    settingEmail.getIn(['form', 'data']),
  );
export const formDefaultValues = () =>
  createSelector(selectSettingEmail, settingEmail =>
    settingEmail.getIn(['form', 'defaultValues']),
  );
export const suggestEmail = () =>
  createSelector(selectSettingEmail, settingEmail =>
    settingEmail.getIn(['form', 'suggestEmail']),
  );
