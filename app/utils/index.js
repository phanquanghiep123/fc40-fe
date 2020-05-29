import appTheme from '../containers/App/theme';

export * from './arrayUtils';
export const orderNumberRenderer = params =>
  params.data.totalCol ? '' : params.rowIndex + 1;

// eslint-disable-next-line consistent-return
export const getRowStyle = params => {
  if (params.data.totalCol) {
    return { backgroundColor: appTheme.palette.background.default };
  }
};
