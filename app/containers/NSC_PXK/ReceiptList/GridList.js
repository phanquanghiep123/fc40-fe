import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { Field, getIn } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DvrIcon from '@material-ui/icons/Dvr';

import GridField from './GridField';

import { connectContext } from './connect';

import { TYPE_PXK } from './constants';

export const styles = theme => ({
  gridList: {
    transform: 'translateZ(0)',
  },
  gridListArea: {
    cursor: 'pointer',
  },
  gridListBar: {
    backgroundColor: 'transparent',
  },
  gridListItem: {
    display: 'flex',
    height: '100%',
    border: theme.shade.border,
    borderRadius: theme.shape.borderRadius,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  gridListIcon: {
    padding: theme.spacing.unit,
    marginRight: theme.spacing.unit / 2,
  },
  gridListContent: {
    padding: theme.spacing.unit,
  },
  gridListFooter: {
    padding: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    backgroundColor: theme.palette.action.selected,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
});

/* eslint-disable indent */
export class GridListInner extends React.Component {
  getCols() {
    if (isWidthUp('xl', this.props.width)) {
      return 4;
    }
    if (isWidthUp('lg', this.props.width)) {
      return 3;
    }
    if (isWidthUp('md', this.props.width)) {
      return 2;
    }
    return 1;
  }

  onScaleClick = receipt => {
    this.props.context.onWeightPopupOpen(receipt);
  };

  onDetailClick = (event, receipt) => {
    const plantId = getIn(this.props.formik.values, 'plantCode');

    const receiptId = receipt.id;
    const receiptType = receipt.subType;

    event.stopPropagation();

    this.props.history.push(
      `/danh-sach-phieu-dang-can-xuat-kho/xem-phieu-xuat-kho/${receiptId}?plantId=${plantId}&type=${receiptType}&form=3`,
    );
  };

  render() {
    const { classes, receipts } = this.props;

    return (
      <GridList
        cols={this.getCols()}
        spacing={24}
        cellHeight="auto"
        className={classes.gridList}
      >
        {receipts.map((receipt, idx) => (
          <GridListTile
            key={String(idx)}
            className={classes.gridListArea}
            onClick={() => this.onScaleClick(receipt)}
          >
            <div className={classes.gridListItem}>
              <Grid
                container
                alignContent="flex-start"
                className={classes.gridListContent}
              >
                <Grid item xs={12}>
                  <Field
                    label="Mã PXK"
                    value={receipt.documentCode}
                    component={GridField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    label="Loại Xuất Kho"
                    value={receipt.subTypeName}
                    valueColor={
                      receipt.subType === TYPE_PXK.PXK_DIEU_CHUYEN
                        ? 'color1'
                        : 'color2'
                    }
                    component={GridField}
                  />
                </Grid>
                {receipt.productCode && (
                  <Grid item xs={12}>
                    <Field
                      item
                      label="Sản Phẩm"
                      value={receipt.productName}
                      component={GridField}
                    />
                  </Grid>
                )}
                {receipt.productCode && (
                  <Grid item xs={12}>
                    <Field
                      item
                      label="Kho Nguồn"
                      value={receipt.locatorName}
                      component={GridField}
                    />
                  </Grid>
                )}
                {receipt.productCode && (
                  <Grid item xs={12}>
                    <Field
                      item
                      label="Batch"
                      value={receipt.slotCode}
                      component={GridField}
                    />
                  </Grid>
                )}
                {receipt.productCode &&
                  receipt.subType === TYPE_PXK.PXK_DIEU_CHUYEN && (
                    <Grid item xs={12}>
                      <Field
                        item
                        label="Phân Loại Xử Lý"
                        value={receipt.processingTypeName}
                        component={GridField}
                      />
                    </Grid>
                  )}
              </Grid>
              {receipt.subType === TYPE_PXK.PXK_DIEU_CHUYEN && (
                <div className={classes.gridListFooter}>
                  <Field
                    label="Đơn Vị Nhận Hàng"
                    value={receipt.receiverName}
                    valueJustify="flex-end"
                    component={GridField}
                  />
                </div>
              )}
            </div>
            <GridListTileBar
              actionIcon={
                <Tooltip title="Xem chi tiết">
                  <IconButton
                    className={classes.gridListIcon}
                    onClick={e => this.onDetailClick(e, receipt)}
                  >
                    <DvrIcon />
                  </IconButton>
                </Tooltip>
              }
              titlePosition="top"
              actionPosition="right"
              className={classes.gridListBar}
            />
          </GridListTile>
        ))}
      </GridList>
    );
  }
}

GridListInner.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  formik: PropTypes.object,
  context: PropTypes.shape({
    onWeightPopupOpen: PropTypes.func,
  }),
  receipts: PropTypes.array,
};

GridListInner.defaultProps = {
  receipts: [],
};

export default compose(
  connectContext,
  withRouter,
  withWidth(),
  withStyles(styles),
)(GridListInner);
