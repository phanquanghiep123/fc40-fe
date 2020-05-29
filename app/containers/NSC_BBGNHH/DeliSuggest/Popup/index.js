import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';

import { closeDialog } from 'containers/App/actions';
import { formikPropsHelpers } from 'components/FormikUI/utils';
import FormWrapper from 'components/FormikUI/FormWrapper';

import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import {
  Button,
  FormLabel,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import { connectContext } from '../context';
import TableSection from './TableSection';

import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import Expansion from '../../../../components/Expansion';
import appTheme from '../../../App/theme';

import * as actions from '../actions';
import DatePickerControl from '../../../../components/DatePickerControl';
import * as selectors from '../selectors';

export const styles = theme => ({
  content: {
    // paddingLeft: 0,
    // paddingRight: 0,
    padding: theme.spacing.unit * 2,
  },
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    width: 150,
  },
  expansionContainer: {
    // marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  routeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
  },
  routeDivider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '4rem',
    paddingTop: '0.5rem',
  },
  routeLabel: {
    fontSize: '0.75rem',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& > *': {
      minWidth: 120,
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
  btn: {
    margin: 'unset',
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

const muiTheme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiPaper: {
      root: {
        marginBottom: '2rem',
      },
    },
  },
});

export class Popup extends React.Component {
  // componentDidMount() {
  //   this.props.onFetchFormData(this.props.formDefaultValues);
  // }

  onFormSubmit = values => {
    this.props.onPerformUpdate(values, () => {
      this.props.closeDialog();
      this.props.context.onGetReceipts();
    });
  };

  makeFormAttr = pr => {
    const { formData, onFetchRoute } = this.props;
    let autoCompleteTimer;

    return {
      deliver: {
        name: 'deliver',
        label: 'Đơn Vị Giao Hàng',
        component: SelectAutocomplete,
        options: formData.deliver,
        value: pr.values.deliver,
        placeholder: 'Tất Cả',
        disabled: true,
      },
      // deliver: {
      //   name: 'deliver',
      //   label: 'Đơn Vị Giao Hàng',
      //   component: SelectControl,
      //   value: pr.values.deliver,
      //   onChange: pr.handleChange,
      //   disabled: true,
      //   children: formData.deliver.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      // },
      routeFrom: {
        name: 'routeFrom',
        label: ' ',
        component: SelectAutocomplete,
        value: pr.values.routeFrom,
        onChange: pr.handleChange,
        placeholder: 'Từ...',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchRoute(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      routeTo: {
        name: 'routeTo',
        label: ' ',
        component: SelectAutocomplete,
        value: pr.values.routeTo,
        onChange: pr.handleChange,
        placeholder: 'Đến',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchRoute(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      processDate: {
        name: 'processDate',
        label: 'Ngày Chia Chọn',
        component: DatePickerControl,
        value: pr.values.processDate,
        disabled: true,
      },
    };
  };

  storeHandler = (selectedRecords, formik) => {
    if (this.props.onSelectionSuccess) {
      this.props.onSelectionSuccess(selectedRecords);
    }
    this.props.onSubmitStoreSelected(selectedRecords, formik.values);
  };

  // onEnteredDialog = () => {
  //   this.props.onFetchFormData(this.props.formDefaultValues);
  // };

  render() {
    const {
      classes,
      ui,
      formDefaultValues,
      selectedRecords,
      onFormSubmit,
    } = this.props;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <FormWrapper
          enableReinitialize
          initialValues={formDefaultValues}
          onSubmit={(values, formikActions) => {
            onFormSubmit(values);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            if (formikActions) {
              formikActions.setValues({ ...formDefaultValues });
            }
            onFormSubmit({ ...formDefaultValues });
          }}
          render={formik => {
            const formAttr = this.makeFormAttr(formik);
            return (
              <ui.Dialog
                {...ui.props}
                title="Gợi ý từ Deli"
                content={
                  <div>
                    <Expansion
                      title="I. Thông Tin Chung"
                      className={classes.expansionContainer}
                      content={
                        <React.Fragment>
                          <Grid container spacing={24}>
                            <Grid item xs={12} md={6}>
                              <Field {...formAttr.deliver} />
                              <div className={classes.routeContainer}>
                                <FormLabel className={classes.routeLabel}>
                                  Tuyến
                                </FormLabel>
                                <Field {...formAttr.routeFrom} />
                                <span className={classes.routeDivider}>
                                  <span>~</span>
                                </span>
                                <Field {...formAttr.routeTo} />
                              </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Field {...formAttr.processDate} />
                            </Grid>
                          </Grid>
                          <Grid container spacing={40}>
                            <Grid item xs={12}>
                              <div className={classes.btnContainer}>
                                <Button
                                  type="button"
                                  variant="contained"
                                  onClick={formik.handleReset}
                                  className={classes.resetBtn}
                                >
                                  Bỏ lọc
                                </Button>
                                <Button
                                  className={classes.btn}
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  onClick={formik.handleSubmit}
                                >
                                  Tìm kiếm
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                    />
                    <TableSection
                      className={classes.expansionContainer}
                      formik={{
                        ...formik,
                        ...formikPropsHelpers(formik),
                      }}
                    />
                  </div>
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
                    <div className={classes.btnContainer}>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={this.props.closeDialog}
                        className={classes.resetBtn}
                      >
                        Đóng
                      </Button>
                      <Button
                        className={classes.btn}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          this.storeHandler(selectedRecords, formik)
                        }
                      >
                        Chọn Cửa Hàng
                      </Button>
                    </div>
                  </DialogActions>
                }
                // onExitedDialog={formik.handleResetClick}
                // onEnteredDialog={this.onEnteredDialog}
              />
            );
          }}
        />
      </MuiThemeProvider>
    );
  }
}

Popup.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  context: PropTypes.shape({
    onGetReceipts: PropTypes.func,
  }),
  formData: PropTypes.object,
  selectedRecords: PropTypes.array,
  onFormSubmit: PropTypes.func,
  closeDialog: PropTypes.func,
  onPerformUpdate: PropTypes.func,
  formDefaultValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onFetchRoute: PropTypes.func,
  onSelectionSuccess: PropTypes.func,
};

export const mapStateToProps = createStructuredSelector({
  formDefaultValues: selectors.formDefaultValues(),
  formData: selectors.formData(),
  selectedRecords: selectors.tableSelectedRecords(),
});

export const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
  onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
  onSubmitStoreSelected: (selectedRecords, formValues) =>
    dispatch(actions.submitStoreRecords(selectedRecords, formValues)),
  onFetchRoute: (inputValue, callback) =>
    dispatch(actions.fetchRoute(inputValue, callback)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  connectContext,
  withStyles(styles),
)(Popup);
