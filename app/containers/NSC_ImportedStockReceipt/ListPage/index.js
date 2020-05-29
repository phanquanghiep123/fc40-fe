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
export class ImportStockListPage extends React.Component {
  init = () => {
    // const {
    //   location: { search },
    // } = this.props;
    // console.log(search);
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const { ui, history, match } = this.props;
    return (
      <div>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Danh Sách Phiếu Cân Nhập Kho
        </Typography>

        <FormSection />
        <TableSection ui={ui} match={match} history={history} />
      </div>
    );
  }
}

ImportStockListPage.propTypes = {
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};

const withReducer = injectReducer({ key: 'ImportStockListPage', reducer });
const withSaga = injectSaga({ key: 'ImportStockListPage', saga });

export default compose(
  withReducer,
  withSaga,
)(ImportStockListPage);
