import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';

import { makeSelectedWeight } from 'containers/App/selectors';

import { TYPE_BASE_UNIT } from 'utils/constants';
import { weighTo, getUnitFromString } from 'utils/weightUnitUtils';

import Expansion from 'components/Expansion';

import { makeSelectData } from './selectors';

import Button from './Button';

import WeightTable from './WeightTable';

import baseStyles from './styles';
import { customerRoutine } from './routines';

export const styles = theme => ({
  ...baseStyles(theme),
  add: {
    margin: 0,
  },
  actions: {
    padding: 0,
    paddingTop: theme.spacing.unit,
    justifyContent: 'flex-end',
  },
});

export class Section3 extends React.Component {
  tableRef = null;

  componentDidMount() {
    this.setRef(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.productLoading &&
        nextProps.productLoading !== this.props.productLoading) ||
      (nextProps.receiptsLoading &&
        nextProps.receiptsLoading !== this.props.receiptsLoading)
    ) {
      this.onRefreshRecords();
    }

    if (this.props.weightAuto.length < nextProps.weightAuto.length) {
      const nextWeight = nextProps.weightAuto[nextProps.weightAuto.length - 1];

      if (this.tableRef) {
        const { baseUoM } = nextProps.formik.values;

        if (baseUoM === TYPE_BASE_UNIT.KG) {
          const weight = weighTo(
            nextWeight.weight,
            nextWeight.unit,
            getUnitFromString(nextProps.formik.values.baseUoM),
          );
          this.tableRef.setNextWeightAuto(weight);
        } else if (this.props.showWarning) {
          this.props.showWarning(
            `Không hỗ trợ Cân tự động cho sản phẩm có đơn vị ${baseUoM}`,
          );
        }
      }
    }
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.onRef) {
      this.props.onRef(ref);
    }
  }

  getTitle() {
    const { formik, deliveryName, processingTypeName } = this.props;
    const { productCode, productName } = formik.values;

    const parts = [];

    if (productCode) {
      parts.push(productCode);

      if (productName) {
        parts.push(productName);
      }
      if (processingTypeName) {
        parts.push(processingTypeName);
      }
      if (deliveryName) {
        parts.push(deliveryName);
      }
    }

    return `III. Thông Tin Cân ${
      parts.length > 0 ? `: ${parts.join(' - ')}` : ''
    }`;
  }

  addRecords = () => {
    if (this.tableRef) {
      this.tableRef.addRecords();
    }
  };

  onRefreshRecords = () => {
    if (this.tableRef) {
      this.tableRef.refreshRecords();
    }
  };

  defaultTurnScales = () => {
    if (this.tableRef) {
      this.tableRef.defaultTurnScales();
    }
  };

  render() {
    const {
      classes,
      formik,
      baskets,
      pallets,
      showWarning,
      getCustomerAuto,
    } = this.props;
    const title = this.getTitle();

    return (
      <Expansion
        title={title}
        headLeftStyle={{ width: '70%' }}
        headRightStyle={{ width: '30%' }}
        rightActions={
          <Button
            icon="note_add"
            outline
            className={classes.add}
            onClick={this.addRecords}
          />
        }
        content={
          <React.Fragment>
            <WeightTable
              ref={ref => {
                this.tableRef = ref;
              }}
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              submitCount={formik.submitCount}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
              updateFieldArrayValue={formik.updateFieldArrayValue}
              baskets={baskets}
              pallets={pallets}
              showWarning={showWarning}
              getCustomerAuto={getCustomerAuto}
            />
            <CardActions className={classes.actions}>
              <Button
                icon="note_add"
                outline
                className={classes.add}
                onClick={this.addRecords}
              />
            </CardActions>
          </React.Fragment>
        }
        unmountOnExit={false}
      />
    );
  }
}

Section3.propTypes = {
  classes: PropTypes.object.isRequired,
  onRef: PropTypes.func,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  weightAuto: PropTypes.array,
  deliveryName: PropTypes.string,
  productLoading: PropTypes.bool,
  receiptsLoading: PropTypes.bool,
  processingTypeName: PropTypes.string,
  showWarning: PropTypes.func,
  getCustomerAuto: PropTypes.func,
};

Section3.defaultProps = {
  baskets: [],
  pallets: [],
  weightAuto: [],
  productLoading: false,
  receiptsLoading: false,
};

export const mapDispatchToProps = dispatch => ({
  getCustomerAuto: (inputText, callback) =>
    dispatch(customerRoutine.request({ inputText, callback })),
});

const mapStateToProps = createStructuredSelector({
  baskets: makeSelectData('master', 'baskets'),
  pallets: makeSelectData('master', 'pallets'),
  weightAuto: makeSelectedWeight(),
  deliveryName: makeSelectData('product', 'deliveryName'),
  productLoading: makeSelectData('product', 'loading'),
  receiptsLoading: makeSelectData('receipts', 'loading'),
  processingTypeName: makeSelectData('product', 'processingTypeName'),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Section3);
