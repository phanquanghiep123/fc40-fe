import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Grid, MenuItem } from '@material-ui/core';
import { Field, Form } from 'formik';
import NumberFormatter from 'components/NumberFormatter';
import SelectControl from 'components/SelectControl';
import BasketSize from './BasketSize';
import * as selectors from '../selectors';

// eslint-disable-next-line react/prefer-stateless-function
export class InfoMaster extends Component {
  makeFormAttr = pr => ({
    palletBasketCode: {
      name: 'palletBasketCode',
      label: 'Mã Khay Sọt',
      value: pr.values.palletBasketCode,
      component: InputControl,
      onChange: pr.handleChange,
      disabled: this.props.detailMode && true,
    },
    shortName: {
      name: 'shortName',
      label: 'Tên Ngắn',
      value: pr.values.shortName,
      onChange: pr.handleChange,
      component: InputControl,
      disabled: this.props.detailMode && true,
    },
    fullName: {
      name: 'fullName',
      label: 'Tên Dài',
      value: pr.values.fullName,
      onChange: pr.handleChange,
      component: InputControl,
      disabled: this.props.detailMode && true,
    },
    // uoM: {
    //   name: 'uoM',
    //   label: 'Đơn Vị Tính',
    //   placeholder: 'Tìm và chọn Đơn Vị Tính',
    //   onChange: pr.handleChange,
    //   component: SelectAutocomplete,
    //   searchable: true,
    //   disabled: this.props.detailMode && true,
    //   options: this.props.uoms,
    // },
    uoM: {
      name: 'uoM',
      label: 'Đơn Vị Tính',
      component: InputControl,
      onChange: pr.handleChange,
      disabled: this.props.detailMode && true,
    },
    netWeight: {
      name: 'netWeight',
      label: 'Trọng Lượng ',
      value: pr.values.netWeight,
      onChange: pr.handleChange,
      component: InputControl,
      disabled: this.props.detailMode && true,
      inputComponent: NumberFormatter,
    },
    // weightUnit: {
    //   name: 'weightUnit',
    //   label: 'Đơn Vị Tính (TL)',
    //   onChange: pr.handleChange,
    //   placeholder: 'Tìm và chọn Đơn vị tính (TL)',
    //   component: SelectAutocomplete,
    //   searchable: true,
    //   disabled: this.props.detailMode && true,
    //   options: this.props.uoms,
    // },
    weightUnit: {
      name: 'weightUnit',
      label: 'Đơn Vị Tính (TL)',
      component: InputControl,
      onChange: pr.handleChange,
      disabled: this.props.detailMode && true,
    },

    registerName: {
      name: 'registerName',
      label: 'Nơi Đăng Ký',
      value: 'FC40',
      placeholder: 'FC40',
      component: InputControl,
      disabled: true,
    },
    size: {
      name: 'size',
      label: 'Kích Cỡ',
      onChange: pr.handleChange,
      value: pr.values.size,
      component: SelectControl,
      disabled: this.props.detailMode && true,
      children: this.props.size.map(item => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      )),
    },
    length: {
      name: 'length',
      value: pr.values.length,
      onChange: pr.handleChange,
      component: BasketSize,
      disabled: this.props.detailMode && true,
      label: 'Dài',
      require: true,
    },
    width: {
      name: 'width',
      value: pr.values.width,
      onChange: pr.handleChange,
      component: BasketSize,
      disabled: this.props.detailMode && true,
      label: 'Rộng',
    },
    height: {
      name: 'height',
      value: pr.values.height,
      onChange: pr.handleChange,
      component: BasketSize,
      disabled: this.props.detailMode && true,
      label: 'Cao',
    },
  });

  render() {
    const { formik } = this.props;
    const formAttr = this.makeFormAttr(formik);
    return (
      <Expansion
        title="Thông Tin Master Khay Sọt"
        content={
          <Form style={{ cursor: 'pointer' }}>
            <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                <Field {...formAttr.palletBasketCode} />
                <Field {...formAttr.shortName} />
                <Field {...formAttr.fullName} />
                <Field {...formAttr.size} />
                <Field {...formAttr.registerName} />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                <Field {...formAttr.uoM} />
                <Field {...formAttr.netWeight} />
                <Field {...formAttr.weightUnit} />

                <Grid container>
                  <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                    <Field {...formAttr.length} />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                  >
                    <Field {...formAttr.width} />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                    <Field {...formAttr.height} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        }
      />
    );
  }
}

InfoMaster.propTypes = {
  formik: PropTypes.object,
  detailMode: PropTypes.bool,
  size: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  uoms: selectors.uomsSelector(),
  size: selectors.sizeSelector(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(withImmutablePropsToJS(InfoMaster));
