import React from 'react';
import PropTypes from 'prop-types';

import { getColumnDefs } from 'utils/transformUtils';
import formikPropsHelpers from 'utils/formikUtils';

import MESSAGE from 'containers/App/messageGlobal';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';

import MuiButton from 'components/MuiButton';
import AlertDialog from 'components/AlertDialog';
import FormWrapper from 'components/FormikUI/FormWrapper';

import { columns } from 'components/GoodsWeight/header';
import * as GoodsWeight from 'components/GoodsWeight/components';

import Section1 from './Section1';

import Schema from './Schema';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export const MAX_BASKET_TYPE = 3;

export const styles = theme => ({
  actionButtons: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
  button: {
    width: 150,
  },
});

export class WeightPopup extends React.Component {
  columnDefs = getColumnDefs(columns, {
    pallets: null,
    baskets: {
      group: {
        basketCode: {
          cellEditorParams: ({ context }) => ({
            validBeforeChange: nextTurnScale => {
              if (nextTurnScale) {
                const { turnToScales } = context.props.values;
                const previousTurnToScales = this.getPreviousBaskets(
                  context.props.values,
                );

                const turnToScalesFiltered = [
                  ...turnToScales,
                  ...[nextTurnScale],
                ].reduce((results, current) => {
                  if (current) {
                    if (
                      !results.find(
                        item => item && item.basketCode === current.basketCode,
                      )
                    ) {
                      results.push(current);
                    }
                  }
                  return results;
                }, previousTurnToScales);

                if (turnToScalesFiltered.length > MAX_BASKET_TYPE) {
                  this.props.onAlertInvalidWhenSubmit(
                    `Số loại khay sọt vượt quá giới hạn (Tối đa: ${MAX_BASKET_TYPE})`,
                  );
                  return false;
                }
              }
              return true;
            },
          }),
        },
      },
    },
  });

  getPreviousBaskets = values => {
    const results = [];

    if (values.basketCode1) {
      results.push({ basketCode: values.basketCode1 });
    }
    if (values.basketCode2) {
      results.push({ basketCode: values.basketCode2 });
    }
    if (values.basketCode3) {
      results.push({ basketCode: values.basketCode3 });
    }

    return results;
  };

  onFormSubmit = ({ quantity, turnToScales }) => {
    if (this.props.onDataReturn) {
      const basketsReturn = {};

      if (turnToScales) {
        for (let i = 0, len = turnToScales.length; i < len; i += 1) {
          const turnScale = turnToScales[i];

          if (turnScale && turnScale.basketCode) {
            const {
              basketCode,
              basketName,
              basketQuantity,
              basketUoM,
            } = turnScale;

            if (!basketsReturn.basketCode) {
              basketsReturn[basketCode] = {
                name: basketName,
                quantity: 0,
                basketUom: basketUoM,
              };
            }

            basketsReturn[basketCode].quantity += basketQuantity;
          }
        }
      }

      this.props.onDataReturn(this.props.stockIndex, quantity, basketsReturn);
    }
    if (this.props.onCancelClick) {
      this.props.onCancelClick();
    }
  };

  onFormInvalid = () => {
    this.props.onAlertInvalidWhenSubmit(MESSAGE.INVALID_MODEL);
  };

  render() {
    const { classes, openDl, baskets, stockData } = this.props;

    return (
      <FormWrapper
        enableReinitialize
        initialValues={Schema.cast(stockData)}
        validationSchema={Schema}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <AlertDialog
            title="Cân Hàng Hóa"
            openDl={openDl}
            content={
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <Section1 formik={formik} />
                </Grid>
                <Grid item xs={12}>
                  <GoodsWeight.Section3
                    onRef={ref => {
                      this.tableRef = ref;
                    }}
                    title="II. Thông Tin Cân"
                    formik={{
                      ...formik,
                      ...formikPropsHelpers(formik),
                    }}
                    baskets={baskets}
                    columnDefs={this.columnDefs}
                  />
                </Grid>
              </Grid>
            }
            maxWidth="lg"
            fullWidth
            isDialog={false}
            keepMounted={false}
            suppressClose
            customActionDialog={
              <DialogActions className={classes.actionButtons}>
                <MuiButton
                  outline
                  className={classes.button}
                  onClick={this.props.onCancelClick}
                >
                  Huỷ Bỏ
                </MuiButton>
                <MuiButton
                  disabled={formik.isSubmitting}
                  className={classes.button}
                  onClick={formik.handleSubmitClick}
                >
                  Đồng Ý
                </MuiButton>
              </DialogActions>
            }
          />
        )}
      />
    );
  }
}

WeightPopup.propTypes = {
  classes: PropTypes.object.isRequired,
  openDl: PropTypes.bool,
  baskets: PropTypes.array,
  stockData: PropTypes.any,
  stockIndex: PropTypes.number,
  onDataReturn: PropTypes.func,
  onCancelClick: PropTypes.func,
  onAlertInvalidWhenSubmit: PropTypes.func,
};

WeightPopup.defaultProps = {
  baskets: [],
};

export default withStyles(styles)(WeightPopup);
