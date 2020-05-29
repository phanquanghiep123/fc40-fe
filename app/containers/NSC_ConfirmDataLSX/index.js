import React from 'react';
import { compose } from 'redux';
import { Typography } from '@material-ui/core';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class ConfirmDataLSX extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography
          variant="h5"
          color="textPrimary"
          gutterBottom
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          Xác Nhận Dữ Liệu Tạo LSX
        </Typography>

        <FormSection />
        <TableSection />
      </React.Fragment>
    );
  }
}

const withReducer = injectReducer({ key: 'confirmDataLSX', reducer });
const withSaga = injectSaga({ key: 'confirmDataLSX', saga });

export default compose(
  withReducer,
  withSaga,
)(ConfirmDataLSX);
