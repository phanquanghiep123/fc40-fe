import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { formatToDecimal } from 'utils/numberUtils';

import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';

import { closeDialog, showWarning } from 'containers/App/actions';

import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { connectContext } from '../context';
import { makeSelectData } from '../selectors';
import { productsRoutine } from '../routines';

import Table from './Table';

import { TYPE_DIEUCHINH } from '../constants';

export const styles = theme => ({
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
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
  getErrors(values, rowIndex) {
    let errors = [];

    let totalQuantity = 0;
    let differentQuantity = 0;

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];

      if (value && value.rowIndex === rowIndex) {
        if (value.isMainRow) {
          differentQuantity = Number(value.differentQuantity);
        }
        if (value.quantityModify > 0) {
          errors[i] = { quantityModify: true };
          totalQuantity = formatToDecimal(
            totalQuantity + Math.abs(value.quantityModify),
          );
        }
      }
    }

    if (Math.abs(totalQuantity) === Math.abs(differentQuantity)) {
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

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];

      if (
        value &&
        value.isMainRow &&
        value.differenceStatus === TYPE_DIEUCHINH.NOT_ADJUSTED
      ) {
        errors = this.mergeErrors(
          errors,
          this.getErrors(values, value.rowIndex),
        );
      }
    }

    return errors;
  };

  onFormInvalid = () => {
    this.props.showWarning(
      'Tổng khối lượng điều chỉnh nhập vào phải bằng Tổng khối lượng chênh lệch chưa điều chỉnh',
    );
  };

  onFormSubmit = values => {
    this.props.onPerformUpdate(values, () => {
      this.props.closeDialog();
      this.props.context.onGetReceipts();
    });
  };

  render() {
    const { classes, ui, documentId, initialSchema } = this.props;

    return (
      <FormWrapper
        FormikProps={{
          validate: this.validateFrom,
        }}
        enableReinitialize
        initialValues={initialSchema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <ui.Dialog
            {...ui.props}
            title="Phiếu Điều Chỉnh"
            content={
              <Table
                formik={{
                  ...formik,
                  ...formikPropsHelpers(formik),
                }}
              />
            }
            maxWidth="lg"
            fullWidth
            isDialog={false}
            keepMounted={false}
            suppressClose
            contentProps={{
              className: classes.content,
            }}
            customActionDialog={
              <DialogActions className={classes.actionButtons}>
                <MuiButton
                  outline
                  className={classes.button}
                  onClick={this.props.closeDialog}
                >
                  Huỷ Bỏ
                </MuiButton>
                <MuiButton
                  disabled={!documentId || formik.isSubmitting}
                  className={classes.button}
                  onClick={debounce(formik.handleSubmitClick, SUBMIT_TIMEOUT)}
                >
                  Điều Chỉnh
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
  context: PropTypes.shape({
    onGetReceipts: PropTypes.func,
  }),
  documentId: PropTypes.any,
  initialSchema: PropTypes.array,
  closeDialog: PropTypes.func,
  showWarning: PropTypes.func,
  onPerformUpdate: PropTypes.func,
};

Popup.defaultProps = {
  initialSchema: [],
};

export const mapStateToProps = createStructuredSelector({
  documentId: makeSelectData('products', 'documentId'),
  initialSchema: makeSelectData('products'),
});

export const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  showWarning: message => dispatch(showWarning(message)),
  onPerformUpdate: (data, callback) =>
    dispatch(productsRoutine.editingRequest({ data, callback })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
  connectContext,
)(Popup);
