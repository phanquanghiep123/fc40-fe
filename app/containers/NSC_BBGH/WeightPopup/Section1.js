import React from 'react';

import { Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import * as GoodsWeight from 'components/GoodsWeight/components';

export default function Section1() {
  return (
    <GoodsWeight.Section1>
      <Grid container spacing={16}>
        <Grid item sm={12} md={3}>
          <Field
            name="productionOrder"
            label="Lệnh Sản Xuất"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={3}>
          <Field
            name="doConnectingId"
            label="Mã Đi Hàng"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Field
            name="materialDescription"
            label="Tên Sản Phẩm"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Field
            name="processingTypeName"
            label="Phân Loại Xử Lý"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Field
            name="quantity"
            label="Tổng lượng dự kiến"
            disabled
            component={MuiInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </GoodsWeight.Section1>
  );
}
