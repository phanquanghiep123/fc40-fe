import React from 'react';
import Grid from '@material-ui/core/Grid';
import { DatePicker } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
import Expansion from 'components/Expansion';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

export default class SuggestForm extends React.PureComponent {
  render() {
    const { deliverName, customerCode, customerName, date } = this.props;
    return (
      <Expansion
        // title="Thông Tin Lần Cân"
        content={
          <Grid container spacing={24}>
            <Grid item md={4}>
              <TextField
                label="Đơn Vị Xuất Hàng"
                fullWidth
                value={deliverName}
                disabled
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                label="Đơn Vị Nhận Hàng"
                value={`${customerCode} ${customerName}`}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth>
                <DatePicker
                  label="Ngày Cân"
                  format="dd/MM/yyyy"
                  disabled
                  value={date}
                  onChange={() => {}}
                />
              </FormControl>
            </Grid>
          </Grid>
        }
      />
    );
  }
}

SuggestForm.propTypes = {
  customerCode: PropTypes.string,
  customerName: PropTypes.string,
  date: PropTypes.string,
  deliverName: PropTypes.string,
};
