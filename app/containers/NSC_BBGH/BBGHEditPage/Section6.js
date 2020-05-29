import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

import FormData from 'components/FormikUI/FormData';
import PopupEditor from './PopupEditor';
import CellRenderer from './CellRenderer';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';
import {
  makeSelectSuppliers,
  makeSelectLeadtimes,
  makeSelectReasons,
} from './selectors';
import { getShipperAuto } from './actions';
// import { caculateShipingTime } from '../BBGHCreatePage/section6Utils';
import {
  columnDefsDeliver,
  columnDefsReciver,
  columnDefsDeliverNotEdit,
  columnDefsDeliverLoanPay,
  columnDefsReciverLoanPay,
} from '../BBGHCreatePage/header';
import { STATUS_RECIVE, TYPE_USER_EDIT, TYPE_NCC_TO_NSC } from './constants';
import { viewBasketSection } from '../BBGHCreatePage/basketLogicFunction';

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
});

export class Section6 extends React.Component {
  state = {
    tabs: 0,
  };

  changeTabs = (event, value) => {
    this.setState({ tabs: value });
  };

  isEdit = () => {
    const { formik } = this.props;
    return (
      formik.values.status !== STATUS_RECIVE.RECIVE && // chua tiep nhan
      [TYPE_USER_EDIT.DELIVER, TYPE_USER_EDIT.DELIVER_AND_RECIVER].includes(
        formik.values.deliverOrReceiver,
      ) && // la nguoi giao
      formik.values.doType !== TYPE_NCC_TO_NSC.TYPE // khong phai QLNH
    );
  };

  render() {
    const { classes, formik } = this.props;
    const { tabs } = this.state;
    const isEdit = this.isEdit();
    const gridStyle = { height: 'auto' };
    const gridProps = { context: this, domLayout: 'autoHeight' };
    return (
      <Expansion
        title={`${
          viewBasketSection(formik.values.doType) ? 'VI' : 'V'
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
            {tabs === 0 &&
              (isEdit ? (
                <FormData
                  idGrid="grid-section6-edit-1"
                  name="shipperList"
                  gridStyle={gridStyle}
                  gridProps={gridProps}
                  columnDefs={
                    formik.values.doType ===
                    TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                      ? columnDefsDeliverLoanPay
                      : columnDefsDeliver
                  }
                  popupEditor={PopupEditor}
                  cellRenderer={CellRenderer}
                  ignoreSuppressColumns={['driver', 'drivingDuration']}
                  {...formik}
                />
              ) : (
                <FormData
                  idGrid="grid-section6-edit-1"
                  name="shipperList"
                  gridStyle={gridStyle}
                  gridProps={gridProps}
                  columnDefs={columnDefsDeliverNotEdit}
                  cellRenderer={CellRenderer}
                  {...formik}
                />
              ))}
            {tabs === 1 && (
              <FormData
                idGrid="grid-section61"
                name="shipperList"
                gridStyle={gridStyle}
                gridProps={gridProps}
                popupEditor={PopupEditor}
                columnDefs={
                  formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                    ? columnDefsReciverLoanPay
                    : columnDefsReciver
                }
                cellRenderer={CellRenderer}
                {...formik}
              />
            )}
          </div>
        }
      />
    );
  }
}

Section6.propTypes = {
  classes: PropTypes.object,
  suppliers: PropTypes.array,
  leadtimes: PropTypes.array,
  reasons: PropTypes.array,
  formik: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetShipperAuto: (inputText, callback) =>
      dispatch(getShipperAuto(inputText, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  suppliers: makeSelectSuppliers(),
  leadtimes: makeSelectLeadtimes(),
  reasons: makeSelectReasons(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withImmutablePropsToJS(withStyles(styles)(Section6)),
);
