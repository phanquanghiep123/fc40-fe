import React from 'react';
import PropTypes from 'prop-types';

import { Field, getIn } from 'formik';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import NumberFormat from 'react-number-format';

import MuiInput from 'components/MuiInput';

import { formatToDecimal } from 'utils/numberUtils';

import { makeSelectData } from './selectors';

import { TYPE_USER, TYPE_IMPORT, PRODUCT_STATUS } from './constants';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
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

export const PercentFormatter = ({ inputRef, onChange, ...props }) => (
  <NumberFormat
    {...props}
    suffix="%"
    isAllowed={values => {
      if (values.value.length <= 3) {
        if (
          values.formattedValue === '' || // empty
          (!/^0./g.test(values.value) && // 0%, not 0*%
            values.floatValue >= 0 &&
            values.floatValue <= 100) // [0%, 100%]
        ) {
          return true;
        }
      }
      return false;
    }}
    getInputRef={inputRef}
    onValueChange={values =>
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      })
    }
  />
);

export class Section1 extends React.Component {
  getTypeUser() {
    return getIn(this.props.formik.values, 'isSupplier');
  }

  getRealQuantity() {
    return getIn(this.props.formik.values, 'quantity');
  }

  getProductStatus() {
    return getIn(this.props.formik.values, 'documentDetailStatus');
  }

  getDeliveryPallet() {
    return getIn(this.props.formik.values, 'deliveryPallet');
  }

  getDefaultQuantity() {
    return getIn(this.props.formik.values, 'defaultQuantity');
  }

  getLossRate() {
    const quantity = this.getRealQuantity();
    const planedQuantity = getIn(this.props.formik.values, 'planedQuantity');

    if (quantity > 0 && planedQuantity > 0) {
      // Tỷ lệ hao hụt = (SL dự kiến - SL thực tế) / SL dự kiến
      const lossRate = ((planedQuantity - quantity) / planedQuantity) * 100;
      return formatToDecimal(lossRate);
    }

    return undefined;
  }

  isLossRateOver(lossRate) {
    const { recoveryRate } = this.props;

    if (lossRate !== undefined) {
      // SL dự kiến > SL thực tế, > 5% -> Hiển thị chữ đỏ
      if (lossRate > 0) {
        if (lossRate > recoveryRate.MaxRecoveryRateOver) {
          return true;
        }
      }

      // SL dự kiến < SL thực tế, > 2% -> Hiển thị chữ đỏ
      if (lossRate < 0) {
        if (-lossRate > recoveryRate.MaxRecoveryRateUnder) {
          return true;
        }
      }
    }

    return false;
  }

  getRecoveryQuantity() {
    // Khối lượng khấu trừ = Khối lượng thực tế * Tỷ lệ khấu trừ
    const quantity = this.getRealQuantity();
    const recoveryRate = getIn(this.props.formik.values, 'recoveryRate');
    return formatToDecimal((quantity * recoveryRate) / 100);
  }

  getTotalBasketQuantity() {
    let totalQuantity = 0;
    const turnToScales = getIn(this.props.formik.values, 'turnToScales');

    if (turnToScales && turnToScales.length > 0) {
      for (let i = 0, len = turnToScales.length; i < len; i += 1) {
        const turnScale = turnToScales[i];

        if (turnScale && turnScale.basketQuantity > 0) {
          totalQuantity += turnScale.basketQuantity * 1;
        }
      }
    }

    return totalQuantity;
  }

  getProcessingTypeStatus() {
    const typeUser = this.getTypeUser();
    const importType = getIn(this.props.formik.values, 'importType');

    if (typeUser === TYPE_USER.NCC && importType === TYPE_IMPORT.IMPORT_RIGHT) {
      return true;
    }
    return false;
  }

  isRecoveryRateEditable() {
    const productStatus = this.getProductStatus();
    const defaultQuantity = this.getDefaultQuantity();

    if (productStatus === PRODUCT_STATUS.COMPLETED) {
      return false;
    }
    if (productStatus === PRODUCT_STATUS.WEIGHT) {
      if (defaultQuantity > 0) {
        return false;
      }
    }
    return true;
  }

  render() {
    const { classes, processingType } = this.props;

    const typeUser = this.getTypeUser();
    const lossRate = this.getLossRate();

    const realQuantity = this.getRealQuantity();
    const recoveryQuantity = this.getRecoveryQuantity();

    const totalBasketQuantity = this.getTotalBasketQuantity();

    const productStatus = this.getProductStatus();
    const deliveryPallet = this.getDeliveryPallet();

    const isLossRateOver = this.isLossRateOver(lossRate);
    const isRecoveryRateEditable = this.isRecoveryRateEditable();

    return (
      <Card className={classNames(classes.section, classes.shrink)}>
        <CardHeader
          title={
            <Grid container spacing={8} alignItems="center">
              <Grid item>I. Thông Tin Sản Phẩm</Grid>
              {productStatus === PRODUCT_STATUS.COMPLETED && (
                <Grid item>
                  <Typography className={classes.textStatus}>
                    Hoàn thành cân
                  </Typography>
                </Grid>
              )}
            </Grid>
          }
          titleTypographyProps={{
            variant: 'h6',
          }}
          className={classes.header}
        />
        <CardContent className={classes.content}>
          <Grid container justify="space-between">
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="processingType"
                    label="Phân Loại Xử Lý"
                    select
                    options={processingType}
                    labelKey="name"
                    valueKey="id"
                    disabled
                    component={MuiInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="baseUoM"
                    label="Đơn Vị"
                    disabled
                    component={MuiInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {typeUser === TYPE_USER.NCC && (
                  <Grid item xs={12}>
                    <Field
                      name="finshedProductCode"
                      label="Mã Thành Phẩm"
                      disabled
                      component={MuiInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {typeUser === TYPE_USER.NCC && (
                  <Grid item xs={12}>
                    <Field
                      name="finshedProductName"
                      label="Tên Thành Phẩm"
                      disabled
                      component={MuiInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    name="planedQuantity"
                    label="Tổng Lượng Dự Kiến"
                    disabled
                    component={MuiInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="quantity"
                    label="Tổng Lượng Thực Tế"
                    disabled
                    component={MuiInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {typeUser === TYPE_USER.NCC && (
                  <Grid item xs={12}>
                    <Grid container justify="space-between">
                      <Grid item xs={9}>
                        <MuiInput
                          label="Tổng Lượng (Sau Khấu Trừ)"
                          value={formatToDecimal(
                            realQuantity - recoveryQuantity,
                          )}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                            classes: {
                              shrink: classes.labelShrink,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Field
                          name="recoveryRate"
                          label="&nbsp;"
                          disabled={!isRecoveryRateEditable}
                          component={MuiInput}
                          helperText="Tỉ lệ"
                          InputProps={{
                            inputComponent: PercentFormatter,
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {typeUser === TYPE_USER.NCC && (
                  <Grid item xs={12}>
                    <MuiInput
                      label="Tổng Lượng Khấu Trừ"
                      value={recoveryQuantity}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            {typeUser === TYPE_USER.FARM && (
              <Grid item xs={12}>
                <Grid container justify="space-between">
                  <Grid item xs={12} sm={5}>
                    <MuiInput
                      label="Khay Sọt (Giao/Nhận)"
                      value={`${deliveryPallet}/${totalBasketQuantity}`}
                      disabled
                      InputProps={{
                        className: classNames(
                          deliveryPallet !== totalBasketQuantity &&
                            classes.overload,
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <MuiInput
                      label="Tỷ Lệ Hao Hụt"
                      value={lossRate !== undefined ? Math.abs(lossRate) : ''}
                      disabled
                      InputProps={{
                        className: classNames(
                          isLossRateOver && classes.overload,
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  recoveryRate: PropTypes.object,
  processingType: PropTypes.array,
};

Section1.defaultProps = {
  recoveryRate: {
    MaxRecoveryRateOver: null,
    MaxRecoveryRateUnder: null,
  },
  processingType: [],
};

const mapStateToProps = createStructuredSelector({
  recoveryRate: makeSelectData('master', 'recoveryRate'),
  processingType: makeSelectData('master', 'processingType'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(Section1)),
);
