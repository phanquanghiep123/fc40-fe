import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Typography } from '@material-ui/core';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import BBGHListForm from './FormSection';
import BBGHListTable from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class TotalWeightFileListPage extends React.Component {
  render() {
    const { ui } = this.props;
    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Cân Tổng Điều Phối
        </Typography>
        <BBGHListForm />
        <BBGHListTable ui={ui} />
      </div>
    );
  }
}

TotalWeightFileListPage.propTypes = { ui: PropTypes.object };

const withReducer = injectReducer({ key: 'totalWeightFileListPage', reducer });
const withSaga = injectSaga({ key: 'totalWeightFileListPage', saga });

export default compose(
  withReducer,
  withSaga,
  withImmutablePropsToJs,
)(TotalWeightFileListPage);
