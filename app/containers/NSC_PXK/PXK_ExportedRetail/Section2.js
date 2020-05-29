import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import formikPropsHelpers, { updateFieldArrayValue } from 'utils/formikUtils';
import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import MuiButton from 'components/MuiButton';
import ProductTable from './ProductTable';

export default class ExportedRetailTable extends React.Component {
  handleAddRecord = () => {
    if (this.tableRef && this.tableRef.addRecord) {
      this.tableRef.addRecord();
    }
  };

  rendeRrightActions = form => (
    <React.Fragment>
      {form !== TYPE_FORM.VIEW && (
        <MuiButton icon="note_add" outline onClick={this.handleAddRecord} />
      )}
    </React.Fragment>
  );

  render() {
    const {
      formik,
      form,
      onDeleteRow,
      onShowWarning,
      onGetBasketAuto,
      warehouse,
      packingStyles,
      retailTypes,
      history,
      onGetProducts,
      onAlertInvalidWhenSubmit,
    } = this.props;
    const rightActions = this.rendeRrightActions(form);
    const newFormik = { ...formik, ...formikPropsHelpers(formik) };
    return (
      <Expansion
        rightActions={rightActions}
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
            packingStyles={packingStyles}
            retailTypes={retailTypes}
            onGetBasketAuto={onGetBasketAuto}
            onShowWarning={onShowWarning.confirm}
            onDeleteRow={onDeleteRow}
            onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
          />
        }
      />
    );
  }
}
ExportedRetailTable.propTypes = {
  formik: PropTypes.object,
  form: PropTypes.string,
  warehouse: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  packingStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  retailTypes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  history: PropTypes.object,
  onGetProducts: PropTypes.func,
  onGetBasketAuto: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onShowWarning: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
};
