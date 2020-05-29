import React from 'react';
import { Field } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import MuiInput from 'components/MuiInput';
import MuiSelectInput from 'components/MuiSelect/Input';
import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';
import MuiButton from 'components/MuiButton';
import PropTypes from 'prop-types';
import { getDataMaster } from './selectors';
import { BasketSchema, PalletSchema } from './Schema';

export const styles = () => ({
  content: {
    height: 'calc(100% - 44px)',
  },
  actions: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    marginTop: 20,
  },
});

export class Section2 extends React.Component {
  onBasketChange = option => {
    this.props.formik.updateFieldValue(
      'basket',
      BasketSchema.cast(option || undefined),
    );
  };

  onPalletChange = option => {
    this.props.formik.updateFieldValue(
      'pallet',
      PalletSchema.cast(option || undefined),
    );
  };

  onDefaultClick = () => {
    this.props.onDefaultClick();
  };

  render() {
    const { dataMaster, classes } = this.props;
    return (
      <Expansion
        title="II. Thông Tin Khay Sọt"
        content={
          <Grid item container spacing={8} xs={12} md={12}>
            <Grid item md={6} xs={6}>
              <Grid item md={11}>
                <Field
                  name="basket.palletBasketCode"
                  component={MuiSelectInput}
                  options={dataMaster.baskets}
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
            <Grid item md={6} xs={6}>
              <Field
                name="pallet.palletCode"
                component={MuiSelectInput}
                options={dataMaster.pallets}
                valueKey="palletCode"
                labelKey="palletCode"
                sublabelKey="palletCode"
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
              <Field
                name="basket.palletQuantity"
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
              <Grid item md={12} className={classes.actions}>
                <MuiButton onClick={this.onDefaultClick}>Mặc định</MuiButton>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    );
  }
}

Section2.propTypes = {
  formik: PropTypes.object,
  dataMaster: PropTypes.object,
  onDefaultClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

Section2.defaultProps = {};

const mapStateToProps = createStructuredSelector({
  dataMaster: getDataMaster('master'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(Section2)),
);
