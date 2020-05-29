import React from 'react';
import Grid from '@material-ui/core/Grid';
import MuiButton from 'components/MuiButton';
import { withStyles } from '@material-ui/core';
import { groupBy, sumBy } from 'lodash';
import SuggestTable from './SuggestTable';
import SuggestForm from './SuggestForm';
import { basketGroup } from '../basketTrayUtils';

const styles = theme => ({
  spaceTop: {
    marginTop: theme.spacing.unit * 2,
  },
});
class Suggest extends React.PureComponent {
  tableRef = null;

  commitSelected = () => {
    const selecteds = [];
    if (this.tableRef.state.data.length > 0) {
      this.tableRef.state.data.forEach(item => {
        if (item.tableData.checked) {
          selecteds.push(item);
        }
      });
    }

    const {
      formik,
      onCloseDialog,
      formik: {
        values: { detailsCommands },
      },
    } = this.props;
    const grouped = groupBy(
      selecteds,
      i => `${i.locatorId}_${i.productCode}_${i.batch}`,
    );

    const result = Object.keys(grouped).map(item => {
      const basketsGroup = groupBy(grouped[item], i => i.basketCode);

      const baskets = {
        basketCode1: '',
        basketName1: '',
        basketQuantity1: null,
        basketCode2: '',
        basketName2: '',
        basketQuantity2: null,
        basketCode3: '',
        basketName3: '',
        basketQuantity3: null,
      };
      Object.keys(basketsGroup).forEach((bcItem, index) => {
        baskets[`basketCode${index + 1}`] = bcItem;
        baskets[`basketName${index + 1}`] = basketsGroup[bcItem][0].basketName;
        baskets[`basketQuantity${index + 1}`] = sumBy(
          basketsGroup[bcItem],
          'basketQuantity',
        );
        baskets[`basketUoM${index + 1}`] = basketsGroup[bcItem][0].basketUoM;
      });
      const returnObj = {
        ...grouped[item][0],
        ...baskets,
        exportedQuantity: sumBy(grouped[item], 'exportedQuantity'),
        turnToScaleIds: grouped[item].map(obj => obj.id),
        isTurnToScale: true,
        isNotSaved: true,
      };
      delete returnObj.id;
      delete returnObj.basketCode;
      delete returnObj.basketName;
      delete returnObj.basketQuantity;
      delete returnObj.documentCode;
      return returnObj;
    });

    const newDetailsCommands = detailsCommands
      .filter(item => !item.isNotSaved)
      .concat(result);
    formik.setFieldValue('detailsCommands', newDetailsCommands);
    const newBasketsTrays = basketGroup(
      newDetailsCommands,
      formik.values.deliBasketsTrays,
    );
    formik.setFieldValue('basketsTrays', newBasketsTrays);
    onCloseDialog();
  };

  handleTableReady = ref => {
    this.tableRef = ref;
  };

  render() {
    const { onCloseDialog, classes } = this.props;
    return (
      <React.Fragment>
        <SuggestForm {...this.props} />
        <div className={classes.spaceTop} />
        <SuggestTable onHandleTableReady={this.handleTableReady} />
        <div className={classes.spaceTop} />
        <Grid container spacing={16} justify="flex-end">
          <Grid item>
            <MuiButton outline onClick={onCloseDialog}>
              Hủy Bỏ
            </MuiButton>
          </Grid>
          <Grid item>
            <MuiButton onClick={this.commitSelected}>Chọn Sản Phẩm</MuiButton>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Suggest);
