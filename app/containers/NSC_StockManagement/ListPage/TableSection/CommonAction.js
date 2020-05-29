import React from 'react';
import PropTypes from 'prop-types';
import { GoChecklist } from 'react-icons/go';
import { Tooltip } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import { AbilityContext, Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import ability from 'authorize/ability';

export default function CommonAction({ inventory, assess }) {
  return (
    <div>
      <AbilityContext.Provider value={ability}>
        <Can do={CODE.danhgiaSP} on={SCREEN_CODE.QLK}>
          <Tooltip
            onClick={assess}
            style={{ marginRight: 6, cursor: 'pointer' }}
            title="Đánh Giá"
          >
            <Edit size={24} />
          </Tooltip>
        </Can>
        <Can do={CODE.kiemkeSP} on={SCREEN_CODE.QLK}>
          <Tooltip
            onClick={inventory}
            style={{ marginLeft: 6, cursor: 'pointer' }}
            title="Kiểm Kê"
          >
            <GoChecklist size={24} />
          </Tooltip>
        </Can>
      </AbilityContext.Provider>
    </div>
  );
}

CommonAction.propTypes = {
  inventory: PropTypes.func,
  assess: PropTypes.func,
};
