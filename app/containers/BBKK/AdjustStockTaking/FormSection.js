import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Paper } from '@material-ui/core';
import { Field, Form } from 'formik';
import SelectAutocomplete from 'components/SelectAutocomplete';
import DatePickerControl from 'components/PickersControl';
// import MuiButton from 'components/MuiButton';
// import SelectControl from 'components/SelectControl';
import InputControl from 'components/InputControl';
import PropTypes from 'prop-types';
// import FormWrapper from 'components/FormikUI/FormWrapper';

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

class FormSection extends React.Component {
  makeFormAttr = pr => {
    const { formOptions, form } = this.props;
    return {
      basketStockTakingCode: {
        name: 'basketStockTakingCode',
        label: 'Mã BBKK',
        // value: '11002233',
        component: InputControl,
        onChange: pr.handleChange,
        disabled: true,
      },
      unitKK: {
        name: 'unitKK',
        label: 'Đơn Vị Kiểm Kê',
        // value: pr.values.unitKK,
        component: SelectAutocomplete,
        placeholder: 'Lựa chọn đơn vị',
        // options: formData.unitKK,
        disabled: true,
      },
      adjustmentUserId: {
        name: 'adjustmentUserId',
        label: 'Người Điều Chỉnh',
        // value: pr.values.userId,
        component: SelectAutocomplete,
        placeholder: 'Lựa Chọn Người Điều Chỉnh',
        options: formOptions.users,
        onChangeSelectAutoComplete: option => {
          this.props.onChangeField({
            field: 'adjustmentUserId',
            value: option,
          });
        },
        required: true,
        disabled: true,
      },
      adjustmentDate: {
        name: 'adjustmentDate',
        label: 'Thời Gian Điều Chỉnh',
        component: DatePickerControl,
        isDateTimePicker: true,
        disabled: form === '2',
        format: 'dd/MM/yyyy HH:mm:ss',
        required: true,
        onChange: date => {
          this.props.onChangeField({
            field: 'adjustmentDate',
            value: date,
          });
        },
      },
    };
  };

  render() {
    const { formik, classes } = this.props;
    const formAttr = this.makeFormAttr(formik);
    return (
      <Paper spacing={16} className={classes.header}>
        <Form className={classes.topToolbar}>
          <Grid container spacing={24}>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <Grid container>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field {...formAttr.basketStockTakingCode} />
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field {...formAttr.unitKK} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <Grid container>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field {...formAttr.adjustmentDate} />
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Field {...formAttr.adjustmentUserId} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    );
  }
}
FormSection.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
};
//
export default withStyles(styles)(FormSection);
