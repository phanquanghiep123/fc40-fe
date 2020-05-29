import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Grid, withStyles } from '@material-ui/core';
import Expansion from 'components/Expansion';
import { Field, Form } from 'formik';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import appTheme from 'containers/App/theme';
import DatePickerControl from 'components/DatePickerControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
import * as actions from './actions';
import { makeSelectData, orgsSelector, basketsSelectData } from './selectors';

export const styles = (theme = appTheme) => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& > *': {
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

const currentDate = new Date();

class Section1 extends React.Component {
  autoCompleteTimer;

  makeFormAttr = pr => ({
    plantOwner: {
      name: 'plantOwner',
      label: 'Đơn vị sở hữu',
      component: SelectAutocomplete,
      value: pr.values.plantOwner,
      placeholder: 'Tất cả',
      searchable: true,
      options: this.props.orgs,
    },
    codeAsset: {
      name: 'codeAsset',
      label: 'Mã tài sản',
      value: pr.values.codeAsset,
      component: InputControl,
      onChange: pr.handleChange,
    },
    palletBasketCode: {
      name: 'palletBasketCode',
      label: 'Mã khay sọt',
      component: SelectAutocomplete,
      value: pr.values.palletBasketCode,
      placeholder: 'Tất cả',
      searchable: true,
      options: this.props.baskets,
    },
    status: {
      name: 'status',
      label: 'Trạng thái',
      component: SelectAutocomplete,
      value: pr.values.status,
      placeholder: 'Tất cả',
      searchable: false,
      options: [
        {
          value: 'own',
          label: 'Sở hữu',
        },
        {
          value: 'cancel',
          label: 'Đã hủy',
        },
      ],
    },
    boughtDate: {
      name: 'boughtDate',
      label: 'Ngày mua',
      component: DatePickerControl,
      value: pr.values.boughtDate,
      onChange: e => {
        pr.setFieldValue('boughtDate', e);
      },
      maxDate: currentDate,
      clearable: false,
    },
    importedDateTo: {
      name: 'importedDateTo',
      label: 'Ngày nhập kho',
      component: DatePickerControl,
      value: pr.values.importedDateTo,
      onChange: e => {
        pr.setFieldValue('importedDateTo', e);
      },
      maxDate: currentDate,
      clearable: false,
    },
  });

  handleSearchBasket = () => {
    const { formik } = this.props;
    const params = {
      plantOwner: formik.values.plantOwner.value,
      palletBasketCode: formik.values.palletBasketCode.value,
      boughtDate: formik.values.boughtDate,
      importedDateTo: formik.values.importedDateTo,
      codeAsset: formik.values.codeAsset,
      status: formik.values.status.lable,
    };
    this.props.onSearchBasket(params);
  };

  render() {
    const { classes, formik } = this.props;
    const formAttr = this.makeFormAttr(formik);
    return (
      <Expansion
        title="I. Thông Tin Chung"
        content={
          <Form>
            <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.plantOwner} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.boughtDate} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.codeAsset} />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.importedDateTo} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.palletBasketCode} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Field {...formAttr.status} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.btnContainer}>
              <Button
                type="button"
                variant="contained"
                className={classes.resetBtn}
                onClick={formik.handleReset}
              >
                Bỏ lọc
              </Button>
              <Button
                className={classes.btn}
                variant="contained"
                type="button"
                color="primary"
                onClick={this.handleSearchBasket}
              >
                Tìm kiếm
              </Button>
            </div>
          </Form>
        }
      />
    );
  }
}
Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  onSearchBasket: PropTypes.func,
  initValue: PropTypes.object,
  formik: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  initValue: makeSelectData(),
  orgs: orgsSelector(),
  baskets: basketsSelectData(),
});
function mapDispatchToProps(dispatch) {
  return {
    onSearchBasket: params => {
      dispatch(actions.searchBasket(params));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(Section1)),
);
