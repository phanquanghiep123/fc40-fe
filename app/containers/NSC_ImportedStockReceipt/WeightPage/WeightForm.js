import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiSelectInput from 'components/MuiSelect/Input';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';

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
    marginTop: 10,
  },
});

export class WeightForm extends React.Component {
  onDefaultClick = () => {
    if (this.props.onDefaultClick) {
      this.props.onDefaultClick();
    }
  };

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
      <Card className={classNames(classes.section, classes.shrink)}>
        <CardHeader
          title="II. Thông Tin Khay Sọt"
          titleTypographyProps={{
            variant: 'h6',
          }}
          className={classes.header}
        />
        <CardContent className={classes.content}>
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
            <Grid item xs={12} className={classes.actions}>
              <Button text="Mặc Định" onClick={this.onDefaultClick} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

WeightForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  onDefaultClick: PropTypes.func,
};

WeightForm.defaultProps = {
  baskets: [],
  pallets: [],
};

const mapStateToProps = createStructuredSelector({
  baskets: makeSelectData('master', 'baskets'),
  pallets: makeSelectData('master', 'pallets'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(WeightForm)),
);
