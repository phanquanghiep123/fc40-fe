import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MuiSelectInput from 'components/MuiSelect/Input';
import DatePickerControl from 'components/DatePickerControl';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import classNames from 'classnames';
import { makeSelectData, makeSelectWareHouse } from './selectors';
// import { initialSchema } from './Schema';
import * as action from './actions';
export const styles = theme => ({
  heading: {},
  section: {},
  page: {
    marginTop: theme.spacing.unit * 2,
  },
  titlePage: {
    fontSize: 24,
    fontWeight: 400,
  },
  titleText: {
    fontWeight: 500,
    fontSize: 14,
  },
  label: {
    backgroundColor: theme.palette.action.selected,
  },
  labelText: {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
  toolbar: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  toolbarText: {
    width: 140,
    fontSize: 16,
  },
  medium: {
    width: 250,
  },
  select: {
    paddingLeft: theme.spacing.unit * 1.5,
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
  },
});

class Heading extends React.Component {
  state = {};

  componentDidMount() {
    this.setRef(this);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.onRef) {
      this.props.onRef(ref);
    }
  }

  onPlantChange = (option = {}) => {
    this.props.formik.setFieldValue('plantCode', option.value);
    this.props.onGetWarehouses(option.value, () => {
      const records = [];
      const row = 10;
      for (let i = 0; i < row; i += 1) {
        records.push({});
      }
      this.props.formik.setValues({
        ...this.props.formik.values,
        locatorId: this.props.warehouse[0],
        productCode: '',
        batch: '',
        stockTakingQuantity: 0,
        rateDifference: '',
        reasonDifference: '',
        weightDifference: 0,
        dateCreatedBatch: new Date(),
        originCode: '',
        turnToScale: records,
        stockTakingTurnToScaleDetails: [],
      });
    });
  };

  render() {
    const { data, classes } = this.props;
    return (
      <section className={classes.page}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.titlePage}>
              Kiểm kê kho - Thêm sản phẩm
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={16} alignItems="center">
              <Grid item>
                <Typography
                  variant="h6"
                  className={classNames(classes.titleText, classes.toolbarText)}
                >
                  Đơn vị
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.medium}>
                <Field
                  name="plantCode"
                  component={MuiSelectInput}
                  styles={{
                    dropdownIndicator: base => ({
                      ...base,
                    }),
                  }}
                  classes={{
                    input: classes.select,
                  }}
                  options={data.organizations}
                  labelKey="name"
                  valueKey="value"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  TextFieldProps={{
                    margin: 'none',
                    variant: 'filled',
                  }}
                  onChange={this.onPlantChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={16} alignItems="center">
              <Grid item>
                <Typography
                  variant="h6"
                  className={classNames(classes.titleText)}
                >
                  Ngày xử lý giao dịch:
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.medium}>
                <Field name="date" component={DatePickerControl} disabled />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>
    );
  }
}
Heading.propTypes = {
  classes: PropTypes.object.isRequired,
  onRef: PropTypes.func,
  data: PropTypes.object,
  // location: PropTypes.object,
  // onChangePlantCode: PropTypes.func,
  // onGetInventory: PropTypes.func,
  formik: PropTypes.object,
  warehouse: PropTypes.array,
  onGetWarehouses: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
  warehouse: makeSelectWareHouse(),
});
export const mapDispatchToProps = dispatch => ({
  onGetInventory: (plantCode, callback) =>
    dispatch(action.getInventory({ plantCode, callback })),
  onGetWarehouses: (plantCode, callback) =>
    dispatch(action.getWarehouses({ plantCode, callback })),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(withStyles(styles)(withImmutablePropsToJS(Heading)));
