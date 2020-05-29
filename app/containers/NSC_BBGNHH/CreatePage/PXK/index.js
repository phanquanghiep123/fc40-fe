import React from 'react';

import ForVinLog from './ForVinLog';
import ForOther from './ForOther';

import WrapperBusiness from '../Business';

export default function PXK(props) {
  return (
    <WrapperBusiness>
      {({ isVinLog }) => {
        if (isVinLog) {
          return <ForVinLog {...props} />;
        }
        return <ForOther {...props} />;
      }}
    </WrapperBusiness>
  );
}
