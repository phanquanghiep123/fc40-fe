import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { addNumbers, formatToDecimal } from 'utils/numberUtils';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import DialogActions from '@material-ui/core/DialogActions';

import { closeDialog, showWarning } from 'containers/App/actions';

import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import { detailsRoutine } from '../routines';
import { makeSelectDetails } from '../selectors';

import Section1 from './Section1';
import Section2 from './Section2';

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
});

export class Popup extends React.Component {
  getErrors(values, rowIndex, differentQuantity) {
    let errors = [];
    let tongDieuChinh = 0;

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];

      if (value && value.rowIndex === rowIndex) {
        if (value.differenceModify >= 0) {
          errors[i] = { differenceModify: true };
          tongDieuChinh = formatToDecimal(
            addNumbers(tongDieuChinh, Math.abs(value.differenceModify)),
          );
        }
      }
    }

    // Tổng SL điều chỉnh = Trị tuyệt đối của SL chênh lệch
    if (Math.abs(differentQuantity) === Math.abs(tongDieuChinh)) {
      errors = [];
    }

    return errors;
  }

  mergeErrors(errors, nextErrors) {
    const results = [];

    const len =
      errors.length > nextErrors.length ? errors.length : nextErrors.length;

    for (let i = 0; i < len; i += 1) {
      if (errors[i]) {
        results[i] = errors[i];
      }
      if (nextErrors[i]) {
        results[i] = nextErrors[i];
      }
    }

    return results;
  }

  validateFrom = values => {
    let errors = [];

    for (let i = 0, len = values.modificationDetails.length; i < len; i += 1) {
      const value = values.modificationDetails[i];

      if (value && value.isMainRow) {
        errors = this.mergeErrors(
          errors,
          this.getErrors(
            values.modificationDetails,
            value.rowIndex,
            value.differentQuantity,
          ),
        );
      }
    }

    if (errors && errors.length > 0) {
      return { modificationDetails: errors };
    }
    return {};
  };

  onFormInvalid = () => {
    this.props.onShowWarning(
      'Tổng SL Điều chỉnh nhập vào phải bằng SL Chênh lệch tương ứng',
    );
  };

  onFormSubmit = values => {
    this.props.onPerformUpdate(values.modificationDetails, () => {
      this.props.onUpdateSuccess();
    });
  };

  render() {
    const { classes, ui, initialSchema } = this.props;

    return (
      <FormWrapper
        FormikProps={{
          validate: this.validateFrom,
        }}
        initialValues={initialSchema}
        enableReinitialize
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <ui.Dialog
            {...ui.props}
            title="Phiếu Điều Chỉnh"
            content={
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Section1
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Section2
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
              </Grid>
            }
            maxWidth="lg"
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
                  Hủy Bỏ
                </MuiButton>
                <MuiButton
                  disabled={formik.isSubmitting}
                  className={classes.button}
                  onClick={formik.handleSubmitClick}
                >
                  Hoàn Thành
                </MuiButton>
              </DialogActions>
            }
          />
        )}
      />
    );
  }
}

Popup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
  onCloseDialog: PropTypes.func,
  onShowWarning: PropTypes.func,
  onPerformUpdate: PropTypes.func,
  onUpdateSuccess: PropTypes.func,
};

Popup.defaultProps = {
  initialSchema: {},
};

export const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectDetails(),
});

export const mapDispatchToProps = dispatch => ({
  onCloseDialog: () => dispatch(closeDialog()),
  onShowWarning: message => dispatch(showWarning(message)),
  onPerformUpdate: (data, callback) =>
    dispatch(detailsRoutine.editingRequest({ data, callback })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Popup);
