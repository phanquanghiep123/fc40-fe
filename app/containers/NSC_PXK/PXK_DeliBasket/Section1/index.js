import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field } from 'formik';
import {
  MenuItem,
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  FormLabel,
  Hidden,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import appTheme from '../../../App/theme';
import * as makeSelect from '../selectors';
import Expansion from '../../../../components/Expansion';
import DatePickerControl from '../../../../components/DatePickerControl';
import DefaultBasketConfirmDialog from './DefaultBasketConfirmDialog';
import * as actions from '../actions';
import MuiButton from '../../../../components/MuiButton';

// eslint-disable-next-line no-unused-vars
const style = (theme = appTheme) => ({
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
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {},
});

class FormSection extends Component {
  state = {
    openDefaultBasketDialog: false,
  };

  handleDialogClose = () => {
    this.setState({
      openDefaultBasketDialog: false,
    });
  };

  handleDialogOpen = () => {
    this.setState({
      openDefaultBasketDialog: true,
    });
  };

  /**
   * Make form field attributes
   */
  makeFormAttr = () => {
    const {
      formik: pr,
      fieldsData,
      onFetchRouteAutocomplete,
      onFetchBasketAutocomplete,
    } = this.props;

    let autoCompleteTimer;

    return {
      org: {
        name: 'org',
        label: 'Đơn Vị Chia Chọn',
        value: pr.values.org,
        onChange: pr.handleChange,
        component: SelectControl,
        children: fieldsData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      pickingDate: {
        name: 'pickingDate',
        label: 'Ngày Chia Chọn',
        value: pr.values.pickingDate,
        onChange: pr.handleChange,
        component: DatePickerControl,
        disabled: true,
      },
      routeFrom: {
        name: 'routeFrom',
        label: ' ',
        value: pr.values.routeFrom,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Từ...',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchRouteAutocomplete(inputValue, callback);
          }, 500);
        },
      },
      routeTo: {
        name: 'routeTo',
        label: ' ',
        value: pr.values.routeTo,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Đến',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchRouteAutocomplete(inputValue, callback);
          }, 500);
        },
      },
      storeName: {
        name: 'storeName',
        label: 'Tên Cửa Hàng',
        value: pr.values.storeName,
        onChange: pr.handleChange,
        component: InputControl,
      },
      defaultBasket: {
        name: 'defaultBasket',
        label: 'Khay Sọt Mặc Định',
        value: pr.values.defaultBasket,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn khay sọt',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchBasketAutocomplete(inputValue, callback);
          }, 500);
        },
      },
    };
  };

  /**
   * Fill default basket to newly added row + chosen customer
   */
  fillDefaultBasketToTable = () => {
    const { formik } = this.props;
    const values = { ...formik.values };
    const updatedTable = values.tableData.map(item => {
      if (item.isEditable && item.storeCode && !item.basketCode1) {
        return {
          ...item,
          basketCode1: values.defaultBasket.value,
          basketName1: values.defaultBasket.label,
          quantity1: 0,
          isChanged: true,
        };
      }
      return item;
    });

    formik.setFieldValue('tableData', updatedTable);
  };

  /**
   * Print selected records
   */
  printHandler = () => {
    const { formik, onPrintData } = this.props;

    onPrintData(formik.values, data => {
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

  render() {
    const {
      classes,
      formik,
      defaultValues,
      onFetchTableData,
      onChangeExpand,
    } = this.props;
    const formAttr = this.makeFormAttr();

    // confirm when change org
    const defaultBasketConfirmDialog = (
      <DefaultBasketConfirmDialog
        open={this.state.openDefaultBasketDialog}
        onClose={this.handleDialogClose}
        onConfirm={this.fillDefaultBasketToTable}
      />
    );

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ marginBottom: '1rem' }}>
          <Expansion
            title="I. THÔNG TIN CHUNG"
            content={
              <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
                <Grid item xs={6} md={3}>
                  <Field {...formAttr.org} />
                  <Field {...formAttr.pickingDate} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <div className={classes.routeContainer}>
                    <FormLabel className={classes.routeLabel}>Tuyến</FormLabel>
                    <Field {...formAttr.routeFrom} />
                    <span className={classes.routeDivider}>
                      <span>~</span>
                    </span>
                    <Field {...formAttr.routeTo} />
                  </div>
                  <Hidden mdUp>
                    <Field {...formAttr.storeName} />
                  </Hidden>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Hidden smDown>
                    <Field {...formAttr.storeName} />
                  </Hidden>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Field {...formAttr.defaultBasket} />
                  <div className={classes.btnContainer}>
                    <MuiButton
                      onClick={this.handleDialogOpen}
                      disabled={
                        !formik.values.defaultBasket ||
                        !formik.values.tableData ||
                        formik.values.tableData.length === 0
                      }
                    >
                      Mặc định
                    </MuiButton>
                  </div>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <div className={classes.btnContainer}>
                    <MuiButton
                      outline
                      onClick={() => {
                        onFetchTableData({ ...defaultValues });
                      }}
                    >
                      Bỏ lọc
                    </MuiButton>
                    <MuiButton
                      onClick={() => {
                        onFetchTableData(formik.values);
                      }}
                    >
                      Tìm kiếm
                    </MuiButton>
                    <MuiButton
                      outline
                      onClick={this.printHandler}
                      disabled={
                        !formik.values.tableData ||
                        formik.values.tableData.length === 0
                      }
                    >
                      In
                    </MuiButton>
                  </div>
                </Grid>
              </Grid>
            }
            onChange={onChangeExpand}
          />
        </div>
        {defaultBasketConfirmDialog}
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  pageType: PropTypes.object,
  formik: PropTypes.object,
  defaultValues: PropTypes.object,

  // withConnect
  fieldsData: PropTypes.object,
  onFetchRouteAutocomplete: PropTypes.func,
  onFetchBasketAutocomplete: PropTypes.func,
  onFetchTableData: PropTypes.func,
  onPrintData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  fieldsData: makeSelect.fieldsData(),
  defaultValues: makeSelect.defaultValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchRouteAutocomplete: (inputText, callback) =>
      dispatch(actions.fetchRouteAutocomplete(inputText, callback)),
    onFetchBasketAutocomplete: (inputText, callback) =>
      dispatch(actions.fetchBasketAutocomplete(inputText, callback)),
    onFetchTableData: (formValues, currentTableData = []) =>
      dispatch(actions.fetchTableData(formValues, currentTableData)),
    onPrintData: (formValues, callback) =>
      dispatch(actions.printData(formValues, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(FormSection);
