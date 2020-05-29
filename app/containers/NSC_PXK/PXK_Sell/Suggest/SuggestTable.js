import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import MuiTable from 'components/MuiTable';
import { makeColumnDefs } from './header';
import { makeSelectData } from '../../PXK/selectors';
import MTableBodyRowCustomized from '../../../NSC_Supplier/ListPage/TableSection/MTableBodyRowCustomized';
class SuggestTable extends React.PureComponent {
  render() {
    const columnDefs = makeColumnDefs();
    const { turnToScales, onHandleTableReady } = this.props;
    return (
      <MuiTable
        tableRef={onHandleTableReady}
        columns={columnDefs}
        data={turnToScales}
        options={{
          toolbar: false,
          selection: true,
        }}
        components={{
          Row: MTableBodyRowCustomized,
        }}
      />
    );
  }
}

SuggestTable.propTypes = {
  turnToScales: PropTypes.array,
  onHandleTableReady: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  turnToScales: makeSelectData('turnToScales'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);
export default compose(withConnect)(withImmutablePropsToJS(SuggestTable));
