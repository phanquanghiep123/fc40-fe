import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import { AbilityContext, Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import ability from 'authorize/ability';
// eslint-disable-next-line react/prefer-stateless-function
class RendererActions extends Component {
  render() {
    const { addRow, cancel, save, update, data } = this.props;
    if (data.rowSpan !== undefined) {
      return (
        <div>
          {data.editMode && (
            <div>
              <Tooltip
                style={{ marginLeft: 6, marginRight: 6, cursor: 'pointer' }}
                title="Lưu"
                onClick={save}
              >
                <SaveIcon />
              </Tooltip>
              <Tooltip
                style={{ marginLeft: 6, marginRight: 6, cursor: 'pointer' }}
                onClick={cancel}
                title="Huỷ Bỏ"
              >
                <CancelIcon />
              </Tooltip>
            </div>
          )}
          {!data.editMode && (
            <AbilityContext.Provider value={ability}>
              <Can do={CODE.suaKHTH} on={SCREEN_CODE.KHTH}>
                <Tooltip
                  style={{
                    color: 'green',
                    marginLeft: 6,
                    marginRight: 6,
                    cursor: 'pointer',
                  }}
                  title="Thêm"
                  onClick={addRow}
                >
                  <AddIcon />
                </Tooltip>
                <Tooltip
                  style={{ marginLeft: 6, marginRight: 6, cursor: 'pointer' }}
                  title="Sửa"
                  onClick={update}
                >
                  <EditIcon />
                </Tooltip>
              </Can>
            </AbilityContext.Provider>
          )}
        </div>
      );
    }
    return null;
  }
}

RendererActions.propTypes = {
  addRow: PropTypes.func,
  save: PropTypes.func,
  cancel: PropTypes.func,
  update: PropTypes.func,
  data: PropTypes.object,
};

export default RendererActions;
