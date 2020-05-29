import PropTypes from 'prop-types';

import merge from 'lodash/merge';

import CellRenderer from 'components/FormikUI/CellRenderer';

import GoodsTableEdit from '../BBGHEditPage/GoodsTable';
import { columns, defaultColDef } from '../BBGHCreatePage/GoodsTable/header';

export const columnsExtra = merge({}, columns, {
  isTranscoding: {
    cellRendererParams: {
      disabled: true,
    },
  },
  processingType: {
    field: 'processingTypeName',
    cellRendererFramework: CellRenderer,
  },
  actions: {
    hide: true,
  },
});

export default class GoodsTableView extends GoodsTableEdit {
  isEditing = () => false;

  isWatching = () => true;

  isSuppressEditing = () => true;
}

GoodsTableView.propTypes = {
  values: PropTypes.any,
};

GoodsTableView.defaultProps = {
  columns: columnsExtra,
  defaultColDef,
};
