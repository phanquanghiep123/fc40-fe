import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Field, getIn } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import * as GoodsWeight from 'components/GoodsWeight/components';

import { TYPE_PXK } from '../constants';

import { connectContext } from '../connect';
import { getProductDisplayName } from '../utils';

import { ProductSchema } from './Schema';

export class Section1 extends React.Component {
  getSubType() {
    return getIn(this.props.formik.values, 'subType');
  }

  getExportedQuantity() {
    return getIn(this.props.formik.values, 'exportedQuantity');
  }

  getInventoryQuantity() {
    return getIn(this.props.formik.values, 'inventoryQuantity');
  }

  onProductChange = event => {
    const productId = event.target.value;
    const { formik, context, products } = this.props;

    const foundData = products.find(item => item && item.id === productId);

    const updaterData = {
      ...formik.values,
      ...ProductSchema.cast(foundData, {
        stripUnknown: true,
      }),
      documentDetailId: productId,
      baseUoM: foundData.uom,
      basketPallet: {},
      turnToScales: [],
    };

    context.setInitWeightPopup(updaterData);
    context.onGetProductTurnScales(productId);
  };

  render() {
    const { products } = this.props;

    const subType = this.getSubType();
    const exportedQuantity = this.getExportedQuantity();
    const inventoryQuantity = this.getInventoryQuantity();

    return (
      <GoodsWeight.Section1>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Field
              name="documentDetailId"
              label="Mã Sản Phẩm"
              component={MuiInput}
              select
              options={products}
              disabled={false}
              valueKey="id"
              getOptionLabel={getProductDisplayName}
              InputLabelProps={{
                shrink: true,
              }}
              onInputChange={this.onProductChange}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <Grid container>{renderSubtypeField(subType)}</Grid>
          </Grid>
          <Grid item sm={12} md={6}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  name="inventoryQuantity"
                  label="Số Lượng Tồn"
                  disabled
                  component={MuiInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="exportedQuantity"
                  label="Số Lượng Thực"
                  disabled
                  component={MuiInput}
                  InputProps={{
                    style: {
                      color:
                        exportedQuantity > inventoryQuantity
                          ? 'red'
                          : 'inherit',
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </GoodsWeight.Section1>
    );
  }
}

Section1.propTypes = {
  formik: PropTypes.object,
  context: PropTypes.shape({
    setInitWeightPopup: PropTypes.func,
    onGetProductTurnScales: PropTypes.func,
  }),
  products: PropTypes.array,
};

Section1.defaultProps = {
  products: [],
};

// ***************************************
// private component
function renderSubtypeField(subtype) {
  switch (subtype) {
    case TYPE_PXK.PXK_DIEU_CHUYEN:
      return (
        <Fragment>
          <Grid item xs={12}>
            <Field
              name="processingTypeName"
              label="Phân Loại Xử Lý"
              disabled
              component={MuiInput}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              name="locatorName"
              label="Kho Nguồn"
              disabled
              component={MuiInput}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Fragment>
      );

    case TYPE_PXK.PXK_NOI_BO:
      return (
        <Fragment>
          <Grid item xs={12}>
            <Field
              name="locatorNameFrom"
              label="Kho Nguồn"
              disabled
              component={MuiInput}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              name="locatorNameTo"
              label="Kho Đích"
              disabled
              component={MuiInput}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Fragment>
      );
    case TYPE_PXK.PXK_XUAT_BAN:
    case TYPE_PXK.PXK_XUAT_BAN_XA:
      return (
        <Grid item xs={12}>
          <Field
            name="locatorName"
            label="Kho Nguồn"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      );

    default:
      return null;
  }
}

export default connectContext(Section1);
