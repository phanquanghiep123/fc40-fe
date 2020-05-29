import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';
import MuiSelectInput from 'components/MuiSelect/Input';
import NumberFormatter from 'components/NumberFormatter';

import { validDecimal } from 'components/NumberFormatter/utils';

import { BasketSchema, PalletSchema } from './Schema';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  actionButtons: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
});

export class GoodsWeightForm extends React.Component {
  onBasketChange = option => {
    this.props.formik.updateFieldValue(
      'basketPallet',
      BasketSchema.cast(option || undefined),
    );
  };

  onPalletChange = option => {
    this.props.formik.updateFieldValue(
      'basketPallet',
      PalletSchema.cast(option || undefined),
    );
  };

  render() {
    const { classes, baskets, pallets } = this.props;

    return (
      <Grid container spacing={8} className={classes.shrink}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="basketPallet.basketCode"
                    options={baskets}
                    component={MuiSelectInput}
                    valueKey="basketCode"
                    labelKey="basketCode"
                    sublabelKey="basketName"
                    isClearable
                    isMultiline
                    isSearchable
                    TextFieldProps={{
                      label: 'Mã Khay Sọt',
                      margin: 'dense',
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.onBasketChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="basketPallet.palletCode"
                    options={pallets}
                    component={MuiSelectInput}
                    valueKey="palletCode"
                    labelKey="palletCode"
                    sublabelKey="palletName"
                    isClearable
                    isMultiline
                    isSearchable
                    TextFieldProps={{
                      label: 'Mã Pallet',
                      margin: 'dense',
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.onPalletChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="basketPallet.palletQuantity"
                    label="Số Pallet"
                    valueKey="id"
                    labelKey="name"
                    component={MuiInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatter,
                      inputProps: {
                        isAllowed: validDecimal,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.actionButtons}>
          <MuiButton onClick={this.props.onDefaultClick}>Mặc Định</MuiButton>
        </Grid>
      </Grid>
    );
  }
}

GoodsWeightForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  onDefaultClick: PropTypes.func,
};

GoodsWeightForm.defaultProps = {
  baskets: [],
  pallets: [],
};

export default withStyles(styles)(GoodsWeightForm);
