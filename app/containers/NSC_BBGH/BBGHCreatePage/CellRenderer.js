import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

// functional CellRenderer does not work correctly
export default class CellRenderer extends PureComponent {
  render() {
    const { error, touched, value } = this.props;
    const isError = touched && error;

    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {this.props.colDef.field === 'unregulatedLeadtime' ? (
            <Checkbox
              style={{ padding: 0 }}
              checked={value}
              onChange={() => {
                const { context } = this.props;
                const { formik } = context.props;
                const newShipper = formik.values.shipperList.slice();
                newShipper[0].regulatedDepartureHour = '';
                newShipper[0].actualDepartureHour = '';
                newShipper[0].drivingDuration = '';
                newShipper[0].regulatedArrivalHour = '';
                newShipper[0].plannedArrivalHour = '';
                formik.setFieldValue('shipperList', newShipper);

                this.props.setValue(!value);
              }}
              value={value.toString()}
              color="primary"
            />
          ) : (
            <div title={value}>{value}</div>
          )}
          {isError && (
            <div
              style={{
                color: 'red',
                marginLeft: 0,
                borderBottom: '2px red solid',
                paddingBottom: '10px',
              }}
            >
              <small>{error}</small>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

CellRenderer.propTypes = {
  // fieldName: PropTypes.any,
  error: PropTypes.string,
  touched: PropTypes.any,
  value: PropTypes.any,
  colDef: PropTypes.object,
  setValue: PropTypes.func,
  context: PropTypes.object,
};
