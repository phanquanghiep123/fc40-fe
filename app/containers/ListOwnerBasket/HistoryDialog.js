import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core/styles';
import MuiTable from 'components/MuiTable';
import Expansion from 'components/Expansion';
import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import { historySelector } from './selectors';

export const styles = theme => ({
  space: {
    marginTop: theme.spacing.unit * 4,
  },
  fieldHistory: {
    marginBottom: theme.spacing.unit,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
});
const tableColumns = [
  {
    title: 'STT',
    field: 'id',
    render: rowIndex => rowIndex.tableData.id + 1,
    width: 70,
  },
  {
    title: 'Đơn vị nguồn',
    field: 'plantName',
    width: 200,
  },
  {
    title: 'Đơn vị đích',
    field: 'status',
    width: 200,
  },
  {
    title: 'Ngày giao dịch',
    field: 'palletBasketCode',
    width: 200,
  },
  {
    title: 'Giao dịch',
    field: 'palletBasketName',
    width: 200,
  },
  {
    title: 'Giá trị còn lại tại thời điểm xử lí',
    field: 'quantity',
    width: 200,
  },
];

export class HistoryDialog extends React.Component {
  makeFormAttr = pr => ({
    plantOwner: {
      label: 'Đơn vị Sở Hữu',
      value: pr.plantOwner,
      disabled: true,
    },
    codeAsset: {
      label: 'Mã tài sản',
      value: pr.codeAsset,
      disabled: true,
    },
    palletBasketCode: {
      label: 'Mã khay sọt',
      value: pr.palletBasketCode,
      disabled: true,
    },
    palletBasketName: {
      label: 'Tên khay sọt',
      value: pr.palletBasketName,
      disabled: true,
    },
    status: {
      label: 'Trạng thái',
      value: pr.status,
      disabled: true,
    },
    quantity: {
      label: 'Số Lượng',
      value: pr.quantity,
      disabled: true,
    },
  });

  render() {
    if (this.props.statusName === 'Đã Hủy') {
      if (tableColumns.length === 6) {
        tableColumns.splice(2, 1);
      }
    } else if (this.props.statusName === 'Sở hữu') {
      if (tableColumns.length === 5) {
        tableColumns.splice(2, 0, {
          title: 'Đơn vị đích',
          field: 'status',
          width: 180,
        });
      }
    }
    const { classes, historyBasket } = this.props;
    const formAttr = this.makeFormAttr(historyBasket.form);
    return (
      <div>
        <Expansion
          title="I. Thông Tin Chung"
          content={
            <Grid container spacing={40} style={{ marginBottom: '-0.5rem' }}>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.fieldHistory}
                  >
                    <TextField {...formAttr.plantOwner} />
                  </Grid>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.fieldHistory}
                  >
                    <TextField {...formAttr.status} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.fieldHistory}
                  >
                    <TextField {...formAttr.codeAsset} />
                  </Grid>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.fieldHistory}
                  >
                    <TextField {...formAttr.quantity} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container>
                  <Grid
                    item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className={classes.fieldHistory}
                  >
                    <TextField {...formAttr.palletBasketName} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Grid container />
                <Grid
                  item
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.fieldHistory}
                >
                  <TextField {...formAttr.palletBasketCode} />
                </Grid>
              </Grid>
            </Grid>
          }
        />
        <Paper className={classes.space}>
          <div className={classes.topToolbar}>
            <div className={classes.topToolbarPart}>
              <Typography variant="h6">II. Lịch Sử</Typography>
            </div>
          </div>
          <React.Fragment>
            <MuiTable
              columns={tableColumns}
              data={historyBasket.table}
              options={{
                showTitle: false,
                search: false,
                addRowPosition: 'last',
                showSelectAllCheckbox: true,
                emptyRowsWhenPaging: false,
                selection: false,
                toolbar: false,
              }}
              onRowDoubleClick={this.props.ui.props.onOpenDialog}
            />
          </React.Fragment>
        </Paper>
      </div>
    );
  }
}

HistoryDialog.propTypes = {
  ui: PropTypes.object,
  classes: PropTypes.object.isRequired,
  statusName: PropTypes.string,
  historyTable: PropTypes.object,
};

function mapDispatchToProps() {
  return {};
}
const mapStateToProps = createStructuredSelector({
  historyBasket: historySelector(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(HistoryDialog)),
);
