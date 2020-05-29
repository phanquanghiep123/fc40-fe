import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import MuiButton from 'components/MuiButton';
import formikPropsHelpers from 'utils/formikUtils';

import WrapperBusiness, { CODE } from './Business';
import Table from './Table';

class PXKDestroy extends React.Component {
  tableRef = null;

  addRecords = () => {
    if (this.tableRef) {
      this.tableRef.addRecords(1);
    }
  };

  render() {
    const {
      formik,
      classesParent,
      warehouse,
      onShowWarning,
      form,
      onDeleteRow,
      onGetProducts,
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
                    onShowWarning={onShowWarning.confirm}
                    form={form}
                    onDeleteRow={onDeleteRow}
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

PXKDestroy.propTypes = {
  classesParent: PropTypes.object,
  warehouse: PropTypes.array,
  onGetProducts: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onShowWarning: PropTypes.object,
  formik: PropTypes.object,
  form: PropTypes.string,
};

export default PXKDestroy;
