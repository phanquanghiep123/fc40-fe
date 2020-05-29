import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Grid, Button, withStyles } from '@material-ui/core';
import { Field, Form, Formik } from 'formik/dist/index';
import appTheme from 'containers/App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';

export const styles = (theme = appTheme) => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& > *': {
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export class FormSection extends Component {
  formik = null;

  makeFormAttr = pr => ({
    palletBasketCode: {
      name: 'palletBasketCode',
      label: 'Mã Khay Sọt',
      value: pr.values.palletBasketCode,
      onChange: pr.handleChange,
      component: InputControl,
      placeholder: 'Nhập mã khay sọt cần tìm',
    },
    palletBasketName: {
      name: 'palletBasketName',
      label: 'Tên Khay Sọt',
      onChange: pr.handleChange,
      value: pr.values.palletBasketName,
      component: InputControl,
      placeholder: 'Nhập tên khay sọt cần tìm',
    },
    size: {
      name: 'size',
      label: 'Kích Cỡ',
      placeholder: 'Tất Cả',
      onChange: pr.handleChange,
      component: SelectAutocomplete,
      searchable: true,
      value: pr.values.size,
      options: this.props.size,
    },
  });

  reset = 'RESET';

  handleSearch = params => {
    if (this.reset === params) {
      this.props.onSearch(
        {
          palletBasketCode: null,
          palletBasketName: null,
          size: null,
        },
        this.props.onReset,
      );
    }
    this.props.onSearch(this.formik.values);
  };

  render() {
    const { classes, paramSearch } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={paramSearch}
        render={formik => {
          this.formik = formik;
          const formAttr = this.makeFormAttr(formik);
          return (
            <div>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Form>
                    <Grid
                      container
                      spacing={40}
                      style={{ marginBottom: '-0.5rem' }}
                    >
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Field {...formAttr.palletBasketCode} />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Field {...formAttr.palletBasketName} />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Field {...formAttr.size} />
                      </Grid>
                    </Grid>
                    <div className={classes.btnContainer}>
                      <Button
                        type="button"
                        variant="contained"
                        className={classes.resetBtn}
                        onClick={() => {
                          this.formik.handleReset();
                          this.handleSearch(this.reset);
                        }}
                      >
                        Bỏ lọc
                      </Button>
                      <Button
                        className={classes.btn}
                        variant="contained"
                        type="button"
                        color="primary"
                        onClick={this.handleSearch}
                      >
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form>
                }
              />
            </div>
          );
        }}
      />
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  size: PropTypes.array,
  paramSearch: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  size: selectors.sizeSelector(),
  paramSearch: selectors.paramSearchSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSearch: (data, callback) =>
      dispatch(actions.searchMaster(data, callback)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(FormSection)),
);
