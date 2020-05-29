import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import { compose } from 'redux';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import MuiButton from 'components/MuiButton';
import { PATH_GATEWAY } from 'utils/request';
import Expansion from 'components/Expansion';
import saga from './saga';
import { synchronize, synchronizeTransaction } from './actions';
/* eslint-disable react/prefer-stateless-function */

class Synchronize extends React.Component {
  buttons = [
    {
      name: 'Đồng bộ giao dịch',
      path: `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/sap-synchronize`,
    },
    {
      name: 'Đồng bộ giao dịch tài sản',
      path: `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/sap-asset-synchronize`,
    },
    {
      name: 'Đồng bộ dữ liệu từ SAP',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/synchronize`,
    },
    {
      name: 'Đồng bộ bảng TransportationZone',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/transportation-zone-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Plant',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/plant-synchronize`,
    },
    {
      name: 'Đồng bộ bảng MaterialType',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/material-type-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Production order',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/production-order-synchronize`,
    },
    {
      name: 'Đồng bộ bảng MaterialGroup',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/material-group-synchronize`,
    },
    {
      name: 'Đồng bộ bảng MaterialStatus',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/material-status-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Zone',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/zone-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Product',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/product-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Supplier',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/supplier-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Transporter',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/transporter-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Lotcell',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/lotcell-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Bom',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/bom-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Pv',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/pv-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Grade',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/grade-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Locator',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/locator-synchronize`,
    },
    {
      name: 'Đồng bộ bảng UoM',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/uom-synchronize`,
    },
    {
      name: 'Đồng bộ bảng ProductExtend',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/product-extend-synchronize`,
    },
    {
      name: 'Đồng bộ bảng AltUoM',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/alt-uom-synchronize`,
    },
    {
      name: 'Đồng bộ bảng ProcurementType',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/procurement-type-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Customer',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/customer-synchronize`,
    },
    {
      name: 'Đồng bộ bảng MovementType',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/movement-type-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Source',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/source-synchronize`,
    },
    {
      name: 'Đồng bộ bảng OrderType',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/order-type-synchronize`,
    },
    {
      name: 'Đồng bộ bảng DistributionChannel',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/distribution-channel-synchronize`,
    },
    {
      name: 'Đồng bộ bảng RegulatedRecovery',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/regulated-recovery-rate-category-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Reason Order',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/reason-order-synchronize`,
    },
    {
      name: 'Đồng bộ bảng rejection reason',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/rejection-reason-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Product Mapping',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/product-mapping-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Price',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/price-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Sloc CC',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/sloc-cc-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Sale Price',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/sale-price-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Distribution Channel',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/distribution-channel-mapping-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Packing Style',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/packing-style-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Retail Type',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/retail-type-synchronize`,
    },
    {
      name: 'Đồng bộ bảng Havest Plan',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/havest-plan-synchronize`,
    },
    {
      name: 'Đồng bộ bảng AssetInventory',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/asset-inventory-synchronize`,
    },
    {
      name: 'Đồng bộ thay đổi bảng AssetInventory',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sap/asset-change-synchronize`,
    },
    {
      name: 'Đồng bộ bảng basket',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/sap/pallet-basket-synchronize`,
    },
  ];

  syncFC = [
    {
      name: 'Đồng bộ bảng Pv',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pv-async`,
    },
    {
      name: 'Đồng bộ bảng locator',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/locator-async`,
    },
    {
      name: 'Đồng bộ bảng Product',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/product-async`,
    },
    {
      name: 'Đồng bộ bảng Product Extend',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/product-extend-async`,
    },
    {
      name: 'Đồng bộ bảng Product Mapping',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/product-mapping-async`,
    },
    {
      name: 'Đồng bộ bảng Customer',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/customer-async`,
    },
    {
      name: 'Đồng bộ bảng Supplier',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/supplier-async`,
    },
    {
      name: 'Đồng bộ bảng Sloc CC',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sloc-cc-async`,
    },
    {
      name: 'Đồng bộ bảng Price',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/price-async`,
    },
    {
      name: 'Đồng bộ bảng Sale Price',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/sale-price-async`,
    },
    {
      name: 'Đồng bộ bảng Plant',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plant-async`,
    },
    {
      name: 'Đồng bộ bảng Harvest Plant',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/harvest-plant-async`,
    },
    {
      name: 'Đồng bộ bảng Production Order',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/production-order-async`,
    },
    {
      name: 'Đồng bộ bảng Grade',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/grade-async`,
    },
    {
      name: 'ĐỒNG BỘ BẢNG REGULATED RECOVERY',
      path: `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/regulated-recovery-rate-async`,
    },
    {
      name: 'Đồng bộ bảng BasketLocator',
      path: `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/basket-locator-synchronize`,
    },
    {
      name: 'Đồng bộ bảng PalletBasket',
      path: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-basket-async`,
    },
  ];

  synchronize = ev => {
    this.props.onSynchronize(ev.currentTarget.dataset.path);
  };

  render() {
    return (
      <Grid container spacing={24} style={{ padding: '24px 0px' }}>
        <Grid item md={6}>
          <Expansion
            title="Đồng Bộ SAP"
            content={
              <Grid container spacing={24} justify="center">
                {this.buttons.map(item => (
                  <Grid key={item.path} item md={9}>
                    <MuiButton
                      data-path={item.path}
                      fullWidth
                      onClick={this.synchronize}
                    >
                      {item.name}
                    </MuiButton>
                  </Grid>
                ))}
              </Grid>
            }
          />
        </Grid>
        <Grid item md={6}>
          <Expansion
            title="Đồng bộ FC (Resource Planning)"
            content={
              <Grid container spacing={24} justify="center">
                {this.syncFC.map(item => (
                  <Grid key={item.path} item md={9}>
                    <MuiButton
                      data-path={item.path}
                      fullWidth
                      onClick={this.synchronize}
                    >
                      {item.name}
                    </MuiButton>
                  </Grid>
                ))}
              </Grid>
            }
          />
        </Grid>
      </Grid>
    );
  }
}
Synchronize.propTypes = {
  onSynchronize: PropTypes.func,
};
export function mapDispatchToProps(dispatch) {
  return {
    onSynchronize: path => dispatch(synchronize(path)),
    onSynchronizeTransaction: () => dispatch(synchronizeTransaction()),
  };
}
const withConnect = connect(
  null,
  mapDispatchToProps,
);
const withSaga = injectSaga({ key: 'synchronize', saga });

export default compose(
  withSaga,
  withConnect,
)(Synchronize);
