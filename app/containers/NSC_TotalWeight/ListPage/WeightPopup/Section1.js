import React from 'react';

import { Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import * as GoodsWeight from 'components/GoodsWeight/components';

export default function Section1() {
  return (
    <GoodsWeight.Section1>
      <Grid container spacing={24}>
        <Grid item sm={12} md={6}>
          <Grid container>
            <Grid item xs={12}>
              <Field
                name="productCode"
                label="Mã Sản Phẩm"
                disabled
                component={MuiInput}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="productName"
                label="Tên Sản Phẩm"
                disabled
                multiline
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
          </Grid>
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid
            style={{ height: '100%' }}
            container
            alignContent="space-between"
          >
            <Grid item xs={12}>
              <Field
                name="semiFinishedProductSlotCode"
                label="Batch BTP"
                disabled
                component={MuiInput}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="gradeName"
                label="Phân Loại"
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
                label="Tổng Số Lượng Thực"
                disabled
                component={MuiInput}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </GoodsWeight.Section1>
  );
}
