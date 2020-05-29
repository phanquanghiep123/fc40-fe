import React from 'react';
// import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import injectSaga from '../../../utils/injectSaga';
import injectReducer from '../../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

// eslint-disable-next-line react/prefer-stateless-function
export class RetailListPage extends React.Component {
  render() {
    const { ui, history, match } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Phiếu Yêu Cầu Bán Xá
        </Typography>
        <FormSection history={history} />
        <TableSection ui={ui} match={match} history={history} />
      </div>
    );
  }
}

RetailListPage.propTypes = {
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};

const withReducer = injectReducer({ key: 'RetailListPage', reducer });
const withSaga = injectSaga({ key: 'RetailListPage', saga });

export default compose(
  withReducer,
  withSaga,
)(RetailListPage);
