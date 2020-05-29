/* eslint-disable indent */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormData from '../../../../components/FormikUI/FormData';
import {
  makeBasketsInfoColumnDefs,
  makeBasketsInfoDefaultColDef,
} from './columnDefs';
import Expansion from '../../../../components/Expansion';
import appTheme from '../../../App/theme';
import { BASKET_INFO_TABLE } from '../constants';

const style = (theme = appTheme) => ({
  addBtn: {
    minWidth: 'unset',
    width: 35,
    marginRight: '0.5rem',
    color: theme.palette.primary.main,
    background: '#fff',
  },
});

class BasketInfoTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoColumnDefs: makeBasketsInfoColumnDefs(),
      infoDefaultColDef: makeBasketsInfoDefaultColDef(),
    };
  }

  render() {
    const { formik, pageType } = this.props;

    return pageType.create || pageType.edit ? (
      <div style={{ marginBottom: '1rem' }}>
        <Expansion
          title="II. THÔNG TIN KHAY SỌT SỬ DỤNG - SỞ HỮU"
          content={
            <FormData
              name={BASKET_INFO_TABLE}
              idGrid={BASKET_INFO_TABLE}
              gridStyle={{ height: 'auto' }}
              gridProps={{
                context: this,
                domLayout: 'autoHeight',
              }}
              rowData={formik.values[BASKET_INFO_TABLE]}
              columnDefs={this.state.infoColumnDefs}
              defaultColDef={this.state.infoDefaultColDef}
              {...formik} // pass formik props into agGrid
            />
          }
        />
      </div>
    ) : null;
  }
}

BasketInfoTable.propTypes = {
  formik: PropTypes.object,
  pageType: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(BasketInfoTable);
