import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import injectSaga from '../../../../utils/injectSaga';
import injectReducer from '../../../../utils/injectReducer';
import saga from './saga';
import reducer from './reducer';
import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
class InventoryReportListPage extends Component {
  render() {
    const { history, ui, match } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Báo Cáo Tồn Vật Lý Khay Sọt
        </Typography>
        <FormSection ui={ui} match={match} history={history} />
        <TableSection ui={ui} match={match} history={history} />
      </div>
    );
  }
}
InventoryReportListPage.propTypes = {
  history: PropTypes.object,
  ui: PropTypes.object,
  match: PropTypes.object,
};

const withReducer = injectReducer({
  key: 'PhysicalInventoryReport',
  reducer,
});
const withSaga = injectSaga({ key: 'PhysicalInventoryReport', saga });

export default compose(
  withReducer,
  withSaga,
)(InventoryReportListPage);
