import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import MuiSelectInput from 'components/MuiSelect/Input';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';
import Expansion from 'components/Expansion';
import { BasketSchema, PalletSchema } from './Schema';

import { makeSelectData } from './selectors';

import Button from './Button';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  content: {
    ...baseStyles(theme).content,
    height: 'calc(100% - 44px)',
  },
  actions: {
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
});

export class WeightForm extends React.Component {
  onDefaultClick = () => {
    if (this.props.onDefaultClick) {
      this.props.onDefaultClick();
    }
  };

  // formik = null;
  //
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
    const { classes, data } = this.props;
    return (
      <Expansion
        title="II. Thông Tin Khay Sọt"
        content={
          <Grid container spacing={16} className={classes.shrink}>
            <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
              <Grid container justify="space-between">
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field
                    name="basketPallet.palletBasketCode"
                    options={data.baskets}
                    component={MuiSelectInput}
                    valueKey="palletBasketCode"
                    labelKey="palletBasketCode"
                    sublabelKey="palletBasketName"
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
            <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
              <Grid container justify="space-between">
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field
                    name="basketPallet.palletCode"
                    options={data.pallets}
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
              </Grid>
            </Grid>
            <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
              <Grid container justify="space-between">
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
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
            <Grid item xs={12} className={classes.actions}>
              <Button text="Mặc Định" onClick={this.onDefaultClick} />
            </Grid>
          </Grid>
        }
      />
    );
  }
}

WeightForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  onDefaultClick: PropTypes.func,
  data: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(WeightForm)),
);
