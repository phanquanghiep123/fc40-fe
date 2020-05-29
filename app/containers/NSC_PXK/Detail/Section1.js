import React from 'react';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import MuiInput from 'components/MuiInput';
import PickersControl from 'components/PickersControl';
import Expansion from 'components/Expansion';

export default function Section1() {
  return (
    <Expansion
      title="I. Thông Tin Chung"
      content={
        <Grid container spacing={16}>
          <Grid item xs={12} md={6} lg={3}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  name="documentCode"
                  label="Mã PXK"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="deliverName"
                  label="Đơn Vị Giao Hàng"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="subTypeName"
                  label="Loại Xuất Kho"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  name="receiverName"
                  label="Đơn Vị Nhận Hàng"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="note"
                  label="Ghi Chú"
                  component={MuiInput}
                  disabled
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  name="date"
                  label="Thời Gian Lập Phiếu"
                  component={PickersControl}
                  format="dd/MM/yyyy hh:mm a"
                  disabled
                  isDateTimePicker
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="exporterName"
                  label="Nhân Viên Cân Hàng"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="supervisorName"
                  label="Nhân Viên Giám Sát"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  name="exporterPhone"
                  label="Điện Thoại"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="exporterEmail"
                  label="Email"
                  component={MuiInput}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    />
  );
}
