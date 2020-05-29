import React from 'react';
import PropTypes from 'prop-types';
import { sumBy, formatToCurrency } from 'utils/numberUtils';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import MuiButton from 'components/MuiButton';
import formikPropsHelpers from 'utils/formikUtils';

import WrapperBusiness, { CODE } from './Business';
import Table from './Table';

class PXKInternal extends React.Component {
  tableRef = null;

  addRecords = () => {
    if (this.tableRef) {
      this.tableRef.addRecords();
    }
  };

  getTotal = formik => {
    const result = [];
    if (formik.values.detailsCommands.length > 0) {
      result.push({
        totalCol: true,
        inventoryQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'inventoryQuantity'),
        ),
        exportedQuantity: formatToCurrency(
          sumBy(formik.values.detailsCommands, 'exportedQuantity'),
        ),
        locatorNameTo: 'Tổng',
      });
    }
    return result;
  };

  render() {
    const {
      form,
      formik,
      warehouse,
      history,
      onDeleteRow,
      onGetProducts,
      onGetBatchAuto,
      classesParent,
      onShowWarning,
    } = this.props;

    return (
      <Grid container tabIndex="-1" className={classesParent.clearOutline}>
        <Grid container>
          <Expansion
            rightActions={
              <WrapperBusiness
                formik={formik}
                code={CODE.BUTTON_ADD_ROW}
                typeForm={form}
              >
                <MuiButton
                  icon="note_add"
                  outline
                  className={classesParent.add}
                  onClick={this.addRecords}
                />
              </WrapperBusiness>
            }
            unmountOnExit={false}
            title="II. Thông Tin Sản Phẩm Xuất Kho"
            content={
              <Grid container>
                <Grid container>
                  <Table
                    ref={ref => {
                      this.tableRef = ref;
                    }}
                    classesParent={classesParent}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                    warehouse={warehouse}
                    onGetProducts={onGetProducts}
                    onGetBatchAuto={onGetBatchAuto}
                    onShowWarning={onShowWarning.confirm}
                    form={form}
                    onDeleteRow={onDeleteRow}
                    history={history}
                    pinnedBottomRowData={this.getTotal(formik)}
                  />
                </Grid>
              </Grid>
            }
          />
        </Grid>
      </Grid>
    );
  }
}

PXKInternal.propTypes = {
  classesParent: PropTypes.object,
  warehouse: PropTypes.array,
  onGetProducts: PropTypes.func,
  onGetBatchAuto: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onShowWarning: PropTypes.object,
  formik: PropTypes.object,
  form: PropTypes.string,
  history: PropTypes.object,
};

export default PXKInternal;
