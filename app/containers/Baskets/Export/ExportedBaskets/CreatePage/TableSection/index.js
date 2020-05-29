import React from 'react';
import PropTypes from 'prop-types';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import appTheme from 'containers/App/theme';
import { showWarning } from 'containers/App/actions';
// import { formatToNumber, formatToDecimal, sumBy } from 'utils/numberUtils';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
// import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import * as selectors from '../selectors';
import * as actions from '../actions';
import TableCreate from './TableCreate';
import TableEdit from './TableEdit';
import TableView from './TableView';

import { TYPE_FORM } from '../constants';

const styles = (theme = appTheme) => ({
  actions: {
    margin: theme.spacing.unit,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends React.PureComponent {
  render() {
    const { typeForm } = this.props;
    return (
      <React.Fragment>
        {typeForm === TYPE_FORM.CREATE && <TableCreate {...this.props} />}
        {typeForm === TYPE_FORM.EDIT && <TableEdit {...this.props} />}
        {typeForm === TYPE_FORM.VIEW && <TableView {...this.props} />}
      </React.Fragment>
    );
  }
}
TableSection.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  config: PropTypes.object,
  onAddRows: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDeleteRowServer: PropTypes.func,
  typeExported: PropTypes.number,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  formOption: PropTypes.object,
  onShowWarning: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  config: selectors.configData(),
  typeExported: selectors.typeExported(),
  formOption: selectors.formOptions(),
  dataValues: selectors.dataValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onShowWarning: message => dispatch(showWarning(message)),
    onAddRows: () => dispatch(actions.addRows()),
    onDeleteRow: rowIndex => dispatch(actions.deleteRow(rowIndex)),
    onDeleteRowServer: (tableData, rowIndex) =>
      dispatch(actions.deleteRowServer(tableData, rowIndex)),
    onUpdateDetailsCommand: payload => dispatch(actions.updateData(payload)),
    onFetchBasketsAutocomplete: (orgCode, values, typeExported, callback) =>
      dispatch(
        actions.fetchBasketsAutocomplete(
          orgCode,
          values,
          typeExported,
          callback,
        ),
      ),
    onChangeBasketsCode: payload =>
      dispatch(actions.changeBasketsCode(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJs,
  withStyles(styles),
)(TableSection);
