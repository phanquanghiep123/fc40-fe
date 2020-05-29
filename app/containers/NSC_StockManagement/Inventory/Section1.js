import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import InputControl from 'components/InputControl';
import PropTypes from 'prop-types';

export const styles = theme => ({
  overload: {
    color: '#f00 !important',
  },
  labelShrink: {
    width: 250,
  },
  textStatus: {
    color: theme.palette.color2,
    padding: theme.spacing.unit / 4,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.utils.fade(
      theme.palette.color2,
      theme.palette.transparency,
    ),
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class Section1 extends React.Component {
  render() {
    return (
      <Expansion
        title="I. Thông Tin Sản Phẩm"
        content={
          <Grid container justify="space-between">
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="product.locatorName"
                    label="Kho nguồn"
                    disabled
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.productCode"
                    label="Mã sản phẩm"
                    component={InputControl}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.productName"
                    label="Tên sản phẩm"
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.inventoryQuantity"
                    label="Số lượng tồn"
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.stockTakingQuantity"
                    label="Số lượng kiểm kê"
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="product.batch"
                    label="Batch"
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.uom"
                    label="Đơn vị"
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.differentRatio"
                    label="Chênh lệch"
                    component={InputControl}
                    disabled
                    style={{ color: 'red' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="product.reasonDifference"
                    label="Lý do chênh lệch"
                    multiline
                    rows="4"
                    required
                    component={InputControl}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.props.formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    );
  }
}

Section1.propTypes = {
  formik: PropTypes.object,
};

export default compose(withImmutablePropsToJS)(Section1);
