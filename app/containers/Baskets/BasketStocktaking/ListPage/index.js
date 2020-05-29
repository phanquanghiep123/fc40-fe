import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import injectSaga from '../../../../utils/injectSaga';
import injectReducer from '../../../../utils/injectReducer';
import saga from './saga';
import reducer from './reducer';
import FormSection from './FormSection';
import TableSection1 from './TableSection1';
import TableSection2 from './TableSection2';

// eslint-disable-next-line react/prefer-stateless-function
class BasketStocktaking extends Component {
  render() {
    const { history, ui, match } = this.props;
    return (
      <div style={{ margin: '15px 0px' }}>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          BÁO CÁO KẾT QUẢ KIỂM KÊ
        </Typography>
        <FormSection ui={ui} match={match} history={history} />
        <TableSection1 ui={ui} match={match} history={history} /> &emsp;
        <TableSection2 ui={ui} match={match} history={history} />
      </div>
    );
  }
}
BasketStocktaking.propTypes = {
  history: PropTypes.object,
  ui: PropTypes.object,
  match: PropTypes.object,
};

const withReducer = injectReducer({
  key: 'BasketStocktaking',
  reducer,
});
const withSaga = injectSaga({ key: 'BasketStocktaking', saga });

export default compose(
  withReducer,
  withSaga,
)(BasketStocktaking);
