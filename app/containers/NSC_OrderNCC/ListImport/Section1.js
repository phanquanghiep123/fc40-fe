import React from 'react';
import PropTypes from 'prop-types';

import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';

import PeriodPicker from 'components/PeriodPicker';
import CheckboxControl from 'components/CheckboxControl';
import DatePickerControl from 'components/PickersControl';

import { openImportFile } from './actions';

import { makeSelectData } from './selectors';
import { regionOption, orderTypeOption } from './data';

import { TYPE_ORDER } from './constants';

import styles from './styles';

export class Section1 extends React.Component {
  onImportFileOpen = () => {
    this.props.onImportFileOpen();
  };

  onImportTypeChange = event => {
    const importType = event.target.value;

    let dateTo = null;
    let dateFrom = null;

    switch (importType) {
      case TYPE_ORDER.BY_DATE: {
        dateTo = new Date();
        dateFrom = new Date();
        break;
      }

      case TYPE_ORDER.BY_WEEK: {
        dateTo = endOfWeek(new Date(), { weekStartsOn: 1 });
        dateFrom = startOfWeek(new Date(), { weekStartsOn: 1 });
        break;
      }

      default:
        break;
    }

    const updaterData = {
      importType,
      dateTo,
      dateFrom,
    };
    this.props.formik.updateValues(updaterData);
  };

  render() {
    const { classes, formik } = this.props;

    return (
      <Card className={classes.section}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Field
                        name="importType"
                        label="Loại Đặt Hàng"
                        component={MuiInput}
                        select
                        options={[orderTypeOption, ...this.props.orderTypes]}
                        valueKey="id"
                        labelKey="name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onInputChange={this.onImportTypeChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="date"
                        label="Ngày Đặt Hàng"
                        component={PeriodPicker}
                        from={{
                          name: 'dateFrom',
                          value: formik.values.dateFrom,
                        }}
                        to={{
                          name: 'dateTo',
                          value: formik.values.dateTo,
                        }}
                        style={{
                          marginTop: 5,
                        }}
                        labelStyle={{
                          fontWeight: 'bold',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Field
                    name="productionRegion"
                    label="Vùng Sản Xuất"
                    component={MuiInput}
                    select
                    options={[regionOption, ...this.props.regions]}
                    valueKey="value"
                    labelKey="name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Field
                    name="consumeRegion"
                    label="Vùng Tiêu Thụ"
                    component={MuiInput}
                    select
                    options={[regionOption, ...this.props.regions]}
                    valueKey="value"
                    labelKey="name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Field
                        name="importDate"
                        label="Ngày Import"
                        component={DatePickerControl}
                        style={{
                          marginTop: 5,
                        }}
                        clearable
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="isAllVersion"
                        label="Tất Cả Version"
                        component={CheckboxControl}
                        labelPlacement="end"
                      />
                    </Grid>
                  </Grid>
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
                <Grid item>
                  <Can do={CODE.suaDHNCC} on={SCREEN_CODE.DHNCC}>
                    <MuiButton
                      className={classes.button}
                      onClick={this.onImportFileOpen}
                    >
                      Tải Lên
                    </MuiButton>
                  </Can>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  regions: PropTypes.array,
  orderTypes: PropTypes.array,
  onImportFileOpen: PropTypes.func,
};

Section1.defaultProps = {
  regions: [],
  orderTypes: [],
};

export const mapStateToProps = createStructuredSelector({
  regions: makeSelectData('master', 'regions'),
  orderTypes: makeSelectData('master', 'orderTypes'),
});

export const mapDispatchToProps = dispatch => ({
  onImportFileOpen: () => dispatch(openImportFile()),
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
