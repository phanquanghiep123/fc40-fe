import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import Expansion from 'components/Expansion';

import DatePickerControl from 'components/PickersControl';

import { makeSelectData } from './selectors';
import { changeTypeBBGNHH } from './actions';

import WrapperBusiness from './Business';

import { CODE_FORM } from './constants';

export class Section1 extends React.Component {
  onTypeChange = event => {
    this.props.formik.handleResetClick();
    this.props.onTypeBBGNHHChange(event.target.value);
  };

  render() {
    return (
      <Expansion
        title="I. Thông Tin Biên Bản"
        content={
          <Grid container spacing={16}>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Field
                    name="deliveryReceiptCode"
                    label="Mã BBGNHH"
                    component={MuiInput}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <WrapperBusiness code={CODE_FORM.NON_EDITABLE}>
                    {({ disabled }) => (
                      <Field
                        name="deliveryReceiptType"
                        label="Loại BBGNHH"
                        component={MuiInput}
                        select
                        options={this.props.delivertReceiptTypes}
                        valueKey="id"
                        labelKey="name"
                        disabled={disabled}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onInputChange={this.onTypeChange}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Field
                name="creatorName"
                label="Người Tạo BB"
                component={MuiInput}
                required
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Field
                name="createDate"
                label="Thời Gian Tạo BB"
                component={DatePickerControl}
                autoOk
                format="dd/MM/yyyy HH:mm:ss"
                // maxDate={new Date()}
                required
                disabled
                isDateTimePicker
                style={{
                  marginTop: 5,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                    {({ disabled }) => (
                      <Field
                        name="sealNumber"
                        label="Số Seal"
                        component={MuiInput}
                        disabled={disabled}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
        unmountOnExit={false}
      />
    );
  }
}

Section1.propTypes = {
  formik: PropTypes.object,
  delivertReceiptTypes: PropTypes.array,
  onTypeBBGNHHChange: PropTypes.func,
};

Section1.defaultProps = {
  delivertReceiptTypes: [],
};

const mapStateToProps = createStructuredSelector({
  delivertReceiptTypes: makeSelectData('master', 'delivertReceiptTypes'),
});

export const mapDispatchToProps = dispatch => ({
  onTypeBBGNHHChange: typeBBGNHH => dispatch(changeTypeBBGNHH(typeBBGNHH)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
)(Section1);
