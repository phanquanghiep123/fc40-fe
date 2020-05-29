/*
* Kiểm kê kho - thêm sản phẩm
* url: /quan-ly-kho/them-san-pham
* */

import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import FormWrapper from 'components/FormikUI/FormWrapper';
import formikPropsHelpers from 'utils/formikUtils';
import { showWarning } from 'containers/App/actions';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Grid from '@material-ui/core/Grid';
import CompleteButton from 'components/Button/ButtonComplete';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { debounce } from 'lodash';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { getIn } from 'formik';
import { makeSelectData, makeSelectWareHouse } from './selectors';
import saga from './saga';
import reducer from './reducer';
import FormSection from './FormSection';
import TableSection from './TableSection';
import Heading from './Heading';
import WeightForm from './WeightForm';
import Button from './Button';
import { BTN_CANCEL, BTN_COMPLETE, BTN_SAVE } from './messages';
import baseStyles from './styles';
import * as actions from './actions';
import { initialSchema, validSchema } from './Schema';
import { TYPE_ACTION } from './constants';

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

// eslint-disable-next-line react/prefer-stateless-function
export class AddProducts extends React.Component {
  formik = null;

  actionType = null;

  componentDidMount() {
    this.props.onGetInitMaster(() => {
      if (this.props.data.organizations) {
        this.formik.setFieldValue(
          'plantCode',
          this.props.data.organizations[0].value,
        );
      }
      const plantCode1 = this.formik.values.plantCode;
      this.props.onGetWarehouses({
        plantCode: `${plantCode1}`,
        callback: () => {
          this.formik.setFieldValue('locatorId', this.props.warehouse[0]);
        },
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.headerRef) {
        this.headerRef.onInitProductPage();
      }
    }
  }

  sectionRef = null;

  onDefaultTurnScales = () => {
    this.sectionRef.defaultTurnScales();
  };

  onChangePlantCode = option => {
    this.props.onGetWarehouses({
      plantCode: option.id,
      setDefault: true,
      callback: this.setDefaultWareHouse,
    });
  };

  setDefaultWareHouse = warehouse => {
    this.formik.setFieldValues('locatorName', warehouse.id);
  };

  onGoBack = () => this.props.history.goBack();

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onFormSubmit = values => {
    const data = {
      id: values.id,
      plantCode: values.plantCode,
      locatorId: values.locatorId.value,
      productCode: values.productCode.value,
      productName: values.productCode.productName,
      inventoryQuantity: values.inventoryQuantity,
      stockTakingQuantity: values.stockTakingQuantity,
      stockTakerId: values.stockTakerId,
      batch: values.batch,
      date: values.date,
      dateCreatedBatch: values.dateCreatedBatch,
      originCode: values.originCode.value,
      uom: values.productCode.uom,
      weightDifference: values.weightDifference,
      rateDifference: values.ratePercen,
      reasonDifference: values.reasonDifference,
      stockTakingTurnToScaleDetails: values.stockTakingTurnToScaleDetails,
      isRegisterStockTaking: true,
    };
    if (this.validCondition(data)) {
      const performFunc = () => {
        this.props.onImportedStock(this.actionType, data, filedData => {
          if (this.actionType === TYPE_ACTION.IMPORT_COMPLETEED) {
            setTimeout(this.props.history.goBack, 1000);
          } else {
            this.formik.setFieldValue('id', filedData.id);
            this.formik.setFieldValue('batch', filedData.batch);
            const totalRecords = filedData.stockTakingTurnToScaleDetails.length;
            if (totalRecords < 10) {
              const rows = 10 - totalRecords;
              for (let i = 0; i < rows; i += 1) {
                filedData.stockTakingTurnToScaleDetails.push({});
              }
            }
            this.formik.setFieldValue(
              'turnToScale',
              filedData.stockTakingTurnToScaleDetails,
            );
            const turnToScales = this.getTurnToScales();
            const stockTakingTurnToScale = [];
            turnToScales.map(item => {
              if (item.scalesWeight) {
                const stockTurnToScale = {
                  id: item.id || 0,
                  palletBasketCode: item.palletBasketCode,
                  palletBasketName: item.palletBasketName,
                  palletBasketQuantity: item.palletBasketQuantity,
                  palletCode: item.palletCode,
                  palletName: item.palletName,
                  palletQuantity: item.palletQuantity,
                  scalesWeight: item.scalesWeight,
                  realWeight: item.realWeight,
                };
                stockTakingTurnToScale.push(stockTurnToScale);
              }
              return stockTakingTurnToScale;
            });
            this.formik.setFieldValue(
              'stockTakingTurnToScaleDetails',
              stockTakingTurnToScale,
            );
          }
        });
      };
      if (this.actionType === TYPE_ACTION.IMPORT_COMPLETEED) {
        this.onConfirmShow({
          title: 'Cảnh báo',
          message:
            'Bạn có chắc chắn muốn hoàn thành cân cho sản phẩm này? Sau khi hoàn thành sẽ tạo phiếu nhập điều chỉnh thêm phần chênh lệch vào kho và tăng tồn cho sản phẩm trong kho tương ứng?',
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

  validCondition = values => {
    const turnToScales = getIn(values, 'stockTakingTurnToScaleDetails');
    if (!turnToScales || !turnToScales.length) {
      this.props.showWarning(
        'Thông tin khay sọt yêu cầu ít nhất một lần cân được nhập đúng',
      );
      return false;
    }
    return true;
  };

  getTurnToScales() {
    return getIn(this.formik.values, 'turnToScale');
  }

  onFormInvalid = () => {
    this.props.showWarning(
      'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
    );
  };

  onImportedStock = (type, handleSubmit) => () => {
    handleSubmit();
    this.actionType = type;
  };

  render() {
    const { classes, location, warehouse } = this.props;
    return (
      <Grid container>
        <Grid item>
          <section className="main">
            <FormWrapper
              enableReinitialize
              initialValues={initialSchema}
              validationSchema={validSchema}
              onInvalidSubmission={this.onFormInvalid}
              onSubmit={this.onFormSubmit}
              onConfirmShow={this.onConfirmShow}
              FormikProps={{
                validateOnBlur: false,
                validateOnChange: false,
              }}
              render={formik => {
                this.formik = formik;
                return (
                  <Grid>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Heading
                          onRef={ref => {
                            this.headerRef = ref;
                          }}
                          formik={formik}
                          location={location}
                          // warehouse={warehouse}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormSection formik={formik} warehouse={warehouse} />
                      </Grid>
                      <Grid item xs={12}>
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
                        <TableSection
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
                  </Grid>
                );
              }}
            />
          </section>
        </Grid>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </Grid>
    );
  }
}

AddProducts.propTypes = {
  // ui: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  classes: PropTypes.object.isRequired,
  onGetInitMaster: PropTypes.func,
  onGetWarehouses: PropTypes.func,
  showWarning: PropTypes.func,
  warehouse: PropTypes.array,
  onImportedStock: PropTypes.func,
  data: PropTypes.object,
};
AddProducts.defaultProps = {
  location: {},
};
const mapStateToProps = createStructuredSelector({
  // initialSchema: makeSelectData(),
  warehouse: makeSelectWareHouse(),
  data: makeSelectData(),
});

export const mapDispatchToProps = dispatch => ({
  showWarning: message => dispatch(showWarning(message)),
  onGetInitMaster: callback => dispatch(actions.getInitMaster(callback)),
  onGetWarehouses: payload => dispatch(actions.getWarehouses(payload)),
  onImportedStock: (type, data, callback) => {
    dispatch(actions.inventoryStock(type, data, callback));
  },
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'stockManagementAdd', reducer });
const withSaga = injectSaga({ key: 'stockManagementAdd', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(withImmutablePropsToJS(AddProducts));
