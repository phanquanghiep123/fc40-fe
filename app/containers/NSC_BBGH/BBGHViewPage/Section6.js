import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

import FormData from 'components/FormikUI/FormData';

import { columnDefsDeliverNotEdit } from '../BBGHCreatePage/header';
import {
  columnDefsReciver,
  columnDefsReciverLoanPay,
  columnDefsDeliverLoanPay,
} from './header';
import { deleteImage } from './actions';
import CellRenderer from './CellRenderer';
import { viewBasketSection } from '../BBGHCreatePage/basketLogicFunction';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

const styles = theme => ({
  tabs: {
    padding: 16,
  },
  tab: {
    minWidth: 100,
    minHeight: 36,
    textTransform: 'capitalize',
  },
  tabLabel: {
    [theme.breakpoints.up('md')]: {
      padding: '6px 12px',
    },
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
  indicatorColor: {
    backgroundColor: 'rgba(71, 111, 144, 0.2)',
  },
  // images
  deleteImage: {
    height: 24,
    minHeight: 24,
    width: 24,
    position: 'absolute',
    top: -100,
    right: -12,
  },
  image: {
    width: 200,
    height: 200,
  },
  imageWrapper: {
    position: 'relative',
    margin: 12,
  },
});

export class Section6 extends React.Component {
  state = {
    tabs: 0,
  };

  changeTabs = (event, value) => {
    this.setState({ tabs: value });
  };

  onDeleteImage = (idImage, indexRecord, indexImage) => {
    const { formik } = this.props;
    this.props.onDeleteImage(formik.values.id, idImage, () => {
      formik.values.shipperList[
        indexRecord
      ].deliveryOrderTransportViolationList[indexImage].violationPicture = null;

      formik.setFieldValue('shipperList', formik.values.shipperList);
    });
  };

  render() {
    const { classes, formik } = this.props;
    const { tabs } = this.state;
    const gridStyle = { height: 'auto' };
    const gridProps = { context: this, domLayout: 'autoHeight' };

    return (
      <Expansion
        title={`${
          viewBasketSection(formik.values.doType) ? 'V' : 'VI'
        }. Thông Tin Bên Vận Chuyển`}
        rightActions={
          <Tabs
            classes={{
              root: classes.tabs,
            }}
            TabIndicatorProps={{
              classes: {
                root: classes.indicator,
                colorSecondary: classes.indicatorColor,
              },
            }}
            value={tabs}
            onChange={this.changeTabs}
          >
            {[
              { value: 0, label: 'Bên giao' },
              { value: 1, label: 'Bên nhận' },
            ].map(tab => (
              <Tab
                key={tab.value}
                disableRipple
                classes={{
                  root: classes.tab,
                  labelContainer: classes.tabLabel,
                }}
                label={tab.label}
              />
            ))}
          </Tabs>
        }
        content={
          <div style={{ marginBottom: 30 }}>
            {tabs === 0 && (
              <FormData
                idGrid="grid-section6"
                name="shipperList"
                gridProps={gridProps}
                gridStyle={gridStyle}
                // columnDefs={columnDefsDeliverNotEdit}
                columnDefs={
                  formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                    ? columnDefsDeliverLoanPay
                    : columnDefsDeliverNotEdit
                }
                cellRenderer={CellRenderer}
                {...formik}
              />
            )}
            {tabs === 1 && (
              <FormData
                idGrid="grid-section61"
                name="shipperList"
                gridStyle={gridStyle}
                gridProps={gridProps}
                cellRenderer={CellRenderer}
                columnDefs={
                  formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                    ? columnDefsReciverLoanPay
                    : columnDefsReciver
                }
                // columnDefs={columnDefsReciver}
                {...formik}
              />
            )}
            <Grid item lg={12} xs={12}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={8}
              >
                {formik.values.shipperList.map((transport, indexRecord) =>
                  transport.deliveryOrderTransportViolationList.map(
                    (item, indexImage) => (
                      <Grid item key={item.deliveryOrderShipperListId}>
                        <span className={classes.imageWrapper}>
                          <img
                            className={classes.image}
                            alt=""
                            src={item.violationPicture}
                            style={
                              item.violationPicture ? null : { display: 'none' }
                            }
                          />
                          {item.violationPicture && (
                            <Fab
                              color="primary"
                              className={classes.deleteImage}
                              onClick={() =>
                                this.onDeleteImage(
                                  item.id,
                                  indexRecord,
                                  indexImage,
                                )
                              }
                            >
                              x
                            </Fab>
                          )}
                        </span>
                      </Grid>
                    ),
                  ),
                )}
              </Grid>
            </Grid>
          </div>
        }
      />
    );
  }
}

Section6.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  onDeleteImage: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onDeleteImage: (idBBGH, idImage, callback) =>
      dispatch(deleteImage(idBBGH, idImage, callback)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(withStyles(styles)(Section6));
