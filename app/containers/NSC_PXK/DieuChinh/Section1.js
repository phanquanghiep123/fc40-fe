import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';
import MuiInputPeriod from 'components/MuiInput/Period';
import MuiSelectAsync from 'components/MuiSelect/Async';
import MuiSelectInput from 'components/MuiSelect/Input';

import NumberFormatter from 'components/NumberFormatter';
import DatePickerControl from 'components/PickersControl';

import { makeSelectData } from './selectors';
import { locatorRoutine, receiptsRoutine } from './routines';
import { getProductAuto, getFarmSupplierAuto } from './actions';

import { getLabelDisplay } from './utils';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  labelText: {
    fontSize: 16,
  },
  selectLarge: {
    width: 300,
  },
  selectMedium: {
    width: 250,
  },
  select: {
    paddingLeft: theme.spacing.unit * 1.5,
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
  },
  sectionContent: {
    marginTop: theme.spacing.unit * 2,
  },
});

export class Section1 extends React.Component {
  onDateChange = date => {
    this.props.formik.setFieldValue('processDate', date);
  };

  onPlantChange = option => {
    const updaterData = {
      plantCode: option.value,
      plantName: option.name,
    };

    this.onGetLocator(updaterData);
    this.onGetReceipts(updaterData);
  };

  onFarmSupplierChange = option => {
    const updaterData = {
      farmSupplierName: option ? option.name : '',
      farmSupplierCode: option ? option.value : '',
    };
    this.props.formik.updateValues(updaterData);
  };

  onGetLocator = params => {
    this.props.onGetLocator(params);
  };

  onGetReceipts = values => {
    const nextValues = {
      ...this.props.formik.values,
      ...values,
    };
    this.props.onGetReceipts(nextValues);
  };

  render() {
    const { classes, formik, organizations } = this.props;

    return (
      <section className={classes.section1}>
        <Grid container spacing={40}>
          <Grid item>
            <Grid container spacing={16} alignItems="center">
              <Grid item>
                <Typography
                  variant="h6"
                  className={classNames(classes.titleText, classes.labelText)}
                >
                  Đơn Vị
                </Typography>
              </Grid>
              <Grid item className={classes.selectLarge}>
                <Field
                  name="plantCode"
                  styles={{
                    dropdownIndicator: base => ({
                      ...base,
                    }),
                  }}
                  classes={{
                    input: classes.select,
                  }}
                  component={MuiSelectInput}
                  options={organizations}
                  valueKey="value"
                  labelKey="name"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  TextFieldProps={{
                    margin: 'none',
                    variant: 'filled',
                  }}
                  onChange={this.onPlantChange}
                />
              </Grid>
            </Grid>
          </Grid>
          {formik.values.locatorCode && (
            <Grid item>
              <Grid container spacing={16} alignItems="center">
                <Grid item>
                  <Typography
                    variant="h6"
                    className={classNames(classes.titleText, classes.labelText)}
                  >
                    Kho Nguồn
                  </Typography>
                </Grid>
                <Grid item className={classes.selectMedium}>
                  <MuiSelectInput
                    styles={{
                      dropdownIndicator: base => ({
                        ...base,
                      }),
                    }}
                    classes={{
                      input: classes.select,
                    }}
                    value={getLabelDisplay(
                      formik.values.locatorCode,
                      formik.values.locatorName,
                    )}
                    isDisabled
                    InputProps={{
                      disableUnderline: true,
                    }}
                    TextFieldProps={{
                      margin: 'none',
                      variant: 'filled',
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Card className={classNames(classes.section, classes.sectionContent)}>
          <CardContent className={classes.cardContent}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={12} md={6} lg={3}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Field
                          name="processDate"
                          label="Ngày Chia Chọn"
                          component={DatePickerControl}
                          style={{
                            marginTop: 5,
                          }}
                          onChange={this.onDateChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="farmSupplierName"
                          component={MuiSelectAsync}
                          valueKey="name"
                          labelKey="name"
                          isClearable
                          isMultiline={false}
                          promiseOptions={this.props.onGetFarmSupplierAuto}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          TextFieldProps={{
                            label: 'Farm/NCC',
                            margin: 'dense',
                          }}
                          onChange={this.onFarmSupplierChange}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Field
                      name="differentRate"
                      label="Tỷ Lệ Chênh Lệch"
                      component={MuiInputPeriod}
                      from={{
                        name: 'differentFrom',
                        value: formik.values.differentFrom,
                        placeholder: 'Từ',
                      }}
                      to={{
                        name: 'differentTo',
                        value: formik.values.differentTo,
                        placeholder: 'Đến',
                      }}
                      InputProps={{
                        inputComponent: NumberFormatter,
                        inputProps: {
                          isAllowed: true,
                          allowNegative: true,
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Field
                      name="productCode"
                      component={MuiSelectAsync}
                      valueKey="productCode"
                      labelKey="productCode"
                      sublabelKey="productDescription"
                      emptyValue=""
                      isClearable
                      isMultiline
                      promiseOptions={this.props.onGetProductAuto}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      TextFieldProps={{
                        label: 'Mã Sản Phẩm',
                        margin: 'dense',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Field
                      name="productName"
                      label="Tên Sản Phẩm"
                      component={MuiInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={8} justify="flex-end">
                  <Grid item>
                    <MuiButton
                      outline
                      className={classes.button}
                      onClick={formik.handleResetClick}
                    >
                      Bỏ Lọc
                    </MuiButton>
                  </Grid>
                  <Grid item>
                    <MuiButton
                      className={classes.button}
                      onClick={formik.handleSubmitClick}
                    >
                      Tìm Kiếm
                    </MuiButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </section>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  organizations: PropTypes.array,
  onGetLocator: PropTypes.func,
  onGetReceipts: PropTypes.func,
  onGetProductAuto: PropTypes.func,
  onGetFarmSupplierAuto: PropTypes.func,
};

Section1.defaultProps = {
  organizations: [],
};

export const mapStateToProps = createStructuredSelector({
  organizations: makeSelectData('master', 'organizations'),
});

export const mapDispatchToProps = dispatch => ({
  onGetLocator: params => dispatch(locatorRoutine.request({ params })),
  onGetReceipts: params => dispatch(receiptsRoutine.request({ params })),
  onGetProductAuto: (inputText, callback) =>
    dispatch(getProductAuto(inputText, callback)),
  onGetFarmSupplierAuto: (inputText, callback) =>
    dispatch(getFarmSupplierAuto(inputText, callback)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Section1);
