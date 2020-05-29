import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Grid, Paper } from '@material-ui/core';
import { Field } from 'formik';
import MuiButton from 'components/MuiButton';
import InputControl from 'components/InputControl';
import FormWrapper from 'components/FormikUI/FormWrapper';
import SelectAutocomplete from 'components/SelectAutocomplete';

const styles = theme => ({
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    marginBottom: `${theme.spacing.unit * 2}px`,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing.unit * 3,
  },
  btn: {
    margin: 'unset',
  },
});

class FormSection extends React.Component {
  componentDidMount() {
    this.initSuggest();
  }

  componentWillUnmount() {
    this.props.onResetSuggest();
  }

  initSuggest = () => {
    const { initValues } = this.props;
    this.props.onGetSuggest(
      initValues.deliverCode,
      initValues.receiverCode,
      '',
      '',
      initValues.detailsCommands,
    );
  };

  onSubmit = form => {
    const { initValues } = this.props;
    this.props.onGetSuggest(
      form.deliverCode,
      form.receiverCode,
      form.productName,
      form.slotCode,
      initValues.detailsCommands,
    );
  };

  resetFilters = pr => {
    pr.setFieldValue('productName', '');
    pr.setFieldValue('slotCode', '');
    this.initSuggest();
  };

  render() {
    const { classes, organizations, initValues } = this.props;

    const formAttr = pr => ({
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
        autoFocus: true,
      },
      slotCode: {
        name: 'slotCode',
        label: 'Batch',
        component: InputControl,
        value: pr.values.slotCode,
        onChange: pr.handleChange,
        autoFocus: true,
      },
      deliverCode: {
        name: 'deliverCode',
        label: 'Đơn Vị Xuất Hàng',
        component: SelectAutocomplete,
        disabled: true,
        value: pr.values.deliverCode,
        options: organizations,
        isClearable: false,
        placeholder: 'Lựa Chọn Đơn Vị Xuất Hàng',
      },

      // deliverCode: {
      //   name: 'deliverCode',
      //   label: 'Đơn Vị Xuất Hàng',
      //   component: SelectControl,
      //   value: pr.values.deliverCode,
      //   children: organizations.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      //   onChange: pr.handleChange,
      //   autoFocus: true,
      //   disabled: true,
      // },

      // receiverCode: {
      //   name: 'receiverCode',
      //   label: 'Đơn Vị Nhận Hàng',
      //   component: SelectControl,
      //   value: pr.values.receiverCode,
      //   children: organizations.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      //   onChange: pr.handleChange,
      //   autoFocus: true,
      //   disabled: true,
      // },
      receiverCode: {
        name: 'receiverCode',
        label: 'Đơn Vị Nhận Hàng',
        component: SelectAutocomplete,
        value: pr.values.receiverCode,
        disabled: true,
        options: organizations,
        isClearable: false,
        placeholder: 'Lựa Chọn Đơn Vị Nhận Hàng',
      },
    });

    return (
      <FormWrapper
        initialValues={{
          productName: '',
          slotCode: '',
          deliverCode: initValues.deliverCode,
          receiverCode: initValues.receiverCode,
        }}
        onSubmit={this.onSubmit}
        render={pr => (
          <Paper className={classes.paper}>
            <Grid container spacing={24} style={{ marginBottom: '1rem' }}>
              <Grid item xs={6} md={3}>
                <Grid container spacing={32}>
                  <Grid item xs={12}>
                    <Field {...formAttr(pr).productName} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} md={3}>
                <Grid container spacing={32}>
                  <Grid item xs={12}>
                    <Field {...formAttr(pr).slotCode} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} md={3}>
                <Grid container spacing={32}>
                  <Grid item xs={12}>
                    <Field {...formAttr(pr).deliverCode} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} md={3}>
                <Grid container spacing={32}>
                  <Grid item xs={12}>
                    <Field {...formAttr(pr).receiverCode} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={4} md={4} sm={4} xs={4} />
              <Grid item lg={4} md={4} sm={4} xs={4} />
              <Grid item lg={4} md={4} sm={4} xs={4}>
                <Grid container spacing={24} justify="flex-end">
                  <Grid item>
                    <MuiButton
                      outline
                      onClick={() => {
                        this.resetFilters(pr);
                      }}
                    >
                      Bỏ Lọc
                    </MuiButton>
                  </Grid>
                  <Grid item>
                    <MuiButton onClick={pr.handleSubmit}>Tìm Kiếm</MuiButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      />
    );
  }
}
FormSection.propTypes = { classes: PropTypes.object };

export default withStyles(styles)(FormSection);
