import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import CardActions from '@material-ui/core/CardActions';

import { TYPE_BASE_UNIT } from 'utils/constants';
import { weighTo, getUnitFromString } from 'utils/weightUnitUtils';

import MuiButton from 'components/MuiButton';
import Expansion from 'components/Expansion';

import GoodsWeightTable from './Table';

export const styles = theme => ({
  actionButtons: {
    padding: 0,
    paddingTop: theme.spacing.unit,
    justifyContent: 'flex-end',
  },
  buttonAdd: {
    margin: 0,
  },
});

export class Section3 extends React.Component {
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

  addRecords = () => {
    if (this.tableRef) {
      this.tableRef.addRecords();
    }
  };

  refreshRecords = () => {
    if (this.tableRef) {
      this.tableRef.refreshRecords();
    }
  };

  defaultTurnScales = () => {
    if (this.tableRef) {
      this.tableRef.defaultTurnScales();
    }
  };

  setNextWeightAuto = nextWeight => {
    if (this.tableRef) {
      const { baseUoM } = this.props.formik.values;

      if (baseUoM === TYPE_BASE_UNIT.KG) {
        const weight = weighTo(
          nextWeight.weight,
          nextWeight.unit,
          getUnitFromString(baseUoM),
        );
        this.tableRef.setNextWeightAuto(weight);
      } else if (this.props.showWarning) {
        this.props.showWarning(
          `Không hỗ trợ Cân tự động cho sản phẩm có đơn vị ${baseUoM}`,
        );
      }
    }
  };

  render() {
    const {
      classes,
      title,
      formik,
      baskets,
      pallets,
      columnDefs,
      quantityKey,
      turnScalesKey,
      defaultColDef,
    } = this.props;

    const ButtonAdd = (
      <MuiButton
        icon="note_add"
        outline
        className={classes.buttonAdd}
        onClick={this.addRecords}
      />
    );

    return (
      <Expansion
        title={title}
        rightActions={ButtonAdd}
        content={
          <React.Fragment>
            <GoodsWeightTable
              ref={ref => {
                this.tableRef = ref;
              }}
              isPopup
              baskets={baskets}
              pallets={pallets}
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              submitCount={formik.submitCount}
              columnDefs={columnDefs}
              quantityKey={quantityKey}
              turnScalesKey={turnScalesKey}
              defaultColDef={defaultColDef}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
              updateFieldArrayValue={formik.updateFieldArrayValue}
            />
            <CardActions className={classes.actionButtons}>
              {ButtonAdd}
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
  title: PropTypes.string,
  formik: PropTypes.object,
  baskets: PropTypes.array,
  pallets: PropTypes.array,
  columnDefs: PropTypes.array,
  quantityKey: PropTypes.string,
  turnScalesKey: PropTypes.string,
  defaultColDef: PropTypes.object,
  showWarning: PropTypes.func,
};

Section3.defaultProps = {
  title: 'III. Thông Tin Cân',
};

export default withStyles(styles)(Section3);
