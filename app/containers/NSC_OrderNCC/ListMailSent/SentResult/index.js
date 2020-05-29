import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';

import FormWrapper from 'components/FormikUI/FormWrapper';

import MuiButton from 'components/MuiButton';

import { closeDialog } from 'containers/App/actions';

import { downloadFile } from '../actions';
import { makeSelectSentResult } from '../selectors';

import baseStyles from '../styles';

export const styles = theme => ({
  ...baseStyles(theme),
  textLabel: {
    fontWeight: 'bold',
  },
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
  },
});

export function SentResult({ classes, ui, initialSchema, ...props }) {
  return (
    <FormWrapper
      enableReinitialize
      initialValues={initialSchema}
      render={formik => (
        <ui.Dialog
          {...ui.props}
          title="Kết Quả Gửi Mail"
          content={
            <Card className={classes.section}>
              <CardContent className={classes.cardContent}>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          File
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {formik.values.fileName}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          Tổng Số NCC
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {formik.values.totalSupplier}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          Xử Lý
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {formik.values.totalProcessed}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          Đã Gửi
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {formik.values.send}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          Chưa Gửi
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        {formik.values.unSend}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8} alignItems="center">
                      <Grid item xs={4}>
                        <Typography className={classes.textLabel}>
                          Tải Xuống Kết Quả
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <MuiButton
                          outline
                          onClick={() =>
                            props.onDownloadFile(formik.values.downloadId)
                          }
                        >
                          Tải Xuống
                        </MuiButton>
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
                className={classes.button}
                onClick={props.onCloseDialog}
              >
                Đóng
              </MuiButton>
            </DialogActions>
          }
          onExitedDialog={formik.handleResetClick}
        />
      )}
    />
  );
}

SentResult.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
  onCloseDialog: PropTypes.func,
};

SentResult.defaultProps = {
  initialSchema: {},
};

export const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectSentResult(),
});

export const mapDispatchToProps = dispatch => ({
  onCloseDialog: () => dispatch(closeDialog()),
  onDownloadFile: downloadId => dispatch(downloadFile(downloadId)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(SentResult);
