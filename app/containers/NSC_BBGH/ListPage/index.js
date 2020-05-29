import React from 'react';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import BBGHListForm from './FormSection';
import BBGHListTable from './TableSection';

const Spacing = styled.div`
  margin-top: 24px;
`;

// eslint-disable-next-line react/prefer-stateless-function
export class DeliveryOrderListPage extends React.Component {
  render() {
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Biên Bản Giao Hàng
        </Typography>
        <BBGHListForm />
        <Spacing />
        <BBGHListTable />
      </div>
    );
  }
}

DeliveryOrderListPage.propTypes = {};

const withReducer = injectReducer({ key: 'deliveryRecordListPage', reducer });
const withSaga = injectSaga({ key: 'deliveryRecordListPage', saga });

export default compose(
  withReducer,
  withSaga,
  withImmutablePropsToJs,
)(DeliveryOrderListPage);
