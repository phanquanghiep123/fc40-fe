import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Expansion from 'components/Expansion';
import MuiButton from 'components/MuiButton';
import Grid from '@material-ui/core/Grid';
import formikPropsHelpers, { updateFieldArrayValue } from 'utils/formikUtils';
import { alertInvalidWhenSubmit } from 'containers/App/actions';
import ProductTable from './ProductTable';
import BasketTrayTable from './BasketTrayTable';
import { TYPE_FORM } from '../PXK/Business';
import { suggestFromTurnToScale } from './actions';
import Suggest from './Suggest';
export class Sell extends React.Component {
  state = {
    showDialog: false,
  };

  handleAddRecord = () => {
    if (this.tableRef && this.tableRef.addRecord) {
      this.tableRef.addRecord();
    }
  };

  suggestFromTurnToScale = () => {
    const { formik, onSuggestFromTurnToScale } = this.props;
    onSuggestFromTurnToScale(formik.values);
    this.setState({ showDialog: true });
  };

  onCloseDialog = () => {
    this.setState({ showDialog: false });
  };

  renderButtonAdd = () => (
    <React.Fragment>
      <MuiButton icon="note_add" outline onClick={this.handleAddRecord} />
      <MuiButton
        className={this.props.classes.buttonSpace}
        onClick={this.suggestFromTurnToScale}
      >
        Gợi Ý Từ Lần Cân
      </MuiButton>
    </React.Fragment>
  );

  render() {
    const {
      formik,
      form,
      classes,
      warehouse,
      onGetProducts,
      onGetBasketAuto,
      onShowWarning,
      onDeleteRow,
      onAlertInvalidWhenSubmit,
      history,
      ui,
    } = this.props;
    const { showDialog } = this.state;
    const ButtonAdd = this.renderButtonAdd();
    const newFormik = { ...formik, ...formikPropsHelpers(formik) };
    return (
      <React.Fragment>
        {showDialog && (
          <ui.Dialog
            title="Gợi Ý Từ Lần Lần Cân"
            maxWidth="lg"
            fullWidth
            openDl={showDialog}
            isDialog={false}
            content={
              <Suggest
                onCloseDialog={this.onCloseDialog}
                formik={newFormik}
                {...formik.values}
              />
            }
            customActionDialog
          />
        )}
        <Grid item md={12}>
          <Expansion
            rightActions={form !== TYPE_FORM.VIEW ? ButtonAdd : null}
            title="II.Thông tin sản phẩm xuất kho"
            content={
              <ProductTable
                ref={ref => {
                  this.tableRef = ref;
                }}
                form={form}
                sync={onGetProducts}
                history={history}
                formik={newFormik}
                values={newFormik.values}
                setFieldValue={newFormik.setFieldValue}
                updateFieldArrayValue={updateFieldArrayValue(formik)}
                warehouse={warehouse}
                onGetBasketAuto={onGetBasketAuto}
                onShowWarning={onShowWarning.confirm}
                onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
                onDeleteRow={onDeleteRow}
              />
            }
          />
        </Grid>

        <Grid item md={6} className={classes.spaceTop}>
          <Expansion
            title="III. Thông Tin Khay Sọt"
            content={<BasketTrayTable formik={formik} />}
          />
        </Grid>
      </React.Fragment>
    );
  }
}
Sell.propTypes = {
  formik: PropTypes.object,
  classes: PropTypes.object,
  form: PropTypes.string,
  warehouse: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  history: PropTypes.object,
  onGetProducts: PropTypes.func,
  onGetBasketAuto: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSuggestFromTurnToScale: PropTypes.func,
  onShowWarning: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
    onSuggestFromTurnToScale: payload =>
      dispatch(suggestFromTurnToScale(payload)),
  };
}
const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Sell);
