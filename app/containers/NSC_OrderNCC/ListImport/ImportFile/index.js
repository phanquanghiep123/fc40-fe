import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import DialogActions from '@material-ui/core/DialogActions';

import { closeDialog } from 'containers/App/actions';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';

import Schema from './Schema';

import { uploadFile } from '../actions';
import { makeSelectData } from '../selectors';

import baseStyles from '../styles';

export const styles = theme => ({
  ...baseStyles(theme),
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    width: 150,
  },
  chooseFile: {
    textAlign: 'right',
  },
  buttonChooseFile: {
    marginTop: theme.spacing.unit * 2,
  },
});

export class ImportFile extends React.Component {
  getRegion() {
    if (this.props.regions && this.props.regions.length > 0) {
      const region = this.props.regions[0];
      if (region && region.value) {
        return region.value;
      }
    }
    return '';
  }

  onEnteredDialog = formik => () => {
    const region = this.getRegion();
    formik.setFieldValue('productionRegion', region);
  };

  onFileChange = formik => event => {
    if (event.target && event.target.files[0]) {
      formik.setFieldValue('nameFile', event.target.files[0].name);
      formik.setFieldValue('uploadingFile', event.target.files[0]);

      formik.setFieldTouched('nameFile', true, true);
    }
  };

  onFormSubmit = values => {
    this.props.onUploadFile(values, () => {
      this.props.onUploadFileSuccess();
    });
  };

  render() {
    const { classes, ui, initialSchema } = this.props;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={Schema}
        onSubmit={this.onFormSubmit}
        render={formik => (
          <ui.Dialog
            {...ui.props}
            title="Tải Lên Đặt Hàng Nhà Cung Cấp"
            content={
              <Card className={classes.section}>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={16}>
                    <Grid item xs={12}>
                      <Field
                        name="productionRegion"
                        label="Vùng Sản Xuất"
                        component={MuiInput}
                        select
                        options={this.props.regions}
                        valueKey="value"
                        labelKey="name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="fileType"
                        label="Loại Đặt Hàng"
                        component={MuiInput}
                        select
                        options={this.props.orderTypes}
                        valueKey="id"
                        labelKey="name"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={9}>
                          <Field
                            name="nameFile"
                            label="Tài Liệu Đặt Hàng"
                            disabled
                            showError
                            component={MuiInput}
                          />
                        </Grid>
                        <Grid item xs={3} className={classes.chooseFile}>
                          <input
                            id="button-file"
                            type="file"
                            accept=".xlsx; .xls"
                            style={{ display: 'none' }}
                            onChange={this.onFileChange(formik)}
                          />
                          <label htmlFor="button-file">
                            <MuiButton
                              outline
                              component="span"
                              className={classes.buttonChooseFile}
                            >
                              Chọn File
                            </MuiButton>
                          </label>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            }
            fullWidth
            isDialog={false}
            keepMounted={false}
            suppressClose
            customActionDialog={
              <DialogActions className={classes.actionButtons}>
                <MuiButton
                  outline
                  className={classes.button}
                  onClick={this.props.onCloseDialog}
                >
                  Huỷ Bỏ
                </MuiButton>
                <MuiButton
                  disabled={formik.isSubmitting}
                  className={classes.button}
                  onClick={formik.handleSubmitClick}
                >
                  Tải Lên
                </MuiButton>
              </DialogActions>
            }
            onExitedDialog={formik.handleResetClick}
            onEnteredDialog={this.onEnteredDialog(formik)}
          />
        )}
      />
    );
  }
}

ImportFile.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  regions: PropTypes.array,
  orderTypes: PropTypes.array,
  initialSchema: PropTypes.object,
  onUploadFile: PropTypes.func,
  onCloseDialog: PropTypes.func,
  onUploadFileSuccess: PropTypes.func,
};

ImportFile.defaultProps = {
  regions: [],
  initialSchema: Schema.cast(),
  orderTypes: [],
};

export const mapStateToProps = createStructuredSelector({
  regions: makeSelectData('master', 'regions'),
  orderTypes: makeSelectData('master', 'orderTypes'),
});

export const mapDispatchToProps = dispatch => ({
  onUploadFile: (data, callback) => dispatch(uploadFile(data, callback)),
  onCloseDialog: () => dispatch(closeDialog()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(ImportFile);
