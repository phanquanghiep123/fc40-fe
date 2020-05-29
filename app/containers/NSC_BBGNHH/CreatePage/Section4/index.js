import React from 'react';

import Expansion from 'components/Expansion';

import ForICD from './ForICD';
import ForVinLog from './ForVinLog';
import ForOther from './ForOther';

import WrapperBusiness from '../Business';

export default function Section4(props) {
  return (
    <Expansion
      title="IV. Thông Tin Hàng Hóa"
      content={
        <WrapperBusiness>
          {({ isICD, isVinLog }) => {
            if (isICD) {
              return <ForICD {...props} />;
            }
            if (isVinLog) {
              return <ForVinLog {...props} />;
            }
            return <ForOther {...props} />;
          }}
        </WrapperBusiness>
      }
      unmountOnExit={false}
    />
  );
}
