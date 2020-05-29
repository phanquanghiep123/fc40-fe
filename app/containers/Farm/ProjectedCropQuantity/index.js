import React from 'react';
import { compose } from 'redux';
import { Typography } from '@material-ui/core';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class ProjectedCropQuantity extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Kế Hoạch Sản Lượng
        </Typography>
        <FormSection />
        <TableSection />
      </div>
    );
  }
}

ProjectedCropQuantity.propTypes = {};

const withReducer = injectReducer({ key: 'projectedCropQuantity', reducer });
const withSaga = injectSaga({ key: 'projectedCropQuantity', saga });

export default compose(
  withReducer,
  withSaga,
)(ProjectedCropQuantity);
