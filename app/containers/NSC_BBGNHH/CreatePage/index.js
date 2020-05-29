import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { showWarning } from 'containers/App/actions';

import MuiButton from 'components/MuiButton';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import saga from './saga';
import reducer from './reducer';

import { makeSelectProp } from './selectors';
import { masterRoutine, bbgnhhRoutine, leadtimeRoutine } from './routines';

import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6/index';

import WrapperBusiness from './Business';

import Schema from './Schema';

import {
  CODE_FORM,
  TYPE_FORM,
  TYPE_BBGNHH,
  TYPE_REASON,
  TYPE_LEADTIME,
} from './constants';

import baseStyles from './styles';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export const styles = theme => ({
  ...baseStyles(theme),
  actions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    width: 150,
  },
});

export class BBGNHHCreatePage extends React.Component {
  typeForm = TYPE_FORM.CREATE;

  componentDidMount() {
    this.props.onGetInitMaster();
  }

  /**
   * Check when transporterCode is NOT filled - ("Bên vận chuyển" ở section 6)
   * @param values - formik values
   * @returns {boolean|string}
   */
  hasNoTransporter = values =>
    !values ||
    !values.deliveryReceiptTransports ||
    !values.deliveryReceiptTransports.length ||
    !values.deliveryReceiptTransports[0].transporterCode;

  validateForm = values => {
    if (this.validateLeadtime(values)) {
      if (this.validateReason(values)) {
        if (this.validateExportReceipts(values)) {
          return true;
        }
      }
    }
    return false;
  };

  validateReason = values => {
    if (this.hasNoTransporter(values)) return true;

    const { notes, reason, shippingLeadtime } = getIn(
      values,
      ['deliveryReceiptTransports', 0],
      {},
    );

    if (shippingLeadtime === TYPE_LEADTIME.NG && reason === TYPE_REASON.NG) {
      this.props.onShowWarning(
        'Vui lòng chọn lại [Nguyên nhân (Bên nhận)] khác với Không dùng do [Vận chuyển theo leadtime] là Không đạt',
      );
      return false;
    }
    if (reason === TYPE_REASON.OTHER && !notes) {
      this.props.onShowWarning(
        'Do [Nguyên nhân (Bên nhận)] là Khác nên bắt buộc nhập giá trị vào trường [Ghi chú]',
      );
      return false;
    }

    return true;
  };

  validateLeadtime = values => {
    if (this.hasNoTransporter(values)) return true;

    const { shippingLeadtimeExport, shippingLeadtimeExportReason } = getIn(
      values,
      ['deliveryReceiptTransports', 0],
      {},
    );

    if (
      shippingLeadtimeExport === TYPE_LEADTIME.NG &&
      shippingLeadtimeExportReason === TYPE_REASON.NG
    ) {
      this.props.onShowWarning(
        'Vui lòng chọn lại [Nguyên nhân (Bên giao)] khác với Không dùng do [Vận chuyển theo leadtime xuất hàng] là Không đạt',
      );
      return false;
    }
    return true;
  };

  validateExportReceipts = values => {
    if (values.deliveryReceiptType === TYPE_BBGNHH.VINLOG) {
      if (
        !values.deliveryReceiptStockExports ||
        !values.deliveryReceiptStockExports.length
      ) {
        this.props.onShowWarning(
          'Bắt buộc phải có ít nhất 1 Phiếu xuất kho được chọn',
        );
        return false;
      }
    }
    return true;
  };

  submitForm = values => {
    this.props.onCreateBBGNHH(values);
  };

  onGoBack = () => {
    this.props.history.goBack();
  };

  onFormReset = () => {
    this.props.onResetLeadtime();
  };

  onFormSubmit = values => {
    if (this.validateForm(values)) {
      this.submitForm(values);
    }
  };

  onFormInvalid = () => {
    this.props.onShowWarning(
      'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  render() {
    const { classes, ui, initialSchema } = this.props;
    return (
      <FormWrapper
        FormikProps={{
          initialStatus: this.typeForm,
        }}
        initialValues={initialSchema}
        validationSchema={Schema}
        enableReinitialize
        onReset={this.onFormReset}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <section className={classes.main}>
            <section className={classes.heading}>
              <Typography variant="h5" className={classes.titleText}>
                Biên Bản Giao Nhận Hàng Hóa
              </Typography>
            </section>
            <section className={classes.content}>
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
                    ui={ui}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Section3
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Section4
                    ui={ui}
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Section5
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Section6
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={16}
                justify="flex-end"
                className={classes.actions}
              >
                <Grid item>
                  <MuiButton
                    outline
                    className={classes.button}
                    onClick={this.onGoBack}
                  >
                    Hủy Bỏ
                  </MuiButton>
                </Grid>
                <WrapperBusiness code={CODE_FORM.BUTTON_SAVE}>
                  {({ disabled }) => (
                    <Grid item>
                      <MuiButton
                        className={classes.button}
                        disabled={disabled}
                        onClick={formik.handleSubmitClick}
                      >
                        Lưu
                      </MuiButton>
                    </Grid>
                  )}
                </WrapperBusiness>
              </Grid>
            </section>
          </section>
        )}
      />
    );
  }
}

BBGNHHCreatePage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
  onShowWarning: PropTypes.func,
  onCreateBBGNHH: PropTypes.func,
  onGetInitMaster: PropTypes.func,
  onResetLeadtime: PropTypes.func,
};

BBGNHHCreatePage.defaultProps = {
  initialSchema: {},
};

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectProp('initialSchema'),
});

export const mapDispatchToProps = dispatch => ({
  onShowWarning: message => dispatch(showWarning(message)),
  onCreateBBGNHH: data => dispatch(bbgnhhRoutine.request({ data })),
  onGetInitMaster: () => dispatch(masterRoutine.request()),
  onResetLeadtime: () => dispatch(leadtimeRoutine.trigger()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'bbgnhhCreate', saga });
const withReducer = injectReducer({ key: 'bbgnhhCreate', reducer });

export default compose(
  withStyles(styles),
  withRouter,
  withSaga,
  withReducer,
  withConnect,
  withImmutablePropsToJS,
)(BBGNHHCreatePage);
