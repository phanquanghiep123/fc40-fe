import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { formDataSelector, selectArr, formOptionSelector } from './selectors';

export const styles = theme => ({
  section2: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class Section2 extends React.Component {
  render() {
    const {
      classes,
      getBasketDetail,
      changeData,
      formData,
      showConfirm,
      formOption,
    } = this.props;
    return (
      <Paper spacing={24} className={classes.section2}>
        <Grid container spacing={16}>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              II. Bên Giao Hàng
            </Typography>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <Field
                name="deliverBasketStocktakingCode"
                label="Mã BBKK"
                component={SelectAutocomplete}
                searchable
                required
                options={formOption.deliverBasketStocktakingCode}
                placeholder="Lựa Chọn Mã BBKK"
                // loadOptionsFunc={(inputText, callback) => {
                //   getDeliveryOrder(
                //     inputText,
                //     callback,
                //     true,
                //     'deliverBasketStocktakingCode',
                //   );
                // }}
                onChangeSelectAutoComplete={selected => {
                  showConfirm({
                    title: 'Xác nhận thay đổi Mã BBKK',
                    message:
                      'Nếu bạn thay đổi Mã BBKK thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
                    actions: [
                      {
                        text: 'Hủy',
                      },
                      {
                        text: 'Đồng ý',
                        color: 'primary',
                        onClick: () => {
                          changeData({
                            data: selected,
                            field: 'deliverBasketStocktakingCode',
                          });
                          if (selected) {
                            getBasketDetail({
                              ...selected,
                              hasData: true,
                              isDeliver: true,
                              typeProcess: formData.typeProcess,
                            });
                          } else {
                            getBasketDetail({
                              ...selected,
                              hasData: false,
                              typeProcess: formData.typeProcess,
                              isDeliver: true,
                            });
                          }
                        },
                      },
                    ],
                  });
                }}
                // isAsync
              />
            </Grid>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              III. Bên Nhận Hàng
            </Typography>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <Field
                name="receiverBasketStocktakingCode"
                label="Mã BBKK"
                component={SelectAutocomplete}
                searchable
                required
                disabled={formData.typeProcess === 2}
                options={formOption.receiverBasketStocktakingCode}
                placeholder="Lựa Chọn Mã BBKK"
                // loadOptionsFunc={(inputText, callback) => {
                //   if (!formData.receiver && formData.typeProcess === 1) {
                //     onShowWarning(
                //       'Chọn Đơn vị Nhận Hàng trước khi chọn Mã BBKK',
                //     );
                //     return false;
                //   }
                //   getDeliveryOrder(
                //     inputText,
                //     callback,
                //     false,
                //     'receiverBasketStocktakingCode',
                //   );
                //   return true;
                // }}
                onChangeSelectAutoComplete={selected => {
                  showConfirm({
                    title: 'Xác nhận thay đổi Mã BBKK',
                    message:
                      'Nếu bạn thay đổi Mã BBKK thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
                    actions: [
                      {
                        text: 'Hủy',
                      },
                      {
                        text: 'Đồng ý',
                        color: 'primary',
                        onClick: () => {
                          changeData({
                            data: selected,
                            field: 'receiverBasketStocktakingCode',
                          });
                          if (selected) {
                            getBasketDetail({
                              ...selected,
                              hasData: true,
                              isDeliver: false,
                            });
                          } else {
                            getBasketDetail({
                              ...selected,
                              hasData: false,
                              isDeliver: false,
                            });
                          }
                        },
                      },
                    ],
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={6} />
        </Grid>
      </Paper>
    );
  }
}

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
  getBasketDetail: PropTypes.func,
  changeData: PropTypes.func,
  formData: PropTypes.object,
  formOption: PropTypes.object,
  showConfirm: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  tableData: selectArr(['formData', 'tableData']),
  formData: formDataSelector(),
  formOption: formOptionSelector(),
});
function mapDispatchToProps(dispatch) {
  return { dispatch };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(Section2)),
);
