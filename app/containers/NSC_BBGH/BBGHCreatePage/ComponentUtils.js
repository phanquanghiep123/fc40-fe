import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import MenuItem from '@material-ui/core/MenuItem';
// import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import AsyncSelect from 'react-select/lib/Async';
import { clone, debounce } from 'lodash';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectSuppliers,
  makeSelectLeadtimes,
  makeSelectVehicleRoutes,
} from './selectors';
import { getShipperAuto } from './actions';

const SelectList = ({
  suppliers,
  leadtimes,
  vehicleRoutes,
  column,
  value,
  onChange,
  onBlur,
  style,
}) => {
  let autoIncrease = 0;
  let options = [];
  // shipperName
  switch (column) {
    case 'shipperName':
      options = suppliers;
      break;
    case 'regulatedDepartureHour':
      options = leadtimes;
      break;
    case 'vehicleRouteTypeName':
      options = vehicleRoutes;
      break;
    default:
      break;
  }

  return (
    <Select
      value={value}
      onChange={e => onChange(e, suppliers, leadtimes, vehicleRoutes)}
      onBlur={onBlur}
      style={style}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
    >
      {options.map(option => option.label).map(item => {
        autoIncrease += 1;
        return (
          <MenuItem value={item} key={`${item}-${autoIncrease}`}>
            {item}
          </MenuItem>
        );
      })}
    </Select>
  );
};
SelectList.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  column: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  suppliers: PropTypes.array,
  leadtimes: PropTypes.array,
  vehicleRoutes: PropTypes.array,
};

const SelectAuto = ({
  style,
  value,
  onChange,
  onGetShipperAuto,
  formik,
  onRef,
}) => (
  <AsyncSelect
    styles={style}
    onChange={option => {
      const { shipperList } = formik.values;
      const shippers = shipperList.map(shipper => {
        const ship = clone(shipper);
        ship.driver = option.label;
        ship.phone = option.value.phone;
        ship.drivingPlate = option.value.drivingPlate;
        ship.vehicleWeight = option.value.vehicleWeight;

        return ship;
      });

      // update schema
      formik.setFieldValue('shipperList', shippers);
    }} // changeShipper
    value={value}
    cacheOptions
    // defaultOptions
    placeholder="Nhập lái xe"
    loadOptions={debounce(onGetShipperAuto, 500)}
    onBlur={onChange}
    // onInputChange={onChange}
    noOptionsMessage={() => 'Không có kết quả'}
    loadingMessage={() => 'Đang tìm kiếm...'}
    maxMenuHeight={150}
    ref={onRef}
  />
);

SelectAuto.propTypes = {
  style: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  onGetShipperAuto: PropTypes.func,
  formik: PropTypes.object,
  onRef: PropTypes.any,
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
  vehicleRoutes: makeSelectVehicleRoutes(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export const SelectAsyncWrapper = compose(withConnect)(SelectAuto);

export const SelectListWrapper = compose(withConnect)(
  withImmutablePropsToJS(SelectList),
);

export class TextFieldTime extends React.Component {
  state = {};

  render() {
    const { style, value, onChange, onBlur } = this.props;

    return (
      <input
        type="time"
        style={{
          width: style.width,
          height: style.height,
        }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        margin="dense"
        min="00:00"
        max="23:59"
      />
    );
  }
}

TextFieldTime.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
};
