import React from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';

import { Typography } from '@material-ui/core';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class ExportStockListPage extends React.Component {
  render() {
    const { match, ui, history } = this.props;
    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Phiếu Xuất Kho
        </Typography>

        <FormSection />
        <TableSection match={match} ui={ui} history={history} />
      </div>
    );
  }
}

ExportStockListPage.propTypes = {
  history: PropTypes.object,
  ui: PropTypes.object,
  match: PropTypes.object,
};

const withReducer = injectReducer({ key: 'ExportStockListPage', reducer });
const withSaga = injectSaga({ key: 'ExportStockListPage', saga });

export default compose(
  withReducer,
  withSaga,
)(ExportStockListPage);
