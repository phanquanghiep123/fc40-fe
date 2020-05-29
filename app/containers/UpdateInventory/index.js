import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';

import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import saga from './saga';
import reducer from './reducer';

import Schema from './Schema';

import { uploadFile } from './actions';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  buttonChoose: {
    marginTop: theme.spacing.unit * 2,
  },
});

export class UpdateInventoryPage extends React.Component {
  onFormSubmit = values => {
    this.props.onUploadFile(values);
  };

  onFileChange = formik => event => {
    if (event.target && event.target.files[0]) {
      formik.setFieldValue('name', event.target.files[0].name);
      formik.setFieldValue('uploadingFile', event.target.files[0]);

      formik.setFieldTouched('name', true, true);
    }
  };

  render() {
    const { classes, initialSchema } = this.props;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={initialSchema}
        validationSchema={Schema}
        onSubmit={this.onFormSubmit}
        render={formik => (
          <section className={classes.main}>
            <section className={classes.heading}>
              <Typography variant="h5" className={classes.titleText}>
                Cập Nhật Tồn Kho FC40
              </Typography>
            </section>
            <section className={classes.content}>
              <Card className={classes.section}>
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={16}>
                    <Grid item xs={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={12} sm={6} lg={4} xl={2}>
                          <Field
                            name="name"
                            label="Tài Liệu Tải Lên"
                            disabled
                            showError
                            component={MuiInput}
                          />
                        </Grid>
                        <Grid item>
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
                              className={classes.buttonChoose}
                            >
                              Chọn File
                            </MuiButton>
                          </label>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <MuiButton
                        disabled={formik.isSubmitting}
                        onClick={debounce(formik.handleSubmit, SUBMIT_TIMEOUT)}
                      >
                        Tải Lên
                      </MuiButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </section>
          </section>
        )}
      />
    );
  }
}

UpdateInventoryPage.propTypes = {
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  onUploadFile: PropTypes.func,
};

UpdateInventoryPage.defaultProps = {
  initialSchema: Schema.cast(),
};

const withSaga = injectSaga({ key: 'updateInventoryPage', saga });
const withReducer = injectReducer({ key: 'updateInventoryPage', reducer });

export const mapDispatchToProps = dispatch => ({
  onUploadFile: data => dispatch(uploadFile(data)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withSaga,
  withReducer,
  withConnect,
  withStyles(styles),
)(UpdateInventoryPage);
