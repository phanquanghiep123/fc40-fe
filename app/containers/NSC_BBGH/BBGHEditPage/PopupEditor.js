import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clone, isArray } from 'lodash';
import TimeInput from 'react-time-input';

import { caculateShipingTime } from '../BBGHCreatePage/section6Utils';
import { SelectListWrapper, SelectAsyncWrapper } from './ComponentUtils';

export default class PopupEditor extends Component {
  componentDidMount = () => this.focus();

  input = React.createRef();

  state = { value: this.props.value };

  getValue = () => this.state.value;

  isPopup = () => true;

  /**
   * @param {value: string}
   * @param {columnDefs: string} field name column
   * @param {formik: object}
   * @param {leadtimes: array}
   * @param {suppliers: array}
   */
  updateColumn = (
    value,
    columnDefs,
    formik,
    suppliers = [],
    leadtimes = [],
    vehicleRoutes = [],
    reasons = [],
    vehiclePallets = [],
    temperatureStatus = [],
    chipTemperatureStatus = [],
    shippingLeadtime = [],
    vehicleCleaning = [],
  ) => {
    const { shipperList } = formik.values;
    const shippers = shipperList.map(shipper => {
      const ship = clone(shipper);
      switch (columnDefs) {
        case 'actualDepartureHour':
          ship.actualDepartureHour = value;
          break;
        case 'deliveryTime':
          ship.deliveryTime = value;
          break;
        case 'actualArrivalHour':
          ship.actualArrivalHour = value;
          break;
        case 'drivingDuration':
          ship.drivingDuration = Number.parseFloat(value);
          break;
        case 'regulatedDepartureHour': {
          ship.regulatedDepartureHour = value;
          // free input time
          if (leadtimes.length) {
            ship.drivingDuration = leadtimes.filter(
              leadtime => leadtime.label === value,
            )[0].value;
          }

          break;
        }
        case 'shipperName': {
          if (value) {
            ship.shipper = suppliers.filter(
              supplier => supplier.label === value,
            )[0].value;
          }

          // display on table
          ship.shipperName = value;
          return ship;
        }
        case 'vehicleRouteTypeName': {
          if (value) {
            const valueOption = vehicleRoutes.filter(
              route => route.label === value,
            )[0].value;
            ship.vehicleRouteType = valueOption.id;
            ship.minStandardTemperature = valueOption.minStandardTemperature;
            ship.maxStandardTemperature = valueOption.maxStandardTemperature;
            // Loại xe tuyến: 1 là xe bạt, 5 là xe thùng
            if (valueOption.id === 1 || valueOption.id === 5) {
              ship.actualTemperature = '';
            }
          }
          // display on table
          ship.vehicleRouteTypeName = value;
          return ship;
        }
        case 'reasonName': {
          if (value) {
            const valueOption = reasons.filter(
              route => route.label === value,
            )[0].value;
            ship.reason = valueOption;
          }

          // display on table
          ship.reasonName = value;
          return ship;
        }

        case 'vehiclePalletName': {
          if (value) {
            const valueOption = vehiclePallets.filter(
              route => route.label === value,
            )[0].value;
            ship.vehiclePallet = valueOption;
          }

          // display on table
          ship.vehiclePalletName = value;
          return ship;
        }

        case 'temperatureStatusName': {
          if (value) {
            const valueOption = temperatureStatus.filter(
              route => route.label === value,
            )[0].value;
            ship.temperatureStatus = valueOption;
          }

          // display on table
          ship.temperatureStatusName = value;
          return ship;
        }

        case 'chipTemperatureStatusName': {
          if (value) {
            const valueOption = chipTemperatureStatus.filter(
              route => route.label === value,
            )[0].value;
            ship.chipTemperatureStatus = valueOption;
          }

          // display on table
          ship.chipTemperatureStatusName = value;
          return ship;
        }
        case 'vehicleCleaningName': {
          if (value) {
            const valueOption = vehicleCleaning.filter(
              route => route.label === value,
            )[0].value;
            ship.vehicleCleaning = valueOption;
          }

          // display on table
          ship.vehicleCleaningName = value;
          return ship;
        }

        case 'shippingLeadtimeName': {
          if (value) {
            const valueOption = shippingLeadtime.filter(
              route => route.label === value,
            )[0].value;
            ship.shippingLeadtime = valueOption;
          }

          // display on table
          ship.shippingLeadtimeName = value;
          return ship;
        }
        default:
          ship[columnDefs] = value;
          break;
      }

      return caculateShipingTime(ship);
    });

    // update schema
    formik.setFieldValue('shipperList', shippers);
  };

  onChange = (
    e,
    suppliers,
    leadtimes,
    vehicleRoutes,
    reasons,
    vehiclePallets,
    temperatureStatus,
    chipTemperatureStatus,
    shippingLeadtime,
    vehicleCleaning,
  ) => {
    const { context, colDef, data } = this.props;
    let value = e.target ? e.target.value : e;
    if (
      e.target &&
      e.target.getAttribute &&
      e.target.getAttribute('data-type') === 'number'
    ) {
      value = Number.parseFloat(value);
    }

    if (
      isArray(suppliers) ||
      isArray(leadtimes) ||
      isArray(vehicleRoutes) ||
      isArray(reasons) ||
      isArray(vehiclePallets) ||
      isArray(temperatureStatus) ||
      isArray(chipTemperatureStatus) ||
      isArray(shippingLeadtime) ||
      isArray(vehicleCleaning) ||
      colDef.field === 'actualDepartureHour' ||
      colDef.field === 'deliveryTime' ||
      colDef.field === 'actualArrivalHour' ||
      (colDef.field === 'regulatedDepartureHour' && data.unregulatedLeadtime)
      // colDef.field === 'drivingDuration'
    ) {
      this.updateColumn(
        value,
        colDef.field,
        context.props.formik,
        suppliers,
        leadtimes,
        vehicleRoutes,
        reasons,
        vehiclePallets,
        temperatureStatus,
        chipTemperatureStatus,
        shippingLeadtime,
        vehicleCleaning,
      );
    }

    this.setState({ value });
  };

  onBlur = e => {
    const { context, colDef } = this.props;
    const value = e.target ? e.target.value : e;
    this.updateColumn(
      value,
      colDef.field,
      context.props.formik,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    );
  };

  focus = () =>
    setTimeout(
      () => this.input && this.input.current && this.input.current.focus(),
    );

  render() {
    const { data, eGridCell, colDef, context } = this.props;

    const editorWidth = eGridCell.clientWidth;
    const editorHeight = eGridCell.clientHeight;
    const style = {
      boxSizing: 'border-box',
      width: `${editorWidth}px`,
      height: `${editorHeight}px`,
      textAlign: 'center',
    };

    if (
      (colDef.field === 'regulatedDepartureHour' && data.unregulatedLeadtime) ||
      colDef.field === 'actualDepartureHour' ||
      colDef.field === 'deliveryTime' ||
      colDef.field === 'actualArrivalHour'
    ) {
      return (
        <TimeInput
          mountFocus="true"
          initTime={this.state.value}
          onTimeChange={this.onChange}
          placeholder="--:--"
        />
      );
    }
    if (
      (colDef.field === 'regulatedDepartureHour' &&
        !data.unregulatedLeadtime) ||
      colDef.field === 'shipperName' ||
      colDef.field === 'vehicleRouteTypeName' ||
      colDef.field === 'reasonName' ||
      colDef.field === 'vehiclePalletName' ||
      colDef.field === 'temperatureStatusName' ||
      colDef.field === 'chipTemperatureStatusName' ||
      colDef.field === 'vehicleCleaningName' ||
      colDef.field === 'shippingLeadtimeName'
    ) {
      return (
        <SelectListWrapper
          value={this.state.value}
          onChange={this.onChange}
          style={style}
          column={colDef.field}
        />
      );
    }

    if (colDef.field === 'driver') {
      return (
        <div style={{ width: `${editorWidth * 1.5}px` }}>
          <SelectAsyncWrapper
            value={this.state.value}
            onChange={this.onChange}
            formik={context.props.formik}
            onRef={this.input}
          />
        </div>
      );
    }

    const type =
      colDef.field === 'vehicleNumbering' ||
      colDef.field === 'drivingDuration' ||
      colDef.field === 'minStandardTemperature' ||
      colDef.field === 'maxStandardTemperature'
        ? 'number'
        : 'text';

    return (
      <input
        data-type={type}
        ref={this.input}
        type={type}
        value={this.state.value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        style={style}
      />
    );
  }
}

PopupEditor.propTypes = {
  eGridCell: PropTypes.object,
  // charPress: PropTypes.any,
  value: PropTypes.any,
  colDef: PropTypes.any,
  data: PropTypes.any,
  context: PropTypes.object,
};
