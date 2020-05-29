/**
 *
 * HarvestPlan
 *
 */

import React from 'react';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Typography } from '@material-ui/core';
import FormSection from './FormSection/index';
import reducer from './reducer';
import saga from './saga';
import TableSection from './TableSection/index';

/* eslint-disable react/prefer-stateless-function */
export class HarvestPlan extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Kế Hoạch Thu Hoạch
        </Typography>
        <FormSection />
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <TableSection />
        </div>
      </div>
    );
  }
}

HarvestPlan.propTypes = {};

const withReducer = injectReducer({ key: 'harvestPlan', reducer });
const withSaga = injectSaga({ key: 'harvestPlan', saga });

export default compose(
  withReducer,
  withSaga,
)(HarvestPlan);
