import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import { Form, getIn } from 'formik';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import formikPropsHelpers from 'utils/formikUtils';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import FormWrapper from 'components/FormikUI/FormWrapper';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CompleteButton from 'components/Button/ButtonComplete';

import { showWarning } from 'containers/App/actions';

import saga from './saga';
import reducer from './reducer';
import { makeSelectData } from './selectors';
import { masterRoutine, importedRoutine } from './routines';

import Button from './Button';
import Heading from './Heading';

import Section1 from './Section1';
import Section3 from './Section3';

import WeightForm from './WeightForm';

import WeighedImportedSchema from './Schema';
import { formatWeighedProduct } from './transformUtils';

import { TYPE_USER, TYPE_ACTION, PRODUCT_STATUS } from './constants';
import { BTN_CANCEL, BTN_SAVE, BTN_COMPLETE } from './messages';

import baseStyles from './styles';
import ImportedStockReceiptDetail from '../DetailPage';
import ImportedStockReceipt from '../CreatePage';
import { openDialogImportStock } from '../CreatePage/actions';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export const styles = theme => ({
  ...baseStyles(theme),
  actions: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  completeButton: {
    backgroundColor: theme.palette.orange[800],
    color: theme.palette.getContrastText(theme.palette.orange[800]),
    '&:hover': {
      backgroundColor: theme.palette.orange[900],
      color: theme.palette.getContrastText(theme.palette.orange[900]),
    },
  },
});

export class WeighedImportedPage extends React.Component {
  headerRef = null;

  state = { openDlDetail: false, plantCode: null, documentId: null };

  sectionRef = null;

  actionType = null;

  componentDidMount() {
    this.props.onGetInitMaster(() => {
      if (this.headerRef) {
        this.headerRef.onInitPage();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.headerRef) {
        this.headerRef.onInitProductPage();
      }
    }
  }

  validCondition = values => {
    const typeUser = getIn(values, 'isSupplier');
    const turnToScales = getIn(values, 'turnToScales');

    if (this.actionType === TYPE_ACTION.IMPORT_COMPLETEED) {
      if (!turnToScales || !turnToScales.length) {
        this.props.showWarning(
          'Thông tin khay sọt yêu cầu ít nhất một lần cân được nhập đúng',
        );
        return false;
      }
    }

    if (typeUser === TYPE_USER.NCC) {
      const quantity = getIn(values, 'quantity');
      const recoveryRate = getIn(values, 'recoveryRate');

      const totalQuantity = getIn(values, 'totalQuantity');
      const planedQuantity = getIn(values, 'planedQuantity');

      // Khối lượng sau khấu trừ = Khối lượng thực tế - (Khối lượng thực tế * Tỉ lệ khấu trừ)
      //                         = quantity - (quantity * (recoveryRate / 100))

      const recoveryQuantity = (
        quantity -
        quantity * (recoveryRate / 100)
      ).toFixed(3); // [Khối lượng sau khấu trừ] không được phép lớn hơn [Khối lượng dự kiến]

      if (recoveryQuantity > planedQuantity) {
        this.props.showWarning(
          'Khối lượng sau khấu trừ không được lớn hơn Khối lượng dự kiến',
        );
        return false;
      }

      // Tổng [Khối lượng sau khấu trừ] không được phép lớn hơn [Khối lượng dự kiến]
      if (totalQuantity + recoveryQuantity > planedQuantity) {
        this.props.showWarning(
          'Tổng Khối lượng sau khấu trừ của các chuyến xe không được lớn hơn Khối lượng dự kiến',
        );
        return false;
      }
    }

    return true;
  };

  onGoBack = () => this.props.history.goBack();

  onFormSubmit = values => {
    const nextValues = formatWeighedProduct(values);

    if (this.validCondition(nextValues)) {
      const performFunc = () => {
        this.props.onImportedStock(this.actionType, values, () => {
          if (this.headerRef) {
            this.headerRef.onImportedSuccess();
          }
        });
      };

      if (this.actionType === TYPE_ACTION.IMPORT_COMPLETEED) {
        this.onConfirmShow({
          title: 'Cảnh báo',
          message: 'Bạn có muốn hoàn thành cân cho sản phẩm này?',
          actions: [
            { text: 'Bỏ qua' },
            { text: 'Đồng ý', color: 'primary', onClick: performFunc },
          ],
        });
      } else {
        performFunc();
      }
    }
  };

  onFormInvalid = () => {
    this.props.showWarning(
      'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
    );
  };

  onImportedStock = (type, handleSubmit) => () => {
    handleSubmit();
    this.actionType = type;
  };

  onDefaultTurnScales = () => {
    this.sectionRef.defaultTurnScales();
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  receiptWatch = (plantCode, documentId) => {
    this.setState({ openDlDetail: true, plantCode, documentId });
  };

  closeReceiptWatch = () => {
    this.setState({ openDlDetail: false });
  };

  onRefreshWeight = data => {
    this.replaceSearchParams({
      ...data,
      plantCode: this.state.plantCode,
      documentId: this.state.documentId,
    });
  };

  onCreateSuccess = (plantCode, documentId) => {
    if (this.headerRef) {
      this.headerRef.focusReceiptCreated(plantCode, () => {
        this.replaceSearchParams({
          plantCode,
          documentId,
        });
      });
    }
  };

  onCompleteSuccess = () => {
    if (this.headerRef) {
      this.headerRef.focusReceiptCreated(this.state.plantCode, () => {
        this.replaceSearchParams({
          plantCode: this.state.plantCode,
        });
      });
    }
  };

  replaceSearchParams = params => {
    if (this.headerRef) {
      const searchParams = this.headerRef.makeSearchParams(
        this.props.history.location.search,
        params,
      );

      this.props.history.replace({
        ...this.props.history.location,
        search: searchParams,
      });
    }
  };

  render() {
    const {
      classes,
      location,
      initialSchema,
      onReceiptCreate,
      ui,
      history,
      match,
    } = this.props;
    const { openDlDetail, documentId } = this.state;

    return (
      <React.Fragment>
        <ImportedStockReceipt
          match={match}
          onCreateSuccess={this.onCreateSuccess}
          ui={ui}
          history={history}
        />
        {openDlDetail && (
          <ImportedStockReceiptDetail
            ui={ui}
            importedStockId={documentId}
            openDl={openDlDetail}
            history={history}
            match={match}
            closeDialog={this.closeReceiptWatch}
            onRefreshWeight={this.onRefreshWeight}
            onCompleteSuccess={this.onCompleteSuccess}
          />
        )}
        <section className={classes.main}>
          <FormWrapper
            enableReinitialize
            initialValues={initialSchema}
            validationSchema={WeighedImportedSchema}
            onSubmit={this.onFormSubmit}
            onInvalidSubmission={this.onFormInvalid}
            render={formik => {
              const receiptId = getIn(formik.values, 'documentId');
              const productCode = getIn(formik.values, 'productCode');
              const productStatus = getIn(
                formik.values,
                'documentDetailStatus',
              );

              return (
                <Form>
                  <Heading
                    onRef={ref => {
                      this.headerRef = ref;
                    }}
                    formik={formik}
                    location={location}
                    onConfirmShow={this.onConfirmShow}
                    onReceiptWatch={this.receiptWatch}
                    onReceiptCreate={onReceiptCreate}
                  />
                  <section className={classes.content}>
                    <Grid container spacing={24}>
                      <Grid item xs={12} lg={6}>
                        <Section1 formik={formik} />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <WeightForm
                          formik={{
                            ...formik,
                            ...formikPropsHelpers(formik),
                          }}
                          showWarning={this.props.showWarning}
                          onDefaultClick={this.onDefaultTurnScales}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Section3
                          onRef={ref => {
                            this.sectionRef = ref;
                          }}
                          formik={{
                            ...formik,
                            ...formikPropsHelpers(formik),
                          }}
                          showWarning={this.props.showWarning}
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
                        <Button
                          text={BTN_CANCEL}
                          outline
                          onClick={this.onGoBack}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          text={BTN_SAVE}
                          disabled={
                            !receiptId ||
                            !productCode ||
                            productStatus === PRODUCT_STATUS.COMPLETED ||
                            formik.isSubmitting
                          }
                          onClick={debounce(
                            this.onImportedStock(
                              TYPE_ACTION.IMPORT_STOCK,
                              formik.handleSubmitClick,
                            ),
                            SUBMIT_TIMEOUT,
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <CompleteButton
                          text={BTN_COMPLETE}
                          className={classes.completeButton}
                          disabled={
                            !receiptId ||
                            !productCode ||
                            productStatus === PRODUCT_STATUS.COMPLETED ||
                            formik.isSubmitting
                          }
                          onClick={debounce(
                            this.onImportedStock(
                              TYPE_ACTION.IMPORT_COMPLETEED,
                              formik.handleSubmitClick,
                            ),
                            SUBMIT_TIMEOUT,
                          )}
                        />
                      </Grid>
                    </Grid>
                  </section>
                </Form>
              );
            }}
          />
        </section>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

WeighedImportedPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  initialSchema: PropTypes.object,
  showWarning: PropTypes.func,
  onGetInitMaster: PropTypes.func,
  onImportedStock: PropTypes.func,
  ui: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  onReceiptCreate: PropTypes.func,
};

WeighedImportedPage.defaultProps = {
  location: {},
  initialSchema: {},
};

export const mapDispatchToProps = dispatch => ({
  showWarning: message => dispatch(showWarning(message)),
  onImportedStock: (type, data, callback) =>
    dispatch(importedRoutine.request({ type, data, callback })),
  onGetInitMaster: callback => dispatch(masterRoutine.request({ callback })),
  onReceiptCreate: () => dispatch(openDialogImportStock(null)),
});

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectData('product'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'weightedImported', saga });
const withReducer = injectReducer({ key: 'weightedImported', reducer });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(withRouter(WeighedImportedPage))));
