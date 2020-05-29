import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';
import MuiSelectAsync from 'components/MuiSelect/Async';

import PeriodPicker from 'components/PeriodPicker';

import { getDeliverAuto } from './actions';
import { makeSelectData } from './selectors';

import styles from './styles';

export class Section1 extends React.Component {
  onFormSearch = (isSearch, handleSubmit) => () => {
    handleSubmit();
    this.props.onSearchChange(isSearch);
  };

  onDeliverChange = option => {
    const updaterData = {
      deliverOrgCodeName: option ? option.name : '',
      deliverOrgCode: option ? option.value : '',
    };
    this.props.formik.updateValues(updaterData);
  };

  render() {
    const {
      classes,
      formik,
      organizations,
      differentTypes,
      onGetDeliverAuto,
    } = this.props;

    return (
      <Card className={classes.section}>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} md={6} lg={3}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Field
                        name="documentCode"
                        label="Mã Phiếu Nhập Kho"
                        component={MuiInput}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="differentStatus"
                        label="Trạng Thái Điều Chỉnh"
                        component={MuiInput}
                        select
                        options={differentTypes}
                        valueKey="id"
                        labelKey="name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Field
                    name="date"
                    label="Ngày Nhập Kho"
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
                <Grid item xs={12} md={6} lg={3}>
                  <Field
                    name="receiverOrgCode"
                    label="Đơn Vị Nhận Hàng"
                    component={MuiInput}
                    select
                    options={organizations}
                    labelKey="name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Field
                    name="deliverOrgCodeName"
                    component={MuiSelectAsync}
                    valueKey="name"
                    labelKey="name"
                    isClearable
                    isMultiline={false}
                    promiseOptions={onGetDeliverAuto}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    TextFieldProps={{
                      label: 'Đơn Vị Giao Hàng',
                      margin: 'dense',
                    }}
                    onChange={this.onDeliverChange}
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
                    onClick={formik.handleReset}
                  >
                    Bỏ Lọc
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton
                    className={classes.button}
                    onClick={this.onFormSearch(true, formik.handleSubmit)}
                  >
                    Tìm Kiếm
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton
                    outline
                    className={classes.button}
                    onClick={this.onFormSearch(false, formik.handleSubmit)}
                  >
                    Tải Xuống
                  </MuiButton>
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
  organizations: PropTypes.array,
  differentTypes: PropTypes.array,
  onSearchChange: PropTypes.func,
  onGetDeliverAuto: PropTypes.func,
};

Section1.defaultProps = {
  organizations: [],
  differentTypes: [],
};

export const mapStateToProps = createStructuredSelector({
  organizations: makeSelectData('master', 'organizations'),
  differentTypes: makeSelectData('master', 'differentTypes'),
});

export const mapDispatchToProps = dispatch => ({
  onGetDeliverAuto: (inputText, callback) =>
    dispatch(getDeliverAuto(inputText, callback)),
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
