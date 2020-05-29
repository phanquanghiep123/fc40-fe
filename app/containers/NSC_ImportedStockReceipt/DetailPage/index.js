import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'formik';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormWrapper from 'components/FormikUI/FormWrapper';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { validSchema } from './Schema';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectInitialSchema,
  makeSelectData,
  makeSelectCompleteSuccess,
} from './selectors';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import {
  getImportedStockById,
  printImportedStock,
  submitForm,
} from './actions';
import { styles } from './styles';

class ImportedStockReceiptDetail extends React.PureComponent {
  state = {
    importedStockId: null,
  };

  componentDidMount() {
    const { importedStockId } = this.props;
    this.setState({ importedStockId });
    this.props.onGetImportedStockById(importedStockId);
  }

  printHandler = id => {
    this.props.onPrintImportedStock(id, data => {
      const win = window.open('', 'win', 'width="100%",height="100%"'); // a window object
      if (win === null)
        throw Object({
          message:
            'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
        });
      win.document.open('text/html', 'replace');
      win.document.write(data);
      win.document.close();
    });
  };

  onChangePage = () => {
    const { initialSchema } = this.props;
    if (initialSchema.basketDocumentId) {
      if (initialSchema.basketDocumentStatus === 4) {
        this.props.history.push(
          `/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot?form=3&id=${
            initialSchema.basketDocumentId
          }&isWeight=true`,
        );
      } else if (initialSchema.basketDocumentStatus === 1) {
        this.props.history.push(
          `/danh-sach-phieu-nhap-khay-sot/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${
            initialSchema.basketDocumentId
          }&isWeight=true`,
        );
      }
    }
  };

  render() {
    const {
      classes,
      initialSchema,
      onAlertInvalid,
      onSubmitForm,
      ui,
      openDl,
      closeDialog,
      data,
      match,
      history,
      onRefreshWeight,
      onCompleteSuccess,
      completeSuccess,
    } = this.props;
    const { importedStockId } = this.state;
    const trueValue = true;
    return (
      <ui.Dialog
        {...ui.props}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Phiếu Cân Nhập Kho</span>
            <div>
              {initialSchema.basketDocumentId && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onChangePage}
                  className={classes.btnPNKS}
                >
                  PNKS
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.printHandler(importedStockId)}
              >
                In Phiếu Cân Nhập Kho
              </Button>
            </div>
          </div>
        }
        content={
          <FormWrapper
            enableReinitialize
            initialValues={initialSchema}
            validationSchema={validSchema}
            onSubmit={() => {}}
            onInvalidSubmission={() => {}}
            render={formik => (
              <Form>
                <Grid container justify="space-between">
                  <Grid
                    item
                    lg={12}
                    xl={12}
                    md={12}
                    xs={12}
                    className={classes.section}
                  >
                    <Section1 classes={classes} formik={formik} />
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    xl={12}
                    md={12}
                    xs={12}
                    className={classes.section}
                  >
                    <Section2
                      match={match}
                      history={history}
                      documentId={importedStockId}
                      closeDialog={closeDialog}
                      status={formik.values.status}
                      receiverCode={formik.values.receiverCode}
                      onRefreshWeight={onRefreshWeight}
                      data={data}
                      formik={formik}
                      doType={formik.values.doType}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    xl={12}
                    md={12}
                    xs={12}
                    className={classes.section}
                  >
                    <Section3
                      importedStockId={importedStockId}
                      doType={formik.values.doType}
                      data={data}
                      formik={formik}
                      onAlertInvalid={onAlertInvalid}
                      classes={classes}
                      closeDialog={closeDialog}
                      onSubmitForm={onSubmitForm}
                      onCompleteSuccess={onCompleteSuccess}
                      completeSuccess={completeSuccess}
                    />
                  </Grid>
                </Grid>
              </Form>
            )}
          />
        }
        openDl={openDl}
        isModal
        fullWidth
        maxWidth="lg"
        customActionDialog={trueValue}
      />
    );
  }
}

ImportedStockReceiptDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  history: PropTypes.object,
  onAlertInvalid: PropTypes.func,
  match: PropTypes.object,
  onGetImportedStockById: PropTypes.func,
  onPrint: PropTypes.func,
  closeDialog: PropTypes.func,
  completeSuccess: PropTypes.number,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetImportedStockById: id => dispatch(getImportedStockById(id)),
    onPrintImportedStock: (id, callback) =>
      dispatch(printImportedStock(id, callback)),
    onSubmitForm: (completeInfo, callback) =>
      dispatch(submitForm(completeInfo, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectInitialSchema(),
  data: makeSelectData(),
  completeSuccess: makeSelectCompleteSuccess(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({
  key: 'ImportedStockReceiptDetail',
  reducer,
});
const withSaga = injectSaga({ key: 'ImportedStockReceiptDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJs,
  withStyles(styles),
)(ImportedStockReceiptDetail);
