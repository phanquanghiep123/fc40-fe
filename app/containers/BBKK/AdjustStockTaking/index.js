/**
 *
 * AdjustStockTaking
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FormWrapper from 'components/FormikUI/FormWrapper';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import CompleteButton from 'components/Button/ButtonComplete';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import MuiButton from 'components/MuiButton';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import ConfirmationDialog from 'components/ConfirmationDialog';
import * as selectors from './selectors';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section1Adjust from './Section1Adjust';
import Section2Adjust from './Section2Adjust';
import * as actions from './actions';
import { adjustSchema } from './Schema';
import { showWarning } from '../../App/actions';

export const styles = theme => ({
  actions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  cancel: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  submit: {
    marginTop: theme.spacing.unit,
  },
  space: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
    padding: `${theme.spacing.unit}px`,
    width: '10%',
  },
  section: {
    marginTop: theme.spacing.unit,
  },
  groupButton: {
    marginBottom: theme.spacing.unit * 3,
  },
  tableAsset: {
    marginTop: theme.spacing.unit * 2,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class AdjustStockTaking extends React.PureComponent {
  formik = null;

  actionType = null;

  form = null;

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const typeForm = searchParams.get('form');
    const id = searchParams.get('id');
    this.form = typeForm;
    this.props.onInitValues({ form: typeForm, id });
  }

  onFormSubmit = (type, handleSubmit) => () => {
    handleSubmit();
    this.actionType = type;
  };

  onSaveAdjust = values => {
    if (this.actionType === 2) {
      this.onConfirmShow({
        title: 'Cảnh báo điều chỉnh',
        message: 'Bạn có chắc chắn muốn điều chỉnh các mã được chọn không?',
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () =>
              this.props.onSaveAdjustStocktaking(
                this.actionType,
                values,
                () => {
                  setTimeout(
                    this.props.history.push('/danh-sach-bien-ban-kiem-ke'),
                    1000,
                  );
                },
              ),
          },
        ],
      });
    } else {
      this.props.onSaveAdjustStocktaking(this.actionType, values, () => {
        setTimeout(
          this.props.history.push('/danh-sach-bien-ban-kiem-ke'),
          1000,
        );
      });
      // this.props.history.push('/danh-sach-bien-ban-kiem-ke');
    }
  };

  handleInvalidSubmission = () => {
    this.props.onShowWarning(
      'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  render() {
    const { classes, dataValues } = this.props;
    return (
      <div>
        <FormWrapper
          enableReinitialize
          initialValues={dataValues}
          FormikProps={{
            validateOnBlur: true,
            validateOnChange: true,
          }}
          validationSchema={adjustSchema}
          onSubmit={this.onSaveAdjust}
          onInvalidSubmission={this.handleInvalidSubmission}
          render={formik => {
            this.formik = formik;
            return (
              <div>
                <FormSection {...this.props} formik={formik} form={this.form} />
                {this.form === '1' && (
                  <Section1 {...this.props} formik={formik} form={this.form} />
                )}

                <Section1Adjust
                  {...this.props}
                  formik={formik}
                  form={this.form}
                />
                {this.form === '1' && (
                  <Section2 {...this.props} formik={formik} form={this.form} />
                )}

                <Section2Adjust
                  {...this.props}
                  formik={formik}
                  form={this.form}
                />

                <Section3 {...this.props} formik={formik} form={this.form} />
                {this.form === '2' && (
                  <Section4 {...this.props} formik={formik} form={this.form} />
                )}
                <Grid
                  container
                  className={classNames(classes.groupButton, classes.section)}
                  justify="flex-end"
                >
                  <MuiButton
                    type="button"
                    variant="contained"
                    className={classNames(classes.cancel, classes.space)}
                    onClick={() => this.props.history.goBack()}
                  >
                    Hủy Bỏ
                  </MuiButton>
                  {this.form === '1' && (
                    <MuiButton
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classNames(classes.submit, classes.space)}
                      onClick={debounce(
                        this.onFormSubmit(1, formik.handleSubmitClick),
                        1000,
                      )}
                    >
                      Lưu
                    </MuiButton>
                  )}
                  {this.form === '1' && (
                    <CompleteButton
                      className={classNames(classes.submit, classes.space)}
                      text="Điều Chỉnh"
                      onClick={debounce(
                        this.onFormSubmit(2, formik.handleSubmitClick),
                        1000,
                      )}
                    />
                  )}
                </Grid>
              </div>
            );
          }}
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </div>
    );
  }
}

AdjustStockTaking.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // ui: PropTypes.object,
  // history: PropTypes.object,
  // match: PropTypes.object,
  classes: PropTypes.object,
  onInitValues: PropTypes.func,
  onFetchPopupTableData: PropTypes.func,
  formOptions: PropTypes.object,
  dataValues: PropTypes.object,
  onChangeValueAsset: PropTypes.func,
  onUpdateBasketCancelDetails: PropTypes.func,
  onFetchPopupBasket: PropTypes.func,
  onFetchBigImageBasket: PropTypes.func,
  onSaveAdjustStocktaking: PropTypes.func,
  onChangeField: PropTypes.func,
  onShowWarning: PropTypes.func,
  onChangeImage: PropTypes.func,
  onChangeReasonAsset: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formOptions: selectors.formOptions(),
  dataValues: selectors.dataValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onShowWarning: message => dispatch(showWarning(message)),
    onInitValues: payload => dispatch(actions.getValueForm(payload)),
    onFetchPopupTableData: (filters, assetsTable) =>
      dispatch(actions.fetchPopupTableData(filters, assetsTable)),
    onChangeValueAsset: payload => dispatch(actions.changeValueAsset(payload)),
    onUpdateBasketCancelDetails: payload =>
      dispatch(actions.updateBasketCancelDetails(payload)),
    onFetchPopupBasket: (formik, basketLocatorCode, isEdit, data) =>
      dispatch(
        actions.fetchPopupBasket(formik, basketLocatorCode, isEdit, data),
      ),
    onFetchBigImageBasket: (id, callback) =>
      dispatch(actions.fetchBigImageBasket(id, callback)),
    onSaveAdjustStocktaking: (actionType, data, callback) =>
      dispatch(actions.saveAdjustSubmit(actionType, data, callback)),
    onChangeField: payload => dispatch(actions.changeField(payload)),
    onChangeImage: payload => dispatch(actions.changeImages(payload)),
    onChangeReasonAsset: payload =>
      dispatch(actions.changeReasonAsset(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'adjustStockTaking', reducer });
const withSaga = injectSaga({ key: 'adjustStockTaking', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJs,
  withStyles(styles),
)(AdjustStockTaking);
